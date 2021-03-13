
import {TimeDefinitions} from '../models/Project';

export interface RoleTimeValue {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

export default class RoleTime implements RoleTimeValue {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  timeDefinitions: TimeDefinitions;
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

    // From RoleTime
    if (this.isRoleTime(time)) {
      this.year = time.year;
      this.month = time.month;
      this.day = time.day;
      this.hour = time.hour;
      this.minute = time.minute;
      this.second = time.second;
      this.timeDefinitions = time.timeDefinitions;

    // From string
    } else {
      const timeSplit = time.split('/');

      this.year = parseInt(timeSplit[0]);
      this.month = parseInt(timeSplit[1]);
      this.day = parseInt(timeSplit[2]);
      this.hour = parseInt(timeSplit[3]);
      this.minute = parseInt(timeSplit[4]);
      this.second = parseInt(timeSplit[5]);
      this.timeDefinitions = timeDefinitions as TimeDefinitions;
    }

    // Time unity minimums and maximums
    const {monthDaysCount, yearMonthsCount} = this.timeDefinitions;
    this.monthMax = yearMonthsCount;
    this.monthMin = 1;
    this.dayMax = monthDaysCount[this.month - 1];
    this.dayMin = 1;
    this.hourMax = 23;
    this.hourMin = 0;
    this.minuteMax = 59;
    this.minuteMin = 0;
    this.secondMax = 59;
    this.secondMin = 0;


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
    return this.displayZerosBeforeValue(this.year, 9999) + '/' +
      this.displayZerosBeforeValue(this.month, this.monthMax) + '/' +
      this.displayZerosBeforeValue(this.day, this.dayMax);
  }

  /**
   * Return formated date with names for months and days, like Monday 1 January 2000
   */
  formatToDateStringLong() {
    return this.displayWeekDayName() + " " + this.day + 
      " " + this.timeDefinitions.monthNames[this.month - 1] +
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
    return [this.year, this.month, this.day, this.hour, this.minute, this.second].join('/');
  }

  /**
   * Calculate how many 0 before a number we should display for readability
   * based on the maximum that can be displayed for this number.
   *
   * @param value  number
   * @param max  number  
   */
  displayZerosBeforeValue(value: number, max: number) {
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
    const daysPerYear = monthDaysCount.reduce((pre, cur) => pre + cur);
    const daysInYearSoFar = [0].concat(monthDaysCount).reduce((pre, cur, i) => {
      return i < this.month ? pre + cur : pre;
    });
    const daysSinceYear0 = (daysPerYear * this.year) + daysInYearSoFar + this.day - 1;
    const dayIndex = daysSinceYear0 % weekDaysCount; 
    return weekDaysNames[dayIndex];
  }

  /**
   * Add a time value expressed in RoleTime to this RoleTime
   *
   * @param toAdd  RoleTime  RoleTime to add to this RoleTime
   */
  addRoleTime(toAdd: RoleTime): RoleTime {
    const newRoleTime = new RoleTime(this);
    
    // Seconds
    const secondResults = this.addToCappedValue(this.second, toAdd.second, this.secondMax + 1);
    newRoleTime.second = secondResults.newValue;
    const minutesToAdd = toAdd.minute + secondResults.parentValueAdd;

    // Minutes
    const minuteResults = this.addToCappedValue(this.minute, minutesToAdd, this.minuteMax + 1);
    newRoleTime.minute = minuteResults.newValue;
    const hoursToAdd = toAdd.hour + minuteResults.parentValueAdd;

    // Hours
    const hourResults = this.addToCappedValue(this.hour, hoursToAdd, this.hourMax + 1);
    newRoleTime.hour = hourResults.newValue;
    const daysToAdd = toAdd.day + hourResults.parentValueAdd;

    // Days
    // TODO: Exception because this day per month can vary :'(
    const dayResults = this.addToCappedValue(this.day, daysToAdd, this.dayMax);
    newRoleTime.day = dayResults.newValue;
    const monthsToAdd = toAdd.month + dayResults.parentValueAdd;

    // Months
    const monthResults = this.addToCappedValue(this.month, monthsToAdd, this.monthMax);
    newRoleTime.month = monthResults.newValue;
    const yearsToAdd = toAdd.year + monthResults.parentValueAdd;

    // Years
    newRoleTime.year = this.year + yearsToAdd;

    return newRoleTime;
  }

  addToCappedValue(initialValue: number, addValue: number, valueMax: number): {newValue: number, parentValueAdd: number}{
    let newValue = initialValue + addValue;
    let parentValueAdd = Math.floor(Math.abs(newValue / valueMax));
    newValue %= valueMax;
    if (newValue < 0) {
      newValue = valueMax + newValue;
      parentValueAdd--;
    }
    return {newValue, parentValueAdd};
  }
}