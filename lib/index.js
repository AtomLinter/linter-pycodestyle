'use babel';

// eslint-disable-next-line import/no-extraneous-dependencies, import/extensions
import { CompositeDisposable } from 'atom';

// Dependencies
let helpers;
let path;

// This function is from: https://atom.io/packages/linter-pylint
const getProjectDir = (filePath) => {
  const atomProject = atom.project.relativizePath(filePath)[0];
  if (atomProject === null) {
    // Default project directory to file directory if path cannot be determined
    return path.dirname(filePath);
  }
  return atomProject;
};

const loadDeps = () => {
  if (!helpers) {
    helpers = require('atom-linter');
  }
  if (!path) {
    path = require('path');
  }
};

module.exports = {
  activate() {
    this.idleCallbacks = new Set();
    let depsCallbackID;
    const installLinterJSHintDeps = () => {
      this.idleCallbacks.delete(depsCallbackID);
      if (!atom.inSpecMode()) {
        require('atom-package-deps').install('linter-pycodestyle');
      }
      loadDeps();
    };
    depsCallbackID = window.requestIdleCallback(installLinterJSHintDeps);
    this.idleCallbacks.add(depsCallbackID);

    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(
      atom.config.observe('linter-pycodestyle.maxLineLength', (value) => {
        this.maxLineLength = value;
      }),
      atom.config.observe('linter-pycodestyle.ignoreErrorCodes', (value) => {
        this.ignoreCodes = value;
      }),
      atom.config.observe('linter-pycodestyle.convertAllErrorsToWarnings', (value) => {
        this.convertAllErrorsToWarnings = value;
      }),
      atom.config.observe('linter-pycodestyle.executablePath', (value) => {
        this.executablePath = value;
      }),
    );
  },

  deactivate() {
    this.idleCallbacks.forEach(callbackID => window.cancelIdleCallback(callbackID));
    this.idleCallbacks.clear();
    this.subscriptions.dispose();
  },

  provideLinter() {
    return {
      name: 'pycodestyle',
      grammarScopes: ['source.python', 'source.python.django'],
      scope: 'file',
      lintOnFly: true,
      lint: async (textEditor) => {
        const filePath = textEditor.getPath();
        const fileContents = textEditor.getText();

        const parameters = [];
        if (this.maxLineLength) {
          parameters.push(`--max-line-length=${this.maxLineLength}`);
        }
        if (this.ignoreCodes) {
          parameters.push(`--ignore=${this.ignoreCodes.join(',')}`);
        }
        parameters.push('-');

        loadDeps();

        const execOpts = {
          cwd: getProjectDir(filePath),
          env: process.env,
          stdin: fileContents,
          ignoreExitCode: true,
        };

        const results = await helpers.exec(this.executablePath, parameters, execOpts);

        if (textEditor.getText() !== fileContents) {
          // File has changed since the lint was triggered, tell Linter not to update
          return null;
        }

        const toReturn = [];
        const regex = /stdin:(\d+):(\d+):(.*)/g;
        const msgtype = this.convertAllErrorsToWarnings ? 'Warning' : 'Error';

        let match = regex.exec(results);
        while (match !== null) {
          const line = Number.parseInt(match[1], 10) - 1 || 0;
          const col = Number.parseInt(match[2], 10) - 1 || 0;
          toReturn.push({
            type: msgtype,
            text: match[3],
            filePath,
            range: helpers.generateRange(textEditor, line, col),
          });
          match = regex.exec(results);
        }
        return toReturn;
      },
    };
  },
};
