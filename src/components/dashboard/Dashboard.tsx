
import * as React from 'react';

import Box from '@material-ui/core/Box';
// import Typography from '@material-ui/core/Typography';

import { RoleTimeCounter } from '../roleTime/RoleTimeCounter';

import { getAllFromProject } from '../../api/localdb';

import RoleTime from '../../models/RoleTime';
import PresentTime from '../../models/PresentTime';
import Project from '../../models/Project';


export interface DashboardProps {
  project: Project;
}

export interface DashboardState {
  presentTimes: RoleTime[];
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
  }

  // --------------------------------- RENDER -------------------------------

  public render() {
    if (!this.state.presentTimes.length) {
      return null;
    }

    return <>
      <Box display="flex" alignItems="center" justifyContent="center">

        {/* COUNTER */}
        <RoleTimeCounter
          roleTime={this.state.presentTimes[0]}
        />
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
    getAllFromProject('presentTimes', this.props.project.id, (results: PresentTime[]) => {
      const timeDefs = this.props.project.settings.timeDefinitions;
      // Transform strings formats into RoleTime objects
      const presentTimes = results.map((presentTime) => {
        return new RoleTime(presentTime.value, timeDefs);
      });
      this.setState({presentTimes});
    });
  }

}
