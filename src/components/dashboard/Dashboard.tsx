
import * as React from 'react';

import Box from '@material-ui/core/Box';
// import Typography from '@material-ui/core/Typography';

import { ClockButton } from './ClockButton';
import { DashboardEvents } from './DashboardEvents';
import { RoleTimeCounter } from '../roleTime/RoleTimeCounter';
import { TimerButton } from './TimerButton';

import { getAllFromProject, putItem } from '../../api/localdb';

import PresentTime from '../../models/PresentTime';
import Project from '../../models/Project';
import RoleTime from '../../models/RoleTime';


export interface DashboardProps {
  project: Project;
  updateProject: (project: Project) => void;
}

export interface DashboardState {
  clockOn: boolean;
  presentTimes: PresentTime[];
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
      clockOn: false,
      presentTimes: [],
    };

    this.setPresentTime = this.setPresentTime.bind(this);
  }

  // --------------------------------- RENDER -------------------------------

  public render() {
    if (!this.state.presentTimes.length) {
      return null;
    }

    const timeDefs = this.props.project.settings.timeDefinitions;
    const roleTime = new RoleTime(this.state.presentTimes[0].value, timeDefs);

    return <>
      <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
        {/* COUNTER */}
        <RoleTimeCounter
          onChange={this.setPresentTime}
          project={this.props.project}
          roleTime={roleTime}
          updateProject={this.props.updateProject}
        />

        {/* Counter actions */}
        <Box>
          <ClockButton
            clockOn={this.state.clockOn}
            roleTime={roleTime}
            onClick={() => this.setState({clockOn: !this.state.clockOn})}
            onClockTick={this.setPresentTime}
          />
          <TimerButton
            clockOn={this.state.clockOn}
            roleTime={roleTime}
            onTimerStart={() => this.setState({clockOn: true})}
            onTimerStop={(disableClock) => this.setState({clockOn: !disableClock})}
          />
        </Box>

        <br/>

        <DashboardEvents/>
      </Box>
    </>;
  }

  // --------------------------------- COMPONENT LIFECYCLE -------------------------------

  componentDidMount () {
    this.loadDatas();
  }

  // --------------------------------- CUSTOM FUNCTIONS -------------------------------

  /**
   * Gather all the datas we need
   */
  loadDatas() {
    getAllFromProject('presentTimes', this.props.project.id, (presentTimes: PresentTime[]) => {
      this.setState({presentTimes});
    });
  }

  /**
   * Update the value of the present time in the app and inside the DB
   * TODO: Replace full string format with timestamp format to save space in the DB
   *
   * @param roleTime  RoleTime
   */
  setPresentTime(roleTime: RoleTime) {
    const timeString = roleTime.formatToFullString();
    const presentTimes = this.state.presentTimes;
    presentTimes[0].value = timeString;
    console.log(timeString, roleTime.formatToNumber(), 'New RoleTime!');
    console.log(new RoleTime(roleTime.formatToNumber(), roleTime.timeDefinitions).formatToFullString(), 'timestamp to string check');

    putItem('presentTimes', presentTimes, (data) => {
      this.setState({presentTimes});
    });
  }
}
