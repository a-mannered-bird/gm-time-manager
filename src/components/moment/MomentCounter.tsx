
import * as React from 'react';

// import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import Moment from '../../models/Moment';
import {TimeDefinitions} from '../../models/Project';


export interface MomentCounterProps {
  timeDefinitions: TimeDefinitions;
  moment: Moment;
}

export interface MomentCounterState {}

export class MomentCounter extends React.Component<
  MomentCounterProps,
  MomentCounterState
> {

  public static defaultProps: Partial<MomentCounterProps> = {
  };

  constructor(props: MomentCounterProps) {
    super(props);

    this.state = {};
  }

  // --------------------------------- RENDER -------------------------------

  public render() {
    const timeDefs = this.props.timeDefinitions;
    const {yearMonthsCount, monthDaysCount} = timeDefs;
    const {year, month, day, hour, minute, second} = this.props.moment;

    return <Typography variant="h6" component="h6" align="center">
      {this.displayWeekDayName(this.props.moment, timeDefs)} {day}
      {" "} {timeDefs.monthNames[month - 1]}
      {" "} {year} {" "}
      ({this.displayZerosBeforeValue(year, 9999)}/
      {this.displayZerosBeforeValue(month, yearMonthsCount)}/
      {this.displayZerosBeforeValue(day, monthDaysCount[month])})

      <br/>
      {this.displayZerosBeforeValue(hour, 24)}:
      {this.displayZerosBeforeValue(minute, 60)}:
      {this.displayZerosBeforeValue(second, 60)}
    </Typography>;
  }

  displayZerosBeforeValue(value: number, max: number) {
    const valueLength = value.toString().length;
    const maxLength = max.toString().length;
    const zeros = '0'.repeat(maxLength - valueLength);
    return zeros + value;
  }

  displayWeekDayName(moment: Moment, timeDefs: TimeDefinitions){
    const {year, month, day} = moment;
    const {monthDaysCount, weekDaysCount, weekDaysNames} = timeDefs;
    const daysPerYear = monthDaysCount.reduce((pre, cur) => pre + cur);
    const daysInYearSoFar = [0].concat(monthDaysCount).reduce((pre, cur, i) => i < month ? pre + cur : pre);
    const daysSinceYear0 = (daysPerYear * year) + daysInYearSoFar + day - 1;
    const dayIndex = daysSinceYear0 % weekDaysCount; 
    console.log(daysPerYear, daysInYearSoFar, daysSinceYear0, dayIndex);
    return weekDaysNames[dayIndex];
  }

  // --------------------------------- COMPONENT LIFECYCLE -------------------------------

  // --------------------------------- CUSTOM FUNCTIONS -------------------------------

}
