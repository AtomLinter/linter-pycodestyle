# linter-pep8

This linter plugin for [Linter](https://github.com/AtomLinter/Linter) provides
an interface to [pep8](https://pypi.python.org/pypi/pep8). It will be used
with Python files.

## Installation

Linter package must be installed in order to use this plugin. If Linter is not
installed, please follow the instructions [here](https://github.com/AtomLinter/Linter).

### pep8 installation

Before using this plugin, you must ensure that `pep8` is installed on your
system. To install `pep8`, do the following:

Install [pep8](https://pypi.python.org/pypi/pep8) by typing the following in a
terminal:

```ShellSession
pip install pep8
```

Now you can proceed to install the linter-pep8 plugin.

### Plugin installation

```ShellSession
 apm install linter-pep8
```

## Settings

You can configure linter-pep8 from the settings menu:

*   **pep8ExecutablePath** Path to your pep8 executable. This is useful if you
    have different versions of pylint for Python 2 and 3 or if you are using a
    virtualenv

*   **maxLineLength** The max line length for your python code, defaults to 79

*   **ignoreErrorCodes** A list of pep8 error codes to ignore. For a list of
    code visit <http://pep8.readthedocs.org/en/latest/intro.html#error-codes>

    Example: To ignore `W191` and `E501` you would enter something like this:

    ```coffeescript
    W191, E501
    ```
