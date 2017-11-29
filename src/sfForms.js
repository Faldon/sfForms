var sfForms = (function () {
  var
    version = '0.0.1',
    _collectionHolder,
    _options = {
      elementType: 'item',
      allowAdd: true,
      allowDelete: true,
      addElementClass: [],
      deleteElementClass: [],
      beforeAdd: function () {},
      afterAdd: function () {},
      beforeDelete: function () {},
      afterDelete: function () {},
    },
    sfForms = function (selector, options) {
      return new init(selector, options)
    },
    _printMessage = function (message) { console.log(message) },
    _dumpObject = function (object) { console.dir(object) },
    _getNode = function (selector) {
      var elements
      if ((/^#.*/).test(selector)) {
        return document.getElementById(selector.substr(1))
      }
      if ((/^\..*/).test(selector)) {
        elements = document.getElementsByClassName(selector.substr(1))
        if (elements.length > 0) {
          return elements[0]
        }
      }
      return null
    },
    printId = function () {
      _printMessage(_collectionHolder)
      return this
    },
    showOptions = function () {
      _dumpObject(_options)
      return this
    },
    init = function (selector, useroptions) {
      _collectionHolder = _getNode(selector)
      for (var p in useroptions) {
        if (useroptions.hasOwnProperty(p)) _options[p] = useroptions[p]
      }
      Object.freeze(_options)
      if (_collectionHolder === null) {
        throw new EvalError('No suitable element found')
      }
      return this
    }

  _options.deleteTitel = 'Delete this ' + _options.elementType
  _options.addTitel = 'Add ' + _options.elementType
  _options.addElementLink = function () {
    var link = '<button class="'
    link += _options.addElementClass.join(' ')
    link += '">' + _options.addTitel + '</button>'
    return link
  }()
  _options.deleteElementLink = function () {
    var link = '<a href="#" class="'
    link += _options.deleteElementClass.join(' ')
    link += '" title="' + _options.deleteTitel + '"></a>'
    return link
  }()

  init.prototype = sfForms.prototype = {
    sfForms: version,
    constructor: sfForms,
    options: function () { return _options }(),
    printId: printId,
    showOptions: showOptions,
  }

  return sfForms

})(sfForms || {})