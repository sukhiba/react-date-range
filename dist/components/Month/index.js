function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
/* eslint-disable no-fallthrough */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import DayCell, { rangeShape } from '../DayCell';
import format from "date-fns/format";
import startOfDay from "date-fns/startOfDay";
import endOfDay from "date-fns/endOfDay";
import startOfWeek from "date-fns/startOfWeek";
import endOfWeek from "date-fns/endOfWeek";
import isBefore from "date-fns/isBefore";
import isSameDay from "date-fns/isSameDay";
import isAfter from "date-fns/isAfter";
import isWeekend from "date-fns/isWeekend";
import isWithinInterval from "date-fns/isWithinInterval";
import eachDayOfInterval from "date-fns/eachDayOfInterval";
import { getMonthDisplayRange } from '../../utils';
function renderWeekdays(styles, dateOptions, weekdayDisplayFormat) {
  const now = new Date();
  return /*#__PURE__*/React.createElement("div", {
    className: styles.weekDays
  }, eachDayOfInterval({
    start: startOfWeek(now, dateOptions),
    end: endOfWeek(now, dateOptions)
  }).map((day, i) => /*#__PURE__*/React.createElement("span", {
    className: styles.weekDay,
    key: i
  }, format(day, weekdayDisplayFormat, dateOptions))));
}
class Month extends PureComponent {
  render() {
    const now = new Date();
    const {
      displayMode,
      focusedRange,
      drag,
      styles,
      disabledDates,
      disabledDay
    } = this.props;
    const minDate = this.props.minDate && startOfDay(this.props.minDate);
    const maxDate = this.props.maxDate && endOfDay(this.props.maxDate);
    const monthDisplay = getMonthDisplayRange(this.props.month, this.props.dateOptions, this.props.fixedHeight);
    let ranges = this.props.ranges;
    if (displayMode === 'dateRange' && drag.status) {
      let {
        startDate,
        endDate
      } = drag.range;
      ranges = ranges.map((range, i) => {
        if (i !== focusedRange[0]) return range;
        return {
          ...range,
          startDate,
          endDate
        };
      });
    }
    const showPreview = this.props.showPreview && !drag.disablePreview;
    return /*#__PURE__*/React.createElement("div", {
      className: styles.month,
      style: this.props.style
    }, this.props.showMonthName ? /*#__PURE__*/React.createElement("div", {
      className: styles.monthName
    }, format(this.props.month, this.props.monthDisplayFormat, this.props.dateOptions)) : null, this.props.showWeekDays && renderWeekdays(styles, this.props.dateOptions, this.props.weekdayDisplayFormat), /*#__PURE__*/React.createElement("div", {
      className: styles.days,
      onMouseLeave: this.props.onMouseLeave
    }, eachDayOfInterval({
      start: monthDisplay.start,
      end: monthDisplay.end
    }).map((day, index) => {
      const isStartOfMonth = isSameDay(day, monthDisplay.startDateOfMonth);
      const isEndOfMonth = isSameDay(day, monthDisplay.endDateOfMonth);
      const isOutsideMinMax = minDate && isBefore(day, minDate) || maxDate && isAfter(day, maxDate);
      const isDisabledSpecifically = disabledDates.some(disabledDate => isSameDay(disabledDate, day));
      const isDisabledDay = disabledDay(day);
      return /*#__PURE__*/React.createElement(DayCell, _extends({}, this.props, {
        ranges: ranges,
        day: day,
        preview: showPreview ? this.props.preview : null,
        isWeekend: isWeekend(day, this.props.dateOptions),
        isToday: isSameDay(day, now),
        isStartOfWeek: isSameDay(day, startOfWeek(day, this.props.dateOptions)),
        isEndOfWeek: isSameDay(day, endOfWeek(day, this.props.dateOptions)),
        isStartOfMonth: isStartOfMonth,
        isEndOfMonth: isEndOfMonth,
        key: index,
        disabled: isOutsideMinMax || isDisabledSpecifically || isDisabledDay,
        isPassive: !isWithinInterval(day, {
          start: monthDisplay.startDateOfMonth,
          end: monthDisplay.endDateOfMonth
        }),
        styles: styles,
        onMouseDown: this.props.onDragSelectionStart,
        onMouseUp: this.props.onDragSelectionEnd,
        onMouseEnter: this.props.onDragSelectionMove,
        dragRange: drag.range,
        drag: drag.status
      }));
    })));
  }
}
Month.defaultProps = {};
Month.propTypes = {
  style: PropTypes.object,
  styles: PropTypes.object,
  month: PropTypes.object,
  drag: PropTypes.object,
  dateOptions: PropTypes.object,
  disabledDates: PropTypes.array,
  disabledDay: PropTypes.func,
  preview: PropTypes.shape({
    startDate: PropTypes.object,
    endDate: PropTypes.object
  }),
  showPreview: PropTypes.bool,
  displayMode: PropTypes.oneOf(['dateRange', 'date']),
  minDate: PropTypes.object,
  maxDate: PropTypes.object,
  ranges: PropTypes.arrayOf(rangeShape),
  focusedRange: PropTypes.arrayOf(PropTypes.number),
  onDragSelectionStart: PropTypes.func,
  onDragSelectionEnd: PropTypes.func,
  onDragSelectionMove: PropTypes.func,
  onMouseLeave: PropTypes.func,
  monthDisplayFormat: PropTypes.string,
  weekdayDisplayFormat: PropTypes.string,
  dayDisplayFormat: PropTypes.string,
  showWeekDays: PropTypes.bool,
  showMonthName: PropTypes.bool,
  fixedHeight: PropTypes.bool
};
export default Month;