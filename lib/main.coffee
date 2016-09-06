helpers = null

module.exports =
  config:
    pep8ExecutablePath:
      type: 'string'
      default: 'pep8'
    maxLineLength:
      type: 'integer'
      default: 0
    ignoreErrorCodes:
      type: 'array'
      default: []
      description: 'For a list of code visit http://pep8.readthedocs.org/en/latest/intro.html#error-codes'
    convertAllErrorsToWarnings:
      type: 'boolean'
      default: true

  activate: ->
    require('atom-package-deps').install('linter-pep8')

  provideLinter: ->
    provider =
      name: 'pep8'
      grammarScopes: ['source.python', 'source.python.django']
      scope: 'file' # or 'project'
      lintOnFly: true # must be false for scope: 'project'
      lint: (textEditor)->
        helpers ?= require('atom-linter')
        filePath = textEditor.getPath()
        parameters = []
        if maxLineLength = atom.config.get('linter-pep8.maxLineLength')
          parameters.push("--max-line-length=#{maxLineLength}")
        if ignoreCodes = atom.config.get('linter-pep8.ignoreErrorCodes')
          parameters.push("--ignore=#{ignoreCodes.join(',')}")
        parameters.push('-')
        msgtype = if atom.config.get('linter-pep8.convertAllErrorsToWarnings') then 'Warning' else 'Error'
        return helpers.exec(atom.config.get('linter-pep8.pep8ExecutablePath'), parameters, {stdin: textEditor.getText(), ignoreExitCode: true}).then (result) ->
          toReturn = []
          regex = /stdin:(\d+):(\d+):(.*)/g
          while (match = regex.exec(result)) isnt null
            line = parseInt(match[1]) or 0
            col = parseInt(match[2]) or 0
            toReturn.push({
              type: msgtype
              text: match[3]
              filePath
              range: [[line - 1, col - 1], [line - 1, col]]
            })
          return toReturn
