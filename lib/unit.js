'use strict';

var _ = require('lodash');

var errors = require('./errors');
var $ = require('./util/preconditions');

var UNITS = {
  'BLK'      : [1e8, 8],
  'mBLK'     : [1e5, 5],
  'uBLK'     : [1e2, 2],
  'ratoshis' : [1, 0]
};

/**
 * Utility for handling and converting bitcoins units. The supported units are
 * BLK, mBLK, uBLK  and ratoshis. A unit instance can be created with an
 * amount and a unit code, or alternatively using static methods like {fromBLK}.
 * It also allows to be created from a fiat amount and the exchange rate, or
 * alternatively using the {fromFiat} static method.
 * You can consult for different representation of a unit instance using it's
 * {to} method, the fixed unit methods like {toRatoshis} or alternatively using
 * the unit accessors. It also can be converted to a fiat amount by providing the
 * corresponding BLK/fiat exchange rate.
 *
 * @example
 * ```javascript
 * var sats = Unit.fromBLK(1.3).toRatoshis();
 * var mili = Unit.fromuBLK(1.3).to(Unit.mBLK);
 * var uBLK = Unit.fromFiat(1.3, 350).uBLK;
 * var blk = new Unit(1.3, Unit.uBLK).BLK;
 * ```
 *
 * @param {Number} amount - The amount to be represented
 * @param {String|Number} code - The unit of the amount or the exchange rate
 * @returns {Unit} A new instance of an Unit
 * @constructor
 */
function Unit(amount, code) {
  if (!(this instanceof Unit)) {
    return new Unit(amount, code);
  }

  // convert fiat to BLK
  if (_.isNumber(code)) {
    if (code <= 0) {
      throw new errors.Unit.InvalidRate(code);
    }
    amount = amount / code;
    code = Unit.BLK;
  }

  this._value = this._from(amount, code);

  var self = this;
  var defineAccesor = function(key) {
    Object.defineProperty(self, key, {
      get: function() { return self.to(key); },
      enumerable: true,
    });
  };

  Object.keys(UNITS).forEach(defineAccesor);
}

Object.keys(UNITS).forEach(function(key) {
  Unit[key] = key;
});

/**
 * Returns a Unit instance created from JSON string or object
 *
 * @param {String|Object} json - JSON with keys: amount and code
 * @returns {Unit} A Unit instance
 */
Unit.fromObject = function fromObject(data){
  $.checkArgument(_.isObject(data), 'Argument is expected to be an object');
  return new Unit(data.amount, data.code);
};

/**
 * Returns a Unit instance created from an amount in BLK
 *
 * @param {Number} amount - The amount in BLK
 * @returns {Unit} A Unit instance
 */
Unit.fromBLK = function(amount) {
  return new Unit(amount, Unit.BLK);
};

/**
 * Returns a Unit instance created from an amount in mBLK
 *
 * @param {Number} amount - The amount in mBLK
 * @returns {Unit} A Unit instance
 */
Unit.fromMillis = Unit.fromMilis = function(amount) {
  return new Unit(amount, Unit.mBLK);
};

/**
 * Returns a Unit instance created from an amount in uBLK
 *
 * @param {Number} amount - The amount in uBLK
 * @returns {Unit} A Unit instance
 */
Unit.fromMicros = Unit.fromBits = function(amount) {
  return new Unit(amount, Unit.uBLK);
};

/**
 * Returns a Unit instance created from an amount in ratoshis
 *
 * @param {Number} amount - The amount in ratoshis
 * @returns {Unit} A Unit instance
 */
Unit.fromRatoshis = function(amount) {
  return new Unit(amount, Unit.ratoshis);
};

/**
 * Returns a Unit instance created from a fiat amount and exchange rate.
 *
 * @param {Number} amount - The amount in fiat
 * @param {Number} rate - The exchange rate BLK/fiat
 * @returns {Unit} A Unit instance
 */
Unit.fromFiat = function(amount, rate) {
  return new Unit(amount, rate);
};

Unit.prototype._from = function(amount, code) {
  if (!UNITS[code]) {
    throw new errors.Unit.UnknownCode(code);
  }
  return parseInt((amount * UNITS[code][0]).toFixed());
};

/**
 * Returns the value represented in the specified unit
 *
 * @param {String|Number} code - The unit code or exchange rate
 * @returns {Number} The converted value
 */
Unit.prototype.to = function(code) {
  if (_.isNumber(code)) {
    if (code <= 0) {
      throw new errors.Unit.InvalidRate(code);
    }
    return parseFloat((this.BLK * code).toFixed(2));
  }

  if (!UNITS[code]) {
    throw new errors.Unit.UnknownCode(code);
  }

  var value = this._value / UNITS[code][0];
  return parseFloat(value.toFixed(UNITS[code][1]));
};

/**
 * Returns the value represented in BLK
 *
 * @returns {Number} The value converted to BLK
 */
Unit.prototype.toBLK = function() {
  return this.to(Unit.BLK);
};

/**
 * Returns the value represented in mBLK
 *
 * @returns {Number} The value converted to mBLK
 */
Unit.prototype.toMillis = Unit.prototype.toMilis = function() {
  return this.to(Unit.mBLK);
};

/**
 * Returns the value represented in uBLK
 *
 * @returns {Number} The value converted to uBLK
 */
Unit.prototype.toMicros = function() {
  return this.to(Unit.uBLK);
};

/**
 * Returns the value represented in ratoshis
 *
 * @returns {Number} The value converted to ratoshis
 */
Unit.prototype.toRatoshis = function() {
  return this.to(Unit.ratoshis);
};

/**
 * Returns the value represented in fiat
 *
 * @param {string} rate - The exchange rate between BLK/currency
 * @returns {Number} The value converted to ratoshis
 */
Unit.prototype.atRate = function(rate) {
  return this.to(rate);
};

/**
 * Returns a the string representation of the value in ratoshis
 *
 * @returns {string} the value in ratoshis
 */
Unit.prototype.toString = function() {
  return this.ratoshis + ' ratoshis';
};

/**
 * Returns a plain object representation of the Unit
 *
 * @returns {Object} An object with the keys: amount and code
 */
Unit.prototype.toObject = Unit.prototype.toJSON = function toObject() {
  return {
    amount: this.BLK,
    code: Unit.BLK
  };
};

/**
 * Returns a string formatted for the console
 *
 * @returns {string} the value in ratoshis
 */
Unit.prototype.inspect = function() {
  return '<Unit: ' + this.toString() + '>';
};

module.exports = Unit;
