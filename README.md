# linter-pycodestyle

[![Greenkeeper badge](https://badges.greenkeeper.io/AtomLinter/linter-pycodestyle.svg)](https://greenkeeper.io/)

This linter plugin for [Linter](https://github.com/AtomLinter/Linter) provides
an interface to [pycodestyle](https://pypi.python.org/pypi/pycodestyle). It will be used
with Python files.

## Installation

Linter package must be installed in order to use this plugin. If Linter is not
installed, please follow the instructions [here](https://github.com/AtomLinter/Linter).

### pycodestyle installation

Before using this plugin, you must ensure that `pycodestyle` is installed on your
system. To install `pycodestyle`, do the following:

Install [pycodestyle](https://pypi.python.org/pypi/pycodestyle) by typing the following in a
terminal:

```ShellSession
pip install pycodestyle
```

Now you can proceed to install the linter-pycodestyle plugin.

### Plugin installation

```ShellSession
 apm install linter-pycodestyle
```

## Settings

You can configure linter-pycodestyle from the settings menu:

*   **executablePath** Path to your pycodestyle executable. This is useful if you
    have different versions of pycodestyle for Python 2 and 3 or if you are using a
    virtualenv

*   **maxLineLength** The max line length for your python code, defaults to 79

*   **ignoreErrorCodes** A list of pycodestyle error codes to ignore. For a list of
    code visit <http://pycodestyle.readthedocs.org/en/latest/intro.html#error-codes>

    Example: To ignore `W191` and `E501` you would enter something like this:

    ```coffeescript
    W191, E501
    ```
