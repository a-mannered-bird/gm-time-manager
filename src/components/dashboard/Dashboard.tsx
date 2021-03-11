
import * as React from 'react';

import Box from '@material-ui/core/Box';
// import Typography from '@material-ui/core/Typography';

import { MomentCounter } from '../moment/MomentCounter';

import { getAllFromProject } from '../../api/localdb';

import Moment from '../../models/Moment';
import Project from '../../models/Project';


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

    return <>
      <Box display="flex" alignItems="center" justifyContent="center">

        {/* COUNTER */}
        <MomentCounter
          timeDefinitions={this.props.project.settings.timeDefinitions}
          moment={this.state.presentMoments[0]}
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
    getAllFromProject('presentMoments', this.props.project.id, (presentMoments: Moment[]) => {
      this.setState({
        presentMoments,
      });
    });
  }

}
