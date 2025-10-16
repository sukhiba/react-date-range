function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/* eslint-disable no-fallthrough */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import startOfDay from "date-fns/startOfDay";
import format from "date-fns/format";
import isSameDay from "date-fns/isSameDay";
import isAfter from "date-fns/isAfter";
import isBefore from "date-fns/isBefore";
import endOfDay from "date-fns/endOfDay";
class DayCell extends Component {
  constructor(props, context) {
    super(props, context);
    _defineProperty(this, "handleKeyEvent", event => {
      const {
        day,
        onMouseDown,
        onMouseUp
      } = this.props;
      if ([13 /* space */, 32 /* enter */].includes(event.keyCode)) {
        if (event.type === 'keydown') onMouseDown(day);else onMouseUp(day);
      }
    });
    _defineProperty(this, "handleMouseEvent", event => {
      const {
        day,
        disabled,
        onPreviewChange,
        onMouseEnter,
        onMouseDown,
        onMouseUp
      } = this.props;
      const stateChanges = {};
      if (disabled) {
        onPreviewChange();
        return;
      }
      switch (event.type) {
        case 'mouseenter':
          onMouseEnter(day);
          onPreviewChange(day);
          stateChanges.hover = true;
          break;
        case 'blur':
        case 'mouseleave':
          stateChanges.hover = false;
          break;
        case 'mousedown':
          stateChanges.active = true;
          onMouseDown(day);
          break;
        case 'mouseup':
          event.stopPropagation();
          stateChanges.active = false;
          onMouseUp(day);
          break;
        case 'focus':
          onPreviewChange(day);
          break;
      }
      if (Object.keys(stateChanges).length) {
        this.setState(stateChanges);
      }
    });
    _defineProperty(this, "getClassNames", () => {
      const {
        isPassive,
        isToday,
        isWeekend,
        isStartOfWeek,
        isEndOfWeek,
        isStartOfMonth,
        isEndOfMonth,
        disabled,
        styles
      } = this.props;
      return classnames(styles.day, {
        [styles.dayPassive]: isPassive,
        [styles.dayDisabled]: disabled,
        [styles.dayToday]: isToday,
        [styles.dayWeekend]: isWeekend,
        [styles.dayStartOfWeek]: isStartOfWeek,
        [styles.dayEndOfWeek]: isEndOfWeek,
        [styles.dayStartOfMonth]: isStartOfMonth,
        [styles.dayEndOfMonth]: isEndOfMonth,
        [styles.dayHovered]: this.state.hover,
        [styles.dayActive]: this.state.active
      });
    });
    _defineProperty(this, "renderPreviewPlaceholder", () => {
      const {
        preview,
        day,
        styles
      } = this.props;
      if (!preview) return null;
      const startDate = preview.startDate ? endOfDay(preview.startDate) : null;
      const endDate = preview.endDate ? startOfDay(preview.endDate) : null;
      const isInRange = (!startDate || isAfter(day, startDate)) && (!endDate || isBefore(day, endDate));
      const isStartEdge = !isInRange && isSameDay(day, startDate);
      const isEndEdge = !isInRange && isSameDay(day, endDate);
      return /*#__PURE__*/React.createElement("span", {
        className: classnames({
          [styles.dayStartPreview]: isStartEdge,
          [styles.dayInPreview]: isInRange,
          [styles.dayEndPreview]: isEndEdge
        }),
        style: {
          color: preview.color
        }
      });
    });
    _defineProperty(this, "renderSelectionPlaceholders", () => {
      const {
        styles,
        ranges,
        day
      } = this.props;
      if (this.props.displayMode === 'date') {
        let isSelected = isSameDay(this.props.day, this.props.date);
        return isSelected ? /*#__PURE__*/React.createElement("span", {
          className: styles.selected,
          style: {
            color: this.props.color
          }
        }) : null;
      }
      const inRanges = ranges.reduce((result, range) => {
        let startDate = range.startDate;
        let endDate = range.endDate;
        if (startDate && endDate && isBefore(endDate, startDate)) {
          [startDate, endDate] = [endDate, startDate];
        }
        startDate = startDate ? endOfDay(startDate) : null;
        endDate = endDate ? startOfDay(endDate) : null;
        const isInRange = (!startDate || isAfter(day, startDate)) && (!endDate || isBefore(day, endDate));
        const isStartEdge = !isInRange && isSameDay(day, startDate);
        const isEndEdge = !isInRange && isSameDay(day, endDate);
        if (isInRange || isStartEdge || isEndEdge) {
          return [...result, {
            isStartEdge,
            isEndEdge: isEndEdge,
            isInRange,
            ...range
          }];
        }
        return result;
      }, []);
      return inRanges.map((range, i) => /*#__PURE__*/React.createElement("span", {
        key: i,
        className: classnames({
          [styles.startEdge]: range.isStartEdge,
          [styles.endEdge]: range.isEndEdge,
          [styles.inRange]: range.isInRange
        }),
        style: {
          color: range.color || this.props.color
        }
      }));
    });
    this.state = {
      hover: false,
      active: false
    };
  }
  render() {
    const {
      dayContentRenderer
    } = this.props;
    return /*#__PURE__*/React.createElement("button", _extends({
      type: "button",
      onMouseEnter: this.handleMouseEvent,
      onMouseLeave: this.handleMouseEvent,
      onFocus: this.handleMouseEvent,
      onMouseDown: this.handleMouseEvent,
      onMouseUp: this.handleMouseEvent,
      onBlur: this.handleMouseEvent,
      onPauseCapture: this.handleMouseEvent,
      onKeyDown: this.handleKeyEvent,
      onKeyUp: this.handleKeyEvent,
      className: this.getClassNames(this.props.styles)
    }, this.props.disabled || this.props.isPassive ? {
      tabIndex: -1
    } : {}, {
      style: {
        color: this.props.color
      }
    }), this.renderSelectionPlaceholders(), this.renderPreviewPlaceholder(), /*#__PURE__*/React.createElement("span", {
      className: this.props.styles.dayNumber
    }, dayContentRenderer?.(this.props.day) || /*#__PURE__*/React.createElement("span", null, format(this.props.day, this.props.dayDisplayFormat))));
  }
}
DayCell.defaultProps = {};
export const rangeShape = PropTypes.shape({
  startDate: PropTypes.object,
  endDate: PropTypes.object,
  color: PropTypes.string,
  key: PropTypes.string,
  autoFocus: PropTypes.bool,
  disabled: PropTypes.bool,
  showDateDisplay: PropTypes.bool
});
DayCell.propTypes = {
  day: PropTypes.object.isRequired,
  dayDisplayFormat: PropTypes.string,
  date: PropTypes.object,
  ranges: PropTypes.arrayOf(rangeShape),
  preview: PropTypes.shape({
    startDate: PropTypes.object,
    endDate: PropTypes.object,
    color: PropTypes.string
  }),
  onPreviewChange: PropTypes.func,
  previewColor: PropTypes.string,
  disabled: PropTypes.bool,
  isPassive: PropTypes.bool,
  isToday: PropTypes.bool,
  isWeekend: PropTypes.bool,
  isStartOfWeek: PropTypes.bool,
  isEndOfWeek: PropTypes.bool,
  isStartOfMonth: PropTypes.bool,
  isEndOfMonth: PropTypes.bool,
  color: PropTypes.string,
  displayMode: PropTypes.oneOf(['dateRange', 'date']),
  styles: PropTypes.object,
  onMouseDown: PropTypes.func,
  onMouseUp: PropTypes.func,
  onMouseEnter: PropTypes.func,
  dayContentRenderer: PropTypes.func
};
export default DayCell;