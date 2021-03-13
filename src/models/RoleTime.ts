
/**
  TODO: Constructor that takes a number to create the RoleTime
  (number of seconds relative to year 0)
*/

import {TimeDefinitions} from '../models/Project';

export interface RoleTimeValue {
  year?: number;
  month?: number;
  day?: number;
  hour?: number;
  minute?: number;
  second?: number;
}

export default class RoleTime implements RoleTimeValue {
  [key: string]: any;
  valueNames: string[];
  year?: number;
  month?: number;
  day?: number;
  hour?: number;
  minute?: number;
  second?: number;
  timeDefinitions: TimeDefinitions;

  monthName: string;
  weekDayName: string;

  monthMax: number;
  monthMin: number;
  dayMax: number;
  dayMin: number;
  hourMax: number;
  hourMin: number;
  minuteMax: number;
  minuteMin: number;
  secondMax: number;
  secondMin: number;

  dateString: string;
  dateStringLong: string;
  timeString: string;

  constructor(roleTime: RoleTime);
  constructor(time: string, timeDefinitions: TimeDefinitions);
  constructor(time: string | RoleTime, timeDefinitions?: TimeDefinitions){
    this.valueNames = ['year', 'month', 'day', 'hour', 'minute', 'second'];

    // From RoleTime
    if (this.isRoleTime(time)) {
      this.valueNames.forEach((name) => this[name] = time[name]);
      this.timeDefinitions = time.timeDefinitions;

    // From string
    } else {
      const timeSplit = time.split('/');
      this.valueNames.forEach((name, i) => this[name] = parseInt(timeSplit[i]));
      this.timeDefinitions = timeDefinitions as TimeDefinitions;
    }

    // Time unity minimums and maximums
    const {monthDaysCount, yearMonthsCount} = this.timeDefinitions;
    this.monthMax = yearMonthsCount;
    this.monthMin = 1;
    this.dayMax = monthDaysCount[(this.month || this.monthMin) - 1];
    this.dayMin = 1;
    this.hourMax = 23;
    this.hourMin = 0;
    this.minuteMax = 59;
    this.minuteMin = 0;
    this.secondMax = 59;
    this.secondMin = 0;

    this.weekDayName = this.displayWeekDayName();
    this.monthName = this.timeDefinitions.monthNames[(this.month || this.monthMin) - 1];

    // Formating of time
    this.dateString = this.formatToDateString();
    this.dateStringLong = this.formatToDateStringLong();
    this.timeString = this.formatToTimeString();
  }

  /**
   * Test if a variable is a roletime variable
   *
   * @param time  string | RoleTime
   */
  isRoleTime(time: string | RoleTime):time is RoleTime {
    return (time as RoleTime).timeDefinitions !== undefined;
  }

  /**
   * Return date in format YYYY/MM/DD
   */
  formatToDateString() {
    return this.year + '/' +
      this.displayZerosBeforeValue(this.month, this.monthMax) + '/' +
      this.displayZerosBeforeValue(this.day, this.dayMax);
  }

  /**
   * Return formated date with names for months and days, like Monday 1 January 2000
   */
  formatToDateStringLong() {
    return this.weekDayName + " " + this.day + 
      " " + this.monthName +
      " " + this.year;
  }

  /**
   * Return time in format HH:MM:SS
   */
  formatToTimeString() {
    return this.displayZerosBeforeValue(this.hour, 24) + ':' +
      this.displayZerosBeforeValue(this.minute, 60) + ':' +
      this.displayZerosBeforeValue(this.second, 60);
  }

  /**
   * Return time in format Y/M/D/H/m/S
   */
  formatToFullString() {
    return this.valueNames.map((name) => this[name]).join('/');
  }

  /**
   * Calculate how many 0 before a number we should display for readability
   * based on the maximum that can be displayed for this number.
   *
   * @param value  number
   * @param max  number  
   */
  displayZerosBeforeValue(value: number | undefined, max: number) {
    if (value === undefined) {
      return '?';
    }

    const valueLength = Math.abs(value).toString().length;
    const maxLength = Math.abs(max).toString().length;
    const numberOfZeros = maxLength - valueLength;
    return numberOfZeros < 0 ? value : '0'.repeat(numberOfZeros) + value;
  }

  /**
   * Calculate weekday name by counting days starting from year 0 
   */
  displayWeekDayName(){
    const {monthDaysCount, weekDaysCount, weekDaysNames} = this.timeDefinitions;
    const year = this.year || 0;
    const month = this.month || this.monthMin;
    const day = this.day || this.dayMin;
    const daysPerYear = monthDaysCount.reduce((pre, cur) => pre + cur);
    const daysInYearSoFar = [0].concat(monthDaysCount).reduce((pre, cur, i) => {
      return i < month ? pre + cur : pre;
    }) + day - 1;

    let dayIndex;
    if (year >= 0) {
      const daysSinceYear0 = (daysPerYear * year) + daysInYearSoFar;
      dayIndex = daysSinceYear0 % weekDaysCount; 
    } else if (year < 0) {
      const daysFromYear0 = (daysPerYear * (year + 1)) - (daysPerYear - daysInYearSoFar);
      dayIndex = weekDaysCount + ((daysFromYear0 % weekDaysCount) || -weekDaysCount); 
    } else {
      return "";
    }


    return weekDaysNames[dayIndex];
  }

// *********** MANIPULATION **********

  /**
   * Add a time value expressed in RoleTime to this RoleTime
   *
   * @param toAdd  RoleTime  RoleTime to add to this RoleTime
   */
  addRoleTime(toAdd: RoleTime): RoleTime {
    const newRoleTime = new RoleTime(this);
    
    // Seconds
    const secondResults = this.addToCappedValue(this.second, toAdd.second, this.secondMin, this.secondMax + 1);
    newRoleTime.second = secondResults.newValue;
    const minutesToAdd = (toAdd.minute || 0) + secondResults.parentValueAdd;

    // Minutes
    const minuteResults = this.addToCappedValue(this.minute, minutesToAdd, this.minuteMin, this.minuteMax + 1);
    newRoleTime.minute = minuteResults.newValue;
    const hoursToAdd = (toAdd.hour || 0) + minuteResults.parentValueAdd;

    // Hours
    const hourResults = this.addToCappedValue(this.hour, hoursToAdd, this.hourMin, this.hourMax + 1);
    newRoleTime.hour = hourResults.newValue;
    const daysToAdd = (toAdd.day || 0) + hourResults.parentValueAdd;

    // Days
    // TODO: Exception because this day per month can vary :'(
    const dayResults = this.addToCappedValue(this.day, daysToAdd, this.dayMin, this.dayMax);
    newRoleTime.day = dayResults.newValue;
    const monthsToAdd = (toAdd.month || 0) + dayResults.parentValueAdd;

    // Months
    const monthResults = this.addToCappedValue(this.month, monthsToAdd, this.monthMin, this.monthMax);
    newRoleTime.month = monthResults.newValue;
    const yearsToAdd = (toAdd.year || 0) + monthResults.parentValueAdd;

    // Years
    newRoleTime.year = (this.year || 0) + yearsToAdd;

    return newRoleTime;
  }

  addToCappedValue(initialValue: number | undefined, addValue: number | undefined, valueMin: number, valueMax: number): {newValue: number, parentValueAdd: number}{
    let newValue = (initialValue || 0) + (addValue || 0);
    let parentValueAdd = Math.floor(Math.abs(newValue / valueMax));
    newValue %= valueMax;
    if (newValue < valueMin) {
      newValue = valueMax + newValue;
      parentValueAdd--;
    }
    return {newValue, parentValueAdd};
  }

  applyMaxMinToAll(){
    this.valueNames.forEach((name) => {
      if (name === 'year'){
        return;
      }

      const maxForThisValue = this[name + 'Max'];
      const minForThisValue = this[name + 'Min'];
      const value = this[name] || minForThisValue;
      
      if (value > maxForThisValue) {
        this[name] = maxForThisValue;
      } else if (value < minForThisValue) {
        this[name] = minForThisValue;
      } else {
        this[name] = value;
      }

      if (name === 'month') {
        this.dayMax = this.timeDefinitions.monthDaysCount[value - 1];
      }
    });
  }
}