'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/*!
 Stencil Mock Doc v3.3.0 | MIT Licensed | https://stenciljs.com
 */
const CONTENT_REF_ID = 'r';
const ORG_LOCATION_ID = 'o';
const SLOT_NODE_ID = 's';
const TEXT_NODE_ID = 't';
const XLINK_NS = 'http://www.w3.org/1999/xlink';

const attrHandler = {
  get(obj, prop) {
    if (prop in obj) {
      return obj[prop];
    }
    if (typeof prop !== 'symbol' && !isNaN(prop)) {
      return obj.__items[prop];
    }
    return undefined;
  },
};
const createAttributeProxy = (caseInsensitive) => new Proxy(new MockAttributeMap(caseInsensitive), attrHandler);
class MockAttributeMap {
  constructor(caseInsensitive = false) {
    this.caseInsensitive = caseInsensitive;
    this.__items = [];
  }
  get length() {
    return this.__items.length;
  }
  item(index) {
    return this.__items[index] || null;
  }
  setNamedItem(attr) {
    attr.namespaceURI = null;
    this.setNamedItemNS(attr);
  }
  setNamedItemNS(attr) {
    if (attr != null && attr.value != null) {
      attr.value = String(attr.value);
    }
    const existingAttr = this.__items.find((a) => a.name === attr.name && a.namespaceURI === attr.namespaceURI);
    if (existingAttr != null) {
      existingAttr.value = attr.value;
    }
    else {
      this.__items.push(attr);
    }
  }
  getNamedItem(attrName) {
    if (this.caseInsensitive) {
      attrName = attrName.toLowerCase();
    }
    return this.getNamedItemNS(null, attrName);
  }
  getNamedItemNS(namespaceURI, attrName) {
    namespaceURI = getNamespaceURI(namespaceURI);
    return (this.__items.find((attr) => attr.name === attrName && getNamespaceURI(attr.namespaceURI) === namespaceURI) || null);
  }
  removeNamedItem(attr) {
    this.removeNamedItemNS(attr);
  }
  removeNamedItemNS(attr) {
    for (let i = 0, ii = this.__items.length; i < ii; i++) {
      if (this.__items[i].name === attr.name && this.__items[i].namespaceURI === attr.namespaceURI) {
        this.__items.splice(i, 1);
        break;
      }
    }
  }
  [Symbol.iterator]() {
    let i = 0;
    return {
      next: () => ({
        done: i === this.length,
        value: this.item(i++),
      }),
    };
  }
  get [Symbol.toStringTag]() {
    return 'MockAttributeMap';
  }
}
function getNamespaceURI(namespaceURI) {
  return namespaceURI === XLINK_NS ? null : namespaceURI;
}
function cloneAttributes(srcAttrs, sortByName = false) {
  const dstAttrs = new MockAttributeMap(srcAttrs.caseInsensitive);
  if (srcAttrs != null) {
    const attrLen = srcAttrs.length;
    if (sortByName && attrLen > 1) {
      const sortedAttrs = [];
      for (let i = 0; i < attrLen; i++) {
        const srcAttr = srcAttrs.item(i);
        const dstAttr = new MockAttr(srcAttr.name, srcAttr.value, srcAttr.namespaceURI);
        sortedAttrs.push(dstAttr);
      }
      sortedAttrs.sort(sortAttributes).forEach((attr) => {
        dstAttrs.setNamedItemNS(attr);
      });
    }
    else {
      for (let i = 0; i < attrLen; i++) {
        const srcAttr = srcAttrs.item(i);
        const dstAttr = new MockAttr(srcAttr.name, srcAttr.value, srcAttr.namespaceURI);
        dstAttrs.setNamedItemNS(dstAttr);
      }
    }
  }
  return dstAttrs;
}
function sortAttributes(a, b) {
  if (a.name < b.name)
    return -1;
  if (a.name > b.name)
    return 1;
  return 0;
}
class MockAttr {
  constructor(attrName, attrValue, namespaceURI = null) {
    this._name = attrName;
    this._value = String(attrValue);
    this._namespaceURI = namespaceURI;
  }
  get name() {
    return this._name;
  }
  set name(value) {
    this._name = value;
  }
  get value() {
    return this._value;
  }
  set value(value) {
    this._value = String(value);
  }
  get nodeName() {
    return this._name;
  }
  set nodeName(value) {
    this._name = value;
  }
  get nodeValue() {
    return this._value;
  }
  set nodeValue(value) {
    this._value = String(value);
  }
  get namespaceURI() {
    return this._namespaceURI;
  }
  set namespaceURI(namespaceURI) {
    this._namespaceURI = namespaceURI;
  }
}

class MockClassList {
  constructor(elm) {
    this.elm = elm;
  }
  add(...classNames) {
    const clsNames = getItems(this.elm);
    let updated = false;
    classNames.forEach((className) => {
      className = String(className);
      validateClass(className);
      if (clsNames.includes(className) === false) {
        clsNames.push(className);
        updated = true;
      }
    });
    if (updated) {
      this.elm.setAttributeNS(null, 'class', clsNames.join(' '));
    }
  }
  remove(...classNames) {
    const clsNames = getItems(this.elm);
    let updated = false;
    classNames.forEach((className) => {
      className = String(className);
      validateClass(className);
      const index = clsNames.indexOf(className);
      if (index > -1) {
        clsNames.splice(index, 1);
        updated = true;
      }
    });
    if (updated) {
      this.elm.setAttributeNS(null, 'class', clsNames.filter((c) => c.length > 0).join(' '));
    }
  }
  contains(className) {
    className = String(className);
    return getItems(this.elm).includes(className);
  }
  toggle(className) {
    className = String(className);
    if (this.contains(className) === true) {
      this.remove(className);
    }
    else {
      this.add(className);
    }
  }
  get length() {
    return getItems(this.elm).length;
  }
  item(index) {
    return getItems(this.elm)[index];
  }
  toString() {
    return getItems(this.elm).join(' ');
  }
}
function validateClass(className) {
  if (className === '') {
    throw new Error('The token provided must not be empty.');
  }
  if (/\s/.test(className)) {
    throw new Error(`The token provided ('${className}') contains HTML space characters, which are not valid in tokens.`);
  }
}
function getItems(elm) {
  const className = elm.getAttribute('class');
  if (typeof className === 'string' && className.length > 0) {
    return className
      .trim()
      .split(' ')
      .filter((c) => c.length > 0);
  }
  return [];
}

class MockCSSStyleDeclaration {
  constructor() {
    this._styles = new Map();
  }
  setProperty(prop, value) {
    prop = jsCaseToCssCase(prop);
    if (value == null || value === '') {
      this._styles.delete(prop);
    }
    else {
      this._styles.set(prop, String(value));
    }
  }
  getPropertyValue(prop) {
    prop = jsCaseToCssCase(prop);
    return String(this._styles.get(prop) || '');
  }
  removeProperty(prop) {
    prop = jsCaseToCssCase(prop);
    this._styles.delete(prop);
  }
  get length() {
    return this._styles.size;
  }
  get cssText() {
    const cssText = [];
    this._styles.forEach((value, prop) => {
      cssText.push(`${prop}: ${value};`);
    });
    return cssText.join(' ').trim();
  }
  set cssText(cssText) {
    if (cssText == null || cssText === '') {
      this._styles.clear();
      return;
    }
    cssText.split(';').forEach((rule) => {
      rule = rule.trim();
      if (rule.length > 0) {
        const splt = rule.split(':');
        if (splt.length > 1) {
          const prop = splt[0].trim();
          const value = splt.slice(1).join(':').trim();
          if (prop !== '' && value !== '') {
            this._styles.set(jsCaseToCssCase(prop), value);
          }
        }
      }
    });
  }
}
function createCSSStyleDeclaration() {
  return new Proxy(new MockCSSStyleDeclaration(), cssProxyHandler);
}
const cssProxyHandler = {
  get(cssStyle, prop) {
    if (prop in cssStyle) {
      return cssStyle[prop];
    }
    prop = cssCaseToJsCase(prop);
    return cssStyle.getPropertyValue(prop);
  },
  set(cssStyle, prop, value) {
    if (prop in cssStyle) {
      cssStyle[prop] = value;
    }
    else {
      cssStyle.setProperty(prop, value);
    }
    return true;
  },
};
function cssCaseToJsCase(str) {
  // font-size to fontSize
  if (str.length > 1 && str.includes('-') === true) {
    str = str
      .toLowerCase()
      .split('-')
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join('');
    str = str.slice(0, 1).toLowerCase() + str.slice(1);
  }
  return str;
}
function jsCaseToCssCase(str) {
  // fontSize to font-size
  if (str.length > 1 && str.includes('-') === false && /[A-Z]/.test(str) === true) {
    str = str
      .replace(/([A-Z])/g, (g) => ' ' + g[0])
      .trim()
      .replace(/ /g, '-')
      .toLowerCase();
  }
  return str;
}

class MockCustomElementRegistry {
  constructor(win) {
    this.win = win;
  }
  define(tagName, cstr, options) {
    if (tagName.toLowerCase() !== tagName) {
      throw new Error(`Failed to execute 'define' on 'CustomElementRegistry': "${tagName}" is not a valid custom element name`);
    }
    if (this.__registry == null) {
      this.__registry = new Map();
    }
    this.__registry.set(tagName, { cstr, options });
    if (this.__whenDefined != null) {
      const whenDefinedResolveFns = this.__whenDefined.get(tagName);
      if (whenDefinedResolveFns != null) {
        whenDefinedResolveFns.forEach((whenDefinedResolveFn) => {
          whenDefinedResolveFn();
        });
        whenDefinedResolveFns.length = 0;
        this.__whenDefined.delete(tagName);
      }
    }
    const doc = this.win.document;
    if (doc != null) {
      const hosts = doc.querySelectorAll(tagName);
      hosts.forEach((host) => {
        if (upgradedElements.has(host) === false) {
          tempDisableCallbacks.add(doc);
          const upgradedCmp = createCustomElement(this, doc, tagName);
          for (let i = 0; i < host.childNodes.length; i++) {
            const childNode = host.childNodes[i];
            childNode.remove();
            upgradedCmp.appendChild(childNode);
          }
          tempDisableCallbacks.delete(doc);
          if (proxyElements.has(host)) {
            proxyElements.set(host, upgradedCmp);
          }
        }
        fireConnectedCallback(host);
      });
    }
  }
  get(tagName) {
    if (this.__registry != null) {
      const def = this.__registry.get(tagName.toLowerCase());
      if (def != null) {
        return def.cstr;
      }
    }
    return undefined;
  }
  upgrade(_rootNode) {
    //
  }
  clear() {
    if (this.__registry != null) {
      this.__registry.clear();
    }
    if (this.__whenDefined != null) {
      this.__whenDefined.clear();
    }
  }
  whenDefined(tagName) {
    tagName = tagName.toLowerCase();
    if (this.__registry != null && this.__registry.has(tagName) === true) {
      return Promise.resolve(this.__registry.get(tagName).cstr);
    }
    return new Promise((resolve) => {
      if (this.__whenDefined == null) {
        this.__whenDefined = new Map();
      }
      let whenDefinedResolveFns = this.__whenDefined.get(tagName);
      if (whenDefinedResolveFns == null) {
        whenDefinedResolveFns = [];
        this.__whenDefined.set(tagName, whenDefinedResolveFns);
      }
      whenDefinedResolveFns.push(resolve);
    });
  }
}
function createCustomElement(customElements, ownerDocument, tagName) {
  const Cstr = customElements.get(tagName);
  if (Cstr != null) {
    const cmp = new Cstr(ownerDocument);
    cmp.nodeName = tagName.toUpperCase();
    upgradedElements.add(cmp);
    return cmp;
  }
  const host = new Proxy({}, {
    get(obj, prop) {
      const elm = proxyElements.get(host);
      if (elm != null) {
        return elm[prop];
      }
      return obj[prop];
    },
    set(obj, prop, val) {
      const elm = proxyElements.get(host);
      if (elm != null) {
        elm[prop] = val;
      }
      else {
        obj[prop] = val;
      }
      return true;
    },
    has(obj, prop) {
      const elm = proxyElements.get(host);
      if (prop in elm) {
        return true;
      }
      if (prop in obj) {
        return true;
      }
      return false;
    },
  });
  const elm = new MockHTMLElement(ownerDocument, tagName);
  proxyElements.set(host, elm);
  return host;
}
const proxyElements = new WeakMap();
const upgradedElements = new WeakSet();
function connectNode(ownerDocument, node) {
  node.ownerDocument = ownerDocument;
  if (node.nodeType === 1 /* NODE_TYPES.ELEMENT_NODE */) {
    if (ownerDocument != null && node.nodeName.includes('-')) {
      const win = ownerDocument.defaultView;
      if (win != null && typeof node.connectedCallback === 'function' && node.isConnected) {
        fireConnectedCallback(node);
      }
      const shadowRoot = node.shadowRoot;
      if (shadowRoot != null) {
        shadowRoot.childNodes.forEach((childNode) => {
          connectNode(ownerDocument, childNode);
        });
      }
    }
    node.childNodes.forEach((childNode) => {
      connectNode(ownerDocument, childNode);
    });
  }
  else {
    node.childNodes.forEach((childNode) => {
      childNode.ownerDocument = ownerDocument;
    });
  }
}
function fireConnectedCallback(node) {
  if (typeof node.connectedCallback === 'function') {
    if (tempDisableCallbacks.has(node.ownerDocument) === false) {
      try {
        node.connectedCallback();
      }
      catch (e) {
        console.error(e);
      }
    }
  }
}
function disconnectNode(node) {
  if (node.nodeType === 1 /* NODE_TYPES.ELEMENT_NODE */) {
    if (node.nodeName.includes('-') === true && typeof node.disconnectedCallback === 'function') {
      if (tempDisableCallbacks.has(node.ownerDocument) === false) {
        try {
          node.disconnectedCallback();
        }
        catch (e) {
          console.error(e);
        }
      }
    }
    node.childNodes.forEach(disconnectNode);
  }
}
function attributeChanged(node, attrName, oldValue, newValue) {
  attrName = attrName.toLowerCase();
  const observedAttributes = node.constructor.observedAttributes;
  if (Array.isArray(observedAttributes) === true &&
    observedAttributes.some((obs) => obs.toLowerCase() === attrName) === true) {
    try {
      node.attributeChangedCallback(attrName, oldValue, newValue);
    }
    catch (e) {
      console.error(e);
    }
  }
}
function checkAttributeChanged(node) {
  return node.nodeName.includes('-') === true && typeof node.attributeChangedCallback === 'function';
}
const tempDisableCallbacks = new Set();

function dataset(elm) {
  const ds = {};
  const attributes = elm.attributes;
  const attrLen = attributes.length;
  for (let i = 0; i < attrLen; i++) {
    const attr = attributes.item(i);
    const nodeName = attr.nodeName;
    if (nodeName.startsWith('data-')) {
      ds[dashToPascalCase(nodeName)] = attr.nodeValue;
    }
  }
  return new Proxy(ds, {
    get(_obj, camelCaseProp) {
      return ds[camelCaseProp];
    },
    set(_obj, camelCaseProp, value) {
      const dataAttr = toDataAttribute(camelCaseProp);
      elm.setAttribute(dataAttr, value);
      return true;
    },
  });
}
function toDataAttribute(str) {
  return ('data-' +
    String(str)
      .replace(/([A-Z0-9])/g, (g) => ' ' + g[0])
      .trim()
      .replace(/ /g, '-')
      .toLowerCase());
}
function dashToPascalCase(str) {
  str = String(str).slice(5);
  return str
    .split('-')
    .map((segment, index) => {
    if (index === 0) {
      return segment.charAt(0).toLowerCase() + segment.slice(1);
    }
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  })
    .join('');
}

class MockEvent {
  constructor(type, eventInitDict) {
    this.bubbles = false;
    this.cancelBubble = false;
    this.cancelable = false;
    this.composed = false;
    this.currentTarget = null;
    this.defaultPrevented = false;
    this.srcElement = null;
    this.target = null;
    if (typeof type !== 'string') {
      throw new Error(`Event type required`);
    }
    this.type = type;
    this.timeStamp = Date.now();
    if (eventInitDict != null) {
      Object.assign(this, eventInitDict);
    }
  }
  preventDefault() {
    this.defaultPrevented = true;
  }
  stopPropagation() {
    this.cancelBubble = true;
  }
  stopImmediatePropagation() {
    this.cancelBubble = true;
  }
  composedPath() {
    const composedPath = [];
    let currentElement = this.target;
    while (currentElement) {
      composedPath.push(currentElement);
      if (!currentElement.parentElement && currentElement.nodeName === "#document" /* NODE_NAMES.DOCUMENT_NODE */) {
        // the current element doesn't have a parent, but we've detected it's our root document node. push the window
        // object associated with the document onto the path
        composedPath.push(currentElement.defaultView);
        break;
      }
      currentElement = currentElement.parentElement;
    }
    return composedPath;
  }
}
class MockCustomEvent extends MockEvent {
  constructor(type, customEventInitDic) {
    super(type);
    this.detail = null;
    if (customEventInitDic != null) {
      Object.assign(this, customEventInitDic);
    }
  }
}
class MockKeyboardEvent extends MockEvent {
  constructor(type, keyboardEventInitDic) {
    super(type);
    this.code = '';
    this.key = '';
    this.altKey = false;
    this.ctrlKey = false;
    this.metaKey = false;
    this.shiftKey = false;
    this.location = 0;
    this.repeat = false;
    if (keyboardEventInitDic != null) {
      Object.assign(this, keyboardEventInitDic);
    }
  }
}
class MockMouseEvent extends MockEvent {
  constructor(type, mouseEventInitDic) {
    super(type);
    this.screenX = 0;
    this.screenY = 0;
    this.clientX = 0;
    this.clientY = 0;
    this.ctrlKey = false;
    this.shiftKey = false;
    this.altKey = false;
    this.metaKey = false;
    this.button = 0;
    this.buttons = 0;
    this.relatedTarget = null;
    if (mouseEventInitDic != null) {
      Object.assign(this, mouseEventInitDic);
    }
  }
}
class MockUIEvent extends MockEvent {
  constructor(type, uiEventInitDic) {
    super(type);
    this.detail = null;
    this.view = null;
    if (uiEventInitDic != null) {
      Object.assign(this, uiEventInitDic);
    }
  }
}
class MockFocusEvent extends MockUIEvent {
  constructor(type, focusEventInitDic) {
    super(type);
    this.relatedTarget = null;
    if (focusEventInitDic != null) {
      Object.assign(this, focusEventInitDic);
    }
  }
}
class MockEventListener {
  constructor(type, handler) {
    this.type = type;
    this.handler = handler;
  }
}
function addEventListener(elm, type, handler) {
  const target = elm;
  if (target.__listeners == null) {
    target.__listeners = [];
  }
  target.__listeners.push(new MockEventListener(type, handler));
}
function removeEventListener(elm, type, handler) {
  const target = elm;
  if (target != null && Array.isArray(target.__listeners) === true) {
    const elmListener = target.__listeners.find((e) => e.type === type && e.handler === handler);
    if (elmListener != null) {
      const index = target.__listeners.indexOf(elmListener);
      target.__listeners.splice(index, 1);
    }
  }
}
function resetEventListeners(target) {
  if (target != null && target.__listeners != null) {
    target.__listeners = null;
  }
}
function triggerEventListener(elm, ev) {
  if (elm == null || ev.cancelBubble === true) {
    return;
  }
  const target = elm;
  ev.currentTarget = elm;
  if (Array.isArray(target.__listeners) === true) {
    const listeners = target.__listeners.filter((e) => e.type === ev.type);
    listeners.forEach((listener) => {
      try {
        listener.handler.call(target, ev);
      }
      catch (err) {
        console.error(err);
      }
    });
  }
  if (ev.bubbles === false) {
    return;
  }
  if (elm.nodeName === "#document" /* NODE_NAMES.DOCUMENT_NODE */) {
    triggerEventListener(elm.defaultView, ev);
  }
  else {
    triggerEventListener(elm.parentElement, ev);
  }
}
function dispatchEvent(currentTarget, ev) {
  ev.target = currentTarget;
  triggerEventListener(currentTarget, ev);
  return true;
}

// Parse5 7.1.2
const e=function(e){const t=new Set([65534,65535,131070,131071,196606,196607,262142,262143,327678,327679,393214,393215,458750,458751,524286,524287,589822,589823,655358,655359,720894,720895,786430,786431,851966,851967,917502,917503,983038,983039,1048574,1048575,1114110,1114111]),s="�";var a;!function(e){e[e.EOF=-1]="EOF",e[e.NULL=0]="NULL",e[e.TABULATION=9]="TABULATION",e[e.CARRIAGE_RETURN=13]="CARRIAGE_RETURN",e[e.LINE_FEED=10]="LINE_FEED",e[e.FORM_FEED=12]="FORM_FEED",e[e.SPACE=32]="SPACE",e[e.EXCLAMATION_MARK=33]="EXCLAMATION_MARK",e[e.QUOTATION_MARK=34]="QUOTATION_MARK",e[e.NUMBER_SIGN=35]="NUMBER_SIGN",e[e.AMPERSAND=38]="AMPERSAND",e[e.APOSTROPHE=39]="APOSTROPHE",e[e.HYPHEN_MINUS=45]="HYPHEN_MINUS",e[e.SOLIDUS=47]="SOLIDUS",e[e.DIGIT_0=48]="DIGIT_0",e[e.DIGIT_9=57]="DIGIT_9",e[e.SEMICOLON=59]="SEMICOLON",e[e.LESS_THAN_SIGN=60]="LESS_THAN_SIGN",e[e.EQUALS_SIGN=61]="EQUALS_SIGN",e[e.GREATER_THAN_SIGN=62]="GREATER_THAN_SIGN",e[e.QUESTION_MARK=63]="QUESTION_MARK",e[e.LATIN_CAPITAL_A=65]="LATIN_CAPITAL_A",e[e.LATIN_CAPITAL_F=70]="LATIN_CAPITAL_F",e[e.LATIN_CAPITAL_X=88]="LATIN_CAPITAL_X",e[e.LATIN_CAPITAL_Z=90]="LATIN_CAPITAL_Z",e[e.RIGHT_SQUARE_BRACKET=93]="RIGHT_SQUARE_BRACKET",e[e.GRAVE_ACCENT=96]="GRAVE_ACCENT",e[e.LATIN_SMALL_A=97]="LATIN_SMALL_A",e[e.LATIN_SMALL_F=102]="LATIN_SMALL_F",e[e.LATIN_SMALL_X=120]="LATIN_SMALL_X",e[e.LATIN_SMALL_Z=122]="LATIN_SMALL_Z",e[e.REPLACEMENT_CHARACTER=65533]="REPLACEMENT_CHARACTER";}(a=a||(a={}));const r="[CDATA[",n="doctype",i="script";function o(e){return e>=55296&&e<=57343}function c(e){return 32!==e&&10!==e&&13!==e&&9!==e&&12!==e&&e>=1&&e<=31||e>=127&&e<=159}function E(e){return e>=64976&&e<=65007||t.has(e)}var T,h;!function(e){e.controlCharacterInInputStream="control-character-in-input-stream",e.noncharacterInInputStream="noncharacter-in-input-stream",e.surrogateInInputStream="surrogate-in-input-stream",e.nonVoidHtmlElementStartTagWithTrailingSolidus="non-void-html-element-start-tag-with-trailing-solidus",e.endTagWithAttributes="end-tag-with-attributes",e.endTagWithTrailingSolidus="end-tag-with-trailing-solidus",e.unexpectedSolidusInTag="unexpected-solidus-in-tag",e.unexpectedNullCharacter="unexpected-null-character",e.unexpectedQuestionMarkInsteadOfTagName="unexpected-question-mark-instead-of-tag-name",e.invalidFirstCharacterOfTagName="invalid-first-character-of-tag-name",e.unexpectedEqualsSignBeforeAttributeName="unexpected-equals-sign-before-attribute-name",e.missingEndTagName="missing-end-tag-name",e.unexpectedCharacterInAttributeName="unexpected-character-in-attribute-name",e.unknownNamedCharacterReference="unknown-named-character-reference",e.missingSemicolonAfterCharacterReference="missing-semicolon-after-character-reference",e.unexpectedCharacterAfterDoctypeSystemIdentifier="unexpected-character-after-doctype-system-identifier",e.unexpectedCharacterInUnquotedAttributeValue="unexpected-character-in-unquoted-attribute-value",e.eofBeforeTagName="eof-before-tag-name",e.eofInTag="eof-in-tag",e.missingAttributeValue="missing-attribute-value",e.missingWhitespaceBetweenAttributes="missing-whitespace-between-attributes",e.missingWhitespaceAfterDoctypePublicKeyword="missing-whitespace-after-doctype-public-keyword",e.missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers="missing-whitespace-between-doctype-public-and-system-identifiers",e.missingWhitespaceAfterDoctypeSystemKeyword="missing-whitespace-after-doctype-system-keyword",e.missingQuoteBeforeDoctypePublicIdentifier="missing-quote-before-doctype-public-identifier",e.missingQuoteBeforeDoctypeSystemIdentifier="missing-quote-before-doctype-system-identifier",e.missingDoctypePublicIdentifier="missing-doctype-public-identifier",e.missingDoctypeSystemIdentifier="missing-doctype-system-identifier",e.abruptDoctypePublicIdentifier="abrupt-doctype-public-identifier",e.abruptDoctypeSystemIdentifier="abrupt-doctype-system-identifier",e.cdataInHtmlContent="cdata-in-html-content",e.incorrectlyOpenedComment="incorrectly-opened-comment",e.eofInScriptHtmlCommentLikeText="eof-in-script-html-comment-like-text",e.eofInDoctype="eof-in-doctype",e.nestedComment="nested-comment",e.abruptClosingOfEmptyComment="abrupt-closing-of-empty-comment",e.eofInComment="eof-in-comment",e.incorrectlyClosedComment="incorrectly-closed-comment",e.eofInCdata="eof-in-cdata",e.absenceOfDigitsInNumericCharacterReference="absence-of-digits-in-numeric-character-reference",e.nullCharacterReference="null-character-reference",e.surrogateCharacterReference="surrogate-character-reference",e.characterReferenceOutsideUnicodeRange="character-reference-outside-unicode-range",e.controlCharacterReference="control-character-reference",e.noncharacterCharacterReference="noncharacter-character-reference",e.missingWhitespaceBeforeDoctypeName="missing-whitespace-before-doctype-name",e.missingDoctypeName="missing-doctype-name",e.invalidCharacterSequenceAfterDoctypeName="invalid-character-sequence-after-doctype-name",e.duplicateAttribute="duplicate-attribute",e.nonConformingDoctype="non-conforming-doctype",e.missingDoctype="missing-doctype",e.misplacedDoctype="misplaced-doctype",e.endTagWithoutMatchingOpenElement="end-tag-without-matching-open-element",e.closingOfElementWithOpenChildElements="closing-of-element-with-open-child-elements",e.disallowedContentInNoscriptInHead="disallowed-content-in-noscript-in-head",e.openElementsLeftAfterEof="open-elements-left-after-eof",e.abandonedHeadElementChild="abandoned-head-element-child",e.misplacedStartTagForHeadElement="misplaced-start-tag-for-head-element",e.nestedNoscriptInHead="nested-noscript-in-head",e.eofInElementThatCanContainOnlyText="eof-in-element-that-can-contain-only-text";}(T=T||(T={}));class _{constructor(e){this.handler=e,this.html="",this.pos=-1,this.lastGapPos=-2,this.gapStack=[],this.skipNextNewLine=!1,this.lastChunkWritten=!1,this.endOfChunkHit=!1,this.bufferWaterline=65536,this.isEol=!1,this.lineStartPos=0,this.droppedBufferSize=0,this.line=1,this.lastErrOffset=-1;}get col(){return this.pos-this.lineStartPos+Number(this.lastGapPos!==this.pos)}get offset(){return this.droppedBufferSize+this.pos}getError(e){const{line:t,col:s,offset:a}=this;return {code:e,startLine:t,endLine:t,startCol:s,endCol:s,startOffset:a,endOffset:a}}_err(e){this.handler.onParseError&&this.lastErrOffset!==this.offset&&(this.lastErrOffset=this.offset,this.handler.onParseError(this.getError(e)));}_addGap(){this.gapStack.push(this.lastGapPos),this.lastGapPos=this.pos;}_processSurrogate(e){if(this.pos!==this.html.length-1){const t=this.html.charCodeAt(this.pos+1);if(function(e){return e>=56320&&e<=57343}(t))return this.pos++,this._addGap(),1024*(e-55296)+9216+t}else if(!this.lastChunkWritten)return this.endOfChunkHit=!0,a.EOF;return this._err(T.surrogateInInputStream),e}willDropParsedChunk(){return this.pos>this.bufferWaterline}dropParsedChunk(){this.willDropParsedChunk()&&(this.html=this.html.substring(this.pos),this.lineStartPos-=this.pos,this.droppedBufferSize+=this.pos,this.pos=0,this.lastGapPos=-2,this.gapStack.length=0);}write(e,t){this.html.length>0?this.html+=e:this.html=e,this.endOfChunkHit=!1,this.lastChunkWritten=t;}insertHtmlAtCurrentPos(e){this.html=this.html.substring(0,this.pos+1)+e+this.html.substring(this.pos+1),this.endOfChunkHit=!1;}startsWith(e,t){if(this.pos+e.length>this.html.length)return this.endOfChunkHit=!this.lastChunkWritten,!1;if(t)return this.html.startsWith(e,this.pos);for(let t=0;t<e.length;t++)if((32|this.html.charCodeAt(this.pos+t))!==e.charCodeAt(t))return !1;return !0}peek(e){const t=this.pos+e;if(t>=this.html.length)return this.endOfChunkHit=!this.lastChunkWritten,a.EOF;const s=this.html.charCodeAt(t);return s===a.CARRIAGE_RETURN?a.LINE_FEED:s}advance(){if(this.pos++,this.isEol&&(this.isEol=!1,this.line++,this.lineStartPos=this.pos),this.pos>=this.html.length)return this.endOfChunkHit=!this.lastChunkWritten,a.EOF;let e=this.html.charCodeAt(this.pos);return e===a.CARRIAGE_RETURN?(this.isEol=!0,this.skipNextNewLine=!0,a.LINE_FEED):e===a.LINE_FEED&&(this.isEol=!0,this.skipNextNewLine)?(this.line--,this.skipNextNewLine=!1,this._addGap(),this.advance()):(this.skipNextNewLine=!1,o(e)&&(e=this._processSurrogate(e)),null===this.handler.onParseError||e>31&&e<127||e===a.LINE_FEED||e===a.CARRIAGE_RETURN||e>159&&e<64976||this._checkForProblematicCharacters(e),e)}_checkForProblematicCharacters(e){c(e)?this._err(T.controlCharacterInInputStream):E(e)&&this._err(T.noncharacterInInputStream);}retreat(e){for(this.pos-=e;this.pos<this.lastGapPos;)this.lastGapPos=this.gapStack.pop(),this.pos--;this.isEol=!1;}}function A(e,t){for(let s=e.attrs.length-1;s>=0;s--)if(e.attrs[s].name===t)return e.attrs[s].value;return null}!function(e){e[e.CHARACTER=0]="CHARACTER",e[e.NULL_CHARACTER=1]="NULL_CHARACTER",e[e.WHITESPACE_CHARACTER=2]="WHITESPACE_CHARACTER",e[e.START_TAG=3]="START_TAG",e[e.END_TAG=4]="END_TAG",e[e.COMMENT=5]="COMMENT",e[e.DOCTYPE=6]="DOCTYPE",e[e.EOF=7]="EOF",e[e.HIBERNATION=8]="HIBERNATION";}(h=h||(h={}));var l="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};function m(e,t,s){return e(s={path:t,exports:{},require:function(e,t){return function(){throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs")}(null==t&&s.path)}},s.exports),s.exports}var p,d,I,N,u,C=m((function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.default=new Uint16Array('ᵁ<Õıʊҝջאٵ۞ޢߖࠏ੊ઑඡ๭༉༦჊ረዡᐕᒝᓃᓟᔥ\0\0\0\0\0\0ᕫᛍᦍᰒᷝ὾⁠↰⊍⏀⏻⑂⠤⤒ⴈ⹈⿎〖㊺㘹㞬㣾㨨㩱㫠㬮ࠀEMabcfglmnoprstu\\bfms¦³¹ÈÏlig耻Æ䃆P耻&䀦cute耻Á䃁reve;䄂Āiyx}rc耻Â䃂;䐐r;쀀𝔄rave耻À䃀pha;䎑acr;䄀d;橓Āgp¡on;䄄f;쀀𝔸plyFunction;恡ing耻Å䃅Ācs¾Ãr;쀀𝒜ign;扔ilde耻Ã䃃ml耻Ä䃄ЀaceforsuåûþėĜĢħĪĀcrêòkslash;或Ŷöø;櫧ed;挆y;䐑ƀcrtąċĔause;戵noullis;愬a;䎒r;쀀𝔅pf;쀀𝔹eve;䋘còēmpeq;扎܀HOacdefhilorsuōőŖƀƞƢƵƷƺǜȕɳɸɾcy;䐧PY耻©䂩ƀcpyŝŢźute;䄆Ā;iŧŨ拒talDifferentialD;慅leys;愭ȀaeioƉƎƔƘron;䄌dil耻Ç䃇rc;䄈nint;戰ot;䄊ĀdnƧƭilla;䂸terDot;䂷òſi;䎧rcleȀDMPTǇǋǑǖot;抙inus;抖lus;投imes;抗oĀcsǢǸkwiseContourIntegral;戲eCurlyĀDQȃȏoubleQuote;思uote;怙ȀlnpuȞȨɇɕonĀ;eȥȦ户;橴ƀgitȯȶȺruent;扡nt;戯ourIntegral;戮ĀfrɌɎ;愂oduct;成nterClockwiseContourIntegral;戳oss;樯cr;쀀𝒞pĀ;Cʄʅ拓ap;才րDJSZacefiosʠʬʰʴʸˋ˗ˡ˦̳ҍĀ;oŹʥtrahd;椑cy;䐂cy;䐅cy;䐏ƀgrsʿ˄ˇger;怡r;憡hv;櫤Āayː˕ron;䄎;䐔lĀ;t˝˞戇a;䎔r;쀀𝔇Āaf˫̧Ācm˰̢riticalȀADGT̖̜̀̆cute;䂴oŴ̋̍;䋙bleAcute;䋝rave;䁠ilde;䋜ond;拄ferentialD;慆Ѱ̽\0\0\0͔͂\0Ѕf;쀀𝔻ƀ;DE͈͉͍䂨ot;惜qual;扐blèCDLRUVͣͲ΂ϏϢϸontourIntegraìȹoɴ͹\0\0ͻ»͉nArrow;懓Āeo·ΤftƀARTΐΖΡrrow;懐ightArrow;懔eåˊngĀLRΫτeftĀARγιrrow;柸ightArrow;柺ightArrow;柹ightĀATϘϞrrow;懒ee;抨pɁϩ\0\0ϯrrow;懑ownArrow;懕erticalBar;戥ǹABLRTaВЪаўѿͼrrowƀ;BUНОТ憓ar;椓pArrow;懵reve;䌑eft˒к\0ц\0ѐightVector;楐eeVector;楞ectorĀ;Bљњ憽ar;楖ightǔѧ\0ѱeeVector;楟ectorĀ;BѺѻ懁ar;楗eeĀ;A҆҇护rrow;憧ĀctҒҗr;쀀𝒟rok;䄐ࠀNTacdfglmopqstuxҽӀӄӋӞӢӧӮӵԡԯԶՒ՝ՠեG;䅊H耻Ð䃐cute耻É䃉ƀaiyӒӗӜron;䄚rc耻Ê䃊;䐭ot;䄖r;쀀𝔈rave耻È䃈ement;戈ĀapӺӾcr;䄒tyɓԆ\0\0ԒmallSquare;旻erySmallSquare;斫ĀgpԦԪon;䄘f;쀀𝔼silon;䎕uĀaiԼՉlĀ;TՂՃ橵ilde;扂librium;懌Āci՗՚r;愰m;橳a;䎗ml耻Ë䃋Āipժկsts;戃onentialE;慇ʀcfiosօֈ֍ֲ׌y;䐤r;쀀𝔉lledɓ֗\0\0֣mallSquare;旼erySmallSquare;斪Ͱֺ\0ֿ\0\0ׄf;쀀𝔽All;戀riertrf;愱cò׋؀JTabcdfgorstר׬ׯ׺؀ؒؖ؛؝أ٬ٲcy;䐃耻>䀾mmaĀ;d׷׸䎓;䏜reve;䄞ƀeiy؇،ؐdil;䄢rc;䄜;䐓ot;䄠r;쀀𝔊;拙pf;쀀𝔾eater̀EFGLSTصلَٖٛ٦qualĀ;Lؾؿ扥ess;招ullEqual;执reater;檢ess;扷lantEqual;橾ilde;扳cr;쀀𝒢;扫ЀAacfiosuڅڋږڛڞڪھۊRDcy;䐪Āctڐڔek;䋇;䁞irc;䄤r;愌lbertSpace;愋ǰگ\0ڲf;愍izontalLine;攀Āctۃۅòکrok;䄦mpńېۘownHumðįqual;扏܀EJOacdfgmnostuۺ۾܃܇܎ܚܞܡܨ݄ݸދޏޕcy;䐕lig;䄲cy;䐁cute耻Í䃍Āiyܓܘrc耻Î䃎;䐘ot;䄰r;愑rave耻Ì䃌ƀ;apܠܯܿĀcgܴܷr;䄪inaryI;慈lieóϝǴ݉\0ݢĀ;eݍݎ戬Āgrݓݘral;戫section;拂isibleĀCTݬݲomma;恣imes;恢ƀgptݿރވon;䄮f;쀀𝕀a;䎙cr;愐ilde;䄨ǫޚ\0ޞcy;䐆l耻Ï䃏ʀcfosuެ޷޼߂ߐĀiyޱ޵rc;䄴;䐙r;쀀𝔍pf;쀀𝕁ǣ߇\0ߌr;쀀𝒥rcy;䐈kcy;䐄΀HJacfosߤߨ߽߬߱ࠂࠈcy;䐥cy;䐌ppa;䎚Āey߶߻dil;䄶;䐚r;쀀𝔎pf;쀀𝕂cr;쀀𝒦րJTaceflmostࠥࠩࠬࡐࡣ঳সে্਷ੇcy;䐉耻<䀼ʀcmnpr࠷࠼ࡁࡄࡍute;䄹bda;䎛g;柪lacetrf;愒r;憞ƀaeyࡗ࡜ࡡron;䄽dil;䄻;䐛Āfsࡨ॰tԀACDFRTUVarࡾࢩࢱࣦ࣠ࣼयज़ΐ४Ānrࢃ࢏gleBracket;柨rowƀ;BR࢙࢚࢞憐ar;懤ightArrow;懆eiling;挈oǵࢷ\0ࣃbleBracket;柦nǔࣈ\0࣒eeVector;楡ectorĀ;Bࣛࣜ懃ar;楙loor;挊ightĀAV࣯ࣵrrow;憔ector;楎Āerँगeƀ;AVउऊऐ抣rrow;憤ector;楚iangleƀ;BEतथऩ抲ar;槏qual;抴pƀDTVषूौownVector;楑eeVector;楠ectorĀ;Bॖॗ憿ar;楘ectorĀ;B॥०憼ar;楒ightáΜs̀EFGLSTॾঋকঝঢভqualGreater;拚ullEqual;扦reater;扶ess;檡lantEqual;橽ilde;扲r;쀀𝔏Ā;eঽা拘ftarrow;懚idot;䄿ƀnpw৔ਖਛgȀLRlr৞৷ਂਐeftĀAR০৬rrow;柵ightArrow;柷ightArrow;柶eftĀarγਊightáοightáϊf;쀀𝕃erĀLRਢਬeftArrow;憙ightArrow;憘ƀchtਾੀੂòࡌ;憰rok;䅁;扪Ѐacefiosuਗ਼੝੠੷੼અઋ઎p;椅y;䐜Ādl੥੯iumSpace;恟lintrf;愳r;쀀𝔐nusPlus;戓pf;쀀𝕄cò੶;䎜ҀJacefostuણધભીଔଙඑ඗ඞcy;䐊cute;䅃ƀaey઴હાron;䅇dil;䅅;䐝ƀgswે૰଎ativeƀMTV૓૟૨ediumSpace;怋hiĀcn૦૘ë૙eryThiî૙tedĀGL૸ଆreaterGreateòٳessLesóੈLine;䀊r;쀀𝔑ȀBnptଢନଷ଺reak;恠BreakingSpace;䂠f;愕ڀ;CDEGHLNPRSTV୕ୖ୪୼஡௫ఄ౞಄ದ೘ൡඅ櫬Āou୛୤ngruent;扢pCap;扭oubleVerticalBar;戦ƀlqxஃஊ஛ement;戉ualĀ;Tஒஓ扠ilde;쀀≂̸ists;戄reater΀;EFGLSTஶஷ஽௉௓௘௥扯qual;扱ullEqual;쀀≧̸reater;쀀≫̸ess;批lantEqual;쀀⩾̸ilde;扵umpń௲௽ownHump;쀀≎̸qual;쀀≏̸eĀfsఊధtTriangleƀ;BEచఛడ拪ar;쀀⧏̸qual;括s̀;EGLSTవశ఼ౄోౘ扮qual;扰reater;扸ess;쀀≪̸lantEqual;쀀⩽̸ilde;扴estedĀGL౨౹reaterGreater;쀀⪢̸essLess;쀀⪡̸recedesƀ;ESಒಓಛ技qual;쀀⪯̸lantEqual;拠ĀeiಫಹverseElement;戌ghtTriangleƀ;BEೋೌ೒拫ar;쀀⧐̸qual;拭ĀquೝഌuareSuĀbp೨೹setĀ;E೰ೳ쀀⊏̸qual;拢ersetĀ;Eഃആ쀀⊐̸qual;拣ƀbcpഓതൎsetĀ;Eഛഞ쀀⊂⃒qual;抈ceedsȀ;ESTലള഻െ抁qual;쀀⪰̸lantEqual;拡ilde;쀀≿̸ersetĀ;E൘൛쀀⊃⃒qual;抉ildeȀ;EFT൮൯൵ൿ扁qual;扄ullEqual;扇ilde;扉erticalBar;戤cr;쀀𝒩ilde耻Ñ䃑;䎝܀Eacdfgmoprstuvලෂ෉෕ෛ෠෧෼ขภยา฿ไlig;䅒cute耻Ó䃓Āiy෎ීrc耻Ô䃔;䐞blac;䅐r;쀀𝔒rave耻Ò䃒ƀaei෮ෲ෶cr;䅌ga;䎩cron;䎟pf;쀀𝕆enCurlyĀDQฎบoubleQuote;怜uote;怘;橔Āclวฬr;쀀𝒪ash耻Ø䃘iŬื฼de耻Õ䃕es;樷ml耻Ö䃖erĀBP๋๠Āar๐๓r;怾acĀek๚๜;揞et;掴arenthesis;揜Ҁacfhilors๿ງຊຏຒດຝະ໼rtialD;戂y;䐟r;쀀𝔓i;䎦;䎠usMinus;䂱Āipຢອncareplanåڝf;愙Ȁ;eio຺ູ໠໤檻cedesȀ;EST່້໏໚扺qual;檯lantEqual;扼ilde;找me;怳Ādp໩໮uct;戏ortionĀ;aȥ໹l;戝Āci༁༆r;쀀𝒫;䎨ȀUfos༑༖༛༟OT耻"䀢r;쀀𝔔pf;愚cr;쀀𝒬؀BEacefhiorsu༾གྷཇའཱིྦྷྪྭ႖ႩႴႾarr;椐G耻®䂮ƀcnrཎནབute;䅔g;柫rĀ;tཛྷཝ憠l;椖ƀaeyཧཬཱron;䅘dil;䅖;䐠Ā;vླྀཹ愜erseĀEUྂྙĀlq྇ྎement;戋uilibrium;懋pEquilibrium;楯r»ཹo;䎡ghtЀACDFTUVa࿁࿫࿳ဢဨၛႇϘĀnr࿆࿒gleBracket;柩rowƀ;BL࿜࿝࿡憒ar;懥eftArrow;懄eiling;按oǵ࿹\0စbleBracket;柧nǔည\0နeeVector;楝ectorĀ;Bဝသ懂ar;楕loor;挋Āerိ၃eƀ;AVဵံြ抢rrow;憦ector;楛iangleƀ;BEၐၑၕ抳ar;槐qual;抵pƀDTVၣၮၸownVector;楏eeVector;楜ectorĀ;Bႂႃ憾ar;楔ectorĀ;B႑႒懀ar;楓Āpuႛ႞f;愝ndImplies;楰ightarrow;懛ĀchႹႼr;愛;憱leDelayed;槴ڀHOacfhimoqstuფჱჷჽᄙᄞᅑᅖᅡᅧᆵᆻᆿĀCcჩხHcy;䐩y;䐨FTcy;䐬cute;䅚ʀ;aeiyᄈᄉᄎᄓᄗ檼ron;䅠dil;䅞rc;䅜;䐡r;쀀𝔖ortȀDLRUᄪᄴᄾᅉownArrow»ОeftArrow»࢚ightArrow»࿝pArrow;憑gma;䎣allCircle;战pf;쀀𝕊ɲᅭ\0\0ᅰt;戚areȀ;ISUᅻᅼᆉᆯ斡ntersection;抓uĀbpᆏᆞsetĀ;Eᆗᆘ抏qual;抑ersetĀ;Eᆨᆩ抐qual;抒nion;抔cr;쀀𝒮ar;拆ȀbcmpᇈᇛሉላĀ;sᇍᇎ拐etĀ;Eᇍᇕqual;抆ĀchᇠህeedsȀ;ESTᇭᇮᇴᇿ扻qual;檰lantEqual;扽ilde;承Tháྌ;我ƀ;esሒሓሣ拑rsetĀ;Eሜም抃qual;抇et»ሓրHRSacfhiorsሾቄ቉ቕ቞ቱቶኟዂወዑORN耻Þ䃞ADE;愢ĀHc቎ቒcy;䐋y;䐦Ābuቚቜ;䀉;䎤ƀaeyብቪቯron;䅤dil;䅢;䐢r;쀀𝔗Āeiቻ኉ǲኀ\0ኇefore;戴a;䎘Ācn኎ኘkSpace;쀀  Space;怉ldeȀ;EFTካኬኲኼ戼qual;扃ullEqual;扅ilde;扈pf;쀀𝕋ipleDot;惛Āctዖዛr;쀀𝒯rok;䅦ૡዷጎጚጦ\0ጬጱ\0\0\0\0\0ጸጽ፷ᎅ\0᏿ᐄᐊᐐĀcrዻጁute耻Ú䃚rĀ;oጇገ憟cir;楉rǣጓ\0጖y;䐎ve;䅬Āiyጞጣrc耻Û䃛;䐣blac;䅰r;쀀𝔘rave耻Ù䃙acr;䅪Ādiፁ፩erĀBPፈ፝Āarፍፐr;䁟acĀekፗፙ;揟et;掵arenthesis;揝onĀ;P፰፱拃lus;抎Āgp፻፿on;䅲f;쀀𝕌ЀADETadps᎕ᎮᎸᏄϨᏒᏗᏳrrowƀ;BDᅐᎠᎤar;椒ownArrow;懅ownArrow;憕quilibrium;楮eeĀ;AᏋᏌ报rrow;憥ownáϳerĀLRᏞᏨeftArrow;憖ightArrow;憗iĀ;lᏹᏺ䏒on;䎥ing;䅮cr;쀀𝒰ilde;䅨ml耻Ü䃜ҀDbcdefosvᐧᐬᐰᐳᐾᒅᒊᒐᒖash;披ar;櫫y;䐒ashĀ;lᐻᐼ抩;櫦Āerᑃᑅ;拁ƀbtyᑌᑐᑺar;怖Ā;iᑏᑕcalȀBLSTᑡᑥᑪᑴar;戣ine;䁼eparator;杘ilde;所ThinSpace;怊r;쀀𝔙pf;쀀𝕍cr;쀀𝒱dash;抪ʀcefosᒧᒬᒱᒶᒼirc;䅴dge;拀r;쀀𝔚pf;쀀𝕎cr;쀀𝒲Ȁfiosᓋᓐᓒᓘr;쀀𝔛;䎞pf;쀀𝕏cr;쀀𝒳ҀAIUacfosuᓱᓵᓹᓽᔄᔏᔔᔚᔠcy;䐯cy;䐇cy;䐮cute耻Ý䃝Āiyᔉᔍrc;䅶;䐫r;쀀𝔜pf;쀀𝕐cr;쀀𝒴ml;䅸ЀHacdefosᔵᔹᔿᕋᕏᕝᕠᕤcy;䐖cute;䅹Āayᕄᕉron;䅽;䐗ot;䅻ǲᕔ\0ᕛoWidtè૙a;䎖r;愨pf;愤cr;쀀𝒵௡ᖃᖊᖐ\0ᖰᖶᖿ\0\0\0\0ᗆᗛᗫᙟ᙭\0ᚕ᚛ᚲᚹ\0ᚾcute耻á䃡reve;䄃̀;Ediuyᖜᖝᖡᖣᖨᖭ戾;쀀∾̳;房rc耻â䃢te肻´̆;䐰lig耻æ䃦Ā;r²ᖺ;쀀𝔞rave耻à䃠ĀepᗊᗖĀfpᗏᗔsym;愵èᗓha;䎱ĀapᗟcĀclᗤᗧr;䄁g;樿ɤᗰ\0\0ᘊʀ;adsvᗺᗻᗿᘁᘇ戧nd;橕;橜lope;橘;橚΀;elmrszᘘᘙᘛᘞᘿᙏᙙ戠;榤e»ᘙsdĀ;aᘥᘦ戡ѡᘰᘲᘴᘶᘸᘺᘼᘾ;榨;榩;榪;榫;榬;榭;榮;榯tĀ;vᙅᙆ戟bĀ;dᙌᙍ抾;榝Āptᙔᙗh;戢»¹arr;捼Āgpᙣᙧon;䄅f;쀀𝕒΀;Eaeiop዁ᙻᙽᚂᚄᚇᚊ;橰cir;橯;扊d;手s;䀧roxĀ;e዁ᚒñᚃing耻å䃥ƀctyᚡᚦᚨr;쀀𝒶;䀪mpĀ;e዁ᚯñʈilde耻ã䃣ml耻ä䃤Āciᛂᛈoninôɲnt;樑ࠀNabcdefiklnoprsu᛭ᛱᜰ᜼ᝃᝈ᝸᝽០៦ᠹᡐᜍ᤽᥈ᥰot;櫭Ācrᛶ᜞kȀcepsᜀᜅᜍᜓong;扌psilon;䏶rime;怵imĀ;e᜚᜛戽q;拍Ŷᜢᜦee;抽edĀ;gᜬᜭ挅e»ᜭrkĀ;t፜᜷brk;掶Āoyᜁᝁ;䐱quo;怞ʀcmprtᝓ᝛ᝡᝤᝨausĀ;eĊĉptyv;榰séᜌnoõēƀahwᝯ᝱ᝳ;䎲;愶een;扬r;쀀𝔟g΀costuvwឍឝឳេ៕៛៞ƀaiuបពរðݠrc;旯p»፱ƀdptឤឨឭot;樀lus;樁imes;樂ɱឹ\0\0ើcup;樆ar;昅riangleĀdu៍្own;施p;斳plus;樄eåᑄåᒭarow;植ƀako៭ᠦᠵĀcn៲ᠣkƀlst៺֫᠂ozenge;槫riangleȀ;dlr᠒᠓᠘᠝斴own;斾eft;旂ight;斸k;搣Ʊᠫ\0ᠳƲᠯ\0ᠱ;斒;斑4;斓ck;斈ĀeoᠾᡍĀ;qᡃᡆ쀀=⃥uiv;쀀≡⃥t;挐Ȁptwxᡙᡞᡧᡬf;쀀𝕓Ā;tᏋᡣom»Ꮜtie;拈؀DHUVbdhmptuvᢅᢖᢪᢻᣗᣛᣬ᣿ᤅᤊᤐᤡȀLRlrᢎᢐᢒᢔ;敗;敔;敖;敓ʀ;DUduᢡᢢᢤᢦᢨ敐;敦;敩;敤;敧ȀLRlrᢳᢵᢷᢹ;敝;敚;敜;教΀;HLRhlrᣊᣋᣍᣏᣑᣓᣕ救;敬;散;敠;敫;敢;敟ox;槉ȀLRlrᣤᣦᣨᣪ;敕;敒;攐;攌ʀ;DUduڽ᣷᣹᣻᣽;敥;敨;攬;攴inus;抟lus;択imes;抠ȀLRlrᤙᤛᤝ᤟;敛;敘;攘;攔΀;HLRhlrᤰᤱᤳᤵᤷ᤻᤹攂;敪;敡;敞;攼;攤;攜Āevģ᥂bar耻¦䂦Ȁceioᥑᥖᥚᥠr;쀀𝒷mi;恏mĀ;e᜚᜜lƀ;bhᥨᥩᥫ䁜;槅sub;柈Ŭᥴ᥾lĀ;e᥹᥺怢t»᥺pƀ;Eeįᦅᦇ;檮Ā;qۜۛೡᦧ\0᧨ᨑᨕᨲ\0ᨷᩐ\0\0᪴\0\0᫁\0\0ᬡᬮ᭍᭒\0᯽\0ᰌƀcpr᦭ᦲ᧝ute;䄇̀;abcdsᦿᧀᧄ᧊᧕᧙戩nd;橄rcup;橉Āau᧏᧒p;橋p;橇ot;橀;쀀∩︀Āeo᧢᧥t;恁îړȀaeiu᧰᧻ᨁᨅǰ᧵\0᧸s;橍on;䄍dil耻ç䃧rc;䄉psĀ;sᨌᨍ橌m;橐ot;䄋ƀdmnᨛᨠᨦil肻¸ƭptyv;榲t脀¢;eᨭᨮ䂢räƲr;쀀𝔠ƀceiᨽᩀᩍy;䑇ckĀ;mᩇᩈ朓ark»ᩈ;䏇r΀;Ecefms᩟᩠ᩢᩫ᪤᪪᪮旋;槃ƀ;elᩩᩪᩭ䋆q;扗eɡᩴ\0\0᪈rrowĀlr᩼᪁eft;憺ight;憻ʀRSacd᪒᪔᪖᪚᪟»ཇ;擈st;抛irc;抚ash;抝nint;樐id;櫯cir;槂ubsĀ;u᪻᪼晣it»᪼ˬ᫇᫔᫺\0ᬊonĀ;eᫍᫎ䀺Ā;qÇÆɭ᫙\0\0᫢aĀ;t᫞᫟䀬;䁀ƀ;fl᫨᫩᫫戁îᅠeĀmx᫱᫶ent»᫩eóɍǧ᫾\0ᬇĀ;dኻᬂot;橭nôɆƀfryᬐᬔᬗ;쀀𝕔oäɔ脀©;sŕᬝr;愗Āaoᬥᬩrr;憵ss;朗Ācuᬲᬷr;쀀𝒸Ābpᬼ᭄Ā;eᭁᭂ櫏;櫑Ā;eᭉᭊ櫐;櫒dot;拯΀delprvw᭠᭬᭷ᮂᮬᯔ᯹arrĀlr᭨᭪;椸;椵ɰ᭲\0\0᭵r;拞c;拟arrĀ;p᭿ᮀ憶;椽̀;bcdosᮏᮐᮖᮡᮥᮨ截rcap;橈Āauᮛᮞp;橆p;橊ot;抍r;橅;쀀∪︀Ȁalrv᮵ᮿᯞᯣrrĀ;mᮼᮽ憷;椼yƀevwᯇᯔᯘqɰᯎ\0\0ᯒreã᭳uã᭵ee;拎edge;拏en耻¤䂤earrowĀlrᯮ᯳eft»ᮀight»ᮽeäᯝĀciᰁᰇoninôǷnt;戱lcty;挭ঀAHabcdefhijlorstuwz᰸᰻᰿ᱝᱩᱵᲊᲞᲬᲷ᳻᳿ᴍᵻᶑᶫᶻ᷆᷍rò΁ar;楥Ȁglrs᱈ᱍ᱒᱔ger;怠eth;愸òᄳhĀ;vᱚᱛ怐»ऊūᱡᱧarow;椏aã̕Āayᱮᱳron;䄏;䐴ƀ;ao̲ᱼᲄĀgrʿᲁr;懊tseq;橷ƀglmᲑᲔᲘ耻°䂰ta;䎴ptyv;榱ĀirᲣᲨsht;楿;쀀𝔡arĀlrᲳᲵ»ࣜ»သʀaegsv᳂͸᳖᳜᳠mƀ;oș᳊᳔ndĀ;ș᳑uit;晦amma;䏝in;拲ƀ;io᳧᳨᳸䃷de脀÷;o᳧ᳰntimes;拇nø᳷cy;䑒cɯᴆ\0\0ᴊrn;挞op;挍ʀlptuwᴘᴝᴢᵉᵕlar;䀤f;쀀𝕕ʀ;emps̋ᴭᴷᴽᵂqĀ;d͒ᴳot;扑inus;戸lus;戔quare;抡blebarwedgåúnƀadhᄮᵝᵧownarrowóᲃarpoonĀlrᵲᵶefôᲴighôᲶŢᵿᶅkaro÷གɯᶊ\0\0ᶎrn;挟op;挌ƀcotᶘᶣᶦĀryᶝᶡ;쀀𝒹;䑕l;槶rok;䄑Ādrᶰᶴot;拱iĀ;fᶺ᠖斿Āah᷀᷃ròЩaòྦangle;榦Āci᷒ᷕy;䑟grarr;柿ऀDacdefglmnopqrstuxḁḉḙḸոḼṉṡṾấắẽỡἪἷὄ὎὚ĀDoḆᴴoôᲉĀcsḎḔute耻é䃩ter;橮ȀaioyḢḧḱḶron;䄛rĀ;cḭḮ扖耻ê䃪lon;払;䑍ot;䄗ĀDrṁṅot;扒;쀀𝔢ƀ;rsṐṑṗ檚ave耻è䃨Ā;dṜṝ檖ot;檘Ȁ;ilsṪṫṲṴ檙nters;揧;愓Ā;dṹṺ檕ot;檗ƀapsẅẉẗcr;䄓tyƀ;svẒẓẕ戅et»ẓpĀ1;ẝẤĳạả;怄;怅怃ĀgsẪẬ;䅋p;怂ĀgpẴẸon;䄙f;쀀𝕖ƀalsỄỎỒrĀ;sỊị拕l;槣us;橱iƀ;lvỚớở䎵on»ớ;䏵ȀcsuvỪỳἋἣĀioữḱrc»Ḯɩỹ\0\0ỻíՈantĀglἂἆtr»ṝess»Ṻƀaeiἒ἖Ἒls;䀽st;扟vĀ;DȵἠD;橸parsl;槥ĀDaἯἳot;打rr;楱ƀcdiἾὁỸr;愯oô͒ĀahὉὋ;䎷耻ð䃰Āmrὓὗl耻ë䃫o;悬ƀcipὡὤὧl;䀡sôծĀeoὬὴctatioîՙnentialåչৡᾒ\0ᾞ\0ᾡᾧ\0\0ῆῌ\0ΐ\0ῦῪ \0 ⁚llingdotseñṄy;䑄male;晀ƀilrᾭᾳ῁lig;耀ﬃɩᾹ\0\0᾽g;耀ﬀig;耀ﬄ;쀀𝔣lig;耀ﬁlig;쀀fjƀaltῙ῜ῡt;晭ig;耀ﬂns;斱of;䆒ǰ΅\0ῳf;쀀𝕗ĀakֿῷĀ;vῼ´拔;櫙artint;樍Āao‌⁕Ācs‑⁒α‚‰‸⁅⁈\0⁐β•‥‧‪‬\0‮耻½䂽;慓耻¼䂼;慕;慙;慛Ƴ‴\0‶;慔;慖ʴ‾⁁\0\0⁃耻¾䂾;慗;慜5;慘ƶ⁌\0⁎;慚;慝8;慞l;恄wn;挢cr;쀀𝒻ࢀEabcdefgijlnorstv₂₉₟₥₰₴⃰⃵⃺⃿℃ℒℸ̗ℾ⅒↞Ā;lٍ₇;檌ƀcmpₐₕ₝ute;䇵maĀ;dₜ᳚䎳;檆reve;䄟Āiy₪₮rc;䄝;䐳ot;䄡Ȁ;lqsؾق₽⃉ƀ;qsؾٌ⃄lanô٥Ȁ;cdl٥⃒⃥⃕c;檩otĀ;o⃜⃝檀Ā;l⃢⃣檂;檄Ā;e⃪⃭쀀⋛︀s;檔r;쀀𝔤Ā;gٳ؛mel;愷cy;䑓Ȁ;Eajٚℌℎℐ;檒;檥;檤ȀEaesℛℝ℩ℴ;扩pĀ;p℣ℤ檊rox»ℤĀ;q℮ℯ檈Ā;q℮ℛim;拧pf;쀀𝕘Āci⅃ⅆr;愊mƀ;el٫ⅎ⅐;檎;檐茀>;cdlqr׮ⅠⅪⅮⅳⅹĀciⅥⅧ;檧r;橺ot;拗Par;榕uest;橼ʀadelsↄⅪ←ٖ↛ǰ↉\0↎proø₞r;楸qĀlqؿ↖lesó₈ií٫Āen↣↭rtneqq;쀀≩︀Å↪ԀAabcefkosy⇄⇇⇱⇵⇺∘∝∯≨≽ròΠȀilmr⇐⇔⇗⇛rsðᒄf»․ilôکĀdr⇠⇤cy;䑊ƀ;cwࣴ⇫⇯ir;楈;憭ar;意irc;䄥ƀalr∁∎∓rtsĀ;u∉∊晥it»∊lip;怦con;抹r;쀀𝔥sĀew∣∩arow;椥arow;椦ʀamopr∺∾≃≞≣rr;懿tht;戻kĀlr≉≓eftarrow;憩ightarrow;憪f;쀀𝕙bar;怕ƀclt≯≴≸r;쀀𝒽asè⇴rok;䄧Ābp⊂⊇ull;恃hen»ᱛૡ⊣\0⊪\0⊸⋅⋎\0⋕⋳\0\0⋸⌢⍧⍢⍿\0⎆⎪⎴cute耻í䃭ƀ;iyݱ⊰⊵rc耻î䃮;䐸Ācx⊼⊿y;䐵cl耻¡䂡ĀfrΟ⋉;쀀𝔦rave耻ì䃬Ȁ;inoܾ⋝⋩⋮Āin⋢⋦nt;樌t;戭fin;槜ta;愩lig;䄳ƀaop⋾⌚⌝ƀcgt⌅⌈⌗r;䄫ƀelpܟ⌏⌓inåގarôܠh;䄱f;抷ed;䆵ʀ;cfotӴ⌬⌱⌽⍁are;愅inĀ;t⌸⌹戞ie;槝doô⌙ʀ;celpݗ⍌⍐⍛⍡al;抺Āgr⍕⍙eróᕣã⍍arhk;樗rod;樼Ȁcgpt⍯⍲⍶⍻y;䑑on;䄯f;쀀𝕚a;䎹uest耻¿䂿Āci⎊⎏r;쀀𝒾nʀ;EdsvӴ⎛⎝⎡ӳ;拹ot;拵Ā;v⎦⎧拴;拳Ā;iݷ⎮lde;䄩ǫ⎸\0⎼cy;䑖l耻ï䃯̀cfmosu⏌⏗⏜⏡⏧⏵Āiy⏑⏕rc;䄵;䐹r;쀀𝔧ath;䈷pf;쀀𝕛ǣ⏬\0⏱r;쀀𝒿rcy;䑘kcy;䑔Ѐacfghjos␋␖␢␧␭␱␵␻ppaĀ;v␓␔䎺;䏰Āey␛␠dil;䄷;䐺r;쀀𝔨reen;䄸cy;䑅cy;䑜pf;쀀𝕜cr;쀀𝓀஀ABEHabcdefghjlmnoprstuv⑰⒁⒆⒍⒑┎┽╚▀♎♞♥♹♽⚚⚲⛘❝❨➋⟀⠁⠒ƀart⑷⑺⑼rò৆òΕail;椛arr;椎Ā;gঔ⒋;檋ar;楢ॣ⒥\0⒪\0⒱\0\0\0\0\0⒵Ⓔ\0ⓆⓈⓍ\0⓹ute;䄺mptyv;榴raîࡌbda;䎻gƀ;dlࢎⓁⓃ;榑åࢎ;檅uo耻«䂫rЀ;bfhlpst࢙ⓞⓦⓩ⓫⓮⓱⓵Ā;f࢝ⓣs;椟s;椝ë≒p;憫l;椹im;楳l;憢ƀ;ae⓿─┄檫il;椙Ā;s┉┊檭;쀀⪭︀ƀabr┕┙┝rr;椌rk;杲Āak┢┬cĀek┨┪;䁻;䁛Āes┱┳;榋lĀdu┹┻;榏;榍Ȁaeuy╆╋╖╘ron;䄾Ādi═╔il;䄼ìࢰâ┩;䐻Ȁcqrs╣╦╭╽a;椶uoĀ;rนᝆĀdu╲╷har;楧shar;楋h;憲ʀ;fgqs▋▌উ◳◿扤tʀahlrt▘▤▷◂◨rrowĀ;t࢙□aé⓶arpoonĀdu▯▴own»њp»०eftarrows;懇ightƀahs◍◖◞rrowĀ;sࣴࢧarpoonó྘quigarro÷⇰hreetimes;拋ƀ;qs▋ও◺lanôবʀ;cdgsব☊☍☝☨c;檨otĀ;o☔☕橿Ā;r☚☛檁;檃Ā;e☢☥쀀⋚︀s;檓ʀadegs☳☹☽♉♋pproøⓆot;拖qĀgq♃♅ôউgtò⒌ôছiíলƀilr♕࣡♚sht;楼;쀀𝔩Ā;Eজ♣;檑š♩♶rĀdu▲♮Ā;l॥♳;楪lk;斄cy;䑙ʀ;achtੈ⚈⚋⚑⚖rò◁orneòᴈard;楫ri;旺Āio⚟⚤dot;䅀ustĀ;a⚬⚭掰che»⚭ȀEaes⚻⚽⛉⛔;扨pĀ;p⛃⛄檉rox»⛄Ā;q⛎⛏檇Ā;q⛎⚻im;拦Ѐabnoptwz⛩⛴⛷✚✯❁❇❐Ānr⛮⛱g;柬r;懽rëࣁgƀlmr⛿✍✔eftĀar০✇ightá৲apsto;柼ightá৽parrowĀlr✥✩efô⓭ight;憬ƀafl✶✹✽r;榅;쀀𝕝us;樭imes;樴š❋❏st;戗áፎƀ;ef❗❘᠀旊nge»❘arĀ;l❤❥䀨t;榓ʀachmt❳❶❼➅➇ròࢨorneòᶌarĀ;d྘➃;業;怎ri;抿̀achiqt➘➝ੀ➢➮➻quo;怹r;쀀𝓁mƀ;egল➪➬;檍;檏Ābu┪➳oĀ;rฟ➹;怚rok;䅂萀<;cdhilqrࠫ⟒☹⟜⟠⟥⟪⟰Āci⟗⟙;檦r;橹reå◲mes;拉arr;楶uest;橻ĀPi⟵⟹ar;榖ƀ;ef⠀भ᠛旃rĀdu⠇⠍shar;楊har;楦Āen⠗⠡rtneqq;쀀≨︀Å⠞܀Dacdefhilnopsu⡀⡅⢂⢎⢓⢠⢥⢨⣚⣢⣤ઃ⣳⤂Dot;戺Ȁclpr⡎⡒⡣⡽r耻¯䂯Āet⡗⡙;時Ā;e⡞⡟朠se»⡟Ā;sျ⡨toȀ;dluျ⡳⡷⡻owîҌefôएðᏑker;斮Āoy⢇⢌mma;権;䐼ash;怔asuredangle»ᘦr;쀀𝔪o;愧ƀcdn⢯⢴⣉ro耻µ䂵Ȁ;acdᑤ⢽⣀⣄sôᚧir;櫰ot肻·Ƶusƀ;bd⣒ᤃ⣓戒Ā;uᴼ⣘;横ţ⣞⣡p;櫛ò−ðઁĀdp⣩⣮els;抧f;쀀𝕞Āct⣸⣽r;쀀𝓂pos»ᖝƀ;lm⤉⤊⤍䎼timap;抸ఀGLRVabcdefghijlmoprstuvw⥂⥓⥾⦉⦘⧚⧩⨕⨚⩘⩝⪃⪕⪤⪨⬄⬇⭄⭿⮮ⰴⱧⱼ⳩Āgt⥇⥋;쀀⋙̸Ā;v⥐௏쀀≫⃒ƀelt⥚⥲⥶ftĀar⥡⥧rrow;懍ightarrow;懎;쀀⋘̸Ā;v⥻ే쀀≪⃒ightarrow;懏ĀDd⦎⦓ash;抯ash;抮ʀbcnpt⦣⦧⦬⦱⧌la»˞ute;䅄g;쀀∠⃒ʀ;Eiop඄⦼⧀⧅⧈;쀀⩰̸d;쀀≋̸s;䅉roø඄urĀ;a⧓⧔普lĀ;s⧓ସǳ⧟\0⧣p肻 ଷmpĀ;e௹ఀʀaeouy⧴⧾⨃⨐⨓ǰ⧹\0⧻;橃on;䅈dil;䅆ngĀ;dൾ⨊ot;쀀⩭̸p;橂;䐽ash;怓΀;Aadqsxஒ⨩⨭⨻⩁⩅⩐rr;懗rĀhr⨳⨶k;椤Ā;oᏲᏰot;쀀≐̸uiöୣĀei⩊⩎ar;椨í஘istĀ;s஠டr;쀀𝔫ȀEest௅⩦⩹⩼ƀ;qs஼⩭௡ƀ;qs஼௅⩴lanô௢ií௪Ā;rஶ⪁»ஷƀAap⪊⪍⪑rò⥱rr;憮ar;櫲ƀ;svྍ⪜ྌĀ;d⪡⪢拼;拺cy;䑚΀AEadest⪷⪺⪾⫂⫅⫶⫹rò⥦;쀀≦̸rr;憚r;急Ȁ;fqs఻⫎⫣⫯tĀar⫔⫙rro÷⫁ightarro÷⪐ƀ;qs఻⪺⫪lanôౕĀ;sౕ⫴»శiíౝĀ;rవ⫾iĀ;eచథiäඐĀpt⬌⬑f;쀀𝕟膀¬;in⬙⬚⬶䂬nȀ;Edvஉ⬤⬨⬮;쀀⋹̸ot;쀀⋵̸ǡஉ⬳⬵;拷;拶iĀ;vಸ⬼ǡಸ⭁⭃;拾;拽ƀaor⭋⭣⭩rȀ;ast୻⭕⭚⭟lleì୻l;쀀⫽⃥;쀀∂̸lint;樔ƀ;ceಒ⭰⭳uåಥĀ;cಘ⭸Ā;eಒ⭽ñಘȀAait⮈⮋⮝⮧rò⦈rrƀ;cw⮔⮕⮙憛;쀀⤳̸;쀀↝̸ghtarrow»⮕riĀ;eೋೖ΀chimpqu⮽⯍⯙⬄୸⯤⯯Ȁ;cerല⯆ഷ⯉uå൅;쀀𝓃ortɭ⬅\0\0⯖ará⭖mĀ;e൮⯟Ā;q൴൳suĀbp⯫⯭å೸åഋƀbcp⯶ⰑⰙȀ;Ees⯿ⰀഢⰄ抄;쀀⫅̸etĀ;eഛⰋqĀ;qണⰀcĀ;eലⰗñസȀ;EesⰢⰣൟⰧ抅;쀀⫆̸etĀ;e൘ⰮqĀ;qൠⰣȀgilrⰽⰿⱅⱇìௗlde耻ñ䃱çృiangleĀlrⱒⱜeftĀ;eచⱚñదightĀ;eೋⱥñ೗Ā;mⱬⱭ䎽ƀ;esⱴⱵⱹ䀣ro;愖p;怇ҀDHadgilrsⲏⲔⲙⲞⲣⲰⲶⳓⳣash;抭arr;椄p;쀀≍⃒ash;抬ĀetⲨⲬ;쀀≥⃒;쀀>⃒nfin;槞ƀAetⲽⳁⳅrr;椂;쀀≤⃒Ā;rⳊⳍ쀀<⃒ie;쀀⊴⃒ĀAtⳘⳜrr;椃rie;쀀⊵⃒im;쀀∼⃒ƀAan⳰⳴ⴂrr;懖rĀhr⳺⳽k;椣Ā;oᏧᏥear;椧ቓ᪕\0\0\0\0\0\0\0\0\0\0\0\0\0ⴭ\0ⴸⵈⵠⵥ⵲ⶄᬇ\0\0ⶍⶫ\0ⷈⷎ\0ⷜ⸙⸫⸾⹃Ācsⴱ᪗ute耻ó䃳ĀiyⴼⵅrĀ;c᪞ⵂ耻ô䃴;䐾ʀabios᪠ⵒⵗǈⵚlac;䅑v;樸old;榼lig;䅓Ācr⵩⵭ir;榿;쀀𝔬ͯ⵹\0\0⵼\0ⶂn;䋛ave耻ò䃲;槁Ābmⶈ෴ar;榵Ȁacitⶕ⶘ⶥⶨrò᪀Āir⶝ⶠr;榾oss;榻nå๒;槀ƀaeiⶱⶵⶹcr;䅍ga;䏉ƀcdnⷀⷅǍron;䎿;榶pf;쀀𝕠ƀaelⷔ⷗ǒr;榷rp;榹΀;adiosvⷪⷫⷮ⸈⸍⸐⸖戨rò᪆Ȁ;efmⷷⷸ⸂⸅橝rĀ;oⷾⷿ愴f»ⷿ耻ª䂪耻º䂺gof;抶r;橖lope;橗;橛ƀclo⸟⸡⸧ò⸁ash耻ø䃸l;折iŬⸯ⸴de耻õ䃵esĀ;aǛ⸺s;樶ml耻ö䃶bar;挽ૡ⹞\0⹽\0⺀⺝\0⺢⺹\0\0⻋ຜ\0⼓\0\0⼫⾼\0⿈rȀ;astЃ⹧⹲຅脀¶;l⹭⹮䂶leìЃɩ⹸\0\0⹻m;櫳;櫽y;䐿rʀcimpt⺋⺏⺓ᡥ⺗nt;䀥od;䀮il;怰enk;怱r;쀀𝔭ƀimo⺨⺰⺴Ā;v⺭⺮䏆;䏕maô੶ne;明ƀ;tv⺿⻀⻈䏀chfork»´;䏖Āau⻏⻟nĀck⻕⻝kĀ;h⇴⻛;愎ö⇴sҀ;abcdemst⻳⻴ᤈ⻹⻽⼄⼆⼊⼎䀫cir;樣ir;樢Āouᵀ⼂;樥;橲n肻±ຝim;樦wo;樧ƀipu⼙⼠⼥ntint;樕f;쀀𝕡nd耻£䂣Ԁ;Eaceinosu່⼿⽁⽄⽇⾁⾉⾒⽾⾶;檳p;檷uå໙Ā;c໎⽌̀;acens່⽙⽟⽦⽨⽾pproø⽃urlyeñ໙ñ໎ƀaes⽯⽶⽺pprox;檹qq;檵im;拨iíໟmeĀ;s⾈ຮ怲ƀEas⽸⾐⽺ð⽵ƀdfp໬⾙⾯ƀals⾠⾥⾪lar;挮ine;挒urf;挓Ā;t໻⾴ï໻rel;抰Āci⿀⿅r;쀀𝓅;䏈ncsp;怈̀fiopsu⿚⋢⿟⿥⿫⿱r;쀀𝔮pf;쀀𝕢rime;恗cr;쀀𝓆ƀaeo⿸〉〓tĀei⿾々rnionóڰnt;樖stĀ;e【】䀿ñἙô༔઀ABHabcdefhilmnoprstux぀けさすムㄎㄫㅇㅢㅲㆎ㈆㈕㈤㈩㉘㉮㉲㊐㊰㊷ƀartぇおがròႳòϝail;検aròᱥar;楤΀cdenqrtとふへみわゔヌĀeuねぱ;쀀∽̱te;䅕iãᅮmptyv;榳gȀ;del࿑らるろ;榒;榥å࿑uo耻»䂻rր;abcfhlpstw࿜ガクシスゼゾダッデナp;極Ā;f࿠ゴs;椠;椳s;椞ë≝ð✮l;楅im;楴l;憣;憝Āaiパフil;椚oĀ;nホボ戶aló༞ƀabrョリヮrò៥rk;杳ĀakンヽcĀekヹ・;䁽;䁝Āes㄂㄄;榌lĀduㄊㄌ;榎;榐Ȁaeuyㄗㄜㄧㄩron;䅙Ādiㄡㄥil;䅗ì࿲âヺ;䑀Ȁclqsㄴㄷㄽㅄa;椷dhar;楩uoĀ;rȎȍh;憳ƀacgㅎㅟངlȀ;ipsླྀㅘㅛႜnåႻarôྩt;断ƀilrㅩဣㅮsht;楽;쀀𝔯ĀaoㅷㆆrĀduㅽㅿ»ѻĀ;l႑ㆄ;楬Ā;vㆋㆌ䏁;䏱ƀgns㆕ㇹㇼht̀ahlrstㆤㆰ㇂㇘㇤㇮rrowĀ;t࿜ㆭaéトarpoonĀduㆻㆿowîㅾp»႒eftĀah㇊㇐rrowó࿪arpoonóՑightarrows;應quigarro÷ニhreetimes;拌g;䋚ingdotseñἲƀahm㈍㈐㈓rò࿪aòՑ;怏oustĀ;a㈞㈟掱che»㈟mid;櫮Ȁabpt㈲㈽㉀㉒Ānr㈷㈺g;柭r;懾rëဃƀafl㉇㉊㉎r;榆;쀀𝕣us;樮imes;樵Āap㉝㉧rĀ;g㉣㉤䀩t;榔olint;樒arò㇣Ȁachq㉻㊀Ⴜ㊅quo;怺r;쀀𝓇Ābu・㊊oĀ;rȔȓƀhir㊗㊛㊠reåㇸmes;拊iȀ;efl㊪ၙᠡ㊫方tri;槎luhar;楨;愞ൡ㋕㋛㋟㌬㌸㍱\0㍺㎤\0\0㏬㏰\0㐨㑈㑚㒭㒱㓊㓱\0㘖\0\0㘳cute;䅛quï➺Ԁ;Eaceinpsyᇭ㋳㋵㋿㌂㌋㌏㌟㌦㌩;檴ǰ㋺\0㋼;檸on;䅡uåᇾĀ;dᇳ㌇il;䅟rc;䅝ƀEas㌖㌘㌛;檶p;檺im;择olint;樓iíሄ;䑁otƀ;be㌴ᵇ㌵担;橦΀Aacmstx㍆㍊㍗㍛㍞㍣㍭rr;懘rĀhr㍐㍒ë∨Ā;oਸ਼਴t耻§䂧i;䀻war;椩mĀin㍩ðnuóñt;朶rĀ;o㍶⁕쀀𝔰Ȁacoy㎂㎆㎑㎠rp;景Āhy㎋㎏cy;䑉;䑈rtɭ㎙\0\0㎜iäᑤaraì⹯耻­䂭Āgm㎨㎴maƀ;fv㎱㎲㎲䏃;䏂Ѐ;deglnprካ㏅㏉㏎㏖㏞㏡㏦ot;橪Ā;q኱ኰĀ;E㏓㏔檞;檠Ā;E㏛㏜檝;檟e;扆lus;樤arr;楲aròᄽȀaeit㏸㐈㐏㐗Āls㏽㐄lsetmé㍪hp;樳parsl;槤Ādlᑣ㐔e;挣Ā;e㐜㐝檪Ā;s㐢㐣檬;쀀⪬︀ƀflp㐮㐳㑂tcy;䑌Ā;b㐸㐹䀯Ā;a㐾㐿槄r;挿f;쀀𝕤aĀdr㑍ЂesĀ;u㑔㑕晠it»㑕ƀcsu㑠㑹㒟Āau㑥㑯pĀ;sᆈ㑫;쀀⊓︀pĀ;sᆴ㑵;쀀⊔︀uĀbp㑿㒏ƀ;esᆗᆜ㒆etĀ;eᆗ㒍ñᆝƀ;esᆨᆭ㒖etĀ;eᆨ㒝ñᆮƀ;afᅻ㒦ְrť㒫ֱ»ᅼaròᅈȀcemt㒹㒾㓂㓅r;쀀𝓈tmîñiì㐕aræᆾĀar㓎㓕rĀ;f㓔ឿ昆Āan㓚㓭ightĀep㓣㓪psiloîỠhé⺯s»⡒ʀbcmnp㓻㕞ሉ㖋㖎Ҁ;Edemnprs㔎㔏㔑㔕㔞㔣㔬㔱㔶抂;櫅ot;檽Ā;dᇚ㔚ot;櫃ult;櫁ĀEe㔨㔪;櫋;把lus;檿arr;楹ƀeiu㔽㕒㕕tƀ;en㔎㕅㕋qĀ;qᇚ㔏eqĀ;q㔫㔨m;櫇Ābp㕚㕜;櫕;櫓c̀;acensᇭ㕬㕲㕹㕻㌦pproø㋺urlyeñᇾñᇳƀaes㖂㖈㌛pproø㌚qñ㌗g;晪ڀ123;Edehlmnps㖩㖬㖯ሜ㖲㖴㗀㗉㗕㗚㗟㗨㗭耻¹䂹耻²䂲耻³䂳;櫆Āos㖹㖼t;檾ub;櫘Ā;dሢ㗅ot;櫄sĀou㗏㗒l;柉b;櫗arr;楻ult;櫂ĀEe㗤㗦;櫌;抋lus;櫀ƀeiu㗴㘉㘌tƀ;enሜ㗼㘂qĀ;qሢ㖲eqĀ;q㗧㗤m;櫈Ābp㘑㘓;櫔;櫖ƀAan㘜㘠㘭rr;懙rĀhr㘦㘨ë∮Ā;oਫ਩war;椪lig耻ß䃟௡㙑㙝㙠ዎ㙳㙹\0㙾㛂\0\0\0\0\0㛛㜃\0㜉㝬\0\0\0㞇ɲ㙖\0\0㙛get;挖;䏄rë๟ƀaey㙦㙫㙰ron;䅥dil;䅣;䑂lrec;挕r;쀀𝔱Ȁeiko㚆㚝㚵㚼ǲ㚋\0㚑eĀ4fኄኁaƀ;sv㚘㚙㚛䎸ym;䏑Ācn㚢㚲kĀas㚨㚮pproø዁im»ኬsðኞĀas㚺㚮ð዁rn耻þ䃾Ǭ̟㛆⋧es膀×;bd㛏㛐㛘䃗Ā;aᤏ㛕r;樱;樰ƀeps㛡㛣㜀á⩍Ȁ;bcf҆㛬㛰㛴ot;挶ir;櫱Ā;o㛹㛼쀀𝕥rk;櫚á㍢rime;怴ƀaip㜏㜒㝤dåቈ΀adempst㜡㝍㝀㝑㝗㝜㝟ngleʀ;dlqr㜰㜱㜶㝀㝂斵own»ᶻeftĀ;e⠀㜾ñम;扜ightĀ;e㊪㝋ñၚot;旬inus;樺lus;樹b;槍ime;樻ezium;揢ƀcht㝲㝽㞁Āry㝷㝻;쀀𝓉;䑆cy;䑛rok;䅧Āio㞋㞎xô᝷headĀlr㞗㞠eftarro÷ࡏightarrow»ཝऀAHabcdfghlmoprstuw㟐㟓㟗㟤㟰㟼㠎㠜㠣㠴㡑㡝㡫㢩㣌㣒㣪㣶ròϭar;楣Ācr㟜㟢ute耻ú䃺òᅐrǣ㟪\0㟭y;䑞ve;䅭Āiy㟵㟺rc耻û䃻;䑃ƀabh㠃㠆㠋ròᎭlac;䅱aòᏃĀir㠓㠘sht;楾;쀀𝔲rave耻ù䃹š㠧㠱rĀlr㠬㠮»ॗ»ႃlk;斀Āct㠹㡍ɯ㠿\0\0㡊rnĀ;e㡅㡆挜r»㡆op;挏ri;旸Āal㡖㡚cr;䅫肻¨͉Āgp㡢㡦on;䅳f;쀀𝕦̀adhlsuᅋ㡸㡽፲㢑㢠ownáᎳarpoonĀlr㢈㢌efô㠭ighô㠯iƀ;hl㢙㢚㢜䏅»ᏺon»㢚parrows;懈ƀcit㢰㣄㣈ɯ㢶\0\0㣁rnĀ;e㢼㢽挝r»㢽op;挎ng;䅯ri;旹cr;쀀𝓊ƀdir㣙㣝㣢ot;拰lde;䅩iĀ;f㜰㣨»᠓Āam㣯㣲rò㢨l耻ü䃼angle;榧ހABDacdeflnoprsz㤜㤟㤩㤭㦵㦸㦽㧟㧤㧨㧳㧹㧽㨁㨠ròϷarĀ;v㤦㤧櫨;櫩asèϡĀnr㤲㤷grt;榜΀eknprst㓣㥆㥋㥒㥝㥤㦖appá␕othinçẖƀhir㓫⻈㥙opô⾵Ā;hᎷ㥢ïㆍĀiu㥩㥭gmá㎳Ābp㥲㦄setneqĀ;q㥽㦀쀀⊊︀;쀀⫋︀setneqĀ;q㦏㦒쀀⊋︀;쀀⫌︀Āhr㦛㦟etá㚜iangleĀlr㦪㦯eft»थight»ၑy;䐲ash»ံƀelr㧄㧒㧗ƀ;beⷪ㧋㧏ar;抻q;扚lip;拮Ābt㧜ᑨaòᑩr;쀀𝔳tré㦮suĀbp㧯㧱»ജ»൙pf;쀀𝕧roð໻tré㦴Ācu㨆㨋r;쀀𝓋Ābp㨐㨘nĀEe㦀㨖»㥾nĀEe㦒㨞»㦐igzag;榚΀cefoprs㨶㨻㩖㩛㩔㩡㩪irc;䅵Ādi㩀㩑Ābg㩅㩉ar;機eĀ;qᗺ㩏;扙erp;愘r;쀀𝔴pf;쀀𝕨Ā;eᑹ㩦atèᑹcr;쀀𝓌ૣណ㪇\0㪋\0㪐㪛\0\0㪝㪨㪫㪯\0\0㫃㫎\0㫘ៜ៟tré៑r;쀀𝔵ĀAa㪔㪗ròσrò৶;䎾ĀAa㪡㪤ròθrò৫að✓is;拻ƀdptឤ㪵㪾Āfl㪺ឩ;쀀𝕩imåឲĀAa㫇㫊ròώròਁĀcq㫒ីr;쀀𝓍Āpt៖㫜ré។Ѐacefiosu㫰㫽㬈㬌㬑㬕㬛㬡cĀuy㫶㫻te耻ý䃽;䑏Āiy㬂㬆rc;䅷;䑋n耻¥䂥r;쀀𝔶cy;䑗pf;쀀𝕪cr;쀀𝓎Ācm㬦㬩y;䑎l耻ÿ䃿Ԁacdefhiosw㭂㭈㭔㭘㭤㭩㭭㭴㭺㮀cute;䅺Āay㭍㭒ron;䅾;䐷ot;䅼Āet㭝㭡træᕟa;䎶r;쀀𝔷cy;䐶grarr;懝pf;쀀𝕫cr;쀀𝓏Ājn㮅㮇;怍j;怌'.split("").map((function(e){return e.charCodeAt(0)})));})),D=m((function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.default=new Uint16Array("Ȁaglq\tɭ\0\0p;䀦os;䀧t;䀾t;䀼uot;䀢".split("").map((function(e){return e.charCodeAt(0)})));})),S=m((function(e,t){var s;Object.defineProperty(t,"__esModule",{value:!0}),t.replaceCodePoint=t.fromCodePoint=void 0;var a=new Map([[0,65533],[128,8364],[130,8218],[131,402],[132,8222],[133,8230],[134,8224],[135,8225],[136,710],[137,8240],[138,352],[139,8249],[140,338],[142,381],[145,8216],[146,8217],[147,8220],[148,8221],[149,8226],[150,8211],[151,8212],[152,732],[153,8482],[154,353],[155,8250],[156,339],[158,382],[159,376]]);function r(e){var t;return e>=55296&&e<=57343||e>1114111?65533:null!==(t=a.get(e))&&void 0!==t?t:e}t.fromCodePoint=null!==(s=String.fromCodePoint)&&void 0!==s?s:function(e){var t="";return e>65535&&(e-=65536,t+=String.fromCharCode(e>>>10&1023|55296),e=56320|1023&e),t+String.fromCharCode(e)},t.replaceCodePoint=r,t.default=function(e){return (0, t.fromCodePoint)(r(e))};})),R=m((function(e,t){var s=l&&l.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.decodeXML=t.decodeHTMLStrict=t.decodeHTML=t.determineBranch=t.BinTrieFlags=t.fromCodePoint=t.replaceCodePoint=t.decodeCodePoint=t.xmlDecodeTree=t.htmlDecodeTree=void 0;var a=s(C);t.htmlDecodeTree=a.default;var r=s(D);t.xmlDecodeTree=r.default;var n=s(S);t.decodeCodePoint=n.default;var i,o,c=S;function E(e){return function(t,s){for(var a="",r=0,c=0;(c=t.indexOf("&",c))>=0;)if(a+=t.slice(r,c),r=c,c+=1,t.charCodeAt(c)!==i.NUM){for(var E=0,h=1,_=0,A=e[_];c<t.length&&!((_=T(e,A,_+1,t.charCodeAt(c)))<0);c++,h++){var l=(A=e[_])&o.VALUE_LENGTH;if(l){var m;if(s&&t.charCodeAt(c)!==i.SEMI||(E=_,h=0),0==(m=(l>>14)-1))break;_+=m;}}0!==E&&(a+=1==(m=(e[E]&o.VALUE_LENGTH)>>14)?String.fromCharCode(e[E]&~o.VALUE_LENGTH):2===m?String.fromCharCode(e[E+1]):String.fromCharCode(e[E+1],e[E+2]),r=c-h+1);}else {var p=c+1,d=10,I=t.charCodeAt(p);(I|i.To_LOWER_BIT)===i.LOWER_X&&(d=16,c+=1,p+=1);do{I=t.charCodeAt(++c);}while(I>=i.ZERO&&I<=i.NINE||16===d&&(I|i.To_LOWER_BIT)>=i.LOWER_A&&(I|i.To_LOWER_BIT)<=i.LOWER_F);if(p!==c){var N=t.substring(p,c),u=parseInt(N,d);if(t.charCodeAt(c)===i.SEMI)c+=1;else if(s)continue;a+=(0, n.default)(u),r=c;}}return a+t.slice(r)}}function T(e,t,s,a){var r=(t&o.BRANCH_LENGTH)>>7,n=t&o.JUMP_TABLE;if(0===r)return 0!==n&&a===n?s:-1;if(n){var i=a-n;return i<0||i>=r?-1:e[s+i]-1}for(var c=s,E=c+r-1;c<=E;){var T=c+E>>>1,h=e[T];if(h<a)c=T+1;else {if(!(h>a))return e[T+r];E=T-1;}}return -1}Object.defineProperty(t,"replaceCodePoint",{enumerable:!0,get:function(){return c.replaceCodePoint}}),Object.defineProperty(t,"fromCodePoint",{enumerable:!0,get:function(){return c.fromCodePoint}}),function(e){e[e.NUM=35]="NUM",e[e.SEMI=59]="SEMI",e[e.ZERO=48]="ZERO",e[e.NINE=57]="NINE",e[e.LOWER_A=97]="LOWER_A",e[e.LOWER_F=102]="LOWER_F",e[e.LOWER_X=120]="LOWER_X",e[e.To_LOWER_BIT=32]="To_LOWER_BIT";}(i||(i={})),function(e){e[e.VALUE_LENGTH=49152]="VALUE_LENGTH",e[e.BRANCH_LENGTH=16256]="BRANCH_LENGTH",e[e.JUMP_TABLE=127]="JUMP_TABLE";}(o=t.BinTrieFlags||(t.BinTrieFlags={})),t.determineBranch=T;var h=E(a.default),_=E(r.default);t.decodeHTML=function(e){return h(e,!1)},t.decodeHTMLStrict=function(e){return h(e,!0)},t.decodeXML=function(e){return _(e,!0)};}));!function(e){e.HTML="http://www.w3.org/1999/xhtml",e.MATHML="http://www.w3.org/1998/Math/MathML",e.SVG="http://www.w3.org/2000/svg",e.XLINK="http://www.w3.org/1999/xlink",e.XML="http://www.w3.org/XML/1998/namespace",e.XMLNS="http://www.w3.org/2000/xmlns/";}(p=p||(p={})),function(e){e.TYPE="type",e.ACTION="action",e.ENCODING="encoding",e.PROMPT="prompt",e.NAME="name",e.COLOR="color",e.FACE="face",e.SIZE="size";}(d=d||(d={})),function(e){e.NO_QUIRKS="no-quirks",e.QUIRKS="quirks",e.LIMITED_QUIRKS="limited-quirks";}(I=I||(I={})),function(e){e.A="a",e.ADDRESS="address",e.ANNOTATION_XML="annotation-xml",e.APPLET="applet",e.AREA="area",e.ARTICLE="article",e.ASIDE="aside",e.B="b",e.BASE="base",e.BASEFONT="basefont",e.BGSOUND="bgsound",e.BIG="big",e.BLOCKQUOTE="blockquote",e.BODY="body",e.BR="br",e.BUTTON="button",e.CAPTION="caption",e.CENTER="center",e.CODE="code",e.COL="col",e.COLGROUP="colgroup",e.DD="dd",e.DESC="desc",e.DETAILS="details",e.DIALOG="dialog",e.DIR="dir",e.DIV="div",e.DL="dl",e.DT="dt",e.EM="em",e.EMBED="embed",e.FIELDSET="fieldset",e.FIGCAPTION="figcaption",e.FIGURE="figure",e.FONT="font",e.FOOTER="footer",e.FOREIGN_OBJECT="foreignObject",e.FORM="form",e.FRAME="frame",e.FRAMESET="frameset",e.H1="h1",e.H2="h2",e.H3="h3",e.H4="h4",e.H5="h5",e.H6="h6",e.HEAD="head",e.HEADER="header",e.HGROUP="hgroup",e.HR="hr",e.HTML="html",e.I="i",e.IMG="img",e.IMAGE="image",e.INPUT="input",e.IFRAME="iframe",e.KEYGEN="keygen",e.LABEL="label",e.LI="li",e.LINK="link",e.LISTING="listing",e.MAIN="main",e.MALIGNMARK="malignmark",e.MARQUEE="marquee",e.MATH="math",e.MENU="menu",e.META="meta",e.MGLYPH="mglyph",e.MI="mi",e.MO="mo",e.MN="mn",e.MS="ms",e.MTEXT="mtext",e.NAV="nav",e.NOBR="nobr",e.NOFRAMES="noframes",e.NOEMBED="noembed",e.NOSCRIPT="noscript",e.OBJECT="object",e.OL="ol",e.OPTGROUP="optgroup",e.OPTION="option",e.P="p",e.PARAM="param",e.PLAINTEXT="plaintext",e.PRE="pre",e.RB="rb",e.RP="rp",e.RT="rt",e.RTC="rtc",e.RUBY="ruby",e.S="s",e.SCRIPT="script",e.SECTION="section",e.SELECT="select",e.SOURCE="source",e.SMALL="small",e.SPAN="span",e.STRIKE="strike",e.STRONG="strong",e.STYLE="style",e.SUB="sub",e.SUMMARY="summary",e.SUP="sup",e.TABLE="table",e.TBODY="tbody",e.TEMPLATE="template",e.TEXTAREA="textarea",e.TFOOT="tfoot",e.TD="td",e.TH="th",e.THEAD="thead",e.TITLE="title",e.TR="tr",e.TRACK="track",e.TT="tt",e.U="u",e.UL="ul",e.SVG="svg",e.VAR="var",e.WBR="wbr",e.XMP="xmp";}(N=N||(N={})),function(e){e[e.UNKNOWN=0]="UNKNOWN",e[e.A=1]="A",e[e.ADDRESS=2]="ADDRESS",e[e.ANNOTATION_XML=3]="ANNOTATION_XML",e[e.APPLET=4]="APPLET",e[e.AREA=5]="AREA",e[e.ARTICLE=6]="ARTICLE",e[e.ASIDE=7]="ASIDE",e[e.B=8]="B",e[e.BASE=9]="BASE",e[e.BASEFONT=10]="BASEFONT",e[e.BGSOUND=11]="BGSOUND",e[e.BIG=12]="BIG",e[e.BLOCKQUOTE=13]="BLOCKQUOTE",e[e.BODY=14]="BODY",e[e.BR=15]="BR",e[e.BUTTON=16]="BUTTON",e[e.CAPTION=17]="CAPTION",e[e.CENTER=18]="CENTER",e[e.CODE=19]="CODE",e[e.COL=20]="COL",e[e.COLGROUP=21]="COLGROUP",e[e.DD=22]="DD",e[e.DESC=23]="DESC",e[e.DETAILS=24]="DETAILS",e[e.DIALOG=25]="DIALOG",e[e.DIR=26]="DIR",e[e.DIV=27]="DIV",e[e.DL=28]="DL",e[e.DT=29]="DT",e[e.EM=30]="EM",e[e.EMBED=31]="EMBED",e[e.FIELDSET=32]="FIELDSET",e[e.FIGCAPTION=33]="FIGCAPTION",e[e.FIGURE=34]="FIGURE",e[e.FONT=35]="FONT",e[e.FOOTER=36]="FOOTER",e[e.FOREIGN_OBJECT=37]="FOREIGN_OBJECT",e[e.FORM=38]="FORM",e[e.FRAME=39]="FRAME",e[e.FRAMESET=40]="FRAMESET",e[e.H1=41]="H1",e[e.H2=42]="H2",e[e.H3=43]="H3",e[e.H4=44]="H4",e[e.H5=45]="H5",e[e.H6=46]="H6",e[e.HEAD=47]="HEAD",e[e.HEADER=48]="HEADER",e[e.HGROUP=49]="HGROUP",e[e.HR=50]="HR",e[e.HTML=51]="HTML",e[e.I=52]="I",e[e.IMG=53]="IMG",e[e.IMAGE=54]="IMAGE",e[e.INPUT=55]="INPUT",e[e.IFRAME=56]="IFRAME",e[e.KEYGEN=57]="KEYGEN",e[e.LABEL=58]="LABEL",e[e.LI=59]="LI",e[e.LINK=60]="LINK",e[e.LISTING=61]="LISTING",e[e.MAIN=62]="MAIN",e[e.MALIGNMARK=63]="MALIGNMARK",e[e.MARQUEE=64]="MARQUEE",e[e.MATH=65]="MATH",e[e.MENU=66]="MENU",e[e.META=67]="META",e[e.MGLYPH=68]="MGLYPH",e[e.MI=69]="MI",e[e.MO=70]="MO",e[e.MN=71]="MN",e[e.MS=72]="MS",e[e.MTEXT=73]="MTEXT",e[e.NAV=74]="NAV",e[e.NOBR=75]="NOBR",e[e.NOFRAMES=76]="NOFRAMES",e[e.NOEMBED=77]="NOEMBED",e[e.NOSCRIPT=78]="NOSCRIPT",e[e.OBJECT=79]="OBJECT",e[e.OL=80]="OL",e[e.OPTGROUP=81]="OPTGROUP",e[e.OPTION=82]="OPTION",e[e.P=83]="P",e[e.PARAM=84]="PARAM",e[e.PLAINTEXT=85]="PLAINTEXT",e[e.PRE=86]="PRE",e[e.RB=87]="RB",e[e.RP=88]="RP",e[e.RT=89]="RT",e[e.RTC=90]="RTC",e[e.RUBY=91]="RUBY",e[e.S=92]="S",e[e.SCRIPT=93]="SCRIPT",e[e.SECTION=94]="SECTION",e[e.SELECT=95]="SELECT",e[e.SOURCE=96]="SOURCE",e[e.SMALL=97]="SMALL",e[e.SPAN=98]="SPAN",e[e.STRIKE=99]="STRIKE",e[e.STRONG=100]="STRONG",e[e.STYLE=101]="STYLE",e[e.SUB=102]="SUB",e[e.SUMMARY=103]="SUMMARY",e[e.SUP=104]="SUP",e[e.TABLE=105]="TABLE",e[e.TBODY=106]="TBODY",e[e.TEMPLATE=107]="TEMPLATE",e[e.TEXTAREA=108]="TEXTAREA",e[e.TFOOT=109]="TFOOT",e[e.TD=110]="TD",e[e.TH=111]="TH",e[e.THEAD=112]="THEAD",e[e.TITLE=113]="TITLE",e[e.TR=114]="TR",e[e.TRACK=115]="TRACK",e[e.TT=116]="TT",e[e.U=117]="U",e[e.UL=118]="UL",e[e.SVG=119]="SVG",e[e.VAR=120]="VAR",e[e.WBR=121]="WBR",e[e.XMP=122]="XMP";}(u=u||(u={}));const O=new Map([[N.A,u.A],[N.ADDRESS,u.ADDRESS],[N.ANNOTATION_XML,u.ANNOTATION_XML],[N.APPLET,u.APPLET],[N.AREA,u.AREA],[N.ARTICLE,u.ARTICLE],[N.ASIDE,u.ASIDE],[N.B,u.B],[N.BASE,u.BASE],[N.BASEFONT,u.BASEFONT],[N.BGSOUND,u.BGSOUND],[N.BIG,u.BIG],[N.BLOCKQUOTE,u.BLOCKQUOTE],[N.BODY,u.BODY],[N.BR,u.BR],[N.BUTTON,u.BUTTON],[N.CAPTION,u.CAPTION],[N.CENTER,u.CENTER],[N.CODE,u.CODE],[N.COL,u.COL],[N.COLGROUP,u.COLGROUP],[N.DD,u.DD],[N.DESC,u.DESC],[N.DETAILS,u.DETAILS],[N.DIALOG,u.DIALOG],[N.DIR,u.DIR],[N.DIV,u.DIV],[N.DL,u.DL],[N.DT,u.DT],[N.EM,u.EM],[N.EMBED,u.EMBED],[N.FIELDSET,u.FIELDSET],[N.FIGCAPTION,u.FIGCAPTION],[N.FIGURE,u.FIGURE],[N.FONT,u.FONT],[N.FOOTER,u.FOOTER],[N.FOREIGN_OBJECT,u.FOREIGN_OBJECT],[N.FORM,u.FORM],[N.FRAME,u.FRAME],[N.FRAMESET,u.FRAMESET],[N.H1,u.H1],[N.H2,u.H2],[N.H3,u.H3],[N.H4,u.H4],[N.H5,u.H5],[N.H6,u.H6],[N.HEAD,u.HEAD],[N.HEADER,u.HEADER],[N.HGROUP,u.HGROUP],[N.HR,u.HR],[N.HTML,u.HTML],[N.I,u.I],[N.IMG,u.IMG],[N.IMAGE,u.IMAGE],[N.INPUT,u.INPUT],[N.IFRAME,u.IFRAME],[N.KEYGEN,u.KEYGEN],[N.LABEL,u.LABEL],[N.LI,u.LI],[N.LINK,u.LINK],[N.LISTING,u.LISTING],[N.MAIN,u.MAIN],[N.MALIGNMARK,u.MALIGNMARK],[N.MARQUEE,u.MARQUEE],[N.MATH,u.MATH],[N.MENU,u.MENU],[N.META,u.META],[N.MGLYPH,u.MGLYPH],[N.MI,u.MI],[N.MO,u.MO],[N.MN,u.MN],[N.MS,u.MS],[N.MTEXT,u.MTEXT],[N.NAV,u.NAV],[N.NOBR,u.NOBR],[N.NOFRAMES,u.NOFRAMES],[N.NOEMBED,u.NOEMBED],[N.NOSCRIPT,u.NOSCRIPT],[N.OBJECT,u.OBJECT],[N.OL,u.OL],[N.OPTGROUP,u.OPTGROUP],[N.OPTION,u.OPTION],[N.P,u.P],[N.PARAM,u.PARAM],[N.PLAINTEXT,u.PLAINTEXT],[N.PRE,u.PRE],[N.RB,u.RB],[N.RP,u.RP],[N.RT,u.RT],[N.RTC,u.RTC],[N.RUBY,u.RUBY],[N.S,u.S],[N.SCRIPT,u.SCRIPT],[N.SECTION,u.SECTION],[N.SELECT,u.SELECT],[N.SOURCE,u.SOURCE],[N.SMALL,u.SMALL],[N.SPAN,u.SPAN],[N.STRIKE,u.STRIKE],[N.STRONG,u.STRONG],[N.STYLE,u.STYLE],[N.SUB,u.SUB],[N.SUMMARY,u.SUMMARY],[N.SUP,u.SUP],[N.TABLE,u.TABLE],[N.TBODY,u.TBODY],[N.TEMPLATE,u.TEMPLATE],[N.TEXTAREA,u.TEXTAREA],[N.TFOOT,u.TFOOT],[N.TD,u.TD],[N.TH,u.TH],[N.THEAD,u.THEAD],[N.TITLE,u.TITLE],[N.TR,u.TR],[N.TRACK,u.TRACK],[N.TT,u.TT],[N.U,u.U],[N.UL,u.UL],[N.SVG,u.SVG],[N.VAR,u.VAR],[N.WBR,u.WBR],[N.XMP,u.XMP]]);function f(e){var t;return null!==(t=O.get(e))&&void 0!==t?t:u.UNKNOWN}const L=u,M={[p.HTML]:new Set([L.ADDRESS,L.APPLET,L.AREA,L.ARTICLE,L.ASIDE,L.BASE,L.BASEFONT,L.BGSOUND,L.BLOCKQUOTE,L.BODY,L.BR,L.BUTTON,L.CAPTION,L.CENTER,L.COL,L.COLGROUP,L.DD,L.DETAILS,L.DIR,L.DIV,L.DL,L.DT,L.EMBED,L.FIELDSET,L.FIGCAPTION,L.FIGURE,L.FOOTER,L.FORM,L.FRAME,L.FRAMESET,L.H1,L.H2,L.H3,L.H4,L.H5,L.H6,L.HEAD,L.HEADER,L.HGROUP,L.HR,L.HTML,L.IFRAME,L.IMG,L.INPUT,L.LI,L.LINK,L.LISTING,L.MAIN,L.MARQUEE,L.MENU,L.META,L.NAV,L.NOEMBED,L.NOFRAMES,L.NOSCRIPT,L.OBJECT,L.OL,L.P,L.PARAM,L.PLAINTEXT,L.PRE,L.SCRIPT,L.SECTION,L.SELECT,L.SOURCE,L.STYLE,L.SUMMARY,L.TABLE,L.TBODY,L.TD,L.TEMPLATE,L.TEXTAREA,L.TFOOT,L.TH,L.THEAD,L.TITLE,L.TR,L.TRACK,L.UL,L.WBR,L.XMP]),[p.MATHML]:new Set([L.MI,L.MO,L.MN,L.MS,L.MTEXT,L.ANNOTATION_XML]),[p.SVG]:new Set([L.TITLE,L.FOREIGN_OBJECT,L.DESC]),[p.XLINK]:new Set,[p.XML]:new Set,[p.XMLNS]:new Set};function g(e){return e===L.H1||e===L.H2||e===L.H3||e===L.H4||e===L.H5||e===L.H6}new Set([N.STYLE,N.SCRIPT,N.XMP,N.IFRAME,N.NOEMBED,N.NOFRAMES,N.PLAINTEXT]);const k=new Map([[128,8364],[130,8218],[131,402],[132,8222],[133,8230],[134,8224],[135,8225],[136,710],[137,8240],[138,352],[139,8249],[140,338],[142,381],[145,8216],[146,8217],[147,8220],[148,8221],[149,8226],[150,8211],[151,8212],[152,732],[153,8482],[154,353],[155,8250],[156,339],[158,382],[159,376]]);var P;!function(e){e[e.DATA=0]="DATA",e[e.RCDATA=1]="RCDATA",e[e.RAWTEXT=2]="RAWTEXT",e[e.SCRIPT_DATA=3]="SCRIPT_DATA",e[e.PLAINTEXT=4]="PLAINTEXT",e[e.TAG_OPEN=5]="TAG_OPEN",e[e.END_TAG_OPEN=6]="END_TAG_OPEN",e[e.TAG_NAME=7]="TAG_NAME",e[e.RCDATA_LESS_THAN_SIGN=8]="RCDATA_LESS_THAN_SIGN",e[e.RCDATA_END_TAG_OPEN=9]="RCDATA_END_TAG_OPEN",e[e.RCDATA_END_TAG_NAME=10]="RCDATA_END_TAG_NAME",e[e.RAWTEXT_LESS_THAN_SIGN=11]="RAWTEXT_LESS_THAN_SIGN",e[e.RAWTEXT_END_TAG_OPEN=12]="RAWTEXT_END_TAG_OPEN",e[e.RAWTEXT_END_TAG_NAME=13]="RAWTEXT_END_TAG_NAME",e[e.SCRIPT_DATA_LESS_THAN_SIGN=14]="SCRIPT_DATA_LESS_THAN_SIGN",e[e.SCRIPT_DATA_END_TAG_OPEN=15]="SCRIPT_DATA_END_TAG_OPEN",e[e.SCRIPT_DATA_END_TAG_NAME=16]="SCRIPT_DATA_END_TAG_NAME",e[e.SCRIPT_DATA_ESCAPE_START=17]="SCRIPT_DATA_ESCAPE_START",e[e.SCRIPT_DATA_ESCAPE_START_DASH=18]="SCRIPT_DATA_ESCAPE_START_DASH",e[e.SCRIPT_DATA_ESCAPED=19]="SCRIPT_DATA_ESCAPED",e[e.SCRIPT_DATA_ESCAPED_DASH=20]="SCRIPT_DATA_ESCAPED_DASH",e[e.SCRIPT_DATA_ESCAPED_DASH_DASH=21]="SCRIPT_DATA_ESCAPED_DASH_DASH",e[e.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN=22]="SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN",e[e.SCRIPT_DATA_ESCAPED_END_TAG_OPEN=23]="SCRIPT_DATA_ESCAPED_END_TAG_OPEN",e[e.SCRIPT_DATA_ESCAPED_END_TAG_NAME=24]="SCRIPT_DATA_ESCAPED_END_TAG_NAME",e[e.SCRIPT_DATA_DOUBLE_ESCAPE_START=25]="SCRIPT_DATA_DOUBLE_ESCAPE_START",e[e.SCRIPT_DATA_DOUBLE_ESCAPED=26]="SCRIPT_DATA_DOUBLE_ESCAPED",e[e.SCRIPT_DATA_DOUBLE_ESCAPED_DASH=27]="SCRIPT_DATA_DOUBLE_ESCAPED_DASH",e[e.SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH=28]="SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH",e[e.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN=29]="SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN",e[e.SCRIPT_DATA_DOUBLE_ESCAPE_END=30]="SCRIPT_DATA_DOUBLE_ESCAPE_END",e[e.BEFORE_ATTRIBUTE_NAME=31]="BEFORE_ATTRIBUTE_NAME",e[e.ATTRIBUTE_NAME=32]="ATTRIBUTE_NAME",e[e.AFTER_ATTRIBUTE_NAME=33]="AFTER_ATTRIBUTE_NAME",e[e.BEFORE_ATTRIBUTE_VALUE=34]="BEFORE_ATTRIBUTE_VALUE",e[e.ATTRIBUTE_VALUE_DOUBLE_QUOTED=35]="ATTRIBUTE_VALUE_DOUBLE_QUOTED",e[e.ATTRIBUTE_VALUE_SINGLE_QUOTED=36]="ATTRIBUTE_VALUE_SINGLE_QUOTED",e[e.ATTRIBUTE_VALUE_UNQUOTED=37]="ATTRIBUTE_VALUE_UNQUOTED",e[e.AFTER_ATTRIBUTE_VALUE_QUOTED=38]="AFTER_ATTRIBUTE_VALUE_QUOTED",e[e.SELF_CLOSING_START_TAG=39]="SELF_CLOSING_START_TAG",e[e.BOGUS_COMMENT=40]="BOGUS_COMMENT",e[e.MARKUP_DECLARATION_OPEN=41]="MARKUP_DECLARATION_OPEN",e[e.COMMENT_START=42]="COMMENT_START",e[e.COMMENT_START_DASH=43]="COMMENT_START_DASH",e[e.COMMENT=44]="COMMENT",e[e.COMMENT_LESS_THAN_SIGN=45]="COMMENT_LESS_THAN_SIGN",e[e.COMMENT_LESS_THAN_SIGN_BANG=46]="COMMENT_LESS_THAN_SIGN_BANG",e[e.COMMENT_LESS_THAN_SIGN_BANG_DASH=47]="COMMENT_LESS_THAN_SIGN_BANG_DASH",e[e.COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH=48]="COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH",e[e.COMMENT_END_DASH=49]="COMMENT_END_DASH",e[e.COMMENT_END=50]="COMMENT_END",e[e.COMMENT_END_BANG=51]="COMMENT_END_BANG",e[e.DOCTYPE=52]="DOCTYPE",e[e.BEFORE_DOCTYPE_NAME=53]="BEFORE_DOCTYPE_NAME",e[e.DOCTYPE_NAME=54]="DOCTYPE_NAME",e[e.AFTER_DOCTYPE_NAME=55]="AFTER_DOCTYPE_NAME",e[e.AFTER_DOCTYPE_PUBLIC_KEYWORD=56]="AFTER_DOCTYPE_PUBLIC_KEYWORD",e[e.BEFORE_DOCTYPE_PUBLIC_IDENTIFIER=57]="BEFORE_DOCTYPE_PUBLIC_IDENTIFIER",e[e.DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED=58]="DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED",e[e.DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED=59]="DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED",e[e.AFTER_DOCTYPE_PUBLIC_IDENTIFIER=60]="AFTER_DOCTYPE_PUBLIC_IDENTIFIER",e[e.BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS=61]="BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS",e[e.AFTER_DOCTYPE_SYSTEM_KEYWORD=62]="AFTER_DOCTYPE_SYSTEM_KEYWORD",e[e.BEFORE_DOCTYPE_SYSTEM_IDENTIFIER=63]="BEFORE_DOCTYPE_SYSTEM_IDENTIFIER",e[e.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED=64]="DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED",e[e.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED=65]="DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED",e[e.AFTER_DOCTYPE_SYSTEM_IDENTIFIER=66]="AFTER_DOCTYPE_SYSTEM_IDENTIFIER",e[e.BOGUS_DOCTYPE=67]="BOGUS_DOCTYPE",e[e.CDATA_SECTION=68]="CDATA_SECTION",e[e.CDATA_SECTION_BRACKET=69]="CDATA_SECTION_BRACKET",e[e.CDATA_SECTION_END=70]="CDATA_SECTION_END",e[e.CHARACTER_REFERENCE=71]="CHARACTER_REFERENCE",e[e.NAMED_CHARACTER_REFERENCE=72]="NAMED_CHARACTER_REFERENCE",e[e.AMBIGUOUS_AMPERSAND=73]="AMBIGUOUS_AMPERSAND",e[e.NUMERIC_CHARACTER_REFERENCE=74]="NUMERIC_CHARACTER_REFERENCE",e[e.HEXADEMICAL_CHARACTER_REFERENCE_START=75]="HEXADEMICAL_CHARACTER_REFERENCE_START",e[e.HEXADEMICAL_CHARACTER_REFERENCE=76]="HEXADEMICAL_CHARACTER_REFERENCE",e[e.DECIMAL_CHARACTER_REFERENCE=77]="DECIMAL_CHARACTER_REFERENCE",e[e.NUMERIC_CHARACTER_REFERENCE_END=78]="NUMERIC_CHARACTER_REFERENCE_END";}(P||(P={}));const b={DATA:P.DATA,RCDATA:P.RCDATA,RAWTEXT:P.RAWTEXT,SCRIPT_DATA:P.SCRIPT_DATA,PLAINTEXT:P.PLAINTEXT,CDATA_SECTION:P.CDATA_SECTION};function B(e){return e>=a.DIGIT_0&&e<=a.DIGIT_9}function H(e){return e>=a.LATIN_CAPITAL_A&&e<=a.LATIN_CAPITAL_Z}function F(e){return function(e){return e>=a.LATIN_SMALL_A&&e<=a.LATIN_SMALL_Z}(e)||H(e)}function U(e){return F(e)||B(e)}function G(e){return e>=a.LATIN_CAPITAL_A&&e<=a.LATIN_CAPITAL_F}function y(e){return e>=a.LATIN_SMALL_A&&e<=a.LATIN_SMALL_F}function w(e){return e+32}function Y(e){return e===a.SPACE||e===a.LINE_FEED||e===a.TABULATION||e===a.FORM_FEED}function x(e){return Y(e)||e===a.SOLIDUS||e===a.GREATER_THAN_SIGN}class v{constructor(e,t){this.options=e,this.handler=t,this.paused=!1,this.inLoop=!1,this.inForeignNode=!1,this.lastStartTagName="",this.active=!1,this.state=P.DATA,this.returnState=P.DATA,this.charRefCode=-1,this.consumedAfterSnapshot=-1,this.currentCharacterToken=null,this.currentToken=null,this.currentAttr={name:"",value:""},this.preprocessor=new _(t),this.currentLocation=this.getCurrentLocation(-1);}_err(e){var t,s;null===(s=(t=this.handler).onParseError)||void 0===s||s.call(t,this.preprocessor.getError(e));}getCurrentLocation(e){return this.options.sourceCodeLocationInfo?{startLine:this.preprocessor.line,startCol:this.preprocessor.col-e,startOffset:this.preprocessor.offset-e,endLine:-1,endCol:-1,endOffset:-1}:null}_runParsingLoop(){if(!this.inLoop){for(this.inLoop=!0;this.active&&!this.paused;){this.consumedAfterSnapshot=0;const e=this._consume();this._ensureHibernation()||this._callState(e);}this.inLoop=!1;}}pause(){this.paused=!0;}resume(e){if(!this.paused)throw new Error("Parser was already resumed");this.paused=!1,this.inLoop||(this._runParsingLoop(),this.paused||null==e||e());}write(e,t,s){this.active=!0,this.preprocessor.write(e,t),this._runParsingLoop(),this.paused||null==s||s();}insertHtmlAtCurrentPos(e){this.active=!0,this.preprocessor.insertHtmlAtCurrentPos(e),this._runParsingLoop();}_ensureHibernation(){return !!this.preprocessor.endOfChunkHit&&(this._unconsume(this.consumedAfterSnapshot),this.active=!1,!0)}_consume(){return this.consumedAfterSnapshot++,this.preprocessor.advance()}_unconsume(e){this.consumedAfterSnapshot-=e,this.preprocessor.retreat(e);}_reconsumeInState(e,t){this.state=e,this._callState(t);}_advanceBy(e){this.consumedAfterSnapshot+=e;for(let t=0;t<e;t++)this.preprocessor.advance();}_consumeSequenceIfMatch(e,t){return !!this.preprocessor.startsWith(e,t)&&(this._advanceBy(e.length-1),!0)}_createStartTagToken(){this.currentToken={type:h.START_TAG,tagName:"",tagID:u.UNKNOWN,selfClosing:!1,ackSelfClosing:!1,attrs:[],location:this.getCurrentLocation(1)};}_createEndTagToken(){this.currentToken={type:h.END_TAG,tagName:"",tagID:u.UNKNOWN,selfClosing:!1,ackSelfClosing:!1,attrs:[],location:this.getCurrentLocation(2)};}_createCommentToken(e){this.currentToken={type:h.COMMENT,data:"",location:this.getCurrentLocation(e)};}_createDoctypeToken(e){this.currentToken={type:h.DOCTYPE,name:e,forceQuirks:!1,publicId:null,systemId:null,location:this.currentLocation};}_createCharacterToken(e,t){this.currentCharacterToken={type:e,chars:t,location:this.currentLocation};}_createAttr(e){this.currentAttr={name:e,value:""},this.currentLocation=this.getCurrentLocation(0);}_leaveAttrName(){var e,t;const s=this.currentToken;null===A(s,this.currentAttr.name)?(s.attrs.push(this.currentAttr),s.location&&this.currentLocation&&((null!==(e=(t=s.location).attrs)&&void 0!==e?e:t.attrs=Object.create(null))[this.currentAttr.name]=this.currentLocation,this._leaveAttrValue())):this._err(T.duplicateAttribute);}_leaveAttrValue(){this.currentLocation&&(this.currentLocation.endLine=this.preprocessor.line,this.currentLocation.endCol=this.preprocessor.col,this.currentLocation.endOffset=this.preprocessor.offset);}prepareToken(e){this._emitCurrentCharacterToken(e.location),this.currentToken=null,e.location&&(e.location.endLine=this.preprocessor.line,e.location.endCol=this.preprocessor.col+1,e.location.endOffset=this.preprocessor.offset+1),this.currentLocation=this.getCurrentLocation(-1);}emitCurrentTagToken(){const e=this.currentToken;this.prepareToken(e),e.tagID=f(e.tagName),e.type===h.START_TAG?(this.lastStartTagName=e.tagName,this.handler.onStartTag(e)):(e.attrs.length>0&&this._err(T.endTagWithAttributes),e.selfClosing&&this._err(T.endTagWithTrailingSolidus),this.handler.onEndTag(e)),this.preprocessor.dropParsedChunk();}emitCurrentComment(e){this.prepareToken(e),this.handler.onComment(e),this.preprocessor.dropParsedChunk();}emitCurrentDoctype(e){this.prepareToken(e),this.handler.onDoctype(e),this.preprocessor.dropParsedChunk();}_emitCurrentCharacterToken(e){if(this.currentCharacterToken){switch(e&&this.currentCharacterToken.location&&(this.currentCharacterToken.location.endLine=e.startLine,this.currentCharacterToken.location.endCol=e.startCol,this.currentCharacterToken.location.endOffset=e.startOffset),this.currentCharacterToken.type){case h.CHARACTER:this.handler.onCharacter(this.currentCharacterToken);break;case h.NULL_CHARACTER:this.handler.onNullCharacter(this.currentCharacterToken);break;case h.WHITESPACE_CHARACTER:this.handler.onWhitespaceCharacter(this.currentCharacterToken);}this.currentCharacterToken=null;}}_emitEOFToken(){const e=this.getCurrentLocation(0);e&&(e.endLine=e.startLine,e.endCol=e.startCol,e.endOffset=e.startOffset),this._emitCurrentCharacterToken(e),this.handler.onEof({type:h.EOF,location:e}),this.active=!1;}_appendCharToCurrentCharacterToken(e,t){if(this.currentCharacterToken){if(this.currentCharacterToken.type===e)return void(this.currentCharacterToken.chars+=t);this.currentLocation=this.getCurrentLocation(0),this._emitCurrentCharacterToken(this.currentLocation),this.preprocessor.dropParsedChunk();}this._createCharacterToken(e,t);}_emitCodePoint(e){const t=Y(e)?h.WHITESPACE_CHARACTER:e===a.NULL?h.NULL_CHARACTER:h.CHARACTER;this._appendCharToCurrentCharacterToken(t,String.fromCodePoint(e));}_emitChars(e){this._appendCharToCurrentCharacterToken(h.CHARACTER,e);}_matchNamedCharacterReference(e){let t=null,s=0,r=!1;for(let i=0,o=R.htmlDecodeTree[0];i>=0&&(i=R.determineBranch(R.htmlDecodeTree,o,i+1,e),!(i<0));e=this._consume()){s+=1,o=R.htmlDecodeTree[i];const c=o&R.BinTrieFlags.VALUE_LENGTH;if(c){const o=(c>>14)-1;if(e!==a.SEMICOLON&&this._isCharacterReferenceInAttribute()&&((n=this.preprocessor.peek(1))===a.EQUALS_SIGN||U(n))?(t=[a.AMPERSAND],i+=o):(t=0===o?[R.htmlDecodeTree[i]&~R.BinTrieFlags.VALUE_LENGTH]:1===o?[R.htmlDecodeTree[++i]]:[R.htmlDecodeTree[++i],R.htmlDecodeTree[++i]],s=0,r=e!==a.SEMICOLON),0===o){this._consume();break}}}var n;return this._unconsume(s),r&&!this.preprocessor.endOfChunkHit&&this._err(T.missingSemicolonAfterCharacterReference),this._unconsume(1),t}_isCharacterReferenceInAttribute(){return this.returnState===P.ATTRIBUTE_VALUE_DOUBLE_QUOTED||this.returnState===P.ATTRIBUTE_VALUE_SINGLE_QUOTED||this.returnState===P.ATTRIBUTE_VALUE_UNQUOTED}_flushCodePointConsumedAsCharacterReference(e){this._isCharacterReferenceInAttribute()?this.currentAttr.value+=String.fromCodePoint(e):this._emitCodePoint(e);}_callState(e){switch(this.state){case P.DATA:this._stateData(e);break;case P.RCDATA:this._stateRcdata(e);break;case P.RAWTEXT:this._stateRawtext(e);break;case P.SCRIPT_DATA:this._stateScriptData(e);break;case P.PLAINTEXT:this._statePlaintext(e);break;case P.TAG_OPEN:this._stateTagOpen(e);break;case P.END_TAG_OPEN:this._stateEndTagOpen(e);break;case P.TAG_NAME:this._stateTagName(e);break;case P.RCDATA_LESS_THAN_SIGN:this._stateRcdataLessThanSign(e);break;case P.RCDATA_END_TAG_OPEN:this._stateRcdataEndTagOpen(e);break;case P.RCDATA_END_TAG_NAME:this._stateRcdataEndTagName(e);break;case P.RAWTEXT_LESS_THAN_SIGN:this._stateRawtextLessThanSign(e);break;case P.RAWTEXT_END_TAG_OPEN:this._stateRawtextEndTagOpen(e);break;case P.RAWTEXT_END_TAG_NAME:this._stateRawtextEndTagName(e);break;case P.SCRIPT_DATA_LESS_THAN_SIGN:this._stateScriptDataLessThanSign(e);break;case P.SCRIPT_DATA_END_TAG_OPEN:this._stateScriptDataEndTagOpen(e);break;case P.SCRIPT_DATA_END_TAG_NAME:this._stateScriptDataEndTagName(e);break;case P.SCRIPT_DATA_ESCAPE_START:this._stateScriptDataEscapeStart(e);break;case P.SCRIPT_DATA_ESCAPE_START_DASH:this._stateScriptDataEscapeStartDash(e);break;case P.SCRIPT_DATA_ESCAPED:this._stateScriptDataEscaped(e);break;case P.SCRIPT_DATA_ESCAPED_DASH:this._stateScriptDataEscapedDash(e);break;case P.SCRIPT_DATA_ESCAPED_DASH_DASH:this._stateScriptDataEscapedDashDash(e);break;case P.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN:this._stateScriptDataEscapedLessThanSign(e);break;case P.SCRIPT_DATA_ESCAPED_END_TAG_OPEN:this._stateScriptDataEscapedEndTagOpen(e);break;case P.SCRIPT_DATA_ESCAPED_END_TAG_NAME:this._stateScriptDataEscapedEndTagName(e);break;case P.SCRIPT_DATA_DOUBLE_ESCAPE_START:this._stateScriptDataDoubleEscapeStart(e);break;case P.SCRIPT_DATA_DOUBLE_ESCAPED:this._stateScriptDataDoubleEscaped(e);break;case P.SCRIPT_DATA_DOUBLE_ESCAPED_DASH:this._stateScriptDataDoubleEscapedDash(e);break;case P.SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH:this._stateScriptDataDoubleEscapedDashDash(e);break;case P.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN:this._stateScriptDataDoubleEscapedLessThanSign(e);break;case P.SCRIPT_DATA_DOUBLE_ESCAPE_END:this._stateScriptDataDoubleEscapeEnd(e);break;case P.BEFORE_ATTRIBUTE_NAME:this._stateBeforeAttributeName(e);break;case P.ATTRIBUTE_NAME:this._stateAttributeName(e);break;case P.AFTER_ATTRIBUTE_NAME:this._stateAfterAttributeName(e);break;case P.BEFORE_ATTRIBUTE_VALUE:this._stateBeforeAttributeValue(e);break;case P.ATTRIBUTE_VALUE_DOUBLE_QUOTED:this._stateAttributeValueDoubleQuoted(e);break;case P.ATTRIBUTE_VALUE_SINGLE_QUOTED:this._stateAttributeValueSingleQuoted(e);break;case P.ATTRIBUTE_VALUE_UNQUOTED:this._stateAttributeValueUnquoted(e);break;case P.AFTER_ATTRIBUTE_VALUE_QUOTED:this._stateAfterAttributeValueQuoted(e);break;case P.SELF_CLOSING_START_TAG:this._stateSelfClosingStartTag(e);break;case P.BOGUS_COMMENT:this._stateBogusComment(e);break;case P.MARKUP_DECLARATION_OPEN:this._stateMarkupDeclarationOpen(e);break;case P.COMMENT_START:this._stateCommentStart(e);break;case P.COMMENT_START_DASH:this._stateCommentStartDash(e);break;case P.COMMENT:this._stateComment(e);break;case P.COMMENT_LESS_THAN_SIGN:this._stateCommentLessThanSign(e);break;case P.COMMENT_LESS_THAN_SIGN_BANG:this._stateCommentLessThanSignBang(e);break;case P.COMMENT_LESS_THAN_SIGN_BANG_DASH:this._stateCommentLessThanSignBangDash(e);break;case P.COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH:this._stateCommentLessThanSignBangDashDash(e);break;case P.COMMENT_END_DASH:this._stateCommentEndDash(e);break;case P.COMMENT_END:this._stateCommentEnd(e);break;case P.COMMENT_END_BANG:this._stateCommentEndBang(e);break;case P.DOCTYPE:this._stateDoctype(e);break;case P.BEFORE_DOCTYPE_NAME:this._stateBeforeDoctypeName(e);break;case P.DOCTYPE_NAME:this._stateDoctypeName(e);break;case P.AFTER_DOCTYPE_NAME:this._stateAfterDoctypeName(e);break;case P.AFTER_DOCTYPE_PUBLIC_KEYWORD:this._stateAfterDoctypePublicKeyword(e);break;case P.BEFORE_DOCTYPE_PUBLIC_IDENTIFIER:this._stateBeforeDoctypePublicIdentifier(e);break;case P.DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED:this._stateDoctypePublicIdentifierDoubleQuoted(e);break;case P.DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED:this._stateDoctypePublicIdentifierSingleQuoted(e);break;case P.AFTER_DOCTYPE_PUBLIC_IDENTIFIER:this._stateAfterDoctypePublicIdentifier(e);break;case P.BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS:this._stateBetweenDoctypePublicAndSystemIdentifiers(e);break;case P.AFTER_DOCTYPE_SYSTEM_KEYWORD:this._stateAfterDoctypeSystemKeyword(e);break;case P.BEFORE_DOCTYPE_SYSTEM_IDENTIFIER:this._stateBeforeDoctypeSystemIdentifier(e);break;case P.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED:this._stateDoctypeSystemIdentifierDoubleQuoted(e);break;case P.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED:this._stateDoctypeSystemIdentifierSingleQuoted(e);break;case P.AFTER_DOCTYPE_SYSTEM_IDENTIFIER:this._stateAfterDoctypeSystemIdentifier(e);break;case P.BOGUS_DOCTYPE:this._stateBogusDoctype(e);break;case P.CDATA_SECTION:this._stateCdataSection(e);break;case P.CDATA_SECTION_BRACKET:this._stateCdataSectionBracket(e);break;case P.CDATA_SECTION_END:this._stateCdataSectionEnd(e);break;case P.CHARACTER_REFERENCE:this._stateCharacterReference(e);break;case P.NAMED_CHARACTER_REFERENCE:this._stateNamedCharacterReference(e);break;case P.AMBIGUOUS_AMPERSAND:this._stateAmbiguousAmpersand(e);break;case P.NUMERIC_CHARACTER_REFERENCE:this._stateNumericCharacterReference(e);break;case P.HEXADEMICAL_CHARACTER_REFERENCE_START:this._stateHexademicalCharacterReferenceStart(e);break;case P.HEXADEMICAL_CHARACTER_REFERENCE:this._stateHexademicalCharacterReference(e);break;case P.DECIMAL_CHARACTER_REFERENCE:this._stateDecimalCharacterReference(e);break;case P.NUMERIC_CHARACTER_REFERENCE_END:this._stateNumericCharacterReferenceEnd(e);break;default:throw new Error("Unknown state")}}_stateData(e){switch(e){case a.LESS_THAN_SIGN:this.state=P.TAG_OPEN;break;case a.AMPERSAND:this.returnState=P.DATA,this.state=P.CHARACTER_REFERENCE;break;case a.NULL:this._err(T.unexpectedNullCharacter),this._emitCodePoint(e);break;case a.EOF:this._emitEOFToken();break;default:this._emitCodePoint(e);}}_stateRcdata(e){switch(e){case a.AMPERSAND:this.returnState=P.RCDATA,this.state=P.CHARACTER_REFERENCE;break;case a.LESS_THAN_SIGN:this.state=P.RCDATA_LESS_THAN_SIGN;break;case a.NULL:this._err(T.unexpectedNullCharacter),this._emitChars(s);break;case a.EOF:this._emitEOFToken();break;default:this._emitCodePoint(e);}}_stateRawtext(e){switch(e){case a.LESS_THAN_SIGN:this.state=P.RAWTEXT_LESS_THAN_SIGN;break;case a.NULL:this._err(T.unexpectedNullCharacter),this._emitChars(s);break;case a.EOF:this._emitEOFToken();break;default:this._emitCodePoint(e);}}_stateScriptData(e){switch(e){case a.LESS_THAN_SIGN:this.state=P.SCRIPT_DATA_LESS_THAN_SIGN;break;case a.NULL:this._err(T.unexpectedNullCharacter),this._emitChars(s);break;case a.EOF:this._emitEOFToken();break;default:this._emitCodePoint(e);}}_statePlaintext(e){switch(e){case a.NULL:this._err(T.unexpectedNullCharacter),this._emitChars(s);break;case a.EOF:this._emitEOFToken();break;default:this._emitCodePoint(e);}}_stateTagOpen(e){if(F(e))this._createStartTagToken(),this.state=P.TAG_NAME,this._stateTagName(e);else switch(e){case a.EXCLAMATION_MARK:this.state=P.MARKUP_DECLARATION_OPEN;break;case a.SOLIDUS:this.state=P.END_TAG_OPEN;break;case a.QUESTION_MARK:this._err(T.unexpectedQuestionMarkInsteadOfTagName),this._createCommentToken(1),this.state=P.BOGUS_COMMENT,this._stateBogusComment(e);break;case a.EOF:this._err(T.eofBeforeTagName),this._emitChars("<"),this._emitEOFToken();break;default:this._err(T.invalidFirstCharacterOfTagName),this._emitChars("<"),this.state=P.DATA,this._stateData(e);}}_stateEndTagOpen(e){if(F(e))this._createEndTagToken(),this.state=P.TAG_NAME,this._stateTagName(e);else switch(e){case a.GREATER_THAN_SIGN:this._err(T.missingEndTagName),this.state=P.DATA;break;case a.EOF:this._err(T.eofBeforeTagName),this._emitChars("</"),this._emitEOFToken();break;default:this._err(T.invalidFirstCharacterOfTagName),this._createCommentToken(2),this.state=P.BOGUS_COMMENT,this._stateBogusComment(e);}}_stateTagName(e){const t=this.currentToken;switch(e){case a.SPACE:case a.LINE_FEED:case a.TABULATION:case a.FORM_FEED:this.state=P.BEFORE_ATTRIBUTE_NAME;break;case a.SOLIDUS:this.state=P.SELF_CLOSING_START_TAG;break;case a.GREATER_THAN_SIGN:this.state=P.DATA,this.emitCurrentTagToken();break;case a.NULL:this._err(T.unexpectedNullCharacter),t.tagName+=s;break;case a.EOF:this._err(T.eofInTag),this._emitEOFToken();break;default:t.tagName+=String.fromCodePoint(H(e)?w(e):e);}}_stateRcdataLessThanSign(e){e===a.SOLIDUS?this.state=P.RCDATA_END_TAG_OPEN:(this._emitChars("<"),this.state=P.RCDATA,this._stateRcdata(e));}_stateRcdataEndTagOpen(e){F(e)?(this.state=P.RCDATA_END_TAG_NAME,this._stateRcdataEndTagName(e)):(this._emitChars("</"),this.state=P.RCDATA,this._stateRcdata(e));}handleSpecialEndTag(e){if(!this.preprocessor.startsWith(this.lastStartTagName,!1))return !this._ensureHibernation();switch(this._createEndTagToken(),this.currentToken.tagName=this.lastStartTagName,this.preprocessor.peek(this.lastStartTagName.length)){case a.SPACE:case a.LINE_FEED:case a.TABULATION:case a.FORM_FEED:return this._advanceBy(this.lastStartTagName.length),this.state=P.BEFORE_ATTRIBUTE_NAME,!1;case a.SOLIDUS:return this._advanceBy(this.lastStartTagName.length),this.state=P.SELF_CLOSING_START_TAG,!1;case a.GREATER_THAN_SIGN:return this._advanceBy(this.lastStartTagName.length),this.emitCurrentTagToken(),this.state=P.DATA,!1;default:return !this._ensureHibernation()}}_stateRcdataEndTagName(e){this.handleSpecialEndTag(e)&&(this._emitChars("</"),this.state=P.RCDATA,this._stateRcdata(e));}_stateRawtextLessThanSign(e){e===a.SOLIDUS?this.state=P.RAWTEXT_END_TAG_OPEN:(this._emitChars("<"),this.state=P.RAWTEXT,this._stateRawtext(e));}_stateRawtextEndTagOpen(e){F(e)?(this.state=P.RAWTEXT_END_TAG_NAME,this._stateRawtextEndTagName(e)):(this._emitChars("</"),this.state=P.RAWTEXT,this._stateRawtext(e));}_stateRawtextEndTagName(e){this.handleSpecialEndTag(e)&&(this._emitChars("</"),this.state=P.RAWTEXT,this._stateRawtext(e));}_stateScriptDataLessThanSign(e){switch(e){case a.SOLIDUS:this.state=P.SCRIPT_DATA_END_TAG_OPEN;break;case a.EXCLAMATION_MARK:this.state=P.SCRIPT_DATA_ESCAPE_START,this._emitChars("<!");break;default:this._emitChars("<"),this.state=P.SCRIPT_DATA,this._stateScriptData(e);}}_stateScriptDataEndTagOpen(e){F(e)?(this.state=P.SCRIPT_DATA_END_TAG_NAME,this._stateScriptDataEndTagName(e)):(this._emitChars("</"),this.state=P.SCRIPT_DATA,this._stateScriptData(e));}_stateScriptDataEndTagName(e){this.handleSpecialEndTag(e)&&(this._emitChars("</"),this.state=P.SCRIPT_DATA,this._stateScriptData(e));}_stateScriptDataEscapeStart(e){e===a.HYPHEN_MINUS?(this.state=P.SCRIPT_DATA_ESCAPE_START_DASH,this._emitChars("-")):(this.state=P.SCRIPT_DATA,this._stateScriptData(e));}_stateScriptDataEscapeStartDash(e){e===a.HYPHEN_MINUS?(this.state=P.SCRIPT_DATA_ESCAPED_DASH_DASH,this._emitChars("-")):(this.state=P.SCRIPT_DATA,this._stateScriptData(e));}_stateScriptDataEscaped(e){switch(e){case a.HYPHEN_MINUS:this.state=P.SCRIPT_DATA_ESCAPED_DASH,this._emitChars("-");break;case a.LESS_THAN_SIGN:this.state=P.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN;break;case a.NULL:this._err(T.unexpectedNullCharacter),this._emitChars(s);break;case a.EOF:this._err(T.eofInScriptHtmlCommentLikeText),this._emitEOFToken();break;default:this._emitCodePoint(e);}}_stateScriptDataEscapedDash(e){switch(e){case a.HYPHEN_MINUS:this.state=P.SCRIPT_DATA_ESCAPED_DASH_DASH,this._emitChars("-");break;case a.LESS_THAN_SIGN:this.state=P.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN;break;case a.NULL:this._err(T.unexpectedNullCharacter),this.state=P.SCRIPT_DATA_ESCAPED,this._emitChars(s);break;case a.EOF:this._err(T.eofInScriptHtmlCommentLikeText),this._emitEOFToken();break;default:this.state=P.SCRIPT_DATA_ESCAPED,this._emitCodePoint(e);}}_stateScriptDataEscapedDashDash(e){switch(e){case a.HYPHEN_MINUS:this._emitChars("-");break;case a.LESS_THAN_SIGN:this.state=P.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN;break;case a.GREATER_THAN_SIGN:this.state=P.SCRIPT_DATA,this._emitChars(">");break;case a.NULL:this._err(T.unexpectedNullCharacter),this.state=P.SCRIPT_DATA_ESCAPED,this._emitChars(s);break;case a.EOF:this._err(T.eofInScriptHtmlCommentLikeText),this._emitEOFToken();break;default:this.state=P.SCRIPT_DATA_ESCAPED,this._emitCodePoint(e);}}_stateScriptDataEscapedLessThanSign(e){e===a.SOLIDUS?this.state=P.SCRIPT_DATA_ESCAPED_END_TAG_OPEN:F(e)?(this._emitChars("<"),this.state=P.SCRIPT_DATA_DOUBLE_ESCAPE_START,this._stateScriptDataDoubleEscapeStart(e)):(this._emitChars("<"),this.state=P.SCRIPT_DATA_ESCAPED,this._stateScriptDataEscaped(e));}_stateScriptDataEscapedEndTagOpen(e){F(e)?(this.state=P.SCRIPT_DATA_ESCAPED_END_TAG_NAME,this._stateScriptDataEscapedEndTagName(e)):(this._emitChars("</"),this.state=P.SCRIPT_DATA_ESCAPED,this._stateScriptDataEscaped(e));}_stateScriptDataEscapedEndTagName(e){this.handleSpecialEndTag(e)&&(this._emitChars("</"),this.state=P.SCRIPT_DATA_ESCAPED,this._stateScriptDataEscaped(e));}_stateScriptDataDoubleEscapeStart(e){if(this.preprocessor.startsWith(i,!1)&&x(this.preprocessor.peek(6))){this._emitCodePoint(e);for(let e=0;e<6;e++)this._emitCodePoint(this._consume());this.state=P.SCRIPT_DATA_DOUBLE_ESCAPED;}else this._ensureHibernation()||(this.state=P.SCRIPT_DATA_ESCAPED,this._stateScriptDataEscaped(e));}_stateScriptDataDoubleEscaped(e){switch(e){case a.HYPHEN_MINUS:this.state=P.SCRIPT_DATA_DOUBLE_ESCAPED_DASH,this._emitChars("-");break;case a.LESS_THAN_SIGN:this.state=P.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN,this._emitChars("<");break;case a.NULL:this._err(T.unexpectedNullCharacter),this._emitChars(s);break;case a.EOF:this._err(T.eofInScriptHtmlCommentLikeText),this._emitEOFToken();break;default:this._emitCodePoint(e);}}_stateScriptDataDoubleEscapedDash(e){switch(e){case a.HYPHEN_MINUS:this.state=P.SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH,this._emitChars("-");break;case a.LESS_THAN_SIGN:this.state=P.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN,this._emitChars("<");break;case a.NULL:this._err(T.unexpectedNullCharacter),this.state=P.SCRIPT_DATA_DOUBLE_ESCAPED,this._emitChars(s);break;case a.EOF:this._err(T.eofInScriptHtmlCommentLikeText),this._emitEOFToken();break;default:this.state=P.SCRIPT_DATA_DOUBLE_ESCAPED,this._emitCodePoint(e);}}_stateScriptDataDoubleEscapedDashDash(e){switch(e){case a.HYPHEN_MINUS:this._emitChars("-");break;case a.LESS_THAN_SIGN:this.state=P.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN,this._emitChars("<");break;case a.GREATER_THAN_SIGN:this.state=P.SCRIPT_DATA,this._emitChars(">");break;case a.NULL:this._err(T.unexpectedNullCharacter),this.state=P.SCRIPT_DATA_DOUBLE_ESCAPED,this._emitChars(s);break;case a.EOF:this._err(T.eofInScriptHtmlCommentLikeText),this._emitEOFToken();break;default:this.state=P.SCRIPT_DATA_DOUBLE_ESCAPED,this._emitCodePoint(e);}}_stateScriptDataDoubleEscapedLessThanSign(e){e===a.SOLIDUS?(this.state=P.SCRIPT_DATA_DOUBLE_ESCAPE_END,this._emitChars("/")):(this.state=P.SCRIPT_DATA_DOUBLE_ESCAPED,this._stateScriptDataDoubleEscaped(e));}_stateScriptDataDoubleEscapeEnd(e){if(this.preprocessor.startsWith(i,!1)&&x(this.preprocessor.peek(6))){this._emitCodePoint(e);for(let e=0;e<6;e++)this._emitCodePoint(this._consume());this.state=P.SCRIPT_DATA_ESCAPED;}else this._ensureHibernation()||(this.state=P.SCRIPT_DATA_DOUBLE_ESCAPED,this._stateScriptDataDoubleEscaped(e));}_stateBeforeAttributeName(e){switch(e){case a.SPACE:case a.LINE_FEED:case a.TABULATION:case a.FORM_FEED:break;case a.SOLIDUS:case a.GREATER_THAN_SIGN:case a.EOF:this.state=P.AFTER_ATTRIBUTE_NAME,this._stateAfterAttributeName(e);break;case a.EQUALS_SIGN:this._err(T.unexpectedEqualsSignBeforeAttributeName),this._createAttr("="),this.state=P.ATTRIBUTE_NAME;break;default:this._createAttr(""),this.state=P.ATTRIBUTE_NAME,this._stateAttributeName(e);}}_stateAttributeName(e){switch(e){case a.SPACE:case a.LINE_FEED:case a.TABULATION:case a.FORM_FEED:case a.SOLIDUS:case a.GREATER_THAN_SIGN:case a.EOF:this._leaveAttrName(),this.state=P.AFTER_ATTRIBUTE_NAME,this._stateAfterAttributeName(e);break;case a.EQUALS_SIGN:this._leaveAttrName(),this.state=P.BEFORE_ATTRIBUTE_VALUE;break;case a.QUOTATION_MARK:case a.APOSTROPHE:case a.LESS_THAN_SIGN:this._err(T.unexpectedCharacterInAttributeName),this.currentAttr.name+=String.fromCodePoint(e);break;case a.NULL:this._err(T.unexpectedNullCharacter),this.currentAttr.name+=s;break;default:this.currentAttr.name+=String.fromCodePoint(H(e)?w(e):e);}}_stateAfterAttributeName(e){switch(e){case a.SPACE:case a.LINE_FEED:case a.TABULATION:case a.FORM_FEED:break;case a.SOLIDUS:this.state=P.SELF_CLOSING_START_TAG;break;case a.EQUALS_SIGN:this.state=P.BEFORE_ATTRIBUTE_VALUE;break;case a.GREATER_THAN_SIGN:this.state=P.DATA,this.emitCurrentTagToken();break;case a.EOF:this._err(T.eofInTag),this._emitEOFToken();break;default:this._createAttr(""),this.state=P.ATTRIBUTE_NAME,this._stateAttributeName(e);}}_stateBeforeAttributeValue(e){switch(e){case a.SPACE:case a.LINE_FEED:case a.TABULATION:case a.FORM_FEED:break;case a.QUOTATION_MARK:this.state=P.ATTRIBUTE_VALUE_DOUBLE_QUOTED;break;case a.APOSTROPHE:this.state=P.ATTRIBUTE_VALUE_SINGLE_QUOTED;break;case a.GREATER_THAN_SIGN:this._err(T.missingAttributeValue),this.state=P.DATA,this.emitCurrentTagToken();break;default:this.state=P.ATTRIBUTE_VALUE_UNQUOTED,this._stateAttributeValueUnquoted(e);}}_stateAttributeValueDoubleQuoted(e){switch(e){case a.QUOTATION_MARK:this.state=P.AFTER_ATTRIBUTE_VALUE_QUOTED;break;case a.AMPERSAND:this.returnState=P.ATTRIBUTE_VALUE_DOUBLE_QUOTED,this.state=P.CHARACTER_REFERENCE;break;case a.NULL:this._err(T.unexpectedNullCharacter),this.currentAttr.value+=s;break;case a.EOF:this._err(T.eofInTag),this._emitEOFToken();break;default:this.currentAttr.value+=String.fromCodePoint(e);}}_stateAttributeValueSingleQuoted(e){switch(e){case a.APOSTROPHE:this.state=P.AFTER_ATTRIBUTE_VALUE_QUOTED;break;case a.AMPERSAND:this.returnState=P.ATTRIBUTE_VALUE_SINGLE_QUOTED,this.state=P.CHARACTER_REFERENCE;break;case a.NULL:this._err(T.unexpectedNullCharacter),this.currentAttr.value+=s;break;case a.EOF:this._err(T.eofInTag),this._emitEOFToken();break;default:this.currentAttr.value+=String.fromCodePoint(e);}}_stateAttributeValueUnquoted(e){switch(e){case a.SPACE:case a.LINE_FEED:case a.TABULATION:case a.FORM_FEED:this._leaveAttrValue(),this.state=P.BEFORE_ATTRIBUTE_NAME;break;case a.AMPERSAND:this.returnState=P.ATTRIBUTE_VALUE_UNQUOTED,this.state=P.CHARACTER_REFERENCE;break;case a.GREATER_THAN_SIGN:this._leaveAttrValue(),this.state=P.DATA,this.emitCurrentTagToken();break;case a.NULL:this._err(T.unexpectedNullCharacter),this.currentAttr.value+=s;break;case a.QUOTATION_MARK:case a.APOSTROPHE:case a.LESS_THAN_SIGN:case a.EQUALS_SIGN:case a.GRAVE_ACCENT:this._err(T.unexpectedCharacterInUnquotedAttributeValue),this.currentAttr.value+=String.fromCodePoint(e);break;case a.EOF:this._err(T.eofInTag),this._emitEOFToken();break;default:this.currentAttr.value+=String.fromCodePoint(e);}}_stateAfterAttributeValueQuoted(e){switch(e){case a.SPACE:case a.LINE_FEED:case a.TABULATION:case a.FORM_FEED:this._leaveAttrValue(),this.state=P.BEFORE_ATTRIBUTE_NAME;break;case a.SOLIDUS:this._leaveAttrValue(),this.state=P.SELF_CLOSING_START_TAG;break;case a.GREATER_THAN_SIGN:this._leaveAttrValue(),this.state=P.DATA,this.emitCurrentTagToken();break;case a.EOF:this._err(T.eofInTag),this._emitEOFToken();break;default:this._err(T.missingWhitespaceBetweenAttributes),this.state=P.BEFORE_ATTRIBUTE_NAME,this._stateBeforeAttributeName(e);}}_stateSelfClosingStartTag(e){switch(e){case a.GREATER_THAN_SIGN:this.currentToken.selfClosing=!0,this.state=P.DATA,this.emitCurrentTagToken();break;case a.EOF:this._err(T.eofInTag),this._emitEOFToken();break;default:this._err(T.unexpectedSolidusInTag),this.state=P.BEFORE_ATTRIBUTE_NAME,this._stateBeforeAttributeName(e);}}_stateBogusComment(e){const t=this.currentToken;switch(e){case a.GREATER_THAN_SIGN:this.state=P.DATA,this.emitCurrentComment(t);break;case a.EOF:this.emitCurrentComment(t),this._emitEOFToken();break;case a.NULL:this._err(T.unexpectedNullCharacter),t.data+=s;break;default:t.data+=String.fromCodePoint(e);}}_stateMarkupDeclarationOpen(e){this._consumeSequenceIfMatch("--",!0)?(this._createCommentToken(3),this.state=P.COMMENT_START):this._consumeSequenceIfMatch(n,!1)?(this.currentLocation=this.getCurrentLocation(8),this.state=P.DOCTYPE):this._consumeSequenceIfMatch(r,!0)?this.inForeignNode?this.state=P.CDATA_SECTION:(this._err(T.cdataInHtmlContent),this._createCommentToken(8),this.currentToken.data="[CDATA[",this.state=P.BOGUS_COMMENT):this._ensureHibernation()||(this._err(T.incorrectlyOpenedComment),this._createCommentToken(2),this.state=P.BOGUS_COMMENT,this._stateBogusComment(e));}_stateCommentStart(e){switch(e){case a.HYPHEN_MINUS:this.state=P.COMMENT_START_DASH;break;case a.GREATER_THAN_SIGN:{this._err(T.abruptClosingOfEmptyComment),this.state=P.DATA;const e=this.currentToken;this.emitCurrentComment(e);break}default:this.state=P.COMMENT,this._stateComment(e);}}_stateCommentStartDash(e){const t=this.currentToken;switch(e){case a.HYPHEN_MINUS:this.state=P.COMMENT_END;break;case a.GREATER_THAN_SIGN:this._err(T.abruptClosingOfEmptyComment),this.state=P.DATA,this.emitCurrentComment(t);break;case a.EOF:this._err(T.eofInComment),this.emitCurrentComment(t),this._emitEOFToken();break;default:t.data+="-",this.state=P.COMMENT,this._stateComment(e);}}_stateComment(e){const t=this.currentToken;switch(e){case a.HYPHEN_MINUS:this.state=P.COMMENT_END_DASH;break;case a.LESS_THAN_SIGN:t.data+="<",this.state=P.COMMENT_LESS_THAN_SIGN;break;case a.NULL:this._err(T.unexpectedNullCharacter),t.data+=s;break;case a.EOF:this._err(T.eofInComment),this.emitCurrentComment(t),this._emitEOFToken();break;default:t.data+=String.fromCodePoint(e);}}_stateCommentLessThanSign(e){const t=this.currentToken;switch(e){case a.EXCLAMATION_MARK:t.data+="!",this.state=P.COMMENT_LESS_THAN_SIGN_BANG;break;case a.LESS_THAN_SIGN:t.data+="<";break;default:this.state=P.COMMENT,this._stateComment(e);}}_stateCommentLessThanSignBang(e){e===a.HYPHEN_MINUS?this.state=P.COMMENT_LESS_THAN_SIGN_BANG_DASH:(this.state=P.COMMENT,this._stateComment(e));}_stateCommentLessThanSignBangDash(e){e===a.HYPHEN_MINUS?this.state=P.COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH:(this.state=P.COMMENT_END_DASH,this._stateCommentEndDash(e));}_stateCommentLessThanSignBangDashDash(e){e!==a.GREATER_THAN_SIGN&&e!==a.EOF&&this._err(T.nestedComment),this.state=P.COMMENT_END,this._stateCommentEnd(e);}_stateCommentEndDash(e){const t=this.currentToken;switch(e){case a.HYPHEN_MINUS:this.state=P.COMMENT_END;break;case a.EOF:this._err(T.eofInComment),this.emitCurrentComment(t),this._emitEOFToken();break;default:t.data+="-",this.state=P.COMMENT,this._stateComment(e);}}_stateCommentEnd(e){const t=this.currentToken;switch(e){case a.GREATER_THAN_SIGN:this.state=P.DATA,this.emitCurrentComment(t);break;case a.EXCLAMATION_MARK:this.state=P.COMMENT_END_BANG;break;case a.HYPHEN_MINUS:t.data+="-";break;case a.EOF:this._err(T.eofInComment),this.emitCurrentComment(t),this._emitEOFToken();break;default:t.data+="--",this.state=P.COMMENT,this._stateComment(e);}}_stateCommentEndBang(e){const t=this.currentToken;switch(e){case a.HYPHEN_MINUS:t.data+="--!",this.state=P.COMMENT_END_DASH;break;case a.GREATER_THAN_SIGN:this._err(T.incorrectlyClosedComment),this.state=P.DATA,this.emitCurrentComment(t);break;case a.EOF:this._err(T.eofInComment),this.emitCurrentComment(t),this._emitEOFToken();break;default:t.data+="--!",this.state=P.COMMENT,this._stateComment(e);}}_stateDoctype(e){switch(e){case a.SPACE:case a.LINE_FEED:case a.TABULATION:case a.FORM_FEED:this.state=P.BEFORE_DOCTYPE_NAME;break;case a.GREATER_THAN_SIGN:this.state=P.BEFORE_DOCTYPE_NAME,this._stateBeforeDoctypeName(e);break;case a.EOF:{this._err(T.eofInDoctype),this._createDoctypeToken(null);const e=this.currentToken;e.forceQuirks=!0,this.emitCurrentDoctype(e),this._emitEOFToken();break}default:this._err(T.missingWhitespaceBeforeDoctypeName),this.state=P.BEFORE_DOCTYPE_NAME,this._stateBeforeDoctypeName(e);}}_stateBeforeDoctypeName(e){if(H(e))this._createDoctypeToken(String.fromCharCode(w(e))),this.state=P.DOCTYPE_NAME;else switch(e){case a.SPACE:case a.LINE_FEED:case a.TABULATION:case a.FORM_FEED:break;case a.NULL:this._err(T.unexpectedNullCharacter),this._createDoctypeToken(s),this.state=P.DOCTYPE_NAME;break;case a.GREATER_THAN_SIGN:{this._err(T.missingDoctypeName),this._createDoctypeToken(null);const e=this.currentToken;e.forceQuirks=!0,this.emitCurrentDoctype(e),this.state=P.DATA;break}case a.EOF:{this._err(T.eofInDoctype),this._createDoctypeToken(null);const e=this.currentToken;e.forceQuirks=!0,this.emitCurrentDoctype(e),this._emitEOFToken();break}default:this._createDoctypeToken(String.fromCodePoint(e)),this.state=P.DOCTYPE_NAME;}}_stateDoctypeName(e){const t=this.currentToken;switch(e){case a.SPACE:case a.LINE_FEED:case a.TABULATION:case a.FORM_FEED:this.state=P.AFTER_DOCTYPE_NAME;break;case a.GREATER_THAN_SIGN:this.state=P.DATA,this.emitCurrentDoctype(t);break;case a.NULL:this._err(T.unexpectedNullCharacter),t.name+=s;break;case a.EOF:this._err(T.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:t.name+=String.fromCodePoint(H(e)?w(e):e);}}_stateAfterDoctypeName(e){const t=this.currentToken;switch(e){case a.SPACE:case a.LINE_FEED:case a.TABULATION:case a.FORM_FEED:break;case a.GREATER_THAN_SIGN:this.state=P.DATA,this.emitCurrentDoctype(t);break;case a.EOF:this._err(T.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:this._consumeSequenceIfMatch("public",!1)?this.state=P.AFTER_DOCTYPE_PUBLIC_KEYWORD:this._consumeSequenceIfMatch("system",!1)?this.state=P.AFTER_DOCTYPE_SYSTEM_KEYWORD:this._ensureHibernation()||(this._err(T.invalidCharacterSequenceAfterDoctypeName),t.forceQuirks=!0,this.state=P.BOGUS_DOCTYPE,this._stateBogusDoctype(e));}}_stateAfterDoctypePublicKeyword(e){const t=this.currentToken;switch(e){case a.SPACE:case a.LINE_FEED:case a.TABULATION:case a.FORM_FEED:this.state=P.BEFORE_DOCTYPE_PUBLIC_IDENTIFIER;break;case a.QUOTATION_MARK:this._err(T.missingWhitespaceAfterDoctypePublicKeyword),t.publicId="",this.state=P.DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED;break;case a.APOSTROPHE:this._err(T.missingWhitespaceAfterDoctypePublicKeyword),t.publicId="",this.state=P.DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED;break;case a.GREATER_THAN_SIGN:this._err(T.missingDoctypePublicIdentifier),t.forceQuirks=!0,this.state=P.DATA,this.emitCurrentDoctype(t);break;case a.EOF:this._err(T.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:this._err(T.missingQuoteBeforeDoctypePublicIdentifier),t.forceQuirks=!0,this.state=P.BOGUS_DOCTYPE,this._stateBogusDoctype(e);}}_stateBeforeDoctypePublicIdentifier(e){const t=this.currentToken;switch(e){case a.SPACE:case a.LINE_FEED:case a.TABULATION:case a.FORM_FEED:break;case a.QUOTATION_MARK:t.publicId="",this.state=P.DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED;break;case a.APOSTROPHE:t.publicId="",this.state=P.DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED;break;case a.GREATER_THAN_SIGN:this._err(T.missingDoctypePublicIdentifier),t.forceQuirks=!0,this.state=P.DATA,this.emitCurrentDoctype(t);break;case a.EOF:this._err(T.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:this._err(T.missingQuoteBeforeDoctypePublicIdentifier),t.forceQuirks=!0,this.state=P.BOGUS_DOCTYPE,this._stateBogusDoctype(e);}}_stateDoctypePublicIdentifierDoubleQuoted(e){const t=this.currentToken;switch(e){case a.QUOTATION_MARK:this.state=P.AFTER_DOCTYPE_PUBLIC_IDENTIFIER;break;case a.NULL:this._err(T.unexpectedNullCharacter),t.publicId+=s;break;case a.GREATER_THAN_SIGN:this._err(T.abruptDoctypePublicIdentifier),t.forceQuirks=!0,this.emitCurrentDoctype(t),this.state=P.DATA;break;case a.EOF:this._err(T.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:t.publicId+=String.fromCodePoint(e);}}_stateDoctypePublicIdentifierSingleQuoted(e){const t=this.currentToken;switch(e){case a.APOSTROPHE:this.state=P.AFTER_DOCTYPE_PUBLIC_IDENTIFIER;break;case a.NULL:this._err(T.unexpectedNullCharacter),t.publicId+=s;break;case a.GREATER_THAN_SIGN:this._err(T.abruptDoctypePublicIdentifier),t.forceQuirks=!0,this.emitCurrentDoctype(t),this.state=P.DATA;break;case a.EOF:this._err(T.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:t.publicId+=String.fromCodePoint(e);}}_stateAfterDoctypePublicIdentifier(e){const t=this.currentToken;switch(e){case a.SPACE:case a.LINE_FEED:case a.TABULATION:case a.FORM_FEED:this.state=P.BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS;break;case a.GREATER_THAN_SIGN:this.state=P.DATA,this.emitCurrentDoctype(t);break;case a.QUOTATION_MARK:this._err(T.missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers),t.systemId="",this.state=P.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;break;case a.APOSTROPHE:this._err(T.missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers),t.systemId="",this.state=P.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;break;case a.EOF:this._err(T.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:this._err(T.missingQuoteBeforeDoctypeSystemIdentifier),t.forceQuirks=!0,this.state=P.BOGUS_DOCTYPE,this._stateBogusDoctype(e);}}_stateBetweenDoctypePublicAndSystemIdentifiers(e){const t=this.currentToken;switch(e){case a.SPACE:case a.LINE_FEED:case a.TABULATION:case a.FORM_FEED:break;case a.GREATER_THAN_SIGN:this.emitCurrentDoctype(t),this.state=P.DATA;break;case a.QUOTATION_MARK:t.systemId="",this.state=P.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;break;case a.APOSTROPHE:t.systemId="",this.state=P.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;break;case a.EOF:this._err(T.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:this._err(T.missingQuoteBeforeDoctypeSystemIdentifier),t.forceQuirks=!0,this.state=P.BOGUS_DOCTYPE,this._stateBogusDoctype(e);}}_stateAfterDoctypeSystemKeyword(e){const t=this.currentToken;switch(e){case a.SPACE:case a.LINE_FEED:case a.TABULATION:case a.FORM_FEED:this.state=P.BEFORE_DOCTYPE_SYSTEM_IDENTIFIER;break;case a.QUOTATION_MARK:this._err(T.missingWhitespaceAfterDoctypeSystemKeyword),t.systemId="",this.state=P.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;break;case a.APOSTROPHE:this._err(T.missingWhitespaceAfterDoctypeSystemKeyword),t.systemId="",this.state=P.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;break;case a.GREATER_THAN_SIGN:this._err(T.missingDoctypeSystemIdentifier),t.forceQuirks=!0,this.state=P.DATA,this.emitCurrentDoctype(t);break;case a.EOF:this._err(T.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:this._err(T.missingQuoteBeforeDoctypeSystemIdentifier),t.forceQuirks=!0,this.state=P.BOGUS_DOCTYPE,this._stateBogusDoctype(e);}}_stateBeforeDoctypeSystemIdentifier(e){const t=this.currentToken;switch(e){case a.SPACE:case a.LINE_FEED:case a.TABULATION:case a.FORM_FEED:break;case a.QUOTATION_MARK:t.systemId="",this.state=P.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;break;case a.APOSTROPHE:t.systemId="",this.state=P.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;break;case a.GREATER_THAN_SIGN:this._err(T.missingDoctypeSystemIdentifier),t.forceQuirks=!0,this.state=P.DATA,this.emitCurrentDoctype(t);break;case a.EOF:this._err(T.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:this._err(T.missingQuoteBeforeDoctypeSystemIdentifier),t.forceQuirks=!0,this.state=P.BOGUS_DOCTYPE,this._stateBogusDoctype(e);}}_stateDoctypeSystemIdentifierDoubleQuoted(e){const t=this.currentToken;switch(e){case a.QUOTATION_MARK:this.state=P.AFTER_DOCTYPE_SYSTEM_IDENTIFIER;break;case a.NULL:this._err(T.unexpectedNullCharacter),t.systemId+=s;break;case a.GREATER_THAN_SIGN:this._err(T.abruptDoctypeSystemIdentifier),t.forceQuirks=!0,this.emitCurrentDoctype(t),this.state=P.DATA;break;case a.EOF:this._err(T.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:t.systemId+=String.fromCodePoint(e);}}_stateDoctypeSystemIdentifierSingleQuoted(e){const t=this.currentToken;switch(e){case a.APOSTROPHE:this.state=P.AFTER_DOCTYPE_SYSTEM_IDENTIFIER;break;case a.NULL:this._err(T.unexpectedNullCharacter),t.systemId+=s;break;case a.GREATER_THAN_SIGN:this._err(T.abruptDoctypeSystemIdentifier),t.forceQuirks=!0,this.emitCurrentDoctype(t),this.state=P.DATA;break;case a.EOF:this._err(T.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:t.systemId+=String.fromCodePoint(e);}}_stateAfterDoctypeSystemIdentifier(e){const t=this.currentToken;switch(e){case a.SPACE:case a.LINE_FEED:case a.TABULATION:case a.FORM_FEED:break;case a.GREATER_THAN_SIGN:this.emitCurrentDoctype(t),this.state=P.DATA;break;case a.EOF:this._err(T.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:this._err(T.unexpectedCharacterAfterDoctypeSystemIdentifier),this.state=P.BOGUS_DOCTYPE,this._stateBogusDoctype(e);}}_stateBogusDoctype(e){const t=this.currentToken;switch(e){case a.GREATER_THAN_SIGN:this.emitCurrentDoctype(t),this.state=P.DATA;break;case a.NULL:this._err(T.unexpectedNullCharacter);break;case a.EOF:this.emitCurrentDoctype(t),this._emitEOFToken();}}_stateCdataSection(e){switch(e){case a.RIGHT_SQUARE_BRACKET:this.state=P.CDATA_SECTION_BRACKET;break;case a.EOF:this._err(T.eofInCdata),this._emitEOFToken();break;default:this._emitCodePoint(e);}}_stateCdataSectionBracket(e){e===a.RIGHT_SQUARE_BRACKET?this.state=P.CDATA_SECTION_END:(this._emitChars("]"),this.state=P.CDATA_SECTION,this._stateCdataSection(e));}_stateCdataSectionEnd(e){switch(e){case a.GREATER_THAN_SIGN:this.state=P.DATA;break;case a.RIGHT_SQUARE_BRACKET:this._emitChars("]");break;default:this._emitChars("]]"),this.state=P.CDATA_SECTION,this._stateCdataSection(e);}}_stateCharacterReference(e){e===a.NUMBER_SIGN?this.state=P.NUMERIC_CHARACTER_REFERENCE:U(e)?(this.state=P.NAMED_CHARACTER_REFERENCE,this._stateNamedCharacterReference(e)):(this._flushCodePointConsumedAsCharacterReference(a.AMPERSAND),this._reconsumeInState(this.returnState,e));}_stateNamedCharacterReference(e){const t=this._matchNamedCharacterReference(e);if(this._ensureHibernation());else if(t){for(let e=0;e<t.length;e++)this._flushCodePointConsumedAsCharacterReference(t[e]);this.state=this.returnState;}else this._flushCodePointConsumedAsCharacterReference(a.AMPERSAND),this.state=P.AMBIGUOUS_AMPERSAND;}_stateAmbiguousAmpersand(e){U(e)?this._flushCodePointConsumedAsCharacterReference(e):(e===a.SEMICOLON&&this._err(T.unknownNamedCharacterReference),this._reconsumeInState(this.returnState,e));}_stateNumericCharacterReference(e){this.charRefCode=0,e===a.LATIN_SMALL_X||e===a.LATIN_CAPITAL_X?this.state=P.HEXADEMICAL_CHARACTER_REFERENCE_START:B(e)?(this.state=P.DECIMAL_CHARACTER_REFERENCE,this._stateDecimalCharacterReference(e)):(this._err(T.absenceOfDigitsInNumericCharacterReference),this._flushCodePointConsumedAsCharacterReference(a.AMPERSAND),this._flushCodePointConsumedAsCharacterReference(a.NUMBER_SIGN),this._reconsumeInState(this.returnState,e));}_stateHexademicalCharacterReferenceStart(e){!function(e){return B(e)||G(e)||y(e)}(e)?(this._err(T.absenceOfDigitsInNumericCharacterReference),this._flushCodePointConsumedAsCharacterReference(a.AMPERSAND),this._flushCodePointConsumedAsCharacterReference(a.NUMBER_SIGN),this._unconsume(2),this.state=this.returnState):(this.state=P.HEXADEMICAL_CHARACTER_REFERENCE,this._stateHexademicalCharacterReference(e));}_stateHexademicalCharacterReference(e){G(e)?this.charRefCode=16*this.charRefCode+e-55:y(e)?this.charRefCode=16*this.charRefCode+e-87:B(e)?this.charRefCode=16*this.charRefCode+e-48:e===a.SEMICOLON?this.state=P.NUMERIC_CHARACTER_REFERENCE_END:(this._err(T.missingSemicolonAfterCharacterReference),this.state=P.NUMERIC_CHARACTER_REFERENCE_END,this._stateNumericCharacterReferenceEnd(e));}_stateDecimalCharacterReference(e){B(e)?this.charRefCode=10*this.charRefCode+e-48:e===a.SEMICOLON?this.state=P.NUMERIC_CHARACTER_REFERENCE_END:(this._err(T.missingSemicolonAfterCharacterReference),this.state=P.NUMERIC_CHARACTER_REFERENCE_END,this._stateNumericCharacterReferenceEnd(e));}_stateNumericCharacterReferenceEnd(e){if(this.charRefCode===a.NULL)this._err(T.nullCharacterReference),this.charRefCode=a.REPLACEMENT_CHARACTER;else if(this.charRefCode>1114111)this._err(T.characterReferenceOutsideUnicodeRange),this.charRefCode=a.REPLACEMENT_CHARACTER;else if(o(this.charRefCode))this._err(T.surrogateCharacterReference),this.charRefCode=a.REPLACEMENT_CHARACTER;else if(E(this.charRefCode))this._err(T.noncharacterCharacterReference);else if(c(this.charRefCode)||this.charRefCode===a.CARRIAGE_RETURN){this._err(T.controlCharacterReference);const e=k.get(this.charRefCode);void 0!==e&&(this.charRefCode=e);}this._flushCodePointConsumedAsCharacterReference(this.charRefCode),this._reconsumeInState(this.returnState,e);}}const Q=new Set([u.DD,u.DT,u.LI,u.OPTGROUP,u.OPTION,u.P,u.RB,u.RP,u.RT,u.RTC]),q=new Set([...Q,u.CAPTION,u.COLGROUP,u.TBODY,u.TD,u.TFOOT,u.TH,u.THEAD,u.TR]),W=new Map([[u.APPLET,p.HTML],[u.CAPTION,p.HTML],[u.HTML,p.HTML],[u.MARQUEE,p.HTML],[u.OBJECT,p.HTML],[u.TABLE,p.HTML],[u.TD,p.HTML],[u.TEMPLATE,p.HTML],[u.TH,p.HTML],[u.ANNOTATION_XML,p.MATHML],[u.MI,p.MATHML],[u.MN,p.MATHML],[u.MO,p.MATHML],[u.MS,p.MATHML],[u.MTEXT,p.MATHML],[u.DESC,p.SVG],[u.FOREIGN_OBJECT,p.SVG],[u.TITLE,p.SVG]]),X=[u.H1,u.H2,u.H3,u.H4,u.H5,u.H6],K=[u.TR,u.TEMPLATE,u.HTML],V=[u.TBODY,u.TFOOT,u.THEAD,u.TEMPLATE,u.HTML],z=[u.TABLE,u.TEMPLATE,u.HTML],j=[u.TD,u.TH];class J{get currentTmplContentOrNode(){return this._isInTemplate()?this.treeAdapter.getTemplateContent(this.current):this.current}constructor(e,t,s){this.treeAdapter=t,this.handler=s,this.items=[],this.tagIDs=[],this.stackTop=-1,this.tmplCount=0,this.currentTagId=u.UNKNOWN,this.current=e;}_indexOf(e){return this.items.lastIndexOf(e,this.stackTop)}_isInTemplate(){return this.currentTagId===u.TEMPLATE&&this.treeAdapter.getNamespaceURI(this.current)===p.HTML}_updateCurrentElement(){this.current=this.items[this.stackTop],this.currentTagId=this.tagIDs[this.stackTop];}push(e,t){this.stackTop++,this.items[this.stackTop]=e,this.current=e,this.tagIDs[this.stackTop]=t,this.currentTagId=t,this._isInTemplate()&&this.tmplCount++,this.handler.onItemPush(e,t,!0);}pop(){const e=this.current;this.tmplCount>0&&this._isInTemplate()&&this.tmplCount--,this.stackTop--,this._updateCurrentElement(),this.handler.onItemPop(e,!0);}replace(e,t){const s=this._indexOf(e);this.items[s]=t,s===this.stackTop&&(this.current=t);}insertAfter(e,t,s){const a=this._indexOf(e)+1;this.items.splice(a,0,t),this.tagIDs.splice(a,0,s),this.stackTop++,a===this.stackTop&&this._updateCurrentElement(),this.handler.onItemPush(this.current,this.currentTagId,a===this.stackTop);}popUntilTagNamePopped(e){let t=this.stackTop+1;do{t=this.tagIDs.lastIndexOf(e,t-1);}while(t>0&&this.treeAdapter.getNamespaceURI(this.items[t])!==p.HTML);this.shortenToLength(t<0?0:t);}shortenToLength(e){for(;this.stackTop>=e;){const t=this.current;this.tmplCount>0&&this._isInTemplate()&&(this.tmplCount-=1),this.stackTop--,this._updateCurrentElement(),this.handler.onItemPop(t,this.stackTop<e);}}popUntilElementPopped(e){const t=this._indexOf(e);this.shortenToLength(t<0?0:t);}popUntilPopped(e,t){const s=this._indexOfTagNames(e,t);this.shortenToLength(s<0?0:s);}popUntilNumberedHeaderPopped(){this.popUntilPopped(X,p.HTML);}popUntilTableCellPopped(){this.popUntilPopped(j,p.HTML);}popAllUpToHtmlElement(){this.tmplCount=0,this.shortenToLength(1);}_indexOfTagNames(e,t){for(let s=this.stackTop;s>=0;s--)if(e.includes(this.tagIDs[s])&&this.treeAdapter.getNamespaceURI(this.items[s])===t)return s;return -1}clearBackTo(e,t){const s=this._indexOfTagNames(e,t);this.shortenToLength(s+1);}clearBackToTableContext(){this.clearBackTo(z,p.HTML);}clearBackToTableBodyContext(){this.clearBackTo(V,p.HTML);}clearBackToTableRowContext(){this.clearBackTo(K,p.HTML);}remove(e){const t=this._indexOf(e);t>=0&&(t===this.stackTop?this.pop():(this.items.splice(t,1),this.tagIDs.splice(t,1),this.stackTop--,this._updateCurrentElement(),this.handler.onItemPop(e,!1)));}tryPeekProperlyNestedBodyElement(){return this.stackTop>=1&&this.tagIDs[1]===u.BODY?this.items[1]:null}contains(e){return this._indexOf(e)>-1}getCommonAncestor(e){const t=this._indexOf(e)-1;return t>=0?this.items[t]:null}isRootHtmlElementCurrent(){return 0===this.stackTop&&this.tagIDs[0]===u.HTML}hasInScope(e){for(let t=this.stackTop;t>=0;t--){const s=this.tagIDs[t],a=this.treeAdapter.getNamespaceURI(this.items[t]);if(s===e&&a===p.HTML)return !0;if(W.get(s)===a)return !1}return !0}hasNumberedHeaderInScope(){for(let e=this.stackTop;e>=0;e--){const t=this.tagIDs[e],s=this.treeAdapter.getNamespaceURI(this.items[e]);if(g(t)&&s===p.HTML)return !0;if(W.get(t)===s)return !1}return !0}hasInListItemScope(e){for(let t=this.stackTop;t>=0;t--){const s=this.tagIDs[t],a=this.treeAdapter.getNamespaceURI(this.items[t]);if(s===e&&a===p.HTML)return !0;if((s===u.UL||s===u.OL)&&a===p.HTML||W.get(s)===a)return !1}return !0}hasInButtonScope(e){for(let t=this.stackTop;t>=0;t--){const s=this.tagIDs[t],a=this.treeAdapter.getNamespaceURI(this.items[t]);if(s===e&&a===p.HTML)return !0;if(s===u.BUTTON&&a===p.HTML||W.get(s)===a)return !1}return !0}hasInTableScope(e){for(let t=this.stackTop;t>=0;t--){const s=this.tagIDs[t];if(this.treeAdapter.getNamespaceURI(this.items[t])===p.HTML){if(s===e)return !0;if(s===u.TABLE||s===u.TEMPLATE||s===u.HTML)return !1}}return !0}hasTableBodyContextInTableScope(){for(let e=this.stackTop;e>=0;e--){const t=this.tagIDs[e];if(this.treeAdapter.getNamespaceURI(this.items[e])===p.HTML){if(t===u.TBODY||t===u.THEAD||t===u.TFOOT)return !0;if(t===u.TABLE||t===u.HTML)return !1}}return !0}hasInSelectScope(e){for(let t=this.stackTop;t>=0;t--){const s=this.tagIDs[t];if(this.treeAdapter.getNamespaceURI(this.items[t])===p.HTML){if(s===e)return !0;if(s!==u.OPTION&&s!==u.OPTGROUP)return !1}}return !0}generateImpliedEndTags(){for(;Q.has(this.currentTagId);)this.pop();}generateImpliedEndTagsThoroughly(){for(;q.has(this.currentTagId);)this.pop();}generateImpliedEndTagsWithExclusion(e){for(;this.currentTagId!==e&&q.has(this.currentTagId);)this.pop();}}var Z;!function(e){e[e.Marker=0]="Marker",e[e.Element=1]="Element";}(Z=Z||(Z={}));const $={type:Z.Marker};class ee{constructor(e){this.treeAdapter=e,this.entries=[],this.bookmark=null;}_getNoahArkConditionCandidates(e,t){const s=[],a=t.length,r=this.treeAdapter.getTagName(e),n=this.treeAdapter.getNamespaceURI(e);for(let e=0;e<this.entries.length;e++){const t=this.entries[e];if(t.type===Z.Marker)break;const{element:i}=t;if(this.treeAdapter.getTagName(i)===r&&this.treeAdapter.getNamespaceURI(i)===n){const t=this.treeAdapter.getAttrList(i);t.length===a&&s.push({idx:e,attrs:t});}}return s}_ensureNoahArkCondition(e){if(this.entries.length<3)return;const t=this.treeAdapter.getAttrList(e),s=this._getNoahArkConditionCandidates(e,t);if(s.length<3)return;const a=new Map(t.map((e=>[e.name,e.value])));let r=0;for(let e=0;e<s.length;e++){const t=s[e];t.attrs.every((e=>a.get(e.name)===e.value))&&(r+=1,r>=3&&this.entries.splice(t.idx,1));}}insertMarker(){this.entries.unshift($);}pushElement(e,t){this._ensureNoahArkCondition(e),this.entries.unshift({type:Z.Element,element:e,token:t});}insertElementAfterBookmark(e,t){const s=this.entries.indexOf(this.bookmark);this.entries.splice(s,0,{type:Z.Element,element:e,token:t});}removeEntry(e){const t=this.entries.indexOf(e);t>=0&&this.entries.splice(t,1);}clearToLastMarker(){const e=this.entries.indexOf($);e>=0?this.entries.splice(0,e+1):this.entries.length=0;}getElementEntryInScopeWithTagName(e){const t=this.entries.find((t=>t.type===Z.Marker||this.treeAdapter.getTagName(t.element)===e));return t&&t.type===Z.Element?t:null}getElementEntry(e){return this.entries.find((t=>t.type===Z.Element&&t.element===e))}}function te(e){return {nodeName:"#text",value:e,parentNode:null}}const se={createDocument:()=>({nodeName:"#document",mode:I.NO_QUIRKS,childNodes:[]}),createDocumentFragment:()=>({nodeName:"#document-fragment",childNodes:[]}),createElement:(e,t,s)=>({nodeName:e,tagName:e,attrs:s,namespaceURI:t,childNodes:[],parentNode:null}),createCommentNode:e=>({nodeName:"#comment",data:e,parentNode:null}),appendChild(e,t){e.childNodes.push(t),t.parentNode=e;},insertBefore(e,t,s){const a=e.childNodes.indexOf(s);e.childNodes.splice(a,0,t),t.parentNode=e;},setTemplateContent(e,t){e.content=t;},getTemplateContent:e=>e.content,setDocumentType(e,t,s,a){const r=e.childNodes.find((e=>"#documentType"===e.nodeName));if(r)r.name=t,r.publicId=s,r.systemId=a;else {const r={nodeName:"#documentType",name:t,publicId:s,systemId:a,parentNode:null};se.appendChild(e,r);}},setDocumentMode(e,t){e.mode=t;},getDocumentMode:e=>e.mode,detachNode(e){if(e.parentNode){const t=e.parentNode.childNodes.indexOf(e);e.parentNode.childNodes.splice(t,1),e.parentNode=null;}},insertText(e,t){if(e.childNodes.length>0){const s=e.childNodes[e.childNodes.length-1];if(se.isTextNode(s))return void(s.value+=t)}se.appendChild(e,te(t));},insertTextBefore(e,t,s){const a=e.childNodes[e.childNodes.indexOf(s)-1];a&&se.isTextNode(a)?a.value+=t:se.insertBefore(e,te(t),s);},adoptAttributes(e,t){const s=new Set(e.attrs.map((e=>e.name)));for(let a=0;a<t.length;a++)s.has(t[a].name)||e.attrs.push(t[a]);},getFirstChild:e=>e.childNodes[0],getChildNodes:e=>e.childNodes,getParentNode:e=>e.parentNode,getAttrList:e=>e.attrs,getTagName:e=>e.tagName,getNamespaceURI:e=>e.namespaceURI,getTextNodeContent:e=>e.value,getCommentNodeContent:e=>e.data,getDocumentTypeNodeName:e=>e.name,getDocumentTypeNodePublicId:e=>e.publicId,getDocumentTypeNodeSystemId:e=>e.systemId,isTextNode:e=>"#text"===e.nodeName,isCommentNode:e=>"#comment"===e.nodeName,isDocumentTypeNode:e=>"#documentType"===e.nodeName,isElementNode:e=>Object.prototype.hasOwnProperty.call(e,"tagName"),setNodeSourceCodeLocation(e,t){e.sourceCodeLocation=t;},getNodeSourceCodeLocation:e=>e.sourceCodeLocation,updateNodeSourceCodeLocation(e,t){e.sourceCodeLocation={...e.sourceCodeLocation,...t};}},ae="html",re=["+//silmaril//dtd html pro v0r11 19970101//","-//as//dtd html 3.0 aswedit + extensions//","-//advasoft ltd//dtd html 3.0 aswedit + extensions//","-//ietf//dtd html 2.0 level 1//","-//ietf//dtd html 2.0 level 2//","-//ietf//dtd html 2.0 strict level 1//","-//ietf//dtd html 2.0 strict level 2//","-//ietf//dtd html 2.0 strict//","-//ietf//dtd html 2.0//","-//ietf//dtd html 2.1e//","-//ietf//dtd html 3.0//","-//ietf//dtd html 3.2 final//","-//ietf//dtd html 3.2//","-//ietf//dtd html 3//","-//ietf//dtd html level 0//","-//ietf//dtd html level 1//","-//ietf//dtd html level 2//","-//ietf//dtd html level 3//","-//ietf//dtd html strict level 0//","-//ietf//dtd html strict level 1//","-//ietf//dtd html strict level 2//","-//ietf//dtd html strict level 3//","-//ietf//dtd html strict//","-//ietf//dtd html//","-//metrius//dtd metrius presentational//","-//microsoft//dtd internet explorer 2.0 html strict//","-//microsoft//dtd internet explorer 2.0 html//","-//microsoft//dtd internet explorer 2.0 tables//","-//microsoft//dtd internet explorer 3.0 html strict//","-//microsoft//dtd internet explorer 3.0 html//","-//microsoft//dtd internet explorer 3.0 tables//","-//netscape comm. corp.//dtd html//","-//netscape comm. corp.//dtd strict html//","-//o'reilly and associates//dtd html 2.0//","-//o'reilly and associates//dtd html extended 1.0//","-//o'reilly and associates//dtd html extended relaxed 1.0//","-//sq//dtd html 2.0 hotmetal + extensions//","-//softquad software//dtd hotmetal pro 6.0::19990601::extensions to html 4.0//","-//softquad//dtd hotmetal pro 4.0::19971010::extensions to html 4.0//","-//spyglass//dtd html 2.0 extended//","-//sun microsystems corp.//dtd hotjava html//","-//sun microsystems corp.//dtd hotjava strict html//","-//w3c//dtd html 3 1995-03-24//","-//w3c//dtd html 3.2 draft//","-//w3c//dtd html 3.2 final//","-//w3c//dtd html 3.2//","-//w3c//dtd html 3.2s draft//","-//w3c//dtd html 4.0 frameset//","-//w3c//dtd html 4.0 transitional//","-//w3c//dtd html experimental 19960712//","-//w3c//dtd html experimental 970421//","-//w3c//dtd w3 html//","-//w3o//dtd w3 html 3.0//","-//webtechs//dtd mozilla html 2.0//","-//webtechs//dtd mozilla html//"],ne=[...re,"-//w3c//dtd html 4.01 frameset//","-//w3c//dtd html 4.01 transitional//"],ie=new Set(["-//w3o//dtd w3 html strict 3.0//en//","-/w3c/dtd html 4.0 transitional/en","html"]),oe=["-//w3c//dtd xhtml 1.0 frameset//","-//w3c//dtd xhtml 1.0 transitional//"],ce=[...oe,"-//w3c//dtd html 4.01 frameset//","-//w3c//dtd html 4.01 transitional//"];function Ee(e,t){return t.some((t=>e.startsWith(t)))}const Te="text/html",he="application/xhtml+xml",_e="definitionurl",Ae="definitionURL",le=new Map(["attributeName","attributeType","baseFrequency","baseProfile","calcMode","clipPathUnits","diffuseConstant","edgeMode","filterUnits","glyphRef","gradientTransform","gradientUnits","kernelMatrix","kernelUnitLength","keyPoints","keySplines","keyTimes","lengthAdjust","limitingConeAngle","markerHeight","markerUnits","markerWidth","maskContentUnits","maskUnits","numOctaves","pathLength","patternContentUnits","patternTransform","patternUnits","pointsAtX","pointsAtY","pointsAtZ","preserveAlpha","preserveAspectRatio","primitiveUnits","refX","refY","repeatCount","repeatDur","requiredExtensions","requiredFeatures","specularConstant","specularExponent","spreadMethod","startOffset","stdDeviation","stitchTiles","surfaceScale","systemLanguage","tableValues","targetX","targetY","textLength","viewBox","viewTarget","xChannelSelector","yChannelSelector","zoomAndPan"].map((e=>[e.toLowerCase(),e]))),me=new Map([["xlink:actuate",{prefix:"xlink",name:"actuate",namespace:p.XLINK}],["xlink:arcrole",{prefix:"xlink",name:"arcrole",namespace:p.XLINK}],["xlink:href",{prefix:"xlink",name:"href",namespace:p.XLINK}],["xlink:role",{prefix:"xlink",name:"role",namespace:p.XLINK}],["xlink:show",{prefix:"xlink",name:"show",namespace:p.XLINK}],["xlink:title",{prefix:"xlink",name:"title",namespace:p.XLINK}],["xlink:type",{prefix:"xlink",name:"type",namespace:p.XLINK}],["xml:base",{prefix:"xml",name:"base",namespace:p.XML}],["xml:lang",{prefix:"xml",name:"lang",namespace:p.XML}],["xml:space",{prefix:"xml",name:"space",namespace:p.XML}],["xmlns",{prefix:"",name:"xmlns",namespace:p.XMLNS}],["xmlns:xlink",{prefix:"xmlns",name:"xlink",namespace:p.XMLNS}]]),pe=new Map(["altGlyph","altGlyphDef","altGlyphItem","animateColor","animateMotion","animateTransform","clipPath","feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence","foreignObject","glyphRef","linearGradient","radialGradient","textPath"].map((e=>[e.toLowerCase(),e]))),de=new Set([u.B,u.BIG,u.BLOCKQUOTE,u.BODY,u.BR,u.CENTER,u.CODE,u.DD,u.DIV,u.DL,u.DT,u.EM,u.EMBED,u.H1,u.H2,u.H3,u.H4,u.H5,u.H6,u.HEAD,u.HR,u.I,u.IMG,u.LI,u.LISTING,u.MENU,u.META,u.NOBR,u.OL,u.P,u.PRE,u.RUBY,u.S,u.SMALL,u.SPAN,u.STRONG,u.STRIKE,u.SUB,u.SUP,u.TABLE,u.TT,u.U,u.UL,u.VAR]);function Ie(e){for(let t=0;t<e.attrs.length;t++)if(e.attrs[t].name===_e){e.attrs[t].name=Ae;break}}function Ne(e){for(let t=0;t<e.attrs.length;t++){const s=le.get(e.attrs[t].name);null!=s&&(e.attrs[t].name=s);}}function ue(e){for(let t=0;t<e.attrs.length;t++){const s=me.get(e.attrs[t].name);s&&(e.attrs[t].prefix=s.prefix,e.attrs[t].name=s.name,e.attrs[t].namespace=s.namespace);}}const Ce="hidden",De=8,Se=3;var Re;!function(e){e[e.INITIAL=0]="INITIAL",e[e.BEFORE_HTML=1]="BEFORE_HTML",e[e.BEFORE_HEAD=2]="BEFORE_HEAD",e[e.IN_HEAD=3]="IN_HEAD",e[e.IN_HEAD_NO_SCRIPT=4]="IN_HEAD_NO_SCRIPT",e[e.AFTER_HEAD=5]="AFTER_HEAD",e[e.IN_BODY=6]="IN_BODY",e[e.TEXT=7]="TEXT",e[e.IN_TABLE=8]="IN_TABLE",e[e.IN_TABLE_TEXT=9]="IN_TABLE_TEXT",e[e.IN_CAPTION=10]="IN_CAPTION",e[e.IN_COLUMN_GROUP=11]="IN_COLUMN_GROUP",e[e.IN_TABLE_BODY=12]="IN_TABLE_BODY",e[e.IN_ROW=13]="IN_ROW",e[e.IN_CELL=14]="IN_CELL",e[e.IN_SELECT=15]="IN_SELECT",e[e.IN_SELECT_IN_TABLE=16]="IN_SELECT_IN_TABLE",e[e.IN_TEMPLATE=17]="IN_TEMPLATE",e[e.AFTER_BODY=18]="AFTER_BODY",e[e.IN_FRAMESET=19]="IN_FRAMESET",e[e.AFTER_FRAMESET=20]="AFTER_FRAMESET",e[e.AFTER_AFTER_BODY=21]="AFTER_AFTER_BODY",e[e.AFTER_AFTER_FRAMESET=22]="AFTER_AFTER_FRAMESET";}(Re||(Re={}));const Oe={startLine:-1,startCol:-1,startOffset:-1,endLine:-1,endCol:-1,endOffset:-1},fe=new Set([u.TABLE,u.TBODY,u.TFOOT,u.THEAD,u.TR]),Le={scriptingEnabled:!0,sourceCodeLocationInfo:!1,treeAdapter:se,onParseError:null};class Me{constructor(e,t,s=null,a=null){this.fragmentContext=s,this.scriptHandler=a,this.currentToken=null,this.stopped=!1,this.insertionMode=Re.INITIAL,this.originalInsertionMode=Re.INITIAL,this.headElement=null,this.formElement=null,this.currentNotInHTML=!1,this.tmplInsertionModeStack=[],this.pendingCharacterTokens=[],this.hasNonWhitespacePendingCharacterToken=!1,this.framesetOk=!0,this.skipNextNewLine=!1,this.fosterParentingEnabled=!1,this.options={...Le,...e},this.treeAdapter=this.options.treeAdapter,this.onParseError=this.options.onParseError,this.onParseError&&(this.options.sourceCodeLocationInfo=!0),this.document=null!=t?t:this.treeAdapter.createDocument(),this.tokenizer=new v(this.options,this),this.activeFormattingElements=new ee(this.treeAdapter),this.fragmentContextID=s?f(this.treeAdapter.getTagName(s)):u.UNKNOWN,this._setContextModes(null!=s?s:this.document,this.fragmentContextID),this.openElements=new J(this.document,this.treeAdapter,this);}static parse(e,t){const s=new this(t);return s.tokenizer.write(e,!0),s.document}static getFragmentParser(e,t){const s={...Le,...t};null!=e||(e=s.treeAdapter.createElement(N.TEMPLATE,p.HTML,[]));const a=s.treeAdapter.createElement("documentmock",p.HTML,[]),r=new this(s,a,e);return r.fragmentContextID===u.TEMPLATE&&r.tmplInsertionModeStack.unshift(Re.IN_TEMPLATE),r._initTokenizerForFragmentParsing(),r._insertFakeRootElement(),r._resetInsertionMode(),r._findFormInFragmentContext(),r}getFragment(){const e=this.treeAdapter.getFirstChild(this.document),t=this.treeAdapter.createDocumentFragment();return this._adoptNodes(e,t),t}_err(e,t,s){var a;if(!this.onParseError)return;const r=null!==(a=e.location)&&void 0!==a?a:Oe,n={code:t,startLine:r.startLine,startCol:r.startCol,startOffset:r.startOffset,endLine:s?r.startLine:r.endLine,endCol:s?r.startCol:r.endCol,endOffset:s?r.startOffset:r.endOffset};this.onParseError(n);}onItemPush(e,t,s){var a,r;null===(r=(a=this.treeAdapter).onItemPush)||void 0===r||r.call(a,e),s&&this.openElements.stackTop>0&&this._setContextModes(e,t);}onItemPop(e,t){var s,a;if(this.options.sourceCodeLocationInfo&&this._setEndLocation(e,this.currentToken),null===(a=(s=this.treeAdapter).onItemPop)||void 0===a||a.call(s,e,this.openElements.current),t){let e,t;0===this.openElements.stackTop&&this.fragmentContext?(e=this.fragmentContext,t=this.fragmentContextID):({current:e,currentTagId:t}=this.openElements),this._setContextModes(e,t);}}_setContextModes(e,t){const s=e===this.document||this.treeAdapter.getNamespaceURI(e)===p.HTML;this.currentNotInHTML=!s,this.tokenizer.inForeignNode=!s&&!this._isIntegrationPoint(t,e);}_switchToTextParsing(e,t){this._insertElement(e,p.HTML),this.tokenizer.state=t,this.originalInsertionMode=this.insertionMode,this.insertionMode=Re.TEXT;}switchToPlaintextParsing(){this.insertionMode=Re.TEXT,this.originalInsertionMode=Re.IN_BODY,this.tokenizer.state=b.PLAINTEXT;}_getAdjustedCurrentElement(){return 0===this.openElements.stackTop&&this.fragmentContext?this.fragmentContext:this.openElements.current}_findFormInFragmentContext(){let e=this.fragmentContext;for(;e;){if(this.treeAdapter.getTagName(e)===N.FORM){this.formElement=e;break}e=this.treeAdapter.getParentNode(e);}}_initTokenizerForFragmentParsing(){if(this.fragmentContext&&this.treeAdapter.getNamespaceURI(this.fragmentContext)===p.HTML)switch(this.fragmentContextID){case u.TITLE:case u.TEXTAREA:this.tokenizer.state=b.RCDATA;break;case u.STYLE:case u.XMP:case u.IFRAME:case u.NOEMBED:case u.NOFRAMES:case u.NOSCRIPT:this.tokenizer.state=b.RAWTEXT;break;case u.SCRIPT:this.tokenizer.state=b.SCRIPT_DATA;break;case u.PLAINTEXT:this.tokenizer.state=b.PLAINTEXT;}}_setDocumentType(e){const t=e.name||"",s=e.publicId||"",a=e.systemId||"";if(this.treeAdapter.setDocumentType(this.document,t,s,a),e.location){const t=this.treeAdapter.getChildNodes(this.document).find((e=>this.treeAdapter.isDocumentTypeNode(e)));t&&this.treeAdapter.setNodeSourceCodeLocation(t,e.location);}}_attachElementToTree(e,t){if(this.options.sourceCodeLocationInfo){const s=t&&{...t,startTag:t};this.treeAdapter.setNodeSourceCodeLocation(e,s);}if(this._shouldFosterParentOnInsertion())this._fosterParentElement(e);else {const t=this.openElements.currentTmplContentOrNode;this.treeAdapter.appendChild(t,e);}}_appendElement(e,t){const s=this.treeAdapter.createElement(e.tagName,t,e.attrs);this._attachElementToTree(s,e.location);}_insertElement(e,t){const s=this.treeAdapter.createElement(e.tagName,t,e.attrs);this._attachElementToTree(s,e.location),this.openElements.push(s,e.tagID);}_insertFakeElement(e,t){const s=this.treeAdapter.createElement(e,p.HTML,[]);this._attachElementToTree(s,null),this.openElements.push(s,t);}_insertTemplate(e){const t=this.treeAdapter.createElement(e.tagName,p.HTML,e.attrs),s=this.treeAdapter.createDocumentFragment();this.treeAdapter.setTemplateContent(t,s),this._attachElementToTree(t,e.location),this.openElements.push(t,e.tagID),this.options.sourceCodeLocationInfo&&this.treeAdapter.setNodeSourceCodeLocation(s,null);}_insertFakeRootElement(){const e=this.treeAdapter.createElement(N.HTML,p.HTML,[]);this.options.sourceCodeLocationInfo&&this.treeAdapter.setNodeSourceCodeLocation(e,null),this.treeAdapter.appendChild(this.openElements.current,e),this.openElements.push(e,u.HTML);}_appendCommentNode(e,t){const s=this.treeAdapter.createCommentNode(e.data);this.treeAdapter.appendChild(t,s),this.options.sourceCodeLocationInfo&&this.treeAdapter.setNodeSourceCodeLocation(s,e.location);}_insertCharacters(e){let t,s;if(this._shouldFosterParentOnInsertion()?(({parent:t,beforeElement:s}=this._findFosterParentingLocation()),s?this.treeAdapter.insertTextBefore(t,e.chars,s):this.treeAdapter.insertText(t,e.chars)):(t=this.openElements.currentTmplContentOrNode,this.treeAdapter.insertText(t,e.chars)),!e.location)return;const a=this.treeAdapter.getChildNodes(t),r=s?a.lastIndexOf(s):a.length,n=a[r-1];if(this.treeAdapter.getNodeSourceCodeLocation(n)){const{endLine:t,endCol:s,endOffset:a}=e.location;this.treeAdapter.updateNodeSourceCodeLocation(n,{endLine:t,endCol:s,endOffset:a});}else this.options.sourceCodeLocationInfo&&this.treeAdapter.setNodeSourceCodeLocation(n,e.location);}_adoptNodes(e,t){for(let s=this.treeAdapter.getFirstChild(e);s;s=this.treeAdapter.getFirstChild(e))this.treeAdapter.detachNode(s),this.treeAdapter.appendChild(t,s);}_setEndLocation(e,t){if(this.treeAdapter.getNodeSourceCodeLocation(e)&&t.location){const s=t.location,a=this.treeAdapter.getTagName(e),r=t.type===h.END_TAG&&a===t.tagName?{endTag:{...s},endLine:s.endLine,endCol:s.endCol,endOffset:s.endOffset}:{endLine:s.startLine,endCol:s.startCol,endOffset:s.startOffset};this.treeAdapter.updateNodeSourceCodeLocation(e,r);}}shouldProcessStartTagTokenInForeignContent(e){if(!this.currentNotInHTML)return !1;let t,s;return 0===this.openElements.stackTop&&this.fragmentContext?(t=this.fragmentContext,s=this.fragmentContextID):({current:t,currentTagId:s}=this.openElements),(e.tagID!==u.SVG||this.treeAdapter.getTagName(t)!==N.ANNOTATION_XML||this.treeAdapter.getNamespaceURI(t)!==p.MATHML)&&(this.tokenizer.inForeignNode||(e.tagID===u.MGLYPH||e.tagID===u.MALIGNMARK)&&!this._isIntegrationPoint(s,t,p.HTML))}_processToken(e){switch(e.type){case h.CHARACTER:this.onCharacter(e);break;case h.NULL_CHARACTER:this.onNullCharacter(e);break;case h.COMMENT:this.onComment(e);break;case h.DOCTYPE:this.onDoctype(e);break;case h.START_TAG:this._processStartTag(e);break;case h.END_TAG:this.onEndTag(e);break;case h.EOF:this.onEof(e);break;case h.WHITESPACE_CHARACTER:this.onWhitespaceCharacter(e);}}_isIntegrationPoint(e,t,s){return function(e,t,s,a){return (!a||a===p.HTML)&&function(e,t,s){if(t===p.MATHML&&e===u.ANNOTATION_XML)for(let e=0;e<s.length;e++)if(s[e].name===d.ENCODING){const t=s[e].value.toLowerCase();return t===Te||t===he}return t===p.SVG&&(e===u.FOREIGN_OBJECT||e===u.DESC||e===u.TITLE)}(e,t,s)||(!a||a===p.MATHML)&&function(e,t){return t===p.MATHML&&(e===u.MI||e===u.MO||e===u.MN||e===u.MS||e===u.MTEXT)}(e,t)}(e,this.treeAdapter.getNamespaceURI(t),this.treeAdapter.getAttrList(t),s)}_reconstructActiveFormattingElements(){const e=this.activeFormattingElements.entries.length;if(e){const t=this.activeFormattingElements.entries.findIndex((e=>e.type===Z.Marker||this.openElements.contains(e.element)));for(let s=t<0?e-1:t-1;s>=0;s--){const e=this.activeFormattingElements.entries[s];this._insertElement(e.token,this.treeAdapter.getNamespaceURI(e.element)),e.element=this.openElements.current;}}}_closeTableCell(){this.openElements.generateImpliedEndTags(),this.openElements.popUntilTableCellPopped(),this.activeFormattingElements.clearToLastMarker(),this.insertionMode=Re.IN_ROW;}_closePElement(){this.openElements.generateImpliedEndTagsWithExclusion(u.P),this.openElements.popUntilTagNamePopped(u.P);}_resetInsertionMode(){for(let e=this.openElements.stackTop;e>=0;e--)switch(0===e&&this.fragmentContext?this.fragmentContextID:this.openElements.tagIDs[e]){case u.TR:return void(this.insertionMode=Re.IN_ROW);case u.TBODY:case u.THEAD:case u.TFOOT:return void(this.insertionMode=Re.IN_TABLE_BODY);case u.CAPTION:return void(this.insertionMode=Re.IN_CAPTION);case u.COLGROUP:return void(this.insertionMode=Re.IN_COLUMN_GROUP);case u.TABLE:return void(this.insertionMode=Re.IN_TABLE);case u.BODY:return void(this.insertionMode=Re.IN_BODY);case u.FRAMESET:return void(this.insertionMode=Re.IN_FRAMESET);case u.SELECT:return void this._resetInsertionModeForSelect(e);case u.TEMPLATE:return void(this.insertionMode=this.tmplInsertionModeStack[0]);case u.HTML:return void(this.insertionMode=this.headElement?Re.AFTER_HEAD:Re.BEFORE_HEAD);case u.TD:case u.TH:if(e>0)return void(this.insertionMode=Re.IN_CELL);break;case u.HEAD:if(e>0)return void(this.insertionMode=Re.IN_HEAD)}this.insertionMode=Re.IN_BODY;}_resetInsertionModeForSelect(e){if(e>0)for(let t=e-1;t>0;t--){const e=this.openElements.tagIDs[t];if(e===u.TEMPLATE)break;if(e===u.TABLE)return void(this.insertionMode=Re.IN_SELECT_IN_TABLE)}this.insertionMode=Re.IN_SELECT;}_isElementCausesFosterParenting(e){return fe.has(e)}_shouldFosterParentOnInsertion(){return this.fosterParentingEnabled&&this._isElementCausesFosterParenting(this.openElements.currentTagId)}_findFosterParentingLocation(){for(let e=this.openElements.stackTop;e>=0;e--){const t=this.openElements.items[e];switch(this.openElements.tagIDs[e]){case u.TEMPLATE:if(this.treeAdapter.getNamespaceURI(t)===p.HTML)return {parent:this.treeAdapter.getTemplateContent(t),beforeElement:null};break;case u.TABLE:{const s=this.treeAdapter.getParentNode(t);return s?{parent:s,beforeElement:t}:{parent:this.openElements.items[e-1],beforeElement:null}}}}return {parent:this.openElements.items[0],beforeElement:null}}_fosterParentElement(e){const t=this._findFosterParentingLocation();t.beforeElement?this.treeAdapter.insertBefore(t.parent,e,t.beforeElement):this.treeAdapter.appendChild(t.parent,e);}_isSpecialElement(e,t){const s=this.treeAdapter.getNamespaceURI(e);return M[s].has(t)}onCharacter(e){if(this.skipNextNewLine=!1,this.tokenizer.inForeignNode)!function(e,t){e._insertCharacters(t),e.framesetOk=!1;}(this,e);else switch(this.insertionMode){case Re.INITIAL:ye(this,e);break;case Re.BEFORE_HTML:we(this,e);break;case Re.BEFORE_HEAD:Ye(this,e);break;case Re.IN_HEAD:Qe(this,e);break;case Re.IN_HEAD_NO_SCRIPT:qe(this,e);break;case Re.AFTER_HEAD:We(this,e);break;case Re.IN_BODY:case Re.IN_CAPTION:case Re.IN_CELL:case Re.IN_TEMPLATE:Ve(this,e);break;case Re.TEXT:case Re.IN_SELECT:case Re.IN_SELECT_IN_TABLE:this._insertCharacters(e);break;case Re.IN_TABLE:case Re.IN_TABLE_BODY:case Re.IN_ROW:at(this,e);break;case Re.IN_TABLE_TEXT:ct(this,e);break;case Re.IN_COLUMN_GROUP:_t(this,e);break;case Re.AFTER_BODY:Ct(this,e);break;case Re.AFTER_AFTER_BODY:Dt(this,e);}}onNullCharacter(e){if(this.skipNextNewLine=!1,this.tokenizer.inForeignNode)!function(e,t){t.chars=s,e._insertCharacters(t);}(this,e);else switch(this.insertionMode){case Re.INITIAL:ye(this,e);break;case Re.BEFORE_HTML:we(this,e);break;case Re.BEFORE_HEAD:Ye(this,e);break;case Re.IN_HEAD:Qe(this,e);break;case Re.IN_HEAD_NO_SCRIPT:qe(this,e);break;case Re.AFTER_HEAD:We(this,e);break;case Re.TEXT:this._insertCharacters(e);break;case Re.IN_TABLE:case Re.IN_TABLE_BODY:case Re.IN_ROW:at(this,e);break;case Re.IN_COLUMN_GROUP:_t(this,e);break;case Re.AFTER_BODY:Ct(this,e);break;case Re.AFTER_AFTER_BODY:Dt(this,e);}}onComment(e){if(this.skipNextNewLine=!1,this.currentNotInHTML)Ue(this,e);else switch(this.insertionMode){case Re.INITIAL:case Re.BEFORE_HTML:case Re.BEFORE_HEAD:case Re.IN_HEAD:case Re.IN_HEAD_NO_SCRIPT:case Re.AFTER_HEAD:case Re.IN_BODY:case Re.IN_TABLE:case Re.IN_CAPTION:case Re.IN_COLUMN_GROUP:case Re.IN_TABLE_BODY:case Re.IN_ROW:case Re.IN_CELL:case Re.IN_SELECT:case Re.IN_SELECT_IN_TABLE:case Re.IN_TEMPLATE:case Re.IN_FRAMESET:case Re.AFTER_FRAMESET:Ue(this,e);break;case Re.IN_TABLE_TEXT:Et(this,e);break;case Re.AFTER_BODY:!function(e,t){e._appendCommentNode(t,e.openElements.items[0]);}(this,e);break;case Re.AFTER_AFTER_BODY:case Re.AFTER_AFTER_FRAMESET:!function(e,t){e._appendCommentNode(t,e.document);}(this,e);}}onDoctype(e){switch(this.skipNextNewLine=!1,this.insertionMode){case Re.INITIAL:!function(e,t){e._setDocumentType(t);const s=t.forceQuirks?I.QUIRKS:function(e){if(e.name!==ae)return I.QUIRKS;const{systemId:t}=e;if(t&&"http://www.ibm.com/data/dtd/v11/ibmxhtml1-transitional.dtd"===t.toLowerCase())return I.QUIRKS;let{publicId:s}=e;if(null!==s){if(s=s.toLowerCase(),ie.has(s))return I.QUIRKS;let e=null===t?ne:re;if(Ee(s,e))return I.QUIRKS;if(e=null===t?oe:ce,Ee(s,e))return I.LIMITED_QUIRKS}return I.NO_QUIRKS}(t);(function(e){return e.name===ae&&null===e.publicId&&(null===e.systemId||"about:legacy-compat"===e.systemId)})(t)||e._err(t,T.nonConformingDoctype),e.treeAdapter.setDocumentMode(e.document,s),e.insertionMode=Re.BEFORE_HTML;}(this,e);break;case Re.BEFORE_HEAD:case Re.IN_HEAD:case Re.IN_HEAD_NO_SCRIPT:case Re.AFTER_HEAD:this._err(e,T.misplacedDoctype);break;case Re.IN_TABLE_TEXT:Et(this,e);}}onStartTag(e){this.skipNextNewLine=!1,this.currentToken=e,this._processStartTag(e),e.selfClosing&&!e.ackSelfClosing&&this._err(e,T.nonVoidHtmlElementStartTagWithTrailingSolidus);}_processStartTag(e){this.shouldProcessStartTagTokenInForeignContent(e)?function(e,t){if(function(e){const t=e.tagID;return t===u.FONT&&e.attrs.some((({name:e})=>e===d.COLOR||e===d.SIZE||e===d.FACE))||de.has(t)}(t))St(e),e._startTagOutsideForeignContent(t);else {const s=e._getAdjustedCurrentElement(),a=e.treeAdapter.getNamespaceURI(s);a===p.MATHML?Ie(t):a===p.SVG&&(function(e){const t=pe.get(e.tagName);null!=t&&(e.tagName=t,e.tagID=f(e.tagName));}(t),Ne(t)),ue(t),t.selfClosing?e._appendElement(t,a):e._insertElement(t,a),t.ackSelfClosing=!0;}}(this,e):this._startTagOutsideForeignContent(e);}_startTagOutsideForeignContent(e){switch(this.insertionMode){case Re.INITIAL:ye(this,e);break;case Re.BEFORE_HTML:!function(e,t){t.tagID===u.HTML?(e._insertElement(t,p.HTML),e.insertionMode=Re.BEFORE_HEAD):we(e,t);}(this,e);break;case Re.BEFORE_HEAD:!function(e,t){switch(t.tagID){case u.HTML:$e(e,t);break;case u.HEAD:e._insertElement(t,p.HTML),e.headElement=e.openElements.current,e.insertionMode=Re.IN_HEAD;break;default:Ye(e,t);}}(this,e);break;case Re.IN_HEAD:xe(this,e);break;case Re.IN_HEAD_NO_SCRIPT:!function(e,t){switch(t.tagID){case u.HTML:$e(e,t);break;case u.BASEFONT:case u.BGSOUND:case u.HEAD:case u.LINK:case u.META:case u.NOFRAMES:case u.STYLE:xe(e,t);break;case u.NOSCRIPT:e._err(t,T.nestedNoscriptInHead);break;default:qe(e,t);}}(this,e);break;case Re.AFTER_HEAD:!function(e,t){switch(t.tagID){case u.HTML:$e(e,t);break;case u.BODY:e._insertElement(t,p.HTML),e.framesetOk=!1,e.insertionMode=Re.IN_BODY;break;case u.FRAMESET:e._insertElement(t,p.HTML),e.insertionMode=Re.IN_FRAMESET;break;case u.BASE:case u.BASEFONT:case u.BGSOUND:case u.LINK:case u.META:case u.NOFRAMES:case u.SCRIPT:case u.STYLE:case u.TEMPLATE:case u.TITLE:e._err(t,T.abandonedHeadElementChild),e.openElements.push(e.headElement,u.HEAD),xe(e,t),e.openElements.remove(e.headElement);break;case u.HEAD:e._err(t,T.misplacedStartTagForHeadElement);break;default:We(e,t);}}(this,e);break;case Re.IN_BODY:$e(this,e);break;case Re.IN_TABLE:rt(this,e);break;case Re.IN_TABLE_TEXT:Et(this,e);break;case Re.IN_CAPTION:!function(e,t){const s=t.tagID;Tt.has(s)?e.openElements.hasInTableScope(u.CAPTION)&&(e.openElements.generateImpliedEndTags(),e.openElements.popUntilTagNamePopped(u.CAPTION),e.activeFormattingElements.clearToLastMarker(),e.insertionMode=Re.IN_TABLE,rt(e,t)):$e(e,t);}(this,e);break;case Re.IN_COLUMN_GROUP:ht(this,e);break;case Re.IN_TABLE_BODY:At(this,e);break;case Re.IN_ROW:mt(this,e);break;case Re.IN_CELL:!function(e,t){const s=t.tagID;Tt.has(s)?(e.openElements.hasInTableScope(u.TD)||e.openElements.hasInTableScope(u.TH))&&(e._closeTableCell(),mt(e,t)):$e(e,t);}(this,e);break;case Re.IN_SELECT:dt(this,e);break;case Re.IN_SELECT_IN_TABLE:!function(e,t){const s=t.tagID;s===u.CAPTION||s===u.TABLE||s===u.TBODY||s===u.TFOOT||s===u.THEAD||s===u.TR||s===u.TD||s===u.TH?(e.openElements.popUntilTagNamePopped(u.SELECT),e._resetInsertionMode(),e._processStartTag(t)):dt(e,t);}(this,e);break;case Re.IN_TEMPLATE:!function(e,t){switch(t.tagID){case u.BASE:case u.BASEFONT:case u.BGSOUND:case u.LINK:case u.META:case u.NOFRAMES:case u.SCRIPT:case u.STYLE:case u.TEMPLATE:case u.TITLE:xe(e,t);break;case u.CAPTION:case u.COLGROUP:case u.TBODY:case u.TFOOT:case u.THEAD:e.tmplInsertionModeStack[0]=Re.IN_TABLE,e.insertionMode=Re.IN_TABLE,rt(e,t);break;case u.COL:e.tmplInsertionModeStack[0]=Re.IN_COLUMN_GROUP,e.insertionMode=Re.IN_COLUMN_GROUP,ht(e,t);break;case u.TR:e.tmplInsertionModeStack[0]=Re.IN_TABLE_BODY,e.insertionMode=Re.IN_TABLE_BODY,At(e,t);break;case u.TD:case u.TH:e.tmplInsertionModeStack[0]=Re.IN_ROW,e.insertionMode=Re.IN_ROW,mt(e,t);break;default:e.tmplInsertionModeStack[0]=Re.IN_BODY,e.insertionMode=Re.IN_BODY,$e(e,t);}}(this,e);break;case Re.AFTER_BODY:!function(e,t){t.tagID===u.HTML?$e(e,t):Ct(e,t);}(this,e);break;case Re.IN_FRAMESET:!function(e,t){switch(t.tagID){case u.HTML:$e(e,t);break;case u.FRAMESET:e._insertElement(t,p.HTML);break;case u.FRAME:e._appendElement(t,p.HTML),t.ackSelfClosing=!0;break;case u.NOFRAMES:xe(e,t);}}(this,e);break;case Re.AFTER_FRAMESET:!function(e,t){switch(t.tagID){case u.HTML:$e(e,t);break;case u.NOFRAMES:xe(e,t);}}(this,e);break;case Re.AFTER_AFTER_BODY:!function(e,t){t.tagID===u.HTML?$e(e,t):Dt(e,t);}(this,e);break;case Re.AFTER_AFTER_FRAMESET:!function(e,t){switch(t.tagID){case u.HTML:$e(e,t);break;case u.NOFRAMES:xe(e,t);}}(this,e);}}onEndTag(e){this.skipNextNewLine=!1,this.currentToken=e,this.currentNotInHTML?function(e,t){if(t.tagID===u.P||t.tagID===u.BR)return St(e),void e._endTagOutsideForeignContent(t);for(let s=e.openElements.stackTop;s>0;s--){const a=e.openElements.items[s];if(e.treeAdapter.getNamespaceURI(a)===p.HTML){e._endTagOutsideForeignContent(t);break}const r=e.treeAdapter.getTagName(a);if(r.toLowerCase()===t.tagName){t.tagName=r,e.openElements.shortenToLength(s);break}}}(this,e):this._endTagOutsideForeignContent(e);}_endTagOutsideForeignContent(e){switch(this.insertionMode){case Re.INITIAL:ye(this,e);break;case Re.BEFORE_HTML:!function(e,t){const s=t.tagID;s!==u.HTML&&s!==u.HEAD&&s!==u.BODY&&s!==u.BR||we(e,t);}(this,e);break;case Re.BEFORE_HEAD:!function(e,t){const s=t.tagID;s===u.HEAD||s===u.BODY||s===u.HTML||s===u.BR?Ye(e,t):e._err(t,T.endTagWithoutMatchingOpenElement);}(this,e);break;case Re.IN_HEAD:!function(e,t){switch(t.tagID){case u.HEAD:e.openElements.pop(),e.insertionMode=Re.AFTER_HEAD;break;case u.BODY:case u.BR:case u.HTML:Qe(e,t);break;case u.TEMPLATE:ve(e,t);break;default:e._err(t,T.endTagWithoutMatchingOpenElement);}}(this,e);break;case Re.IN_HEAD_NO_SCRIPT:!function(e,t){switch(t.tagID){case u.NOSCRIPT:e.openElements.pop(),e.insertionMode=Re.IN_HEAD;break;case u.BR:qe(e,t);break;default:e._err(t,T.endTagWithoutMatchingOpenElement);}}(this,e);break;case Re.AFTER_HEAD:!function(e,t){switch(t.tagID){case u.BODY:case u.HTML:case u.BR:We(e,t);break;case u.TEMPLATE:ve(e,t);break;default:e._err(t,T.endTagWithoutMatchingOpenElement);}}(this,e);break;case Re.IN_BODY:tt(this,e);break;case Re.TEXT:!function(e,t){var s;t.tagID===u.SCRIPT&&(null===(s=e.scriptHandler)||void 0===s||s.call(e,e.openElements.current)),e.openElements.pop(),e.insertionMode=e.originalInsertionMode;}(this,e);break;case Re.IN_TABLE:nt(this,e);break;case Re.IN_TABLE_TEXT:Et(this,e);break;case Re.IN_CAPTION:!function(e,t){const s=t.tagID;switch(s){case u.CAPTION:case u.TABLE:e.openElements.hasInTableScope(u.CAPTION)&&(e.openElements.generateImpliedEndTags(),e.openElements.popUntilTagNamePopped(u.CAPTION),e.activeFormattingElements.clearToLastMarker(),e.insertionMode=Re.IN_TABLE,s===u.TABLE&&nt(e,t));break;case u.BODY:case u.COL:case u.COLGROUP:case u.HTML:case u.TBODY:case u.TD:case u.TFOOT:case u.TH:case u.THEAD:case u.TR:break;default:tt(e,t);}}(this,e);break;case Re.IN_COLUMN_GROUP:!function(e,t){switch(t.tagID){case u.COLGROUP:e.openElements.currentTagId===u.COLGROUP&&(e.openElements.pop(),e.insertionMode=Re.IN_TABLE);break;case u.TEMPLATE:ve(e,t);break;case u.COL:break;default:_t(e,t);}}(this,e);break;case Re.IN_TABLE_BODY:lt(this,e);break;case Re.IN_ROW:pt(this,e);break;case Re.IN_CELL:!function(e,t){const s=t.tagID;switch(s){case u.TD:case u.TH:e.openElements.hasInTableScope(s)&&(e.openElements.generateImpliedEndTags(),e.openElements.popUntilTagNamePopped(s),e.activeFormattingElements.clearToLastMarker(),e.insertionMode=Re.IN_ROW);break;case u.TABLE:case u.TBODY:case u.TFOOT:case u.THEAD:case u.TR:e.openElements.hasInTableScope(s)&&(e._closeTableCell(),pt(e,t));break;case u.BODY:case u.CAPTION:case u.COL:case u.COLGROUP:case u.HTML:break;default:tt(e,t);}}(this,e);break;case Re.IN_SELECT:It(this,e);break;case Re.IN_SELECT_IN_TABLE:!function(e,t){const s=t.tagID;s===u.CAPTION||s===u.TABLE||s===u.TBODY||s===u.TFOOT||s===u.THEAD||s===u.TR||s===u.TD||s===u.TH?e.openElements.hasInTableScope(s)&&(e.openElements.popUntilTagNamePopped(u.SELECT),e._resetInsertionMode(),e.onEndTag(t)):It(e,t);}(this,e);break;case Re.IN_TEMPLATE:!function(e,t){t.tagID===u.TEMPLATE&&ve(e,t);}(this,e);break;case Re.AFTER_BODY:ut(this,e);break;case Re.IN_FRAMESET:!function(e,t){t.tagID!==u.FRAMESET||e.openElements.isRootHtmlElementCurrent()||(e.openElements.pop(),e.fragmentContext||e.openElements.currentTagId===u.FRAMESET||(e.insertionMode=Re.AFTER_FRAMESET));}(this,e);break;case Re.AFTER_FRAMESET:!function(e,t){t.tagID===u.HTML&&(e.insertionMode=Re.AFTER_AFTER_FRAMESET);}(this,e);break;case Re.AFTER_AFTER_BODY:Dt(this,e);}}onEof(e){switch(this.insertionMode){case Re.INITIAL:ye(this,e);break;case Re.BEFORE_HTML:we(this,e);break;case Re.BEFORE_HEAD:Ye(this,e);break;case Re.IN_HEAD:Qe(this,e);break;case Re.IN_HEAD_NO_SCRIPT:qe(this,e);break;case Re.AFTER_HEAD:We(this,e);break;case Re.IN_BODY:case Re.IN_TABLE:case Re.IN_CAPTION:case Re.IN_COLUMN_GROUP:case Re.IN_TABLE_BODY:case Re.IN_ROW:case Re.IN_CELL:case Re.IN_SELECT:case Re.IN_SELECT_IN_TABLE:st(this,e);break;case Re.TEXT:!function(e,t){e._err(t,T.eofInElementThatCanContainOnlyText),e.openElements.pop(),e.insertionMode=e.originalInsertionMode,e.onEof(t);}(this,e);break;case Re.IN_TABLE_TEXT:Et(this,e);break;case Re.IN_TEMPLATE:Nt(this,e);break;case Re.AFTER_BODY:case Re.IN_FRAMESET:case Re.AFTER_FRAMESET:case Re.AFTER_AFTER_BODY:case Re.AFTER_AFTER_FRAMESET:Ge(this,e);}}onWhitespaceCharacter(e){if(this.skipNextNewLine&&(this.skipNextNewLine=!1,e.chars.charCodeAt(0)===a.LINE_FEED)){if(1===e.chars.length)return;e.chars=e.chars.substr(1);}if(this.tokenizer.inForeignNode)this._insertCharacters(e);else switch(this.insertionMode){case Re.IN_HEAD:case Re.IN_HEAD_NO_SCRIPT:case Re.AFTER_HEAD:case Re.TEXT:case Re.IN_COLUMN_GROUP:case Re.IN_SELECT:case Re.IN_SELECT_IN_TABLE:case Re.IN_FRAMESET:case Re.AFTER_FRAMESET:this._insertCharacters(e);break;case Re.IN_BODY:case Re.IN_CAPTION:case Re.IN_CELL:case Re.IN_TEMPLATE:case Re.AFTER_BODY:case Re.AFTER_AFTER_BODY:case Re.AFTER_AFTER_FRAMESET:Ke(this,e);break;case Re.IN_TABLE:case Re.IN_TABLE_BODY:case Re.IN_ROW:at(this,e);break;case Re.IN_TABLE_TEXT:ot(this,e);}}}function ge(e,t){let s=e.activeFormattingElements.getElementEntryInScopeWithTagName(t.tagName);return s?e.openElements.contains(s.element)?e.openElements.hasInScope(t.tagID)||(s=null):(e.activeFormattingElements.removeEntry(s),s=null):et(e,t),s}function ke(e,t){let s=null,a=e.openElements.stackTop;for(;a>=0;a--){const r=e.openElements.items[a];if(r===t.element)break;e._isSpecialElement(r,e.openElements.tagIDs[a])&&(s=r);}return s||(e.openElements.shortenToLength(a<0?0:a),e.activeFormattingElements.removeEntry(t)),s}function Pe(e,t,s){let a=t,r=e.openElements.getCommonAncestor(t);for(let n=0,i=r;i!==s;n++,i=r){r=e.openElements.getCommonAncestor(i);const s=e.activeFormattingElements.getElementEntry(i),o=s&&n>=Se;!s||o?(o&&e.activeFormattingElements.removeEntry(s),e.openElements.remove(i)):(i=be(e,s),a===t&&(e.activeFormattingElements.bookmark=s),e.treeAdapter.detachNode(a),e.treeAdapter.appendChild(i,a),a=i);}return a}function be(e,t){const s=e.treeAdapter.getNamespaceURI(t.element),a=e.treeAdapter.createElement(t.token.tagName,s,t.token.attrs);return e.openElements.replace(t.element,a),t.element=a,a}function Be(e,t,s){const a=f(e.treeAdapter.getTagName(t));if(e._isElementCausesFosterParenting(a))e._fosterParentElement(s);else {const r=e.treeAdapter.getNamespaceURI(t);a===u.TEMPLATE&&r===p.HTML&&(t=e.treeAdapter.getTemplateContent(t)),e.treeAdapter.appendChild(t,s);}}function He(e,t,s){const a=e.treeAdapter.getNamespaceURI(s.element),{token:r}=s,n=e.treeAdapter.createElement(r.tagName,a,r.attrs);e._adoptNodes(t,n),e.treeAdapter.appendChild(t,n),e.activeFormattingElements.insertElementAfterBookmark(n,r),e.activeFormattingElements.removeEntry(s),e.openElements.remove(s.element),e.openElements.insertAfter(t,n,r.tagID);}function Fe(e,t){for(let s=0;s<De;s++){const s=ge(e,t);if(!s)break;const a=ke(e,s);if(!a)break;e.activeFormattingElements.bookmark=s;const r=Pe(e,a,s.element),n=e.openElements.getCommonAncestor(s.element);e.treeAdapter.detachNode(r),n&&Be(e,n,r),He(e,a,s);}}function Ue(e,t){e._appendCommentNode(t,e.openElements.currentTmplContentOrNode);}function Ge(e,t){if(e.stopped=!0,t.location){const s=e.fragmentContext?0:2;for(let a=e.openElements.stackTop;a>=s;a--)e._setEndLocation(e.openElements.items[a],t);if(!e.fragmentContext&&e.openElements.stackTop>=0){const s=e.openElements.items[0],a=e.treeAdapter.getNodeSourceCodeLocation(s);if(a&&!a.endTag&&(e._setEndLocation(s,t),e.openElements.stackTop>=1)){const s=e.openElements.items[1],a=e.treeAdapter.getNodeSourceCodeLocation(s);a&&!a.endTag&&e._setEndLocation(s,t);}}}}function ye(e,t){e._err(t,T.missingDoctype,!0),e.treeAdapter.setDocumentMode(e.document,I.QUIRKS),e.insertionMode=Re.BEFORE_HTML,e._processToken(t);}function we(e,t){e._insertFakeRootElement(),e.insertionMode=Re.BEFORE_HEAD,e._processToken(t);}function Ye(e,t){e._insertFakeElement(N.HEAD,u.HEAD),e.headElement=e.openElements.current,e.insertionMode=Re.IN_HEAD,e._processToken(t);}function xe(e,t){switch(t.tagID){case u.HTML:$e(e,t);break;case u.BASE:case u.BASEFONT:case u.BGSOUND:case u.LINK:case u.META:e._appendElement(t,p.HTML),t.ackSelfClosing=!0;break;case u.TITLE:e._switchToTextParsing(t,b.RCDATA);break;case u.NOSCRIPT:e.options.scriptingEnabled?e._switchToTextParsing(t,b.RAWTEXT):(e._insertElement(t,p.HTML),e.insertionMode=Re.IN_HEAD_NO_SCRIPT);break;case u.NOFRAMES:case u.STYLE:e._switchToTextParsing(t,b.RAWTEXT);break;case u.SCRIPT:e._switchToTextParsing(t,b.SCRIPT_DATA);break;case u.TEMPLATE:e._insertTemplate(t),e.activeFormattingElements.insertMarker(),e.framesetOk=!1,e.insertionMode=Re.IN_TEMPLATE,e.tmplInsertionModeStack.unshift(Re.IN_TEMPLATE);break;case u.HEAD:e._err(t,T.misplacedStartTagForHeadElement);break;default:Qe(e,t);}}function ve(e,t){e.openElements.tmplCount>0?(e.openElements.generateImpliedEndTagsThoroughly(),e.openElements.currentTagId!==u.TEMPLATE&&e._err(t,T.closingOfElementWithOpenChildElements),e.openElements.popUntilTagNamePopped(u.TEMPLATE),e.activeFormattingElements.clearToLastMarker(),e.tmplInsertionModeStack.shift(),e._resetInsertionMode()):e._err(t,T.endTagWithoutMatchingOpenElement);}function Qe(e,t){e.openElements.pop(),e.insertionMode=Re.AFTER_HEAD,e._processToken(t);}function qe(e,t){const s=t.type===h.EOF?T.openElementsLeftAfterEof:T.disallowedContentInNoscriptInHead;e._err(t,s),e.openElements.pop(),e.insertionMode=Re.IN_HEAD,e._processToken(t);}function We(e,t){e._insertFakeElement(N.BODY,u.BODY),e.insertionMode=Re.IN_BODY,Xe(e,t);}function Xe(e,t){switch(t.type){case h.CHARACTER:Ve(e,t);break;case h.WHITESPACE_CHARACTER:Ke(e,t);break;case h.COMMENT:Ue(e,t);break;case h.START_TAG:$e(e,t);break;case h.END_TAG:tt(e,t);break;case h.EOF:st(e,t);}}function Ke(e,t){e._reconstructActiveFormattingElements(),e._insertCharacters(t);}function Ve(e,t){e._reconstructActiveFormattingElements(),e._insertCharacters(t),e.framesetOk=!1;}function ze(e,t){e._reconstructActiveFormattingElements(),e._appendElement(t,p.HTML),e.framesetOk=!1,t.ackSelfClosing=!0;}function je(e){const t=A(e,d.TYPE);return null!=t&&t.toLowerCase()===Ce}function Je(e,t){e._switchToTextParsing(t,b.RAWTEXT);}function Ze(e,t){e._reconstructActiveFormattingElements(),e._insertElement(t,p.HTML);}function $e(e,t){switch(t.tagID){case u.I:case u.S:case u.B:case u.U:case u.EM:case u.TT:case u.BIG:case u.CODE:case u.FONT:case u.SMALL:case u.STRIKE:case u.STRONG:!function(e,t){e._reconstructActiveFormattingElements(),e._insertElement(t,p.HTML),e.activeFormattingElements.pushElement(e.openElements.current,t);}(e,t);break;case u.A:!function(e,t){const s=e.activeFormattingElements.getElementEntryInScopeWithTagName(N.A);s&&(Fe(e,t),e.openElements.remove(s.element),e.activeFormattingElements.removeEntry(s)),e._reconstructActiveFormattingElements(),e._insertElement(t,p.HTML),e.activeFormattingElements.pushElement(e.openElements.current,t);}(e,t);break;case u.H1:case u.H2:case u.H3:case u.H4:case u.H5:case u.H6:!function(e,t){e.openElements.hasInButtonScope(u.P)&&e._closePElement(),g(e.openElements.currentTagId)&&e.openElements.pop(),e._insertElement(t,p.HTML);}(e,t);break;case u.P:case u.DL:case u.OL:case u.UL:case u.DIV:case u.DIR:case u.NAV:case u.MAIN:case u.MENU:case u.ASIDE:case u.CENTER:case u.FIGURE:case u.FOOTER:case u.HEADER:case u.HGROUP:case u.DIALOG:case u.DETAILS:case u.ADDRESS:case u.ARTICLE:case u.SECTION:case u.SUMMARY:case u.FIELDSET:case u.BLOCKQUOTE:case u.FIGCAPTION:!function(e,t){e.openElements.hasInButtonScope(u.P)&&e._closePElement(),e._insertElement(t,p.HTML);}(e,t);break;case u.LI:case u.DD:case u.DT:!function(e,t){e.framesetOk=!1;const s=t.tagID;for(let t=e.openElements.stackTop;t>=0;t--){const a=e.openElements.tagIDs[t];if(s===u.LI&&a===u.LI||(s===u.DD||s===u.DT)&&(a===u.DD||a===u.DT)){e.openElements.generateImpliedEndTagsWithExclusion(a),e.openElements.popUntilTagNamePopped(a);break}if(a!==u.ADDRESS&&a!==u.DIV&&a!==u.P&&e._isSpecialElement(e.openElements.items[t],a))break}e.openElements.hasInButtonScope(u.P)&&e._closePElement(),e._insertElement(t,p.HTML);}(e,t);break;case u.BR:case u.IMG:case u.WBR:case u.AREA:case u.EMBED:case u.KEYGEN:ze(e,t);break;case u.HR:!function(e,t){e.openElements.hasInButtonScope(u.P)&&e._closePElement(),e._appendElement(t,p.HTML),e.framesetOk=!1,t.ackSelfClosing=!0;}(e,t);break;case u.RB:case u.RTC:!function(e,t){e.openElements.hasInScope(u.RUBY)&&e.openElements.generateImpliedEndTags(),e._insertElement(t,p.HTML);}(e,t);break;case u.RT:case u.RP:!function(e,t){e.openElements.hasInScope(u.RUBY)&&e.openElements.generateImpliedEndTagsWithExclusion(u.RTC),e._insertElement(t,p.HTML);}(e,t);break;case u.PRE:case u.LISTING:!function(e,t){e.openElements.hasInButtonScope(u.P)&&e._closePElement(),e._insertElement(t,p.HTML),e.skipNextNewLine=!0,e.framesetOk=!1;}(e,t);break;case u.XMP:!function(e,t){e.openElements.hasInButtonScope(u.P)&&e._closePElement(),e._reconstructActiveFormattingElements(),e.framesetOk=!1,e._switchToTextParsing(t,b.RAWTEXT);}(e,t);break;case u.SVG:!function(e,t){e._reconstructActiveFormattingElements(),Ne(t),ue(t),t.selfClosing?e._appendElement(t,p.SVG):e._insertElement(t,p.SVG),t.ackSelfClosing=!0;}(e,t);break;case u.HTML:!function(e,t){0===e.openElements.tmplCount&&e.treeAdapter.adoptAttributes(e.openElements.items[0],t.attrs);}(e,t);break;case u.BASE:case u.LINK:case u.META:case u.STYLE:case u.TITLE:case u.SCRIPT:case u.BGSOUND:case u.BASEFONT:case u.TEMPLATE:xe(e,t);break;case u.BODY:!function(e,t){const s=e.openElements.tryPeekProperlyNestedBodyElement();s&&0===e.openElements.tmplCount&&(e.framesetOk=!1,e.treeAdapter.adoptAttributes(s,t.attrs));}(e,t);break;case u.FORM:!function(e,t){const s=e.openElements.tmplCount>0;e.formElement&&!s||(e.openElements.hasInButtonScope(u.P)&&e._closePElement(),e._insertElement(t,p.HTML),s||(e.formElement=e.openElements.current));}(e,t);break;case u.NOBR:!function(e,t){e._reconstructActiveFormattingElements(),e.openElements.hasInScope(u.NOBR)&&(Fe(e,t),e._reconstructActiveFormattingElements()),e._insertElement(t,p.HTML),e.activeFormattingElements.pushElement(e.openElements.current,t);}(e,t);break;case u.MATH:!function(e,t){e._reconstructActiveFormattingElements(),Ie(t),ue(t),t.selfClosing?e._appendElement(t,p.MATHML):e._insertElement(t,p.MATHML),t.ackSelfClosing=!0;}(e,t);break;case u.TABLE:!function(e,t){e.treeAdapter.getDocumentMode(e.document)!==I.QUIRKS&&e.openElements.hasInButtonScope(u.P)&&e._closePElement(),e._insertElement(t,p.HTML),e.framesetOk=!1,e.insertionMode=Re.IN_TABLE;}(e,t);break;case u.INPUT:!function(e,t){e._reconstructActiveFormattingElements(),e._appendElement(t,p.HTML),je(t)||(e.framesetOk=!1),t.ackSelfClosing=!0;}(e,t);break;case u.PARAM:case u.TRACK:case u.SOURCE:!function(e,t){e._appendElement(t,p.HTML),t.ackSelfClosing=!0;}(e,t);break;case u.IMAGE:!function(e,t){t.tagName=N.IMG,t.tagID=u.IMG,ze(e,t);}(e,t);break;case u.BUTTON:!function(e,t){e.openElements.hasInScope(u.BUTTON)&&(e.openElements.generateImpliedEndTags(),e.openElements.popUntilTagNamePopped(u.BUTTON)),e._reconstructActiveFormattingElements(),e._insertElement(t,p.HTML),e.framesetOk=!1;}(e,t);break;case u.APPLET:case u.OBJECT:case u.MARQUEE:!function(e,t){e._reconstructActiveFormattingElements(),e._insertElement(t,p.HTML),e.activeFormattingElements.insertMarker(),e.framesetOk=!1;}(e,t);break;case u.IFRAME:!function(e,t){e.framesetOk=!1,e._switchToTextParsing(t,b.RAWTEXT);}(e,t);break;case u.SELECT:!function(e,t){e._reconstructActiveFormattingElements(),e._insertElement(t,p.HTML),e.framesetOk=!1,e.insertionMode=e.insertionMode===Re.IN_TABLE||e.insertionMode===Re.IN_CAPTION||e.insertionMode===Re.IN_TABLE_BODY||e.insertionMode===Re.IN_ROW||e.insertionMode===Re.IN_CELL?Re.IN_SELECT_IN_TABLE:Re.IN_SELECT;}(e,t);break;case u.OPTION:case u.OPTGROUP:!function(e,t){e.openElements.currentTagId===u.OPTION&&e.openElements.pop(),e._reconstructActiveFormattingElements(),e._insertElement(t,p.HTML);}(e,t);break;case u.NOEMBED:Je(e,t);break;case u.FRAMESET:!function(e,t){const s=e.openElements.tryPeekProperlyNestedBodyElement();e.framesetOk&&s&&(e.treeAdapter.detachNode(s),e.openElements.popAllUpToHtmlElement(),e._insertElement(t,p.HTML),e.insertionMode=Re.IN_FRAMESET);}(e,t);break;case u.TEXTAREA:!function(e,t){e._insertElement(t,p.HTML),e.skipNextNewLine=!0,e.tokenizer.state=b.RCDATA,e.originalInsertionMode=e.insertionMode,e.framesetOk=!1,e.insertionMode=Re.TEXT;}(e,t);break;case u.NOSCRIPT:e.options.scriptingEnabled?Je(e,t):Ze(e,t);break;case u.PLAINTEXT:!function(e,t){e.openElements.hasInButtonScope(u.P)&&e._closePElement(),e._insertElement(t,p.HTML),e.tokenizer.state=b.PLAINTEXT;}(e,t);break;case u.COL:case u.TH:case u.TD:case u.TR:case u.HEAD:case u.FRAME:case u.TBODY:case u.TFOOT:case u.THEAD:case u.CAPTION:case u.COLGROUP:break;default:Ze(e,t);}}function et(e,t){const s=t.tagName,a=t.tagID;for(let t=e.openElements.stackTop;t>0;t--){const r=e.openElements.items[t],n=e.openElements.tagIDs[t];if(a===n&&(a!==u.UNKNOWN||e.treeAdapter.getTagName(r)===s)){e.openElements.generateImpliedEndTagsWithExclusion(a),e.openElements.stackTop>=t&&e.openElements.shortenToLength(t);break}if(e._isSpecialElement(r,n))break}}function tt(e,t){switch(t.tagID){case u.A:case u.B:case u.I:case u.S:case u.U:case u.EM:case u.TT:case u.BIG:case u.CODE:case u.FONT:case u.NOBR:case u.SMALL:case u.STRIKE:case u.STRONG:Fe(e,t);break;case u.P:!function(e){e.openElements.hasInButtonScope(u.P)||e._insertFakeElement(N.P,u.P),e._closePElement();}(e);break;case u.DL:case u.UL:case u.OL:case u.DIR:case u.DIV:case u.NAV:case u.PRE:case u.MAIN:case u.MENU:case u.ASIDE:case u.BUTTON:case u.CENTER:case u.FIGURE:case u.FOOTER:case u.HEADER:case u.HGROUP:case u.DIALOG:case u.ADDRESS:case u.ARTICLE:case u.DETAILS:case u.SECTION:case u.SUMMARY:case u.LISTING:case u.FIELDSET:case u.BLOCKQUOTE:case u.FIGCAPTION:!function(e,t){const s=t.tagID;e.openElements.hasInScope(s)&&(e.openElements.generateImpliedEndTags(),e.openElements.popUntilTagNamePopped(s));}(e,t);break;case u.LI:!function(e){e.openElements.hasInListItemScope(u.LI)&&(e.openElements.generateImpliedEndTagsWithExclusion(u.LI),e.openElements.popUntilTagNamePopped(u.LI));}(e);break;case u.DD:case u.DT:!function(e,t){const s=t.tagID;e.openElements.hasInScope(s)&&(e.openElements.generateImpliedEndTagsWithExclusion(s),e.openElements.popUntilTagNamePopped(s));}(e,t);break;case u.H1:case u.H2:case u.H3:case u.H4:case u.H5:case u.H6:!function(e){e.openElements.hasNumberedHeaderInScope()&&(e.openElements.generateImpliedEndTags(),e.openElements.popUntilNumberedHeaderPopped());}(e);break;case u.BR:!function(e){e._reconstructActiveFormattingElements(),e._insertFakeElement(N.BR,u.BR),e.openElements.pop(),e.framesetOk=!1;}(e);break;case u.BODY:!function(e,t){if(e.openElements.hasInScope(u.BODY)&&(e.insertionMode=Re.AFTER_BODY,e.options.sourceCodeLocationInfo)){const s=e.openElements.tryPeekProperlyNestedBodyElement();s&&e._setEndLocation(s,t);}}(e,t);break;case u.HTML:!function(e,t){e.openElements.hasInScope(u.BODY)&&(e.insertionMode=Re.AFTER_BODY,ut(e,t));}(e,t);break;case u.FORM:!function(e){const t=e.openElements.tmplCount>0,{formElement:s}=e;t||(e.formElement=null),(s||t)&&e.openElements.hasInScope(u.FORM)&&(e.openElements.generateImpliedEndTags(),t?e.openElements.popUntilTagNamePopped(u.FORM):s&&e.openElements.remove(s));}(e);break;case u.APPLET:case u.OBJECT:case u.MARQUEE:!function(e,t){const s=t.tagID;e.openElements.hasInScope(s)&&(e.openElements.generateImpliedEndTags(),e.openElements.popUntilTagNamePopped(s),e.activeFormattingElements.clearToLastMarker());}(e,t);break;case u.TEMPLATE:ve(e,t);break;default:et(e,t);}}function st(e,t){e.tmplInsertionModeStack.length>0?Nt(e,t):Ge(e,t);}function at(e,t){if(fe.has(e.openElements.currentTagId))switch(e.pendingCharacterTokens.length=0,e.hasNonWhitespacePendingCharacterToken=!1,e.originalInsertionMode=e.insertionMode,e.insertionMode=Re.IN_TABLE_TEXT,t.type){case h.CHARACTER:ct(e,t);break;case h.WHITESPACE_CHARACTER:ot(e,t);}else it(e,t);}function rt(e,t){switch(t.tagID){case u.TD:case u.TH:case u.TR:!function(e,t){e.openElements.clearBackToTableContext(),e._insertFakeElement(N.TBODY,u.TBODY),e.insertionMode=Re.IN_TABLE_BODY,At(e,t);}(e,t);break;case u.STYLE:case u.SCRIPT:case u.TEMPLATE:xe(e,t);break;case u.COL:!function(e,t){e.openElements.clearBackToTableContext(),e._insertFakeElement(N.COLGROUP,u.COLGROUP),e.insertionMode=Re.IN_COLUMN_GROUP,ht(e,t);}(e,t);break;case u.FORM:!function(e,t){e.formElement||0!==e.openElements.tmplCount||(e._insertElement(t,p.HTML),e.formElement=e.openElements.current,e.openElements.pop());}(e,t);break;case u.TABLE:!function(e,t){e.openElements.hasInTableScope(u.TABLE)&&(e.openElements.popUntilTagNamePopped(u.TABLE),e._resetInsertionMode(),e._processStartTag(t));}(e,t);break;case u.TBODY:case u.TFOOT:case u.THEAD:!function(e,t){e.openElements.clearBackToTableContext(),e._insertElement(t,p.HTML),e.insertionMode=Re.IN_TABLE_BODY;}(e,t);break;case u.INPUT:!function(e,t){je(t)?e._appendElement(t,p.HTML):it(e,t),t.ackSelfClosing=!0;}(e,t);break;case u.CAPTION:!function(e,t){e.openElements.clearBackToTableContext(),e.activeFormattingElements.insertMarker(),e._insertElement(t,p.HTML),e.insertionMode=Re.IN_CAPTION;}(e,t);break;case u.COLGROUP:!function(e,t){e.openElements.clearBackToTableContext(),e._insertElement(t,p.HTML),e.insertionMode=Re.IN_COLUMN_GROUP;}(e,t);break;default:it(e,t);}}function nt(e,t){switch(t.tagID){case u.TABLE:e.openElements.hasInTableScope(u.TABLE)&&(e.openElements.popUntilTagNamePopped(u.TABLE),e._resetInsertionMode());break;case u.TEMPLATE:ve(e,t);break;case u.BODY:case u.CAPTION:case u.COL:case u.COLGROUP:case u.HTML:case u.TBODY:case u.TD:case u.TFOOT:case u.TH:case u.THEAD:case u.TR:break;default:it(e,t);}}function it(e,t){const s=e.fosterParentingEnabled;e.fosterParentingEnabled=!0,Xe(e,t),e.fosterParentingEnabled=s;}function ot(e,t){e.pendingCharacterTokens.push(t);}function ct(e,t){e.pendingCharacterTokens.push(t),e.hasNonWhitespacePendingCharacterToken=!0;}function Et(e,t){let s=0;if(e.hasNonWhitespacePendingCharacterToken)for(;s<e.pendingCharacterTokens.length;s++)it(e,e.pendingCharacterTokens[s]);else for(;s<e.pendingCharacterTokens.length;s++)e._insertCharacters(e.pendingCharacterTokens[s]);e.insertionMode=e.originalInsertionMode,e._processToken(t);}const Tt=new Set([u.CAPTION,u.COL,u.COLGROUP,u.TBODY,u.TD,u.TFOOT,u.TH,u.THEAD,u.TR]);function ht(e,t){switch(t.tagID){case u.HTML:$e(e,t);break;case u.COL:e._appendElement(t,p.HTML),t.ackSelfClosing=!0;break;case u.TEMPLATE:xe(e,t);break;default:_t(e,t);}}function _t(e,t){e.openElements.currentTagId===u.COLGROUP&&(e.openElements.pop(),e.insertionMode=Re.IN_TABLE,e._processToken(t));}function At(e,t){switch(t.tagID){case u.TR:e.openElements.clearBackToTableBodyContext(),e._insertElement(t,p.HTML),e.insertionMode=Re.IN_ROW;break;case u.TH:case u.TD:e.openElements.clearBackToTableBodyContext(),e._insertFakeElement(N.TR,u.TR),e.insertionMode=Re.IN_ROW,mt(e,t);break;case u.CAPTION:case u.COL:case u.COLGROUP:case u.TBODY:case u.TFOOT:case u.THEAD:e.openElements.hasTableBodyContextInTableScope()&&(e.openElements.clearBackToTableBodyContext(),e.openElements.pop(),e.insertionMode=Re.IN_TABLE,rt(e,t));break;default:rt(e,t);}}function lt(e,t){const s=t.tagID;switch(t.tagID){case u.TBODY:case u.TFOOT:case u.THEAD:e.openElements.hasInTableScope(s)&&(e.openElements.clearBackToTableBodyContext(),e.openElements.pop(),e.insertionMode=Re.IN_TABLE);break;case u.TABLE:e.openElements.hasTableBodyContextInTableScope()&&(e.openElements.clearBackToTableBodyContext(),e.openElements.pop(),e.insertionMode=Re.IN_TABLE,nt(e,t));break;case u.BODY:case u.CAPTION:case u.COL:case u.COLGROUP:case u.HTML:case u.TD:case u.TH:case u.TR:break;default:nt(e,t);}}function mt(e,t){switch(t.tagID){case u.TH:case u.TD:e.openElements.clearBackToTableRowContext(),e._insertElement(t,p.HTML),e.insertionMode=Re.IN_CELL,e.activeFormattingElements.insertMarker();break;case u.CAPTION:case u.COL:case u.COLGROUP:case u.TBODY:case u.TFOOT:case u.THEAD:case u.TR:e.openElements.hasInTableScope(u.TR)&&(e.openElements.clearBackToTableRowContext(),e.openElements.pop(),e.insertionMode=Re.IN_TABLE_BODY,At(e,t));break;default:rt(e,t);}}function pt(e,t){switch(t.tagID){case u.TR:e.openElements.hasInTableScope(u.TR)&&(e.openElements.clearBackToTableRowContext(),e.openElements.pop(),e.insertionMode=Re.IN_TABLE_BODY);break;case u.TABLE:e.openElements.hasInTableScope(u.TR)&&(e.openElements.clearBackToTableRowContext(),e.openElements.pop(),e.insertionMode=Re.IN_TABLE_BODY,lt(e,t));break;case u.TBODY:case u.TFOOT:case u.THEAD:(e.openElements.hasInTableScope(t.tagID)||e.openElements.hasInTableScope(u.TR))&&(e.openElements.clearBackToTableRowContext(),e.openElements.pop(),e.insertionMode=Re.IN_TABLE_BODY,lt(e,t));break;case u.BODY:case u.CAPTION:case u.COL:case u.COLGROUP:case u.HTML:case u.TD:case u.TH:break;default:nt(e,t);}}function dt(e,t){switch(t.tagID){case u.HTML:$e(e,t);break;case u.OPTION:e.openElements.currentTagId===u.OPTION&&e.openElements.pop(),e._insertElement(t,p.HTML);break;case u.OPTGROUP:e.openElements.currentTagId===u.OPTION&&e.openElements.pop(),e.openElements.currentTagId===u.OPTGROUP&&e.openElements.pop(),e._insertElement(t,p.HTML);break;case u.INPUT:case u.KEYGEN:case u.TEXTAREA:case u.SELECT:e.openElements.hasInSelectScope(u.SELECT)&&(e.openElements.popUntilTagNamePopped(u.SELECT),e._resetInsertionMode(),t.tagID!==u.SELECT&&e._processStartTag(t));break;case u.SCRIPT:case u.TEMPLATE:xe(e,t);}}function It(e,t){switch(t.tagID){case u.OPTGROUP:e.openElements.stackTop>0&&e.openElements.currentTagId===u.OPTION&&e.openElements.tagIDs[e.openElements.stackTop-1]===u.OPTGROUP&&e.openElements.pop(),e.openElements.currentTagId===u.OPTGROUP&&e.openElements.pop();break;case u.OPTION:e.openElements.currentTagId===u.OPTION&&e.openElements.pop();break;case u.SELECT:e.openElements.hasInSelectScope(u.SELECT)&&(e.openElements.popUntilTagNamePopped(u.SELECT),e._resetInsertionMode());break;case u.TEMPLATE:ve(e,t);}}function Nt(e,t){e.openElements.tmplCount>0?(e.openElements.popUntilTagNamePopped(u.TEMPLATE),e.activeFormattingElements.clearToLastMarker(),e.tmplInsertionModeStack.shift(),e._resetInsertionMode(),e.onEof(t)):Ge(e,t);}function ut(e,t){var s;if(t.tagID===u.HTML){if(e.fragmentContext||(e.insertionMode=Re.AFTER_AFTER_BODY),e.options.sourceCodeLocationInfo&&e.openElements.tagIDs[0]===u.HTML){e._setEndLocation(e.openElements.items[0],t);const a=e.openElements.items[1];a&&!(null===(s=e.treeAdapter.getNodeSourceCodeLocation(a))||void 0===s?void 0:s.endTag)&&e._setEndLocation(a,t);}}else Ct(e,t);}function Ct(e,t){e.insertionMode=Re.IN_BODY,Xe(e,t);}function Dt(e,t){e.insertionMode=Re.IN_BODY,Xe(e,t);}function St(e){for(;e.treeAdapter.getNamespaceURI(e.openElements.current)!==p.HTML&&!e._isIntegrationPoint(e.openElements.currentTagId,e.openElements.current);)e.openElements.pop();}return new Set([N.AREA,N.BASE,N.BASEFONT,N.BGSOUND,N.BR,N.COL,N.EMBED,N.FRAME,N.HR,N.IMG,N.INPUT,N.KEYGEN,N.LINK,N.META,N.PARAM,N.SOURCE,N.TRACK,N.WBR]),e.parse=function(e,t){return Me.parse(e,t)},e.parseFragment=function(e,t,s){"string"==typeof e&&(s=t,t=e,e=null);const a=Me.getFragmentParser(e,s);return a.tokenizer.write(t,!0),a.getFragment()},Object.defineProperty(e,"__esModule",{value:!0}),e}({});const parse=e.parse;const parseFragment=e.parseFragment;

const docParser = new WeakMap();
function parseDocumentUtil(ownerDocument, html) {
  const doc = parse(html.trim(), getParser(ownerDocument));
  doc.documentElement = doc.firstElementChild;
  doc.head = doc.documentElement.firstElementChild;
  doc.body = doc.head.nextElementSibling;
  return doc;
}
function parseFragmentUtil(ownerDocument, html) {
  if (typeof html === 'string') {
    html = html.trim();
  }
  else {
    html = '';
  }
  const frag = parseFragment(html, getParser(ownerDocument));
  return frag;
}
function getParser(ownerDocument) {
  let parseOptions = docParser.get(ownerDocument);
  if (parseOptions != null) {
    return parseOptions;
  }
  const treeAdapter = {
    createDocument() {
      const doc = ownerDocument.createElement("#document" /* NODE_NAMES.DOCUMENT_NODE */);
      doc['x-mode'] = 'no-quirks';
      return doc;
    },
    setNodeSourceCodeLocation(node, location) {
      node.sourceCodeLocation = location;
    },
    getNodeSourceCodeLocation(node) {
      return node.sourceCodeLocation;
    },
    createDocumentFragment() {
      return ownerDocument.createDocumentFragment();
    },
    createElement(tagName, namespaceURI, attrs) {
      const elm = ownerDocument.createElementNS(namespaceURI, tagName);
      for (let i = 0; i < attrs.length; i++) {
        const attr = attrs[i];
        if (attr.namespace == null || attr.namespace === 'http://www.w3.org/1999/xhtml') {
          elm.setAttribute(attr.name, attr.value);
        }
        else {
          elm.setAttributeNS(attr.namespace, attr.name, attr.value);
        }
      }
      return elm;
    },
    createCommentNode(data) {
      return ownerDocument.createComment(data);
    },
    appendChild(parentNode, newNode) {
      parentNode.appendChild(newNode);
    },
    insertBefore(parentNode, newNode, referenceNode) {
      parentNode.insertBefore(newNode, referenceNode);
    },
    setTemplateContent(templateElement, contentElement) {
      templateElement.content = contentElement;
    },
    getTemplateContent(templateElement) {
      return templateElement.content;
    },
    setDocumentType(doc, name, publicId, systemId) {
      let doctypeNode = doc.childNodes.find((n) => n.nodeType === 10 /* NODE_TYPES.DOCUMENT_TYPE_NODE */);
      if (doctypeNode == null) {
        doctypeNode = ownerDocument.createDocumentTypeNode();
        doc.insertBefore(doctypeNode, doc.firstChild);
      }
      doctypeNode.nodeValue = '!DOCTYPE';
      doctypeNode['x-name'] = name;
      doctypeNode['x-publicId'] = publicId;
      doctypeNode['x-systemId'] = systemId;
    },
    setDocumentMode(doc, mode) {
      doc['x-mode'] = mode;
    },
    getDocumentMode(doc) {
      return doc['x-mode'];
    },
    detachNode(node) {
      node.remove();
    },
    insertText(parentNode, text) {
      const lastChild = parentNode.lastChild;
      if (lastChild != null && lastChild.nodeType === 3 /* NODE_TYPES.TEXT_NODE */) {
        lastChild.nodeValue += text;
      }
      else {
        parentNode.appendChild(ownerDocument.createTextNode(text));
      }
    },
    insertTextBefore(parentNode, text, referenceNode) {
      const prevNode = parentNode.childNodes[parentNode.childNodes.indexOf(referenceNode) - 1];
      if (prevNode != null && prevNode.nodeType === 3 /* NODE_TYPES.TEXT_NODE */) {
        prevNode.nodeValue += text;
      }
      else {
        parentNode.insertBefore(ownerDocument.createTextNode(text), referenceNode);
      }
    },
    adoptAttributes(recipient, attrs) {
      for (let i = 0; i < attrs.length; i++) {
        const attr = attrs[i];
        if (recipient.hasAttributeNS(attr.namespace, attr.name) === false) {
          recipient.setAttributeNS(attr.namespace, attr.name, attr.value);
        }
      }
    },
    getFirstChild(node) {
      return node.childNodes[0];
    },
    getChildNodes(node) {
      return node.childNodes;
    },
    getParentNode(node) {
      return node.parentNode;
    },
    getAttrList(element) {
      const attrs = element.attributes.__items.map((attr) => {
        return {
          name: attr.name,
          value: attr.value,
          namespace: attr.namespaceURI,
          prefix: null,
        };
      });
      return attrs;
    },
    getTagName(element) {
      if (element.namespaceURI === 'http://www.w3.org/1999/xhtml') {
        return element.nodeName.toLowerCase();
      }
      else {
        return element.nodeName;
      }
    },
    getNamespaceURI(element) {
      // mock-doc widens the type of an element's namespace uri to 'string | null'
      // we use a type assertion here to adhere to parse5's type definitions
      return element.namespaceURI;
    },
    getTextNodeContent(textNode) {
      return textNode.nodeValue;
    },
    getCommentNodeContent(commentNode) {
      return commentNode.nodeValue;
    },
    getDocumentTypeNodeName(doctypeNode) {
      return doctypeNode['x-name'];
    },
    getDocumentTypeNodePublicId(doctypeNode) {
      return doctypeNode['x-publicId'];
    },
    getDocumentTypeNodeSystemId(doctypeNode) {
      return doctypeNode['x-systemId'];
    },
    // @ts-ignore - a `MockNode` will never be assignable to a `TreeAdapterTypeMap['text']`. As a result, we cannot
    // complete this function signature
    isTextNode(node) {
      return node.nodeType === 3 /* NODE_TYPES.TEXT_NODE */;
    },
    // @ts-ignore - a `MockNode` will never be assignable to a `TreeAdapterTypeMap['comment']`. As a result, we cannot
    // complete this function signature (which requires its return type to be a type predicate)
    isCommentNode(node) {
      return node.nodeType === 8 /* NODE_TYPES.COMMENT_NODE */;
    },
    // @ts-ignore - a `MockNode` will never be assignable to a `TreeAdapterTypeMap['document']`. As a result, we cannot
    // complete this function signature (which requires its return type to be a type predicate)
    isDocumentTypeNode(node) {
      return node.nodeType === 10 /* NODE_TYPES.DOCUMENT_TYPE_NODE */;
    },
    // @ts-ignore - a `MockNode` will never be assignable to a `TreeAdapterTypeMap['element']`. As a result, we cannot
    // complete this function signature (which requires its return type to be a type predicate)
    isElementNode(node) {
      return node.nodeType === 1 /* NODE_TYPES.ELEMENT_NODE */;
    },
  };
  parseOptions = {
    treeAdapter: treeAdapter,
  };
  docParser.set(ownerDocument, parseOptions);
  return parseOptions;
}

// Sizzle 2.3.10
const Sizzle = (function() {
const window = {
  document: {
  createElement() {
    return {};
  },
  nodeType: 9,
  documentElement: {
    nodeType: 1,
    nodeName: 'HTML'
  }
  }
};
const module = { exports: {} };

/*! Sizzle v2.3.10 | (c) JS Foundation and other contributors | js.foundation */
!function(e){var t,n,r,i,o,u,l,a,c,s,f,d,p,h,g,m,y,v,w,b="sizzle"+1*new Date,N=e.document,C=0,x=0,E=ae(),A=ae(),S=ae(),D=ae(),T=function(e,t){return e===t&&(f=!0),0},L={}.hasOwnProperty,q=[],I=q.pop,B=q.push,R=q.push,$=q.slice,k=function(e,t){for(var n=0,r=e.length;n<r;n++)if(e[n]===t)return n;return -1},H="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",M="[\\x20\\t\\r\\n\\f]",P="(?:\\\\[\\da-fA-F]{1,6}"+M+"?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+",z="\\["+M+"*("+P+")(?:"+M+"*([*^$|!~]?=)"+M+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+P+"))|)"+M+"*\\]",F=":("+P+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+z+")*)|.*)\\)|)",O=new RegExp(M+"+","g"),j=new RegExp("^"+M+"+|((?:^|[^\\\\])(?:\\\\.)*)"+M+"+$","g"),G=new RegExp("^"+M+"*,"+M+"*"),U=new RegExp("^"+M+"*([>+~]|"+M+")"+M+"*"),V=new RegExp(M+"|>"),X=new RegExp(F),J=new RegExp("^"+P+"$"),K={ID:new RegExp("^#("+P+")"),CLASS:new RegExp("^\\.("+P+")"),TAG:new RegExp("^("+P+"|[*])"),ATTR:new RegExp("^"+z),PSEUDO:new RegExp("^"+F),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+M+"*(even|odd|(([+-]|)(\\d*)n|)"+M+"*(?:([+-]|)"+M+"*(\\d+)|))"+M+"*\\)|)","i"),bool:new RegExp("^(?:"+H+")$","i"),needsContext:new RegExp("^"+M+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+M+"*((?:-\\d)?\\d*)"+M+"*\\)|)(?=[^-]|$)","i")},Q=/HTML$/i,W=/^(?:input|select|textarea|button)$/i,Y=/^h\d$/i,Z=/^[^{]+\{\s*\[native \w/,_=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,ee=/[+~]/,te=new RegExp("\\\\[\\da-fA-F]{1,6}"+M+"?|\\\\([^\\r\\n\\f])","g"),ne=function(e,t){var n="0x"+e.slice(1)-65536;return t||(n<0?String.fromCharCode(n+65536):String.fromCharCode(n>>10|55296,1023&n|56320))},re=/([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,ie=function(e,t){return t?"\0"===e?"\ufffd":e.slice(0,-1)+"\\"+e.charCodeAt(e.length-1).toString(16)+" ":"\\"+e},oe=function(){d();},ue=ve(function(e){return !0===e.disabled&&"fieldset"===e.nodeName.toLowerCase()},{dir:"parentNode",next:"legend"});try{R.apply(q=$.call(N.childNodes),N.childNodes),q[N.childNodes.length].nodeType;}catch(e){R={apply:q.length?function(e,t){B.apply(e,$.call(t));}:function(e,t){var n=e.length,r=0;while(e[n++]=t[r++]);e.length=n-1;}};}function le(e,t,r,i){var o,l,c,s,f,h,y,v=t&&t.ownerDocument,N=t?t.nodeType:9;if(r=r||[],"string"!=typeof e||!e||1!==N&&9!==N&&11!==N)return r;if(!i&&(d(t),t=t||p,g)){if(11!==N&&(f=_.exec(e)))if(o=f[1]){if(9===N){if(!(c=t.getElementById(o)))return r;if(c.id===o)return r.push(c),r}else if(v&&(c=v.getElementById(o))&&w(t,c)&&c.id===o)return r.push(c),r}else {if(f[2])return R.apply(r,t.getElementsByTagName(e)),r;if((o=f[3])&&n.getElementsByClassName&&t.getElementsByClassName)return R.apply(r,t.getElementsByClassName(o)),r}if(n.qsa&&!D[e+" "]&&(!m||!m.test(e))&&(1!==N||"object"!==t.nodeName.toLowerCase())){if(y=e,v=t,1===N&&(V.test(e)||U.test(e))){(v=ee.test(e)&&ge(t.parentNode)||t)===t&&n.scope||((s=t.getAttribute("id"))?s=s.replace(re,ie):t.setAttribute("id",s=b)),l=(h=u(e)).length;while(l--)h[l]=(s?"#"+s:":scope")+" "+ye(h[l]);y=h.join(",");}try{return R.apply(r,v.querySelectorAll(y)),r}catch(t){D(e,!0);}finally{s===b&&t.removeAttribute("id");}}}return a(e.replace(j,"$1"),t,r,i)}function ae(){var e=[];function t(n,i){return e.push(n+" ")>r.cacheLength&&delete t[e.shift()],t[n+" "]=i}return t}function ce(e){return e[b]=!0,e}function se(e){var t=p.createElement("fieldset");try{return !!e(t)}catch(e){return !1}finally{t.parentNode&&t.parentNode.removeChild(t),t=null;}}function fe(e,t){var n=e.split("|"),i=n.length;while(i--)r.attrHandle[n[i]]=t;}function de(e,t){var n=t&&e,r=n&&1===e.nodeType&&1===t.nodeType&&e.sourceIndex-t.sourceIndex;if(r)return r;if(n)while(n=n.nextSibling)if(n===t)return -1;return e?1:-1}function pe(e){return function(t){return "form"in t?t.parentNode&&!1===t.disabled?"label"in t?"label"in t.parentNode?t.parentNode.disabled===e:t.disabled===e:t.isDisabled===e||t.isDisabled!==!e&&ue(t)===e:t.disabled===e:"label"in t&&t.disabled===e}}function he(e){return ce(function(t){return t=+t,ce(function(n,r){var i,o=e([],n.length,t),u=o.length;while(u--)n[i=o[u]]&&(n[i]=!(r[i]=n[i]));})})}function ge(e){return e&&void 0!==e.getElementsByTagName&&e}n=le.support={},o=le.isXML=function(e){var t=e&&e.namespaceURI,n=e&&(e.ownerDocument||e).documentElement;return !Q.test(t||n&&n.nodeName||"HTML")},d=le.setDocument=function(e){var t,i,u=e?e.ownerDocument||e:N;return u!=p&&9===u.nodeType&&u.documentElement?(p=u,h=p.documentElement,g=!o(p),N!=p&&(i=p.defaultView)&&i.top!==i&&(i.addEventListener?i.addEventListener("unload",oe,!1):i.attachEvent&&i.attachEvent("onunload",oe)),n.scope=se(function(e){return h.appendChild(e).appendChild(p.createElement("div")),void 0!==e.querySelectorAll&&!e.querySelectorAll(":scope fieldset div").length}),n.cssHas=se(function(){try{return p.querySelector(":has(*,:jqfake)"),!1}catch(e){return !0}}),n.attributes=se(function(e){return e.className="i",!e.getAttribute("className")}),n.getElementsByTagName=se(function(e){return e.appendChild(p.createComment("")),!e.getElementsByTagName("*").length}),n.getElementsByClassName=Z.test(p.getElementsByClassName),n.getById=se(function(e){return h.appendChild(e).id=b,!p.getElementsByName||!p.getElementsByName(b).length}),n.getById?(r.filter.ID=function(e){var t=e.replace(te,ne);return function(e){return e.getAttribute("id")===t}},r.find.ID=function(e,t){if(void 0!==t.getElementById&&g){var n=t.getElementById(e);return n?[n]:[]}}):(r.filter.ID=function(e){var t=e.replace(te,ne);return function(e){var n=void 0!==e.getAttributeNode&&e.getAttributeNode("id");return n&&n.value===t}},r.find.ID=function(e,t){if(void 0!==t.getElementById&&g){var n,r,i,o=t.getElementById(e);if(o){if((n=o.getAttributeNode("id"))&&n.value===e)return [o];i=t.getElementsByName(e),r=0;while(o=i[r++])if((n=o.getAttributeNode("id"))&&n.value===e)return [o]}return []}}),r.find.TAG=n.getElementsByTagName?function(e,t){return void 0!==t.getElementsByTagName?t.getElementsByTagName(e):n.qsa?t.querySelectorAll(e):void 0}:function(e,t){var n,r=[],i=0,o=t.getElementsByTagName(e);if("*"===e){while(n=o[i++])1===n.nodeType&&r.push(n);return r}return o},r.find.CLASS=n.getElementsByClassName&&function(e,t){if(void 0!==t.getElementsByClassName&&g)return t.getElementsByClassName(e)},y=[],m=[],(n.qsa=Z.test(p.querySelectorAll))&&(se(function(e){var t;h.appendChild(e).innerHTML="<a id='"+b+"'></a><select id='"+b+"-\r\\' msallowcapture=''><option selected=''></option></select>",e.querySelectorAll("[msallowcapture^='']").length&&m.push("[*^$]="+M+"*(?:''|\"\")"),e.querySelectorAll("[selected]").length||m.push("\\["+M+"*(?:value|"+H+")"),e.querySelectorAll("[id~="+b+"-]").length||m.push("~="),(t=p.createElement("input")).setAttribute("name",""),e.appendChild(t),e.querySelectorAll("[name='']").length||m.push("\\["+M+"*name"+M+"*="+M+"*(?:''|\"\")"),e.querySelectorAll(":checked").length||m.push(":checked"),e.querySelectorAll("a#"+b+"+*").length||m.push(".#.+[+~]"),e.querySelectorAll("\\\f"),m.push("[\\r\\n\\f]");}),se(function(e){e.innerHTML="<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";var t=p.createElement("input");t.setAttribute("type","hidden"),e.appendChild(t).setAttribute("name","D"),e.querySelectorAll("[name=d]").length&&m.push("name"+M+"*[*^$|!~]?="),2!==e.querySelectorAll(":enabled").length&&m.push(":enabled",":disabled"),h.appendChild(e).disabled=!0,2!==e.querySelectorAll(":disabled").length&&m.push(":enabled",":disabled"),e.querySelectorAll("*,:x"),m.push(",.*:");})),(n.matchesSelector=Z.test(v=h.matches||h.webkitMatchesSelector||h.mozMatchesSelector||h.oMatchesSelector||h.msMatchesSelector))&&se(function(e){n.disconnectedMatch=v.call(e,"*"),v.call(e,"[s!='']:x"),y.push("!=",F);}),n.cssHas||m.push(":has"),m=m.length&&new RegExp(m.join("|")),y=y.length&&new RegExp(y.join("|")),t=Z.test(h.compareDocumentPosition),w=t||Z.test(h.contains)?function(e,t){var n=9===e.nodeType&&e.documentElement||e,r=t&&t.parentNode;return e===r||!(!r||1!==r.nodeType||!(n.contains?n.contains(r):e.compareDocumentPosition&&16&e.compareDocumentPosition(r)))}:function(e,t){if(t)while(t=t.parentNode)if(t===e)return !0;return !1},T=t?function(e,t){if(e===t)return f=!0,0;var r=!e.compareDocumentPosition-!t.compareDocumentPosition;return r||(1&(r=(e.ownerDocument||e)==(t.ownerDocument||t)?e.compareDocumentPosition(t):1)||!n.sortDetached&&t.compareDocumentPosition(e)===r?e==p||e.ownerDocument==N&&w(N,e)?-1:t==p||t.ownerDocument==N&&w(N,t)?1:s?k(s,e)-k(s,t):0:4&r?-1:1)}:function(e,t){if(e===t)return f=!0,0;var n,r=0,i=e.parentNode,o=t.parentNode,u=[e],l=[t];if(!i||!o)return e==p?-1:t==p?1:i?-1:o?1:s?k(s,e)-k(s,t):0;if(i===o)return de(e,t);n=e;while(n=n.parentNode)u.unshift(n);n=t;while(n=n.parentNode)l.unshift(n);while(u[r]===l[r])r++;return r?de(u[r],l[r]):u[r]==N?-1:l[r]==N?1:0},p):p},le.matches=function(e,t){return le(e,null,null,t)},le.matchesSelector=function(e,t){if(d(e),n.matchesSelector&&g&&!D[t+" "]&&(!y||!y.test(t))&&(!m||!m.test(t)))try{var r=v.call(e,t);if(r||n.disconnectedMatch||e.document&&11!==e.document.nodeType)return r}catch(e){D(t,!0);}return le(t,p,null,[e]).length>0},le.contains=function(e,t){return (e.ownerDocument||e)!=p&&d(e),w(e,t)},le.attr=function(e,t){(e.ownerDocument||e)!=p&&d(e);var i=r.attrHandle[t.toLowerCase()],o=i&&L.call(r.attrHandle,t.toLowerCase())?i(e,t,!g):void 0;return void 0!==o?o:n.attributes||!g?e.getAttribute(t):(o=e.getAttributeNode(t))&&o.specified?o.value:null},le.escape=function(e){return (e+"").replace(re,ie)},le.error=function(e){throw new Error("Syntax error, unrecognized expression: "+e)},le.uniqueSort=function(e){var t,r=[],i=0,o=0;if(f=!n.detectDuplicates,s=!n.sortStable&&e.slice(0),e.sort(T),f){while(t=e[o++])t===e[o]&&(i=r.push(o));while(i--)e.splice(r[i],1);}return s=null,e},i=le.getText=function(e){var t,n="",r=0,o=e.nodeType;if(o){if(1===o||9===o||11===o){if("string"==typeof e.textContent)return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)n+=i(e);}else if(3===o||4===o)return e.nodeValue}else while(t=e[r++])n+=i(t);return n},(r=le.selectors={cacheLength:50,createPseudo:ce,match:K,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){return e[1]=e[1].replace(te,ne),e[3]=(e[3]||e[4]||e[5]||"").replace(te,ne),"~="===e[2]&&(e[3]=" "+e[3]+" "),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),"nth"===e[1].slice(0,3)?(e[3]||le.error(e[0]),e[4]=+(e[4]?e[5]+(e[6]||1):2*("even"===e[3]||"odd"===e[3])),e[5]=+(e[7]+e[8]||"odd"===e[3])):e[3]&&le.error(e[0]),e},PSEUDO:function(e){var t,n=!e[6]&&e[2];return K.CHILD.test(e[0])?null:(e[3]?e[2]=e[4]||e[5]||"":n&&X.test(n)&&(t=u(n,!0))&&(t=n.indexOf(")",n.length-t)-n.length)&&(e[0]=e[0].slice(0,t),e[2]=n.slice(0,t)),e.slice(0,3))}},filter:{TAG:function(e){var t=e.replace(te,ne).toLowerCase();return "*"===e?function(){return !0}:function(e){return e.nodeName&&e.nodeName.toLowerCase()===t}},CLASS:function(e){var t=E[e+" "];return t||(t=new RegExp("(^|"+M+")"+e+"("+M+"|$)"))&&E(e,function(e){return t.test("string"==typeof e.className&&e.className||void 0!==e.getAttribute&&e.getAttribute("class")||"")})},ATTR:function(e,t,n){return function(r){var i=le.attr(r,e);return null==i?"!="===t:!t||(i+="","="===t?i===n:"!="===t?i!==n:"^="===t?n&&0===i.indexOf(n):"*="===t?n&&i.indexOf(n)>-1:"$="===t?n&&i.slice(-n.length)===n:"~="===t?(" "+i.replace(O," ")+" ").indexOf(n)>-1:"|="===t&&(i===n||i.slice(0,n.length+1)===n+"-"))}},CHILD:function(e,t,n,r,i){var o="nth"!==e.slice(0,3),u="last"!==e.slice(-4),l="of-type"===t;return 1===r&&0===i?function(e){return !!e.parentNode}:function(t,n,a){var c,s,f,d,p,h,g=o!==u?"nextSibling":"previousSibling",m=t.parentNode,y=l&&t.nodeName.toLowerCase(),v=!a&&!l,w=!1;if(m){if(o){while(g){d=t;while(d=d[g])if(l?d.nodeName.toLowerCase()===y:1===d.nodeType)return !1;h=g="only"===e&&!h&&"nextSibling";}return !0}if(h=[u?m.firstChild:m.lastChild],u&&v){w=(p=(c=(s=(f=(d=m)[b]||(d[b]={}))[d.uniqueID]||(f[d.uniqueID]={}))[e]||[])[0]===C&&c[1])&&c[2],d=p&&m.childNodes[p];while(d=++p&&d&&d[g]||(w=p=0)||h.pop())if(1===d.nodeType&&++w&&d===t){s[e]=[C,p,w];break}}else if(v&&(w=p=(c=(s=(f=(d=t)[b]||(d[b]={}))[d.uniqueID]||(f[d.uniqueID]={}))[e]||[])[0]===C&&c[1]),!1===w)while(d=++p&&d&&d[g]||(w=p=0)||h.pop())if((l?d.nodeName.toLowerCase()===y:1===d.nodeType)&&++w&&(v&&((s=(f=d[b]||(d[b]={}))[d.uniqueID]||(f[d.uniqueID]={}))[e]=[C,w]),d===t))break;return (w-=i)===r||w%r==0&&w/r>=0}}},PSEUDO:function(e,t){var n,i=r.pseudos[e]||r.setFilters[e.toLowerCase()]||le.error("unsupported pseudo: "+e);return i[b]?i(t):i.length>1?(n=[e,e,"",t],r.setFilters.hasOwnProperty(e.toLowerCase())?ce(function(e,n){var r,o=i(e,t),u=o.length;while(u--)e[r=k(e,o[u])]=!(n[r]=o[u]);}):function(e){return i(e,0,n)}):i}},pseudos:{not:ce(function(e){var t=[],n=[],r=l(e.replace(j,"$1"));return r[b]?ce(function(e,t,n,i){var o,u=r(e,null,i,[]),l=e.length;while(l--)(o=u[l])&&(e[l]=!(t[l]=o));}):function(e,i,o){return t[0]=e,r(t,null,o,n),t[0]=null,!n.pop()}}),has:ce(function(e){return function(t){return le(e,t).length>0}}),contains:ce(function(e){return e=e.replace(te,ne),function(t){return (t.textContent||i(t)).indexOf(e)>-1}}),lang:ce(function(e){return J.test(e||"")||le.error("unsupported lang: "+e),e=e.replace(te,ne).toLowerCase(),function(t){var n;do{if(n=g?t.lang:t.getAttribute("xml:lang")||t.getAttribute("lang"))return (n=n.toLowerCase())===e||0===n.indexOf(e+"-")}while((t=t.parentNode)&&1===t.nodeType);return !1}}),target:function(t){var n=e.location&&e.location.hash;return n&&n.slice(1)===t.id},root:function(e){return e===h},focus:function(e){return e===p.activeElement&&(!p.hasFocus||p.hasFocus())&&!!(e.type||e.href||~e.tabIndex)},enabled:pe(!1),disabled:pe(!0),checked:function(e){var t=e.nodeName.toLowerCase();return "input"===t&&!!e.checked||"option"===t&&!!e.selected},selected:function(e){return e.parentNode&&e.parentNode.selectedIndex,!0===e.selected},empty:function(e){for(e=e.firstChild;e;e=e.nextSibling)if(e.nodeType<6)return !1;return !0},parent:function(e){return !r.pseudos.empty(e)},header:function(e){return Y.test(e.nodeName)},input:function(e){return W.test(e.nodeName)},button:function(e){var t=e.nodeName.toLowerCase();return "input"===t&&"button"===e.type||"button"===t},text:function(e){var t;return "input"===e.nodeName.toLowerCase()&&"text"===e.type&&(null==(t=e.getAttribute("type"))||"text"===t.toLowerCase())},first:he(function(){return [0]}),last:he(function(e,t){return [t-1]}),eq:he(function(e,t,n){return [n<0?n+t:n]}),even:he(function(e,t){for(var n=0;n<t;n+=2)e.push(n);return e}),odd:he(function(e,t){for(var n=1;n<t;n+=2)e.push(n);return e}),lt:he(function(e,t,n){for(var r=n<0?n+t:n>t?t:n;--r>=0;)e.push(r);return e}),gt:he(function(e,t,n){for(var r=n<0?n+t:n;++r<t;)e.push(r);return e})}}).pseudos.nth=r.pseudos.eq;for(t in {radio:!0,checkbox:!0,file:!0,password:!0,image:!0})r.pseudos[t]=function(e){return function(t){return "input"===t.nodeName.toLowerCase()&&t.type===e}}(t);for(t in {submit:!0,reset:!0})r.pseudos[t]=function(e){return function(t){var n=t.nodeName.toLowerCase();return ("input"===n||"button"===n)&&t.type===e}}(t);function me(){}me.prototype=r.filters=r.pseudos,r.setFilters=new me,u=le.tokenize=function(e,t){var n,i,o,u,l,a,c,s=A[e+" "];if(s)return t?0:s.slice(0);l=e,a=[],c=r.preFilter;while(l){n&&!(i=G.exec(l))||(i&&(l=l.slice(i[0].length)||l),a.push(o=[])),n=!1,(i=U.exec(l))&&(n=i.shift(),o.push({value:n,type:i[0].replace(j," ")}),l=l.slice(n.length));for(u in r.filter)!(i=K[u].exec(l))||c[u]&&!(i=c[u](i))||(n=i.shift(),o.push({value:n,type:u,matches:i}),l=l.slice(n.length));if(!n)break}return t?l.length:l?le.error(e):A(e,a).slice(0)};function ye(e){for(var t=0,n=e.length,r="";t<n;t++)r+=e[t].value;return r}function ve(e,t,n){var r=t.dir,i=t.next,o=i||r,u=n&&"parentNode"===o,l=x++;return t.first?function(t,n,i){while(t=t[r])if(1===t.nodeType||u)return e(t,n,i);return !1}:function(t,n,a){var c,s,f,d=[C,l];if(a){while(t=t[r])if((1===t.nodeType||u)&&e(t,n,a))return !0}else while(t=t[r])if(1===t.nodeType||u)if(f=t[b]||(t[b]={}),s=f[t.uniqueID]||(f[t.uniqueID]={}),i&&i===t.nodeName.toLowerCase())t=t[r]||t;else {if((c=s[o])&&c[0]===C&&c[1]===l)return d[2]=c[2];if(s[o]=d,d[2]=e(t,n,a))return !0}return !1}}function we(e){return e.length>1?function(t,n,r){var i=e.length;while(i--)if(!e[i](t,n,r))return !1;return !0}:e[0]}function be(e,t,n){for(var r=0,i=t.length;r<i;r++)le(e,t[r],n);return n}function Ne(e,t,n,r,i){for(var o,u=[],l=0,a=e.length,c=null!=t;l<a;l++)(o=e[l])&&(n&&!n(o,r,i)||(u.push(o),c&&t.push(l)));return u}function Ce(e,t,n,r,i,o){return r&&!r[b]&&(r=Ce(r)),i&&!i[b]&&(i=Ce(i,o)),ce(function(o,u,l,a){var c,s,f,d=[],p=[],h=u.length,g=o||be(t||"*",l.nodeType?[l]:l,[]),m=!e||!o&&t?g:Ne(g,d,e,l,a),y=n?i||(o?e:h||r)?[]:u:m;if(n&&n(m,y,l,a),r){c=Ne(y,p),r(c,[],l,a),s=c.length;while(s--)(f=c[s])&&(y[p[s]]=!(m[p[s]]=f));}if(o){if(i||e){if(i){c=[],s=y.length;while(s--)(f=y[s])&&c.push(m[s]=f);i(null,y=[],c,a);}s=y.length;while(s--)(f=y[s])&&(c=i?k(o,f):d[s])>-1&&(o[c]=!(u[c]=f));}}else y=Ne(y===u?y.splice(h,y.length):y),i?i(null,u,y,a):R.apply(u,y);})}function xe(e){for(var t,n,i,o=e.length,u=r.relative[e[0].type],l=u||r.relative[" "],a=u?1:0,s=ve(function(e){return e===t},l,!0),f=ve(function(e){return k(t,e)>-1},l,!0),d=[function(e,n,r){var i=!u&&(r||n!==c)||((t=n).nodeType?s(e,n,r):f(e,n,r));return t=null,i}];a<o;a++)if(n=r.relative[e[a].type])d=[ve(we(d),n)];else {if((n=r.filter[e[a].type].apply(null,e[a].matches))[b]){for(i=++a;i<o;i++)if(r.relative[e[i].type])break;return Ce(a>1&&we(d),a>1&&ye(e.slice(0,a-1).concat({value:" "===e[a-2].type?"*":""})).replace(j,"$1"),n,a<i&&xe(e.slice(a,i)),i<o&&xe(e=e.slice(i)),i<o&&ye(e))}d.push(n);}return we(d)}function Ee(e,t){var n=t.length>0,i=e.length>0,o=function(o,u,l,a,s){var f,h,m,y=0,v="0",w=o&&[],b=[],N=c,x=o||i&&r.find.TAG("*",s),E=C+=null==N?1:Math.random()||.1,A=x.length;for(s&&(c=u==p||u||s);v!==A&&null!=(f=x[v]);v++){if(i&&f){h=0,u||f.ownerDocument==p||(d(f),l=!g);while(m=e[h++])if(m(f,u||p,l)){a.push(f);break}s&&(C=E);}n&&((f=!m&&f)&&y--,o&&w.push(f));}if(y+=v,n&&v!==y){h=0;while(m=t[h++])m(w,b,u,l);if(o){if(y>0)while(v--)w[v]||b[v]||(b[v]=I.call(a));b=Ne(b);}R.apply(a,b),s&&!o&&b.length>0&&y+t.length>1&&le.uniqueSort(a);}return s&&(C=E,c=N),w};return n?ce(o):o}l=le.compile=function(e,t){var n,r=[],i=[],o=S[e+" "];if(!o){t||(t=u(e)),n=t.length;while(n--)(o=xe(t[n]))[b]?r.push(o):i.push(o);(o=S(e,Ee(i,r))).selector=e;}return o},a=le.select=function(e,t,n,i){var o,a,c,s,f,d="function"==typeof e&&e,p=!i&&u(e=d.selector||e);if(n=n||[],1===p.length){if((a=p[0]=p[0].slice(0)).length>2&&"ID"===(c=a[0]).type&&9===t.nodeType&&g&&r.relative[a[1].type]){if(!(t=(r.find.ID(c.matches[0].replace(te,ne),t)||[])[0]))return n;d&&(t=t.parentNode),e=e.slice(a.shift().value.length);}o=K.needsContext.test(e)?0:a.length;while(o--){if(c=a[o],r.relative[s=c.type])break;if((f=r.find[s])&&(i=f(c.matches[0].replace(te,ne),ee.test(a[0].type)&&ge(t.parentNode)||t))){if(a.splice(o,1),!(e=i.length&&ye(a)))return R.apply(n,i),n;break}}}return (d||l(e,p))(i,t,!g,n,!t||ee.test(e)&&ge(t.parentNode)||t),n},n.sortStable=b.split("").sort(T).join("")===b,n.detectDuplicates=!!f,d(),n.sortDetached=se(function(e){return 1&e.compareDocumentPosition(p.createElement("fieldset"))}),se(function(e){return e.innerHTML="<a href='#'></a>","#"===e.firstChild.getAttribute("href")})||fe("type|href|height|width",function(e,t,n){if(!n)return e.getAttribute(t,"type"===t.toLowerCase()?1:2)}),n.attributes&&se(function(e){return e.innerHTML="<input/>",e.firstChild.setAttribute("value",""),""===e.firstChild.getAttribute("value")})||fe("value",function(e,t,n){if(!n&&"input"===e.nodeName.toLowerCase())return e.defaultValue}),se(function(e){return null==e.getAttribute("disabled")})||fe(H,function(e,t,n){var r;if(!n)return !0===e[t]?t.toLowerCase():(r=e.getAttributeNode(t))&&r.specified?r.value:null});var Ae=e.Sizzle;le.noConflict=function(){return e.Sizzle===le&&(e.Sizzle=Ae),le},"function"==typeof define&&define.amd?define(function(){return le}):"undefined"!=typeof module&&module.exports?module.exports=le:e.Sizzle=le;}(window);
//# sourceMappingURL=sizzle.min.map

return module.exports;
})();

function matches(selector, elm) {
  const r = Sizzle.matches(selector, [elm]);
  return r.length > 0;
}
function selectOne(selector, elm) {
  const r = Sizzle(selector, elm);
  return r[0] || null;
}
function selectAll(selector, elm) {
  return Sizzle(selector, elm);
}

function serializeNodeToHtml(elm, opts = {}) {
  const output = {
    currentLineWidth: 0,
    indent: 0,
    isWithinBody: false,
    text: [],
  };
  if (opts.prettyHtml) {
    if (typeof opts.indentSpaces !== 'number') {
      opts.indentSpaces = 2;
    }
    if (typeof opts.newLines !== 'boolean') {
      opts.newLines = true;
    }
    opts.approximateLineWidth = -1;
  }
  else {
    opts.prettyHtml = false;
    if (typeof opts.newLines !== 'boolean') {
      opts.newLines = false;
    }
    if (typeof opts.indentSpaces !== 'number') {
      opts.indentSpaces = 0;
    }
  }
  if (typeof opts.approximateLineWidth !== 'number') {
    opts.approximateLineWidth = -1;
  }
  if (typeof opts.removeEmptyAttributes !== 'boolean') {
    opts.removeEmptyAttributes = true;
  }
  if (typeof opts.removeAttributeQuotes !== 'boolean') {
    opts.removeAttributeQuotes = false;
  }
  if (typeof opts.removeBooleanAttributeQuotes !== 'boolean') {
    opts.removeBooleanAttributeQuotes = false;
  }
  if (typeof opts.removeHtmlComments !== 'boolean') {
    opts.removeHtmlComments = false;
  }
  if (typeof opts.serializeShadowRoot !== 'boolean') {
    opts.serializeShadowRoot = false;
  }
  if (opts.outerHtml) {
    serializeToHtml(elm, opts, output, false);
  }
  else {
    for (let i = 0, ii = elm.childNodes.length; i < ii; i++) {
      serializeToHtml(elm.childNodes[i], opts, output, false);
    }
  }
  if (output.text[0] === '\n') {
    output.text.shift();
  }
  if (output.text[output.text.length - 1] === '\n') {
    output.text.pop();
  }
  return output.text.join('');
}
function serializeToHtml(node, opts, output, isShadowRoot) {
  if (node.nodeType === 1 /* NODE_TYPES.ELEMENT_NODE */ || isShadowRoot) {
    const tagName = isShadowRoot ? 'mock:shadow-root' : getTagName(node);
    if (tagName === 'body') {
      output.isWithinBody = true;
    }
    const ignoreTag = opts.excludeTags != null && opts.excludeTags.includes(tagName);
    if (ignoreTag === false) {
      const isWithinWhitespaceSensitiveNode = opts.newLines || opts.indentSpaces > 0 ? isWithinWhitespaceSensitive(node) : false;
      if (opts.newLines && !isWithinWhitespaceSensitiveNode) {
        output.text.push('\n');
        output.currentLineWidth = 0;
      }
      if (opts.indentSpaces > 0 && !isWithinWhitespaceSensitiveNode) {
        for (let i = 0; i < output.indent; i++) {
          output.text.push(' ');
        }
        output.currentLineWidth += output.indent;
      }
      output.text.push('<' + tagName);
      output.currentLineWidth += tagName.length + 1;
      const attrsLength = node.attributes.length;
      const attributes = opts.prettyHtml && attrsLength > 1
        ? cloneAttributes(node.attributes, true)
        : node.attributes;
      for (let i = 0; i < attrsLength; i++) {
        const attr = attributes.item(i);
        const attrName = attr.name;
        if (attrName === 'style') {
          continue;
        }
        let attrValue = attr.value;
        if (opts.removeEmptyAttributes && attrValue === '' && REMOVE_EMPTY_ATTR.has(attrName)) {
          continue;
        }
        const attrNamespaceURI = attr.namespaceURI;
        if (attrNamespaceURI == null) {
          output.currentLineWidth += attrName.length + 1;
          if (opts.approximateLineWidth > 0 && output.currentLineWidth > opts.approximateLineWidth) {
            output.text.push('\n' + attrName);
            output.currentLineWidth = 0;
          }
          else {
            output.text.push(' ' + attrName);
          }
        }
        else if (attrNamespaceURI === 'http://www.w3.org/XML/1998/namespace') {
          output.text.push(' xml:' + attrName);
          output.currentLineWidth += attrName.length + 5;
        }
        else if (attrNamespaceURI === 'http://www.w3.org/2000/xmlns/') {
          if (attrName !== 'xmlns') {
            output.text.push(' xmlns:' + attrName);
            output.currentLineWidth += attrName.length + 7;
          }
          else {
            output.text.push(' ' + attrName);
            output.currentLineWidth += attrName.length + 1;
          }
        }
        else if (attrNamespaceURI === XLINK_NS) {
          output.text.push(' xlink:' + attrName);
          output.currentLineWidth += attrName.length + 7;
        }
        else {
          output.text.push(' ' + attrNamespaceURI + ':' + attrName);
          output.currentLineWidth += attrNamespaceURI.length + attrName.length + 2;
        }
        if (opts.prettyHtml && attrName === 'class') {
          attrValue = attr.value = attrValue
            .split(' ')
            .filter((t) => t !== '')
            .sort()
            .join(' ')
            .trim();
        }
        if (attrValue === '') {
          if (opts.removeBooleanAttributeQuotes && BOOLEAN_ATTR.has(attrName)) {
            continue;
          }
          if (opts.removeEmptyAttributes && attrName.startsWith('data-')) {
            continue;
          }
        }
        if (opts.removeAttributeQuotes && CAN_REMOVE_ATTR_QUOTES.test(attrValue)) {
          output.text.push('=' + escapeString(attrValue, true));
          output.currentLineWidth += attrValue.length + 1;
        }
        else {
          output.text.push('="' + escapeString(attrValue, true) + '"');
          output.currentLineWidth += attrValue.length + 3;
        }
      }
      if (node.hasAttribute('style')) {
        const cssText = node.style.cssText;
        if (opts.approximateLineWidth > 0 &&
          output.currentLineWidth + cssText.length + 10 > opts.approximateLineWidth) {
          output.text.push(`\nstyle="${cssText}">`);
          output.currentLineWidth = 0;
        }
        else {
          output.text.push(` style="${cssText}">`);
          output.currentLineWidth += cssText.length + 10;
        }
      }
      else {
        output.text.push('>');
        output.currentLineWidth += 1;
      }
    }
    if (EMPTY_ELEMENTS.has(tagName) === false) {
      if (opts.serializeShadowRoot && node.shadowRoot != null) {
        output.indent = output.indent + opts.indentSpaces;
        serializeToHtml(node.shadowRoot, opts, output, true);
        output.indent = output.indent - opts.indentSpaces;
        if (opts.newLines &&
          (node.childNodes.length === 0 ||
            (node.childNodes.length === 1 &&
              node.childNodes[0].nodeType === 3 /* NODE_TYPES.TEXT_NODE */ &&
              node.childNodes[0].nodeValue.trim() === ''))) {
          output.text.push('\n');
          output.currentLineWidth = 0;
          for (let i = 0; i < output.indent; i++) {
            output.text.push(' ');
          }
          output.currentLineWidth += output.indent;
        }
      }
      if (opts.excludeTagContent == null || opts.excludeTagContent.includes(tagName) === false) {
        const childNodes = tagName === 'template' ? node.content.childNodes : node.childNodes;
        const childNodeLength = childNodes.length;
        if (childNodeLength > 0) {
          if (childNodeLength === 1 &&
            childNodes[0].nodeType === 3 /* NODE_TYPES.TEXT_NODE */ &&
            (typeof childNodes[0].nodeValue !== 'string' || childNodes[0].nodeValue.trim() === '')) ;
          else {
            const isWithinWhitespaceSensitiveNode = opts.newLines || opts.indentSpaces > 0 ? isWithinWhitespaceSensitive(node) : false;
            if (!isWithinWhitespaceSensitiveNode && opts.indentSpaces > 0 && ignoreTag === false) {
              output.indent = output.indent + opts.indentSpaces;
            }
            for (let i = 0; i < childNodeLength; i++) {
              serializeToHtml(childNodes[i], opts, output, false);
            }
            if (ignoreTag === false) {
              if (opts.newLines && !isWithinWhitespaceSensitiveNode) {
                output.text.push('\n');
                output.currentLineWidth = 0;
              }
              if (opts.indentSpaces > 0 && !isWithinWhitespaceSensitiveNode) {
                output.indent = output.indent - opts.indentSpaces;
                for (let i = 0; i < output.indent; i++) {
                  output.text.push(' ');
                }
                output.currentLineWidth += output.indent;
              }
            }
          }
        }
        if (ignoreTag === false) {
          output.text.push('</' + tagName + '>');
          output.currentLineWidth += tagName.length + 3;
        }
      }
    }
    if (opts.approximateLineWidth > 0 && STRUCTURE_ELEMENTS.has(tagName)) {
      output.text.push('\n');
      output.currentLineWidth = 0;
    }
    if (tagName === 'body') {
      output.isWithinBody = false;
    }
  }
  else if (node.nodeType === 3 /* NODE_TYPES.TEXT_NODE */) {
    let textContent = node.nodeValue;
    if (typeof textContent === 'string') {
      const trimmedTextContent = textContent.trim();
      if (trimmedTextContent === '') {
        // this text node is whitespace only
        if (isWithinWhitespaceSensitive(node)) {
          // whitespace matters within this element
          // just add the exact text we were given
          output.text.push(textContent);
          output.currentLineWidth += textContent.length;
        }
        else if (opts.approximateLineWidth > 0 && !output.isWithinBody) ;
        else if (!opts.prettyHtml) {
          // this text node is only whitespace, and it's not
          // within a whitespace sensitive element like <pre> or <code>
          // so replace the entire white space with a single new line
          output.currentLineWidth += 1;
          if (opts.approximateLineWidth > 0 && output.currentLineWidth > opts.approximateLineWidth) {
            // good enough for a new line
            // for perf these are all just estimates
            // we don't care to ensure exact line lengths
            output.text.push('\n');
            output.currentLineWidth = 0;
          }
          else {
            // let's keep it all on the same line yet
            output.text.push(' ');
          }
        }
      }
      else {
        // this text node has text content
        const isWithinWhitespaceSensitiveNode = opts.newLines || opts.indentSpaces > 0 || opts.prettyHtml ? isWithinWhitespaceSensitive(node) : false;
        if (opts.newLines && !isWithinWhitespaceSensitiveNode) {
          output.text.push('\n');
          output.currentLineWidth = 0;
        }
        if (opts.indentSpaces > 0 && !isWithinWhitespaceSensitiveNode) {
          for (let i = 0; i < output.indent; i++) {
            output.text.push(' ');
          }
          output.currentLineWidth += output.indent;
        }
        let textContentLength = textContent.length;
        if (textContentLength > 0) {
          // this text node has text content
          const parentTagName = node.parentNode != null && node.parentNode.nodeType === 1 /* NODE_TYPES.ELEMENT_NODE */
            ? node.parentNode.nodeName
            : null;
          if (NON_ESCAPABLE_CONTENT.has(parentTagName)) {
            // this text node cannot have its content escaped since it's going
            // into an element like <style> or <script>
            if (isWithinWhitespaceSensitive(node)) {
              output.text.push(textContent);
            }
            else {
              output.text.push(trimmedTextContent);
              textContentLength = trimmedTextContent.length;
            }
            output.currentLineWidth += textContentLength;
          }
          else {
            // this text node is going into a normal element and html can be escaped
            if (opts.prettyHtml && !isWithinWhitespaceSensitiveNode) {
              // pretty print the text node
              output.text.push(escapeString(textContent.replace(/\s\s+/g, ' ').trim(), false));
              output.currentLineWidth += textContentLength;
            }
            else {
              // not pretty printing the text node
              if (isWithinWhitespaceSensitive(node)) {
                output.currentLineWidth += textContentLength;
              }
              else {
                // this element is not a whitespace sensitive one, like <pre> or <code> so
                // any whitespace at the start and end can be cleaned up to just be one space
                if (/\s/.test(textContent.charAt(0))) {
                  textContent = ' ' + textContent.trimLeft();
                }
                textContentLength = textContent.length;
                if (textContentLength > 1) {
                  if (/\s/.test(textContent.charAt(textContentLength - 1))) {
                    if (opts.approximateLineWidth > 0 &&
                      output.currentLineWidth + textContentLength > opts.approximateLineWidth) {
                      textContent = textContent.trimRight() + '\n';
                      output.currentLineWidth = 0;
                    }
                    else {
                      textContent = textContent.trimRight() + ' ';
                    }
                  }
                }
                output.currentLineWidth += textContentLength;
              }
              output.text.push(escapeString(textContent, false));
            }
          }
        }
      }
    }
  }
  else if (node.nodeType === 8 /* NODE_TYPES.COMMENT_NODE */) {
    const nodeValue = node.nodeValue;
    if (opts.removeHtmlComments) {
      const isHydrateAnnotation = nodeValue.startsWith(CONTENT_REF_ID + '.') ||
        nodeValue.startsWith(ORG_LOCATION_ID + '.') ||
        nodeValue.startsWith(SLOT_NODE_ID + '.') ||
        nodeValue.startsWith(TEXT_NODE_ID + '.');
      if (!isHydrateAnnotation) {
        return;
      }
    }
    const isWithinWhitespaceSensitiveNode = opts.newLines || opts.indentSpaces > 0 ? isWithinWhitespaceSensitive(node) : false;
    if (opts.newLines && !isWithinWhitespaceSensitiveNode) {
      output.text.push('\n');
      output.currentLineWidth = 0;
    }
    if (opts.indentSpaces > 0 && !isWithinWhitespaceSensitiveNode) {
      for (let i = 0; i < output.indent; i++) {
        output.text.push(' ');
      }
      output.currentLineWidth += output.indent;
    }
    output.text.push('<!--' + nodeValue + '-->');
    output.currentLineWidth += nodeValue.length + 7;
  }
  else if (node.nodeType === 10 /* NODE_TYPES.DOCUMENT_TYPE_NODE */) {
    output.text.push('<!doctype html>');
  }
}
const AMP_REGEX = /&/g;
const NBSP_REGEX = /\u00a0/g;
const DOUBLE_QUOTE_REGEX = /"/g;
const LT_REGEX = /</g;
const GT_REGEX = />/g;
const CAN_REMOVE_ATTR_QUOTES = /^[^ \t\n\f\r"'`=<>\/\\-]+$/;
function getTagName(element) {
  if (element.namespaceURI === 'http://www.w3.org/1999/xhtml') {
    return element.nodeName.toLowerCase();
  }
  else {
    return element.nodeName;
  }
}
function escapeString(str, attrMode) {
  str = str.replace(AMP_REGEX, '&amp;').replace(NBSP_REGEX, '&nbsp;');
  if (attrMode) {
    return str.replace(DOUBLE_QUOTE_REGEX, '&quot;');
  }
  return str.replace(LT_REGEX, '&lt;').replace(GT_REGEX, '&gt;');
}
function isWithinWhitespaceSensitive(node) {
  while (node != null) {
    if (WHITESPACE_SENSITIVE.has(node.nodeName)) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}
/*@__PURE__*/ const NON_ESCAPABLE_CONTENT = new Set([
  'STYLE',
  'SCRIPT',
  'IFRAME',
  'NOSCRIPT',
  'XMP',
  'NOEMBED',
  'NOFRAMES',
  'PLAINTEXT',
]);
/*@__PURE__*/ const WHITESPACE_SENSITIVE = new Set([
  'CODE',
  'OUTPUT',
  'PLAINTEXT',
  'PRE',
  'SCRIPT',
  'TEMPLATE',
  'TEXTAREA',
]);
/*@__PURE__*/ const EMPTY_ELEMENTS = new Set([
  'area',
  'base',
  'basefont',
  'bgsound',
  'br',
  'col',
  'embed',
  'frame',
  'hr',
  'img',
  'input',
  'keygen',
  'link',
  'meta',
  'param',
  'source',
  'trace',
  'wbr',
]);
/*@__PURE__*/ const REMOVE_EMPTY_ATTR = new Set(['class', 'dir', 'id', 'lang', 'name', 'title']);
/*@__PURE__*/ const BOOLEAN_ATTR = new Set([
  'allowfullscreen',
  'async',
  'autofocus',
  'autoplay',
  'checked',
  'compact',
  'controls',
  'declare',
  'default',
  'defaultchecked',
  'defaultmuted',
  'defaultselected',
  'defer',
  'disabled',
  'enabled',
  'formnovalidate',
  'hidden',
  'indeterminate',
  'inert',
  'ismap',
  'itemscope',
  'loop',
  'multiple',
  'muted',
  'nohref',
  'nomodule',
  'noresize',
  'noshade',
  'novalidate',
  'nowrap',
  'open',
  'pauseonexit',
  'readonly',
  'required',
  'reversed',
  'scoped',
  'seamless',
  'selected',
  'sortable',
  'truespeed',
  'typemustmatch',
  'visible',
]);
/*@__PURE__*/ const STRUCTURE_ELEMENTS = new Set([
  'html',
  'body',
  'head',
  'iframe',
  'meta',
  'link',
  'base',
  'title',
  'script',
  'style',
]);

class MockNode {
  constructor(ownerDocument, nodeType, nodeName, nodeValue) {
    this.ownerDocument = ownerDocument;
    this.nodeType = nodeType;
    this.nodeName = nodeName;
    this._nodeValue = nodeValue;
    this.parentNode = null;
    this.childNodes = [];
  }
  appendChild(newNode) {
    if (newNode.nodeType === 11 /* NODE_TYPES.DOCUMENT_FRAGMENT_NODE */) {
      const nodes = newNode.childNodes.slice();
      for (const child of nodes) {
        this.appendChild(child);
      }
    }
    else {
      newNode.remove();
      newNode.parentNode = this;
      this.childNodes.push(newNode);
      connectNode(this.ownerDocument, newNode);
    }
    return newNode;
  }
  append(...items) {
    items.forEach((item) => {
      const isNode = typeof item === 'object' && item !== null && 'nodeType' in item;
      this.appendChild(isNode ? item : this.ownerDocument.createTextNode(String(item)));
    });
  }
  prepend(...items) {
    const firstChild = this.firstChild;
    items.forEach((item) => {
      const isNode = typeof item === 'object' && item !== null && 'nodeType' in item;
      if (firstChild) {
        this.insertBefore(isNode ? item : this.ownerDocument.createTextNode(String(item)), firstChild);
      }
    });
  }
  cloneNode(deep) {
    throw new Error(`invalid node type to clone: ${this.nodeType}, deep: ${deep}`);
  }
  compareDocumentPosition(_other) {
    // unimplemented
    // https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition
    return -1;
  }
  get firstChild() {
    return this.childNodes[0] || null;
  }
  insertBefore(newNode, referenceNode) {
    if (newNode.nodeType === 11 /* NODE_TYPES.DOCUMENT_FRAGMENT_NODE */) {
      for (let i = 0, ii = newNode.childNodes.length; i < ii; i++) {
        insertBefore(this, newNode.childNodes[i], referenceNode);
      }
    }
    else {
      insertBefore(this, newNode, referenceNode);
    }
    return newNode;
  }
  get isConnected() {
    let node = this;
    while (node != null) {
      if (node.nodeType === 9 /* NODE_TYPES.DOCUMENT_NODE */) {
        return true;
      }
      node = node.parentNode;
      if (node != null && node.nodeType === 11 /* NODE_TYPES.DOCUMENT_FRAGMENT_NODE */) {
        node = node.host;
      }
    }
    return false;
  }
  isSameNode(node) {
    return this === node;
  }
  get lastChild() {
    return this.childNodes[this.childNodes.length - 1] || null;
  }
  get nextSibling() {
    if (this.parentNode != null) {
      const index = this.parentNode.childNodes.indexOf(this) + 1;
      return this.parentNode.childNodes[index] || null;
    }
    return null;
  }
  get nodeValue() {
    var _a;
    return (_a = this._nodeValue) !== null && _a !== void 0 ? _a : '';
  }
  set nodeValue(value) {
    this._nodeValue = value;
  }
  get parentElement() {
    return this.parentNode || null;
  }
  set parentElement(value) {
    this.parentNode = value;
  }
  get previousSibling() {
    if (this.parentNode != null) {
      const index = this.parentNode.childNodes.indexOf(this) - 1;
      return this.parentNode.childNodes[index] || null;
    }
    return null;
  }
  contains(otherNode) {
    if (otherNode === this) {
      return true;
    }
    const childNodes = Array.from(this.childNodes);
    if (childNodes.includes(otherNode)) {
      return true;
    }
    return childNodes.some((node) => this.contains.bind(node)(otherNode));
  }
  removeChild(childNode) {
    const index = this.childNodes.indexOf(childNode);
    if (index > -1) {
      this.childNodes.splice(index, 1);
      if (this.nodeType === 1 /* NODE_TYPES.ELEMENT_NODE */) {
        const wasConnected = this.isConnected;
        childNode.parentNode = null;
        if (wasConnected === true) {
          disconnectNode(childNode);
        }
      }
      else {
        childNode.parentNode = null;
      }
    }
    else {
      throw new Error(`node not found within childNodes during removeChild`);
    }
    return childNode;
  }
  remove() {
    if (this.parentNode != null) {
      this.parentNode.removeChild(this);
    }
  }
  replaceChild(newChild, oldChild) {
    if (oldChild.parentNode === this) {
      this.insertBefore(newChild, oldChild);
      oldChild.remove();
      return newChild;
    }
    return null;
  }
  get textContent() {
    var _a;
    return (_a = this._nodeValue) !== null && _a !== void 0 ? _a : '';
  }
  set textContent(value) {
    this._nodeValue = String(value);
  }
}
MockNode.ELEMENT_NODE = 1;
MockNode.TEXT_NODE = 3;
MockNode.PROCESSING_INSTRUCTION_NODE = 7;
MockNode.COMMENT_NODE = 8;
MockNode.DOCUMENT_NODE = 9;
MockNode.DOCUMENT_TYPE_NODE = 10;
MockNode.DOCUMENT_FRAGMENT_NODE = 11;
class MockNodeList {
  constructor(ownerDocument, childNodes, length) {
    this.ownerDocument = ownerDocument;
    this.childNodes = childNodes;
    this.length = length;
  }
}
class MockElement extends MockNode {
  constructor(ownerDocument, nodeName) {
    super(ownerDocument, 1 /* NODE_TYPES.ELEMENT_NODE */, typeof nodeName === 'string' ? nodeName : null, null);
    this.namespaceURI = null;
    this.__shadowRoot = null;
    this.__attributeMap = null;
  }
  addEventListener(type, handler) {
    addEventListener(this, type, handler);
  }
  attachShadow(_opts) {
    const shadowRoot = this.ownerDocument.createDocumentFragment();
    this.shadowRoot = shadowRoot;
    return shadowRoot;
  }
  blur() {
    dispatchEvent(this, new MockFocusEvent('blur', { relatedTarget: null, bubbles: true, cancelable: true, composed: true }));
  }
  get shadowRoot() {
    return this.__shadowRoot || null;
  }
  set shadowRoot(shadowRoot) {
    if (shadowRoot != null) {
      shadowRoot.host = this;
      this.__shadowRoot = shadowRoot;
    }
    else {
      delete this.__shadowRoot;
    }
  }
  get attributes() {
    if (this.__attributeMap == null) {
      const attrMap = createAttributeProxy(false);
      this.__attributeMap = attrMap;
      return attrMap;
    }
    return this.__attributeMap;
  }
  set attributes(attrs) {
    this.__attributeMap = attrs;
  }
  get children() {
    return this.childNodes.filter((n) => n.nodeType === 1 /* NODE_TYPES.ELEMENT_NODE */);
  }
  get childElementCount() {
    return this.childNodes.filter((n) => n.nodeType === 1 /* NODE_TYPES.ELEMENT_NODE */).length;
  }
  get className() {
    return this.getAttributeNS(null, 'class') || '';
  }
  set className(value) {
    this.setAttributeNS(null, 'class', value);
  }
  get classList() {
    return new MockClassList(this);
  }
  click() {
    dispatchEvent(this, new MockEvent('click', { bubbles: true, cancelable: true, composed: true }));
  }
  cloneNode(_deep) {
    // implemented on MockElement.prototype from within element.ts
    // @ts-ignore - implemented on MockElement.prototype from within element.ts
    return null;
  }
  closest(selector) {
    let elm = this;
    while (elm != null) {
      if (elm.matches(selector)) {
        return elm;
      }
      elm = elm.parentNode;
    }
    return null;
  }
  get dataset() {
    return dataset(this);
  }
  get dir() {
    return this.getAttributeNS(null, 'dir') || '';
  }
  set dir(value) {
    this.setAttributeNS(null, 'dir', value);
  }
  dispatchEvent(ev) {
    return dispatchEvent(this, ev);
  }
  get firstElementChild() {
    return this.children[0] || null;
  }
  focus(_options) {
    dispatchEvent(this, new MockFocusEvent('focus', { relatedTarget: null, bubbles: true, cancelable: true, composed: true }));
  }
  getAttribute(attrName) {
    if (attrName === 'style') {
      if (this.__style != null && this.__style.length > 0) {
        return this.style.cssText;
      }
      return null;
    }
    const attr = this.attributes.getNamedItem(attrName);
    if (attr != null) {
      return attr.value;
    }
    return null;
  }
  getAttributeNS(namespaceURI, attrName) {
    const attr = this.attributes.getNamedItemNS(namespaceURI, attrName);
    if (attr != null) {
      return attr.value;
    }
    return null;
  }
  getBoundingClientRect() {
    return { bottom: 0, height: 0, left: 0, right: 0, top: 0, width: 0, x: 0, y: 0 };
  }
  getRootNode(opts) {
    const isComposed = opts != null && opts.composed === true;
    let node = this;
    while (node.parentNode != null) {
      node = node.parentNode;
      if (isComposed === true && node.parentNode == null && node.host != null) {
        node = node.host;
      }
    }
    return node;
  }
  get draggable() {
    return this.getAttributeNS(null, 'draggable') === 'true';
  }
  set draggable(value) {
    this.setAttributeNS(null, 'draggable', value);
  }
  hasChildNodes() {
    return this.childNodes.length > 0;
  }
  get id() {
    return this.getAttributeNS(null, 'id') || '';
  }
  set id(value) {
    this.setAttributeNS(null, 'id', value);
  }
  get innerHTML() {
    if (this.childNodes.length === 0) {
      return '';
    }
    return serializeNodeToHtml(this, {
      newLines: false,
      indentSpaces: 0,
    });
  }
  set innerHTML(html) {
    var _a;
    if (NON_ESCAPABLE_CONTENT.has((_a = this.nodeName) !== null && _a !== void 0 ? _a : '') === true) {
      setTextContent(this, html);
    }
    else {
      for (let i = this.childNodes.length - 1; i >= 0; i--) {
        this.removeChild(this.childNodes[i]);
      }
      if (typeof html === 'string') {
        const frag = parseFragmentUtil(this.ownerDocument, html);
        while (frag.childNodes.length > 0) {
          this.appendChild(frag.childNodes[0]);
        }
      }
    }
  }
  get innerText() {
    const text = [];
    getTextContent(this.childNodes, text);
    return text.join('');
  }
  set innerText(value) {
    setTextContent(this, value);
  }
  insertAdjacentElement(position, elm) {
    if (position === 'beforebegin') {
      insertBefore(this.parentNode, elm, this);
    }
    else if (position === 'afterbegin') {
      this.prepend(elm);
    }
    else if (position === 'beforeend') {
      this.appendChild(elm);
    }
    else if (position === 'afterend') {
      insertBefore(this.parentNode, elm, this.nextSibling);
    }
    return elm;
  }
  insertAdjacentHTML(position, html) {
    const frag = parseFragmentUtil(this.ownerDocument, html);
    if (position === 'beforebegin') {
      while (frag.childNodes.length > 0) {
        insertBefore(this.parentNode, frag.childNodes[0], this);
      }
    }
    else if (position === 'afterbegin') {
      while (frag.childNodes.length > 0) {
        this.prepend(frag.childNodes[frag.childNodes.length - 1]);
      }
    }
    else if (position === 'beforeend') {
      while (frag.childNodes.length > 0) {
        this.appendChild(frag.childNodes[0]);
      }
    }
    else if (position === 'afterend') {
      while (frag.childNodes.length > 0) {
        insertBefore(this.parentNode, frag.childNodes[frag.childNodes.length - 1], this.nextSibling);
      }
    }
  }
  insertAdjacentText(position, text) {
    const elm = this.ownerDocument.createTextNode(text);
    if (position === 'beforebegin') {
      insertBefore(this.parentNode, elm, this);
    }
    else if (position === 'afterbegin') {
      this.prepend(elm);
    }
    else if (position === 'beforeend') {
      this.appendChild(elm);
    }
    else if (position === 'afterend') {
      insertBefore(this.parentNode, elm, this.nextSibling);
    }
  }
  hasAttribute(attrName) {
    if (attrName === 'style') {
      return this.__style != null && this.__style.length > 0;
    }
    return this.getAttribute(attrName) !== null;
  }
  hasAttributeNS(namespaceURI, name) {
    return this.getAttributeNS(namespaceURI, name) !== null;
  }
  get hidden() {
    return this.hasAttributeNS(null, 'hidden');
  }
  set hidden(isHidden) {
    if (isHidden === true) {
      this.setAttributeNS(null, 'hidden', '');
    }
    else {
      this.removeAttributeNS(null, 'hidden');
    }
  }
  get lang() {
    return this.getAttributeNS(null, 'lang') || '';
  }
  set lang(value) {
    this.setAttributeNS(null, 'lang', value);
  }
  get lastElementChild() {
    const children = this.children;
    return children[children.length - 1] || null;
  }
  matches(selector) {
    return matches(selector, this);
  }
  get nextElementSibling() {
    const parentElement = this.parentElement;
    if (parentElement != null &&
      (parentElement.nodeType === 1 /* NODE_TYPES.ELEMENT_NODE */ ||
        parentElement.nodeType === 11 /* NODE_TYPES.DOCUMENT_FRAGMENT_NODE */ ||
        parentElement.nodeType === 9 /* NODE_TYPES.DOCUMENT_NODE */)) {
      const children = parentElement.children;
      const index = children.indexOf(this) + 1;
      return parentElement.children[index] || null;
    }
    return null;
  }
  get outerHTML() {
    return serializeNodeToHtml(this, {
      newLines: false,
      outerHtml: true,
      indentSpaces: 0,
    });
  }
  get previousElementSibling() {
    const parentElement = this.parentElement;
    if (parentElement != null &&
      (parentElement.nodeType === 1 /* NODE_TYPES.ELEMENT_NODE */ ||
        parentElement.nodeType === 11 /* NODE_TYPES.DOCUMENT_FRAGMENT_NODE */ ||
        parentElement.nodeType === 9 /* NODE_TYPES.DOCUMENT_NODE */)) {
      const children = parentElement.children;
      const index = children.indexOf(this) - 1;
      return parentElement.children[index] || null;
    }
    return null;
  }
  getElementsByClassName(classNames) {
    const classes = classNames
      .trim()
      .split(' ')
      .filter((c) => c.length > 0);
    const results = [];
    getElementsByClassName(this, classes, results);
    return results;
  }
  getElementsByTagName(tagName) {
    const results = [];
    getElementsByTagName(this, tagName.toLowerCase(), results);
    return results;
  }
  querySelector(selector) {
    return selectOne(selector, this);
  }
  querySelectorAll(selector) {
    return selectAll(selector, this);
  }
  removeAttribute(attrName) {
    if (attrName === 'style') {
      delete this.__style;
    }
    else {
      const attr = this.attributes.getNamedItem(attrName);
      if (attr != null) {
        this.attributes.removeNamedItemNS(attr);
        if (checkAttributeChanged(this) === true) {
          attributeChanged(this, attrName, attr.value, null);
        }
      }
    }
  }
  removeAttributeNS(namespaceURI, attrName) {
    const attr = this.attributes.getNamedItemNS(namespaceURI, attrName);
    if (attr != null) {
      this.attributes.removeNamedItemNS(attr);
      if (checkAttributeChanged(this) === true) {
        attributeChanged(this, attrName, attr.value, null);
      }
    }
  }
  removeEventListener(type, handler) {
    removeEventListener(this, type, handler);
  }
  setAttribute(attrName, value) {
    if (attrName === 'style') {
      this.style = value;
    }
    else {
      const attributes = this.attributes;
      let attr = attributes.getNamedItem(attrName);
      const checkAttrChanged = checkAttributeChanged(this);
      if (attr != null) {
        if (checkAttrChanged === true) {
          const oldValue = attr.value;
          attr.value = value;
          if (oldValue !== attr.value) {
            attributeChanged(this, attr.name, oldValue, attr.value);
          }
        }
        else {
          attr.value = value;
        }
      }
      else {
        if (attributes.caseInsensitive) {
          attrName = attrName.toLowerCase();
        }
        attr = new MockAttr(attrName, value);
        attributes.__items.push(attr);
        if (checkAttrChanged === true) {
          attributeChanged(this, attrName, null, attr.value);
        }
      }
    }
  }
  setAttributeNS(namespaceURI, attrName, value) {
    const attributes = this.attributes;
    let attr = attributes.getNamedItemNS(namespaceURI, attrName);
    const checkAttrChanged = checkAttributeChanged(this);
    if (attr != null) {
      if (checkAttrChanged === true) {
        const oldValue = attr.value;
        attr.value = value;
        if (oldValue !== attr.value) {
          attributeChanged(this, attr.name, oldValue, attr.value);
        }
      }
      else {
        attr.value = value;
      }
    }
    else {
      attr = new MockAttr(attrName, value, namespaceURI);
      attributes.__items.push(attr);
      if (checkAttrChanged === true) {
        attributeChanged(this, attrName, null, attr.value);
      }
    }
  }
  get style() {
    if (this.__style == null) {
      this.__style = createCSSStyleDeclaration();
    }
    return this.__style;
  }
  set style(val) {
    if (typeof val === 'string') {
      if (this.__style == null) {
        this.__style = createCSSStyleDeclaration();
      }
      this.__style.cssText = val;
    }
    else {
      this.__style = val;
    }
  }
  get tabIndex() {
    return parseInt(this.getAttributeNS(null, 'tabindex') || '-1', 10);
  }
  set tabIndex(value) {
    this.setAttributeNS(null, 'tabindex', value);
  }
  get tagName() {
    var _a;
    return (_a = this.nodeName) !== null && _a !== void 0 ? _a : '';
  }
  set tagName(value) {
    this.nodeName = value;
  }
  get textContent() {
    const text = [];
    getTextContent(this.childNodes, text);
    return text.join('');
  }
  set textContent(value) {
    setTextContent(this, value);
  }
  get title() {
    return this.getAttributeNS(null, 'title') || '';
  }
  set title(value) {
    this.setAttributeNS(null, 'title', value);
  }
  animate() {
    /**/
  }
  onanimationstart() {
    /**/
  }
  onanimationend() {
    /**/
  }
  onanimationiteration() {
    /**/
  }
  onabort() {
    /**/
  }
  onauxclick() {
    /**/
  }
  onbeforecopy() {
    /**/
  }
  onbeforecut() {
    /**/
  }
  onbeforepaste() {
    /**/
  }
  onblur() {
    /**/
  }
  oncancel() {
    /**/
  }
  oncanplay() {
    /**/
  }
  oncanplaythrough() {
    /**/
  }
  onchange() {
    /**/
  }
  onclick() {
    /**/
  }
  onclose() {
    /**/
  }
  oncontextmenu() {
    /**/
  }
  oncopy() {
    /**/
  }
  oncuechange() {
    /**/
  }
  oncut() {
    /**/
  }
  ondblclick() {
    /**/
  }
  ondrag() {
    /**/
  }
  ondragend() {
    /**/
  }
  ondragenter() {
    /**/
  }
  ondragleave() {
    /**/
  }
  ondragover() {
    /**/
  }
  ondragstart() {
    /**/
  }
  ondrop() {
    /**/
  }
  ondurationchange() {
    /**/
  }
  onemptied() {
    /**/
  }
  onended() {
    /**/
  }
  onerror() {
    /**/
  }
  onfocus() {
    /**/
  }
  onfocusin() {
    /**/
  }
  onfocusout() {
    /**/
  }
  onformdata() {
    /**/
  }
  onfullscreenchange() {
    /**/
  }
  onfullscreenerror() {
    /**/
  }
  ongotpointercapture() {
    /**/
  }
  oninput() {
    /**/
  }
  oninvalid() {
    /**/
  }
  onkeydown() {
    /**/
  }
  onkeypress() {
    /**/
  }
  onkeyup() {
    /**/
  }
  onload() {
    /**/
  }
  onloadeddata() {
    /**/
  }
  onloadedmetadata() {
    /**/
  }
  onloadstart() {
    /**/
  }
  onlostpointercapture() {
    /**/
  }
  onmousedown() {
    /**/
  }
  onmouseenter() {
    /**/
  }
  onmouseleave() {
    /**/
  }
  onmousemove() {
    /**/
  }
  onmouseout() {
    /**/
  }
  onmouseover() {
    /**/
  }
  onmouseup() {
    /**/
  }
  onmousewheel() {
    /**/
  }
  onpaste() {
    /**/
  }
  onpause() {
    /**/
  }
  onplay() {
    /**/
  }
  onplaying() {
    /**/
  }
  onpointercancel() {
    /**/
  }
  onpointerdown() {
    /**/
  }
  onpointerenter() {
    /**/
  }
  onpointerleave() {
    /**/
  }
  onpointermove() {
    /**/
  }
  onpointerout() {
    /**/
  }
  onpointerover() {
    /**/
  }
  onpointerup() {
    /**/
  }
  onprogress() {
    /**/
  }
  onratechange() {
    /**/
  }
  onreset() {
    /**/
  }
  onresize() {
    /**/
  }
  onscroll() {
    /**/
  }
  onsearch() {
    /**/
  }
  onseeked() {
    /**/
  }
  onseeking() {
    /**/
  }
  onselect() {
    /**/
  }
  onselectstart() {
    /**/
  }
  onstalled() {
    /**/
  }
  onsubmit() {
    /**/
  }
  onsuspend() {
    /**/
  }
  ontimeupdate() {
    /**/
  }
  ontoggle() {
    /**/
  }
  onvolumechange() {
    /**/
  }
  onwaiting() {
    /**/
  }
  onwebkitfullscreenchange() {
    /**/
  }
  onwebkitfullscreenerror() {
    /**/
  }
  onwheel() {
    /**/
  }
  requestFullscreen() {
    /**/
  }
  scrollBy() {
    /**/
  }
  scrollTo() {
    /**/
  }
  scrollIntoView() {
    /**/
  }
  toString(opts) {
    return serializeNodeToHtml(this, opts);
  }
}
function getElementsByClassName(elm, classNames, foundElms) {
  const children = elm.children;
  for (let i = 0, ii = children.length; i < ii; i++) {
    const childElm = children[i];
    for (let j = 0, jj = classNames.length; j < jj; j++) {
      if (childElm.classList.contains(classNames[j])) {
        foundElms.push(childElm);
      }
    }
    getElementsByClassName(childElm, classNames, foundElms);
  }
}
function getElementsByTagName(elm, tagName, foundElms) {
  var _a;
  const children = elm.children;
  for (let i = 0, ii = children.length; i < ii; i++) {
    const childElm = children[i];
    if (tagName === '*' || ((_a = childElm.nodeName) !== null && _a !== void 0 ? _a : '').toLowerCase() === tagName) {
      foundElms.push(childElm);
    }
    getElementsByTagName(childElm, tagName, foundElms);
  }
}
function resetElement(elm) {
  resetEventListeners(elm);
  delete elm.__attributeMap;
  delete elm.__shadowRoot;
  delete elm.__style;
}
function insertBefore(parentNode, newNode, referenceNode) {
  if (newNode !== referenceNode) {
    newNode.remove();
    newNode.parentNode = parentNode;
    newNode.ownerDocument = parentNode.ownerDocument;
    if (referenceNode != null) {
      const index = parentNode.childNodes.indexOf(referenceNode);
      if (index > -1) {
        parentNode.childNodes.splice(index, 0, newNode);
      }
      else {
        throw new Error(`referenceNode not found in parentNode.childNodes`);
      }
    }
    else {
      parentNode.childNodes.push(newNode);
    }
    connectNode(parentNode.ownerDocument, newNode);
  }
  return newNode;
}
class MockHTMLElement extends MockElement {
  constructor(ownerDocument, nodeName) {
    super(ownerDocument, typeof nodeName === 'string' ? nodeName.toUpperCase() : null);
    this.namespaceURI = 'http://www.w3.org/1999/xhtml';
  }
  get tagName() {
    var _a;
    return (_a = this.nodeName) !== null && _a !== void 0 ? _a : '';
  }
  set tagName(value) {
    this.nodeName = value;
  }
  get attributes() {
    if (this.__attributeMap == null) {
      const attrMap = createAttributeProxy(true);
      this.__attributeMap = attrMap;
      return attrMap;
    }
    return this.__attributeMap;
  }
  set attributes(attrs) {
    this.__attributeMap = attrs;
  }
}
class MockTextNode extends MockNode {
  constructor(ownerDocument, text) {
    super(ownerDocument, 3 /* NODE_TYPES.TEXT_NODE */, "#text" /* NODE_NAMES.TEXT_NODE */, text);
  }
  cloneNode(_deep) {
    return new MockTextNode(null, this.nodeValue);
  }
  get textContent() {
    return this.nodeValue;
  }
  set textContent(text) {
    this.nodeValue = text;
  }
  get data() {
    return this.nodeValue;
  }
  set data(text) {
    this.nodeValue = text;
  }
  get wholeText() {
    if (this.parentNode != null) {
      const text = [];
      for (let i = 0, ii = this.parentNode.childNodes.length; i < ii; i++) {
        const childNode = this.parentNode.childNodes[i];
        if (childNode.nodeType === 3 /* NODE_TYPES.TEXT_NODE */) {
          text.push(childNode.nodeValue);
        }
      }
      return text.join('');
    }
    return this.nodeValue;
  }
}
function getTextContent(childNodes, text) {
  for (let i = 0, ii = childNodes.length; i < ii; i++) {
    const childNode = childNodes[i];
    if (childNode.nodeType === 3 /* NODE_TYPES.TEXT_NODE */) {
      text.push(childNode.nodeValue);
    }
    else if (childNode.nodeType === 1 /* NODE_TYPES.ELEMENT_NODE */) {
      getTextContent(childNode.childNodes, text);
    }
  }
}
function setTextContent(elm, text) {
  for (let i = elm.childNodes.length - 1; i >= 0; i--) {
    elm.removeChild(elm.childNodes[i]);
  }
  const textNode = new MockTextNode(elm.ownerDocument, text);
  elm.appendChild(textNode);
}

class MockComment extends MockNode {
  constructor(ownerDocument, data) {
    super(ownerDocument, 8 /* NODE_TYPES.COMMENT_NODE */, "#comment" /* NODE_NAMES.COMMENT_NODE */, data);
  }
  cloneNode(_deep) {
    return new MockComment(null, this.nodeValue);
  }
  get textContent() {
    return this.nodeValue;
  }
  set textContent(text) {
    this.nodeValue = text;
  }
}

class MockDocumentFragment extends MockHTMLElement {
  constructor(ownerDocument) {
    super(ownerDocument, null);
    this.nodeName = "#document-fragment" /* NODE_NAMES.DOCUMENT_FRAGMENT_NODE */;
    this.nodeType = 11 /* NODE_TYPES.DOCUMENT_FRAGMENT_NODE */;
  }
  getElementById(id) {
    return getElementById(this, id);
  }
  cloneNode(deep) {
    const cloned = new MockDocumentFragment(null);
    if (deep) {
      for (let i = 0, ii = this.childNodes.length; i < ii; i++) {
        const childNode = this.childNodes[i];
        if (childNode.nodeType === 1 /* NODE_TYPES.ELEMENT_NODE */ ||
          childNode.nodeType === 3 /* NODE_TYPES.TEXT_NODE */ ||
          childNode.nodeType === 8 /* NODE_TYPES.COMMENT_NODE */) {
          const clonedChildNode = this.childNodes[i].cloneNode(true);
          cloned.appendChild(clonedChildNode);
        }
      }
    }
    return cloned;
  }
}

class MockDocumentTypeNode extends MockHTMLElement {
  constructor(ownerDocument) {
    super(ownerDocument, '!DOCTYPE');
    this.nodeType = 10 /* NODE_TYPES.DOCUMENT_TYPE_NODE */;
    this.setAttribute('html', '');
  }
}

class MockCSSRule {
  constructor(parentStyleSheet) {
    this.parentStyleSheet = parentStyleSheet;
    this.cssText = '';
    this.type = 0;
  }
}
class MockCSSStyleSheet {
  constructor(ownerNode) {
    this.type = 'text/css';
    this.parentStyleSheet = null;
    this.cssRules = [];
    this.ownerNode = ownerNode;
  }
  get rules() {
    return this.cssRules;
  }
  set rules(rules) {
    this.cssRules = rules;
  }
  deleteRule(index) {
    if (index >= 0 && index < this.cssRules.length) {
      this.cssRules.splice(index, 1);
      updateStyleTextNode(this.ownerNode);
    }
  }
  insertRule(rule, index = 0) {
    if (typeof index !== 'number') {
      index = 0;
    }
    if (index < 0) {
      index = 0;
    }
    if (index > this.cssRules.length) {
      index = this.cssRules.length;
    }
    const cssRule = new MockCSSRule(this);
    cssRule.cssText = rule;
    this.cssRules.splice(index, 0, cssRule);
    updateStyleTextNode(this.ownerNode);
    return index;
  }
}
function getStyleElementText(styleElm) {
  const output = [];
  for (let i = 0; i < styleElm.childNodes.length; i++) {
    output.push(styleElm.childNodes[i].nodeValue);
  }
  return output.join('');
}
function setStyleElementText(styleElm, text) {
  // keeping the innerHTML and the sheet.cssRules connected
  // is not technically correct, but since we're doing
  // SSR we'll need to turn any assigned cssRules into
  // real text, not just properties that aren't rendered
  const sheet = styleElm.sheet;
  sheet.cssRules.length = 0;
  sheet.insertRule(text);
  updateStyleTextNode(styleElm);
}
function updateStyleTextNode(styleElm) {
  const childNodeLen = styleElm.childNodes.length;
  if (childNodeLen > 1) {
    for (let i = childNodeLen - 1; i >= 1; i--) {
      styleElm.removeChild(styleElm.childNodes[i]);
    }
  }
  else if (childNodeLen < 1) {
    styleElm.appendChild(styleElm.ownerDocument.createTextNode(''));
  }
  const textNode = styleElm.childNodes[0];
  textNode.nodeValue = styleElm.sheet.cssRules.map((r) => r.cssText).join('\n');
}

function createElement(ownerDocument, tagName) {
  if (typeof tagName !== 'string' || tagName === '' || !/^[a-z0-9-_:]+$/i.test(tagName)) {
    throw new Error(`The tag name provided (${tagName}) is not a valid name.`);
  }
  tagName = tagName.toLowerCase();
  switch (tagName) {
    case 'a':
      return new MockAnchorElement(ownerDocument);
    case 'base':
      return new MockBaseElement(ownerDocument);
    case 'button':
      return new MockButtonElement(ownerDocument);
    case 'canvas':
      return new MockCanvasElement(ownerDocument);
    case 'form':
      return new MockFormElement(ownerDocument);
    case 'img':
      return new MockImageElement(ownerDocument);
    case 'input':
      return new MockInputElement(ownerDocument);
    case 'link':
      return new MockLinkElement(ownerDocument);
    case 'meta':
      return new MockMetaElement(ownerDocument);
    case 'script':
      return new MockScriptElement(ownerDocument);
    case 'style':
      return new MockStyleElement(ownerDocument);
    case 'template':
      return new MockTemplateElement(ownerDocument);
    case 'title':
      return new MockTitleElement(ownerDocument);
  }
  if (ownerDocument != null && tagName.includes('-')) {
    const win = ownerDocument.defaultView;
    if (win != null && win.customElements != null) {
      return createCustomElement(win.customElements, ownerDocument, tagName);
    }
  }
  return new MockHTMLElement(ownerDocument, tagName);
}
function createElementNS(ownerDocument, namespaceURI, tagName) {
  if (namespaceURI === 'http://www.w3.org/1999/xhtml') {
    return createElement(ownerDocument, tagName);
  }
  else if (namespaceURI === 'http://www.w3.org/2000/svg') {
    switch (tagName.toLowerCase()) {
      case 'text':
      case 'tspan':
      case 'tref':
      case 'altglyph':
      case 'textpath':
        return new MockSVGTextContentElement(ownerDocument, tagName);
      case 'circle':
      case 'ellipse':
      case 'image':
      case 'line':
      case 'path':
      case 'polygon':
      case 'polyline':
      case 'rect':
      case 'use':
        return new MockSVGGraphicsElement(ownerDocument, tagName);
      case 'svg':
        return new MockSVGSVGElement(ownerDocument, tagName);
      default:
        return new MockSVGElement(ownerDocument, tagName);
    }
  }
  else {
    return new MockElement(ownerDocument, tagName);
  }
}
class MockAnchorElement extends MockHTMLElement {
  constructor(ownerDocument) {
    super(ownerDocument, 'a');
  }
  get href() {
    return fullUrl(this, 'href');
  }
  set href(value) {
    this.setAttribute('href', value);
  }
  get pathname() {
    return new URL(this.href).pathname;
  }
}
class MockButtonElement extends MockHTMLElement {
  constructor(ownerDocument) {
    super(ownerDocument, 'button');
  }
}
patchPropAttributes(MockButtonElement.prototype, {
  type: String,
}, {
  type: 'submit',
});
class MockImageElement extends MockHTMLElement {
  constructor(ownerDocument) {
    super(ownerDocument, 'img');
  }
  get draggable() {
    return this.getAttributeNS(null, 'draggable') !== 'false';
  }
  set draggable(value) {
    this.setAttributeNS(null, 'draggable', value);
  }
  get src() {
    return fullUrl(this, 'src');
  }
  set src(value) {
    this.setAttribute('src', value);
  }
}
patchPropAttributes(MockImageElement.prototype, {
  height: Number,
  width: Number,
});
class MockInputElement extends MockHTMLElement {
  constructor(ownerDocument) {
    super(ownerDocument, 'input');
  }
  get list() {
    const listId = this.getAttribute('list');
    if (listId) {
      return this.ownerDocument.getElementById(listId);
    }
    return null;
  }
}
patchPropAttributes(MockInputElement.prototype, {
  accept: String,
  autocomplete: String,
  autofocus: Boolean,
  capture: String,
  checked: Boolean,
  disabled: Boolean,
  form: String,
  formaction: String,
  formenctype: String,
  formmethod: String,
  formnovalidate: String,
  formtarget: String,
  height: Number,
  inputmode: String,
  max: String,
  maxLength: Number,
  min: String,
  minLength: Number,
  multiple: Boolean,
  name: String,
  pattern: String,
  placeholder: String,
  required: Boolean,
  readOnly: Boolean,
  size: Number,
  spellCheck: Boolean,
  src: String,
  step: String,
  type: String,
  value: String,
  width: Number,
}, {
  type: 'text',
});
class MockFormElement extends MockHTMLElement {
  constructor(ownerDocument) {
    super(ownerDocument, 'form');
  }
}
patchPropAttributes(MockFormElement.prototype, {
  name: String,
});
class MockLinkElement extends MockHTMLElement {
  constructor(ownerDocument) {
    super(ownerDocument, 'link');
  }
  get href() {
    return fullUrl(this, 'href');
  }
  set href(value) {
    this.setAttribute('href', value);
  }
}
patchPropAttributes(MockLinkElement.prototype, {
  crossorigin: String,
  media: String,
  rel: String,
  type: String,
});
class MockMetaElement extends MockHTMLElement {
  constructor(ownerDocument) {
    super(ownerDocument, 'meta');
  }
}
patchPropAttributes(MockMetaElement.prototype, {
  charset: String,
  content: String,
  name: String,
});
class MockScriptElement extends MockHTMLElement {
  constructor(ownerDocument) {
    super(ownerDocument, 'script');
  }
  get src() {
    return fullUrl(this, 'src');
  }
  set src(value) {
    this.setAttribute('src', value);
  }
}
patchPropAttributes(MockScriptElement.prototype, {
  type: String,
});
class MockDOMMatrix {
  constructor() {
    this.a = 1;
    this.b = 0;
    this.c = 0;
    this.d = 1;
    this.e = 0;
    this.f = 0;
    this.m11 = 1;
    this.m12 = 0;
    this.m13 = 0;
    this.m14 = 0;
    this.m21 = 0;
    this.m22 = 1;
    this.m23 = 0;
    this.m24 = 0;
    this.m31 = 0;
    this.m32 = 0;
    this.m33 = 1;
    this.m34 = 0;
    this.m41 = 0;
    this.m42 = 0;
    this.m43 = 0;
    this.m44 = 1;
    this.is2D = true;
    this.isIdentity = true;
  }
  static fromMatrix() {
    return new MockDOMMatrix();
  }
  inverse() {
    return new MockDOMMatrix();
  }
  flipX() {
    return new MockDOMMatrix();
  }
  flipY() {
    return new MockDOMMatrix();
  }
  multiply() {
    return new MockDOMMatrix();
  }
  rotate() {
    return new MockDOMMatrix();
  }
  rotateAxisAngle() {
    return new MockDOMMatrix();
  }
  rotateFromVector() {
    return new MockDOMMatrix();
  }
  scale() {
    return new MockDOMMatrix();
  }
  scaleNonUniform() {
    return new MockDOMMatrix();
  }
  skewX() {
    return new MockDOMMatrix();
  }
  skewY() {
    return new MockDOMMatrix();
  }
  toJSON() { }
  toString() { }
  transformPoint() {
    return new MockDOMPoint();
  }
  translate() {
    return new MockDOMMatrix();
  }
}
class MockDOMPoint {
  constructor() {
    this.w = 1;
    this.x = 0;
    this.y = 0;
    this.z = 0;
  }
  toJSON() { }
  matrixTransform() {
    return new MockDOMMatrix();
  }
}
class MockSVGRect {
  constructor() {
    this.height = 10;
    this.width = 10;
    this.x = 0;
    this.y = 0;
  }
}
class MockStyleElement extends MockHTMLElement {
  constructor(ownerDocument) {
    super(ownerDocument, 'style');
    this.sheet = new MockCSSStyleSheet(this);
  }
  get innerHTML() {
    return getStyleElementText(this);
  }
  set innerHTML(value) {
    setStyleElementText(this, value);
  }
  get innerText() {
    return getStyleElementText(this);
  }
  set innerText(value) {
    setStyleElementText(this, value);
  }
  get textContent() {
    return getStyleElementText(this);
  }
  set textContent(value) {
    setStyleElementText(this, value);
  }
}
class MockSVGElement extends MockElement {
  // SVGElement properties and methods
  get ownerSVGElement() {
    return null;
  }
  get viewportElement() {
    return null;
  }
  onunload() {
    /**/
  }
  // SVGGeometryElement properties and methods
  get pathLength() {
    return 0;
  }
  isPointInFill(_pt) {
    return false;
  }
  isPointInStroke(_pt) {
    return false;
  }
  getTotalLength() {
    return 0;
  }
}
class MockSVGGraphicsElement extends MockSVGElement {
  getBBox(_options) {
    return new MockSVGRect();
  }
  getCTM() {
    return new MockDOMMatrix();
  }
  getScreenCTM() {
    return new MockDOMMatrix();
  }
}
class MockSVGSVGElement extends MockSVGGraphicsElement {
  createSVGPoint() {
    return new MockDOMPoint();
  }
}
class MockSVGTextContentElement extends MockSVGGraphicsElement {
  getComputedTextLength() {
    return 0;
  }
}
class MockBaseElement extends MockHTMLElement {
  constructor(ownerDocument) {
    super(ownerDocument, 'base');
  }
  get href() {
    return fullUrl(this, 'href');
  }
  set href(value) {
    this.setAttribute('href', value);
  }
}
class MockTemplateElement extends MockHTMLElement {
  constructor(ownerDocument) {
    super(ownerDocument, 'template');
    this.content = new MockDocumentFragment(ownerDocument);
  }
  get innerHTML() {
    return this.content.innerHTML;
  }
  set innerHTML(html) {
    this.content.innerHTML = html;
  }
  cloneNode(deep) {
    const cloned = new MockTemplateElement(null);
    cloned.attributes = cloneAttributes(this.attributes);
    const styleCssText = this.getAttribute('style');
    if (styleCssText != null && styleCssText.length > 0) {
      cloned.setAttribute('style', styleCssText);
    }
    cloned.content = this.content.cloneNode(deep);
    if (deep) {
      for (let i = 0, ii = this.childNodes.length; i < ii; i++) {
        const clonedChildNode = this.childNodes[i].cloneNode(true);
        cloned.appendChild(clonedChildNode);
      }
    }
    return cloned;
  }
}
class MockTitleElement extends MockHTMLElement {
  constructor(ownerDocument) {
    super(ownerDocument, 'title');
  }
  get text() {
    return this.textContent;
  }
  set text(value) {
    this.textContent = value;
  }
}
class MockCanvasElement extends MockHTMLElement {
  constructor(ownerDocument) {
    super(ownerDocument, 'canvas');
  }
  getContext() {
    return {
      fillRect() {
        return;
      },
      clearRect() { },
      getImageData: function (_, __, w, h) {
        return {
          data: new Array(w * h * 4),
        };
      },
      putImageData() { },
      createImageData: function () {
        return [];
      },
      setTransform() { },
      drawImage() { },
      save() { },
      fillText() { },
      restore() { },
      beginPath() { },
      moveTo() { },
      lineTo() { },
      closePath() { },
      stroke() { },
      translate() { },
      scale() { },
      rotate() { },
      arc() { },
      fill() { },
      measureText() {
        return { width: 0 };
      },
      transform() { },
      rect() { },
      clip() { },
    };
  }
}
function fullUrl(elm, attrName) {
  const val = elm.getAttribute(attrName) || '';
  if (elm.ownerDocument != null) {
    const win = elm.ownerDocument.defaultView;
    if (win != null) {
      const loc = win.location;
      if (loc != null) {
        try {
          const url = new URL(val, loc.href);
          return url.href;
        }
        catch (e) { }
      }
    }
  }
  return val.replace(/\'|\"/g, '').trim();
}
function patchPropAttributes(prototype, attrs, defaults = {}) {
  Object.keys(attrs).forEach((propName) => {
    const attr = attrs[propName];
    const defaultValue = defaults[propName];
    if (attr === Boolean) {
      Object.defineProperty(prototype, propName, {
        get() {
          return this.hasAttribute(propName);
        },
        set(value) {
          if (value) {
            this.setAttribute(propName, '');
          }
          else {
            this.removeAttribute(propName);
          }
        },
      });
    }
    else if (attr === Number) {
      Object.defineProperty(prototype, propName, {
        get() {
          const value = this.getAttribute(propName);
          return value ? parseInt(value, 10) : defaultValue === undefined ? 0 : defaultValue;
        },
        set(value) {
          this.setAttribute(propName, value);
        },
      });
    }
    else {
      Object.defineProperty(prototype, propName, {
        get() {
          return this.hasAttribute(propName) ? this.getAttribute(propName) : defaultValue || '';
        },
        set(value) {
          this.setAttribute(propName, value);
        },
      });
    }
  });
}
MockElement.prototype.cloneNode = function (deep) {
  // because we're creating elements, which extending specific HTML base classes there
  // is a MockElement circular reference that bundling has trouble dealing with so
  // the fix is to add cloneNode() to MockElement's prototype after the HTML classes
  const cloned = createElement(this.ownerDocument, this.nodeName);
  cloned.attributes = cloneAttributes(this.attributes);
  const styleCssText = this.getAttribute('style');
  if (styleCssText != null && styleCssText.length > 0) {
    cloned.setAttribute('style', styleCssText);
  }
  if (deep) {
    for (let i = 0, ii = this.childNodes.length; i < ii; i++) {
      const clonedChildNode = this.childNodes[i].cloneNode(true);
      cloned.appendChild(clonedChildNode);
    }
  }
  return cloned;
};

let sharedDocument;
function parseHtmlToDocument(html, ownerDocument = null) {
  if (ownerDocument == null) {
    if (sharedDocument == null) {
      sharedDocument = new MockDocument();
    }
    ownerDocument = sharedDocument;
  }
  return parseDocumentUtil(ownerDocument, html);
}
function parseHtmlToFragment(html, ownerDocument = null) {
  if (ownerDocument == null) {
    if (sharedDocument == null) {
      sharedDocument = new MockDocument();
    }
    ownerDocument = sharedDocument;
  }
  return parseFragmentUtil(ownerDocument, html);
}

const consoleNoop = () => {
  /**/
};
function createConsole() {
  return {
    debug: consoleNoop,
    error: consoleNoop,
    info: consoleNoop,
    log: consoleNoop,
    warn: consoleNoop,
    dir: consoleNoop,
    dirxml: consoleNoop,
    table: consoleNoop,
    trace: consoleNoop,
    group: consoleNoop,
    groupCollapsed: consoleNoop,
    groupEnd: consoleNoop,
    clear: consoleNoop,
    count: consoleNoop,
    countReset: consoleNoop,
    assert: consoleNoop,
    profile: consoleNoop,
    profileEnd: consoleNoop,
    time: consoleNoop,
    timeLog: consoleNoop,
    timeEnd: consoleNoop,
    timeStamp: consoleNoop,
    context: consoleNoop,
    memory: consoleNoop,
  };
}

class MockHeaders {
  constructor(init) {
    this._values = [];
    if (typeof init === 'object') {
      if (typeof init[Symbol.iterator] === 'function') {
        const kvs = [];
        for (const kv of init) {
          if (typeof kv[Symbol.iterator] === 'function') {
            kvs.push([...kv]);
          }
        }
        for (const kv of kvs) {
          this.append(kv[0], kv[1]);
        }
      }
      else {
        for (const key in init) {
          this.append(key, init[key]);
        }
      }
    }
  }
  append(key, value) {
    this._values.push([key, value + '']);
  }
  delete(key) {
    key = key.toLowerCase();
    for (let i = this._values.length - 1; i >= 0; i--) {
      if (this._values[i][0].toLowerCase() === key) {
        this._values.splice(i, 1);
      }
    }
  }
  entries() {
    const entries = [];
    for (const kv of this.keys()) {
      entries.push([kv, this.get(kv)]);
    }
    let index = -1;
    return {
      next() {
        index++;
        return {
          value: entries[index],
          done: !entries[index],
        };
      },
      [Symbol.iterator]() {
        return this;
      },
    };
  }
  forEach(cb) {
    for (const kv of this.entries()) {
      cb(kv[1], kv[0]);
    }
  }
  get(key) {
    const rtn = [];
    key = key.toLowerCase();
    for (const kv of this._values) {
      if (kv[0].toLowerCase() === key) {
        rtn.push(kv[1]);
      }
    }
    return rtn.length > 0 ? rtn.join(', ') : null;
  }
  has(key) {
    key = key.toLowerCase();
    for (const kv of this._values) {
      if (kv[0].toLowerCase() === key) {
        return true;
      }
    }
    return false;
  }
  keys() {
    const keys = [];
    for (const kv of this._values) {
      const key = kv[0].toLowerCase();
      if (!keys.includes(key)) {
        keys.push(key);
      }
    }
    let index = -1;
    return {
      next() {
        index++;
        return {
          value: keys[index],
          done: !keys[index],
        };
      },
      [Symbol.iterator]() {
        return this;
      },
    };
  }
  set(key, value) {
    for (const kv of this._values) {
      if (kv[0].toLowerCase() === key.toLowerCase()) {
        kv[1] = value + '';
        return;
      }
    }
    this.append(key, value);
  }
  values() {
    const values = this._values;
    let index = -1;
    return {
      next() {
        index++;
        const done = !values[index];
        return {
          value: done ? undefined : values[index][1],
          done,
        };
      },
      [Symbol.iterator]() {
        return this;
      },
    };
  }
  [Symbol.iterator]() {
    return this.entries();
  }
}

class MockDOMParser {
  parseFromString(htmlToParse, mimeType) {
    if (mimeType !== 'text/html') {
      console.error('XML parsing not implemented yet, continuing as html');
    }
    return parseHtmlToDocument(htmlToParse);
  }
}

class MockRequest {
  constructor(input, init = {}) {
    this._method = 'GET';
    this._url = '/';
    this.bodyUsed = false;
    this.cache = 'default';
    this.credentials = 'same-origin';
    this.integrity = '';
    this.keepalive = false;
    this.mode = 'cors';
    this.redirect = 'follow';
    this.referrer = 'about:client';
    this.referrerPolicy = '';
    if (typeof input === 'string') {
      this.url = input;
    }
    else if (input) {
      Object.assign(this, input);
      this.headers = new MockHeaders(input.headers);
    }
    Object.assign(this, init);
    if (init.headers) {
      this.headers = new MockHeaders(init.headers);
    }
    if (!this.headers) {
      this.headers = new MockHeaders();
    }
  }
  get url() {
    if (typeof this._url === 'string') {
      return new URL(this._url, location.href).href;
    }
    return new URL('/', location.href).href;
  }
  set url(value) {
    this._url = value;
  }
  get method() {
    if (typeof this._method === 'string') {
      return this._method.toUpperCase();
    }
    return 'GET';
  }
  set method(value) {
    this._method = value;
  }
  clone() {
    const clone = { ...this };
    clone.headers = new MockHeaders(this.headers);
    return new MockRequest(clone);
  }
}
class MockResponse {
  constructor(body, init = {}) {
    this.ok = true;
    this.status = 200;
    this.statusText = '';
    this.type = 'default';
    this.url = '';
    this._body = body;
    if (init) {
      Object.assign(this, init);
    }
    this.headers = new MockHeaders(init.headers);
  }
  async json() {
    return JSON.parse(this._body);
  }
  async text() {
    return this._body;
  }
  clone() {
    const initClone = { ...this };
    initClone.headers = new MockHeaders(this.headers);
    return new MockResponse(this._body, initClone);
  }
}

function setupGlobal(gbl) {
  if (gbl.window == null) {
    const win = (gbl.window = new MockWindow());
    WINDOW_FUNCTIONS.forEach((fnName) => {
      if (!(fnName in gbl)) {
        gbl[fnName] = win[fnName].bind(win);
      }
    });
    WINDOW_PROPS.forEach((propName) => {
      if (!(propName in gbl)) {
        Object.defineProperty(gbl, propName, {
          get() {
            return win[propName];
          },
          set(val) {
            win[propName] = val;
          },
          configurable: true,
          enumerable: true,
        });
      }
    });
    GLOBAL_CONSTRUCTORS.forEach(([cstrName]) => {
      gbl[cstrName] = win[cstrName];
    });
  }
  return gbl.window;
}
function teardownGlobal(gbl) {
  const win = gbl.window;
  if (win && typeof win.close === 'function') {
    win.close();
  }
}
function patchWindow(winToBePatched) {
  const mockWin = new MockWindow(false);
  WINDOW_FUNCTIONS.forEach((fnName) => {
    if (typeof winToBePatched[fnName] !== 'function') {
      winToBePatched[fnName] = mockWin[fnName].bind(mockWin);
    }
  });
  WINDOW_PROPS.forEach((propName) => {
    if (winToBePatched === undefined) {
      Object.defineProperty(winToBePatched, propName, {
        get() {
          return mockWin[propName];
        },
        set(val) {
          mockWin[propName] = val;
        },
        configurable: true,
        enumerable: true,
      });
    }
  });
}
function addGlobalsToWindowPrototype(mockWinPrototype) {
  GLOBAL_CONSTRUCTORS.forEach(([cstrName, Cstr]) => {
    Object.defineProperty(mockWinPrototype, cstrName, {
      get() {
        return this['__' + cstrName] || Cstr;
      },
      set(cstr) {
        this['__' + cstrName] = cstr;
      },
      configurable: true,
      enumerable: true,
    });
  });
}
const WINDOW_FUNCTIONS = [
  'addEventListener',
  'alert',
  'blur',
  'cancelAnimationFrame',
  'cancelIdleCallback',
  'clearInterval',
  'clearTimeout',
  'close',
  'confirm',
  'dispatchEvent',
  'focus',
  'getComputedStyle',
  'matchMedia',
  'open',
  'prompt',
  'removeEventListener',
  'requestAnimationFrame',
  'requestIdleCallback',
  'URL',
];
const WINDOW_PROPS = [
  'customElements',
  'devicePixelRatio',
  'document',
  'history',
  'innerHeight',
  'innerWidth',
  'localStorage',
  'location',
  'navigator',
  'pageXOffset',
  'pageYOffset',
  'performance',
  'screenLeft',
  'screenTop',
  'screenX',
  'screenY',
  'scrollX',
  'scrollY',
  'sessionStorage',
  'CSS',
  'CustomEvent',
  'Event',
  'Element',
  'HTMLElement',
  'Node',
  'NodeList',
  'FocusEvent',
  'KeyboardEvent',
  'MouseEvent',
];
const GLOBAL_CONSTRUCTORS = [
  ['CustomEvent', MockCustomEvent],
  ['Event', MockEvent],
  ['Headers', MockHeaders],
  ['FocusEvent', MockFocusEvent],
  ['KeyboardEvent', MockKeyboardEvent],
  ['MouseEvent', MockMouseEvent],
  ['Request', MockRequest],
  ['Response', MockResponse],
  ['DOMParser', MockDOMParser],
  ['HTMLAnchorElement', MockAnchorElement],
  ['HTMLBaseElement', MockBaseElement],
  ['HTMLButtonElement', MockButtonElement],
  ['HTMLCanvasElement', MockCanvasElement],
  ['HTMLFormElement', MockFormElement],
  ['HTMLImageElement', MockImageElement],
  ['HTMLInputElement', MockInputElement],
  ['HTMLLinkElement', MockLinkElement],
  ['HTMLMetaElement', MockMetaElement],
  ['HTMLScriptElement', MockScriptElement],
  ['HTMLStyleElement', MockStyleElement],
  ['HTMLTemplateElement', MockTemplateElement],
  ['HTMLTitleElement', MockTitleElement],
];

class MockHistory {
  constructor() {
    this.items = [];
  }
  get length() {
    return this.items.length;
  }
  back() {
    this.go(-1);
  }
  forward() {
    this.go(1);
  }
  go(_value) {
    //
  }
  pushState(_state, _title, _url) {
    //
  }
  replaceState(_state, _title, _url) {
    //
  }
}

class MockIntersectionObserver {
  constructor() {
    /**/
  }
  disconnect() {
    /**/
  }
  observe() {
    /**/
  }
  takeRecords() {
    return [];
  }
  unobserve() {
    /**/
  }
}

class MockLocation {
  constructor() {
    this.ancestorOrigins = null;
    this.protocol = '';
    this.host = '';
    this.hostname = '';
    this.port = '';
    this.pathname = '';
    this.search = '';
    this.hash = '';
    this.username = '';
    this.password = '';
    this.origin = '';
    this._href = '';
  }
  get href() {
    return this._href;
  }
  set href(value) {
    const url = new URL(value, 'http://mockdoc.stenciljs.com');
    this._href = url.href;
    this.protocol = url.protocol;
    this.host = url.host;
    this.hostname = url.hostname;
    this.port = url.port;
    this.pathname = url.pathname;
    this.search = url.search;
    this.hash = url.hash;
    this.username = url.username;
    this.password = url.password;
    this.origin = url.origin;
  }
  assign(_url) {
    //
  }
  reload(_forcedReload) {
    //
  }
  replace(_url) {
    //
  }
  toString() {
    return this.href;
  }
}

class MockNavigator {
  constructor() {
    this.appCodeName = 'MockNavigator';
    this.appName = 'MockNavigator';
    this.appVersion = 'MockNavigator';
    this.platform = 'MockNavigator';
    this.userAgent = 'MockNavigator';
  }
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/API/Performance
 */
class MockPerformance {
  constructor() {
    this.timeOrigin = Date.now();
    this.eventCounts = new Map();
  }
  addEventListener() {
    //
  }
  clearMarks() {
    //
  }
  clearMeasures() {
    //
  }
  clearResourceTimings() {
    //
  }
  dispatchEvent() {
    return true;
  }
  getEntries() {
    return [];
  }
  getEntriesByName() {
    return [];
  }
  getEntriesByType() {
    return [];
  }
  // Stencil's implementation of `mark` is non-compliant with the `Performance` interface. Because Stencil will
  // instantiate an instance of this class and may attempt to assign it to a variable of type `Performance`, the return
  // type must match the `Performance` interface (rather than typing this function as returning `void` and ignoring the
  // associated errors returned by the type checker)
  // @ts-ignore
  mark() {
    //
  }
  // Stencil's implementation of `measure` is non-compliant with the `Performance` interface. Because Stencil will
  // instantiate an instance of this class and may attempt to assign it to a variable of type `Performance`, the return
  // type must match the `Performance` interface (rather than typing this function as returning `void` and ignoring the
  // associated errors returned by the type checker)
  // @ts-ignore
  measure() {
    //
  }
  get navigation() {
    return {};
  }
  now() {
    return Date.now() - this.timeOrigin;
  }
  get onresourcetimingbufferfull() {
    return null;
  }
  removeEventListener() {
    //
  }
  setResourceTimingBufferSize() {
    //
  }
  get timing() {
    return {};
  }
  toJSON() {
    //
  }
}
function resetPerformance(perf) {
  if (perf != null) {
    try {
      perf.timeOrigin = Date.now();
    }
    catch (e) { }
  }
}

class MockStorage {
  constructor() {
    this.items = new Map();
  }
  key(_value) {
    //
  }
  getItem(key) {
    key = String(key);
    if (this.items.has(key)) {
      return this.items.get(key);
    }
    return null;
  }
  setItem(key, value) {
    if (value == null) {
      value = 'null';
    }
    this.items.set(String(key), String(value));
  }
  removeItem(key) {
    this.items.delete(String(key));
  }
  clear() {
    this.items.clear();
  }
}

const nativeClearInterval = clearInterval;
const nativeClearTimeout = clearTimeout;
const nativeSetInterval = setInterval;
const nativeSetTimeout = setTimeout;
const nativeURL = URL;
class MockWindow {
  constructor(html = null) {
    if (html !== false) {
      this.document = new MockDocument(html, this);
    }
    else {
      this.document = null;
    }
    this.performance = new MockPerformance();
    this.customElements = new MockCustomElementRegistry(this);
    this.console = createConsole();
    resetWindowDefaults(this);
    resetWindowDimensions(this);
  }
  addEventListener(type, handler) {
    addEventListener(this, type, handler);
  }
  alert(msg) {
    if (this.console) {
      this.console.debug(msg);
    }
    else {
      console.debug(msg);
    }
  }
  blur() {
    /**/
  }
  cancelAnimationFrame(id) {
    this.__clearTimeout(id);
  }
  cancelIdleCallback(id) {
    this.__clearTimeout(id);
  }
  get CharacterData() {
    if (this.__charDataCstr == null) {
      const ownerDocument = this.document;
      this.__charDataCstr = class extends MockNode {
        constructor() {
          super(ownerDocument, 0, 'test', '');
          throw new Error('Illegal constructor: cannot construct CharacterData');
        }
      };
    }
    return this.__charDataCstr;
  }
  set CharacterData(charDataCstr) {
    this.__charDataCstr = charDataCstr;
  }
  clearInterval(id) {
    this.__clearInterval(id);
  }
  clearTimeout(id) {
    this.__clearTimeout(id);
  }
  close() {
    resetWindow(this);
  }
  confirm() {
    return false;
  }
  get CSS() {
    return {
      supports: () => true,
    };
  }
  get Document() {
    if (this.__docCstr == null) {
      const win = this;
      this.__docCstr = class extends MockDocument {
        constructor() {
          super(false, win);
          throw new Error('Illegal constructor: cannot construct Document');
        }
      };
    }
    return this.__docCstr;
  }
  set Document(docCstr) {
    this.__docCstr = docCstr;
  }
  get DocumentFragment() {
    if (this.__docFragCstr == null) {
      const ownerDocument = this.document;
      this.__docFragCstr = class extends MockDocumentFragment {
        constructor() {
          super(ownerDocument);
          throw new Error('Illegal constructor: cannot construct DocumentFragment');
        }
      };
    }
    return this.__docFragCstr;
  }
  set DocumentFragment(docFragCstr) {
    this.__docFragCstr = docFragCstr;
  }
  get DocumentType() {
    if (this.__docTypeCstr == null) {
      const ownerDocument = this.document;
      this.__docTypeCstr = class extends MockNode {
        constructor() {
          super(ownerDocument, 0, 'test', '');
          throw new Error('Illegal constructor: cannot construct DocumentType');
        }
      };
    }
    return this.__docTypeCstr;
  }
  set DocumentType(docTypeCstr) {
    this.__docTypeCstr = docTypeCstr;
  }
  get DOMTokenList() {
    if (this.__domTokenListCstr == null) {
      this.__domTokenListCstr = class MockDOMTokenList {
      };
    }
    return this.__domTokenListCstr;
  }
  set DOMTokenList(domTokenListCstr) {
    this.__domTokenListCstr = domTokenListCstr;
  }
  dispatchEvent(ev) {
    return dispatchEvent(this, ev);
  }
  get Element() {
    if (this.__elementCstr == null) {
      const ownerDocument = this.document;
      this.__elementCstr = class extends MockElement {
        constructor() {
          super(ownerDocument, '');
          throw new Error('Illegal constructor: cannot construct Element');
        }
      };
    }
    return this.__elementCstr;
  }
  fetch(input, init) {
    if (typeof fetch === 'function') {
      return fetch(input, init);
    }
    throw new Error(`fetch() not implemented`);
  }
  focus() {
    /**/
  }
  getComputedStyle(_) {
    return {
      cssText: '',
      length: 0,
      parentRule: null,
      getPropertyPriority() {
        return null;
      },
      getPropertyValue() {
        return '';
      },
      item() {
        return null;
      },
      removeProperty() {
        return null;
      },
      setProperty() {
        return null;
      },
    };
  }
  get globalThis() {
    return this;
  }
  get history() {
    if (this.__history == null) {
      this.__history = new MockHistory();
    }
    return this.__history;
  }
  set history(hsty) {
    this.__history = hsty;
  }
  get JSON() {
    return JSON;
  }
  get HTMLElement() {
    if (this.__htmlElementCstr == null) {
      const ownerDocument = this.document;
      this.__htmlElementCstr = class extends MockHTMLElement {
        constructor() {
          super(ownerDocument, '');
          const observedAttributes = this.constructor.observedAttributes;
          if (Array.isArray(observedAttributes) && typeof this.attributeChangedCallback === 'function') {
            observedAttributes.forEach((attrName) => {
              const attrValue = this.getAttribute(attrName);
              if (attrValue != null) {
                this.attributeChangedCallback(attrName, null, attrValue);
              }
            });
          }
        }
      };
    }
    return this.__htmlElementCstr;
  }
  set HTMLElement(htmlElementCstr) {
    this.__htmlElementCstr = htmlElementCstr;
  }
  get IntersectionObserver() {
    return MockIntersectionObserver;
  }
  get localStorage() {
    if (this.__localStorage == null) {
      this.__localStorage = new MockStorage();
    }
    return this.__localStorage;
  }
  set localStorage(locStorage) {
    this.__localStorage = locStorage;
  }
  get location() {
    if (this.__location == null) {
      this.__location = new MockLocation();
    }
    return this.__location;
  }
  set location(val) {
    if (typeof val === 'string') {
      if (this.__location == null) {
        this.__location = new MockLocation();
      }
      this.__location.href = val;
    }
    else {
      this.__location = val;
    }
  }
  matchMedia(media) {
    return {
      media,
      matches: false,
      addEventListener,
      dispatchEvent,
      removeEventListener,
      onchange: null,
    };
  }
  get Node() {
    if (this.__nodeCstr == null) {
      const ownerDocument = this.document;
      this.__nodeCstr = class extends MockNode {
        constructor() {
          super(ownerDocument, 0, 'test', '');
          throw new Error('Illegal constructor: cannot construct Node');
        }
      };
    }
    return this.__nodeCstr;
  }
  get NodeList() {
    if (this.__nodeListCstr == null) {
      const ownerDocument = this.document;
      this.__nodeListCstr = class extends MockNodeList {
        constructor() {
          super(ownerDocument, [], 0);
          throw new Error('Illegal constructor: cannot construct NodeList');
        }
      };
    }
    return this.__nodeListCstr;
  }
  get navigator() {
    if (this.__navigator == null) {
      this.__navigator = new MockNavigator();
    }
    return this.__navigator;
  }
  set navigator(nav) {
    this.__navigator = nav;
  }
  get parent() {
    return null;
  }
  prompt() {
    return '';
  }
  open() {
    return null;
  }
  get origin() {
    return this.location.origin;
  }
  removeEventListener(type, handler) {
    removeEventListener(this, type, handler);
  }
  requestAnimationFrame(callback) {
    return this.setTimeout(() => {
      callback(Date.now());
    }, 0);
  }
  requestIdleCallback(callback) {
    return this.setTimeout(() => {
      callback({
        didTimeout: false,
        timeRemaining: () => 0,
      });
    }, 0);
  }
  scroll(_x, _y) {
    /**/
  }
  scrollBy(_x, _y) {
    /**/
  }
  scrollTo(_x, _y) {
    /**/
  }
  get self() {
    return this;
  }
  get sessionStorage() {
    if (this.__sessionStorage == null) {
      this.__sessionStorage = new MockStorage();
    }
    return this.__sessionStorage;
  }
  set sessionStorage(locStorage) {
    this.__sessionStorage = locStorage;
  }
  setInterval(callback, ms, ...args) {
    if (this.__timeouts == null) {
      this.__timeouts = new Set();
    }
    ms = Math.min(ms, this.__maxTimeout);
    if (this.__allowInterval) {
      const intervalId = this.__setInterval(() => {
        if (this.__timeouts) {
          this.__timeouts.delete(intervalId);
          try {
            callback(...args);
          }
          catch (e) {
            if (this.console) {
              this.console.error(e);
            }
            else {
              console.error(e);
            }
          }
        }
      }, ms);
      if (this.__timeouts) {
        this.__timeouts.add(intervalId);
      }
      return intervalId;
    }
    const timeoutId = this.__setTimeout(() => {
      if (this.__timeouts) {
        this.__timeouts.delete(timeoutId);
        try {
          callback(...args);
        }
        catch (e) {
          if (this.console) {
            this.console.error(e);
          }
          else {
            console.error(e);
          }
        }
      }
    }, ms);
    if (this.__timeouts) {
      this.__timeouts.add(timeoutId);
    }
    return timeoutId;
  }
  setTimeout(callback, ms, ...args) {
    if (this.__timeouts == null) {
      this.__timeouts = new Set();
    }
    ms = Math.min(ms, this.__maxTimeout);
    const timeoutId = this.__setTimeout(() => {
      if (this.__timeouts) {
        this.__timeouts.delete(timeoutId);
        try {
          callback(...args);
        }
        catch (e) {
          if (this.console) {
            this.console.error(e);
          }
          else {
            console.error(e);
          }
        }
      }
    }, ms);
    if (this.__timeouts) {
      this.__timeouts.add(timeoutId);
    }
    return timeoutId;
  }
  get top() {
    return this;
  }
  get window() {
    return this;
  }
  onanimationstart() {
    /**/
  }
  onanimationend() {
    /**/
  }
  onanimationiteration() {
    /**/
  }
  onabort() {
    /**/
  }
  onauxclick() {
    /**/
  }
  onbeforecopy() {
    /**/
  }
  onbeforecut() {
    /**/
  }
  onbeforepaste() {
    /**/
  }
  onblur() {
    /**/
  }
  oncancel() {
    /**/
  }
  oncanplay() {
    /**/
  }
  oncanplaythrough() {
    /**/
  }
  onchange() {
    /**/
  }
  onclick() {
    /**/
  }
  onclose() {
    /**/
  }
  oncontextmenu() {
    /**/
  }
  oncopy() {
    /**/
  }
  oncuechange() {
    /**/
  }
  oncut() {
    /**/
  }
  ondblclick() {
    /**/
  }
  ondrag() {
    /**/
  }
  ondragend() {
    /**/
  }
  ondragenter() {
    /**/
  }
  ondragleave() {
    /**/
  }
  ondragover() {
    /**/
  }
  ondragstart() {
    /**/
  }
  ondrop() {
    /**/
  }
  ondurationchange() {
    /**/
  }
  onemptied() {
    /**/
  }
  onended() {
    /**/
  }
  onerror() {
    /**/
  }
  onfocus() {
    /**/
  }
  onfocusin() {
    /**/
  }
  onfocusout() {
    /**/
  }
  onformdata() {
    /**/
  }
  onfullscreenchange() {
    /**/
  }
  onfullscreenerror() {
    /**/
  }
  ongotpointercapture() {
    /**/
  }
  oninput() {
    /**/
  }
  oninvalid() {
    /**/
  }
  onkeydown() {
    /**/
  }
  onkeypress() {
    /**/
  }
  onkeyup() {
    /**/
  }
  onload() {
    /**/
  }
  onloadeddata() {
    /**/
  }
  onloadedmetadata() {
    /**/
  }
  onloadstart() {
    /**/
  }
  onlostpointercapture() {
    /**/
  }
  onmousedown() {
    /**/
  }
  onmouseenter() {
    /**/
  }
  onmouseleave() {
    /**/
  }
  onmousemove() {
    /**/
  }
  onmouseout() {
    /**/
  }
  onmouseover() {
    /**/
  }
  onmouseup() {
    /**/
  }
  onmousewheel() {
    /**/
  }
  onpaste() {
    /**/
  }
  onpause() {
    /**/
  }
  onplay() {
    /**/
  }
  onplaying() {
    /**/
  }
  onpointercancel() {
    /**/
  }
  onpointerdown() {
    /**/
  }
  onpointerenter() {
    /**/
  }
  onpointerleave() {
    /**/
  }
  onpointermove() {
    /**/
  }
  onpointerout() {
    /**/
  }
  onpointerover() {
    /**/
  }
  onpointerup() {
    /**/
  }
  onprogress() {
    /**/
  }
  onratechange() {
    /**/
  }
  onreset() {
    /**/
  }
  onresize() {
    /**/
  }
  onscroll() {
    /**/
  }
  onsearch() {
    /**/
  }
  onseeked() {
    /**/
  }
  onseeking() {
    /**/
  }
  onselect() {
    /**/
  }
  onselectstart() {
    /**/
  }
  onstalled() {
    /**/
  }
  onsubmit() {
    /**/
  }
  onsuspend() {
    /**/
  }
  ontimeupdate() {
    /**/
  }
  ontoggle() {
    /**/
  }
  onvolumechange() {
    /**/
  }
  onwaiting() {
    /**/
  }
  onwebkitfullscreenchange() {
    /**/
  }
  onwebkitfullscreenerror() {
    /**/
  }
  onwheel() {
    /**/
  }
}
addGlobalsToWindowPrototype(MockWindow.prototype);
function resetWindowDefaults(win) {
  win.__clearInterval = nativeClearInterval;
  win.__clearTimeout = nativeClearTimeout;
  win.__setInterval = nativeSetInterval;
  win.__setTimeout = nativeSetTimeout;
  win.__maxTimeout = 30000;
  win.__allowInterval = true;
  win.URL = nativeURL;
}
function cloneWindow(srcWin, opts = {}) {
  if (srcWin == null) {
    return null;
  }
  const clonedWin = new MockWindow(false);
  if (!opts.customElementProxy) {
    // TODO(STENCIL-345) - Evaluate reconciling MockWindow, Window differences
    // @ts-ignore
    srcWin.customElements = null;
  }
  if (srcWin.document != null) {
    const clonedDoc = new MockDocument(false, clonedWin);
    clonedWin.document = clonedDoc;
    clonedDoc.documentElement = srcWin.document.documentElement.cloneNode(true);
  }
  else {
    clonedWin.document = new MockDocument(null, clonedWin);
  }
  return clonedWin;
}
function cloneDocument(srcDoc) {
  if (srcDoc == null) {
    return null;
  }
  const dstWin = cloneWindow(srcDoc.defaultView);
  return dstWin.document;
}
// TODO(STENCIL-345) - Evaluate reconciling MockWindow, Window differences
/**
 * Constrain setTimeout() to 1ms, but still async. Also
 * only allow setInterval() to fire once, also constrained to 1ms.
 * @param win the mock window instance to update
 */
function constrainTimeouts(win) {
  win.__allowInterval = false;
  win.__maxTimeout = 0;
}
function resetWindow(win) {
  if (win != null) {
    if (win.__timeouts) {
      win.__timeouts.forEach((timeoutId) => {
        nativeClearInterval(timeoutId);
        nativeClearTimeout(timeoutId);
      });
      win.__timeouts.clear();
    }
    if (win.customElements && win.customElements.clear) {
      win.customElements.clear();
    }
    resetDocument(win.document);
    resetPerformance(win.performance);
    for (const key in win) {
      if (win.hasOwnProperty(key) && key !== 'document' && key !== 'performance' && key !== 'customElements') {
        delete win[key];
      }
    }
    resetWindowDefaults(win);
    resetWindowDimensions(win);
    resetEventListeners(win);
    if (win.document != null) {
      try {
        win.document.defaultView = win;
      }
      catch (e) { }
    }
    // ensure we don't hold onto nodeFetch values
    win.fetch = null;
    win.Headers = null;
    win.Request = null;
    win.Response = null;
    win.FetchError = null;
  }
}
function resetWindowDimensions(win) {
  try {
    win.devicePixelRatio = 1;
    win.innerHeight = 768;
    win.innerWidth = 1366;
    win.pageXOffset = 0;
    win.pageYOffset = 0;
    win.screenLeft = 0;
    win.screenTop = 0;
    win.screenX = 0;
    win.screenY = 0;
    win.scrollX = 0;
    win.scrollY = 0;
    win.screen = {
      availHeight: win.innerHeight,
      availLeft: 0,
      availTop: 0,
      availWidth: win.innerWidth,
      colorDepth: 24,
      height: win.innerHeight,
      keepAwake: false,
      orientation: {
        angle: 0,
        type: 'portrait-primary',
      },
      pixelDepth: 24,
      width: win.innerWidth,
    };
  }
  catch (e) { }
}

class MockDocument extends MockHTMLElement {
  constructor(html = null, win = null) {
    super(null, null);
    this.nodeName = "#document" /* NODE_NAMES.DOCUMENT_NODE */;
    this.nodeType = 9 /* NODE_TYPES.DOCUMENT_NODE */;
    this.defaultView = win;
    this.cookie = '';
    this.referrer = '';
    this.appendChild(this.createDocumentTypeNode());
    if (typeof html === 'string') {
      const parsedDoc = parseDocumentUtil(this, html);
      const documentElement = parsedDoc.children.find((elm) => elm.nodeName === 'HTML');
      if (documentElement != null) {
        this.appendChild(documentElement);
        setOwnerDocument(documentElement, this);
      }
    }
    else if (html !== false) {
      const documentElement = new MockHTMLElement(this, 'html');
      this.appendChild(documentElement);
      documentElement.appendChild(new MockHTMLElement(this, 'head'));
      documentElement.appendChild(new MockHTMLElement(this, 'body'));
    }
  }
  get dir() {
    return this.documentElement.dir;
  }
  set dir(value) {
    this.documentElement.dir = value;
  }
  get location() {
    if (this.defaultView != null) {
      return this.defaultView.location;
    }
    return null;
  }
  set location(val) {
    if (this.defaultView != null) {
      this.defaultView.location = val;
    }
  }
  get baseURI() {
    const baseNode = this.head.childNodes.find((node) => node.nodeName === 'BASE');
    if (baseNode) {
      return baseNode.href;
    }
    return this.URL;
  }
  get URL() {
    return this.location.href;
  }
  get styleSheets() {
    return this.querySelectorAll('style');
  }
  get scripts() {
    return this.querySelectorAll('script');
  }
  get forms() {
    return this.querySelectorAll('form');
  }
  get images() {
    return this.querySelectorAll('img');
  }
  get scrollingElement() {
    return this.documentElement;
  }
  get documentElement() {
    for (let i = this.childNodes.length - 1; i >= 0; i--) {
      if (this.childNodes[i].nodeName === 'HTML') {
        return this.childNodes[i];
      }
    }
    const documentElement = new MockHTMLElement(this, 'html');
    this.appendChild(documentElement);
    return documentElement;
  }
  set documentElement(documentElement) {
    for (let i = this.childNodes.length - 1; i >= 0; i--) {
      if (this.childNodes[i].nodeType !== 10 /* NODE_TYPES.DOCUMENT_TYPE_NODE */) {
        this.childNodes[i].remove();
      }
    }
    if (documentElement != null) {
      this.appendChild(documentElement);
      setOwnerDocument(documentElement, this);
    }
  }
  get head() {
    const documentElement = this.documentElement;
    for (let i = 0; i < documentElement.childNodes.length; i++) {
      if (documentElement.childNodes[i].nodeName === 'HEAD') {
        return documentElement.childNodes[i];
      }
    }
    const head = new MockHTMLElement(this, 'head');
    documentElement.insertBefore(head, documentElement.firstChild);
    return head;
  }
  set head(head) {
    const documentElement = this.documentElement;
    for (let i = documentElement.childNodes.length - 1; i >= 0; i--) {
      if (documentElement.childNodes[i].nodeName === 'HEAD') {
        documentElement.childNodes[i].remove();
      }
    }
    if (head != null) {
      documentElement.insertBefore(head, documentElement.firstChild);
      setOwnerDocument(head, this);
    }
  }
  get body() {
    const documentElement = this.documentElement;
    for (let i = documentElement.childNodes.length - 1; i >= 0; i--) {
      if (documentElement.childNodes[i].nodeName === 'BODY') {
        return documentElement.childNodes[i];
      }
    }
    const body = new MockHTMLElement(this, 'body');
    documentElement.appendChild(body);
    return body;
  }
  set body(body) {
    const documentElement = this.documentElement;
    for (let i = documentElement.childNodes.length - 1; i >= 0; i--) {
      if (documentElement.childNodes[i].nodeName === 'BODY') {
        documentElement.childNodes[i].remove();
      }
    }
    if (body != null) {
      documentElement.appendChild(body);
      setOwnerDocument(body, this);
    }
  }
  appendChild(newNode) {
    newNode.remove();
    newNode.parentNode = this;
    this.childNodes.push(newNode);
    return newNode;
  }
  createComment(data) {
    return new MockComment(this, data);
  }
  createAttribute(attrName) {
    return new MockAttr(attrName.toLowerCase(), '');
  }
  createAttributeNS(namespaceURI, attrName) {
    return new MockAttr(attrName, '', namespaceURI);
  }
  createElement(tagName) {
    if (tagName === "#document" /* NODE_NAMES.DOCUMENT_NODE */) {
      const doc = new MockDocument(false);
      doc.nodeName = tagName;
      doc.parentNode = null;
      return doc;
    }
    return createElement(this, tagName);
  }
  createElementNS(namespaceURI, tagName) {
    const elmNs = createElementNS(this, namespaceURI, tagName);
    elmNs.namespaceURI = namespaceURI;
    return elmNs;
  }
  createTextNode(text) {
    return new MockTextNode(this, text);
  }
  createDocumentFragment() {
    return new MockDocumentFragment(this);
  }
  createDocumentTypeNode() {
    return new MockDocumentTypeNode(this);
  }
  getElementById(id) {
    return getElementById(this, id);
  }
  getElementsByName(elmName) {
    return getElementsByName(this, elmName.toLowerCase());
  }
  get title() {
    const title = this.head.childNodes.find((elm) => elm.nodeName === 'TITLE');
    if (title != null && typeof title.textContent === 'string') {
      return title.textContent.trim();
    }
    return '';
  }
  set title(value) {
    const head = this.head;
    let title = head.childNodes.find((elm) => elm.nodeName === 'TITLE');
    if (title == null) {
      title = this.createElement('title');
      head.appendChild(title);
    }
    title.textContent = value;
  }
}
function createDocument(html = null) {
  return new MockWindow(html).document;
}
function createFragment(html) {
  return parseHtmlToFragment(html, null);
}
function resetDocument(doc) {
  if (doc != null) {
    resetEventListeners(doc);
    const documentElement = doc.documentElement;
    if (documentElement != null) {
      resetElement(documentElement);
      for (let i = 0, ii = documentElement.childNodes.length; i < ii; i++) {
        const childNode = documentElement.childNodes[i];
        resetElement(childNode);
        childNode.childNodes.length = 0;
      }
    }
    for (const key in doc) {
      if (doc.hasOwnProperty(key) && !DOC_KEY_KEEPERS.has(key)) {
        delete doc[key];
      }
    }
    try {
      doc.nodeName = "#document" /* NODE_NAMES.DOCUMENT_NODE */;
    }
    catch (e) { }
    try {
      doc.nodeType = 9 /* NODE_TYPES.DOCUMENT_NODE */;
    }
    catch (e) { }
    try {
      doc.cookie = '';
    }
    catch (e) { }
    try {
      doc.referrer = '';
    }
    catch (e) { }
  }
}
const DOC_KEY_KEEPERS = new Set([
  'nodeName',
  'nodeType',
  'nodeValue',
  'ownerDocument',
  'parentNode',
  'childNodes',
  '_shadowRoot',
]);
function getElementById(elm, id) {
  const children = elm.children;
  for (let i = 0, ii = children.length; i < ii; i++) {
    const childElm = children[i];
    if (childElm.id === id) {
      return childElm;
    }
    const childElmFound = getElementById(childElm, id);
    if (childElmFound != null) {
      return childElmFound;
    }
  }
  return null;
}
function getElementsByName(elm, elmName, foundElms = []) {
  const children = elm.children;
  for (let i = 0, ii = children.length; i < ii; i++) {
    const childElm = children[i];
    if (childElm.name && childElm.name.toLowerCase() === elmName) {
      foundElms.push(childElm);
    }
    getElementsByName(childElm, elmName, foundElms);
  }
  return foundElms;
}
function setOwnerDocument(elm, ownerDocument) {
  for (let i = 0, ii = elm.childNodes.length; i < ii; i++) {
    elm.childNodes[i].ownerDocument = ownerDocument;
    if (elm.childNodes[i].nodeType === 1 /* NODE_TYPES.ELEMENT_NODE */) {
      setOwnerDocument(elm.childNodes[i], ownerDocument);
    }
  }
}

function hydrateFactory($stencilWindow, $stencilHydrateOpts, $stencilHydrateResults, $stencilAfterHydrate, $stencilHydrateResolve) {
  var globalThis = $stencilWindow;
  var self = $stencilWindow;
  var top = $stencilWindow;
  var parent = $stencilWindow;

  var addEventListener = $stencilWindow.addEventListener.bind($stencilWindow);
  var alert = $stencilWindow.alert.bind($stencilWindow);
  var blur = $stencilWindow.blur.bind($stencilWindow);
  var cancelAnimationFrame = $stencilWindow.cancelAnimationFrame.bind($stencilWindow);
  var cancelIdleCallback = $stencilWindow.cancelIdleCallback.bind($stencilWindow);
  var clearInterval = $stencilWindow.clearInterval.bind($stencilWindow);
  var clearTimeout = $stencilWindow.clearTimeout.bind($stencilWindow);
  var close = () => {};
  var confirm = $stencilWindow.confirm.bind($stencilWindow);
  var dispatchEvent = $stencilWindow.dispatchEvent.bind($stencilWindow);
  var focus = $stencilWindow.focus.bind($stencilWindow);
  var getComputedStyle = $stencilWindow.getComputedStyle.bind($stencilWindow);
  var matchMedia = $stencilWindow.matchMedia.bind($stencilWindow);
  var open = $stencilWindow.open.bind($stencilWindow);
  var prompt = $stencilWindow.prompt.bind($stencilWindow);
  var removeEventListener = $stencilWindow.removeEventListener.bind($stencilWindow);
  var requestAnimationFrame = $stencilWindow.requestAnimationFrame.bind($stencilWindow);
  var requestIdleCallback = $stencilWindow.requestIdleCallback.bind($stencilWindow);
  var setInterval = $stencilWindow.setInterval.bind($stencilWindow);
  var setTimeout = $stencilWindow.setTimeout.bind($stencilWindow);

  var CharacterData = $stencilWindow.CharacterData;
  var CSS = $stencilWindow.CSS;
  var CustomEvent = $stencilWindow.CustomEvent;
  var Document = $stencilWindow.Document;
  var DocumentFragment = $stencilWindow.DocumentFragment;
  var DocumentType = $stencilWindow.DocumentType;
  var DOMTokenList = $stencilWindow.DOMTokenList;
  var Element = $stencilWindow.Element;
  var Event = $stencilWindow.Event;
  var HTMLAnchorElement = $stencilWindow.HTMLAnchorElement;
  var HTMLBaseElement = $stencilWindow.HTMLBaseElement;
  var HTMLButtonElement = $stencilWindow.HTMLButtonElement;
  var HTMLCanvasElement = $stencilWindow.HTMLCanvasElement;
  var HTMLElement = $stencilWindow.HTMLElement;
  var HTMLFormElement = $stencilWindow.HTMLFormElement;
  var HTMLImageElement = $stencilWindow.HTMLImageElement;
  var HTMLInputElement = $stencilWindow.HTMLInputElement;
  var HTMLLinkElement = $stencilWindow.HTMLLinkElement;
  var HTMLMetaElement = $stencilWindow.HTMLMetaElement;
  var HTMLScriptElement = $stencilWindow.HTMLScriptElement;
  var HTMLStyleElement = $stencilWindow.HTMLStyleElement;
  var HTMLTemplateElement = $stencilWindow.HTMLTemplateElement;
  var HTMLTitleElement = $stencilWindow.HTMLTitleElement;
  var IntersectionObserver = $stencilWindow.IntersectionObserver;
  var KeyboardEvent = $stencilWindow.KeyboardEvent;
  var MouseEvent = $stencilWindow.MouseEvent;
  var Node = $stencilWindow.Node;
  var NodeList = $stencilWindow.NodeList;
  var URL = $stencilWindow.URL;

  var console = $stencilWindow.console;
  var customElements = $stencilWindow.customElements;
  var history = $stencilWindow.history;
  var localStorage = $stencilWindow.localStorage;
  var location = $stencilWindow.location;
  var navigator = $stencilWindow.navigator;
  var performance = $stencilWindow.performance;
  var sessionStorage = $stencilWindow.sessionStorage;

  var devicePixelRatio = $stencilWindow.devicePixelRatio;
  var innerHeight = $stencilWindow.innerHeight;
  var innerWidth = $stencilWindow.innerWidth;
  var origin = $stencilWindow.origin;
  var pageXOffset = $stencilWindow.pageXOffset;
  var pageYOffset = $stencilWindow.pageYOffset;
  var screen = $stencilWindow.screen;
  var screenLeft = $stencilWindow.screenLeft;
  var screenTop = $stencilWindow.screenTop;
  var screenX = $stencilWindow.screenX;
  var screenY = $stencilWindow.screenY;
  var scrollX = $stencilWindow.scrollX;
  var scrollY = $stencilWindow.scrollY;
  var exports = {};

  var fetch, FetchError, Headers, Request, Response;

  if (typeof $stencilWindow.fetch === 'function') {
  fetch = $stencilWindow.fetch;
  } else {
  fetch = $stencilWindow.fetch = function() { throw new Error('fetch() is not implemented'); };
  }

  if (typeof $stencilWindow.FetchError === 'function') {
  FetchError = $stencilWindow.FetchError;
  } else {
  FetchError = $stencilWindow.FetchError = class FetchError { constructor() { throw new Error('FetchError is not implemented'); } };
  }

  if (typeof $stencilWindow.Headers === 'function') {
  Headers = $stencilWindow.Headers;
  } else {
  Headers = $stencilWindow.Headers = class Headers { constructor() { throw new Error('Headers is not implemented'); } };
  }

  if (typeof $stencilWindow.Request === 'function') {
  Request = $stencilWindow.Request;
  } else {
  Request = $stencilWindow.Request = class Request { constructor() { throw new Error('Request is not implemented'); } };
  }

  if (typeof $stencilWindow.Response === 'function') {
  Response = $stencilWindow.Response;
  } else {
  Response = $stencilWindow.Response = class Response { constructor() { throw new Error('Response is not implemented'); } };
  }

  function hydrateAppClosure($stencilWindow) {
  const window = $stencilWindow;
  const document = $stencilWindow.document;
  /*hydrateAppClosure start*/


var process = require('process');
var buffer = require('buffer');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var process__default = /*#__PURE__*/_interopDefaultLegacy(process);

var global$1 = (typeof global !== "undefined" ? global :
  typeof self !== "undefined" ? self :
  typeof window !== "undefined" ? window : {});

const NAMESPACE = 'bam-scripts';
const BUILD = /* bam-scripts */ { allRenderFn: true, appendChildSlotFix: false, asyncLoading: true, attachStyles: true, cloneNodeFix: false, cmpDidLoad: false, cmpDidRender: true, cmpDidUnload: false, cmpDidUpdate: false, cmpShouldUpdate: false, cmpWillLoad: true, cmpWillRender: false, cmpWillUpdate: false, connectedCallback: true, constructableCSS: false, cssAnnotations: true, cssVarShim: false, devTools: false, disconnectedCallback: false, dynamicImportShim: false, element: false, event: false, hasRenderFn: true, hostListener: true, hostListenerTarget: true, hostListenerTargetBody: false, hostListenerTargetDocument: false, hostListenerTargetParent: false, hostListenerTargetWindow: true, hotModuleReplacement: false, hydrateClientSide: true, hydrateServerSide: true, hydratedAttribute: false, hydratedClass: true, isDebug: false, isDev: false, isTesting: false, lazyLoad: true, lifecycle: true, lifecycleDOMEvents: false, member: true, method: false, mode: false, observeAttribute: true, profile: false, prop: true, propBoolean: true, propMutable: true, propNumber: true, propString: true, reflect: false, safari10: false, scoped: false, scriptDataOpts: false, shadowDelegatesFocus: false, shadowDom: true, shadowDomShim: true, slot: false, slotChildNodesFix: false, slotRelocation: true, state: true, style: true, svg: true, taskQueue: true, updatable: true, vdomAttribute: true, vdomClass: true, vdomFunctional: true, vdomKey: true, vdomListener: true, vdomPropOrAttr: true, vdomRef: false, vdomRender: true, vdomStyle: false, vdomText: true, vdomXlink: false, watchCallback: true };

const getQueryParamString = (obj) => {
  const params = new URLSearchParams();
  Object.keys(obj).forEach(key => {
    const value = obj[key];
    if (![null, undefined].includes(value)) {
      if (Array.isArray(value)) {
        params.set(key, value.join(','));
      }
      else {
        params.set(key, value);
      }
    }
  });
  const paramStr = decodeURIComponent(params.toString());
  if (paramStr.length) {
    return '?' + paramStr;
  }
  return '';
};

var LazyLoadClassName;
(function (LazyLoadClassName) {
  LazyLoadClassName["CTA_LOGO"] = "logo";
  LazyLoadClassName["LIST_LOGO"] = "item-logo";
  LazyLoadClassName["BANNER_IMAGE"] = "image";
  LazyLoadClassName["IMPRESSION_PIXEL"] = "bam__pixel";
})(LazyLoadClassName || (LazyLoadClassName = {}));
const categoryIdMapping = {
  thumbnail: 1,
  logo: 2,
  desktop_banner: 6,
  mobile_banner: 7,
  app_game_page_ad: 8,
};
const getBaseUrl = (devMode) => {
  return devMode ? `https://bam-stage.actionnetwork.com` : `https://bam.actionnetwork.com`;
};
const createSwitchboardLink = (domain, params) => {
  domain = domain || 'switchboard.actionnetwork.com';
  return `https://${domain}/offers${getQueryParamString(params)}`;
};
const getQueryParamFromUrl = (param) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
};
const paidMarketingParams = ['action0050', 'action0062', 'action0075', 'action0090', 'VI0045', 'RG0023', 'FL0029'];
const isValidPaidMarketingParam = (param) => {
  return paidMarketingParams.includes(param);
};
const getPromotionImage = (images, category) => { var _a; return (_a = images.find(image => { var _a; return ((_a = image.image_type) === null || _a === void 0 ? void 0 : _a.id) === categoryIdMapping[category]; })) === null || _a === void 0 ? void 0 : _a.image_url; };
const formatPromotions = (promotions, { allowAltLink, promotionListId, location, context, propertyId, }) => {
  if (!context) {
    // eslint-disable-next-line no-console
    console.warn('BAM Warning: Missing context');
  }
  const paidMarketing = getQueryParamFromUrl('paidMarketing');
  return promotions.map(promo => {
    const { button_text: promoButtonText, bonus_code: bonusCode } = promo.additional_attributes;
    const amount = promo.dollar_amount || promo.campaign.dollar_amount || 0;
    const buttonText = promoButtonText ? promoButtonText : amount ? `Claim $${amount}` : 'Learn More';
    const alternateLink = allowAltLink && promo.alternate_link;
    const impressionUrls = promo.additional_attributes.impression_urls || [];
    const link = alternateLink ||
      createSwitchboardLink(promo.switchboard_domain || null, {
        affiliateId: promo.affiliate.id,
        campaignId: promo.campaign.id,
        stateCode: location,
        context: context,
        propertyId,
        options: paidMarketing,
      });
    return {
      id: promo.id || 0,
      link,
      buttonText,
      logo: getPromotionImage(promo.images, 'thumbnail') || '',
      bookName: promo.affiliate.display_name || '',
      logoColor: promo.affiliate.primary_color || '',
      cta: promo.title || '',
      impressionUrls,
      termsText: promo.terms || '',
      bonusCode: bonusCode || '',
      props: promo.value_props || [],
      bookId: promo.affiliate.id,
      campaignId: promo.campaign.id,
      promotionListId,
      images: promo.images,
    };
  });
};
function createSrcSet(src, width, height) {
  if (!src) {
    return '';
  }
  const [rawSrc] = snipFileType(src);
  const parsedWidth = typeof width === 'number' ? width : parseInt(width, 10);
  const parsedHeight = typeof height === 'number' ? height : parseInt(height, 10);
  return [4, 3, 2, 1.5, 1, 0.5]
    .map(divisor => `${getResizedImage(rawSrc, divideIt(parsedWidth, divisor), divideIt(parsedHeight, divisor))}.webp ${divideIt(parsedWidth, divisor)}w`)
    .join(',');
}
function snipFileType(str) {
  const regex = /\.(\w+)$/;
  const ext = str.match(regex) || [];
  return [str.replace(regex, ''), ext[1]];
}
function getResizedImage(url, width, height) {
  return url.replace(/https:\/\/(images|assets).actionnetwork.com\/(blog)?/, (_, subdomain, blog) => `https://${subdomain}.actionnetwork.com/${width}x${height}/${blog !== undefined ? blog : ''}`);
}
function divideIt(number, divisor) {
  return (number / divisor).toFixed();
}
const canvasWidth = {
  desktopBanner: 12,
  mobileBanner: 2.4,
  thumbnail: 1,
};
const generateColorUri = (color, size) => {
  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth[size];
  canvas.height = 1;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvasWidth[size], 1);
  }
  return canvas.toDataURL ? canvas.toDataURL('webp') : '';
};
function determineDeviceType() {
  const userAgent = navigator.userAgent;
  if (/android/i.test(userAgent)) {
    return 'android';
  }
  if (/iPad|iPhone|iPod/.test(userAgent)) {
    return 'ios';
  }
  return 'desktop';
}
function requiredParamsCheck(params, componentType) {
  const errors = [];
  Object.keys(params).forEach(param => {
    if (!params[param]) {
      errors.push(param);
    }
  });
  logErrors(errors, componentType);
  return errors.length > 0;
}
function logErrors(errors, component) {
  const componentType = component ? `${component} - ` : '';
  errors.forEach(error => {
    // eslint-disable-next-line no-console
    console.error(`BAM Error: ${componentType}${error} is missing`);
  });
}

// Global script Runs before any components are loaded
function appGlobalScript () {
  const snippetTags = [
    'bam-banner',
    'bam-promotion-list',
    'bam-sticky-cta',
    'bam-inline-promotion',
    'bam-inline-promotion-block',
    'bam-footer',
  ];
  const deviceType = determineDeviceType();
  // look for global styles and insert if they don't exist
  const globalStyles = document.head.querySelectorAll('link[rel="stylesheet"][href*="https://bam-static.actionnetwork.com/0.0.2/bam-scripts/bam-scripts.css"]');
  if (globalStyles.length === 0) {
    const globalStyle = document.createElement('link');
    globalStyle.setAttribute('rel', 'stylesheet');
    globalStyle.setAttribute('href', 'https://bam-static.actionnetwork.com/0.0.2/bam-scripts/bam-scripts.css');
    document.head.appendChild(globalStyle);
  }
  // find all divs with snippet classnames and change them to the correct tag
  snippetTags.forEach(tag => {
    const divs = document.querySelectorAll(`div.${tag}`);
    divs.forEach(div => {
      const newTag = document.createElement(tag);
      // copy over all attributes
      for (let i = 0; i < div.attributes.length; i++) {
        const attr = div.attributes[i];
        newTag.setAttribute(attr.name, attr.value);
      }
      div.parentNode.replaceChild(newTag, div);
    });
  });
  // find all snippet tags and remove data- from attributes used by the snippets
  const snippetElements = document.querySelectorAll(snippetTags.join(','));
  const snippetAttributes = [
    'data-placement-id',
    'data-property-id',
    'data-promotion-id',
    'data-context',
    'data-location',
    'data-page-slug',
    'data-subscription-tier',
    'data-was-pro',
    'data-subdivision',
    'data-league',
    'data-game-id',
    'data-cta-type',
    'data-is-mobile',
    'data-device-type',
    'data-is-betsync-user',
    'data-defer',
    'data-dev-mode',
    'data-max-length',
    'data-module-title',
  ];
  snippetElements.forEach(element => {
    const attrs = Array.from(element.attributes);
    attrs.forEach(attr => {
      if (attr.name.startsWith('data-') && snippetAttributes.includes(attr.name)) {
        const newAttrName = attr.name.replace('data-', '');
        element.setAttribute(newAttrName, attr.value);
        element.removeAttribute(attr.name);
      }
    });
    element.setAttribute('device-type', deviceType);
  });
}

const globalScripts = appGlobalScript;

function queryNonceMetaTagContent(e) {
 var t, o, n;
 return null !== (n = null === (o = null === (t = e.head) || void 0 === t ? void 0 : t.querySelector('meta[name="csp-nonce"]')) || void 0 === o ? void 0 : o.getAttribute("content")) && void 0 !== n ? n : void 0;
}

function componentOnReady() {
 return getHostRef(this).$onReadyPromise$;
}

function forceUpdate() {}

function hydrateApp(e, t, o, n, s) {
 function l() {
  if (global$1.clearTimeout(p), i.clear(), r.clear(), !u) {
   u = !0;
   try {
    t.clientHydrateAnnotations && insertVdomAnnotations(e.document, t.staticComponents), 
    e.dispatchEvent(new e.Event("DOMContentLoaded")), e.document.createElement = c, 
    e.document.createElementNS = $;
   } catch (e) {
    renderCatchError(t, o, e);
   }
  }
  n(e, t, o, s);
 }
 function a(e) {
  renderCatchError(t, o, e), l();
 }
 const r = new Set, i = new Set, d = new Set, c = e.document.createElement, $ = e.document.createElementNS, m = Promise.resolve();
 let p, u = !1;
 try {
  function h() {
   return g(this);
  }
  function f(e) {
   if (isValidComponent(e, t) && !getHostRef(e)) {
    const t = loadModule({
     $tagName$: e.nodeName.toLowerCase(),
     $flags$: null
    });
    null != t && null != t.cmpMeta && (i.add(e), e.connectedCallback = h, registerHost(e, t.cmpMeta), 
    function o(e, t) {
     if ("function" != typeof e.componentOnReady && (e.componentOnReady = componentOnReady), 
     "function" != typeof e.forceUpdate && (e.forceUpdate = forceUpdate), 1 & t.$flags$ && (e.shadowRoot = e), 
     null != t.$members$) {
      const o = getHostRef(e);
      Object.entries(t.$members$).forEach((([n, s]) => {
       const l = s[0];
       if (31 & l) {
        const a = s[1] || n, r = e.getAttribute(a);
        if (null != r) {
         const e = parsePropertyValue(r, l);
         o.$instanceValues$.set(n, e);
        }
        const i = e[n];
        void 0 !== i && (o.$instanceValues$.set(n, i), delete e[n]), Object.defineProperty(e, n, {
         get() {
          return getValue(this, n);
         },
         set(e) {
          setValue(this, n, e, t);
         },
         configurable: !0,
         enumerable: !0
        });
       } else 64 & l && Object.defineProperty(e, n, {
        value(...e) {
         const t = getHostRef(this);
         return t.$onInstancePromise$.then((() => t.$lazyInstance$[n](...e))).catch(consoleError);
        }
       });
      }));
     }
    }(e, t.cmpMeta));
   }
  }
  function g(n) {
   return i.delete(n), isValidComponent(n, t) && o.hydratedCount < t.maxHydrateCount && !r.has(n) && shouldHydrate(n) ? (r.add(n), 
   async function s(e, t, o, n, l) {
    o = o.toLowerCase();
    const a = loadModule({
     $tagName$: o,
     $flags$: null
    });
    if (null != a && null != a.cmpMeta) {
     l.add(n);
     try {
      connectedCallback(n), await n.componentOnReady(), t.hydratedCount++;
      const e = getHostRef(n), s = e.$modeName$ ? e.$modeName$ : "$";
      t.components.some((e => e.tag === o && e.mode === s)) || t.components.push({
       tag: o,
       mode: s,
       count: 0,
       depth: -1
      });
     } catch (t) {
      e.console.error(t);
     }
     l.delete(n);
    }
   }(e, o, n.nodeName, n, d)) : m;
  }
  e.document.createElement = function t(o) {
   const n = c.call(e.document, o);
   return f(n), n;
  }, e.document.createElementNS = function t(o, n) {
   const s = $.call(e.document, o, n);
   return f(s), s;
  }, p = global$1.setTimeout((function L() {
   a(`Hydrate exceeded timeout${function e(t) {
    return Array.from(t).map(waitingOnElementMsg);
   }(d)}`);
  }), t.timeout), plt.$resourcesUrl$ = new URL(t.resourcesUrl || "./", doc.baseURI).href, 
  globalScripts(), function e(t) {
   if (null != t && 1 === t.nodeType) {
    f(t);
    const o = t.children;
    for (let t = 0, n = o.length; t < n; t++) e(o[t]);
   }
  }(e.document.body), function e() {
   const t = Array.from(i).filter((e => e.parentElement));
   return t.length > 0 ? Promise.all(t.map(g)).then(e) : m;
  }().then(l).catch(a);
 } catch (y) {
  a(y);
 }
}

function isValidComponent(e, t) {
 if (null != e && 1 === e.nodeType) {
  const o = e.nodeName;
  if ("string" == typeof o && o.includes("-")) return !t.excludeComponents.includes(o.toLowerCase());
 }
 return !1;
}

function shouldHydrate(e) {
 if (9 === e.nodeType) return !0;
 if (NO_HYDRATE_TAGS.has(e.nodeName)) return !1;
 if (e.hasAttribute("no-prerender")) return !1;
 const t = e.parentNode;
 return null == t || shouldHydrate(t);
}

function renderCatchError(e, t, o) {
 const n = {
  level: "error",
  type: "build",
  header: "Hydrate Error",
  messageText: "",
  relFilePath: null,
  absFilePath: null,
  lines: []
 };
 if (e.url) try {
  const t = new URL(e.url);
  "/" !== t.pathname && (n.header += ": " + t.pathname);
 } catch (e) {}
 null != o && (null != o.stack ? n.messageText = o.stack.toString() : null != o.message ? n.messageText = o.message.toString() : n.messageText = o.toString()), 
 t.diagnostics.push(n);
}

function printTag(e) {
 let t = `<${e.nodeName.toLowerCase()}`;
 if (Array.isArray(e.attributes)) for (let o = 0; o < e.attributes.length; o++) {
  const n = e.attributes[o];
  t += ` ${n.name}`, "" !== n.value && (t += `="${n.value}"`);
 }
 return t += ">", t;
}

function waitingOnElementMsg(e) {
 let t = "";
 if (e) {
  const o = [];
  t = " - waiting on:";
  let n = e;
  for (;n && 9 !== n.nodeType && "BODY" !== n.nodeName; ) o.unshift(printTag(n)), 
  n = n.parentElement;
  let s = "";
  for (const e of o) s += "  ", t += `\n${s}${e}`;
 }
 return t;
}

const createTime = (e, t = "") => {
 return () => {};
}, EMPTY_OBJ = {}, isComplexType = e => "object" == (e = typeof e) || "function" === e, isPromise = e => !!e && ("object" == typeof e || "function" == typeof e) && "function" == typeof e.then, h = (e, t, ...o) => {
 let n = null, s = null, l = null, a = !1, r = !1;
 const i = [], d = t => {
  for (let o = 0; o < t.length; o++) n = t[o], Array.isArray(n) ? d(n) : null != n && "boolean" != typeof n && ((a = "function" != typeof e && !isComplexType(n)) ? n = String(n) : BUILD.isDev  , 
  a && r ? i[i.length - 1].$text$ += n : i.push(a ? newVNode(null, n) : n), r = a);
 };
 if (d(o), t && (t.key && (s = t.key), 
 t.name && (l = t.name), BUILD.vdomClass)) {
  const e = t.className || t.class;
  e && (t.class = "object" != typeof e ? e : Object.keys(e).filter((t => e[t])).join(" "));
 }
 if ("function" == typeof e) return e(null === t ? {} : t, i, vdomFnUtils);
 const c = newVNode(e, null);
 return c.$attrs$ = t, i.length > 0 && (c.$children$ = i), (c.$key$ = s), 
 (c.$name$ = l), c;
}, newVNode = (e, t) => {
 const o = {
  $flags$: 0,
  $tag$: e,
  $text$: t,
  $elm$: null,
  $children$: null
 };
 return (o.$attrs$ = null), (o.$key$ = null), 
 (o.$name$ = null), o;
}, Host = {}, isHost = e => e && e.$tag$ === Host, vdomFnUtils = {
 forEach: (e, t) => e.map(convertToPublic).forEach(t),
 map: (e, t) => e.map(convertToPublic).map(t).map(convertToPrivate)
}, convertToPublic = e => ({
 vattrs: e.$attrs$,
 vchildren: e.$children$,
 vkey: e.$key$,
 vname: e.$name$,
 vtag: e.$tag$,
 vtext: e.$text$
}), convertToPrivate = e => {
 if ("function" == typeof e.vtag) {
  const t = {
   ...e.vattrs
  };
  return e.vkey && (t.key = e.vkey), e.vname && (t.name = e.vname), h(e.vtag, t, ...e.vchildren || []);
 }
 const t = newVNode(e.vtag, e.vtext);
 return t.$attrs$ = e.vattrs, t.$children$ = e.vchildren, t.$key$ = e.vkey, t.$name$ = e.vname, 
 t;
}, clientHydrate = (e, t, o, n, s, l, a) => {
 let r, i, d, c;
 if (1 === l.nodeType) {
  for (r = l.getAttribute("c-id"), r && (i = r.split("."), i[0] !== a && "0" !== i[0] || (d = {
   $flags$: 0,
   $hostId$: i[0],
   $nodeId$: i[1],
   $depth$: i[2],
   $index$: i[3],
   $tag$: l.tagName.toLowerCase(),
   $elm$: l,
   $attrs$: null,
   $children$: null,
   $key$: null,
   $name$: null,
   $text$: null
  }, t.push(d), l.removeAttribute("c-id"), e.$children$ || (e.$children$ = []), e.$children$[d.$index$] = d, 
  e = d, n && "0" === d.$depth$ && (n[d.$index$] = d.$elm$))), c = l.childNodes.length - 1; c >= 0; c--) clientHydrate(e, t, o, n, s, l.childNodes[c], a);
  if (l.shadowRoot) for (c = l.shadowRoot.childNodes.length - 1; c >= 0; c--) clientHydrate(e, t, o, n, s, l.shadowRoot.childNodes[c], a);
 } else if (8 === l.nodeType) i = l.nodeValue.split("."), i[1] !== a && "0" !== i[1] || (r = i[0], 
 d = {
  $flags$: 0,
  $hostId$: i[1],
  $nodeId$: i[2],
  $depth$: i[3],
  $index$: i[4],
  $elm$: l,
  $attrs$: null,
  $children$: null,
  $key$: null,
  $name$: null,
  $tag$: null,
  $text$: null
 }, "t" === r ? (d.$elm$ = l.nextSibling, d.$elm$ && 3 === d.$elm$.nodeType && (d.$text$ = d.$elm$.textContent, 
 t.push(d), l.remove(), e.$children$ || (e.$children$ = []), e.$children$[d.$index$] = d, 
 n && "0" === d.$depth$ && (n[d.$index$] = d.$elm$))) : d.$hostId$ === a && ("s" === r ? (d.$tag$ = "slot", 
 i[5] ? l["s-sn"] = d.$name$ = i[5] : l["s-sn"] = "", l["s-sr"] = !0, n && (d.$elm$ = doc.createElement(d.$tag$), 
 d.$name$ && d.$elm$.setAttribute("name", d.$name$), l.parentNode.insertBefore(d.$elm$, l), 
 l.remove(), "0" === d.$depth$ && (n[d.$index$] = d.$elm$)), o.push(d), e.$children$ || (e.$children$ = []), 
 e.$children$[d.$index$] = d) : "r" === r && (n ? l.remove() : (s["s-cr"] = l, 
 l["s-cn"] = !0)))); else if (e && "style" === e.$tag$) {
  const t = newVNode(null, l.textContent);
  t.$elm$ = l, t.$index$ = "0", e.$children$ = [ t ];
 }
}, initializeDocumentHydrate = (e, t) => {
 if (1 === e.nodeType) {
  let o = 0;
  for (;o < e.childNodes.length; o++) initializeDocumentHydrate(e.childNodes[o], t);
  if (e.shadowRoot) for (o = 0; o < e.shadowRoot.childNodes.length; o++) initializeDocumentHydrate(e.shadowRoot.childNodes[o], t);
 } else if (8 === e.nodeType) {
  const o = e.nodeValue.split(".");
  "o" === o[0] && (t.set(o[1] + "." + o[2], e), e.nodeValue = "", e["s-en"] = o[3]);
 }
}, parsePropertyValue = (e, t) => null == e || isComplexType(e) ? e : 4 & t ? "false" !== e && ("" === e || !!e) : 2 & t ? parseFloat(e) : 1 & t ? String(e) : e, getElement = e => getHostRef(e).$hostElement$ , emitEvent = (e, t, o) => {
 const n = plt.ce(t, o);
 return e.dispatchEvent(n), n;
}, rootAppliedStyles = new WeakMap, registerStyle = (e, t, o) => {
 let n = styles.get(e);
 n = t, styles.set(e, n);
}, addStyle = (e, t, o, n) => {
 var s;
 let l = getScopeId(t);
 const a = styles.get(l);
 if (e = 11 === e.nodeType ? e : doc, a) if ("string" == typeof a) {
  e = e.head || e;
  let o, r = rootAppliedStyles.get(e);
  if (r || rootAppliedStyles.set(e, r = new Set), !r.has(l)) {
   if (e.host && (o = e.querySelector(`[sty-id="${l}"]`))) o.innerHTML = a; else {
    o = doc.createElement("style"), o.innerHTML = a;
    const i = null !== (s = plt.$nonce$) && void 0 !== s ? s : queryNonceMetaTagContent(doc);
    null != i && o.setAttribute("nonce", i), o.setAttribute("sty-id", l), 
    e.insertBefore(o, e.querySelector("link"));
   }
   r && r.add(l);
  }
 }
 return l;
}, attachStyles = e => {
 const t = e.$cmpMeta$, o = e.$hostElement$, n = t.$flags$, s = createTime("attachStyles", t.$tagName$), l = addStyle(o.getRootNode(), t);
 10 & n && (o["s-sc"] = l, 
 o.classList.add(l + "-h"), BUILD.scoped  ), 
 s();
}, getScopeId = (e, t) => "sc-" + (e.$tagName$), setAccessor = (e, t, o, n, s, l) => {
 if (o !== n) {
  let a = isMemberInElement(e, t), r = t.toLowerCase();
  if ("class" === t) {
   const t = e.classList, s = parseClassList(o), l = parseClassList(n);
   t.remove(...s.filter((e => e && !l.includes(e)))), t.add(...l.filter((e => e && !s.includes(e))));
  } else if ("key" === t) ; else if ((a ) || "o" !== t[0] || "n" !== t[1]) {
   {
    const i = isComplexType(n);
    if ((a || i && null !== n) && !s) try {
     if (e.tagName.includes("-")) e[t] = n; else {
      const s = null == n ? "" : n;
      "list" === t ? a = !1 : null != o && e[t] == s || (e[t] = s);
     }
    } catch (e) {}
    null == n || !1 === n ? !1 === n && "" !== e.getAttribute(t) || (e.removeAttribute(t)) : (!a || 4 & l || s) && !i && (n = !0 === n ? "" : n, 
    e.setAttribute(t, n));
   }
  } else t = "-" === t[2] ? t.slice(3) : isMemberInElement(win, r) ? r.slice(2) : r[2] + t.slice(3), 
  o && plt.rel(e, t, o, !1), n && plt.ael(e, t, n, !1);
 }
}, parseClassListRegex = /\s/, parseClassList = e => e ? e.split(parseClassListRegex) : [], updateElement = (e, t, o, n) => {
 const s = 11 === t.$elm$.nodeType && t.$elm$.host ? t.$elm$.host : t.$elm$, l = e && e.$attrs$ || EMPTY_OBJ, a = t.$attrs$ || EMPTY_OBJ;
 for (n in l) n in a || setAccessor(s, n, l[n], void 0, o, t.$flags$);
 for (n in a) setAccessor(s, n, l[n], a[n], o, t.$flags$);
};

let scopeId, contentRef, hostTagName, useNativeShadowDom = !1, checkSlotFallbackVisibility = !1, checkSlotRelocate = !1, isSvgMode = !1;

const createElm = (e, t, o, n) => {
 const s = t.$children$[o];
 let l, a, r, i = 0;
 if (!useNativeShadowDom && (checkSlotRelocate = !0, "slot" === s.$tag$ && (scopeId && n.classList.add(scopeId + "-s"), 
 s.$flags$ |= s.$children$ ? 2 : 1)), null !== s.$text$) l = s.$elm$ = doc.createTextNode(s.$text$); else if (1 & s.$flags$) l = s.$elm$ = slotReferenceDebugNode(s) ; else {
  if (!isSvgMode && (isSvgMode = "svg" === s.$tag$), l = s.$elm$ = doc.createElementNS(isSvgMode ? "http://www.w3.org/2000/svg" : "http://www.w3.org/1999/xhtml", 2 & s.$flags$ ? "slot-fb" : s.$tag$) , 
  isSvgMode && "foreignObject" === s.$tag$ && (isSvgMode = !1), updateElement(null, s, isSvgMode), 
  null != scopeId && l["s-si"] !== scopeId && l.classList.add(l["s-si"] = scopeId), 
  s.$children$) for (i = 0; i < s.$children$.length; ++i) a = createElm(e, s, i, l), 
  a && l.appendChild(a);
  ("svg" === s.$tag$ ? isSvgMode = !1 : "foreignObject" === l.tagName && (isSvgMode = !0));
 }
 return (l["s-hn"] = hostTagName, 3 & s.$flags$ && (l["s-sr"] = !0, 
 l["s-cr"] = contentRef, l["s-sn"] = s.$name$ || "", r = e && e.$children$ && e.$children$[o], 
 r && r.$tag$ === s.$tag$ && e.$elm$ && putBackInOriginalLocation(e.$elm$, !1))), 
 l;
}, putBackInOriginalLocation = (e, t) => {
 plt.$flags$ |= 1;
 const o = e.childNodes;
 for (let e = o.length - 1; e >= 0; e--) {
  const n = o[e];
  n["s-hn"] !== hostTagName && n["s-ol"] && (parentReferenceNode(n).insertBefore(n, referenceNode(n)), 
  n["s-ol"].remove(), n["s-ol"] = void 0, checkSlotRelocate = !0), t && putBackInOriginalLocation(n, t);
 }
 plt.$flags$ &= -2;
}, addVnodes = (e, t, o, n, s, l) => {
 let a, r = e["s-cr"] && e["s-cr"].parentNode || e;
 for (r.shadowRoot && r.tagName === hostTagName && (r = r.shadowRoot); s <= l; ++s) n[s] && (a = createElm(null, o, s, e), 
 a && (n[s].$elm$ = a, r.insertBefore(a, referenceNode(t) )));
}, removeVnodes = (e, t, o) => {
 for (let n = t; n <= o; ++n) {
  const t = e[n];
  if (t) {
   const e = t.$elm$;
   e && ((checkSlotFallbackVisibility = !0, 
   e["s-ol"] ? e["s-ol"].remove() : putBackInOriginalLocation(e, !0)), e.remove());
  }
 }
}, isSameVnode = (e, t) => e.$tag$ === t.$tag$ && ("slot" === e.$tag$ ? e.$name$ === t.$name$ : e.$key$ === t.$key$), referenceNode = e => e && e["s-ol"] || e, parentReferenceNode = e => (e["s-ol"] ? e["s-ol"] : e).parentNode, patch = (e, t) => {
 const o = t.$elm$ = e.$elm$, n = e.$children$, s = t.$children$, l = t.$tag$, a = t.$text$;
 let r;
 null !== a ? (r = o["s-cr"]) ? r.parentNode.textContent = a : e.$text$ !== a && (o.data = a) : ((isSvgMode = "svg" === l || "foreignObject" !== l && isSvgMode), 
 (updateElement(e, t, isSvgMode)), 
 null !== n && null !== s ? ((e, t, o, n) => {
  let s, l, a = 0, r = 0, i = 0, d = 0, c = t.length - 1, $ = t[0], m = t[c], p = n.length - 1, u = n[0], h = n[p];
  for (;a <= c && r <= p; ) if (null == $) $ = t[++a]; else if (null == m) m = t[--c]; else if (null == u) u = n[++r]; else if (null == h) h = n[--p]; else if (isSameVnode($, u)) patch($, u), 
  $ = t[++a], u = n[++r]; else if (isSameVnode(m, h)) patch(m, h), m = t[--c], h = n[--p]; else if (isSameVnode($, h)) "slot" !== $.$tag$ && "slot" !== h.$tag$ || putBackInOriginalLocation($.$elm$.parentNode, !1), 
  patch($, h), e.insertBefore($.$elm$, m.$elm$.nextSibling), $ = t[++a], h = n[--p]; else if (isSameVnode(m, u)) "slot" !== $.$tag$ && "slot" !== h.$tag$ || putBackInOriginalLocation(m.$elm$.parentNode, !1), 
  patch(m, u), e.insertBefore(m.$elm$, $.$elm$), m = t[--c], u = n[++r]; else {
   if (i = -1, BUILD.vdomKey) for (d = a; d <= c; ++d) if (t[d] && null !== t[d].$key$ && t[d].$key$ === u.$key$) {
    i = d;
    break;
   }
   i >= 0 ? (l = t[i], l.$tag$ !== u.$tag$ ? s = createElm(t && t[r], o, i, e) : (patch(l, u), 
   t[i] = void 0, s = l.$elm$), u = n[++r]) : (s = createElm(t && t[r], o, r, e), u = n[++r]), 
   s && (parentReferenceNode($.$elm$).insertBefore(s, referenceNode($.$elm$)) );
  }
  a > c ? addVnodes(e, null == n[p + 1] ? null : n[p + 1].$elm$, o, n, r, p) : r > p && removeVnodes(t, a, c);
 })(o, n, t, s) : null !== s ? (null !== e.$text$ && (o.textContent = ""), 
 addVnodes(o, null, t, s, 0, s.length - 1)) : null !== n && removeVnodes(n, 0, n.length - 1), 
 isSvgMode && "svg" === l && (isSvgMode = !1));
}, updateFallbackSlotVisibility = e => {
 const t = e.childNodes;
 let o, n, s, l, a, r;
 for (n = 0, s = t.length; n < s; n++) if (o = t[n], 1 === o.nodeType) {
  if (o["s-sr"]) for (a = o["s-sn"], o.hidden = !1, l = 0; l < s; l++) if (r = t[l].nodeType, 
  t[l]["s-hn"] !== o["s-hn"] || "" !== a) {
   if (1 === r && a === t[l].getAttribute("slot")) {
    o.hidden = !0;
    break;
   }
  } else if (1 === r || 3 === r && "" !== t[l].textContent.trim()) {
   o.hidden = !0;
   break;
  }
  updateFallbackSlotVisibility(o);
 }
}, relocateNodes = [], relocateSlotContent = e => {
 let t, o, n, s, l, a, r = 0;
 const i = e.childNodes, d = i.length;
 for (;r < d; r++) {
  if (t = i[r], t["s-sr"] && (o = t["s-cr"]) && o.parentNode) for (n = o.parentNode.childNodes, 
  s = t["s-sn"], a = n.length - 1; a >= 0; a--) o = n[a], o["s-cn"] || o["s-nr"] || o["s-hn"] === t["s-hn"] || (isNodeLocatedInSlot(o, s) ? (l = relocateNodes.find((e => e.$nodeToRelocate$ === o)), 
  checkSlotFallbackVisibility = !0, o["s-sn"] = o["s-sn"] || s, l ? l.$slotRefNode$ = t : relocateNodes.push({
   $slotRefNode$: t,
   $nodeToRelocate$: o
  }), o["s-sr"] && relocateNodes.map((e => {
   isNodeLocatedInSlot(e.$nodeToRelocate$, o["s-sn"]) && (l = relocateNodes.find((e => e.$nodeToRelocate$ === o)), 
   l && !e.$slotRefNode$ && (e.$slotRefNode$ = l.$slotRefNode$));
  }))) : relocateNodes.some((e => e.$nodeToRelocate$ === o)) || relocateNodes.push({
   $nodeToRelocate$: o
  }));
  1 === t.nodeType && relocateSlotContent(t);
 }
}, isNodeLocatedInSlot = (e, t) => 1 === e.nodeType ? null === e.getAttribute("slot") && "" === t || e.getAttribute("slot") === t : e["s-sn"] === t || "" === t, renderVdom = (e, t) => {
 const o = e.$hostElement$, s = e.$vnode$ || newVNode(null, null), l = isHost(t) ? t : h(null, null, t);
 if (hostTagName = o.tagName, BUILD.isDev  ) ;
 if (l.$tag$ = null, l.$flags$ |= 4, e.$vnode$ = l, l.$elm$ = s.$elm$ = o.shadowRoot || o, 
 (scopeId = o["s-sc"]), (contentRef = o["s-cr"], 
 useNativeShadowDom = supportsShadow, checkSlotFallbackVisibility = !1), patch(s, l), 
 BUILD.slotRelocation) {
  if (plt.$flags$ |= 1, checkSlotRelocate) {
   let e, t, o, n, s, a;
   relocateSlotContent(l.$elm$);
   let r = 0;
   for (;r < relocateNodes.length; r++) e = relocateNodes[r], t = e.$nodeToRelocate$, 
   t["s-ol"] || (o = originalLocationDebugNode(t) , 
   o["s-nr"] = t, t.parentNode.insertBefore(t["s-ol"] = o, t));
   for (r = 0; r < relocateNodes.length; r++) if (e = relocateNodes[r], t = e.$nodeToRelocate$, 
   e.$slotRefNode$) {
    for (n = e.$slotRefNode$.parentNode, s = e.$slotRefNode$.nextSibling, o = t["s-ol"]; o = o.previousSibling; ) if (a = o["s-nr"], 
    a && a["s-sn"] === t["s-sn"] && n === a.parentNode && (a = a.nextSibling, !a || !a["s-nr"])) {
     s = a;
     break;
    }
    (!s && n !== t.parentNode || t.nextSibling !== s) && t !== s && (!t["s-hn"] && t["s-ol"] && (t["s-hn"] = t["s-ol"].parentNode.nodeName), 
    n.insertBefore(t, s));
   } else 1 === t.nodeType && (t.hidden = !0);
  }
  checkSlotFallbackVisibility && updateFallbackSlotVisibility(l.$elm$), plt.$flags$ &= -2, 
  relocateNodes.length = 0;
 }
}, slotReferenceDebugNode = e => doc.createComment(`<slot${e.$name$ ? ' name="' + e.$name$ + '"' : ""}> (host=${hostTagName.toLowerCase()})`), originalLocationDebugNode = e => doc.createComment("org-location for " + (e.localName ? `<${e.localName}> (host=${e["s-hn"]})` : `[${e.textContent}]`)), attachToAncestor = (e, t) => {
 t && !e.$onRenderResolve$ && t["s-p"] && t["s-p"].push(new Promise((t => e.$onRenderResolve$ = t)));
}, scheduleUpdate = (e, t) => {
 if ((e.$flags$ |= 16), 4 & e.$flags$) return void (e.$flags$ |= 512);
 attachToAncestor(e, e.$ancestorComponent$);
 const o = () => dispatchHooks(e, t);
 return writeTask(o) ;
}, dispatchHooks = (e, t) => {
 const n = createTime("scheduleUpdate", e.$cmpMeta$.$tagName$), s = e.$lazyInstance$ ;
 let l;
 return t ? ((e.$flags$ |= 256, e.$queuedListeners$ && (e.$queuedListeners$.map((([e, t]) => safeCall(s, e, t))), 
 e.$queuedListeners$ = void 0)), (l = safeCall(s, "componentWillLoad"))) : (BUILD.cmpWillUpdate ), n(), enqueue(l, (() => updateComponent(e, s, t)));
}, enqueue = (e, t) => e instanceof Promise ? e.then(t) : t(), updateComponent = async (e, t, o) => {
 var n;
 const s = e.$hostElement$, l = createTime("update", e.$cmpMeta$.$tagName$), a = s["s-rc"];
 o && attachStyles(e);
 const r = createTime("render", e.$cmpMeta$.$tagName$);
 if (await callRender(e, t) , 
 BUILD.hydrateServerSide) try {
  serverSideConnected(s), o && (1 & e.$cmpMeta$.$flags$ ? s["s-en"] = "" : 2 & e.$cmpMeta$.$flags$ && (s["s-en"] = "c"));
 } catch (e) {
  consoleError(e, s);
 }
 if (a && (a.map((e => e())), s["s-rc"] = void 0), r(), l(), 
 BUILD.asyncLoading) {
  const t = null !== (n = s["s-p"]) && void 0 !== n ? n : [], o = () => postUpdateComponent(e);
  0 === t.length ? o() : (Promise.all(t).then(o), e.$flags$ |= 4, t.length = 0);
 }
};

let renderingRef = null;

const callRender = (e, t, o) => {
 try {
  if (renderingRef = t, t = t.render(), (e.$flags$ &= -17), 
  (e.$flags$ |= 2), BUILD.hasRenderFn ) {
   return Promise.resolve(t).then((t => renderVdom(e, t)));
  }
 } catch (t) {
  consoleError(t, e.$hostElement$);
 }
 return renderingRef = null, null;
}, getRenderingRef = () => renderingRef, postUpdateComponent = e => {
 const t = e.$cmpMeta$.$tagName$, o = e.$hostElement$, n = createTime("postUpdate", t), s = e.$lazyInstance$ , l = e.$ancestorComponent$;
 (safeCall(s, "componentDidRender"), 
 BUILD.isDev ), 64 & e.$flags$ ? (n()) : (e.$flags$ |= 64, addHydratedFlag(o), 
 n(), (e.$onReadyResolve$(o), l || appDidLoad())), (e.$onRenderResolve$ && (e.$onRenderResolve$(), 
 e.$onRenderResolve$ = void 0), 512 & e.$flags$ && nextTick((() => scheduleUpdate(e, !1))), 
 e.$flags$ &= -517);
}, forceUpdate$1 = e => {
 {
  const t = getHostRef(e), o = t.$hostElement$.isConnected;
  return o && 2 == (18 & t.$flags$) && scheduleUpdate(t, !1), o;
 }
}, appDidLoad = e => {
 addHydratedFlag(doc.documentElement), nextTick((() => emitEvent(win, "appload", {
  detail: {
   namespace: NAMESPACE
  }
 }))), BUILD.profile  ;
}, safeCall = (e, t, o) => {
 if (e && e[t]) try {
  return e[t](o);
 } catch (e) {
  consoleError(e);
 }
}, addHydratedFlag = e => e.classList.add("hydrated") , serverSideConnected = e => {
 const t = e.children;
 if (null != t) for (let e = 0, o = t.length; e < o; e++) {
  const o = t[e];
  "function" == typeof o.connectedCallback && o.connectedCallback(), serverSideConnected(o);
 }
}, getValue = (e, t) => getHostRef(e).$instanceValues$.get(t), setValue = (e, t, o, n) => {
 const s = getHostRef(e), l = s.$hostElement$ , a = s.$instanceValues$.get(t), r = s.$flags$, i = s.$lazyInstance$ ;
 o = parsePropertyValue(o, n.$members$[t][0]);
 const d = Number.isNaN(a) && Number.isNaN(o), c = o !== a && !d;
 if ((!(8 & r) || void 0 === a) && c && (s.$instanceValues$.set(t, o), 
 i)) {
  if (n.$watchers$ && 128 & r) {
   const e = n.$watchers$[t];
   e && e.map((e => {
    try {
     i[e](o, a, t);
    } catch (e) {
     consoleError(e, l);
    }
   }));
  }
  if (2 == (18 & r)) {
   scheduleUpdate(s, !1);
  }
 }
}, proxyComponent = (e, t, o) => {
 if (t.$members$) {
  e.watchers && (t.$watchers$ = e.watchers);
  const n = Object.entries(t.$members$), s = e.prototype;
  if (n.map((([e, [n]]) => {
   (31 & n || (2 & o) && 32 & n) ? Object.defineProperty(s, e, {
    get() {
     return getValue(this, e);
    },
    set(s) {
     setValue(this, e, s, t);
    },
    configurable: !0,
    enumerable: !0
   }) : BUILD.method   ;
  })), (1 & o)) {
   const o = new Map;
   s.attributeChangedCallback = function(e, t, n) {
    plt.jmp((() => {
     const t = o.get(e);
     if (this.hasOwnProperty(t)) n = this[t], delete this[t]; else if (s.hasOwnProperty(t) && "number" == typeof this[t] && this[t] == n) return;
     this[t] = (null !== n || "boolean" != typeof this[t]) && n;
    }));
   }, e.observedAttributes = n.filter((([e, t]) => 15 & t[0])).map((([e, n]) => {
    const s = n[1] || e;
    return o.set(s, e), s;
   }));
  }
 }
 return e;
}, initializeComponent = async (e, t, o, n, s) => {
 if (0 == (32 & t.$flags$)) {
  if (t.$flags$ |= 32, BUILD.lazyLoad ) {
   if ((s = loadModule(o)).then) {
    const e = (() => {});
    s = await s, e();
   }
   !s.isProxied && ((o.$watchers$ = s.watchers), 
   proxyComponent(s, o, 2), s.isProxied = !0);
   const e = createTime("createInstance", o.$tagName$);
   (t.$flags$ |= 8);
   try {
    new s(t);
   } catch (e) {
    consoleError(e);
   }
   (t.$flags$ &= -9), (t.$flags$ |= 128), e(), 
   fireConnectedCallback(t.$lazyInstance$);
  }
  if (s.style) {
   let n = s.style;
   const l = getScopeId(o);
   if (!styles.has(l)) {
    const e = createTime("registerStyles", o.$tagName$);
    registerStyle(l, n), e();
   }
  }
 }
 const r = t.$ancestorComponent$, i = () => scheduleUpdate(t, !0);
 r && r["s-rc"] ? r["s-rc"].push(i) : i();
}, fireConnectedCallback = e => {
 safeCall(e, "connectedCallback");
}, connectedCallback = e => {
 if (0 == (1 & plt.$flags$)) {
  const t = getHostRef(e), o = t.$cmpMeta$, n = createTime("connectedCallback", o.$tagName$);
  if (1 & t.$flags$) addHostEventListeners(e, t, o.$listeners$), fireConnectedCallback(t.$lazyInstance$); else {
   let n;
   if (t.$flags$ |= 1, (n = e.getAttribute("s-id"), n)) {
    ((e, t, o, n) => {
     const s = createTime("hydrateClient", t), l = e.shadowRoot, a = [], r = l ? [] : null, i = n.$vnode$ = newVNode(t, null);
     plt.$orgLocNodes$ || initializeDocumentHydrate(doc.body, plt.$orgLocNodes$ = new Map), 
     e["s-id"] = o, e.removeAttribute("s-id"), clientHydrate(i, a, [], r, e, e, o), a.map((e => {
      const o = e.$hostId$ + "." + e.$nodeId$, n = plt.$orgLocNodes$.get(o), s = e.$elm$;
      n && supportsShadow && "" === n["s-en"] && n.parentNode.insertBefore(s, n.nextSibling), 
      l || (s["s-hn"] = t, n && (s["s-ol"] = n, s["s-ol"]["s-nr"] = s)), plt.$orgLocNodes$.delete(o);
     })), l && r.map((e => {
      e && l.appendChild(e);
     })), s();
    })(e, o.$tagName$, n, t);
   }
   if (!n && (BUILD.hydrateServerSide ) && setContentReference(e), 
   BUILD.asyncLoading) {
    let o = e;
    for (;o = o.parentNode || o.host; ) if (1 === o.nodeType && o.hasAttribute("s-id") && o["s-p"] || o["s-p"]) {
     attachToAncestor(t, t.$ancestorComponent$ = o);
     break;
    }
   }
   initializeComponent(e, t, o);
  }
  n();
 }
}, setContentReference = e => {
 const t = e["s-cr"] = doc.createComment("");
 t["s-cn"] = !0, e.insertBefore(t, e.firstChild);
}, addHostEventListeners = (e, t, o, n) => {
 o && (o.map((([o, n, s]) => {
  const l = getHostListenerTarget(e, o) , a = hostListenerProxy(t, s), r = hostListenerOpts(o);
  plt.ael(l, n, a, r), (t.$rmListeners$ = t.$rmListeners$ || []).push((() => plt.rel(l, n, a, r)));
 })));
}, hostListenerProxy = (e, t) => o => {
 try {
  256 & e.$flags$ ? e.$lazyInstance$[t](o) : (e.$queuedListeners$ = e.$queuedListeners$ || []).push([ t, o ]) ;
 } catch (e) {
  consoleError(e);
 }
}, getHostListenerTarget = (e, t) => 8 & t ? win : e, hostListenerOpts = e => 0 != (2 & e), insertVdomAnnotations = (e, t) => {
 if (null != e) {
  const o = {
   hostIds: 0,
   rootLevelIds: 0,
   staticComponents: new Set(t)
  }, n = [];
  parseVNodeAnnotations(e, e.body, o, n), n.forEach((t => {
   if (null != t) {
    const n = t["s-nr"];
    let s = n["s-host-id"], l = n["s-node-id"], a = `${s}.${l}`;
    if (null == s) if (s = 0, o.rootLevelIds++, l = o.rootLevelIds, a = `${s}.${l}`, 
    1 === n.nodeType) n.setAttribute("c-id", a); else if (3 === n.nodeType) {
     if (0 === s && "" === n.nodeValue.trim()) return void t.remove();
     const o = e.createComment(a);
     o.nodeValue = `t.${a}`, n.parentNode.insertBefore(o, n);
    }
    let r = `o.${a}`;
    const i = t.parentElement;
    i && ("" === i["s-en"] ? r += "." : "c" === i["s-en"] && (r += ".c")), t.nodeValue = r;
   }
  }));
 }
}, parseVNodeAnnotations = (e, t, o, n) => {
 null != t && (null != t["s-nr"] && n.push(t), 1 === t.nodeType && t.childNodes.forEach((t => {
  const s = getHostRef(t);
  if (null != s && !o.staticComponents.has(t.nodeName.toLowerCase())) {
   const n = {
    nodeIds: 0
   };
   insertVNodeAnnotations(e, t, s.$vnode$, o, n);
  }
  parseVNodeAnnotations(e, t, o, n);
 })));
}, insertVNodeAnnotations = (e, t, o, n, s) => {
 if (null != o) {
  const l = ++n.hostIds;
  if (t.setAttribute("s-id", l), null != t["s-cr"] && (t["s-cr"].nodeValue = `r.${l}`), 
  null != o.$children$) {
   const t = 0;
   o.$children$.forEach(((o, n) => {
    insertChildVNodeAnnotations(e, o, s, l, t, n);
   }));
  }
  if (t && o && o.$elm$ && !t.hasAttribute("c-id")) {
   const e = t.parentElement;
   if (e && e.childNodes) {
    const n = Array.from(e.childNodes), s = n.find((e => 8 === e.nodeType && e["s-sr"]));
    if (s) {
     const e = n.indexOf(t) - 1;
     o.$elm$.setAttribute("c-id", `${s["s-host-id"]}.${s["s-node-id"]}.0.${e}`);
    }
   }
  }
 }
}, insertChildVNodeAnnotations = (e, t, o, n, s, l) => {
 const a = t.$elm$;
 if (null == a) return;
 const r = o.nodeIds++, i = `${n}.${r}.${s}.${l}`;
 if (a["s-host-id"] = n, a["s-node-id"] = r, 1 === a.nodeType) a.setAttribute("c-id", i); else if (3 === a.nodeType) {
  const t = a.parentNode, o = t.nodeName;
  if ("STYLE" !== o && "SCRIPT" !== o) {
   const o = `t.${i}`, n = e.createComment(o);
   t.insertBefore(n, a);
  }
 } else if (8 === a.nodeType && a["s-sr"]) {
  const e = `s.${i}.${a["s-sn"] || ""}`;
  a.nodeValue = e;
 }
 if (null != t.$children$) {
  const l = s + 1;
  t.$children$.forEach(((t, s) => {
   insertChildVNodeAnnotations(e, t, o, n, l, s);
  }));
 }
}, hAsync = (e, t, ...o) => {
 if (Array.isArray(o) && o.length > 0) {
  const n = o.flat(1 / 0);
  return n.some(isPromise) ? Promise.all(n).then((o => h(e, t, ...o))).catch((o => h(e, t))) : h(e, t, ...o);
 }
 return h(e, t);
}, NO_HYDRATE_TAGS = new Set([ "CODE", "HEAD", "IFRAME", "INPUT", "OBJECT", "OUTPUT", "NOSCRIPT", "PRE", "SCRIPT", "SELECT", "STYLE", "TEMPLATE", "TEXTAREA" ]);

const cmpModules = new Map, getModule = e => {
 if ("string" == typeof e) {
  e = e.toLowerCase();
  const t = cmpModules.get(e);
  if (null != t) return t[e];
 }
 return null;
}, loadModule = (e, t, o) => getModule(e.$tagName$), isMemberInElement = (e, t) => {
 if (null != e) {
  if (t in e) return !0;
  const o = getModule(e.nodeName);
  if (null != o) {
   const e = o;
   if (null != e && null != e.cmpMeta && null != e.cmpMeta.$members$) return t in e.cmpMeta.$members$;
  }
 }
 return !1;
}, registerComponents = e => {
 for (const t of e) {
  const e = t.cmpMeta.$tagName$;
  cmpModules.set(e, {
   [e]: t
  });
 }
}, win = window, doc = win.document, writeTask = e => {
 process__default['default'].nextTick((() => {
  try {
   e();
  } catch (e) {
   consoleError(e);
  }
 }));
}, resolved = Promise.resolve(), nextTick = e => resolved.then(e), defaultConsoleError = e => {
 null != e && console.error(e.stack || e.message || e);
}, consoleError = (e, t) => (defaultConsoleError)(e, t), plt = {
 $flags$: 0,
 $resourcesUrl$: "",
 jmp: e => e(),
 raf: e => requestAnimationFrame(e),
 ael: (e, t, o, n) => e.addEventListener(t, o, n),
 rel: (e, t, o, n) => e.removeEventListener(t, o, n),
 ce: (e, t) => new win.CustomEvent(e, t)
}, supportsShadow = !1, hostRefs = new WeakMap, getHostRef = e => hostRefs.get(e), registerInstance = (e, t) => hostRefs.set(t.$lazyInstance$ = e, t), registerHost = (e, t) => {
 const o = {
  $flags$: 0,
  $cmpMeta$: t,
  $hostElement$: e,
  $instanceValues$: new Map,
  $renderCount$: 0
 };
 return o.$onInstancePromise$ = new Promise((e => o.$onInstanceResolve$ = e)), o.$onReadyPromise$ = new Promise((e => o.$onReadyResolve$ = e)), 
 e["s-p"] = [], e["s-rc"] = [], addHostEventListeners(e, o, t.$listeners$), hostRefs.set(e, o);
}, Build = {
 isDev: !1,
 isBrowser: !1,
 isServer: !0,
 isTesting: !1
}, styles = new Map;

class PubSub {
  constructor() {
    this.subscribers = {};
  }
  subscribe(eventName, callback) {
    if (!this.subscribers[eventName]) {
      this.subscribers[eventName] = [];
    }
    this.subscribers[eventName].push(callback);
  }
  unsubscribe(eventName) {
    if (this.subscribers[eventName]) {
      delete this.subscribers[eventName];
    }
  }
  publish(eventName, ...args) {
    const eventSubscribers = this.subscribers[eventName];
    if (eventSubscribers) {
      eventSubscribers.forEach(callback => {
        callback(...args);
      });
    }
  }
}

const appendToMap = (map, propName, value) => {
    const items = map.get(propName);
    if (!items) {
        map.set(propName, [value]);
    }
    else if (!items.includes(value)) {
        items.push(value);
    }
};
const debounce$1 = (fn, ms) => {
    let timeoutId;
    return (...args) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            timeoutId = 0;
            fn(...args);
        }, ms);
    };
};

/**
 * Check if a possible element isConnected.
 * The property might not be there, so we check for it.
 *
 * We want it to return true if isConnected is not a property,
 * otherwise we would remove these elements and would not update.
 *
 * Better leak in Edge than to be useless.
 */
const isConnected = (maybeElement) => !('isConnected' in maybeElement) || maybeElement.isConnected;
const cleanupElements = debounce$1((map) => {
    for (let key of map.keys()) {
        map.set(key, map.get(key).filter(isConnected));
    }
}, 2000);
const stencilSubscription = () => {
    if (typeof getRenderingRef !== 'function') {
        // If we are not in a stencil project, we do nothing.
        // This function is not really exported by @stencil/core.
        return {};
    }
    const elmsToUpdate = new Map();
    return {
        dispose: () => elmsToUpdate.clear(),
        get: (propName) => {
            const elm = getRenderingRef();
            if (elm) {
                appendToMap(elmsToUpdate, propName, elm);
            }
        },
        set: (propName) => {
            const elements = elmsToUpdate.get(propName);
            if (elements) {
                elmsToUpdate.set(propName, elements.filter(forceUpdate$1));
            }
            cleanupElements(elmsToUpdate);
        },
        reset: () => {
            elmsToUpdate.forEach((elms) => elms.forEach(forceUpdate$1));
            cleanupElements(elmsToUpdate);
        },
    };
};

const unwrap = (val) => (typeof val === 'function' ? val() : val);
const createObservableMap = (defaultState, shouldUpdate = (a, b) => a !== b) => {
    const unwrappedState = unwrap(defaultState);
    let states = new Map(Object.entries(unwrappedState !== null && unwrappedState !== void 0 ? unwrappedState : {}));
    const handlers = {
        dispose: [],
        get: [],
        set: [],
        reset: [],
    };
    const reset = () => {
        var _a;
        // When resetting the state, the default state may be a function - unwrap it to invoke it.
        // otherwise, the state won't be properly reset
        states = new Map(Object.entries((_a = unwrap(defaultState)) !== null && _a !== void 0 ? _a : {}));
        handlers.reset.forEach((cb) => cb());
    };
    const dispose = () => {
        // Call first dispose as resetting the state would
        // cause less updates ;)
        handlers.dispose.forEach((cb) => cb());
        reset();
    };
    const get = (propName) => {
        handlers.get.forEach((cb) => cb(propName));
        return states.get(propName);
    };
    const set = (propName, value) => {
        const oldValue = states.get(propName);
        if (shouldUpdate(value, oldValue, propName)) {
            states.set(propName, value);
            handlers.set.forEach((cb) => cb(propName, value, oldValue));
        }
    };
    const state = (typeof Proxy === 'undefined'
        ? {}
        : new Proxy(unwrappedState, {
            get(_, propName) {
                return get(propName);
            },
            ownKeys(_) {
                return Array.from(states.keys());
            },
            getOwnPropertyDescriptor() {
                return {
                    enumerable: true,
                    configurable: true,
                };
            },
            has(_, propName) {
                return states.has(propName);
            },
            set(_, propName, value) {
                set(propName, value);
                return true;
            },
        }));
    const on = (eventName, callback) => {
        handlers[eventName].push(callback);
        return () => {
            removeFromArray(handlers[eventName], callback);
        };
    };
    const onChange = (propName, cb) => {
        const unSet = on('set', (key, newValue) => {
            if (key === propName) {
                cb(newValue);
            }
        });
        // We need to unwrap the defaultState because it might be a function.
        // Otherwise we might not be sending the right reset value.
        const unReset = on('reset', () => cb(unwrap(defaultState)[propName]));
        return () => {
            unSet();
            unReset();
        };
    };
    const use = (...subscriptions) => {
        const unsubs = subscriptions.reduce((unsubs, subscription) => {
            if (subscription.set) {
                unsubs.push(on('set', subscription.set));
            }
            if (subscription.get) {
                unsubs.push(on('get', subscription.get));
            }
            if (subscription.reset) {
                unsubs.push(on('reset', subscription.reset));
            }
            if (subscription.dispose) {
                unsubs.push(on('dispose', subscription.dispose));
            }
            return unsubs;
        }, []);
        return () => unsubs.forEach((unsub) => unsub());
    };
    const forceUpdate = (key) => {
        const oldValue = states.get(key);
        handlers.set.forEach((cb) => cb(key, oldValue, oldValue));
    };
    return {
        state,
        get,
        set,
        on,
        onChange,
        use,
        dispose,
        reset,
        forceUpdate,
    };
};
const removeFromArray = (array, item) => {
    const index = array.indexOf(item);
    if (index >= 0) {
        array[index] = array[array.length - 1];
        array.length--;
    }
};

const createStore = (defaultState, shouldUpdate) => {
    const map = createObservableMap(defaultState, shouldUpdate);
    map.use(stencilSubscription());
    return map;
};

const { state } = createStore({
  placements: {},
});
const getPlacementFromStore = (key) => {
  return state.placements[key] || null;
};
const setPlacementToStore = (key, values) => {
  state.placements[key] = values;
};

var __rest = (undefined && undefined.__rest) || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
    t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
};
const pubSub = new PubSub();
const fetchPlacement = (params, devMode) => {
  const { placement_id: placementId, property_id: propertyId = 1 } = params, restParams = __rest(params, ["placement_id", "property_id"]);
  const query = getQueryParamString(restParams);
  const baseUrl = getBaseUrl(devMode);
  const url = `${baseUrl}/v1/affiliate/properties/${propertyId}/placements/${placementId}/promotions${query}`;
  // eslint-disable-next-line no-console
  const fetchErr = (res) => console.error(res);
  return fetch(url)
    .then(res => {
    if (!res.ok) {
      return fetchErr(res);
    }
    return res.status !== 204 && res.json();
  })
    .catch(fetchErr);
};
async function getPlacement(params, cb, devMode = false, componentType) {
  const hasMissingParams = requiredParamsCheck({
    property_id: params.property_id,
    placement_id: params.placement_id,
  }, componentType);
  if (hasMissingParams) {
    return;
  }
  const { location } = params;
  const paidMarketing = getQueryParamFromUrl('paidMarketing');
  if (paidMarketing && isValidPaidMarketingParam(paidMarketing)) {
    params.paid_marketing = paidMarketing;
  }
  const sortedParams = {};
  Object.keys(params)
    .sort()
    .forEach(key => (sortedParams[key] = params[key]));
  const placementKey = getQueryParamString(sortedParams);
  let placement = getPlacementFromStore(placementKey);
  if (!placement) {
    // CASE -- placement does not exist in the store
    // set isLoading to true so other components don't fetch as well
    placement = { isLoading: true, data: null };
    setPlacementToStore(placementKey, placement);
    const placementData = await fetchPlacement(params, devMode);
    // If request failed, placement doesn't exist, or it is inactive then set isLoading to false and do nothing
    if (!placementData || !placementData.is_active) {
      setPlacementToStore(placementKey, Object.assign(Object.assign({}, placement), { isLoading: false }));
      return;
    }
    // publish the fetched data to the pubSub
    pubSub.publish(placementKey, placementData);
    // update the placement data and set isLoading to false
    // then update the placement in the store
    placement = { isLoading: false, data: placementData };
    setPlacementToStore(placementKey, placement);
    const locationToUse = location || placement.data.location;
    cb ? cb(placement.data, locationToUse) : (this.placement = placement.data);
  }
  else {
    // CASE -- placement exists in the store
    if (!placement.isLoading) {
      // CASE -- the placement is not loading
      // if data doesn't exist or is inactive then early return
      if (!placement.data || !placement.data.is_active) {
        return;
      }
      const locationToUse = location || placement.data.location;
      cb ? cb(placement.data, locationToUse) : (this.placement = placement.data);
    }
    else {
      // CASE -- the placement is loading
      // subscribe to the pubSub with the placementKey
      pubSub.subscribe(placementKey, placementData => {
        // unsubscribe from the pubSub after data is published
        pubSub.unsubscribe(placementKey);
        const locationToUse = location || placementData.location;
        cb ? cb(placementData, locationToUse) : (this.placement = placementData);
      });
    }
  }
}

const BANNER_BREAKPOINT = 800;
function getImageSize(width) {
  return width > BANNER_BREAKPOINT ? 'desktopBanner' : 'mobileBanner';
}
function isExpired(timeString) {
  return new Date(timeString).getTime() < new Date().getTime();
}
function getPromos(placement) {
  const promotions = placement.promotions;
  const canUseAlternateLink = placement.allow_alternate_link;
  const promotionListId = placement.id;
  const formattedPromotions = promotions.map(promotion => ({
    id: promotion.id,
    bookId: promotion.affiliate.id,
    campaignId: promotion.campaign.id,
    promotionListId: promotionListId,
    isActive: promotion.expires_at ? !isExpired(promotion.expires_at) : false,
    desktopBanner: getPromotionImage(promotion.images, 'desktop_banner') || '',
    mobileBanner: getPromotionImage(promotion.images, 'app_game_page_ad') || '',
    logoColor: promotion.affiliate.primary_color || '',
    alternateLink: canUseAlternateLink && promotion.alternate_link ? promotion.alternate_link : '',
    impressionUrls: promotion.additional_attributes.impression_urls || [],
    switchboard_domain: promotion.switchboard_domain || null,
  }));
  const activePromosWithBanners = formattedPromotions.filter(promotion => !!promotion.desktopBanner && !!promotion.mobileBanner && promotion.isActive);
  return activePromosWithBanners;
}

const bamBannerCss = "/*!@:host*/.sc-bam-banner-h{width:100%}";

class BamBanner {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.placementId = undefined;
    this.propertyId = undefined;
    this.context = undefined;
    this.location = undefined;
    this.pageSlug = undefined;
    this.subscriptionTier = undefined;
    this.wasPro = undefined;
    this.subdivision = undefined;
    this.league = undefined;
    this.gameId = undefined;
    this.ctaType = undefined;
    this.isMobile = undefined;
    this.deviceType = undefined;
    this.isBetsyncUser = undefined;
    this.defer = undefined;
    this.devMode = false;
    this.promotions = [];
    this.canUseAlternateLink = false;
    this.canRotate = false;
    this.parentWidth = undefined;
  }
  onDeferChange(newDeferValue) {
    if (!newDeferValue) {
      getPlacement({
        placement_id: this.placementId,
        property_id: this.propertyId,
        location: this.location,
        page_slug: this.pageSlug,
        subscription_tier: this.subscriptionTier,
        was_pro: this.wasPro,
        subdivision_id: this.subdivision,
        league: this.league,
        game_id: this.gameId,
        cta_type: this.ctaType,
        is_mobile: this.isMobile,
        device_type: this.deviceType,
        isBetsyncUser: this.isBetsyncUser,
      }, this.setNewPromosToState.bind(this), this.devMode, 'Banner');
    }
  }
  handleResize() {
    this.parentWidth = this.el.parentElement.getBoundingClientRect().width;
  }
  connectedCallback() {
    if (!this.defer && Build.isBrowser) {
      getPlacement({
        placement_id: this.placementId,
        property_id: this.propertyId,
        location: this.location,
        page_slug: this.pageSlug,
        subscription_tier: this.subscriptionTier,
        was_pro: this.wasPro,
        subdivision_id: this.subdivision,
        league: this.league,
        game_id: this.gameId,
        cta_type: this.ctaType,
        is_mobile: this.isMobile,
        device_type: this.deviceType,
        isBetsyncUser: this.isBetsyncUser,
      }, this.setNewPromosToState.bind(this), this.devMode, 'Banner');
    }
  }
  async componentWillLoad() {
    {
      const placement = await fetchPlacement({
        placement_id: this.placementId,
        property_id: this.propertyId,
        location: this.location,
        page_slug: this.pageSlug,
        subscription_tier: this.subscriptionTier,
        was_pro: this.wasPro,
        subdivision_id: this.subdivision,
        league: this.league,
        game_id: this.gameId,
        cta_type: this.ctaType,
        is_mobile: this.isMobile,
        device_type: this.deviceType,
        isBetsyncUser: this.isBetsyncUser,
      }, false);
      this.setNewPromosToState(placement);
    }
  }
  setNewPromosToState(placement) {
    if (placement.can_rotate) {
      this.canRotate = placement.can_rotate;
    }
    const filteredPromotions = getPromos(placement);
    const location = placement.location;
    const canUseAlternateLink = placement.allow_alternate_link;
    if (!filteredPromotions.length) {
      // eslint-disable-next-line no-console
      console.warn('BAM BANNER ERROR: No active promotions or promotions with banner images returned');
      this.promotions = filteredPromotions;
      return;
    }
    this.parentWidth = this.el.parentElement.getBoundingClientRect().width;
    this.promotions = filteredPromotions;
    this.location = location;
    this.canUseAlternateLink = canUseAlternateLink;
  }
  render() {
    const baseEventOptions = {
      placementId: this.placementId,
      league: this.league,
      pageSlug: this.pageSlug,
    };
    return !this.defer && this.promotions.length ? (hAsync(Host, null, this.canRotate ? (hAsync("rotating-banner", { "parent-width": this.parentWidth, promotions: this.promotions, propertyId: this.propertyId, context: this.context, location: this.location, "can-use-alternate-link": this.canUseAlternateLink, eventOptions: baseEventOptions })) : (hAsync("static-banner", { "parent-width": this.parentWidth, promotion: this.promotions[0], "property-id": this.propertyId, context: this.context, location: this.location, "can-use-alternate-link": this.canUseAlternateLink, eventOptions: Object.assign(Object.assign({}, baseEventOptions), { allPromotions: this.promotions }) })))) : null;
  }
  get el() { return getElement(this); }
  static get watchers() { return {
    "defer": ["onDeferChange"]
  }; }
  static get style() { return bamBannerCss; }
  static get cmpMeta() { return {
    "$flags$": 9,
    "$tagName$": "bam-banner",
    "$members$": {
      "placementId": [2, "placement-id"],
      "propertyId": [2, "property-id"],
      "context": [1],
      "location": [1025],
      "pageSlug": [1, "page-slug"],
      "subscriptionTier": [2, "subscription-tier"],
      "wasPro": [4, "was-pro"],
      "subdivision": [2],
      "league": [1],
      "gameId": [2, "game-id"],
      "ctaType": [1, "cta-type"],
      "isMobile": [4, "is-mobile"],
      "deviceType": [1, "device-type"],
      "isBetsyncUser": [4, "is-betsync-user"],
      "defer": [4],
      "devMode": [4, "dev-mode"],
      "promotions": [32],
      "canUseAlternateLink": [32],
      "canRotate": [32],
      "parentWidth": [32]
    },
    "$listeners$": [[9, "resize", "handleResize"]],
    "$lazyBundleId$": "-",
    "$attrsToReflect$": []
  }; }
}

const bamFooterCss = ".bam-footer__text{font-family:var(--font-family)}";

class BamFooter {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.location = '';
    this.devMode = false;
    this.termsText = undefined;
  }
  connectedCallback() {
  }
  async componentWillLoad() {
    {
      await this.fetchTermsText();
    }
  }
  async fetchTermsText() {
    try {
      let url = getBaseUrl(this.devMode) + '/v1/auxiliary/terms';
      if (this.location) {
        url = url + `?location=${this.location}`;
      }
      const res = await fetch(url);
      const response = await res.json();
      if (response === null || response === void 0 ? void 0 : response.terms) {
        const terms = response.terms;
        this.termsText = terms;
      }
    }
    catch (err) {
      // eslint-disable-next-line no-console
      console.error(`BAM Error fetching terms text: ${err}`);
    }
  }
  render() {
    return (hAsync(Host, null, hAsync("div", { class: "bam-footer" }, hAsync("div", { class: "bam-footer__text" }, this.termsText))));
  }
  static get style() { return bamFooterCss; }
  static get cmpMeta() { return {
    "$flags$": 0,
    "$tagName$": "bam-footer",
    "$members$": {
      "location": [1],
      "devMode": [4, "dev-mode"],
      "termsText": [32]
    },
    "$listeners$": undefined,
    "$lazyBundleId$": "-",
    "$attrsToReflect$": []
  }; }
}

const bamImageCss = "/*!@:host*/.sc-bam-image-h{width:100%}";

class BamImage {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.placementId = undefined;
    this.propertyId = undefined;
    this.context = undefined;
    this.location = undefined;
    this.pageSlug = undefined;
    this.subscriptionTier = undefined;
    this.wasPro = undefined;
    this.subdivision = undefined;
    this.league = undefined;
    this.gameId = undefined;
    this.ctaType = undefined;
    this.isMobile = undefined;
    this.deviceType = undefined;
    this.isBetsyncUser = undefined;
    this.defer = undefined;
    this.devMode = false;
    this.promotions = [];
    this.canUseAlternateLink = false;
    this.canRotate = false;
    this.parentWidth = undefined;
    this.parentHeight = undefined;
  }
  onDeferChange(newDeferValue) {
    if (!newDeferValue) {
      getPlacement({
        placement_id: this.placementId,
        property_id: this.propertyId,
        location: this.location,
        page_slug: this.pageSlug,
        subscription_tier: this.subscriptionTier,
        was_pro: this.wasPro,
        subdivision_id: this.subdivision,
        league: this.league,
        game_id: this.gameId,
        cta_type: this.ctaType,
        is_mobile: this.isMobile,
        device_type: this.deviceType,
        isBetsyncUser: this.isBetsyncUser,
      }, this.formatAndSetPromotionsToState.bind(this), this.devMode, 'Image');
    }
  }
  handleResize() {
    this.parentWidth = this.el.parentElement.clientWidth;
    this.parentHeight = this.el.parentElement.clientHeight;
  }
  connectedCallback() {
    this.parentWidth = this.el.parentElement.clientWidth;
    this.parentHeight = this.el.parentElement.clientHeight;
    if (!this.defer) {
      getPlacement({
        placement_id: this.placementId,
        property_id: this.propertyId,
        location: this.location,
        page_slug: this.pageSlug,
        subscription_tier: this.subscriptionTier,
        was_pro: this.wasPro,
        subdivision_id: this.subdivision,
        league: this.league,
        game_id: this.gameId,
        cta_type: this.ctaType,
        is_mobile: this.isMobile,
        device_type: this.deviceType,
        isBetsyncUser: this.isBetsyncUser,
      }, this.formatAndSetPromotionsToState.bind(this), this.devMode, 'Image');
    }
  }
  formatAndSetPromotionsToState(placement, location) {
    const promotions = formatPromotions(placement.promotions, {
      allowAltLink: placement.allow_alternate_link,
      promotionListId: placement.id,
      location: location,
      context: this.context,
      propertyId: this.propertyId,
    });
    if (!promotions.length) {
      // eslint-disable-next-line no-console
      console.warn('BAM Promotion List: No active or valid promotions returned');
      this.promotions = promotions;
      return;
    }
    this.promotions = promotions;
    this.location = location;
  }
  render() {
    const baseEventOptions = {
      placementId: this.placementId,
      league: this.league,
      pageSlug: this.pageSlug,
    };
    return !this.defer && this.promotions.length ? (hAsync(Host, null, hAsync("smart-image", { parentSize: { width: this.parentWidth, height: this.parentHeight }, promotion: this.promotions[0], "property-id": this.propertyId, context: this.context, location: this.location, "can-use-alternate-link": this.canUseAlternateLink, eventOptions: Object.assign(Object.assign({}, baseEventOptions), { allPromotions: this.promotions }) }))) : null;
  }
  get el() { return getElement(this); }
  static get watchers() { return {
    "defer": ["onDeferChange"]
  }; }
  static get style() { return bamImageCss; }
  static get cmpMeta() { return {
    "$flags$": 9,
    "$tagName$": "bam-image",
    "$members$": {
      "placementId": [2, "placement-id"],
      "propertyId": [2, "property-id"],
      "context": [1],
      "location": [1025],
      "pageSlug": [1, "page-slug"],
      "subscriptionTier": [2, "subscription-tier"],
      "wasPro": [4, "was-pro"],
      "subdivision": [2],
      "league": [1],
      "gameId": [2, "game-id"],
      "ctaType": [1, "cta-type"],
      "isMobile": [4, "is-mobile"],
      "deviceType": [1, "device-type"],
      "isBetsyncUser": [4, "is-betsync-user"],
      "defer": [4],
      "devMode": [4, "dev-mode"],
      "promotions": [32],
      "canUseAlternateLink": [32],
      "canRotate": [32],
      "parentWidth": [32],
      "parentHeight": [32]
    },
    "$listeners$": [[9, "resize", "handleResize"]],
    "$lazyBundleId$": "-",
    "$attrsToReflect$": []
  }; }
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

var isObject_1 = isObject;

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

var _freeGlobal = freeGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = _freeGlobal || freeSelf || Function('return this')();

var _root = root;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return _root.Date.now();
};

var now_1 = now;

/** Used to match a single whitespace character. */
var reWhitespace = /\s/;

/**
 * Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
 * character of `string`.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {number} Returns the index of the last non-whitespace character.
 */
function trimmedEndIndex(string) {
  var index = string.length;

  while (index-- && reWhitespace.test(string.charAt(index))) {}
  return index;
}

var _trimmedEndIndex = trimmedEndIndex;

/** Used to match leading whitespace. */
var reTrimStart = /^\s+/;

/**
 * The base implementation of `_.trim`.
 *
 * @private
 * @param {string} string The string to trim.
 * @returns {string} Returns the trimmed string.
 */
function baseTrim(string) {
  return string
    ? string.slice(0, _trimmedEndIndex(string) + 1).replace(reTrimStart, '')
    : string;
}

var _baseTrim = baseTrim;

/** Built-in value references. */
var Symbol = _root.Symbol;

var _Symbol = Symbol;

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto$1.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$1.toString;

/** Built-in value references. */
var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag$1),
      tag = value[symToStringTag$1];

  try {
    value[symToStringTag$1] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString$1.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }
  return result;
}

var _getRawTag = getRawTag;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

var _objectToString = objectToString;

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? _getRawTag(value)
    : _objectToString(value);
}

var _baseGetTag = baseGetTag;

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

var isObjectLike_1 = isObjectLike;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike_1(value) && _baseGetTag(value) == symbolTag);
}

var isSymbol_1 = isSymbol;

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol_1(value)) {
    return NAN;
  }
  if (isObject_1(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject_1(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = _baseTrim(value);
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

var toNumber_1 = toNumber;

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber_1(wait) || 0;
  if (isObject_1(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber_1(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        timeWaiting = wait - timeSinceLastCall;

    return maxing
      ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now_1();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now_1());
  }

  function debounced() {
    var time = now_1(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        clearTimeout(timerId);
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

var debounce_1 = debounce;

const config = {
  RUDDERSTACK_URL: 'https://bettercollkagp.dataplane.rudderstack.com/v1',
  RUDDERSTACK_WRITE_KEY: '2OZL7Fm7xx7FTSjPAIP7FHMZi8h',
};
function getFeature(feature) {
  const features = {
    rudderstackUrl: config.RUDDERSTACK_URL,
    rudderstackWriteKey: buffer.Buffer.from(`${config.RUDDERSTACK_WRITE_KEY}:`).toString('base64'),
  };
  return features[feature] || null;
}

const rudderstackUrl = getFeature('rudderstackUrl');
const bufferedRudderstackKey = getFeature('rudderstackWriteKey');
const propertyAnalyticsById = {
  1: false,
  2: true,
  3: true,
  4: true,
  5: false,
  6: true,
  7: false,
  8: false,
  9: false,
  10: false,
  11: false,
  12: false,
  13: false,
  14: false,
  15: false,
  16: false,
  17: false,
  18: false,
  19: false,
  20: false,
  21: false,
  22: false,
  23: false,
  24: false,
  25: false,
  45: false, // Bleacher Nation
};
const debounceWithQueue = (fn, wait, maxLength = 100) => {
  const queue = [];
  const runFn = () => {
    fn(queue);
    queue.length = 0;
  };
  const debounced = debounce_1(runFn, wait);
  const cancel = () => {
    debounced.cancel();
    queue.length = 0;
  };
  const queuedDebounce = (...a) => {
    queue.push(a);
    if (queue.length >= maxLength) {
      debounced.flush();
    }
    else {
      debounced();
    }
  };
  queuedDebounce.cancel = cancel;
  queuedDebounce.flush = debounced.flush;
  return queuedDebounce;
};
const debouncedLogEvent = debounceWithQueue(handlelogEvent, 500);
function handlelogEvent(queue) {
  const formattedQueue = queue
    .map(([propertyId, i13n]) => {
    if (propertyAnalyticsById[propertyId]) {
      return i13n;
    }
  })
    .filter(Boolean);
  if (formattedQueue.length === 0) {
    return;
  }
  if (formattedQueue.length > 1) {
    batchLogEvent(formattedQueue);
    return;
  }
  logEvent(formattedQueue[0]);
}
function logEvent(i13n) {
  const payload = {
    type: 'track',
    properties: i13n,
    event: i13n.action,
  };
  fetchEvent({ type: 'track', payload });
}
function batchLogEvent(queue) {
  const events = queue.map(i13n => ({
    event: i13n.action,
    type: 'track',
    properties: i13n,
  }));
  const payload = [
    {
      event: 'BAM Batched Events',
      type: 'track',
      properties: {
        events: events,
      },
    },
  ];
  fetchEvent({ type: 'batch', payload });
}
async function fetchEvent({ type, payload, }) {
  await fetch(`${rudderstackUrl}/${type}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${bufferedRudderstackKey}`,
    },
    body: JSON.stringify(Array.isArray(payload) ? { batch: payload } : payload),
  });
}
function getPromotionEvent({ componentType, action, promotion, options }) {
  const { id, bookId, campaignId, promotionListId } = promotion;
  const { stateCode, context, propertyId, placementId, league, allPromotions, pageSlug } = options;
  const i13n = {
    action: `BAM Promo ${action}`,
    category: `BAM ${componentType}`,
    url: window.location.href,
    label: bookId,
    bam_property_id: propertyId,
    bam_placement_id: placementId,
    bam_promotion_id: id,
    bam_campaign_id: campaignId,
    bam_affiliate_id: bookId,
    bam_state_code: stateCode || null,
    bam_context: context,
    bam_promotion_list_id: promotionListId,
    bam_list_position: allPromotions.indexOf(promotion) + 1,
    bam_league_id: league || null,
    bam_list_length: allPromotions.length,
    bam_page_slug: pageSlug || null,
    bam_list_contents: allPromotions.map(promo => promo.id),
  };
  return i13n;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-imports-ts
const BonusCode = ({ isFeatured = false, bonusCode, bonusCodeWasClicked, handleClick, }) => {
  function handleBonusCodeClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if ('clipboard' in navigator) {
      void navigator.clipboard.writeText(bonusCode).then(() => {
        handleClick();
      });
    }
  }
  function handleNoCode(e) {
    e.preventDefault();
    e.stopPropagation();
  }
  return bonusCode ? (hAsync("div", { onClick: handleBonusCodeClick, class: `${isFeatured ? 'featured-bonus' : 'bonus'} bam-bonus-code` }, !bonusCodeWasClicked ? (hAsync("div", null,
    hAsync("div", { class: "bonus-code" }, bonusCode),
    hAsync("div", { class: "bonus-text" }, "Promo Code"))) : (hAsync("div", { class: "bonus-copy" }, "Copied!")))) : (hAsync("div", { onClick: handleNoCode, class: `${isFeatured ? 'featured-bonus' : 'bonus'} no-code bam-no-code` }, "No Code Needed"));
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-imports-ts
const PromotionCard$1 = ({ promotion, logPromotionClick, handleBonusCodeClick, bonusCodeWasClicked, useBoxShadow = false, }) => {
  return (hAsync("a", { class: useBoxShadow ? `item item-shadow font` : `item font`, onClick: logPromotionClick, href: promotion.link },
    hAsync("div", { class: "item-content" },
      hAsync("lazy-load-logo", { logo: promotion.logo, promoId: promotion.id, logoColor: promotion.logoColor }),
      hAsync("div", { class: "item-description" },
        hAsync("div", { class: "item-book-name" }, promotion.bookName),
        hAsync("div", { class: "item-cta" }, promotion.cta),
        hAsync("div", { class: "item-terms" }, promotion.termsText))),
    hAsync("div", { class: "buttons" },
      hAsync(BonusCode, { bonusCode: promotion.bonusCode, bonusCodeWasClicked: bonusCodeWasClicked, handleClick: handleBonusCodeClick }),
      hAsync("div", { class: "button button-font" }, promotion.buttonText))));
};

async function fetchPromo(propertyId, promotionId, context, devMode) {
  try {
    const baseUrl = getBaseUrl(devMode);
    const url = `${baseUrl}/v1/affiliate/properties/${propertyId}/promotions/${promotionId}`;
    const res = await fetch(url);
    const response = await res.json();
    if (response.error) {
      // eslint-disable-next-line no-console
      console.error(`BAM Error fetching promotion: ${response.error}`);
      return;
    }
    const formattedPromo = formatPromotions([response.promotion], {
      allowAltLink: true,
      promotionListId: null,
      location: null,
      context: context,
      propertyId: Number(propertyId),
    })[0];
    return formattedPromo;
  }
  catch (error) {
    // eslint-disable-next-line no-console
    console.error(`BAM Error fetching promotion: ${error}`);
  }
}

const bamInlinePromotionCss = "/*!@.item*/.item.sc-bam-inline-promotion{text-decoration:none;display:flex;flex-wrap:wrap;align-items:center;padding:var(--spacing-small);border-bottom:1px solid var(--color-border);gap:0.5rem}/*!@.item-shadow*/.item-shadow.sc-bam-inline-promotion{border:1px solid var(--color-border);border-radius:var(--border-small);margin:var(--spacing-small);box-shadow:0px 10px 24px -14px rgba(0, 0, 0, 0.5);-webkit-box-shadow:0px 10px 24px -14px rgba(0, 0, 0, 0.5);-moz-box-shadow:0px 10px 24px -14px rgba(0, 0, 0, 0.5)}/*!@.item-content*/.item-content.sc-bam-inline-promotion{display:flex;align-items:center;flex:1;flex-basis:250px;gap:var(--spacing-small)}/*!@.item-logo*/.item-logo.sc-bam-inline-promotion{width:35px;height:35px;align-self:center}/*!@.item-description, .featured-item__description*/.item-description.sc-bam-inline-promotion,.featured-item__description.sc-bam-inline-promotion{display:flex;flex-direction:column;justify-content:center;align-items:flex-start;flex:1}/*!@.item-book-name, .featured-item__book-name*/.item-book-name.sc-bam-inline-promotion,.featured-item__book-name.sc-bam-inline-promotion{font-size:var(--font-size-subcaption);font-weight:var(--font-weight-bold);line-height:14px;color:var(--color-secondary)}/*!@.item-cta, .featured-item__cta*/.item-cta.sc-bam-inline-promotion,.featured-item__cta.sc-bam-inline-promotion{color:var(--color-primary);font-size:var(--font-size-caption);font-weight:var(--font-weight-bold);line-height:18px}/*!@.item-terms, .featured-item__terms*/.item-terms.sc-bam-inline-promotion,.featured-item__terms.sc-bam-inline-promotion{font-size:var(--font-size-subcaption);line-height:14px;color:var(--color-secondary)}/*!@.buttons*/.buttons.sc-bam-inline-promotion{width:100%;display:flex;flex:1 1 200px;justify-content:space-between;gap:var(--spacing-small)}/*!@.button*/.button.sc-bam-inline-promotion{border:1px solid var(--color-border);padding:var(--spacing-small) 0;border-radius:var(--border-small);background:border-box var(--color-success);cursor:pointer;flex:1 1 50%;align-self:center}/*!@.button-font*/.button-font.sc-bam-inline-promotion{color:var(--color-foreground);font-size:var(--font-size-subcaption);font-weight:800;line-height:14px;text-align:center}/*!@.bonus*/.bonus.sc-bam-inline-promotion{background-color:var(--color-background)}/*!@.featured-bonus*/.featured-bonus.sc-bam-inline-promotion{background-color:var(--color-brand-tertiary)}/*!@.bonus, .featured-bonus*/.bonus.sc-bam-inline-promotion,.featured-bonus.sc-bam-inline-promotion{flex:1 1 50%;padding:var(--spacing-tiny);border:1px dashed var(--color-border);border-radius:var(--border-small);text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;height:22px;line-height:var(--spacing-smedium)}/*!@.bonus:hover*/.bonus.sc-bam-inline-promotion:hover{background-color:var(--color-background);border:1px dashed var(--color-secondary)}/*!@.featured-bonus:hover*/.featured-bonus.sc-bam-inline-promotion:hover{border:1px dashed var(--color-secondary)}/*!@.bonus-code*/.bonus-code.sc-bam-inline-promotion{color:var(--color-primary);font-size:var(--font-size-subcaption);font-weight:800}/*!@.bonus-text*/.bonus-text.sc-bam-inline-promotion{color:var(--color-secondary);font-size:var(--font-size-caption);font-weight:800;font-size:9px}/*!@.bonus-copy*/.bonus-copy.sc-bam-inline-promotion{color:var(--color-info);font-size:var(--font-size-subcaption);font-weight:800}/*!@.no-code*/.no-code.sc-bam-inline-promotion{color:var(--color-secondary);font-size:var(--font-size-subcaption);font-weight:800;line-height:var(--spacing-smedium)}/*!@.featured-item*/.featured-item.sc-bam-inline-promotion{display:block;text-decoration:none}/*!@.featured-item-content__header*/.featured-item-content__header.sc-bam-inline-promotion{font-size:var(--font-size-subcaption);margin:0;padding:var(--spacing-tiny) var(--spacing-small);background-color:var(--color-brand-primary);color:var(--color-text-white)}/*!@.featured-item-content__container*/.featured-item-content__container.sc-bam-inline-promotion{background-color:var(--color-brand-secondary);display:flex;flex-wrap:wrap;align-items:center;padding:var(--spacing-small);border-bottom:1px solid var(--color-border);gap:0.5rem}/*!@.featured-item-content*/.featured-item-content.sc-bam-inline-promotion{display:flex;align-items:center;flex:1;flex-basis:250px;gap:var(--spacing-small)}/*!@.item*/.item.sc-bam-inline-promotion{text-decoration:none;display:flex;flex-wrap:wrap;align-items:center;padding:var(--spacing-small);border:1px solid var(--color-border);border-radius:var(--border-small);gap:0.5rem;box-shadow:var(--shadow-inline)}/*!@.font*/.font.sc-bam-inline-promotion{font-family:var(--font-family);font-size:var(--font-size-body)}";

class BamInlinePromotion {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.onIntersection = entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          if (this.observer) {
            this.observer.disconnect();
          }
          this.logPromotionEvent('Impression');
        }
      }
    };
    this.propertyId = undefined;
    this.promotionId = undefined;
    this.context = undefined;
    this.defer = undefined;
    this.devMode = false;
    this.promotion = undefined;
    this.bonusCodeWasClicked = false;
  }
  onPromotionChange(newPromotionValue) {
    if (!this.observer && newPromotionValue && Build.isBrowser) {
      this.observer = new IntersectionObserver(this.onIntersection.bind(this));
      this.observer.observe(this.el);
    }
  }
  connectedCallback() {
  }
  async componentWillLoad() {
    {
      await this.getPromo();
    }
  }
  async getPromo() {
    const hasMissingParams = requiredParamsCheck({
      promotion_id: this.promotionId,
      property_id: this.propertyId,
    }, 'Inline Promotion');
    if (hasMissingParams) {
      return;
    }
    const promotion = await fetchPromo(this.propertyId, this.promotionId, this.context, this.devMode);
    this.promotion = promotion;
  }
  handleBonusCodeClick() {
    this.bonusCodeWasClicked = true;
    setTimeout(() => {
      this.bonusCodeWasClicked = false;
    }, 2500);
  }
  logPromotionEvent(action) {
    const i13n = getPromotionEvent({
      componentType: 'Inline Promotion',
      action,
      options: {
        stateCode: null,
        context: this.context,
        propertyId: Number(this.propertyId),
        placementId: null,
        league: null,
        allPromotions: [this.promotion],
        pageSlug: null,
      },
      promotion: this.promotion,
    });
    debouncedLogEvent(this.propertyId, i13n);
  }
  render() {
    return (hAsync(Host, null, this.promotion && (hAsync(PromotionCard$1, { promotion: this.promotion, logPromotionClick: this.logPromotionEvent.bind(this, 'Click'), handleBonusCodeClick: this.handleBonusCodeClick.bind(this), bonusCodeWasClicked: this.bonusCodeWasClicked }))));
  }
  get el() { return getElement(this); }
  static get watchers() { return {
    "promotion": ["onPromotionChange"]
  }; }
  static get style() { return bamInlinePromotionCss; }
  static get cmpMeta() { return {
    "$flags$": 9,
    "$tagName$": "bam-inline-promotion",
    "$members$": {
      "propertyId": [2, "property-id"],
      "promotionId": [2, "promotion-id"],
      "context": [1],
      "defer": [4],
      "devMode": [4, "dev-mode"],
      "promotion": [32],
      "bonusCodeWasClicked": [32]
    },
    "$listeners$": undefined,
    "$lazyBundleId$": "-",
    "$attrsToReflect$": []
  }; }
}

const canadaProvinceByAbbr = {
  AB: 'Alberta',
  BC: 'British Columbia',
  MB: 'Manitoba',
  NB: 'New Brunswick',
  NL: 'Newfoundland and Labrador',
  NS: 'Nova Scotia',
  NT: 'Northwest Territories',
  NU: 'Nunavut',
  ON: 'Ontario',
  PE: 'Prince Edward Island',
  QC: 'Québec',
  SK: 'Saskatchewan',
  YT: 'Yukon',
};
const usStateByAbbr = {
  AL: 'Alabama',
  AK: 'Alaska',
  AZ: 'Arizona',
  AR: 'Arkansas',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DE: 'Delaware',
  FL: 'Florida',
  GA: 'Georgia',
  HI: 'Hawaii',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  IA: 'Iowa',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  ME: 'Maine',
  MD: 'Maryland',
  MA: 'Massachusetts',
  MI: 'Michigan',
  MN: 'Minnesota',
  MS: 'Mississippi',
  MO: 'Missouri',
  MT: 'Montana',
  NE: 'Nebraska',
  NV: 'Nevada',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NY: 'New York',
  NC: 'North Carolina',
  ND: 'North Dakota',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PA: 'Pennsylvania',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VT: 'Vermont',
  VA: 'Virginia',
  WA: 'Washington',
  WV: 'West Virginia',
  WI: 'Wisconsin',
  WY: 'Wyoming',
  DC: 'Washington, D.C.',
};
const northAmericaLocationByAbbr = Object.assign(Object.assign({}, usStateByAbbr), canadaProvinceByAbbr);
function isCanadianLocationCode(location) {
  return !!Object.keys(canadaProvinceByAbbr).includes(location);
}
function getPromotionTableTitle(location, title = '') {
  if (!title) {
    return isCanadianLocationCode(location) ? 'Sportsbooks' : 'Offers';
  }
  return title;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-imports-ts
const LocationDropdown = ({ location, handleDropdown }) => {
  const isNotExistingLocation = !Object.prototype.hasOwnProperty.call(northAmericaLocationByAbbr, location);
  return (hAsync("div", { class: "dropdown-container" },
    hAsync("select", { id: "bam-dropdown", class: `dropdown dropdown-font ${isNotExistingLocation ? 'dropdown-default-font' : ''}`, onInput: handleDropdown },
      isNotExistingLocation ? (hAsync("option", { selected: true, value: "" }, "Select a location")) : (hAsync("option", { value: "" }, "Select a location")),
      Object.keys(northAmericaLocationByAbbr).map(abbr => {
        return location === abbr ? (hAsync("option", { selected: true, value: abbr }, northAmericaLocationByAbbr[abbr])) : (hAsync("option", { value: abbr }, northAmericaLocationByAbbr[abbr]));
      })),
    hAsync("svg", { viewBox: "0 0 24 24", width: "24", height: "24", xmlns: "http://www.w3.org/2000/svg", class: "dropdown-arrow", fill: "#A4A4AA", stroke: "#A4A4AA", "stroke-width": "0" },
      hAsync("title", null, "Right Arrow"),
      hAsync("path", { d: "M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" }))));
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-imports-ts
const Skeleton = () => {
  return (hAsync("div", { class: "side-rail font" },
    hAsync("div", { class: "skeleton-header" },
      hAsync("h2", { class: "title title-font" }, "Promotions"),
      hAsync("div", { class: "skeleton-dropdown-container" })),
    hAsync("ul", { class: "list-container" },
      hAsync("div", { class: "skeleton-item" },
        hAsync("div", { class: "skeleton-item-logo" }),
        hAsync("div", { class: "skeleton-item-content" }),
        hAsync("div", { class: "skeleton-item-cta" })),
      hAsync("div", { class: "skeleton-item" },
        hAsync("div", { class: "skeleton-item-logo" }),
        hAsync("div", { class: "skeleton-item-content" }),
        hAsync("div", { class: "skeleton-item-cta" })),
      hAsync("div", { class: "skeleton-item" },
        hAsync("div", { class: "skeleton-item-logo" }),
        hAsync("div", { class: "skeleton-item-content" }),
        hAsync("div", { class: "skeleton-item-cta" })))));
};

const bamInlinePromotionBlockCss = "/*!@.side-rail*/.side-rail.sc-bam-inline-promotion-block{border:1px solid var(--color-border);background-color:var(--color-foreground);border-radius:var(--border-small)}/*!@.side-rail a*/.side-rail.sc-bam-inline-promotion-block a.sc-bam-inline-promotion-block{text-decoration:none;color:var(--color-primary)}/*!@.dropdown-container*/.dropdown-container.sc-bam-inline-promotion-block{position:relative;display:inline-block;border:1px solid var(--color-border);border-radius:var(--border-small);background-color:var(--color-foreground);height:100%;width:auto}/*!@.dropdown*/.dropdown.sc-bam-inline-promotion-block{background-color:var(--color-foreground);appearance:none;margin:0px;padding:var(--spacing-small) calc(30px) var(--spacing-small) var(--spacing-small);width:100%;height:100%;border-radius:var(--border-small);border:0px;outline:none;text-indent:0px}/*!@.dropdown-arrow*/.dropdown-arrow.sc-bam-inline-promotion-block{position:absolute;top:50%;transform:translate(0px, -50%) rotate(90deg);right:6px;pointer-events:none}/*!@.header*/.header.sc-bam-inline-promotion-block{display:flex;justify-content:space-between;align-items:center;padding:var(--spacing-small);border-bottom:1px solid var(--color-border)}/*!@.title*/.title.sc-bam-inline-promotion-block{margin:0px;margin-right:var(--spacing-small)}/*!@.title-font*/.title-font.sc-bam-inline-promotion-block{font-size:var(--font-size-title);font-weight:var(--font-weight-bold);line-height:24px}/*!@.list-container*/.list-container.sc-bam-inline-promotion-block{list-style:none;padding-left:0;margin:0}/*!@.font*/.font.sc-bam-inline-promotion-block{font-family:var(--font-family);font-size:var(--font-size-body)}/*!@.dropdown-font*/.dropdown-font.sc-bam-inline-promotion-block{font-size:var(--font-size-body);font-weight:var(--font-weight-bold);line-height:18px;text-transform:capitalize;letter-spacing:0.2px;color:var(--color-primary)}/*!@.dropdown-default-font*/.dropdown-default-font.sc-bam-inline-promotion-block{color:var(--color-secondary)}/*!@.empty-state*/.empty-state.sc-bam-inline-promotion-block{text-align:center;padding:var(--spacing-small)}/*!@.see-all*/.see-all.sc-bam-inline-promotion-block{color:var(--color-info);font-weight:var(--font-weight-bold);background:none;border:none;cursor:pointer}/*!@.footer*/.footer.sc-bam-inline-promotion-block{display:flex;justify-content:center;align-items:center;padding:var(--spacing-small);gap:0.25rem}@keyframes pulse{0%{opacity:0.5}50%{opacity:1}100%{opacity:0.5}}/*!@.skeleton-header*/.skeleton-header.sc-bam-inline-promotion-block{display:flex;justify-content:space-between;align-items:center;padding:var(--spacing-small);border-bottom:1px solid var(--color-border)}/*!@.skeleton-dropdown-container*/.skeleton-dropdown-container.sc-bam-inline-promotion-block{position:relative;display:inline-block;border:1px solid var(--color-secondary);border-radius:var(--border-small);background-color:var(--color-foreground);height:42px;width:200px}/*!@.skeleton-item*/.skeleton-item.sc-bam-inline-promotion-block{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-around;padding:var(--spacing-small);gap:var(--spacing-small);border-bottom:1px solid var(--color-border)}/*!@.skeleton-item-logo*/.skeleton-item-logo.sc-bam-inline-promotion-block{width:35px;height:35px;align-self:center;background-color:var(--color-border);animation:pulse 1.5s infinite}/*!@.skeleton-item-content*/.skeleton-item-content.sc-bam-inline-promotion-block{background-color:var(--color-border);flex:1 1 50%;height:1rem;animation:pulse 1.5s infinite}/*!@.skeleton-item-cta*/.skeleton-item-cta.sc-bam-inline-promotion-block{background-color:var(--color-border);height:1rem;flex:1 1 30%;animation:pulse 1.5s infinite}";

class BamInlinePromotionBlock {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.placementId = undefined;
    this.propertyId = undefined;
    this.location = undefined;
    this.context = undefined;
    this.pageSlug = undefined;
    this.subscriptionTier = undefined;
    this.wasPro = undefined;
    this.subdivision = undefined;
    this.league = undefined;
    this.gameId = undefined;
    this.ctaType = undefined;
    this.isMobile = undefined;
    this.deviceType = undefined;
    this.isBetsyncUser = undefined;
    this.maxLength = undefined;
    this.moduleTitle = undefined;
    this.defer = undefined;
    this.devMode = false;
    this.promotions = [];
    this.toggle = false;
    this.inlinePromotionBlocks = [];
  }
  onLocationChange() {
    getPlacement({
      placement_id: this.placementId,
      property_id: this.propertyId,
      location: this.location,
      page_slug: this.pageSlug,
      subscription_tier: this.subscriptionTier,
      was_pro: this.wasPro,
      subdivision_id: this.subdivision,
      league: this.league,
      game_id: this.gameId,
      cta_type: this.ctaType,
      is_mobile: this.isMobile,
      device_type: this.deviceType,
      isBetsyncUser: this.isBetsyncUser,
    }, this.formatAndSetPromotionsToState.bind(this), this.devMode, 'Inline Promotion Block');
  }
  componentWillLoad() {
    this.onLocationChange();
  }
  connectedCallback() {
    this.inlinePromotionBlocks = [...document.querySelectorAll('bam-inline-promotion-block')];
    if (!this.defer) {
      getPlacement({
        placement_id: this.placementId,
        property_id: this.propertyId,
        location: this.location,
        page_slug: this.pageSlug,
        subscription_tier: this.subscriptionTier,
        was_pro: this.wasPro,
        subdivision_id: this.subdivision,
        league: this.league,
        game_id: this.gameId,
        cta_type: this.ctaType,
        is_mobile: this.isMobile,
        device_type: this.deviceType,
        isBetsyncUser: this.isBetsyncUser,
      }, this.formatAndSetPromotionsToState.bind(this), this.devMode, 'Inline Promotion Block');
    }
  }
  handleDropdown(evt) {
    if (evt.target instanceof HTMLSelectElement) {
      const prevLocation = this.location;
      const newLocation = evt.target.value;
      this.inlinePromotionBlocks.forEach(block => {
        const isSameLocation = block.getAttribute('location') === prevLocation;
        if (isSameLocation) {
          block.setAttribute('location', newLocation);
        }
      });
      this.location = newLocation;
    }
  }
  handleToggle() {
    this.toggle = !this.toggle;
  }
  formatAndSetPromotionsToState(placement, location) {
    const adBlockIndex = this.inlinePromotionBlocks.findIndex(block => block === this.el);
    const startIndex = this.inlinePromotionBlocks.slice(0, adBlockIndex).reduce((acc, curr) => {
      const isSamePlacement = Number(curr.getAttribute('placement-id')) === this.placementId;
      const isSameLocation = curr.getAttribute('location') === this.location;
      if (isSamePlacement && isSameLocation) {
        const retVal = acc + Number(curr.getAttribute('max-length') || 2);
        // if index is going to be greater than the length, we want to reset it to 0
        return retVal >= placement.promotions.length ? 0 : retVal;
      }
      return acc;
    }, 0);
    const stopIndex = startIndex + Number(this.maxLength);
    const getBlockPromotions = () => {
      let promos = placement.promotions;
      // prevent loop from running if placement doesn't have promos
      if (!promos.length) {
        return promos;
      }
      while (promos.length < stopIndex) {
        promos = [...promos, ...placement.promotions];
      }
      // first slice handles designated length
      // second slice prevents repeating promotions in same block
      return promos.slice(startIndex, stopIndex).slice(0, placement.promotions.length);
    };
    const promotions = formatPromotions(getBlockPromotions(), {
      allowAltLink: placement.allow_alternate_link,
      promotionListId: placement.id,
      location: location,
      context: this.context,
      propertyId: this.propertyId,
    });
    if (!promotions.length) {
      // eslint-disable-next-line no-console
      console.warn('BAM Promotion List: No active or valid promotions returned');
      this.promotions = promotions;
      return;
    }
    this.promotions = promotions;
    this.location = location;
  }
  render() {
    return !this.defer ? (hAsync(Host, null, hAsync("div", { class: "side-rail font" }, hAsync("div", { class: "header" }, hAsync("h2", { class: "title title-font" }, getPromotionTableTitle(this.location, this.moduleTitle)), hAsync(LocationDropdown, { location: this.location, handleDropdown: this.handleDropdown.bind(this) })), this.promotions.length ? (hAsync("ul", { id: "promo-container", class: "list-container" }, this.promotions
      .slice(0, this.toggle ? this.promotions.length : this.maxLength)
      .map(promotion => {
      const eventOptions = {
        componentType: 'Inline Promotion Block',
        options: {
          stateCode: this.location.toUpperCase(),
          context: this.context,
          propertyId: Number(this.propertyId),
          placementId: Number(this.placementId),
          league: this.league,
          allPromotions: this.promotions,
          pageSlug: this.pageSlug,
        },
      };
      return (hAsync("promotion-card", { key: promotion.id, promotion: promotion, "use-box-shadow": true, propertyId: this.propertyId, eventOptions: eventOptions }));
    }))) : (hAsync("p", { class: "empty-state" }, "No promotions available. Try selecting a different location.")), this.promotions.length > this.maxLength ? (hAsync("div", { class: "footer" }, hAsync("button", { class: "see-all", onClick: this.handleToggle.bind(this) }, this.toggle ? 'Hide' : 'See all'))) : null))) : (hAsync(Skeleton, null));
  }
  get el() { return getElement(this); }
  static get watchers() { return {
    "location": ["onLocationChange"]
  }; }
  static get style() { return bamInlinePromotionBlockCss; }
  static get cmpMeta() { return {
    "$flags$": 9,
    "$tagName$": "bam-inline-promotion-block",
    "$members$": {
      "placementId": [2, "placement-id"],
      "propertyId": [2, "property-id"],
      "location": [1025],
      "context": [1],
      "pageSlug": [1, "page-slug"],
      "subscriptionTier": [2, "subscription-tier"],
      "wasPro": [4, "was-pro"],
      "subdivision": [2],
      "league": [1],
      "gameId": [2, "game-id"],
      "ctaType": [1, "cta-type"],
      "isMobile": [4, "is-mobile"],
      "deviceType": [1, "device-type"],
      "isBetsyncUser": [4, "is-betsync-user"],
      "maxLength": [2, "max-length"],
      "moduleTitle": [1, "module-title"],
      "defer": [4],
      "devMode": [4, "dev-mode"],
      "promotions": [32],
      "toggle": [32],
      "inlinePromotionBlocks": [32]
    },
    "$listeners$": undefined,
    "$lazyBundleId$": "-",
    "$attrsToReflect$": []
  }; }
}

const bamPromotionListCss = "/*!@.side-rail*/.side-rail.sc-bam-promotion-list{border:1px solid var(--color-border);background-color:var(--color-foreground);border-radius:var(--border-small)}/*!@.side-rail a*/.side-rail.sc-bam-promotion-list a.sc-bam-promotion-list{text-decoration:none;color:var(--color-primary)}/*!@.dropdown-container*/.dropdown-container.sc-bam-promotion-list{position:relative;display:inline-block;border:1px solid var(--color-border);border-radius:var(--border-small);background-color:var(--color-foreground);height:100%;width:auto}/*!@.dropdown*/.dropdown.sc-bam-promotion-list{background-color:var(--color-foreground);appearance:none;margin:0px;padding:var(--spacing-small) calc(30px) var(--spacing-small) var(--spacing-small);width:100%;height:100%;border-radius:var(--border-small);border:0px;outline:none;text-indent:0px}/*!@.dropdown-arrow*/.dropdown-arrow.sc-bam-promotion-list{position:absolute;top:50%;transform:translate(0px, -50%) rotate(90deg);right:6px;pointer-events:none}/*!@.header*/.header.sc-bam-promotion-list{display:flex;justify-content:space-between;align-items:center;padding:var(--spacing-small);border-bottom:1px solid var(--color-border)}/*!@.title*/.title.sc-bam-promotion-list{margin:0px;margin-right:var(--spacing-small)}/*!@.title-font*/.title-font.sc-bam-promotion-list{font-size:var(--font-size-title);font-weight:var(--font-weight-bold);line-height:24px}/*!@.list-container*/.list-container.sc-bam-promotion-list{list-style:none;padding-left:0;margin:0}/*!@.font*/.font.sc-bam-promotion-list{font-family:var(--font-family);font-size:var(--font-size-body)}/*!@.dropdown-font*/.dropdown-font.sc-bam-promotion-list{font-size:var(--font-size-body);font-weight:var(--font-weight-bold);line-height:18px;text-transform:capitalize;letter-spacing:0.2px;color:var(--color-primary)}/*!@.dropdown-default-font*/.dropdown-default-font.sc-bam-promotion-list{color:var(--color-secondary)}/*!@.empty-state*/.empty-state.sc-bam-promotion-list{text-align:center;padding:var(--spacing-small)}/*!@.see-all*/.see-all.sc-bam-promotion-list{color:var(--color-info);font-weight:var(--font-weight-bold);background:none;border:none;cursor:pointer}/*!@.footer*/.footer.sc-bam-promotion-list{display:flex;justify-content:center;align-items:center;padding:var(--spacing-small);gap:0.25rem}@keyframes pulse{0%{opacity:0.5}50%{opacity:1}100%{opacity:0.5}}/*!@.skeleton-header*/.skeleton-header.sc-bam-promotion-list{display:flex;justify-content:space-between;align-items:center;padding:var(--spacing-small);border-bottom:1px solid var(--color-border)}/*!@.skeleton-dropdown-container*/.skeleton-dropdown-container.sc-bam-promotion-list{position:relative;display:inline-block;border:1px solid var(--color-secondary);border-radius:var(--border-small);background-color:var(--color-foreground);height:42px;width:200px}/*!@.skeleton-item*/.skeleton-item.sc-bam-promotion-list{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-around;padding:var(--spacing-small);gap:var(--spacing-small);border-bottom:1px solid var(--color-border)}/*!@.skeleton-item-logo*/.skeleton-item-logo.sc-bam-promotion-list{width:35px;height:35px;align-self:center;background-color:var(--color-border);animation:pulse 1.5s infinite}/*!@.skeleton-item-content*/.skeleton-item-content.sc-bam-promotion-list{background-color:var(--color-border);flex:1 1 50%;height:1rem;animation:pulse 1.5s infinite}/*!@.skeleton-item-cta*/.skeleton-item-cta.sc-bam-promotion-list{background-color:var(--color-border);height:1rem;flex:1 1 30%;animation:pulse 1.5s infinite}";

// import type { PromotionOptions, ComponentType } from '../../utils/analytics';
class BamPromotionList {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.placementId = undefined;
    this.propertyId = undefined;
    this.location = undefined;
    this.context = undefined;
    this.pageSlug = undefined;
    this.subscriptionTier = undefined;
    this.wasPro = undefined;
    this.subdivision = undefined;
    this.league = undefined;
    this.gameId = undefined;
    this.ctaType = undefined;
    this.isMobile = undefined;
    this.deviceType = undefined;
    this.isBetsyncUser = undefined;
    this.showFeaturedPromotion = false;
    this.maxLength = undefined;
    this.moduleTitle = undefined;
    this.defer = undefined;
    this.devMode = false;
    this.promotions = [];
    this.promotionListId = undefined;
    this.toggle = false;
  }
  onDeferChange(newDeferValue) {
    if (!newDeferValue) {
      getPlacement({
        placement_id: this.placementId,
        property_id: this.propertyId,
        location: this.location,
        page_slug: this.pageSlug,
        subscription_tier: this.subscriptionTier,
        was_pro: this.wasPro,
        subdivision_id: this.subdivision,
        league: this.league,
        game_id: this.gameId,
        cta_type: this.ctaType,
        is_mobile: this.isMobile,
        device_type: this.deviceType,
        isBetsyncUser: this.isBetsyncUser,
      }, this.formatAndSetPromotionsToState.bind(this), this.devMode, 'Promotion List');
    }
  }
  onLocationChange() {
    getPlacement({
      placement_id: this.placementId,
      property_id: this.propertyId,
      location: this.location,
      page_slug: this.pageSlug,
      subscription_tier: this.subscriptionTier,
      was_pro: this.wasPro,
      subdivision_id: this.subdivision,
      league: this.league,
      game_id: this.gameId,
      cta_type: this.ctaType,
      is_mobile: this.isMobile,
      device_type: this.deviceType,
      isBetsyncUser: this.isBetsyncUser,
    }, this.formatAndSetPromotionsToState.bind(this), this.devMode, 'Promotion List');
  }
  connectedCallback() {
    if (!this.defer && Build.isBrowser) {
      getPlacement({
        placement_id: this.placementId,
        property_id: this.propertyId,
        location: this.location,
        page_slug: this.pageSlug,
        subscription_tier: this.subscriptionTier,
        was_pro: this.wasPro,
        subdivision_id: this.subdivision,
        league: this.league,
        game_id: this.gameId,
        cta_type: this.ctaType,
        is_mobile: this.isMobile,
        device_type: this.deviceType,
        isBetsyncUser: this.isBetsyncUser,
      }, this.formatAndSetPromotionsToState.bind(this), this.devMode, 'Promotion List');
    }
  }
  async componentWillLoad() {
    {
      const placement = await fetchPlacement({
        placement_id: this.placementId,
        property_id: this.propertyId,
        location: this.location,
        page_slug: this.pageSlug,
        subscription_tier: this.subscriptionTier,
        was_pro: this.wasPro,
        subdivision_id: this.subdivision,
        league: this.league,
        game_id: this.gameId,
        cta_type: this.ctaType,
        is_mobile: this.isMobile,
        device_type: this.deviceType,
        isBetsyncUser: this.isBetsyncUser,
      }, false);
      this.formatAndSetPromotionsToState(placement, this.location);
    }
  }
  handleDropdown(evt) {
    if (evt.target instanceof HTMLSelectElement) {
      const newLocation = evt.target.value;
      this.location = newLocation;
    }
  }
  handleToggle() {
    this.toggle = !this.toggle;
  }
  formatAndSetPromotionsToState(placement, location) {
    const promotions = formatPromotions(placement.promotions, {
      allowAltLink: placement.allow_alternate_link,
      promotionListId: placement.id,
      location: location,
      context: this.context,
      propertyId: this.propertyId,
    });
    if (!promotions.length) {
      // eslint-disable-next-line no-console
      console.warn('BAM Promotion List: No active or valid promotions returned');
      this.promotions = promotions;
      return;
    }
    this.promotions = promotions;
    this.location = location;
    this.promotionListId = placement.id;
  }
  render() {
    return !this.defer ? (hAsync(Host, null, hAsync("div", { class: "side-rail font" }, hAsync("div", { class: "header" }, hAsync("h2", { class: "title title-font" }, getPromotionTableTitle(this.location, this.moduleTitle)), hAsync(LocationDropdown, { location: this.location, handleDropdown: this.handleDropdown.bind(this) })), this.promotions.length ? (hAsync("ul", { id: "promo-container", class: "list-container" }, this.promotions
      .slice(0, this.toggle ? this.promotions.length : this.maxLength)
      .map((promotion, idx) => {
      // const eventOptions: { componentType: ComponentType; options: PromotionOptions } = {
      //     componentType: 'Promotion List',
      //     options: {
      //         stateCode: this.location.toUpperCase(),
      //         context: this.context,
      //         propertyId: Number(this.propertyId),
      //         placementId: Number(this.placementId),
      //         league: this.league,
      //         allPromotions: this.promotions,
      //         pageSlug: this.pageSlug,
      //     },
      // };
      return hAsync("li", { key: idx }, promotion.cta);
    }))) : (hAsync("p", { class: "empty-state" }, "No promotions available. Try selecting a different location.")), this.promotions.length > this.maxLength ? (hAsync("div", { class: "footer" }, hAsync("button", { class: "see-all", onClick: this.handleToggle.bind(this) }, this.toggle ? 'Hide' : 'See all'))) : null))) : (hAsync(Skeleton, null));
  }
  get el() { return getElement(this); }
  static get watchers() { return {
    "defer": ["onDeferChange"],
    "location": ["onLocationChange"]
  }; }
  static get style() { return bamPromotionListCss; }
  static get cmpMeta() { return {
    "$flags$": 9,
    "$tagName$": "bam-promotion-list",
    "$members$": {
      "placementId": [2, "placement-id"],
      "propertyId": [2, "property-id"],
      "location": [1025],
      "context": [1],
      "pageSlug": [1, "page-slug"],
      "subscriptionTier": [2, "subscription-tier"],
      "wasPro": [4, "was-pro"],
      "subdivision": [2],
      "league": [1],
      "gameId": [2, "game-id"],
      "ctaType": [1, "cta-type"],
      "isMobile": [4, "is-mobile"],
      "deviceType": [1, "device-type"],
      "isBetsyncUser": [4, "is-betsync-user"],
      "showFeaturedPromotion": [4, "show-featured-promotion"],
      "maxLength": [2, "max-length"],
      "moduleTitle": [1, "module-title"],
      "defer": [4],
      "devMode": [4, "dev-mode"],
      "promotions": [32],
      "promotionListId": [32],
      "toggle": [32]
    },
    "$listeners$": undefined,
    "$lazyBundleId$": "-",
    "$attrsToReflect$": []
  }; }
}

const bamStickyCtaCss = "";

class BamStickyCta {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.placementId = undefined;
    this.propertyId = undefined;
    this.context = undefined;
    this.location = undefined;
    this.pageSlug = undefined;
    this.subscriptionTier = undefined;
    this.wasPro = undefined;
    this.subdivision = undefined;
    this.league = undefined;
    this.gameId = undefined;
    this.ctaType = undefined;
    this.isMobile = undefined;
    this.deviceType = undefined;
    this.isBetsyncUser = undefined;
    this.defer = undefined;
    this.devMode = false;
    this.promotions = [];
    this.canRotate = false;
  }
  onDeferChange(newDeferValue) {
    if (!newDeferValue) {
      getPlacement({
        placement_id: this.placementId,
        property_id: this.propertyId,
        location: this.location,
        page_slug: this.pageSlug,
        subscription_tier: this.subscriptionTier,
        was_pro: this.wasPro,
        subdivision_id: this.subdivision,
        league: this.league,
        game_id: this.gameId,
        cta_type: this.ctaType,
        is_mobile: this.isMobile,
        device_type: this.deviceType,
        isBetsyncUser: this.isBetsyncUser,
      }, this.setNewPromosToState.bind(this), this.devMode, 'Sticky CTA');
    }
  }
  connectedCallback() {
    if (!this.defer) {
      getPlacement({
        placement_id: this.placementId,
        property_id: this.propertyId,
        location: this.location,
        page_slug: this.pageSlug,
        subscription_tier: this.subscriptionTier,
        was_pro: this.wasPro,
        subdivision_id: this.subdivision,
        league: this.league,
        game_id: this.gameId,
        cta_type: this.ctaType,
        is_mobile: this.isMobile,
        device_type: this.deviceType,
        isBetsyncUser: this.isBetsyncUser,
      }, this.setNewPromosToState.bind(this), this.devMode, 'Sticky CTA');
    }
  }
  setNewPromosToState(placement, location) {
    if (placement.can_rotate) {
      this.canRotate = placement.can_rotate;
    }
    const promotions = formatPromotions(placement.promotions, {
      allowAltLink: placement.allow_alternate_link,
      promotionListId: placement.id,
      location: location,
      context: this.context,
      propertyId: this.propertyId,
    });
    if (!promotions.length) {
      // eslint-disable-next-line no-console
      console.warn('BAM Promotion List: No active or valid promotions returned');
      this.promotions = [];
      return;
    }
    this.promotions = promotions;
  }
  render() {
    return !this.defer && this.promotions.length ? (this.canRotate ? (hAsync("rotating-sticky-cta", { "placement-id": this.placementId, "property-id": this.propertyId, context: this.context, promotions: this.promotions, location: this.location, league: this.league, "page-slug": this.pageSlug })) : (hAsync("static-sticky-cta", { "placement-id": this.placementId, "property-id": this.propertyId, context: this.context, promotion: this.promotions[0], location: this.location, league: this.league, "page-slug": this.pageSlug }))) : null;
  }
  static get watchers() { return {
    "defer": ["onDeferChange"]
  }; }
  static get style() { return bamStickyCtaCss; }
  static get cmpMeta() { return {
    "$flags$": 9,
    "$tagName$": "bam-sticky-cta",
    "$members$": {
      "placementId": [2, "placement-id"],
      "propertyId": [2, "property-id"],
      "context": [1],
      "location": [1],
      "pageSlug": [1, "page-slug"],
      "subscriptionTier": [2, "subscription-tier"],
      "wasPro": [4, "was-pro"],
      "subdivision": [2],
      "league": [1],
      "gameId": [2, "game-id"],
      "ctaType": [1, "cta-type"],
      "isMobile": [4, "is-mobile"],
      "deviceType": [1, "device-type"],
      "isBetsyncUser": [4, "is-betsync-user"],
      "defer": [4],
      "devMode": [4, "dev-mode"],
      "promotions": [32],
      "canRotate": [32]
    },
    "$listeners$": undefined,
    "$lazyBundleId$": "-",
    "$attrsToReflect$": []
  }; }
}

class LazyLoadLogo {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.onIntersection = entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          if (this.observer) {
            this.observer.disconnect();
          }
          this.isViewed = true;
        }
      }
    };
    this.logo = undefined;
    this.logoColor = undefined;
    this.promoId = undefined;
    this.isViewed = false;
  }
  componentDidRender() {
    if (!this.observer && Build.isBrowser) {
      this.observer = new IntersectionObserver(this.onIntersection.bind(this));
      this.observer.observe(this.el);
    }
  }
  render() {
    return (hAsync(Host, null, this.isViewed || Build.isServer ? (hAsync("img", { class: `lazy-logo ${LazyLoadClassName.LIST_LOGO}`, srcSet: createSrcSet(this.logo, 450, 450), sizes: "50px", alt: "promotion logo image" })) : (hAsync("img", { class: `lazy-logo ${LazyLoadClassName.LIST_LOGO}`, src: generateColorUri(this.logoColor, 'thumbnail'), alt: "promotion logo image" }))));
  }
  get el() { return getElement(this); }
  static get style() { return "lazy-load-logo.css"; }
  static get cmpMeta() { return {
    "$flags$": 0,
    "$tagName$": "lazy-load-logo",
    "$members$": {
      "logo": [1],
      "logoColor": [1, "logo-color"],
      "promoId": [8, "promo-id"],
      "isViewed": [32]
    },
    "$listeners$": undefined,
    "$lazyBundleId$": "-",
    "$attrsToReflect$": []
  }; }
}

const oneDay = 1000 * 60 * 60 * 24;
const halfDay = oneDay / 2;
function fireImpressions(impressionUrls) {
  const impressionPromises = impressionUrls
    .map(url => {
    return shouldFireImpression('bam_imp_limits', url)
      ? fetch(url, {
        method: 'GET',
        mode: 'no-cors',
      })
      : null;
  })
    .filter(Boolean);
  Promise.all(impressionPromises).catch(e => {
    // eslint-disable-next-line no-console
    console.error('BAM Impression Error: ', e);
  });
}
function shouldFireImpression(lsKey, key, impLength) {
  if (window.innerWidth > 576) {
    return false;
  }
  // Get the limits from local storage
  const limits = JSON.parse(localStorage.getItem(lsKey) || '{}');
  const currentTime = Date.now();
  const impressionLength = key.includes('app.appsflyer') ? oneDay * 7 : impLength || halfDay;
  const expireTime = limits[key];
  if (!expireTime) {
    limits[key] = (currentTime + (impressionLength || oneDay)).toString();
    localStorage.setItem(lsKey, JSON.stringify(limits));
    return true;
  }
  if (currentTime > Number(expireTime)) {
    limits[key] = (currentTime + (impressionLength || oneDay)).toString();
    localStorage.setItem(lsKey, JSON.stringify(limits));
    return true;
  }
  return false;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-imports-ts
const FeaturedPromotionCard = ({ promotion, logPromotionClick, handleBonusCodeClick, bonusCodeWasClicked, }) => {
  return (hAsync("a", { class: "featured-item font", onClick: logPromotionClick, href: promotion.link },
    hAsync("div", null,
      hAsync("div", { class: "featured-item-content__header" },
        hAsync("span", null, "Special Offer")),
      hAsync("div", { class: "featured-item-content__container" },
        hAsync("div", { class: "featured-item-content" },
          hAsync("lazy-load-logo", { logo: promotion.logo, promoId: promotion.id, logoColor: promotion.logoColor }),
          hAsync("div", { class: "featured-item__description" },
            hAsync("div", { class: "featured-item__book-name" }, promotion.bookName),
            hAsync("div", { class: "featured-item__cta" }, promotion.cta),
            hAsync("div", { class: "featured-item__terms" }, promotion.termsText))),
        hAsync("div", { class: "buttons" },
          hAsync(BonusCode, { isFeatured: true, bonusCode: promotion.bonusCode, bonusCodeWasClicked: bonusCodeWasClicked, handleClick: handleBonusCodeClick }),
          hAsync("div", { class: "button button-font" }, promotion.buttonText))))));
};

const promotionCardCss = "/*!@.item*/.item.sc-promotion-card{text-decoration:none;display:flex;flex-wrap:wrap;align-items:center;padding:var(--spacing-small);border-bottom:1px solid var(--color-border);gap:0.5rem}/*!@.item-shadow*/.item-shadow.sc-promotion-card{border:1px solid var(--color-border);border-radius:var(--border-small);margin:var(--spacing-small);box-shadow:0px 10px 24px -14px rgba(0, 0, 0, 0.5);-webkit-box-shadow:0px 10px 24px -14px rgba(0, 0, 0, 0.5);-moz-box-shadow:0px 10px 24px -14px rgba(0, 0, 0, 0.5)}/*!@.item-content*/.item-content.sc-promotion-card{display:flex;align-items:center;flex:1;flex-basis:250px;gap:var(--spacing-small)}/*!@.item-logo*/.item-logo.sc-promotion-card{width:35px;height:35px;align-self:center}/*!@.item-description, .featured-item__description*/.item-description.sc-promotion-card,.featured-item__description.sc-promotion-card{display:flex;flex-direction:column;justify-content:center;align-items:flex-start;flex:1}/*!@.item-book-name, .featured-item__book-name*/.item-book-name.sc-promotion-card,.featured-item__book-name.sc-promotion-card{font-size:var(--font-size-subcaption);font-weight:var(--font-weight-bold);line-height:14px;color:var(--color-secondary)}/*!@.item-cta, .featured-item__cta*/.item-cta.sc-promotion-card,.featured-item__cta.sc-promotion-card{color:var(--color-primary);font-size:var(--font-size-caption);font-weight:var(--font-weight-bold);line-height:18px}/*!@.item-terms, .featured-item__terms*/.item-terms.sc-promotion-card,.featured-item__terms.sc-promotion-card{font-size:var(--font-size-subcaption);line-height:14px;color:var(--color-secondary)}/*!@.buttons*/.buttons.sc-promotion-card{width:100%;display:flex;flex:1 1 200px;justify-content:space-between;gap:var(--spacing-small)}/*!@.button*/.button.sc-promotion-card{border:1px solid var(--color-border);padding:var(--spacing-small) 0;border-radius:var(--border-small);background:border-box var(--color-success);cursor:pointer;flex:1 1 50%;align-self:center}/*!@.button-font*/.button-font.sc-promotion-card{color:var(--color-foreground);font-size:var(--font-size-subcaption);font-weight:800;line-height:14px;text-align:center}/*!@.bonus*/.bonus.sc-promotion-card{background-color:var(--color-background)}/*!@.featured-bonus*/.featured-bonus.sc-promotion-card{background-color:var(--color-brand-tertiary)}/*!@.bonus, .featured-bonus*/.bonus.sc-promotion-card,.featured-bonus.sc-promotion-card{flex:1 1 50%;padding:var(--spacing-tiny);border:1px dashed var(--color-border);border-radius:var(--border-small);text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;height:22px;line-height:var(--spacing-smedium)}/*!@.bonus:hover*/.bonus.sc-promotion-card:hover{background-color:var(--color-background);border:1px dashed var(--color-secondary)}/*!@.featured-bonus:hover*/.featured-bonus.sc-promotion-card:hover{border:1px dashed var(--color-secondary)}/*!@.bonus-code*/.bonus-code.sc-promotion-card{color:var(--color-primary);font-size:var(--font-size-subcaption);font-weight:800}/*!@.bonus-text*/.bonus-text.sc-promotion-card{color:var(--color-secondary);font-size:var(--font-size-caption);font-weight:800;font-size:9px}/*!@.bonus-copy*/.bonus-copy.sc-promotion-card{color:var(--color-info);font-size:var(--font-size-subcaption);font-weight:800}/*!@.no-code*/.no-code.sc-promotion-card{color:var(--color-secondary);font-size:var(--font-size-subcaption);font-weight:800;line-height:var(--spacing-smedium)}/*!@.featured-item*/.featured-item.sc-promotion-card{display:block;text-decoration:none}/*!@.featured-item-content__header*/.featured-item-content__header.sc-promotion-card{font-size:var(--font-size-subcaption);margin:0;padding:var(--spacing-tiny) var(--spacing-small);background-color:var(--color-brand-primary);color:var(--color-text-white)}/*!@.featured-item-content__container*/.featured-item-content__container.sc-promotion-card{background-color:var(--color-brand-secondary);display:flex;flex-wrap:wrap;align-items:center;padding:var(--spacing-small);border-bottom:1px solid var(--color-border);gap:0.5rem}/*!@.featured-item-content*/.featured-item-content.sc-promotion-card{display:flex;align-items:center;flex:1;flex-basis:250px;gap:var(--spacing-small)}";

class PromotionCard {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.onIntersection = entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          if (this.observer) {
            this.observer.disconnect();
          }
          this.logPromotionEvent('Impression');
          fireImpressions(this.promotion.impressionUrls);
        }
      }
    };
    this.isFeatured = false;
    this.promotion = undefined;
    this.propertyId = undefined;
    this.useBoxShadow = false;
    this.eventOptions = undefined;
    this.bonusCodeWasClicked = false;
  }
  componentDidRender() {
    if (!this.observer && Build.isBrowser) {
      this.observer = new IntersectionObserver(this.onIntersection.bind(this));
      this.observer.observe(this.el);
    }
  }
  handleBonusCodeClick() {
    this.bonusCodeWasClicked = true;
    setTimeout(() => {
      this.bonusCodeWasClicked = false;
    }, 2500);
  }
  logPromotionEvent(action) {
    const i13n = getPromotionEvent(Object.assign(Object.assign({}, this.eventOptions), { action, promotion: this.promotion }));
    debouncedLogEvent(this.propertyId, i13n);
  }
  render() {
    return (hAsync(Host, null, this.isFeatured ? (hAsync(FeaturedPromotionCard, { promotion: this.promotion, logPromotionClick: this.logPromotionEvent.bind(this, 'Click'), handleBonusCodeClick: this.handleBonusCodeClick.bind(this), bonusCodeWasClicked: this.bonusCodeWasClicked })) : (hAsync(PromotionCard$1, { promotion: this.promotion, logPromotionClick: this.logPromotionEvent.bind(this, 'Click'), handleBonusCodeClick: this.handleBonusCodeClick.bind(this), bonusCodeWasClicked: this.bonusCodeWasClicked, useBoxShadow: this.useBoxShadow }))));
  }
  get el() { return getElement(this); }
  static get style() { return promotionCardCss; }
  static get cmpMeta() { return {
    "$flags$": 9,
    "$tagName$": "promotion-card",
    "$members$": {
      "isFeatured": [4, "is-featured"],
      "promotion": [16],
      "propertyId": [2, "property-id"],
      "useBoxShadow": [4, "use-box-shadow"],
      "eventOptions": [16],
      "bonusCodeWasClicked": [32]
    },
    "$listeners$": undefined,
    "$lazyBundleId$": "-",
    "$attrsToReflect$": []
  }; }
}

const rotatingBannerCss = "/*!@:host*/.sc-rotating-banner-h{display:block}/*!@.inactive-banner*/.inactive-banner.sc-rotating-banner{display:none}";

class RotatingBanner {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.ROTATION_INTERVAL = 5000;
    this.promotions = [];
    this.parentWidth = undefined;
    this.propertyId = undefined;
    this.context = undefined;
    this.canUseAlternateLink = undefined;
    this.eventOptions = undefined;
    this.location = undefined;
    this.activeIndex = 0;
  }
  componentWillLoad() {
    this.interval = setInterval(() => {
      if (this.activeIndex === this.promotions.length - 1) {
        this.activeIndex = 0;
      }
      else {
        this.activeIndex = this.activeIndex + 1;
      }
    }, this.ROTATION_INTERVAL);
  }
  componenentDidUnload() {
    clearInterval(this.interval);
  }
  render() {
    return (hAsync(Host, null, this.promotions.map((promotion, index) => {
      return (hAsync("static-banner", { class: index !== this.activeIndex ? 'inactive-banner' : '', "parent-width": this.parentWidth, promotion: promotion, "property-id": this.propertyId, context: this.context, location: this.location, "can-use-alternate-link": this.canUseAlternateLink, "banner-type": "Rotating Banner", eventOptions: Object.assign(Object.assign({}, this.eventOptions), { allPromotions: this.promotions }) }));
    })));
  }
  static get style() { return rotatingBannerCss; }
  static get cmpMeta() { return {
    "$flags$": 9,
    "$tagName$": "rotating-banner",
    "$members$": {
      "promotions": [16],
      "parentWidth": [2, "parent-width"],
      "propertyId": [2, "property-id"],
      "context": [1],
      "canUseAlternateLink": [4, "can-use-alternate-link"],
      "eventOptions": [16],
      "location": [1],
      "activeIndex": [32]
    },
    "$listeners$": undefined,
    "$lazyBundleId$": "-",
    "$attrsToReflect$": []
  }; }
}

const rotatingStickyCtaCss = "/*!@:host*/.sc-rotating-sticky-cta-h{display:block}/*!@.inactive-sticky-cta*/.inactive-sticky-cta.sc-rotating-sticky-cta{display:none}";

class RotatingStickyCta {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.ROTATION_INTERVAL = 5000;
    this.placementId = undefined;
    this.propertyId = undefined;
    this.context = undefined;
    this.promotions = [];
    this.location = undefined;
    this.league = undefined;
    this.pageSlug = undefined;
    this.activeIndex = 0;
  }
  componentWillLoad() {
    this.interval = setInterval(() => {
      if (this.activeIndex === this.promotions.length - 1) {
        this.activeIndex = 0;
      }
      else {
        this.activeIndex = this.activeIndex + 1;
      }
    }, this.ROTATION_INTERVAL);
  }
  componenentDidUnload() {
    clearInterval(this.interval);
  }
  render() {
    return (hAsync(Host, null, this.promotions.map((promotion, index) => {
      return (hAsync("static-sticky-cta", { class: index !== this.activeIndex ? 'inactive-sticky-cta' : '', "placement-id": this.placementId, "property-id": this.propertyId, context: this.context, promotion: promotion, location: this.location, league: this.league, "page-slug": this.pageSlug }));
    })));
  }
  static get style() { return rotatingStickyCtaCss; }
  static get cmpMeta() { return {
    "$flags$": 9,
    "$tagName$": "rotating-sticky-cta",
    "$members$": {
      "placementId": [2, "placement-id"],
      "propertyId": [2, "property-id"],
      "context": [1],
      "promotions": [16],
      "location": [1],
      "league": [1],
      "pageSlug": [1, "page-slug"],
      "activeIndex": [32]
    },
    "$listeners$": undefined,
    "$lazyBundleId$": "-",
    "$attrsToReflect$": []
  }; }
}

// some width and height values are not correct in the API
// this is a temporary fix until the API is updated
const tempTypes = {
  5: { width: 303, height: 154 },
  6: { width: 3200, height: 280 },
  7: { width: 1000, height: 400 },
  8: { width: 375, height: 50 },
  38: { width: 375, height: 40 }, // Pro Tab Slim Ad
};
function getImageForAspectRatio(parentWidth, parentHeight, images) {
  const containerAspectRatio = parentWidth / parentHeight;
  // Calculate and determine smallest aspect ratio difference
  let currentImageType = null;
  let currentDifference = Infinity;
  for (const image of images) {
    const { id } = image.image_type;
    if (tempTypes[id]) {
      const { width, height } = tempTypes[id];
      const difference = Math.abs(containerAspectRatio - width / height);
      if (width >= parentWidth && difference < currentDifference) {
        currentImageType = id;
        currentDifference = difference;
      }
    }
  }
  // Use the selected image type to choose the corresponding image
  const selectedImage = images.find(image => image.image_type.id === parseInt(currentImageType));
  let imageHeight = selectedImage.image_type.height;
  let imageWidth = selectedImage.image_type.width;
  // Set the correct width and height for the image type
  if (tempTypes[selectedImage.image_type.id]) {
    imageHeight = tempTypes[selectedImage.image_type.id].height;
    imageWidth = tempTypes[selectedImage.image_type.id].width;
  }
  const newImage = Object.assign(Object.assign({}, selectedImage), { image_type: Object.assign(Object.assign({}, selectedImage.image_type), { height: imageHeight, width: imageWidth }) });
  return newImage;
}

const smartImageCss = "/*!@.image-container*/.image-container.sc-smart-image{margin:0 auto;display:flex;width:100%;height:100%}/*!@.image*/.image.sc-smart-image{border-radius:var(--border-small);width:auto;height:auto;max-width:100%;max-height:100%;margin:auto;object-fit:contain}";

class SmartImage {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.imageResizeLoader = {
      queuedImage: null,
      isRunning: false,
      load: (image) => {
        this.imageResizeLoader.queuedImage = image;
        if (this.imageResizeLoader.isRunning) {
          return;
        }
        this.imageResizeLoader.isRunning = true;
        setTimeout(() => {
          this.imageResizeLoader.isRunning = false;
          this.image = this.imageResizeLoader.queuedImage;
        }, 500);
      },
    };
    this.onIntersection = entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          if (this.observer) {
            this.observer.disconnect();
          }
          this.isViewed = true;
          this.logPromotionEvent('Impression');
          fireImpressions(this.promotion.impressionUrls);
        }
      }
    };
    this.parentSize = undefined;
    this.promotion = undefined;
    this.propertyId = undefined;
    this.context = undefined;
    this.canUseAlternateLink = undefined;
    this.eventOptions = undefined;
    this.location = undefined;
    this.image = undefined;
    this.color = undefined;
    this.isViewed = false;
  }
  // event listeners
  onParentChange(newParentAspectRatio) {
    const selectedImage = getImageForAspectRatio(newParentAspectRatio.width, newParentAspectRatio.height, this.promotion.images);
    if (selectedImage.image_url !== this.image.image_url) {
      this.image = selectedImage;
    }
    else {
      this.imageResizeLoader.load(selectedImage);
    }
  }
  componentDidRender() {
    if (!this.observer && Build.isBrowser) {
      this.observer = new IntersectionObserver(this.onIntersection.bind(this));
      this.observer.observe(this.el);
    }
  }
  connectedCallback() {
    this.setBannerProperties();
  }
  setBannerProperties() {
    var _a, _b;
    const color = this.promotion.logoColor;
    // Insert markup
    const selectedImage = getImageForAspectRatio(((_a = this.parentSize) === null || _a === void 0 ? void 0 : _a.width) || 1, ((_b = this.parentSize) === null || _b === void 0 ? void 0 : _b.height) || 1, this.promotion.images);
    this.image = selectedImage;
    this.color = color;
  }
  logPromotionEvent(action) {
    {
      const i13n = getPromotionEvent({
        componentType: 'Image',
        action,
        options: Object.assign(Object.assign({}, this.eventOptions), { stateCode: this.location, context: this.context, propertyId: this.propertyId }),
        promotion: this.promotion,
      });
      debouncedLogEvent(this.propertyId, i13n);
    }
  }
  render() {
    if (!this.promotion || !this.image) {
      return null;
    }
    const height = this.image.image_type.height;
    const width = this.image.image_type.width;
    return (hAsync(Host, null, hAsync("a", { id: "promo-container", class: "image-container", onClick: this.logPromotionEvent.bind(this, 'Click'), href: this.promotion.link }, this.isViewed ? (hAsync("img", { class: `lazy-logo ${LazyLoadClassName.BANNER_IMAGE}`, srcSet: createSrcSet(this.image.image_url, width, height), sizes: "(max-width: 1400px) 100vw, 1400px", alt: "promotion image" })) : (hAsync("img", { class: `lazy-logo ${LazyLoadClassName.BANNER_IMAGE}`, src: generateColorUri(this.color, 'desktopBanner'), alt: "promotion image" })))));
  }
  get el() { return getElement(this); }
  static get watchers() { return {
    "parentSize": ["onParentChange"]
  }; }
  static get style() { return smartImageCss; }
  static get cmpMeta() { return {
    "$flags$": 9,
    "$tagName$": "smart-image",
    "$members$": {
      "parentSize": [16],
      "promotion": [16],
      "propertyId": [2, "property-id"],
      "context": [1],
      "canUseAlternateLink": [4, "can-use-alternate-link"],
      "eventOptions": [16],
      "location": [1],
      "image": [32],
      "color": [32],
      "isViewed": [32]
    },
    "$listeners$": undefined,
    "$lazyBundleId$": "-",
    "$attrsToReflect$": []
  }; }
}

const staticBannerCss = "/*!@.banner*/.banner.sc-static-banner{max-width:100%;margin:0 auto;position:relative}/*!@.image*/.image.sc-static-banner{border-radius:var(--border-large);width:100%;max-height:100%}";

class StaticBanner {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.onIntersection = entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          if (this.observer) {
            this.observer.disconnect();
          }
          this.isViewed = true;
          this.logPromotionEvent('Impression');
          fireImpressions(this.promotion.impressionUrls);
        }
      }
    };
    this.parentWidth = undefined;
    this.promotion = undefined;
    this.propertyId = undefined;
    this.context = undefined;
    this.canUseAlternateLink = undefined;
    this.eventOptions = undefined;
    this.bannerType = 'Banner';
    this.location = undefined;
    this.switchboardLink = undefined;
    this.imageSize = undefined;
    this.imageLink = undefined;
    this.color = undefined;
    this.isViewed = false;
  }
  // event listeners
  onParentChange(newParentWidth) {
    const imageSize = getImageSize(newParentWidth);
    if (imageSize !== this.imageSize) {
      this.setNewLinks(imageSize);
    }
  }
  componentDidRender() {
    if (!this.observer && !this.isViewed && Build.isBrowser) {
      this.observer = new IntersectionObserver(this.onIntersection.bind(this));
      this.observer.observe(this.el);
    }
  }
  connectedCallback() {
    {
      this.isViewed = true;
    }
    this.setBannerProperties();
  }
  setBannerProperties() {
    const paidMarketing = getQueryParamFromUrl('paidMarketing');
    const switchboardLink = this.promotion.alternateLink ||
      createSwitchboardLink(this.promotion.switchboard_domain, {
        affiliateId: this.promotion.bookId,
        campaignId: this.promotion.campaignId,
        stateCode: this.location,
        context: this.context,
        propertyId: this.propertyId,
        options: paidMarketing,
      });
    const color = this.promotion.logoColor;
    // Insert markup
    const imageSize = getImageSize(this.parentWidth);
    const imageLink = this.promotion[imageSize];
    this.switchboardLink = switchboardLink;
    this.imageSize = imageSize;
    this.imageLink = imageLink;
    this.color = color;
    this.setNewLinks(imageSize);
  }
  setNewLinks(imageSize) {
    const paidMarketing = getQueryParamFromUrl('paidMarketing');
    const promotion = this.promotion;
    if (!promotion) {
      return;
    }
    const switchboardLink = promotion.alternateLink ||
      createSwitchboardLink(this.promotion.switchboard_domain, {
        affiliateId: promotion.bookId,
        campaignId: promotion.campaignId,
        stateCode: this.location,
        context: this.context,
        propertyId: this.propertyId,
        options: paidMarketing,
      });
    const imageLink = promotion[imageSize];
    this.imageSize = imageSize;
    this.imageLink = imageLink;
    this.switchboardLink = switchboardLink;
  }
  logPromotionEvent(action) {
    const i13n = getPromotionEvent({
      componentType: this.bannerType,
      action,
      options: Object.assign(Object.assign({}, this.eventOptions), { stateCode: this.location, context: this.context, propertyId: this.propertyId }),
      promotion: this.promotion,
    });
    debouncedLogEvent(this.propertyId, i13n);
  }
  render() {
    const height = this.imageSize === 'desktopBanner' ? 280 : 150;
    const width = this.imageSize === 'desktopBanner' ? 3200 : 1125;
    return (hAsync(Host, null, hAsync("a", { id: "promo-container", class: "banner", onClick: this.logPromotionEvent.bind(this, 'Click'), href: this.switchboardLink }, this.isViewed ? (hAsync("img", { class: `lazy-logo ${LazyLoadClassName.BANNER_IMAGE}`, srcSet: createSrcSet(this.imageLink, width, height), sizes: "(max-width: 1400px) 100vw, 1400px", alt: "promotion banner image" })) : (hAsync("img", { class: `lazy-logo ${LazyLoadClassName.BANNER_IMAGE}`, src: generateColorUri(this.color, this.imageSize), alt: "promotion banner image" })))));
  }
  get el() { return getElement(this); }
  static get watchers() { return {
    "parentWidth": ["onParentChange"]
  }; }
  static get style() { return staticBannerCss; }
  static get cmpMeta() { return {
    "$flags$": 9,
    "$tagName$": "static-banner",
    "$members$": {
      "parentWidth": [2, "parent-width"],
      "promotion": [16],
      "propertyId": [2, "property-id"],
      "context": [1],
      "canUseAlternateLink": [4, "can-use-alternate-link"],
      "eventOptions": [16],
      "bannerType": [1, "banner-type"],
      "location": [1],
      "switchboardLink": [32],
      "imageSize": [32],
      "imageLink": [32],
      "color": [32],
      "isViewed": [32]
    },
    "$listeners$": undefined,
    "$lazyBundleId$": "-",
    "$attrsToReflect$": []
  }; }
}

const INITIAL_PERSISTED_STATE = {
  stickyCtaDismissTime: {},
};
function getPersistedState(initialState = INITIAL_PERSISTED_STATE) {
  var _a;
  const persistedState = typeof window !== 'undefined' && localStorage['persist:bam']
    ? JSON.parse((_a = JSON.parse(localStorage['persist:bam'])) === null || _a === void 0 ? void 0 : _a.persistedState)
    : initialState;
  return persistedState;
}
function handleUpdatePersistedState({ key, subKey = '', value }) {
  const persistedState = getPersistedState();
  const updatedState = subKey
    ? Object.assign(Object.assign({}, persistedState), { [key]: Object.assign(Object.assign({}, persistedState[key]), { [subKey]: value }) }) : Object.assign(Object.assign({}, persistedState), { [key]: value });
  try {
    localStorage.setItem('persist:bam', JSON.stringify({ persistedState: JSON.stringify(updatedState) }));
  }
  catch (_a) {
    // Eat error
  }
}

const staticStickyCtaCss = "/*!@.cta*/.cta.sc-static-sticky-cta{position:fixed;bottom:2%;left:50%;transform:translate(-50%);transition:transform 1000ms ease-in, opacity 1000ms ease-in;width:65%;max-width:750px;z-index:2147483647}/*!@.container*/.container.sc-static-sticky-cta{display:grid;grid-template-columns:35px auto 110px 16px;column-gap:10px;align-items:center;padding:var(--spacing-smedium);background-color:var(--color-foreground);border-radius:var(--border-large);box-shadow:0px 1px 6px 4px var(--color-shadow)}/*!@.item-logo*/.item-logo.sc-static-sticky-cta{width:35px;height:35px;margin-right:var(--spacing-small);border-radius:var(--border-small)}/*!@.link*/.link.sc-static-sticky-cta{text-decoration:none}/*!@.button*/.button.sc-static-sticky-cta{border:1px solid var(--color-border);padding:var(--spacing-tiny) var(--spacing-small);text-align:center;border-radius:var(--border-small);background:border-box var(--color-success);cursor:pointer}/*!@.button:hover*/.button.sc-static-sticky-cta:hover{transform:var(--button-hover-transform, none);opacity:var(--button-hover-opacity);background-color:var(--button-hover-bg);transition:var(--hover-transition)}/*!@.close*/.close.sc-static-sticky-cta{align-self:center;cursor:pointer}/*!@.font*/.font.sc-static-sticky-cta{color:var(--color-primary);font-size:var(--font-size-caption);font-weight:var(--font-weight-bold);font-family:var(--font-family);line-height:18px}/*!@.button-font*/.button-font.sc-static-sticky-cta{color:var(--button-color);font-size:var(--font-size-caption);font-weight:var(--font-weight-bold);line-height:14px}/*!@.terms*/.terms.sc-static-sticky-cta{font-size:var(--font-size-subcaption);font-weight:var(--font-weight-bold);line-height:14px;color:var(--color-secondary)}@media (max-width: 768px){/*!@.cta*/.cta.sc-static-sticky-cta{width:80%}}@media (max-width: 576px){/*!@.cta*/.cta.sc-static-sticky-cta{width:95%}/*!@.container*/.container.sc-static-sticky-cta{grid-template-columns:auto auto 16px;row-gap:10px}/*!@.link*/.link.sc-static-sticky-cta{grid-column-start:1;grid-column-end:span 3}/*!@.close*/.close.sc-static-sticky-cta{grid-row:1 / 2;grid-column:3 / 3}}";

class StaticStickyCta {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.placementId = undefined;
    this.propertyId = undefined;
    this.context = undefined;
    this.promotion = undefined;
    this.location = undefined;
    this.league = undefined;
    this.pageSlug = undefined;
    this.canShow = undefined;
  }
  onPromotionChange(newPromotionValue) {
    if (newPromotionValue) {
      this.logPromotionEvent('Impression');
    }
  }
  connectedCallback() {
    this.canShow = this.handleCanShowCTA();
  }
  handleCanShowCTA() {
    var _a;
    const persistedState = getPersistedState();
    const dismissal = (_a = persistedState === null || persistedState === void 0 ? void 0 : persistedState.stickyCtaDismissTime) === null || _a === void 0 ? void 0 : _a[this.placementId];
    const timeSinceDismissal = (Date.now() - Number(dismissal)) / 1000;
    const sixHours = 60 * 60 * 6;
    if (!dismissal || timeSinceDismissal > sixHours) {
      return true;
    }
    return false;
  }
  handleClose() {
    handleUpdatePersistedState({
      key: 'stickyCtaDismissTime',
      subKey: this.placementId.toString(),
      value: Date.now().toString(),
    });
    this.canShow = false;
  }
  logPromotionEvent(action) {
    const i13n = getPromotionEvent({
      componentType: 'Sticky CTA',
      action,
      options: {
        stateCode: this.location,
        context: this.context,
        propertyId: Number(this.propertyId),
        placementId: this.placementId,
        league: this.league,
        allPromotions: [this.promotion],
        pageSlug: this.pageSlug,
      },
      promotion: this.promotion,
    });
    debouncedLogEvent(this.propertyId, i13n);
  }
  render() {
    const canShowCTA = !!this.promotion && this.canShow;
    canShowCTA && fireImpressions(this.promotion.impressionUrls);
    return canShowCTA ? (hAsync("div", { class: "cta font" }, hAsync("div", { id: "promo-container", class: "container" }, hAsync("lazy-load-logo", { logo: this.promotion.logo, promoId: this.promotion.id, logoColor: this.promotion.logoColor }), hAsync("div", { class: "info font" }, this.promotion.cta, hAsync("div", { class: "terms" }, this.promotion.termsText)), hAsync("a", { class: "link", onClick: this.logPromotionEvent.bind(this, 'Click'), href: this.promotion.link }, hAsync("div", { class: "button button-font" }, this.promotion.buttonText)), hAsync("div", { onClick: this.handleClose.bind(this), "data-action": "bam-close", class: "close" }, hAsync("svg", { fill: "#000000", stroke: "#000000", "stroke-width": "0", width: "16", height: "16", viewBox: "-3 -3 23 23", xmlns: "http://www.w3.org/2000/svg" }, hAsync("title", null, "Close CTA Button"), hAsync("path", { fill: "#000000", d: "M15.707 1.707A1 1 0 0014.293.293L8 6.586 1.707.293A1 1 0 10.293 1.707L6.586 8 .293 14.292a1 1 0 101.414 1.415L8 9.414l6.293 6.293a1 1 0 001.414-1.415L9.414 8l6.293-6.293z" })))))) : null;
  }
  static get watchers() { return {
    "promotion": ["onPromotionChange"]
  }; }
  static get style() { return staticStickyCtaCss; }
  static get cmpMeta() { return {
    "$flags$": 9,
    "$tagName$": "static-sticky-cta",
    "$members$": {
      "placementId": [2, "placement-id"],
      "propertyId": [2, "property-id"],
      "context": [1],
      "promotion": [16],
      "location": [1],
      "league": [1],
      "pageSlug": [1, "page-slug"],
      "canShow": [32]
    },
    "$listeners$": undefined,
    "$lazyBundleId$": "-",
    "$attrsToReflect$": []
  }; }
}

registerComponents([
  BamBanner,
  BamFooter,
  BamImage,
  BamInlinePromotion,
  BamInlinePromotionBlock,
  BamPromotionList,
  BamStickyCta,
  LazyLoadLogo,
  PromotionCard,
  RotatingBanner,
  RotatingStickyCta,
  SmartImage,
  StaticBanner,
  StaticStickyCta,
]);

exports.hydrateApp = hydrateApp;


  /*hydrateAppClosure end*/
  hydrateApp(window, $stencilHydrateOpts, $stencilHydrateResults, $stencilAfterHydrate, $stencilHydrateResolve);
  }

  hydrateAppClosure($stencilWindow);
}

function createWindowFromHtml(e, t) {
 let r = templateWindows.get(t);
 return null == r && (r = new MockWindow(e), templateWindows.set(t, r)), cloneWindow(r);
}

function inspectElement(e, t, r) {
 const s = t.children;
 for (let t = 0, n = s.length; t < n; t++) {
  const n = s[t], o = n.nodeName.toLowerCase();
  if (o.includes("-")) {
   const t = e.components.find((e => e.tag === o));
   null != t && (t.count++, r > t.depth && (t.depth = r));
  } else switch (o) {
  case "a":
   const t = collectAttributes(n);
   t.href = n.href, "string" == typeof t.href && (e.anchors.some((e => e.href === t.href)) || e.anchors.push(t));
   break;

  case "img":
   const r = collectAttributes(n);
   r.src = n.src, "string" == typeof r.src && (e.imgs.some((e => e.src === r.src)) || e.imgs.push(r));
   break;

  case "link":
   const s = collectAttributes(n);
   s.href = n.href, "string" == typeof s.rel && "stylesheet" === s.rel.toLowerCase() && "string" == typeof s.href && (e.styles.some((e => e.link === s.href)) || (delete s.rel, 
   delete s.type, e.styles.push(s)));
   break;

  case "script":
   const o = collectAttributes(n);
   if (n.hasAttribute("src")) o.src = n.src, "string" == typeof o.src && (e.scripts.some((e => e.src === o.src)) || e.scripts.push(o)); else {
    const t = n.getAttribute("data-stencil-static");
    t && e.staticData.push({
     id: t,
     type: n.getAttribute("type"),
     content: n.textContent
    });
   }
  }
  inspectElement(e, n, ++r);
 }
}

function collectAttributes(e) {
 const t = {}, r = e.attributes;
 for (let e = 0, s = r.length; e < s; e++) {
  const s = r.item(e), n = s.nodeName.toLowerCase();
  if (SKIP_ATTRS.has(n)) continue;
  const o = s.nodeValue;
  "class" === n && "" === o || (t[n] = o);
 }
 return t;
}

function patchDomImplementation(e, t) {
 let r;
 if (null != e.defaultView ? (t.destroyWindow = !0, patchWindow(e.defaultView), r = e.defaultView) : (t.destroyWindow = !0, 
 t.destroyDocument = !1, r = new MockWindow(!1)), r.document !== e && (r.document = e), 
 e.defaultView !== r && (e.defaultView = r), "function" != typeof e.documentElement.constructor.prototype.getRootNode && (e.createElement("unknown-element").constructor.prototype.getRootNode = getRootNode), 
 "function" == typeof e.createEvent) {
  const t = e.createEvent("CustomEvent").constructor;
  r.CustomEvent !== t && (r.CustomEvent = t);
 }
 try {
  e.baseURI;
 } catch (t) {
  Object.defineProperty(e, "baseURI", {
   get() {
    const t = e.querySelector("base[href]");
    return t ? new URL(t.getAttribute("href"), r.location.href).href : r.location.href;
   }
  });
 }
 return r;
}

function getRootNode(e) {
 const t = null != e && !0 === e.composed;
 let r = this;
 for (;null != r.parentNode; ) r = r.parentNode, !0 === t && null == r.parentNode && null != r.host && (r = r.host);
 return r;
}

function normalizeHydrateOptions(e) {
 const t = Object.assign({
  serializeToHtml: !1,
  destroyWindow: !1,
  destroyDocument: !1
 }, e || {});
 return "boolean" != typeof t.clientHydrateAnnotations && (t.clientHydrateAnnotations = !0), 
 "boolean" != typeof t.constrainTimeouts && (t.constrainTimeouts = !0), "number" != typeof t.maxHydrateCount && (t.maxHydrateCount = 300), 
 "boolean" != typeof t.runtimeLogging && (t.runtimeLogging = !1), "number" != typeof t.timeout && (t.timeout = 15e3), 
 Array.isArray(t.excludeComponents) ? t.excludeComponents = t.excludeComponents.filter(filterValidTags).map(mapValidTags) : t.excludeComponents = [], 
 Array.isArray(t.staticComponents) ? t.staticComponents = t.staticComponents.filter(filterValidTags).map(mapValidTags) : t.staticComponents = [], 
 t;
}

function filterValidTags(e) {
 return "string" == typeof e && e.includes("-");
}

function mapValidTags(e) {
 return e.trim().toLowerCase();
}

function generateHydrateResults(e) {
 "string" != typeof e.url && (e.url = "https://hydrate.stenciljs.com/"), "string" != typeof e.buildId && (e.buildId = createHydrateBuildId());
 const t = {
  buildId: e.buildId,
  diagnostics: [],
  url: e.url,
  host: null,
  hostname: null,
  href: null,
  pathname: null,
  port: null,
  search: null,
  hash: null,
  html: null,
  httpStatus: null,
  hydratedCount: 0,
  anchors: [],
  components: [],
  imgs: [],
  scripts: [],
  staticData: [],
  styles: [],
  title: null
 };
 try {
  const r = new URL(e.url, "https://hydrate.stenciljs.com/");
  t.url = r.href, t.host = r.host, t.hostname = r.hostname, t.href = r.href, t.port = r.port, 
  t.pathname = r.pathname, t.search = r.search, t.hash = r.hash;
 } catch (e) {
  renderCatchError(t, e);
 }
 return t;
}

function renderBuildDiagnostic(e, t, r, s) {
 const n = {
  level: t,
  type: "build",
  header: r,
  messageText: s,
  relFilePath: null,
  absFilePath: null,
  lines: []
 };
 return e.pathname ? "/" !== e.pathname && (n.header += ": " + e.pathname) : e.url && (n.header += ": " + e.url), 
 e.diagnostics.push(n), n;
}

function renderBuildError(e, t) {
 return renderBuildDiagnostic(e, "error", "Hydrate Error", t);
}

function renderCatchError(e, t) {
 const r = renderBuildError(e, null);
 return null != t && (null != t.stack ? r.messageText = t.stack.toString() : null != t.message ? r.messageText = t.message.toString() : r.messageText = t.toString()), 
 r;
}

function runtimeLog(e, t, r) {
 global.console[t].apply(global.console, [ `[ ${e}  ${t} ] `, ...r ]);
}

function renderToString(e, t) {
 const r = normalizeHydrateOptions(t);
 return r.serializeToHtml = !0, new Promise((t => {
  let s;
  const n = generateHydrateResults(r);
  if (hasError(n.diagnostics)) t(n); else if ("string" == typeof e) try {
   r.destroyWindow = !0, r.destroyDocument = !0, s = new MockWindow(e), render(s, r, n, t);
  } catch (e) {
   s && s.close && s.close(), s = null, renderCatchError(n, e), t(n);
  } else if (isValidDocument(e)) try {
   r.destroyDocument = !1, s = patchDomImplementation(e, r), render(s, r, n, t);
  } catch (e) {
   s && s.close && s.close(), s = null, renderCatchError(n, e), t(n);
  } else renderBuildError(n, 'Invalid html or document. Must be either a valid "html" string, or DOM "document".'), 
  t(n);
 }));
}

function hydrateDocument(e, t) {
 const r = normalizeHydrateOptions(t);
 return r.serializeToHtml = !1, new Promise((t => {
  let s;
  const n = generateHydrateResults(r);
  if (hasError(n.diagnostics)) t(n); else if ("string" == typeof e) try {
   r.destroyWindow = !0, r.destroyDocument = !0, s = new MockWindow(e), render(s, r, n, t);
  } catch (e) {
   s && s.close && s.close(), s = null, renderCatchError(n, e), t(n);
  } else if (isValidDocument(e)) try {
   r.destroyDocument = !1, s = patchDomImplementation(e, r), render(s, r, n, t);
  } catch (e) {
   s && s.close && s.close(), s = null, renderCatchError(n, e), t(n);
  } else renderBuildError(n, 'Invalid html or document. Must be either a valid "html" string, or DOM "document".'), 
  t(n);
 }));
}

function render(e, t, r, s) {
 if (process.__stencilErrors || (process.__stencilErrors = !0, process.on("unhandledRejection", (e => {
  console.log("unhandledRejection", e);
 }))), function n(e, t, r, s) {
  try {
   e.location.href = r.url;
  } catch (e) {
   renderCatchError(s, e);
  }
  if ("string" == typeof r.userAgent) try {
   e.navigator.userAgent = r.userAgent;
  } catch (e) {}
  if ("string" == typeof r.cookie) try {
   t.cookie = r.cookie;
  } catch (e) {}
  if ("string" == typeof r.referrer) try {
   t.referrer = r.referrer;
  } catch (e) {}
  if ("string" == typeof r.direction) try {
   t.documentElement.setAttribute("dir", r.direction);
  } catch (e) {}
  if ("string" == typeof r.language) try {
   t.documentElement.setAttribute("lang", r.language);
  } catch (e) {}
  if ("string" == typeof r.buildId) try {
   t.documentElement.setAttribute("data-stencil-build", r.buildId);
  } catch (e) {}
  try {
   e.customElements = null;
  } catch (e) {}
  return r.constrainTimeouts && constrainTimeouts(e), function n(e, t, r) {
   try {
    const s = e.location.pathname;
    e.console.error = (...e) => {
     const n = e.reduce(((e, t) => {
      if (t) {
       if (null != t.stack) return e + " " + String(t.stack);
       if (null != t.message) return e + " " + String(t.message);
      }
      return String(t);
     }), "").trim();
     "" !== n && (renderCatchError(r, n), t.runtimeLogging && runtimeLog(s, "error", [ n ]));
    }, e.console.debug = (...e) => {
     renderBuildDiagnostic(r, "debug", "Hydrate Debug", [ ...e ].join(", ")), t.runtimeLogging && runtimeLog(s, "debug", e);
    }, t.runtimeLogging && [ "log", "warn", "assert", "info", "trace" ].forEach((t => {
     e.console[t] = (...e) => {
      runtimeLog(s, t, e);
     };
    }));
   } catch (e) {
    renderCatchError(r, e);
   }
  }(e, r, s), e;
 }(e, e.document, t, r), "function" == typeof t.beforeHydrate) try {
  const n = t.beforeHydrate(e.document);
  isPromise(n) ? n.then((() => {
   hydrateFactory(e, t, r, afterHydrate, s);
  })) : hydrateFactory(e, t, r, afterHydrate, s);
 } catch (n) {
  renderCatchError(r, n), finalizeHydrate(e, e.document, t, r, s);
 } else hydrateFactory(e, t, r, afterHydrate, s);
}

function afterHydrate(e, t, r, s) {
 if ("function" == typeof t.afterHydrate) try {
  const n = t.afterHydrate(e.document);
  isPromise(n) ? n.then((() => {
   finalizeHydrate(e, e.document, t, r, s);
  })) : finalizeHydrate(e, e.document, t, r, s);
 } catch (n) {
  renderCatchError(r, n), finalizeHydrate(e, e.document, t, r, s);
 } else finalizeHydrate(e, e.document, t, r, s);
}

function finalizeHydrate(e, t, r, s, n) {
 try {
  if (inspectElement(s, t.documentElement, 0), !1 !== r.removeUnusedStyles) try {
   removeUnusedStyles(t, s.diagnostics);
  } catch (e) {
   renderCatchError(s, e);
  }
  if ("string" == typeof r.title) try {
   t.title = r.title;
  } catch (e) {
   renderCatchError(s, e);
  }
  s.title = t.title, r.removeScripts && removeScripts(t.documentElement);
  try {
   updateCanonicalLink(t, r.canonicalUrl);
  } catch (e) {
   renderCatchError(s, e);
  }
  try {
   relocateMetaCharset(t);
  } catch (e) {}
  hasError(s.diagnostics) || (s.httpStatus = 200);
  try {
   const e = t.head.querySelector('meta[http-equiv="status"]');
   if (null != e) {
    const t = e.getAttribute("content");
    t && t.length > 0 && (s.httpStatus = parseInt(t, 10));
   }
  } catch (e) {}
  r.clientHydrateAnnotations && t.documentElement.classList.add("hydrated"), r.serializeToHtml && (s.html = serializeDocumentToString(t, r));
 } catch (e) {
  renderCatchError(s, e);
 }
 if (r.destroyWindow) try {
  r.destroyDocument || (e.document = null, t.defaultView = null), e.close && e.close();
 } catch (e) {
  renderCatchError(s, e);
 }
 n(s);
}

function serializeDocumentToString(e, t) {
 return serializeNodeToHtml(e, {
  approximateLineWidth: t.approximateLineWidth,
  outerHtml: !1,
  prettyHtml: t.prettyHtml,
  removeAttributeQuotes: t.removeAttributeQuotes,
  removeBooleanAttributeQuotes: t.removeBooleanAttributeQuotes,
  removeEmptyAttributes: t.removeEmptyAttributes,
  removeHtmlComments: t.removeHtmlComments,
  serializeShadowRoot: !1
 });
}

function isValidDocument(e) {
 return null != e && 9 === e.nodeType && null != e.documentElement && 1 === e.documentElement.nodeType && null != e.body && 1 === e.body.nodeType;
}

function removeScripts(e) {
 const t = e.children;
 for (let e = t.length - 1; e >= 0; e--) {
  const r = t[e];
  removeScripts(r), ("SCRIPT" === r.nodeName || "LINK" === r.nodeName && "modulepreload" === r.getAttribute("rel")) && r.remove();
 }
}

const templateWindows = new Map, isPromise = e => !!e && ("object" == typeof e || "function" == typeof e) && "function" == typeof e.then, hasError = e => null != e && 0 !== e.length && e.some((e => "error" === e.level && "runtime" !== e.type)), TASK_CANCELED_MSG = "task canceled", updateCanonicalLink = (e, t) => {
 let r = e.head.querySelector('link[rel="canonical"]');
 "string" == typeof t ? (null == r && (r = e.createElement("link"), r.setAttribute("rel", "canonical"), 
 e.head.appendChild(r)), r.setAttribute("href", t)) : null != r && (r.getAttribute("href") || r.parentNode.removeChild(r));
}, relocateMetaCharset = e => {
 const t = e.head;
 let r = t.querySelector("meta[charset]");
 null == r ? (r = e.createElement("meta"), r.setAttribute("charset", "utf-8")) : r.remove(), 
 t.insertBefore(r, t.firstChild);
}, parseCss = (e, t) => {
 let r = 1, s = 1;
 const n = [], o = e => {
  const t = e.match(/\n/g);
  t && (r += t.length);
  const n = e.lastIndexOf("\n");
  s = ~n ? e.length - n : s + e.length;
 }, i = () => {
  const e = {
   line: r,
   column: s
  };
  return t => (t.position = new z(e), m(), t);
 }, a = o => {
  const i = e.split("\n"), a = {
   level: "error",
   type: "css",
   language: "css",
   header: "CSS Parse",
   messageText: o,
   absFilePath: t,
   lines: [ {
    lineIndex: r - 1,
    lineNumber: r,
    errorCharStart: s,
    text: e[r - 1]
   } ]
  };
  if (r > 1) {
   const t = {
    lineIndex: r - 1,
    lineNumber: r - 1,
    text: e[r - 2],
    errorCharStart: -1,
    errorLength: -1
   };
   a.lines.unshift(t);
  }
  if (r + 2 < i.length) {
   const e = {
    lineIndex: r,
    lineNumber: r + 1,
    text: i[r],
    errorCharStart: -1,
    errorLength: -1
   };
   a.lines.push(e);
  }
  return n.push(a), null;
 }, l = () => u(/^{\s*/), c = () => u(/^}/), u = t => {
  const r = t.exec(e);
  if (!r) return;
  const s = r[0];
  return o(s), e = e.slice(s.length), r;
 }, d = () => {
  let t;
  const r = [];
  for (m(), h(r); e.length && "}" !== e.charAt(0) && (t = w() || A()); ) r.push(t), 
  h(r);
  return r;
 }, m = () => u(/^\s*/), h = e => {
  let t;
  for (e = e || []; t = p(); ) e.push(t);
  return e;
 }, p = () => {
  const t = i();
  if ("/" !== e.charAt(0) || "*" !== e.charAt(1)) return null;
  let r = 2;
  for (;"" !== e.charAt(r) && ("*" !== e.charAt(r) || "/" !== e.charAt(r + 1)); ) ++r;
  if (r += 2, "" === e.charAt(r - 1)) return a("End of comment missing");
  const n = e.slice(2, r - 2);
  return s += 2, o(n), e = e.slice(r), s += 2, t({
   type: 1,
   comment: n
  });
 }, f = () => {
  const e = u(/^([^{]+)/);
  return e ? trim(e[0]).replace(/\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*\/+/g, "").replace(/"(?:\\"|[^"])*"|'(?:\\'|[^'])*'/g, (function(e) {
   return e.replace(/,/g, "‌");
  })).split(/\s*(?![^(]*\)),\s*/).map((function(e) {
   return e.replace(/\u200C/g, ",");
  })) : null;
 }, g = () => {
  const e = i();
  let t = u(/^(\*?[-#\/\*\\\w]+(\[[0-9a-z_-]+\])?)\s*/);
  if (!t) return null;
  if (t = trim(t[0]), !u(/^:\s*/)) return a("property missing ':'");
  const r = u(/^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^\)]*?\)|[^};])+)/), s = e({
   type: 4,
   property: t.replace(commentre, ""),
   value: r ? trim(r[0]).replace(commentre, "") : ""
  });
  return u(/^[;\s]*/), s;
 }, y = () => {
  const e = [];
  if (!l()) return a("missing '{'");
  let t;
  for (h(e); t = g(); ) e.push(t), h(e);
  return c() ? e : a("missing '}'");
 }, C = () => {
  let e;
  const t = [], r = i();
  for (;e = u(/^((\d+\.\d+|\.\d+|\d+)%?|[a-z]+)\s*/); ) t.push(e[1]), u(/^,\s*/);
  return t.length ? r({
   type: 9,
   values: t,
   declarations: y()
  }) : null;
 }, S = (e, t) => {
  const r = new RegExp("^@" + e + "\\s*([^;]+);");
  return () => {
   const s = i(), n = u(r);
   if (!n) return null;
   const o = {
    type: t
   };
   return o[e] = n[1].trim(), s(o);
  };
 }, E = S("import", 7), b = S("charset", 0), T = S("namespace", 11), w = () => "@" !== e[0] ? null : (() => {
  const e = i();
  let t = u(/^@([-\w]+)?keyframes\s*/);
  if (!t) return null;
  const r = t[1];
  if (t = u(/^([-\w]+)\s*/), !t) return a("@keyframes missing name");
  const s = t[1];
  if (!l()) return a("@keyframes missing '{'");
  let n, o = h();
  for (;n = C(); ) o.push(n), o = o.concat(h());
  return c() ? e({
   type: 8,
   name: s,
   vendor: r,
   keyframes: o
  }) : a("@keyframes missing '}'");
 })() || (() => {
  const e = i(), t = u(/^@media *([^{]+)/);
  if (!t) return null;
  const r = trim(t[1]);
  if (!l()) return a("@media missing '{'");
  const s = h().concat(d());
  return c() ? e({
   type: 10,
   media: r,
   rules: s
  }) : a("@media missing '}'");
 })() || (() => {
  const e = i(), t = u(/^@custom-media\s+(--[^\s]+)\s*([^{;]+);/);
  return t ? e({
   type: 2,
   name: trim(t[1]),
   media: trim(t[2])
  }) : null;
 })() || (() => {
  const e = i(), t = u(/^@supports *([^{]+)/);
  if (!t) return null;
  const r = trim(t[1]);
  if (!l()) return a("@supports missing '{'");
  const s = h().concat(d());
  return c() ? e({
   type: 15,
   supports: r,
   rules: s
  }) : a("@supports missing '}'");
 })() || E() || b() || T() || (() => {
  const e = i(), t = u(/^@([-\w]+)?document *([^{]+)/);
  if (!t) return null;
  const r = trim(t[1]), s = trim(t[2]);
  if (!l()) return a("@document missing '{'");
  const n = h().concat(d());
  return c() ? e({
   type: 3,
   document: s,
   vendor: r,
   rules: n
  }) : a("@document missing '}'");
 })() || (() => {
  const e = i();
  if (!u(/^@page */)) return null;
  const t = f() || [];
  if (!l()) return a("@page missing '{'");
  let r, s = h();
  for (;r = g(); ) s.push(r), s = s.concat(h());
  return c() ? e({
   type: 12,
   selectors: t,
   declarations: s
  }) : a("@page missing '}'");
 })() || (() => {
  const e = i();
  if (!u(/^@host\s*/)) return null;
  if (!l()) return a("@host missing '{'");
  const t = h().concat(d());
  return c() ? e({
   type: 6,
   rules: t
  }) : a("@host missing '}'");
 })() || (() => {
  const e = i();
  if (!u(/^@font-face\s*/)) return null;
  if (!l()) return a("@font-face missing '{'");
  let t, r = h();
  for (;t = g(); ) r.push(t), r = r.concat(h());
  return c() ? e({
   type: 5,
   declarations: r
  }) : a("@font-face missing '}'");
 })(), A = () => {
  const e = i(), t = f();
  return t ? (h(), e({
   type: 13,
   selectors: t,
   declarations: y()
  })) : a("selector missing");
 };
 class z {
  constructor(e) {
   this.start = e, this.end = {
    line: r,
    column: s
   }, this.source = t;
  }
 }
 return z.prototype.content = e, {
  diagnostics: n,
  ...addParent((() => {
   const e = d();
   return {
    type: 14,
    stylesheet: {
     source: t,
     rules: e
    }
   };
  })())
 };
}, trim = e => e ? e.trim() : "", addParent = (e, t) => {
 const r = e && "string" == typeof e.type, s = r ? e : t;
 for (const t in e) {
  const r = e[t];
  Array.isArray(r) ? r.forEach((function(e) {
   addParent(e, s);
  })) : r && "object" == typeof r && addParent(r, s);
 }
 return r && Object.defineProperty(e, "parent", {
  configurable: !0,
  writable: !0,
  enumerable: !1,
  value: t || null
 }), e;
}, commentre = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g, getCssSelectors = e => {
 SELECTORS.all.length = SELECTORS.tags.length = SELECTORS.classNames.length = SELECTORS.ids.length = SELECTORS.attrs.length = 0;
 const t = (e = e.replace(/\./g, " .").replace(/\#/g, " #").replace(/\[/g, " [").replace(/\>/g, " > ").replace(/\+/g, " + ").replace(/\~/g, " ~ ").replace(/\*/g, " * ").replace(/\:not\((.*?)\)/g, " ")).split(" ");
 for (let e = 0, r = t.length; e < r; e++) t[e] = t[e].split(":")[0], 0 !== t[e].length && ("." === t[e].charAt(0) ? SELECTORS.classNames.push(t[e].slice(1)) : "#" === t[e].charAt(0) ? SELECTORS.ids.push(t[e].slice(1)) : "[" === t[e].charAt(0) ? (t[e] = t[e].slice(1).split("=")[0].split("]")[0].trim(), 
 SELECTORS.attrs.push(t[e].toLowerCase())) : /[a-z]/g.test(t[e].charAt(0)) && SELECTORS.tags.push(t[e].toLowerCase()));
 return SELECTORS.classNames = SELECTORS.classNames.sort(((e, t) => e.length < t.length ? -1 : e.length > t.length ? 1 : 0)), 
 SELECTORS;
}, SELECTORS = {
 all: [],
 tags: [],
 classNames: [],
 ids: [],
 attrs: []
}, serializeCssVisitNode = (e, t, r, s) => {
 const n = t.type;
 return 4 === n ? serializeCssDeclaration(t, r, s) : 13 === n ? serializeCssRule(e, t) : 1 === n ? "!" === t.comment[0] ? `/*${t.comment}*/` : "" : 10 === n ? serializeCssMedia(e, t) : 8 === n ? serializeCssKeyframes(e, t) : 9 === n ? serializeCssKeyframe(e, t) : 5 === n ? serializeCssFontFace(e, t) : 15 === n ? serializeCssSupports(e, t) : 7 === n ? "@import " + t.import + ";" : 0 === n ? "@charset " + t.charset + ";" : 12 === n ? serializeCssPage(e, t) : 6 === n ? "@host{" + serializeCssMapVisit(e, t.rules) + "}" : 2 === n ? "@custom-media " + t.name + " " + t.media + ";" : 3 === n ? serializeCssDocument(e, t) : 11 === n ? "@namespace " + t.namespace + ";" : "";
}, serializeCssRule = (e, t) => {
 const r = t.declarations, s = e.usedSelectors, n = t.selectors.slice();
 if (null == r || 0 === r.length) return "";
 if (s) {
  let t, r, o = !0;
  for (t = n.length - 1; t >= 0; t--) {
   const i = getCssSelectors(n[t]);
   o = !0;
   let a = i.classNames.length;
   if (a > 0 && e.hasUsedClassNames) for (r = 0; r < a; r++) if (!s.classNames.has(i.classNames[r])) {
    o = !1;
    break;
   }
   if (o && e.hasUsedTags && (a = i.tags.length, a > 0)) for (r = 0; r < a; r++) if (!s.tags.has(i.tags[r])) {
    o = !1;
    break;
   }
   if (o && e.hasUsedAttrs && (a = i.attrs.length, a > 0)) for (r = 0; r < a; r++) if (!s.attrs.has(i.attrs[r])) {
    o = !1;
    break;
   }
   if (o && e.hasUsedIds && (a = i.ids.length, a > 0)) for (r = 0; r < a; r++) if (!s.ids.has(i.ids[r])) {
    o = !1;
    break;
   }
   o || n.splice(t, 1);
  }
 }
 if (0 === n.length) return "";
 const o = [];
 let i = "";
 for (const e of t.selectors) i = removeSelectorWhitespace(e), o.includes(i) || o.push(i);
 return `${o}{${serializeCssMapVisit(e, r)}}`;
}, serializeCssDeclaration = (e, t, r) => "" === e.value ? "" : r - 1 === t ? e.property + ":" + e.value : e.property + ":" + e.value + ";", serializeCssMedia = (e, t) => {
 const r = serializeCssMapVisit(e, t.rules);
 return "" === r ? "" : "@media " + removeMediaWhitespace(t.media) + "{" + r + "}";
}, serializeCssKeyframes = (e, t) => {
 const r = serializeCssMapVisit(e, t.keyframes);
 return "" === r ? "" : "@" + (t.vendor || "") + "keyframes " + t.name + "{" + r + "}";
}, serializeCssKeyframe = (e, t) => t.values.join(",") + "{" + serializeCssMapVisit(e, t.declarations) + "}", serializeCssFontFace = (e, t) => {
 const r = serializeCssMapVisit(e, t.declarations);
 return "" === r ? "" : "@font-face{" + r + "}";
}, serializeCssSupports = (e, t) => {
 const r = serializeCssMapVisit(e, t.rules);
 return "" === r ? "" : "@supports " + t.supports + "{" + r + "}";
}, serializeCssPage = (e, t) => "@page " + t.selectors.join(", ") + "{" + serializeCssMapVisit(e, t.declarations) + "}", serializeCssDocument = (e, t) => {
 const r = serializeCssMapVisit(e, t.rules), s = "@" + (t.vendor || "") + "document " + t.document;
 return "" === r ? "" : s + "{" + r + "}";
}, serializeCssMapVisit = (e, t) => {
 let r = "";
 if (t) for (let s = 0, n = t.length; s < n; s++) r += serializeCssVisitNode(e, t[s], s, n);
 return r;
}, removeSelectorWhitespace = e => {
 let t = "", r = "", s = !1;
 for (let n = 0, o = (e = e.trim()).length; n < o; n++) if (r = e[n], "[" === r && "\\" !== t[t.length - 1] ? s = !0 : "]" === r && "\\" !== t[t.length - 1] && (s = !1), 
 !s && CSS_WS_REG.test(r)) {
  if (CSS_NEXT_CHAR_REG.test(e[n + 1])) continue;
  if (CSS_PREV_CHAR_REG.test(t[t.length - 1])) continue;
  t += " ";
 } else t += r;
 return t;
}, removeMediaWhitespace = e => {
 let t = "", r = "";
 for (let s = 0, n = (e = e.trim()).length; s < n; s++) if (r = e[s], CSS_WS_REG.test(r)) {
  if (CSS_WS_REG.test(t[t.length - 1])) continue;
  t += " ";
 } else t += r;
 return t;
}, CSS_WS_REG = /\s/, CSS_NEXT_CHAR_REG = /[>\(\)\~\,\+\s]/, CSS_PREV_CHAR_REG = /[>\(\~\,\+]/, collectUsedSelectors = (e, t) => {
 if (null != t && 1 === t.nodeType) {
  const r = t.children, s = t.nodeName.toLowerCase();
  e.tags.add(s);
  const n = t.attributes;
  for (let r = 0, s = n.length; r < s; r++) {
   const s = n.item(r), o = s.name.toLowerCase();
   if (e.attrs.add(o), "class" === o) {
    const r = t.classList;
    for (let t = 0, s = r.length; t < s; t++) e.classNames.add(r.item(t));
   } else "id" === o && e.ids.add(s.value);
  }
  if (r) for (let t = 0, s = r.length; t < s; t++) collectUsedSelectors(e, r[t]);
 }
}, removeUnusedStyles = (e, t) => {
 try {
  const r = e.head.querySelectorAll("style[data-styles]"), s = r.length;
  if (s > 0) {
   const n = (e => {
    const t = {
     attrs: new Set,
     classNames: new Set,
     ids: new Set,
     tags: new Set
    };
    return collectUsedSelectors(t, e), t;
   })(e.documentElement);
   for (let e = 0; e < s; e++) removeUnusedStyleText(n, t, r[e]);
  }
 } catch (e) {
  ((e, t, r) => {
   const s = {
    level: "error",
    type: "build",
    header: "Build Error",
    messageText: "build error",
    relFilePath: null,
    absFilePath: null,
    lines: []
   };
   null != t && (null != t.stack ? s.messageText = t.stack.toString() : null != t.message ? s.messageText = t.message.length ? t.message : "UNKNOWN ERROR" : s.messageText = t.toString()), 
   null == e || (e => e === TASK_CANCELED_MSG)(s.messageText) || e.push(s);
  })(t, e);
 }
}, removeUnusedStyleText = (e, t, r) => {
 try {
  const s = parseCss(r.innerHTML);
  if (t.push(...s.diagnostics), hasError(t)) return;
  try {
   r.innerHTML = ((e, t) => {
    const r = t.usedSelectors || null, s = {
     usedSelectors: r || null,
     hasUsedAttrs: !!r && r.attrs.size > 0,
     hasUsedClassNames: !!r && r.classNames.size > 0,
     hasUsedIds: !!r && r.ids.size > 0,
     hasUsedTags: !!r && r.tags.size > 0
    }, n = e.rules;
    if (!n) return "";
    const o = n.length, i = [];
    for (let e = 0; e < o; e++) i.push(serializeCssVisitNode(s, n[e], e, o));
    return i.join("");
   })(s.stylesheet, {
    usedSelectors: e
   });
  } catch (e) {
   t.push({
    level: "warn",
    type: "css",
    header: "CSS Stringify",
    messageText: e,
    lines: []
   });
  }
 } catch (e) {
  t.push({
   level: "warn",
   type: "css",
   header: "CSS Parse",
   messageText: e,
   lines: []
  });
 }
}, SKIP_ATTRS = new Set([ "s-id", "c-id" ]), createHydrateBuildId = () => {
 let e = "abcdefghijklmnopqrstuvwxyz", t = "";
 for (;t.length < 8; ) t += e[Math.floor(Math.random() * e.length)], 1 === t.length && (e += "0123456789");
 return t;
};

exports.createWindowFromHtml = createWindowFromHtml;
exports.hydrateDocument = hydrateDocument;
exports.renderToString = renderToString;
exports.serializeDocumentToString = serializeDocumentToString;
