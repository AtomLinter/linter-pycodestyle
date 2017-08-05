'use babel';

import { join } from 'path';
// eslint-disable-next-line no-unused-vars
import { it, fit, wait, beforeEach, afterEach } from 'jasmine-fix';

const fixturePath = join(__dirname, 'fixtures');
const goodPath = join(fixturePath, 'good.py');
const badPath = join(fixturePath, 'bad.py');
const emptyPath = join(fixturePath, 'empty.py');

describe('The pycodestyle provider for Linter', () => {
  const lint = require('../lib/main.coffee').provideLinter().lint;

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
      expect(messages[0].type).toBe('Warning');
      expect(messages[0].html).not.toBeDefined();
      expect(messages[0].text).toBe(' E401 multiple imports on one line');
      expect(messages[0].filePath).toBe(badPath);
      expect(messages[0].range).toEqual([[0, 9], [0, 10]]);
    });
  });

  it('finds nothing wrong with a valid file', async () => {
    const editor = await atom.workspace.open(goodPath);
    const messages = await lint(editor);
    expect(messages.length).toBe(0);
  });

});
