function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }

window.modules.Utils = (() => {
  const {
    floor,
    random
  } = Math;

  const randomFrom = array => array[floor(random() * array.length)];

  const getNumbers = n => _toConsumableArray(Array(n).keys());

  const wait = duration => new Promise(resolve => {
    setTimeout(resolve, duration);
  });

  const query = (selector, parent = document) => parent.querySelector(selector);

  const queryAll = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));

  const queryId = document.getElementById.bind(document);
  const keyCodes = {
    27: 'escape'
  };

  const getKeyCode = event => keyCodes[event.which] || keyCodes[event.keyCode];

  return {
    randomFrom,
    getNumbers,
    wait,
    query,
    queryAll,
    queryId,
    keyCodes,
    getKeyCode
  };
})(window.modules);