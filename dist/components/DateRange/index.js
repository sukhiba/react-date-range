function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Calendar from '../Calendar';
import { rangeShape } from '../DayCell';
import { findNextRangeIndex, generateStyles } from '../../utils';
import isBefore from "date-fns/isBefore";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";
import addDays from "date-fns/addDays";
import min from "date-fns/min";
import isWithinInterval from "date-fns/isWithinInterval";
import max from "date-fns/max";
import classnames from 'classnames';
import coreStyles from '../../styles';
class DateRange extends Component {
  constructor(props, context) {
    var _this;
    super(props, context);
    _this = this;
    _defineProperty(this, "calcNewSelection", function (value) {
      let isSingleValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      const focusedRange = _this.props.focusedRange || _this.state.focusedRange;
      const {
        ranges,
        onChange,
        maxDate,
        moveRangeOnFirstSelection,
        retainEndDateOnFirstSelection,
        disabledDates
      } = _this.props;
      const focusedRangeIndex = focusedRange[0];
      const selectedRange = ranges[focusedRangeIndex];
      if (!selectedRange || !onChange) return {};
      let {
        startDate,
        endDate
      } = selectedRange;
      const now = new Date();
      let nextFocusRange;
      if (!isSingleValue) {
        startDate = value.startDate;
        endDate = value.endDate;
      } else if (focusedRange[1] === 0) {
        // startDate selection
        const dayOffset = differenceInCalendarDays(endDate || now, startDate);
        const calculateEndDate = () => {
          if (moveRangeOnFirstSelection) {
            return addDays(value, dayOffset);
          }
          if (retainEndDateOnFirstSelection) {
            if (!endDate || isBefore(value, endDate)) {
              return endDate;
            }
            return value;
          }
          return value || now;
        };
        startDate = value;
        endDate = calculateEndDate();
        if (maxDate) endDate = min([endDate, maxDate]);
        nextFocusRange = [focusedRange[0], 1];
      } else {
        endDate = value;
      }

      // reverse dates if startDate before endDate
      let isStartDateSelected = focusedRange[1] === 0;
      if (isBefore(endDate, startDate)) {
        isStartDateSelected = !isStartDateSelected;
        [startDate, endDate] = [endDate, startDate];
      }
      const inValidDatesWithinRange = disabledDates.filter(disabledDate => isWithinInterval(disabledDate, {
        start: startDate,
        end: endDate
      }));
      if (inValidDatesWithinRange.length > 0) {
        if (isStartDateSelected) {
          startDate = addDays(max(inValidDatesWithinRange), 1);
        } else {
          endDate = addDays(min(inValidDatesWithinRange), -1);
        }
      }
      if (!nextFocusRange) {
        const nextFocusRangeIndex = findNextRangeIndex(_this.props.ranges, focusedRange[0]);
        nextFocusRange = [nextFocusRangeIndex, 0];
      }
      return {
        wasValid: !(inValidDatesWithinRange.length > 0),
        range: {
          startDate,
          endDate
        },
        nextFocusRange: nextFocusRange
      };
    });
    _defineProperty(this, "setSelection", (value, isSingleValue) => {
      const {
        onChange,
        ranges,
        onRangeFocusChange
      } = this.props;
      const focusedRange = this.props.focusedRange || this.state.focusedRange;
      const focusedRangeIndex = focusedRange[0];
      const selectedRange = ranges[focusedRangeIndex];
      if (!selectedRange) return;
      const newSelection = this.calcNewSelection(value, isSingleValue);
      onChange({
        [selectedRange.key || `range${focusedRangeIndex + 1}`]: {
          ...selectedRange,
          ...newSelection.range
        }
      });
      this.setState({
        focusedRange: newSelection.nextFocusRange,
        preview: null
      });
      onRangeFocusChange && onRangeFocusChange(newSelection.nextFocusRange);
    });
    _defineProperty(this, "handleRangeFocusChange", focusedRange => {
      this.setState({
        focusedRange
      });
      this.props.onRangeFocusChange && this.props.onRangeFocusChange(focusedRange);
    });
    _defineProperty(this, "updatePreview", val => {
      if (!val) {
        this.setState({
          preview: null
        });
        return;
      }
      const {
        rangeColors,
        ranges
      } = this.props;
      const focusedRange = this.props.focusedRange || this.state.focusedRange;
      const color = ranges[focusedRange[0]]?.color || rangeColors[focusedRange[0]] || color;
      this.setState({
        preview: {
          ...val.range,
          color
        }
      });
    });
    this.state = {
      focusedRange: props.initialFocusedRange || [findNextRangeIndex(props.ranges), 0],
      preview: null
    };
    this.styles = generateStyles([coreStyles, props.classNames]);
  }
  render() {
    return /*#__PURE__*/React.createElement(Calendar, _extends({
      focusedRange: this.state.focusedRange,
      onRangeFocusChange: this.handleRangeFocusChange,
      preview: this.state.preview,
      onPreviewChange: value => {
        this.updatePreview(value ? this.calcNewSelection(value) : null);
      }
    }, this.props, {
      displayMode: "dateRange",
      className: classnames(this.styles.dateRangeWrapper, this.props.className),
      onChange: this.setSelection,
      updateRange: val => this.setSelection(val, false),
      ref: target => {
        this.calendar = target;
      }
    }));
  }
}
DateRange.defaultProps = {
  classNames: {},
  ranges: [],
  moveRangeOnFirstSelection: false,
  retainEndDateOnFirstSelection: false,
  rangeColors: ['#3d91ff', '#3ecf8e', '#fed14c'],
  disabledDates: []
};
DateRange.propTypes = {
  ...Calendar.propTypes,
  onChange: PropTypes.func,
  onRangeFocusChange: PropTypes.func,
  className: PropTypes.string,
  ranges: PropTypes.arrayOf(rangeShape),
  moveRangeOnFirstSelection: PropTypes.bool,
  retainEndDateOnFirstSelection: PropTypes.bool
};
export default DateRange;