linterPath = atom.packages.getLoadedPackage("linter").path
Linter = require "#{linterPath}/lib/linter"

class LinterPep8 extends Linter
  # The syntax that the linter handles. May be a string or
  # list/tuple of strings. Names should be all lowercase.
  @syntax: 'source.python'

  # A string, list, tuple or callable that returns a string, list or tuple,
  # containing the command line (with arguments) used to lint.
  cmd: 'pep8'

  executablePath: null

  linterName: 'pep8'

  # A regex pattern used to extract information from the executable's output.
  # regex: "models.py:18:80: E501 line too long (250 > 79 characters)"
  regex: ':(?<line>\\d+):(?<col>\\d+): ((?<error>E\\d+)|(?<warning>W\\d+)) (?<message>.*?)\n'

  constructor: (editor)->
    super(editor)
    @executablePath = atom.config.get 'linter-pep8.pep8ExecutablePath'

    atom.config.observe 'linter-pep8.maxLineLength', =>
      @updateCommand()

    atom.config.observe 'linter-pep8.ignoreErrorCodes', =>
      @updateCommand()

  destroy: ->
    atom.config.unobserve 'linter-pep8.maxLineLength'
    atom.config.unobserve 'linter-pep8.ignoreErrorCodes'

  updateCommand: ->
    maxLineLength = atom.config.get 'linter-pep8.maxLineLength'

    cmd = 'pep8'

    if maxLineLength
      cmd = "#{cmd} --max-line-length=#{maxLineLength}"


    errorCodes = atom.config.get 'linter-pep8.ignoreErrorCodes'

    if errorCodes and errorCodes.length > 0
      cmd = "#{cmd} --ignore=#{errorCodes.toString()}"

    @cmd = cmd

  formatMessage: (match) ->
    code = match.error ? match.warning
    "#{code} #{match.message}"

module.exports = LinterPep8
