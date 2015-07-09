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
    provider =
      grammarScopes: ['source.python']
      scope: 'file' # or 'project'
      lintOnFly: false # must be false for scope: 'project'
      lint: (textEditor)->
        return new Promise (resolve, reject)->
          message = {type: 'Error', text: 'Something went wrong', range:[[0,0], [0,1]]}
          resolve([message])