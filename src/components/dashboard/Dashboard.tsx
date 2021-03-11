
import * as React from 'react';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import { getAllFromProject } from '../../api/localdb';

import Moment from '../../models/Moment';
import Project, {TimeDefinitions} from '../../models/Project';


export interface DashboardProps {
  project: Project;
}

export interface DashboardState {
  presentMoments: Moment[];
}

export class Dashboard extends React.Component<
  DashboardProps,
  DashboardState
> {

  public static defaultProps: Partial<DashboardProps> = {
  };

  constructor(props: DashboardProps) {
    super(props);

    this.state = {
      presentMoments: [],
    };
  }

  // --------------------------------- RENDER -------------------------------

  public render() {
    if (!this.state.presentMoments.length) {
      return null;
    }
    const timeDefs = this.props.project.settings.timeDefinitions;
    const {yearMonthsCount, monthDaysCount} = timeDefs;
    const {year, month, day, hour, minute, second} = this.state.presentMoments[0];

    return <>
      <Box display="flex" alignItems="center" justifyContent="center">

        {/* COUNTER */}
        <Typography variant="h4" component="h4" align="center">
          {this.displayWeekDayName(this.state.presentMoments[0], timeDefs)} {day}
          {" "} {timeDefs.monthNames[month - 1]}
          {" "} {year}
          <br/>
          {this.displayZerosBeforeValue(year, 9999)}/
          {this.displayZerosBeforeValue(month, yearMonthsCount)}/
          {this.displayZerosBeforeValue(day, monthDaysCount[month])}

          <br/>
          {this.displayZerosBeforeValue(hour, 24)}:
          {this.displayZerosBeforeValue(minute, 60)}:
          {this.displayZerosBeforeValue(second, 60)}
        </Typography>
      </Box>
    </>;
  }

  displayZerosBeforeValue(value: number, max: number) {
    const valueLength = value.toString().length;
    const maxLength = max.toString().length;
    const zeros = '0'.repeat(maxLength - valueLength);
    return zeros + value;
  }

  displayWeekDayName(moment: Moment, timeDefs: TimeDefinitions){
    const {year, month, day} = moment;
    const {yearMonthsCount, monthDaysCount, weekDaysCount, weekDaysNames} = timeDefs;
    const daysPerYear = monthDaysCount.reduce((pre, cur) => pre + cur);
    const daysInYearSoFar = [0].concat(monthDaysCount).reduce((pre, cur, i) => i < month ? pre + cur : pre);
    const daysSinceYear0 = (daysPerYear * year) + daysInYearSoFar + day - 1;
    const dayIndex = daysSinceYear0 % weekDaysCount; 
    console.log(daysPerYear, daysInYearSoFar, daysSinceYear0, dayIndex);
    return weekDaysNames[dayIndex];
  }

  // --------------------------------- COMPONENT LIFECYCLE -------------------------------

  public componentDidMount () {
    this.loadDatas();
  }

  // --------------------------------- CUSTOM FUNCTIONS -------------------------------

  /**
   * Gather all the datas we need
   */
  public loadDatas() {
    getAllFromProject('presentMoments', this.props.project.id, (presentMoments: Moment[]) => {
      this.setState({
        presentMoments,
      });
    });
  }

}
