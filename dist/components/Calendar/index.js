function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { rangeShape } from '../DayCell';
import Month from '../Month';
import DateInput from '../DateInput';
import { calcFocusDate, generateStyles, getMonthDisplayRange } from '../../utils';
import classnames from 'classnames';
import ReactList from 'react-list';
import { shallowEqualObjects } from 'shallow-equal';
import addMonths from "date-fns/addMonths";
import subMonths from "date-fns/subMonths";
import format from "date-fns/format";
import eachDayOfInterval from "date-fns/eachDayOfInterval";
import startOfWeek from "date-fns/startOfWeek";
import endOfWeek from "date-fns/endOfWeek";
import isSameDay from "date-fns/isSameDay";
import addYears from "date-fns/addYears";
import setYear from "date-fns/setYear";
import setMonth from "date-fns/setMonth";
import differenceInCalendarMonths from "date-fns/differenceInCalendarMonths";
import startOfMonth from "date-fns/startOfMonth";
import endOfMonth from "date-fns/endOfMonth";
import addDays from "date-fns/addDays";
import isSameMonth from "date-fns/isSameMonth";
import differenceInDays from "date-fns/differenceInDays";
import min from "date-fns/min";
import max from "date-fns/max";
import { enUS as defaultLocale } from 'date-fns/locale/en-US';
import coreStyles from '../../styles';
import { ariaLabelsShape } from '../../accessibility';
class Calendar extends PureComponent {
  constructor(_props, context) {
    var _this;
    super(_props, context);
    _this = this;
    _defineProperty(this, "focusToDate", function (date) {
      let props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _this.props;
      let preventUnnecessary = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      if (!props.scroll.enabled) {
        if (preventUnnecessary && props.preventSnapRefocus) {
          const focusedDateDiff = differenceInCalendarMonths(date, _this.state.focusedDate);
          const isAllowedForward = props.calendarFocus === 'forwards' && focusedDateDiff >= 0;
          const isAllowedBackward = props.calendarFocus === 'backwards' && focusedDateDiff <= 0;
          if ((isAllowedForward || isAllowedBackward) && Math.abs(focusedDateDiff) < props.months) {
            return;
          }
        }
        _this.setState({
          focusedDate: date
        });
        return;
      }
      const targetMonthIndex = differenceInCalendarMonths(date, props.minDate, _this.dateOptions);
      const visibleMonths = _this.list.getVisibleRange();
      if (preventUnnecessary && visibleMonths.includes(targetMonthIndex)) return;
      _this.isFirstRender = true;
      _this.list.scrollTo(targetMonthIndex);
      _this.setState({
        focusedDate: date
      });
    });
    _defineProperty(this, "updateShownDate", function () {
      let props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this.props;
      const newProps = props.scroll.enabled ? {
        ...props,
        months: _this.list.getVisibleRange().length
      } : props;
      const newFocus = calcFocusDate(_this.state.focusedDate, newProps);
      _this.focusToDate(newFocus, newProps);
    });
    _defineProperty(this, "updatePreview", val => {
      if (!val) {
        this.setState({
          preview: null
        });
        return;
      }
      const preview = {
        startDate: val,
        endDate: val,
        color: this.props.color
      };
      this.setState({
        preview
      });
    });
    _defineProperty(this, "changeShownDate", function (value) {
      let mode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'set';
      const {
        focusedDate
      } = _this.state;
      const {
        onShownDateChange,
        minDate,
        maxDate
      } = _this.props;
      const modeMapper = {
        monthOffset: () => addMonths(focusedDate, value),
        setMonth: () => setMonth(focusedDate, value),
        setYear: () => setYear(focusedDate, value),
        set: () => value
      };
      const newDate = min([max([modeMapper[mode](), minDate]), maxDate]);
      _this.focusToDate(newDate, _this.props, false);
      onShownDateChange && onShownDateChange(newDate);
    });
    _defineProperty(this, "handleRangeFocusChange", (rangesIndex, rangeItemIndex) => {
      this.props.onRangeFocusChange && this.props.onRangeFocusChange([rangesIndex, rangeItemIndex]);
    });
    _defineProperty(this, "handleScroll", () => {
      const {
        onShownDateChange,
        minDate
      } = this.props;
      const {
        focusedDate
      } = this.state;
      const {
        isFirstRender
      } = this;
      const visibleMonths = this.list.getVisibleRange();
      // prevent scroll jump with wrong visible value
      if (visibleMonths[0] === undefined) return;
      const visibleMonth = addMonths(minDate, visibleMonths[0] || 0);
      const isFocusedToDifferent = !isSameMonth(visibleMonth, focusedDate);
      if (isFocusedToDifferent && !isFirstRender) {
        this.setState({
          focusedDate: visibleMonth
        });
        onShownDateChange && onShownDateChange(visibleMonth);
      }
      this.isFirstRender = false;
    });
    _defineProperty(this, "renderMonthAndYear", (focusedDate, changeShownDate, props) => {
      const {
        showMonthArrow,
        minDate,
        maxDate,
        showMonthAndYearPickers,
        ariaLabels
      } = props;
      const upperYearLimit = (maxDate || Calendar.defaultProps.maxDate).getFullYear();
      const lowerYearLimit = (minDate || Calendar.defaultProps.minDate).getFullYear();
      const styles = this.styles;
      return /*#__PURE__*/React.createElement("div", {
        onMouseUp: e => e.stopPropagation(),
        className: styles.monthAndYearWrapper
      }, showMonthArrow ? /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: classnames(styles.nextPrevButton, styles.prevButton),
        onClick: () => changeShownDate(-1, 'monthOffset'),
        "aria-label": ariaLabels.prevButton
      }, /*#__PURE__*/React.createElement("i", null)) : null, showMonthAndYearPickers ? /*#__PURE__*/React.createElement("span", {
        className: styles.monthAndYearPickers
      }, /*#__PURE__*/React.createElement("span", {
        className: styles.monthPicker
      }, /*#__PURE__*/React.createElement("select", {
        value: focusedDate.getMonth(),
        onChange: e => changeShownDate(e.target.value, 'setMonth'),
        "aria-label": ariaLabels.monthPicker
      }, this.state.monthNames.map((monthName, i) => /*#__PURE__*/React.createElement("option", {
        key: i,
        value: i
      }, monthName)))), /*#__PURE__*/React.createElement("span", {
        className: styles.monthAndYearDivider
      }), /*#__PURE__*/React.createElement("span", {
        className: styles.yearPicker
      }, /*#__PURE__*/React.createElement("select", {
        value: focusedDate.getFullYear(),
        onChange: e => changeShownDate(e.target.value, 'setYear'),
        "aria-label": ariaLabels.yearPicker
      }, new Array(upperYearLimit - lowerYearLimit + 1).fill(upperYearLimit).map((val, i) => {
        const year = val - i;
        return /*#__PURE__*/React.createElement("option", {
          key: year,
          value: year
        }, year);
      })))) : /*#__PURE__*/React.createElement("span", {
        className: styles.monthAndYearPickers
      }, this.state.monthNames[focusedDate.getMonth()], " ", focusedDate.getFullYear()), showMonthArrow ? /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: classnames(styles.nextPrevButton, styles.nextButton),
        onClick: () => changeShownDate(+1, 'monthOffset'),
        "aria-label": ariaLabels.nextButton
      }, /*#__PURE__*/React.createElement("i", null)) : null);
    });
    _defineProperty(this, "renderDateDisplay", () => {
      const {
        focusedRange,
        color,
        ranges,
        rangeColors,
        dateDisplayFormat,
        editableDateInputs,
        startDatePlaceholder,
        endDatePlaceholder,
        ariaLabels
      } = this.props;
      const defaultColor = rangeColors[focusedRange[0]] || color;
      const styles = this.styles;
      return /*#__PURE__*/React.createElement("div", {
        className: styles.dateDisplayWrapper
      }, ranges.map((range, i) => {
        if (range.showDateDisplay === false || range.disabled && !range.showDateDisplay) return null;
        return /*#__PURE__*/React.createElement("div", {
          className: styles.dateDisplay,
          key: i,
          style: {
            color: range.color || defaultColor
          }
        }, /*#__PURE__*/React.createElement(DateInput, {
          className: classnames(styles.dateDisplayItem, {
            [styles.dateDisplayItemActive]: focusedRange[0] === i && focusedRange[1] === 0
          }),
          readOnly: !editableDateInputs,
          disabled: range.disabled,
          value: range.startDate,
          placeholder: startDatePlaceholder,
          dateOptions: this.dateOptions,
          dateDisplayFormat: dateDisplayFormat,
          ariaLabel: ariaLabels.dateInput && ariaLabels.dateInput[range.key] && ariaLabels.dateInput[range.key].startDate,
          onChange: this.onDragSelectionEnd,
          onFocus: () => this.handleRangeFocusChange(i, 0)
        }), /*#__PURE__*/React.createElement(DateInput, {
          className: classnames(styles.dateDisplayItem, {
            [styles.dateDisplayItemActive]: focusedRange[0] === i && focusedRange[1] === 1
          }),
          readOnly: !editableDateInputs,
          disabled: range.disabled,
          value: range.endDate,
          placeholder: endDatePlaceholder,
          dateOptions: this.dateOptions,
          dateDisplayFormat: dateDisplayFormat,
          ariaLabel: ariaLabels.dateInput && ariaLabels.dateInput[range.key] && ariaLabels.dateInput[range.key].endDate,
          onChange: this.onDragSelectionEnd,
          onFocus: () => this.handleRangeFocusChange(i, 1)
        }));
      }));
    });
    _defineProperty(this, "onDragSelectionStart", date => {
      const {
        onChange,
        dragSelectionEnabled
      } = this.props;
      if (dragSelectionEnabled) {
        this.setState({
          drag: {
            status: true,
            range: {
              startDate: date,
              endDate: date
            },
            disablePreview: true
          }
        });
      } else {
        onChange && onChange(date);
      }
    });
    _defineProperty(this, "onDragSelectionEnd", date => {
      const {
        updateRange,
        displayMode,
        onChange,
        dragSelectionEnabled
      } = this.props;
      if (!dragSelectionEnabled) return;
      if (displayMode === 'date' || !this.state.drag.status) {
        onChange && onChange(date);
        return;
      }
      const newRange = {
        startDate: this.state.drag.range.startDate,
        endDate: date
      };
      if (displayMode !== 'dateRange' || isSameDay(newRange.startDate, date)) {
        this.setState({
          drag: {
            status: false,
            range: {}
          }
        }, () => onChange && onChange(date));
      } else {
        this.setState({
          drag: {
            status: false,
            range: {}
          }
        }, () => {
          updateRange && updateRange(newRange);
        });
      }
    });
    _defineProperty(this, "onDragSelectionMove", date => {
      const {
        drag
      } = this.state;
      if (!drag.status || !this.props.dragSelectionEnabled) return;
      this.setState({
        drag: {
          status: drag.status,
          range: {
            startDate: drag.range.startDate,
            endDate: date
          },
          disablePreview: true
        }
      });
    });
    _defineProperty(this, "estimateMonthSize", (index, cache) => {
      const {
        direction,
        minDate
      } = this.props;
      const {
        scrollArea
      } = this.state;
      if (cache) {
        this.listSizeCache = cache;
        if (cache[index]) return cache[index];
      }
      if (direction === 'horizontal') return scrollArea.monthWidth;
      const monthStep = addMonths(minDate, index);
      const {
        start,
        end
      } = getMonthDisplayRange(monthStep, this.dateOptions);
      const isLongMonth = differenceInDays(end, start, this.dateOptions) + 1 > 7 * 5;
      return isLongMonth ? scrollArea.longMonthHeight : scrollArea.monthHeight;
    });
    this.dateOptions = {
      locale: _props.locale
    };
    if (_props.weekStartsOn !== undefined) this.dateOptions.weekStartsOn = _props.weekStartsOn;
    this.styles = generateStyles([coreStyles, _props.classNames]);
    this.listSizeCache = {};
    this.isFirstRender = true;
    this.state = {
      monthNames: this.getMonthNames(),
      focusedDate: calcFocusDate(null, _props),
      drag: {
        status: false,
        range: {
          startDate: null,
          endDate: null
        },
        disablePreview: false
      },
      scrollArea: this.calcScrollArea(_props)
    };
  }
  getMonthNames() {
    return [...Array(12).keys()].map(i => this.props.locale.localize.month(i));
  }
  calcScrollArea(props) {
    const {
      direction,
      months,
      scroll
    } = props;
    if (!scroll.enabled) return {
      enabled: false
    };
    const longMonthHeight = scroll.longMonthHeight || scroll.monthHeight;
    if (direction === 'vertical') {
      return {
        enabled: true,
        monthHeight: scroll.monthHeight || 220,
        longMonthHeight: longMonthHeight || 260,
        calendarWidth: 'auto',
        calendarHeight: (scroll.calendarHeight || longMonthHeight || 240) * months
      };
    }
    return {
      enabled: true,
      monthWidth: scroll.monthWidth || 332,
      calendarWidth: (scroll.calendarWidth || scroll.monthWidth || 332) * months,
      monthHeight: longMonthHeight || 300,
      calendarHeight: longMonthHeight || 300
    };
  }
  componentDidMount() {
    if (this.props.scroll.enabled) {
      // prevent react-list's initial render focus problem
      setTimeout(() => this.focusToDate(this.state.focusedDate));
    }
  }
  componentDidUpdate(prevProps) {
    const propMapper = {
      dateRange: 'ranges',
      date: 'date'
    };
    const targetProp = propMapper[this.props.displayMode];
    if (this.props[targetProp] !== prevProps[targetProp]) {
      this.updateShownDate(this.props);
    }
    if (prevProps.locale !== this.props.locale || prevProps.weekStartsOn !== this.props.weekStartsOn) {
      this.dateOptions = {
        locale: this.props.locale
      };
      if (this.props.weekStartsOn !== undefined) this.dateOptions.weekStartsOn = this.props.weekStartsOn;
      this.setState({
        monthNames: this.getMonthNames()
      });
    }
    if (!shallowEqualObjects(prevProps.scroll, this.props.scroll)) {
      this.setState({
        scrollArea: this.calcScrollArea(this.props)
      });
    }
  }
  renderWeekdays() {
    const now = new Date();
    return /*#__PURE__*/React.createElement("div", {
      className: this.styles.weekDays
    }, eachDayOfInterval({
      start: startOfWeek(now, this.dateOptions),
      end: endOfWeek(now, this.dateOptions)
    }).map((day, i) => /*#__PURE__*/React.createElement("span", {
      className: this.styles.weekDay,
      key: i
    }, format(day, this.props.weekdayDisplayFormat, this.dateOptions))));
  }
  render() {
    const {
      showDateDisplay,
      onPreviewChange,
      scroll,
      direction,
      disabledDates,
      disabledDay,
      maxDate,
      minDate,
      rangeColors,
      color,
      navigatorRenderer,
      className,
      preview
    } = this.props;
    const {
      scrollArea,
      focusedDate
    } = this.state;
    const isVertical = direction === 'vertical';
    const monthAndYearRenderer = navigatorRenderer || this.renderMonthAndYear;
    const ranges = this.props.ranges.map((range, i) => ({
      ...range,
      color: range.color || rangeColors[i] || color
    }));
    return /*#__PURE__*/React.createElement("div", {
      className: classnames(this.styles.calendarWrapper, className),
      onMouseUp: () => this.setState({
        drag: {
          status: false,
          range: {}
        }
      }),
      onMouseLeave: () => {
        this.setState({
          drag: {
            status: false,
            range: {}
          }
        });
      }
    }, showDateDisplay && this.renderDateDisplay(), monthAndYearRenderer(focusedDate, this.changeShownDate, this.props), scroll.enabled ? /*#__PURE__*/React.createElement("div", null, isVertical && this.renderWeekdays(this.dateOptions), /*#__PURE__*/React.createElement("div", {
      className: classnames(this.styles.infiniteMonths, isVertical ? this.styles.monthsVertical : this.styles.monthsHorizontal),
      onMouseLeave: () => onPreviewChange && onPreviewChange(),
      style: {
        width: scrollArea.calendarWidth + 11,
        height: scrollArea.calendarHeight + 11
      },
      onScroll: this.handleScroll
    }, /*#__PURE__*/React.createElement(ReactList, {
      length: differenceInCalendarMonths(endOfMonth(maxDate), addDays(startOfMonth(minDate), -1), this.dateOptions),
      treshold: 500,
      type: "variable",
      ref: target => this.list = target,
      itemSizeEstimator: this.estimateMonthSize,
      axis: isVertical ? 'y' : 'x',
      itemRenderer: (index, key) => {
        const monthStep = addMonths(minDate, index);
        return /*#__PURE__*/React.createElement(Month, _extends({}, this.props, {
          onPreviewChange: onPreviewChange || this.updatePreview,
          preview: preview || this.state.preview,
          ranges: ranges,
          key: key,
          drag: this.state.drag,
          dateOptions: this.dateOptions,
          disabledDates: disabledDates,
          disabledDay: disabledDay,
          month: monthStep,
          onDragSelectionStart: this.onDragSelectionStart,
          onDragSelectionEnd: this.onDragSelectionEnd,
          onDragSelectionMove: this.onDragSelectionMove,
          onMouseLeave: () => onPreviewChange && onPreviewChange(),
          styles: this.styles,
          style: isVertical ? {
            height: this.estimateMonthSize(index)
          } : {
            height: scrollArea.monthHeight,
            width: this.estimateMonthSize(index)
          },
          showMonthName: true,
          showWeekDays: !isVertical
        }));
      }
    }))) : /*#__PURE__*/React.createElement("div", {
      className: classnames(this.styles.months, isVertical ? this.styles.monthsVertical : this.styles.monthsHorizontal)
    }, new Array(this.props.months).fill(null).map((_, i) => {
      let monthStep = addMonths(this.state.focusedDate, i);
      if (this.props.calendarFocus === 'backwards') {
        monthStep = subMonths(this.state.focusedDate, this.props.months - 1 - i);
      }
      return /*#__PURE__*/React.createElement(Month, _extends({}, this.props, {
        onPreviewChange: onPreviewChange || this.updatePreview,
        preview: preview || this.state.preview,
        ranges: ranges,
        key: i,
        drag: this.state.drag,
        dateOptions: this.dateOptions,
        disabledDates: disabledDates,
        disabledDay: disabledDay,
        month: monthStep,
        onDragSelectionStart: this.onDragSelectionStart,
        onDragSelectionEnd: this.onDragSelectionEnd,
        onDragSelectionMove: this.onDragSelectionMove,
        onMouseLeave: () => onPreviewChange && onPreviewChange(),
        styles: this.styles,
        showWeekDays: !isVertical || i === 0,
        showMonthName: !isVertical || i > 0
      }));
    })));
  }
}
Calendar.defaultProps = {
  showMonthArrow: true,
  showMonthAndYearPickers: true,
  disabledDates: [],
  disabledDay: () => {},
  classNames: {},
  locale: defaultLocale,
  ranges: [],
  focusedRange: [0, 0],
  dateDisplayFormat: 'MMM d, yyyy',
  monthDisplayFormat: 'MMM yyyy',
  weekdayDisplayFormat: 'E',
  dayDisplayFormat: 'd',
  showDateDisplay: true,
  showPreview: true,
  displayMode: 'date',
  months: 1,
  color: '#3d91ff',
  scroll: {
    enabled: false
  },
  direction: 'vertical',
  maxDate: addYears(new Date(), 20),
  minDate: addYears(new Date(), -100),
  rangeColors: ['#3d91ff', '#3ecf8e', '#fed14c'],
  startDatePlaceholder: 'Early',
  endDatePlaceholder: 'Continuous',
  editableDateInputs: false,
  dragSelectionEnabled: true,
  fixedHeight: false,
  calendarFocus: 'forwards',
  preventSnapRefocus: false,
  ariaLabels: {}
};
Calendar.propTypes = {
  showMonthArrow: PropTypes.bool,
  showMonthAndYearPickers: PropTypes.bool,
  disabledDates: PropTypes.array,
  disabledDay: PropTypes.func,
  minDate: PropTypes.object,
  maxDate: PropTypes.object,
  date: PropTypes.object,
  onChange: PropTypes.func,
  onPreviewChange: PropTypes.func,
  onRangeFocusChange: PropTypes.func,
  classNames: PropTypes.object,
  locale: PropTypes.object,
  shownDate: PropTypes.object,
  onShownDateChange: PropTypes.func,
  ranges: PropTypes.arrayOf(rangeShape),
  preview: PropTypes.shape({
    startDate: PropTypes.object,
    endDate: PropTypes.object,
    color: PropTypes.string
  }),
  dateDisplayFormat: PropTypes.string,
  monthDisplayFormat: PropTypes.string,
  weekdayDisplayFormat: PropTypes.string,
  weekStartsOn: PropTypes.number,
  dayDisplayFormat: PropTypes.string,
  focusedRange: PropTypes.arrayOf(PropTypes.number),
  initialFocusedRange: PropTypes.arrayOf(PropTypes.number),
  months: PropTypes.number,
  className: PropTypes.string,
  showDateDisplay: PropTypes.bool,
  showPreview: PropTypes.bool,
  displayMode: PropTypes.oneOf(['dateRange', 'date']),
  color: PropTypes.string,
  updateRange: PropTypes.func,
  scroll: PropTypes.shape({
    enabled: PropTypes.bool,
    monthHeight: PropTypes.number,
    longMonthHeight: PropTypes.number,
    monthWidth: PropTypes.number,
    calendarWidth: PropTypes.number,
    calendarHeight: PropTypes.number
  }),
  direction: PropTypes.oneOf(['vertical', 'horizontal']),
  startDatePlaceholder: PropTypes.string,
  endDatePlaceholder: PropTypes.string,
  navigatorRenderer: PropTypes.func,
  rangeColors: PropTypes.arrayOf(PropTypes.string),
  editableDateInputs: PropTypes.bool,
  dragSelectionEnabled: PropTypes.bool,
  fixedHeight: PropTypes.bool,
  calendarFocus: PropTypes.string,
  preventSnapRefocus: PropTypes.bool,
  ariaLabels: ariaLabelsShape
};
export default Calendar;