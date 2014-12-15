module.exports =
  config:
    pep8ExecutablePath:
      type: 'string'
      default: 'pep8'
    maxLineLength:
      type: 'integer'
      default: 79
    ignoreErrorCodes:
      type: 'array'
      default: []
      description: 'For a list of code visit http://pep8.readthedocs.org/en/latest/intro.html#error-codes'

  activate: ->
    console.log 'activate linter-pep8'
