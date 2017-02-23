var util = require('util');

module.exports = {
 'array': function(value) {
  return new ArrayObj(value);
 },
 'bool': function(value) {
  return new BooleanObj(value);
 },
 'decimal': function(value) {
  return new DecimalObj(value);
 },
 'date': function(value) {
  return new DateObj(value);
 },
 'err': function(value) {
  return new ErrorObj(value);
 },
 'fn': function(value) {
  return new FunctionObj(value);
 },
 'integer': function(value) {
  return new IntegerObj(value);
 },
 'obj': function(value) {
  return new ObjectObj(value);
 },
 'regex': function(value) {
  return new RegexpObj(value);
 },
 'string': function(value) {
  return new StringObj(value);
 }
};

/***************************************************
 * Utilities
 ***************************************************/

/**
 * is Functions
 */
function isArray(value) {
 return isTypeOf(value, 'Array');
}

function isBoolean(value) {
 return isTypeOf(value, 'Boolean');
}

function isDate(value) {
 return isTypeOf(value, 'Date');
}

function isError(value) {
 return isTypeOf(value, 'Error');
}

function isFunction(value) {
 return isTypeOf(value, 'Function');
}

function isNumeric(value) {
 return (isTypeOf(value, 'Number') === true ? !isNaN(parseFloat(value)) && isFinite(value) : false);
}

function isDecimal(value) {
 return (isNumeric(value) && (parseFloat(value) == Number(value)) && !isNaN(value));
}

function isInteger(value) {
 return (isNumeric(value) && (parseFloat(value) == parseInt(value, 10)) && !isNaN(value));
}

function isObject(value) {
 return isTypeOf(value, 'Object');
}

function isRegexp(value) {
 return (isObject(value) === true && isInstance(value, 'RegExp') === true);
}

function isString(value) {
 return isTypeOf(value, 'String');
}

function isTypeOf(value, type) {
 return (Object.prototype.toString.call(value) === '[object ' + type + ']');
}

function isDefined(value) {
 return (typeof value !== 'undefined');
}

function isInstance(value, name) {
 return (isObject(value) === true && value.constructor.name === name);
}

/**
 * JSON.parse
 */
function parse(value) {
 try {
  return which(JSON.parse(value));
 } catch(err) {
  return new DummyObj();
 }
}

/**
 * JSON.stringify
 */
function stringify(value) {
 try {
  return which(JSON.stringify(value));
 } catch(err) {
  return new DummyObj();
 }
}

/**
 * Returns the type object relevant to the value
 */
function which(value) {
 var resultObj;
 switch(true) {
  case isArray(value):
   resultObj = new ArrayObj(value);
   break;
  case isBoolean(value):
   resultObj = new BooleanObj(value);
   break;
  case isDecimal(value):
   resultObj = new DecimalObj(value);
   break;
  case isDate(value):
   resultObj = new DateObj(value);
   break;
  case isError(value):
   resultObj = new ErrorObj(value);
   break;
  case isFunction(value):
   resultObj = new FunctionObj(value);
   break;
  case isInteger(value):
   resultObj = new IntegerObj(value);
   break;
  case isObject(value):
   resultObj = new ObjectObj(value);
   break;
  case isRegexp(value):
   resultObj = new RegexpObj(value);
   break;
  case isString(value):
   resultObj = new StringObj(value);
   break;
  default:
   resultObj = new DummyObj();
   break;
 }
 return resultObj;
}

/**
 * Base Object
 */
function BaseObj(value) {
 var _value = value;
 Object.defineProperty(this, 'valid', {
  get: function() {
   return this.isValid();
  }
 });
 Object.defineProperty(this, '_value', {
  get: function() {
   return _value;
  }
 });
}

BaseObj.prototype.isValid = function() {
 return isDefined(this._value);
};

/**
 * Types
 */

/**
 * Base object for Types
 */
function TypeObj(value) {
 BaseObj.call(this, value);
}

util.inherits(TypeObj, BaseObj);

TypeObj.prototype.value = function() {
 return this._value;
};

TypeObj.prototype.equal = function(value) {
 return new EqualObj(this, value);
};

TypeObj.prototype.strictly = function(value) {
 return new StrictlyObj(this, value);
};

TypeObj.prototype.OfType = function(value) { 
 return isInstance(this, value.toLowerCase() + 'Obj');
};

/**
 * Array
 */
function ArrayObj(value) {
 TypeObj.call(this, value);
 Object.defineProperty(this, 'stringify', {
  get: function() {
   return stringify(this._value);
  }
 });
}

util.inherits(ArrayObj, TypeObj);

ArrayObj.prototype.isValid = function() {
 return isArray(this._value);
};

ArrayObj.prototype.element = function(value) {
 return which(this._value[value]);
};

ArrayObj.prototype.minLen = function(value) {
 return new MinLenObj(this, value);
};

ArrayObj.prototype.maxLen = function(value) {
 return new MaxLenObj(this, value);
};

ArrayObj.prototype.fullLen = function(value) {
 return new FullLenObj(this, value);
};

/**
 * Number
 */
function NumberObj(value) {
 TypeObj.call(this, value);
}

util.inherits(NumberObj, TypeObj);

NumberObj.prototype.isValid = function() {
 return isNumeric(this._linkTo._value);
};

NumberObj.prototype.minValue = function(value) {
 return new MinValueObj(this, value);
};

NumberObj.prototype.maxValue = function(value) {
 return new MaxValueObj(this, value);
};

/**
 * Decimal
 */
function DecimalObj(value) {
 NumberObj.call(this, value);
}

util.inherits(DecimalObj, NumberObj);

DecimalObj.prototype.isValid = function() {
 return isDecimal(this._linkTo._value);
};

DecimalObj.prototype.minPoints = function(value) {
 return new MinPointsObj(this, value);
};

DecimalObj.prototype.maxPoints = function(value) {
 return new MaxPointsObj(this, value);
};

DecimalObj.prototype.fullPoints = function(value) {
 return new FullPointsObj(this, value);
};

/**
 * Integer
 */
function IntegerObj(value) {
 NumberObj.call(this, value);
}

util.inherits(IntegerObj, NumberObj);

IntegerObj.prototype.isValid = function() {
 return isInteger(this._linkTo._value);
};

/**
 * Boolean
 */
function BooleanObj(value) {
 TypeObj.call(this, value);
}

util.inherits(BooleanObj, TypeObj);

BooleanObj.prototype.isValid = function() {
 return isBoolean(this._value);
};

/**
 * Date
 */
function DateObj(value) {
 TypeObj.call(this, value);
}

util.inherits(DateObj, TypeObj);

DateObj.prototype.isValid = function() {
 return isDate(this._value);
};

DateObj.prototype.minValue = function(value) {
 return new MinValueObj(this, value);
};

DateObj.prototype.maxValue = function(value) {
 return new MaxValueObj(this, value);
};

/**
 * Error
 */
function ErrorObj(value) {
 TypeObj.call(this, value);
}

util.inherits(ErrorObj, TypeObj);

ErrorObj.prototype.isValid = function() {
 return isError(this._value);
};

/**
 * Object
 */
function ObjectObj(value) {
 TypeObj.call(this, value);
 Object.defineProperty(this, 'stringify', {
  get: function() {
   return stringify(this._value);
  }
 });
}

util.inherits(ObjectObj, TypeObj);

ObjectObj.prototype.isValid = function() {
 return isObject(this._value);
};

ObjectObj.prototype.property = function(value) {
 return which(this._value[value]);
};

ObjectObj.prototype.minLen = function(value) {
 return new MinLenObj(this, value);
};

ObjectObj.prototype.maxLen = function(value) {
 return new MaxLenObj(this, value);
};

/**
 * Regexp
 */
function RegexpObj(value) {
 TypeObj.call(this, value);
}

util.inherits(RegexpObj, TypeObj);

RegexpObj.prototype.isValid = function() {
 return isRegexp(this._value);
};

/**
 * String
 */
function StringObj(value) {
 TypeObj.call(this, value);
 Object.defineProperty(this, 'parse', {
  get: function() {
   return parse(this._value);
  }
 });
}

util.inherits(StringObj, TypeObj);

StringObj.prototype.isValid = function() {
 return isString(this._value);
};

StringObj.prototype.regex = function(value) {
 return new RegexObj(this, value);
};

StringObj.prototype.minLen = function(value) {
 return new MinLenObj(this, value);
};

StringObj.prototype.maxLen = function(value) {
 return new MaxLenObj(this, value);
};

StringObj.prototype.fullLen = function(value) {
 return new FullLenObj(this, value);
};

StringObj.prototype.minValue = function(value) {
 return new MinValueObj(this, value);
};

StringObj.prototype.maxValue = function(value) {
 return new MaxValueObj(this, value);
};

/**
 * Function
 */
function FunctionObj(value) {
 TypeObj.call(this, value);
}

util.inherits(FunctionObj, TypeObj);

FunctionObj.prototype.isValid = function() {
 return false;
};

/**
 * Dummy
 */
function DummyObj(value){ 
 TypeObj.call(this, value);
}

util.inherits(DummyObj, TypeObj);

DummyObj.prototype.isValid = function(){
 return false;
};

/**
 * Links
 */
 
/**
 * Base object for Links
 */
function LinkObj(linkTo, value) {
 BaseObj.call(this, value);
 var _linkTo = linkTo;
 Object.defineProperty(this, '_linkTo', {
  configurable: false,
  enumerable: false,
  get: function()  {
   return _linkTo;
  }
 });
 var key;
 var self = this;
 for(key in _linkTo) {
  if(typeof self[key] === 'undefined') {
   if(isFunction(_linkTo[key]) === true) {
    _linkedFn(self, key);
   } else {
    _linkedProp(self, key);
   }
  }
 }
}

/**
 * Enables link chaining of functions
 */
function _linkedFn(self, key) {
 return self[key] = function() {
  var resultObj;
  resultObj = self._linkTo[key].apply(self._linkTo, arguments);
  var resultObj_isValid = resultObj.isValid;
  resultObj.isValid = function() {
   return (self._linkTo.valid === true ? (self.valid === true ? resultObj_isValid.call(resultObj) : false) : false);
  };
  return resultObj;
 };
}

/**
 * Enables link chaining of properties
 */
function _linkedProp(self, key) {
 return Object.defineProperty(self, key, {
  get: function()  {
   return self._linkTo[key];
  }
 });    
}

util.inherits(LinkObj, BaseObj);

/**
 * Equal
 */
function EqualObj(linkTo, value) {
 LinkObj.call(this, linkTo, value);
}

util.inherits(EqualObj, LinkObj);

EqualObj.prototype.isValid = function() {
 return (this._linkTo._value == this._value);
};

/**
 * Length
 */
function FullLenObj(linkTo, value) {
 LinkObj.call(this, linkTo, value);
}

util.inherits(FullLenObj, LinkObj);

FullLenObj.prototype.isValid = function() {
 return (this._linkTo._value.length === this._value);
};

/**
 * Maximum Length
 */
function MaxLenObj(linkTo, value) {
 LinkObj.call(this, linkTo, value);
}

util.inherits(MaxLenObj, LinkObj);

MaxLenObj.prototype.isValid = function() {
 if(isObject(this._linkTo._value) === true) {
  return (Object.keys(this._linkTo._value).length <= this._value);
 }
 return (this._linkTo._value.length <= this._value);
};

/**
 * Minimum Length
 */
function MinLenObj(linkTo, value) {
 LinkObj.call(this, linkTo, value);
}

util.inherits(MinLenObj, LinkObj);

MinLenObj.prototype.isValid = function() {
 if(isObject(this._linkTo._value) === true) {
  return (Object.keys(this._linkTo._value).length >= this._value);
 }
 return (this._linkTo._value.length >= this._value);
};

/**
 * Regular Expression
 */
function RegexObj(linkTo, value) {
 value = (isString(value) === true ? new RegExp(value) : (isRegexp(value) === true ? value : null));
 if(value === null) {
  throw new Error('A Regular Expression must be supplied for Regex validation');
 }    
 LinkObj.call(this, linkTo, value);
}

util.inherits(RegexObj, LinkObj);

RegexObj.prototype.isValid = function() {
 return this._value.test(this._linkTo._value);
};

/**
 * Strictly
 */
function StrictlyObj(linkTo, value) {
 LinkObj.call(this, linkTo, value);
}

util.inherits(StrictlyObj, LinkObj);

StrictlyObj.prototype.isValid = function() {
 return (this._linkTo._value === this._value);
};

/**
 * Maximum Value
 */
function MaxValueObj(linkTo, value) {
 LinkObj.call(this, linkTo, value);
}

util.inherits(MaxValueObj, LinkObj);

MaxValueObj.prototype.isValid = function() {
 return (this._linkTo._value <= this._value);
};

/**
 * Minimum Value
 */
function MinValueObj(linkTo, value) {
 LinkObj.call(this, linkTo, value);
}

util.inherits(MinValueObj, LinkObj);

MinValueObj.prototype.isValid = function() {
 return (this._linkTo._value >= this._value);
};

/**
 * Decimal points
 */
function FullPointsObj(linkTo, value) {
 LinkObj.call(this, linkTo, value);
}

util.inherits(FullPointsObj, LinkObj);

FullPointsObj.prototype.isValid = function() {
 return (getPoints(this._linkTo._value) === this._value);
};

/**
 * Maximum Decimal Points
 */
function MaxPointsObj(linkTo, value){LinkObj.call(this, linkTo, value);}
util.inherits(MaxPointsObj, LinkObj);

MaxPointsObj.prototype.isValid = function() {
 return (getPoints(this._linkTo._value) <= this._value);
};

/**
 * Minimum Decimal Points
 */
function MinPointsObj(linkTo, value) {
 LinkObj.call(this, linkTo, value);
}

util.inherits(MinPointsObj, LinkObj);

MinPointsObj.prototype.isValid = function() {
 return (getPoints(this._linkTo._value) >= this._value);
};

function getPoints(value) {
 value = value.toString();
 var points = 0;
 var idx = value.indexOf('.');    
 if(idx !== -1) {
	 points = value.substr(idx + 1).length;
 }
 return points;
}
