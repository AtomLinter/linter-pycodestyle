'use babel';

import { join } from 'path';
// eslint-disable-next-line no-unused-vars
import { it, fit, wait, beforeEach, afterEach } from 'jasmine-fix';

const fixturePath = join(__dirname, 'fixtures');
const goodPath = join(fixturePath, 'good.py');
const badPath = join(fixturePath, 'bad.py');

describe('The pycodestyle provider for Linter', () => {
  const lint = require('../lib/').provideLinter().lint;

  beforeEach(async () => {
    // Info about this beforeEach() implementation:
    // https://github.com/AtomLinter/Meta/issues/15
    const activationPromise = atom.packages.activatePackage('linter-pycodestyle');

    await atom.packages.activatePackage('language-python');

    atom.packages.triggerDeferredActivationHooks();
    await activationPromise;
  });

  it('should be in the packages list', () =>
    expect(atom.packages.isPackageLoaded('linter-pycodestyle')).toBe(true),
  );

  it('should be an active package', () =>
    expect(atom.packages.isPackageActive('linter-pycodestyle')).toBe(true),
  );

  describe('checks bad.py and', () => {
    let editor = null;
    beforeEach(async () => {
      editor = await atom.workspace.open(badPath);
    });

    it('verifies that message', async () => {
      const messages = await lint(editor);
      expect(messages[0].severity).toBe('warning');
      expect(messages[0].excerpt).toBe('E401 multiple imports on one line');
      expect(messages[0].location.file).toBe(badPath);
      expect(messages[0].location.position).toEqual([[0, 9], [0, 15]]);
    });
  });

  it('finds nothing wrong with a valid file', async () => {
    const editor = await atom.workspace.open(goodPath);
    const messages = await lint(editor);
    expect(messages.length).toBe(0);
  });

  describe('executable path', () => {
    const helpers = require('atom-linter');

    let editor = null;

    beforeEach(async () => {
      atom.project.addPath(fixturePath);

      spyOn(helpers, 'exec');

      editor = await atom.workspace.open(badPath);
    });

    it('finds executable relative to project', async () => {
      atom.config.set('linter-pycodestyle.executablePath', join('$PROJECT', 'pycodestyle'));
      await lint(editor);
      expect(helpers.exec.mostRecentCall.args[0]).toBe(join(fixturePath, 'pycodestyle'));
    });

    it('finds executable relative to projects', async () => {
      const paths = [
        join('$project', 'null'),
        join('$pRoJeCt', 'pycodestyle1'),
        join('$PrOjEcT', 'pycodestyle2'),
        join('$PROJECT', 'pycodestyle'),
      ].join(';');
      atom.config.set('linter-pycodestyle.executablePath', paths);
      await lint(editor);
      expect(helpers.exec.mostRecentCall.args[0]).toBe(join(fixturePath, 'pycodestyle'));
    });

    it('finds executable using project name', async () => {
      atom.config.set('linter-pycodestyle.executablePath', join('$PROJECT_NAME', 'pycodestyle'));
      await lint(editor);
      expect(helpers.exec.mostRecentCall.args[0]).toBe(join('fixtures', 'pycodestyle'));
    });

    it('finds executable using project names', async () => {
      const paths = [
        join('$project_name', 'null'),
        join('$pRoJeCt_NaMe', 'flake1'),
        join('$PrOjEcT_nAmE', 'flake2'),
        join('$PROJECT_NAME', 'pycodestyle'),
      ].join(';');
      const correct = [
        join('fixtures', 'null'),
        join('fixtures', 'flake1'),
        join('fixtures', 'flake2'),
        join('fixtures', 'pycodestyle'),
      ].join(';');
      atom.config.set('linter-pycodestyle.executablePath', paths);
      await lint(editor);
      expect(helpers.exec.mostRecentCall.args[0]).toBe(correct);
    });

    it('normalizes executable path', async () => {
      atom.config.set('linter-pycodestyle.executablePath',
        join(fixturePath, '..', 'fixtures', 'pycodestyle'),
      );
      await lint(editor);
      expect(helpers.exec.mostRecentCall.args[0]).toBe(join(fixturePath, 'pycodestyle'));
    });

    it('finds backup executable', async () => {
      const pycodestyleNotFound = join('$PROJECT', 'pycodestyle_notfound');
      const pycodestyleBackup = join(fixturePath, 'pycodestyle_backup');
      atom.config.set('linter-pycodestyle.executablePath',
        `${pycodestyleNotFound};${pycodestyleBackup}`,
      );
      await lint(editor);
      expect(helpers.exec.mostRecentCall.args[0]).toBe(join(fixturePath, 'pycodestyle_backup'));
    });
  });
});
