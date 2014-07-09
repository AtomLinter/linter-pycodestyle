module.exports =
  configDefaults:
    pep8ExecutablePath: null
    maxLineLength: 79
    ignoreErrorCodes: []

  activate: ->
    console.log 'activate linter-pep8'
