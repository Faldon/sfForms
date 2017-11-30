var sfForms = (function() {
  var
      version = '0.0.1',
      _collectionHolder,
      _options = {
        itemType: 'item',
        itemFormElement: 'div',
        itemFormClass: 'collection-item',
        namePrototype: '__name__',
        allowAdd: true,
        allowDelete: true,
        addItemElementClass: [],
        deleteItemElementClass: [],
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
      _onItemDelete = function(evt) {
        _options.beforeDelete();
        evt.srcElement.parentElement.remove();
        _options.afterDelete();
      },
      _onItemAdd = function(evt) {
        var index = _collectionHolder.dataset.index,
            itemForm = _collectionHolder.dataset.prototype.replace(
                new RegExp(_options.namePrototype, 'g'), index),
            item = document.createElement(_options.itemFormElement);
        _options.beforeAdd();
        _collectionHolder.dataset.index = (parseInt(index) + 1).toString(10);
        item.innerHTML = itemForm;
        _collectionHolder.appendChild(item);
        _options.afterDelete();
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
        if (_options.allowAdd) {
          _collectionHolder.parentNode.insertBefore(
              _options.addItemElement(),
              _collectionHolder.nextSibling
          );
        }
        if (_options.allowDelete) {
          for (var i = 0, j = _collectionHolder.children.length; i < j; i++) {
            var node = _collectionHolder.children[i];
            if (node.classList.contains(_options.itemFormClass)) {
              node.insertBefore(
                  _options.deleteItemElement(),
                  node.firstChild
              );
            }
          }
        }
        return this;
      };

  _options.deleteItemElementText = 'Delete this ' + _options.itemType;
  _options.addItemElementText = 'Add ' + _options.itemType;
  _options.addItemElement = function(elementType) {
    var outer = elementType || 'button',
        el = document.createElement(outer),
        attr = document.createAttribute('class');
    el.setAttribute('class', _options.addItemElementClass.join(' '));
    el.onclick = _onItemAdd;
    el.innerHTML = _options.addItemElementText;
    return el;
  };
  _options.deleteItemElement = function(elementType) {
    var outer = elementType || 'button',
        el = document.createElement(outer),
        attr = document.createAttribute('class');
    el.setAttribute('class', _options.deleteItemElementClass.join(' '));
    el.onclick = _onItemDelete;
    el.innerHTML = _options.deleteItemElementText;
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