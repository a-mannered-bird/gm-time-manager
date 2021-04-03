
import * as React from 'react';

import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
// import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import HistoryIcon from '@material-ui/icons/History';
import UpdateIcon from '@material-ui/icons/Update';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Modal from '../utilities/Modal';
import Tooltip from '@material-ui/core/Tooltip';

import { ClockButton } from './ClockButton';
import { DashboardEvents } from './DashboardEvents';
import { RoleTimeCounter } from '../roleTime/RoleTimeCounter';
import { RoleEventEditForm } from '../roleEvent/RoleEventEditForm';
import { TimerButton } from './TimerButton';

import Project from '../../models/Project';
import RoleTime from '../../models/RoleTime';
import RoleEvent from '../../models/RoleEvent';
import RoleEventType from '../../models/RoleEventType';

import { getAllFromProject, putItem, postItem, deleteItem } from '../../api/localdb';

export interface DashboardProps {
  project: Project;
  updateProject: (project: Project) => void;
}

export interface DashboardState {
  clockOn: boolean;
  firstLoadDone?: boolean;
  roleEvents: RoleEvent[];
  roleEventsResetCount: number;
  roleEventTypes: RoleEventType[];
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
      roleEvents: [],
      roleEventsResetCount: 0,
      roleEventTypes: [],
      showCreateEventModal: false,
    };

    this.onKeyDown = this.onKeyDown.bind(this);
    this.setPresentTime = this.setPresentTime.bind(this);
    this.deleteRoleEvent = this.deleteRoleEvent.bind(this);
    this.editRoleEvent = this.editRoleEvent.bind(this);
  }

  // --------------------------------- RENDER -------------------------------

  public render() {
    if (!this.state.firstLoadDone) {
      return null;
    }

    const timeDefs = this.props.project.settings.timeDefinitions;
    const roleTime = new RoleTime(this.props.project.dashboardTime, timeDefs);

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

        <DashboardEvents
          onEventEdit={this.editRoleEvent}
          onEventDelete={this.deleteRoleEvent}
          project={this.props.project}
          roleEvents={this.state.roleEvents}
          roleEventsResetCount={this.state.roleEventsResetCount}
          roleEventTypes={this.state.roleEventTypes}
          roleTime={roleTime}
          onChangeTime={this.setPresentTime}
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
        title="Create event (Cmd/Ctrl + E)"
      >
        <IconButton
          // color={clockOn ? "secondary" : "default"}
          aria-label="Create event on the fly"
          onClick={() => this.setState({showCreateEventModal: true})}
        >
          <LibraryAddIcon />
        </IconButton>
      </Tooltip>
      <Tooltip
        title="Go to previous event (Cmd/Ctrl + ←)"
      >
        <IconButton
          aria-label="Go to previous event (Cmd/Ctrl + ←)"
          onClick={() => window.dispatchEvent(new Event('goToPreviousEvent'))}
        >
          <HistoryIcon />
        </IconButton>
      </Tooltip>
      <Tooltip
        title="Go to next event (Cmd/Ctrl + →)"
      >
        <IconButton
          aria-label="Go to next event (Cmd/Ctrl + →)"
          onClick={() => window.dispatchEvent(new Event('goToNextEvent'))}
        >
          <UpdateIcon />
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
        onConfirmForm={(roleEvent) => this.createRoleEvent(roleEvent)}
        project={this.props.project}
        roleTime={roleTime}
        roleEventTypes={this.state.roleEventTypes}
      />
    </></Modal>;
  }

  // --------------------------------- COMPONENT LIFECYCLE -------------------------------

  componentDidMount() {
    this.loadDatas();

    window.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
  }

  /**
   * Gather all the datas we need
   * TODO: Add loaders?
   */
  loadDatas() {
    getAllFromProject('roleEventTypes', this.props.project.id, (roleEventTypes: RoleEventType[]) => {
      getAllFromProject('roleEvents', this.props.project.id, (roleEvents: RoleEvent[]) => {
        this.setState({
          firstLoadDone: true,
          roleEvents,
          roleEventTypes,
        });
      });
    });
  }

  // --------------------------------- CUSTOM FUNCTIONS -------------------------------

  onKeyDown(e: KeyboardEvent){
    // CMD/CTRL E
    if (e.keyCode === 69 && e.metaKey) {
      e.preventDefault();
      this.setState({showCreateEventModal: true});
    // CMD/CTRL K
    } else if (e.keyCode === 75 && e.metaKey) {
      e.preventDefault();
      this.setState({clockOn: !this.state.clockOn});
    }
  }

  /**
   * Update the value of the present time in the app and inside the DB
   *
   * @param roleTime  RoleTime
   */
  setPresentTime(roleTime: RoleTime) {
    const {project} = this.props;
    project.dashboardTime = roleTime.formatToNumber();
    // console.log(roleTime.formatToFullString(), roleTime.formatToNumber(), 'New RoleTime!');
    // console.log(new RoleTime(roleTime.formatToNumber(), roleTime.timeDefinitions).formatToFullString(), 'timestamp to string check');

    this.props.updateProject(project);
  }

  /**
   * Create new event in DB
   *
   * @param roleEvent  RoleEvent
   */
  createRoleEvent(roleEvent: RoleEvent) {
    postItem('roleEvents', roleEvent, (data) => {
      const roleEvents = this.state.roleEvents;
      roleEvents.push(data.items.find((e: RoleEvent) => e.id === data.count));

      this.setState({
        roleEvents,
        roleEventsResetCount: this.state.roleEventsResetCount + 1,
        showCreateEventModal: false,
      });
    });
  }

  /**
   * Edit one event in DB
   *
   * @param roleEvent  RoleEvent
   */
  editRoleEvent(roleEvent: RoleEvent) {
    putItem('roleEvents', roleEvent, (data) => {
      const roleEvents = this.state.roleEvents;
      const i = roleEvents.findIndex((e) => e.id === roleEvent.id);
      roleEvents[i] = roleEvent;

      this.setState({
        roleEvents,
        roleEventsResetCount: this.state.roleEventsResetCount + 1,
      });
    });
  }

  /**
   * Delete one event in DB
   *
   * @param roleEvent  RoleEvent
   */
  deleteRoleEvent(roleEvent: RoleEvent) {
    deleteItem('roleEvents', roleEvent.id, (data) => {
      const roleEvents = this.state.roleEvents.filter((e) => e.id !== roleEvent.id);

      this.setState({
        roleEvents,
        roleEventsResetCount: this.state.roleEventsResetCount + 1,
      });
    });
  }
}
