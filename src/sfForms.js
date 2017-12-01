var sfForms = (function() {
  var
      version = '0.0.1',
      _collectionHolder,
      _collectionId,
      _options = {
        itemType: 'item',
        itemFormClass: 'collection-item',
        namePrototype: '__name__',
        allowAdd: true,
        allowDelete: true,
        addItemElementClass: [],
        deleteItemElementClass: [],
        beforeAdd: function(collectionNode) {
        },
        afterAdd: function(element) {
        },
        beforeDelete: function(element) {
        },
        afterDelete: function(collectionNode) {
        },
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
      _insertAddItemElement = function(element, parent, sibling) {
        parent.insertBefore(element, sibling);
      },
      _insertDeleteItemElement = function(element, parent, sibling) {
        parent.insertBefore(element, sibling);
      },
      _onItemDelete = function(evt) {
        _options.beforeDelete(evt.srcElement.parentElement());
        evt.srcElement.parentElement.remove();
        _options.afterDelete(_collectionHolder);
      },
      _onItemAdd = function() {
        var index = _collectionIndex(),
            itemForm = _itemFormPrototype().replace(
                new RegExp(_options.namePrototype, 'g'), index),
            item = document.createElement('div');
        _options.beforeAdd(_collectionHolder);
        _collectionIndex((parseInt(index) + 1).toString(10));
        _collectionHolder.appendChild(item);
        item.outerHTML = itemForm;
        item = _collectionHolder.lastElementChild;
        _collectionHolder.removeChild(_collectionHolder.lastElementChild);
        if (_options.allowDelete) {
          _insertDeleteItemElement(_options.deleteItemElement(),
              item,
              item.firstChild);
        }
        _collectionHolder.appendChild(item);
        _options.afterAdd(_collectionHolder.lastElementChild);
      },
      _itemFormPrototype = function() {
        return _collectionHolder.dataset.prototype;
      },
      _collectionIndex = function(val) {
        if(val !== undefined) {
          _collectionHolder.dataset.index = val;
        }
        return _collectionHolder.dataset.index;
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
        _collectionId = Math.floor(Math.random() * 100);
        if (_options.allowAdd) {
          _insertAddItemElement(_options.addItemElement(),
              _collectionHolder.parentNode, _collectionHolder.nextSibling);
        }
        if (_options.allowDelete) {
          for (var i = 0, j = _collectionHolder.children.length; i < j; i++) {
            var node = _collectionHolder.children[i];
            if (node.classList.contains(_options.itemFormClass)) {
              _insertDeleteItemElement(_options.deleteItemElement(), node,
                  node.firstChild);
            }
          }
        }
        return this;
      };

  _options.deleteItemElementText = 'Delete this ' + _options.itemType;
  _options.addItemElementText = 'Add ' + _options.itemType;
  _options.addItemElement = function(elementType) {
    var outer = elementType || 'button',
        el = document.createElement(outer);
    el.setAttribute('id', 'btn-add-'+_options.itemType+'-'+_collectionId);
    el.setAttribute('name', 'btn-add-'+_options.itemType);
    el.setAttribute('class', _options.addItemElementClass.join(' '));
    el.onclick = _onItemAdd;
    el.innerHTML = _options.addItemElementText;
    return el;
  };
  _options.deleteItemElement = function(elementType) {
    var outer = elementType || 'button',
        el = document.createElement(outer),
        btnCount = document.getElementsByName('btn-del-'+_options.itemType).length;
    el.setAttribute('id', 'btn-del-'+_options.itemType+'-'+btnCount);
    el.setAttribute('name', 'btn-del-'+_options.itemType);
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
    showOptions: showOptions,
  };

  return sfForms;

})(sfForms || {});