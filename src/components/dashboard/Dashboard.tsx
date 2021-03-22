
import * as React from 'react';

import Box from '@material-ui/core/Box';
// import Typography from '@material-ui/core/Typography';

import { RoleTimeCounter } from '../roleTime/RoleTimeCounter';
import { ClockButton } from './ClockButton';

import { getAllFromProject, putItem } from '../../api/localdb';

import PresentTime from '../../models/PresentTime';
import Project from '../../models/Project';
import RoleTime from '../../models/RoleTime';


export interface DashboardProps {
  project: Project;
}

export interface DashboardState {
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
      presentTimes: [],
    };

    this.onRoleTimeChange = this.onRoleTimeChange.bind(this);
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
          onChange={this.onRoleTimeChange}
          defaultTimeType={this.props.project.settings.changeTimeType}
          roleTime={roleTime}
        />

        <Box>
          <ClockButton
            roleTime={roleTime}
            onChange={this.onRoleTimeChange}
          />
        </Box>
      </Box>
    </>;
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
    getAllFromProject('presentTimes', this.props.project.id, (presentTimes: PresentTime[]) => {
      this.setState({presentTimes});
    });
  }

  onRoleTimeChange(roleTime: RoleTime) {
    const timeString = roleTime.formatToFullString();
    const presentTimes = this.state.presentTimes;
    console.log(timeString);
    presentTimes[0].value = timeString;
    putItem('presentTimes', presentTimes, (data) => {
      this.setState({presentTimes});
    });
  }
}
