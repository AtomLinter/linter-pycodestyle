'use babel';

// eslint-disable-next-line import/no-extraneous-dependencies, import/extensions
import { CompositeDisposable } from 'atom';

// Dependencies
let helpers;
let path;
// Internal variables
let maxLineLength;
let ignoreCodes;
let convertAllErrorsToWarnings;
let executablePath;

// This function is from: https://atom.io/packages/linter-pylint
const getProjectDir = (filePath) => {
  if (!path) {
    path = require('path');
  }
  const atomProject = atom.project.relativizePath(filePath)[0];
  if (atomProject === null) {
    // Default project directory to file directory if path cannot be determined
    return path.dirname(filePath);
  }
  return atomProject;
};

module.exports = {
  activate() {
    require('atom-package-deps').install('linter-pycodestyle');

    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(
      atom.config.observe('linter-pycodestyle.maxLineLength', (value) => {
        maxLineLength = value;
      }),
      atom.config.observe('linter-pycodestyle.ignoreErrorCodes', (value) => {
        ignoreCodes = value;
      }),
      atom.config.observe('linter-pycodestyle.convertAllErrorsToWarnings', (value) => {
        convertAllErrorsToWarnings = value;
      }),
      atom.config.observe('linter-pycodestyle.executablePath', (value) => {
        executablePath = value;
      }),
    );
  },

  provideLinter() {
    return {
      name: 'pycodestyle',
      grammarScopes: ['source.python', 'source.python.django'],
      scope: 'file',
      lintOnFly: true,
      async lint(textEditor) {
        if (!helpers) {
          helpers = require('atom-linter');
        }
        const filePath = textEditor.getPath();
        const parameters = [];
        if (maxLineLength) {
          parameters.push(`--max-line-length=${maxLineLength}`);
        }
        if (ignoreCodes) {
          parameters.push(`--ignore=${ignoreCodes.join(',')}`);
        }
        parameters.push('-');
        const msgtype = convertAllErrorsToWarnings ? 'Warning' : 'Error';
        const execOpts = {
          cwd: getProjectDir(filePath),
          env: process.env,
          stdin: textEditor.getText(),
          ignoreExitCode: true,
        };
        const results = await helpers.exec(executablePath, parameters, execOpts);
        const toReturn = [];
        const regex = /stdin:(\d+):(\d+):(.*)/g;
        let match = regex.exec(results);
        while (match !== null) {
          const line = Number.parseInt(match[1], 10) || 0;
          const col = Number.parseInt(match[2], 10) || 0;
          toReturn.push({
            type: msgtype,
            text: match[3],
            filePath,
            range: [[line - 1, col - 1], [line - 1, col]],
          });
          match = regex.exec(results);
        }
        return toReturn;
      },
    };
  },
};
