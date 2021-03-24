
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
  constructor(time: number, timeDefinitions: TimeDefinitions);
  constructor(time: string | RoleTime | number, timeDefinitions?: TimeDefinitions){
    this.valueNames = ['year', 'month', 'day', 'hour', 'minute', 'second'];

    // Set time definitions
    if (this.isRoleTime(time)) {
      this.timeDefinitions = time.timeDefinitions;
    } else {
      this.timeDefinitions = timeDefinitions as TimeDefinitions;
    }

    // Time unity minimums and maximums
    const {monthDaysCount, yearMonthsCount} = this.timeDefinitions;
    this.monthMax = yearMonthsCount;
    this.monthMin = 1;
    this.dayMin = 1;
    this.hourMax = 23;
    this.hourMin = 0;
    this.minuteMax = 59;
    this.minuteMin = 0;
    this.secondMax = 59;
    this.secondMin = 0;

    // Set values from RoleTime
    if (this.isRoleTime(time)) {
      this.valueNames.forEach((name) => this[name] = time[name]);

    // From string
    } else if (typeof time === 'string') {
      const timeSplit = time.split('/');
      this.valueNames.forEach((name, i) => this[name] = parseInt(timeSplit[i]));

    // from number
    } else {

      // Define time
      let timeLeft = time;
      ['second', 'minute', 'hour'].forEach((name) => {
        const max = this[name + 'Max'] + 1;
        const value = timeLeft % max;
        this[name] = value < 0 ? max + value : value;
        timeLeft = Math.floor(timeLeft / max);
      });

      // Set year
      const daysPerYear = this.getDaysPerYear();
      this.year = Math.floor(timeLeft / daysPerYear);
      const daysLeft = timeLeft % daysPerYear;

      // Set month
      let daysCount = 0;
      const daysSoFarInYear = daysLeft < 0 ? daysPerYear + daysLeft : daysLeft;
      // console.log('daysSoFarInYear ', daysSoFarInYear);
      this.month = monthDaysCount.findIndex((count, i) => {
        // console.log('month ' + i + ' - ' + count + ' days - ' + ' daysCount ' + daysCount);
        if (daysCount + count > daysSoFarInYear) {
          return true;
        } else {
          daysCount += count;
          return false;
        }
      }) + 1;

      // Set day
      this.day = Math.abs(daysSoFarInYear - daysCount + 1);
    }

    this.dayMax = monthDaysCount[(this.month || this.monthMin) - 1];
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
  isRoleTime(time: string | RoleTime | number):time is RoleTime {
    return (time as RoleTime).timeDefinitions !== undefined;
  }

  // ******************** FORMATING METHODS *********************

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
   * Return timestamp that represents the number of seconds away from year 0
   */
  formatToNumber() {
    const secondsSinceYear0 = (this.getDaysSinceYear0()) *
      (this.hourMax + 1) * (this.minuteMax + 1) * (this.secondMax + 1);
    const secondsToday = this.getSecondsInDaySoFar();

    return secondsSinceYear0 + secondsToday;
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
    const {weekDaysCount, weekDaysNames} = this.timeDefinitions;
    const year = this.year || 0;

    let dayIndex;
    let daysSinceYear0 = this.getDaysSinceYear0();
    if (year >= 0) {
      dayIndex = daysSinceYear0 % weekDaysCount; 
    } else if (year < 0) {
      dayIndex = weekDaysCount + ((daysSinceYear0 % weekDaysCount) || -weekDaysCount); 
    } else {
      return "";
    }

    return weekDaysNames[dayIndex];
  }

// ********************* MATH METHODS *****************

  /**
   * Return number of days in a year
   */
  getDaysPerYear(): number {
    const {monthDaysCount} = this.timeDefinitions;
    return monthDaysCount.reduce((pre, cur) => pre + cur);
  }

  /**
   * Return how many days has passed in the year so far, including today
   */
  getDaysInYearSoFar(): number {
    const {monthDaysCount} = this.timeDefinitions;
    const day = this.day || this.dayMin;
    const month = this.month || this.monthMin;

    return [0].concat(monthDaysCount).reduce((pre, cur, i) => {
      return i < month ? pre + cur : pre;
    }) + day - 1;
  }

  /**
   * Return number of days since or from year 0, including today
   */
  getDaysSinceYear0(): number {
    const year = this.year || 0;
    const daysPerYear = this.getDaysPerYear();
    const daysInYearSoFar = this.getDaysInYearSoFar();

    if (year >= 0) {
      return (daysPerYear * year) + daysInYearSoFar;
    } else if (year < 0) {
      return (daysPerYear * (year + 1)) - (daysPerYear - daysInYearSoFar);
    } else return NaN;
  }

  /**
   * Return total number of seconds in a day
   */
  getSecondsInADay(): number {
    return (this.hourMax + 1) * (this.minuteMax + 1) * (this.secondMax + 1);
  }

  /**
   * Return number of minutes that has passed today
   */
  getMinutesInDaySoFar(): number {
    return (this.hour || this.hourMin) * (this.minuteMax + 1) + (this.minute || this.minuteMin);
  }

  /**
   * Return number of seconds that has passed today
   */
  getSecondsInDaySoFar(): number {
    return this.getMinutesInDaySoFar() * (this.secondMax + 1) + (this.second || this.secondMin);
  }

// ********************* MANIPULATION ********************

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