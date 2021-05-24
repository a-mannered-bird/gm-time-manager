
// TODO: Should create events and actions be floating action buttons?

import * as React from 'react';

import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
// import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import HistoryIcon from '@material-ui/icons/History';
import UpdateIcon from '@material-ui/icons/Update';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Modal from '../utilities/Modal';
import Tooltip from '@material-ui/core/Tooltip';
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';

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
import { sortByName } from '../../helpers/utils';

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
  showActionModal: boolean;
  showCreateEventModal: boolean;
  timeHistory: number[];
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
      showActionModal: false,
      showCreateEventModal: false,
      timeHistory: [],
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
        {this.displayActionModal(roleTime)}
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
        onTimerStart={(roleEvent) => roleEvent ?
          this.createRoleEvent(roleEvent, {clockOn: true}) :
          this.setState({clockOn: true})
        }
        onTimerStop={(disableClock) => this.setState({clockOn: !disableClock})}
        project={this.props.project}
      />
      <Tooltip
        title="Create event (Cmd/Ctrl + E)"
      >
        <IconButton
          aria-label="Create event on the fly"
          disabled={this.state.clockOn}
          onClick={() => this.setState({showCreateEventModal: true})}
        >
          <LibraryAddIcon />
        </IconButton>
      </Tooltip>
      <Tooltip
        title="Use an action (Cmd/Ctrl + A)"
      >
        <IconButton
          aria-label="Use an action"
          disabled={this.state.clockOn}
          onClick={() => this.setState({showActionModal: true})}
        >
          <VideoLibraryIcon />
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

  /**
   * Display a modal containing the form to use an action
   *
   * @param roleTime: RoleTime
   */
  displayActionModal(roleTime: RoleTime) {
    return <Modal
      open={this.state.showActionModal}
      onClose={() => this.setState({showActionModal: false})}
    ><>
      Hello World
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
          roleEventTypes: sortByName(roleEventTypes, true),
        });
      });
    });
  }

  // --------------------------------- CUSTOM FUNCTIONS -------------------------------

  onKeyDown(e: KeyboardEvent){
    // CMD/CTRL E -> Open modal to create event
    if (e.keyCode === 69 && e.metaKey && !this.state.clockOn) {
      e.preventDefault();
      this.setState({showCreateEventModal: true});

    // CMD/CTRL A -> Open modal to use action
    } else if (e.keyCode === 65 && e.metaKey && !this.state.clockOn){
      e.preventDefault();
      this.setState({showActionModal: true});      

    // CMD/CTRL K -> toggle clock
    } else if (e.keyCode === 75 && e.metaKey) {
      e.preventDefault();
      this.setState({clockOn: !this.state.clockOn});

    // TODO: Forbid when modal is on
    // CMD/CTRL Z -> go back in roleTime history
    } else if (e.keyCode === 90 && e.metaKey) {
      let {timeHistory} = this.state;
      const {length} = timeHistory;
      if (!length) { return; }
      e.preventDefault();

      const roleTime = new RoleTime(timeHistory[length - 1], this.props.project.settings.timeDefinitions);
      timeHistory.splice(length - 1);
      this.setPresentTime(roleTime, true, timeHistory)
    }
  }

  /**
   * Update the value of the present time in the app and inside the DB
   *
   * @param roleTime  RoleTime
   * @param bypassHistory  RoleTime  If set to true, it won't store the last RoleTime in history
   */
  setPresentTime(roleTime: RoleTime, bypassHistory?: boolean, history?: number[]) {
    const {project} = this.props;
    const newValue = roleTime.formatToNumber();
    if (newValue === project.dashboardTime) {
      return;
    }

    const timeHistory = history || this.state.timeHistory;;
    if (!bypassHistory) {
      timeHistory.push(project.dashboardTime);
    }

    project.dashboardTime = newValue;

    // console.log(roleTime.formatToFullString(), roleTime.formatToNumber(), 'New RoleTime!');
    // console.log(new RoleTime(roleTime.formatToNumber(), roleTime.timeDefinitions).formatToFullString(), 'timestamp to string check');

    this.setState({
      timeHistory,
    }, () => this.props.updateProject(project))
  }

  /**
   * Create new event in DB
   *
   * @param roleEvent  RoleEvent
   */
  createRoleEvent(roleEvent: RoleEvent, state: any = {}) {
    postItem('roleEvents', roleEvent, (data) => {
      const roleEvents = this.state.roleEvents;
      roleEvents.push(data.items.find((e: RoleEvent) => e.id === data.count));

      this.setState({
        roleEvents,
        roleEventsResetCount: this.state.roleEventsResetCount + 1,
        showCreateEventModal: false,
        ...state,
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
