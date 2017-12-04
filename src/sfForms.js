/**
 * @typedef {object} MouseEvent
 */
var sfForms = (function() {
  var
      version = '0.0.1',
      _collectionHolder,
      _collectionId,
      /**
       * @property {string} itemType - The type of items in the collection
       * @property {string} itemFormClass - The root class for the item form
       * @property {string} namePrototype - The form name in the data prototype
       * @property {boolean} allowAdd - Adding of new items allowed
       * @property {boolean} allowDelete - Deleting of new items allowed
       * @property {array} addItemElementClass - CSS classes added to the add
       *                                         item HTMLElement
       * @property {array} deleteItemElementClass - CSS classes added to the
       *                                            delete item HTMLElement
       * @private
       */
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
        }
      },
      /**
       * Construct a new sfForms Object
       * @constructs sfForms
       * @param {string} selector - The root selector for sfForms
       * @param {Object} options - User provided options
       * @returns {init}
       */
      sfForms = function(selector, options) {
        return new init(selector, options);
      },
      /**
       * Print a message to the console
       * @param message - The message to be printed
       * @private
       */
      _printMessage = function(message) {
        console.log(message);
      },
      /**
       * Dump an arbitrary object in the console
       * @param {Object} object
       * @private
       */
      _dumpObject = function(object) {
        console.dir(object);
      },
      /**
       * Get the DOM element for a selector
       * @param {string} selector - The selector to be searched for
       * @return {Element | Null}
       * @private
       */
      _getNode = function(selector) {
        var elements,
            element = null;
        if ((/^#.*/).test(selector)) {
          element = document.getElementById(selector.substr(1));
        }
        if ((/^\..*/).test(selector)) {
          elements = document.getElementsByClassName(selector.substr(1));
          if (elements.length > 0) {
            element = elements[0];
          }
        }
        return element;
      },
      /**
       * Insert the element for adding an item into the DOM
       * @param {Element} element - The element to insert
       * @param {Node} parent - The parent to which the element is inserted
       * @param {Node} sibling - The sibling to which the element is prepended
       * @private
       */
      _insertAddItemElement = function(element, parent, sibling) {
        parent.insertBefore(element, sibling);
      },
      /**
       * Insert the element for deleting an item into the DOM
       * @param {Element} element - The element to insert
       * @param {Element} parent - The parent to which the element is inserted
       * @param {Node} sibling - The sibling to which the element is prepended
       * @private
       */
      _insertDeleteItemElement = function(element, parent, sibling) {
        parent.insertBefore(element, sibling);
      },
      /**
       * Remove an item form of the collection from the DOM
       * @param {MouseEvent} evt
       * @listens MouseEvent
       * @private
       */
      _onItemDelete = function(evt) {
        evt.preventDefault();
        _options.beforeDelete(evt.srcElement.parentElement);
        evt.srcElement.parentElement.remove();
        _options.afterDelete(_collectionHolder);
      },
      /**
       * Build the item form added to the collection and insert it into the DOM
       * @param {MouseEvent} evt
       * @listens MouseEvent
       * @private
       */
      _onItemAdd = function(evt) {
        evt.preventDefault();
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
      /**
       * Get the data-prototype of the collection holder
       * @private
       */
      _itemFormPrototype = function() {
        return _collectionHolder.dataset.prototype;
      },
      /**
       * Get or set the data-index property of the collection holder
       * @param {string=} val - The number to set, if not undefined
       * @returns {string | number} The current data-index property
       * @private
       */
      _collectionIndex = function(val) {
        if (val !== undefined) {
          _collectionHolder.dataset.index = val;
        }
        return _collectionHolder.dataset.index || 0;
      },
      /**
       * Construct a new sfForms Object
       * @constructs sfForms
       * @param {string} selector - The root selector for sfForms
       * @param {Object} userOptions - User provided options
       * @returns {init}
       */
      init = function(selector, userOptions) {
        _collectionHolder = _getNode(selector);
        for (var p in userOptions) {
          if (userOptions.hasOwnProperty(p)) _options[p] = userOptions[p];
        }
        if (!userOptions.hasOwnProperty('deleteItemElementText')) {
          _options.deleteItemElementText = 'Delete this ' + _options.itemType;
        }
        if (!userOptions.hasOwnProperty('addItemElementText')) {
          _options.addItemElementText = 'Add ' + _options.itemType;
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
      },
      /**
       * Print the random generated collection id
       * @public
       * @returns {printId}
       */
      printId = function() {
        _printMessage(_collectionId);
        return this;
      },
      /**
       * Show the configured options
       * @public
       * @returns {showOptions}
       */
      showOptions = function() {
        _dumpObject(_options);
        return this;
      };

  /**
   * Create the DOM element used for adding an item to the collection holder
   * @param elementType - The type of the element service as root
   * @returns {HTMLElement}
   */
  _options.addItemElement = function(elementType) {
    var outer = elementType || 'button',
        el = document.createElement(outer);
    el.setAttribute('id', 'btn-add-' + _options.itemType + '-' + _collectionId);
    el.setAttribute('name', 'btn-add-' + _options.itemType);
    el.setAttribute('class', _options.addItemElementClass.join(' '));
    el.onclick = _onItemAdd;
    el.innerHTML = _options.addItemElementText;
    return el;
  };
  /**
   * Create the DOM element used for deleting an item from the collection holder
   * @param elementType - The type of the element service as root
   * @returns {HTMLElement}
   */
  _options.deleteItemElement = function(elementType) {
    var outer = elementType || 'button',
        el = document.createElement(outer);
    el.setAttribute('id', 'btn-del-' + _options.itemType + '-' +
        _collectionIndex());
    el.setAttribute('name', 'btn-del-' + _options.itemType);
    el.setAttribute('class', _options.deleteItemElementClass.join(' '));
    el.onclick = _onItemDelete;
    el.innerHTML = _options.deleteItemElementText;
    return el;
  };

  /**
   * The sfForms prototype
   * @type {{sfForms: string, constructor: init, options, printId: printId, showOptions: showOptions}}
   */
  init.prototype = sfForms.prototype = {
    sfForms: version,
    constructor: init,
    options: function() {
      return _options;
    }(),
    printId: printId,
    showOptions: showOptions
  };

  return sfForms;

})(sfForms || {});