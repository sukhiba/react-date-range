function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DateRange from '../DateRange';
import DefinedRange from '../DefinedRange';
import { findNextRangeIndex, generateStyles } from '../../utils';
import classnames from 'classnames';
import coreStyles from '../../styles';
class DateRangePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focusedRange: [findNextRangeIndex(props.ranges), 0]
    };
    this.styles = generateStyles([coreStyles, props.classNames]);
  }
  render() {
    const {
      focusedRange
    } = this.state;
    return /*#__PURE__*/React.createElement("div", {
      className: classnames(this.styles.dateRangePickerWrapper, this.props.className)
    }, /*#__PURE__*/React.createElement(DefinedRange, _extends({
      focusedRange: focusedRange,
      onPreviewChange: value => this.dateRange.updatePreview(value ? this.dateRange.calcNewSelection(value, typeof value === 'string') : null)
    }, this.props, {
      range: this.props.ranges[focusedRange[0]],
      className: undefined
    })), /*#__PURE__*/React.createElement(DateRange, _extends({
      onRangeFocusChange: focusedRange => this.setState({
        focusedRange
      }),
      focusedRange: focusedRange
    }, this.props, {
      ref: t => this.dateRange = t,
      className: undefined
    })));
  }
}
DateRangePicker.defaultProps = {};
DateRangePicker.propTypes = {
  ...DateRange.propTypes,
  ...DefinedRange.propTypes,
  className: PropTypes.string
};
export default DateRangePicker;