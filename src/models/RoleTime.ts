
import {TimeDefinitions} from '../models/Project';

export default class RoleTime {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  timeDefinitions: TimeDefinitions;

  dateString: string;
  dateStringLong: string;
  timeString: string;

  constructor(time: string, timeDefinitions: TimeDefinitions){
    const timeSplit = time.split('/');

    this.year = parseInt(timeSplit[0]);
    this.month = parseInt(timeSplit[1]);
    this.day = parseInt(timeSplit[2]);
    this.hour = parseInt(timeSplit[3]);
    this.minute = parseInt(timeSplit[4]);
    this.second = parseInt(timeSplit[5]);
    this.timeDefinitions = timeDefinitions;

    // Formating of time
    this.dateString = this.formatToDateString();
    this.dateStringLong = this.formatToDateStringLong();
    this.timeString = this.formatToTimeString();

    console.log(this);
  }

  /**
   * Return date in format YYYY/MM/DD
   */
  formatToDateString() {
    const {yearMonthsCount, monthDaysCount} = this.timeDefinitions;
    return this.displayZerosBeforeValue(this.year, 9999) + '/' +
      this.displayZerosBeforeValue(this.month, yearMonthsCount) + '/' +
      this.displayZerosBeforeValue(this.day, monthDaysCount[this.month]);
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
   * Calculate how many 0 before a number we should display for readability
   * based on the maximum that can be displayed for this number.
   *
   * @param value  number
   * @param max  number  
   */
  displayZerosBeforeValue(value: number, max: number) {
    const valueLength = value.toString().length;
    const maxLength = max.toString().length;
    const zeros = '0'.repeat(maxLength - valueLength);
    return zeros + value;
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
}