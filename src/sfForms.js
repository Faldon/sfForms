(function(exports) {

  var version = '0.9.1';

  /**
   * Construct a new sfForms Object
   * @constructs sfForms
   * @param {string} selector - The root selector for sfForms
   * @param {Object} options - User provided options
   * @returns {sfForms}
   */
  var sfForms = function(selector, options) {
    this._collectionHolder = this._getNode(selector);
    this._options = {};
    options = options || {};

    for (var p in sfForms.prototype._defaultOptions) {
      if (sfForms.prototype._defaultOptions.hasOwnProperty(p)) {
        this._options[p] = sfForms.prototype._defaultOptions[p];
      }
    }
    for (p in options) {
      if (options.hasOwnProperty(p)) {
        this._options[p] = options[p];
      }
    }
    if (!~sfForms.prototype._languages.indexOf(this._options.language)) {
      this._options.language = 'en';
    }
    this._i18n = Object.freeze({
      add: {
        'en': 'Add ' + this._options.itemType,
        'de': this._options.itemType + ' hinzufügen'
      },
      remove: {
        'en': 'Delete ' + this._options.itemType,
        'de': this._options.itemType + ' löschen'
      }
    });
    if (!options.hasOwnProperty('deleteItemElementText')) {
      this._options.deleteItemElementText = this._i18n.remove[this._options.language];
    }
    if (!options.hasOwnProperty('addItemElementText')) {
      this._options.addItemElementText = this._i18n.add[this._options.language];
    }
    Object.freeze(this._options);
    if (this._collectionHolder === null) {
      throw new EvalError('No suitable element found');
    }
    this._collectionId = Math.floor(Math.random() * 100);
    if (this._options.allowAdd) {
      this._insertAddElement(this.elItemAdd(),
          this._collectionHolder.parentNode,
          this._collectionHolder.nextSibling);
    }
    for (var i = 0, j = this._collectionHolder.children.length; i < j; i++) {
      this._collectionHolder.dataset.index = (i).toString(10);
      var node = this._collectionHolder.children[i];
      if (this._options.allowDelete &&
          node.classList.contains(this._options.itemFormClass)) {
        this._insertDeleteElement(this.elItemRemove(), node, node.firstChild);
      }
    }
    return this;
  };

  sfForms.prototype._languages = [
    'en',
    'de'
  ];

  /**
   * @property {string} itemType - The type of items in the collection
   * @property {string} rootElement - The root node type holding the element
   * @property {string} itemFormClass - The root class for the item form
   * @property {string} namePrototype - The form name in the data prototype
   * @property {boolean} allowAdd - Adding of new items allowed
   * @property {boolean} allowDelete - Deleting of new items allowed
   * @property {boolean} onlyHide - Hide the collection element instead of
   *                                removing it from the DOM
   * @property {array} addItemElementClass - CSS classes added to the add
   *                                         item HTMLElement
   * @property {array} deleteItemElementClass - CSS classes added to the
   *                                            delete item HTMLElement
   * @private
   */
  sfForms.prototype._defaultOptions = {
    itemType: 'item',
    rootElement: 'div',
    itemFormClass: 'collection-item',
    namePrototype: '__name__',
    allowAdd: true,
    allowDelete: true,
    onlyHide: false,
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
    language: 'en'
  };

  /**
   * Get the DOM element for a selector
   * @param {string} selector - The selector to be searched for
   * @return {Element | Null}
   * @private
   */
  sfForms.prototype._getNode = function(selector) {
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
  };

  /**
   * Create the DOM element used for adding an item to the collection holder
   * @param elementType - The type of the element service as root
   * @returns {HTMLElement}
   */
  sfForms.prototype.elItemAdd = function(elementType) {
    var self = this;
    var outer = elementType || 'button',
        el = document.createElement(outer);
    el.setAttribute('id', 'btn-add-' + self._options.itemType + '-' +
        self._collectionId);
    el.setAttribute('class', self._options.addItemElementClass.join(' '));
    el.classList.add('btn-add-' + self._options.itemType);
    el.innerHTML = self._options.addItemElementText;
    el.addEventListener('click', function(e) {self._onItemAdd(e);}, true);
    return el;
  };

  /**
   * Create the DOM element used for deleting an item from the collection holder
   * @param elementType - The type of the element service as root
   * @returns {HTMLElement}
   */
  sfForms.prototype.elItemRemove = function(elementType) {
    var self = this;
    var outer = elementType || 'button',
        el = document.createElement(outer);
    el.setAttribute('id', 'btn-del-' + self._options.itemType + '-' +
        self._collectionIndex());
    el.setAttribute('class', self._options.deleteItemElementClass.join(' '));
    el.classList.add('btn-del-' + self._options.itemType);
    el.innerHTML = self._options.deleteItemElementText;
    el.addEventListener('click', function(e) {self._onItemDelete(e);}, true);
    return el;
  };

  /**
   * Insert the element for adding an item into the DOM
   * @param {Element} element - The element to insert
   * @param {Node} parent - The parent to which the element is inserted
   * @param {Node} sibling - The sibling to which the element is prepended
   * @private
   */
  sfForms.prototype._insertAddElement = function(element, parent, sibling) {
    parent.insertBefore(element, sibling);
  };

  /**
   * Insert the element for deleting an item into the DOM
   * @param {Element} element - The element to insert
   * @param {Element} parent - The parent to which the element is inserted
   * @param {Node} sibling - The sibling to which the element is prepended
   * @private
   */
  sfForms.prototype._insertDeleteElement = function(element, parent, sibling) {
    parent.insertBefore(element, sibling);
  };

  /**
   * Remove an item form of the collection from the DOM
   * @param {MouseEvent} evt
   * @listens MouseEvent
   * @private
   */
  sfForms.prototype._onItemDelete = function(evt) {
    evt.preventDefault();
    var el = evt.srcElement.closest('.btn-del-' + this._options.itemType);
    if (typeof this._options.beforeDelete === 'function') {
      this._options.beforeDelete(el.parentElement);
    }
    if (this._options.onlyHide) {
      el.parentElement.style.setProperty('display', 'none');
    } else {
      el.parentElement.remove();
    }
    if (typeof this._options.afterDelete === 'function') {
      this._options.afterDelete(this._collectionHolder);
    }
  };

  /**
   * Build the item form added to the collection and insert it into the DOM
   * @param {MouseEvent} evt
   * @listens MouseEvent
   * @private
   */
  sfForms.prototype._onItemAdd = function(evt) {
    evt.preventDefault();
    var index = this._collectionIndex(
        (parseInt(this._collectionIndex()) + 1).toString(10)),
        itemForm = this._itemFormPrototype().replace(
            new RegExp(this._options.namePrototype, 'g'), index),
        item = document.createElement('div');
    if (typeof this._options.beforeAdd === 'function') {
      this._options.beforeAdd(this._collectionHolder);
    }
    this._collectionHolder.appendChild(item);
    item.outerHTML = itemForm;
    item = this._collectionHolder.lastElementChild;
    this._collectionHolder.removeChild(this._collectionHolder.lastElementChild);
    if (this._options.allowDelete) {
      this._insertDeleteElement(this.elItemRemove(),
          item,
          item.firstChild);
    }
    this._collectionHolder.appendChild(item);
    if (typeof this._options.afterAdd === 'function') {
      this._options.afterAdd(this._collectionHolder.lastElementChild);
    }
  };

  /**
   * Get the data-prototype of the collection holder
   * @private
   */
  sfForms.prototype._itemFormPrototype = function() {
    return this._collectionHolder.dataset.prototype;
  };

  /**
   * Get or set the data-index property of the collection holder
   * @param {string=} val - The number to set, if not undefined
   * @returns {string | number} The current data-index property
   * @private
   */
  sfForms.prototype._collectionIndex = function(val) {
    if (val !== undefined) {
      this._collectionHolder.dataset.index = val;
    }
    return this._collectionHolder.dataset.index || 0;
  };

  /**
   * Print the random generated collection id
   * @public
   * @returns {number}
   */
  sfForms.prototype.getId = function() {
    return this._collectionId;
  };

  /**
   * Show the configured options
   * @public
   * @returns {Object}
   */
  sfForms.prototype.getConfiguration = function() {
    return this._options;
  };

  /**
   * Show the configured options
   * @public
   * @returns {string}
   */
  sfForms.showVersion = sfForms.prototype.showVersion = function() {
    return version;
  };

  exports.sfForms = sfForms;

}((this.window = this.window || {})));