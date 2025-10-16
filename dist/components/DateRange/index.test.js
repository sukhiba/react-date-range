function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
import React from 'react';
import subDays from "date-fns/subDays";
import addDays from "date-fns/addDays";
import isSameDay from "date-fns/isSameDay";
import DateRange from '../DateRange';
import renderer from 'react-test-renderer';
let testRenderer = null;
let instance = null;
const endDate = new Date();
const startDate = subDays(endDate, 7);
const commonProps = {
  ranges: [{
    startDate,
    endDate,
    key: 'selection'
  }],
  onChange: () => {},
  moveRangeOnFirstSelection: false
};
const compareRanges = (newRange, assertionRange) => {
  ['startDate', 'endDate'].forEach(key => {
    if (!newRange[key] || !assertionRange[key]) {
      return expect(newRange[key]).toEqual(assertionRange[key]);
    }
    return expect(isSameDay(newRange[key], assertionRange[key])).toEqual(true);
  });
};
beforeEach(() => {
  testRenderer = renderer.create( /*#__PURE__*/React.createElement(DateRange, commonProps));
  instance = testRenderer.getInstance();
});
describe('DateRange', () => {
  test('Should resolve', () => {
    expect(DateRange).toEqual(expect.anything());
  });
  test('calculate new selection by resetting end date', () => {
    const methodResult = instance.calcNewSelection(subDays(endDate, 10), true);
    compareRanges(methodResult.range, {
      startDate: subDays(endDate, 10),
      endDate: subDays(endDate, 10)
    });
  });
  test('calculate new selection by resetting end date if start date is not before', () => {
    const methodResult = instance.calcNewSelection(addDays(endDate, 2), true);
    compareRanges(methodResult.range, {
      startDate: addDays(endDate, 2),
      endDate: addDays(endDate, 2)
    });
  });
  test('calculate new selection based on moveRangeOnFirstSelection prop', () => {
    testRenderer.update( /*#__PURE__*/React.createElement(DateRange, _extends({}, commonProps, {
      moveRangeOnFirstSelection: true
    })));
    const methodResult = instance.calcNewSelection(subDays(endDate, 10), true);
    compareRanges(methodResult.range, {
      startDate: subDays(endDate, 10),
      endDate: subDays(endDate, 3)
    });
  });
  test('calculate new selection by retaining end date, based on retainEndDateOnFirstSelection prop', () => {
    testRenderer.update( /*#__PURE__*/React.createElement(DateRange, _extends({}, commonProps, {
      retainEndDateOnFirstSelection: true
    })));
    const methodResult = instance.calcNewSelection(subDays(endDate, 10), true);
    compareRanges(methodResult.range, {
      startDate: subDays(endDate, 10),
      endDate
    });
  });
  test('calculate new selection by retaining the unset end date, based on retainEndDateOnFirstSelection prop', () => {
    testRenderer.update( /*#__PURE__*/React.createElement(DateRange, _extends({}, commonProps, {
      ranges: [{
        ...commonProps.ranges[0],
        endDate: null
      }],
      retainEndDateOnFirstSelection: true
    })));
    const methodResult = instance.calcNewSelection(subDays(endDate, 10), true);
    compareRanges(methodResult.range, {
      startDate: subDays(endDate, 10),
      endDate: null
    });
  });
});