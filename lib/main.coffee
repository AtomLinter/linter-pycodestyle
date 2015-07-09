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

  provideLinter: ->
    helpers = require('atom-linter')
    provider =
      grammarScopes: ['source.python']
      scope: 'file' # or 'project'
      lintOnFly: false # must be false for scope: 'project'
      lint: (textEditor)->
        parameters = []
        if maxLineLength = atom.config.get('linter-pep8.maxLineLength')
          parameters.push("--max-line-length=#{maxLineLength}")
        if ignoreCodes = atom.config.get('linter-pep8.ignoreErrorCodes')
          parameters.push("--ignore=#{ignoreCodes.join(',')}")
        return helpers.exec(atom.config.get('linter-pep8.pep8ExecutablePath'), parameters).then (result) ->
          console.log(result)
          return []