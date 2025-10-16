function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import format from "date-fns/format";
import parse from "date-fns/parse";
import isValid from "date-fns/isValid";
import isEqual from "date-fns/isEqual";
class DateInput extends PureComponent {
  constructor(props, context) {
    super(props, context);
    _defineProperty(this, "onKeyDown", e => {
      const {
        value
      } = this.state;
      if (e.key === 'Enter') {
        this.update(value);
      }
    });
    _defineProperty(this, "onChange", e => {
      this.setState({
        value: e.target.value,
        changed: true,
        invalid: false
      });
    });
    _defineProperty(this, "onBlur", () => {
      const {
        value
      } = this.state;
      this.update(value);
    });
    this.state = {
      invalid: false,
      changed: false,
      value: this.formatDate(props)
    };
  }
  componentDidUpdate(prevProps) {
    const {
      value
    } = prevProps;
    if (!isEqual(value, this.props.value)) {
      this.setState({
        value: this.formatDate(this.props)
      });
    }
  }
  formatDate(_ref) {
    let {
      value,
      dateDisplayFormat,
      dateOptions
    } = _ref;
    if (value && isValid(value)) {
      return format(value, dateDisplayFormat, dateOptions);
    }
    return '';
  }
  update(value) {
    const {
      invalid,
      changed
    } = this.state;
    if (invalid || !changed || !value) {
      return;
    }
    const {
      onChange,
      dateDisplayFormat,
      dateOptions
    } = this.props;
    const parsed = parse(value, dateDisplayFormat, new Date(), dateOptions);
    if (isValid(parsed)) {
      this.setState({
        changed: false
      }, () => onChange(parsed));
    } else {
      this.setState({
        invalid: true
      });
    }
  }
  render() {
    const {
      className,
      readOnly,
      placeholder,
      ariaLabel,
      disabled,
      onFocus
    } = this.props;
    const {
      value,
      invalid
    } = this.state;
    return /*#__PURE__*/React.createElement("span", {
      className: classnames('rdrDateInput', className)
    }, /*#__PURE__*/React.createElement("input", {
      readOnly: readOnly,
      disabled: disabled,
      value: value,
      placeholder: placeholder,
      "aria-label": ariaLabel,
      onKeyDown: this.onKeyDown,
      onChange: this.onChange,
      onBlur: this.onBlur,
      onFocus: onFocus
    }), invalid && /*#__PURE__*/React.createElement("span", {
      className: "rdrWarning"
    }, "\u26A0"));
  }
}
DateInput.propTypes = {
  value: PropTypes.object,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  dateOptions: PropTypes.object,
  dateDisplayFormat: PropTypes.string,
  ariaLabel: PropTypes.string,
  className: PropTypes.string,
  onFocus: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
};
DateInput.defaultProps = {
  readOnly: true,
  disabled: false,
  dateDisplayFormat: 'MMM D, YYYY'
};
export default DateInput;