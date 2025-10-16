function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import React, { Component } from 'react';
import PropTypes from 'prop-types';
const MIN = 0;
const MAX = 99999;
class InputRangeField extends Component {
  constructor(props, context) {
    super(props, context);
    _defineProperty(this, "onChange", e => {
      const {
        onChange
      } = this.props;
      let value = parseInt(e.target.value, 10);
      value = isNaN(value) ? 0 : Math.max(Math.min(MAX, value), MIN);
      onChange(value);
    });
  }
  shouldComponentUpdate(nextProps) {
    const {
      value,
      label,
      placeholder
    } = this.props;
    return value !== nextProps.value || label !== nextProps.label || placeholder !== nextProps.placeholder;
  }
  render() {
    const {
      label,
      placeholder,
      value,
      styles,
      onBlur,
      onFocus
    } = this.props;
    return /*#__PURE__*/React.createElement("div", {
      className: styles.inputRange
    }, /*#__PURE__*/React.createElement("input", {
      className: styles.inputRangeInput,
      placeholder: placeholder,
      value: value,
      min: MIN,
      max: MAX,
      onChange: this.onChange,
      onFocus: onFocus,
      onBlur: onBlur
    }), /*#__PURE__*/React.createElement("span", {
      className: styles.inputRangeLabel
    }, label));
  }
}
InputRangeField.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  label: PropTypes.oneOfType([PropTypes.element, PropTypes.node]).isRequired,
  placeholder: PropTypes.string,
  styles: PropTypes.shape({
    inputRange: PropTypes.string,
    inputRangeInput: PropTypes.string,
    inputRangeLabel: PropTypes.string
  }).isRequired,
  onBlur: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
};
InputRangeField.defaultProps = {
  value: '',
  placeholder: '-'
};
export default InputRangeField;