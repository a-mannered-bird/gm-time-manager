
import * as React from 'react';

import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
// import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Modal from '../utilities/Modal';
import Tooltip from '@material-ui/core/Tooltip';

import { ClockButton } from './ClockButton';
import { DashboardEvents } from './DashboardEvents';
import { RoleTimeCounter } from '../roleTime/RoleTimeCounter';
import { RoleEventEditForm } from '../roleEvent/RoleEventEditForm';
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
  showCreateEventModal: boolean;
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
      showCreateEventModal: false,
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

        {/* ACTIONS */}
        {this.displayActions(roleTime)}

        <br/>

        <DashboardEvents
          project={this.props.project}
          roleTime={roleTime}
        />

        {this.displayCreateEventModal(roleTime)}
      </Box>
    </>;
  }

  /**
   * Display various buttons for the user to interact with the dashboard
   *
   * @param roleTime: RoleTimeCounter
   */
  displayActions(roleTime: RoleTime) {
    return <Box>
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
      <Tooltip
        title="Create event on the fly"
      >
        <IconButton
          // color={clockOn ? "secondary" : "default"}
          aria-label="Create event on the fly"
          onClick={() => this.setState({showCreateEventModal: true})}
        >
          <LibraryAddIcon />
        </IconButton>
      </Tooltip>
    </Box>;
  }

  /**
   * Display a modal containing the form to create a new event
   *
   * @param roleTime: RoleTime
   */
  displayCreateEventModal(roleTime: RoleTime) {
    return <Modal
      open={this.state.showCreateEventModal}
      onClose={() => this.setState({showCreateEventModal: false})}
    ><>
      <RoleEventEditForm
        project={this.props.project}
        roleTime={roleTime}
      />
    </></Modal>;
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
   *
   * @param roleTime  RoleTime
   */
  setPresentTime(roleTime: RoleTime) {
    const presentTimes = [...this.state.presentTimes];
    presentTimes[0].value = roleTime.formatToNumber();
    console.log(roleTime.formatToFullString(), roleTime.formatToNumber(), 'New RoleTime!');
    console.log(new RoleTime(roleTime.formatToNumber(), roleTime.timeDefinitions).formatToFullString(), 'timestamp to string check');

    putItem('presentTimes', presentTimes, (data) => {
      this.setState({presentTimes});
    });
  }
}
