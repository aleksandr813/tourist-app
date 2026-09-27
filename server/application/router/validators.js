const isString = (value) => typeof value === 'string' && value.trim() !== '';

const isOptionalString = (value) => value == null || typeof value === 'string';

const isNumber = (value) => typeof value === 'number' && Number.isFinite(value);

const isId = (value) => isString(value) || isNumber(value);

module.exports = {
    isString,
    isOptionalString,
    isNumber,
    isId,
};
