/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let helpers = null;
let path = null;

// This function is from: https://atom.io/packages/linter-pylint
const getProjectDir = (filePath) => {
  if (path == null) { path = require('path'); }
  const atomProject = atom.project.relativizePath(filePath)[0];
  if (atomProject === null) {
    // Default project dirextory to file directory if path cannot be determined
    return path.dirname(filePath);
  }
  return atomProject;
};

module.exports = {
  config: {
    executablePath: {
      type: 'string',
      default: 'pycodestyle',
    },
    maxLineLength: {
      type: 'integer',
      default: 0,
    },
    ignoreErrorCodes: {
      type: 'array',
      default: [],
      description: 'For a list of code visit http://pycodestyle.readthedocs.org/en/latest/intro.html#error-codes',
    },
    convertAllErrorsToWarnings: {
      type: 'boolean',
      default: true,
    },
  },

  activate() {
    require('atom-package-deps').install('linter-pycodestyle');
  },

  provideLinter() {
    return {
      name: 'pycodestyle',
      grammarScopes: ['source.python', 'source.python.django'],
      scope: 'file', // or 'project'
      lintOnFly: true, // must be false for scope: 'project'
      lint(textEditor) {
        if (helpers == null) { helpers = require('atom-linter'); }
        const filePath = textEditor.getPath();
        const parameters = [];
        const maxLineLength = atom.config.get('linter-pycodestyle.maxLineLength');
        if (maxLineLength) {
          parameters.push(`--max-line-length=${maxLineLength}`);
        }
        const ignoreCodes = atom.config.get('linter-pycodestyle.ignoreErrorCodes');
        if (ignoreCodes) {
          parameters.push(`--ignore=${ignoreCodes.join(',')}`);
        }
        parameters.push('-');
        const msgtype = atom.config.get('linter-pycodestyle.convertAllErrorsToWarnings') ? 'Warning' : 'Error';
        const execOpts = {
          cwd: getProjectDir(filePath),
          env: process.env,
          stdin: textEditor.getText(),
          ignoreExitCode: true,
        };
        return helpers.exec(atom.config.get('linter-pycodestyle.executablePath'), parameters, execOpts).then((result) => {
          const toReturn = [];
          const regex = /stdin:(\d+):(\d+):(.*)/g;
          let match = regex.exec(result);
          while (match !== null) {
            const line = Number.parseInt(match[1], 10) || 0;
            const col = Number.parseInt(match[2], 10) || 0;
            toReturn.push({
              type: msgtype,
              text: match[3],
              filePath,
              range: [[line - 1, col - 1], [line - 1, col]],
            });
            match = regex.exec(result);
          }
          return toReturn;
        });
      },
    };
  },
};
