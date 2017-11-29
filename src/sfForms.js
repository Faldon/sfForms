var sfForms = (function() {
  var
      version = '0.0.1',
      _collectionHolder,
      _options = {
        elementType: 'item',
        elementRootClass: 'col-item',
        allowAdd: true,
        allowDelete: true,
        classAddElement: [],
        classDeleteElement: [],
        beforeAdd: function() {
        },
        afterAdd: function() {
        },
        beforeDelete: function() {
        },
        afterDelete: function() {
        }
      },
      sfForms = function(selector, options) {
        return new init(selector, options);
      },
      _printMessage = function(message) {
        console.log(message);
      },
      _dumpObject = function(object) {
        console.dir(object);
      },
      _getNode = function(selector) {
        var elements;
        if ((/^#.*/).test(selector)) {
          return document.getElementById(selector.substr(1));
        }
        if ((/^\..*/).test(selector)) {
          elements = document.getElementsByClassName(selector.substr(1));
          if (elements.length > 0) {
            return elements[0];
          }
        }
        return null;
      },
      printId = function() {
        _printMessage(_collectionHolder);
        return this;
      },
      showOptions = function() {
        _dumpObject(_options);
        return this;
      },
      init = function(selector, useroptions) {
        _collectionHolder = _getNode(selector);
        for (var p in useroptions) {
          if (useroptions.hasOwnProperty(p)) _options[p] = useroptions[p];
        }
        Object.freeze(_options);
        if (_collectionHolder === null) {
          throw new EvalError('No suitable element found');
        }
        if(_options.allowAdd) {
          _collectionHolder.parentNode.insertBefore(
              _options.linkAddElement(),
              _collectionHolder.nextSibling
          );
        }
        if(_options.allowDelete) {
          for(var node in _collectionHolder.childNodes) {
            _printMessage(node.className);
          }
        }
        return this;
      };

  _options.titleDeleteElement = 'Delete this ' + _options.elementType;
  _options.titleAddElement = 'Add ' + _options.elementType;
  _options.linkAddElement = function(tag) {
    var outer = tag || "button",
        el = document.createElement(outer),
        attr = document.createAttribute("class");
    el.setAttribute("class", _options.classAddElement.join(' '));
    el.innerHTML = _options.titleAddElement;
    return el;
  };
  _options.linkDeleteElement = function(tag) {
    var outer = tag || "button",
        el = document.createElement(outer),
        attr = document.createAttribute("class");
    el.setAttribute("class", _options.classDeleteElement.join(' '));
    el.innerHTML = _options.titleDeleteElement;
    return el;
  };

  init.prototype = sfForms.prototype = {
    sfForms: version,
    constructor: sfForms,
    options: function() {
      return _options;
    }(),
    printId: printId,
    showOptions: showOptions
  };

  return sfForms;

})(sfForms || {});