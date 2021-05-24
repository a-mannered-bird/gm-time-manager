
import * as React from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { RoleEventBoard } from '../roleEvent/RoleEventBoard';

import { getAllFromProject } from '../../api/localdb';

import Project from '../../models/Project';
import RoleEvent from '../../models/RoleEvent';
import RoleEventType from '../../models/RoleEventType';
import RoleTime from '../../models/RoleTime';

const boardNames = ['past', 'present', 'future'] as ('past'|'present'|'future')[];
const eventIncrement = 10;

export interface DashboardEventsProps {
  disableKeyboardShortcuts?: boolean;
  onChangeTime: (roleTime: RoleTime) => void;
  onEventClick: (e: RoleEvent) => void; 
  project: Project;
  roleEvents: RoleEvent[];
  roleEventsResetCount: number;
  roleEventTypes: RoleEventType[];
  roleTime: RoleTime;
}

export interface DashboardEventsState {
  activeBoards: string[];
  activeTypes: number[];
  pastEvents: RoleEvent[];
  pastEventsLimit: number;
  pastEventsMore: boolean;
  presentEvents: RoleEvent[];
  presentEventsLimit: number;
  presentEventsMore: boolean;
  futureEvents: RoleEvent[];
  futureEventsLimit: number;
  futureEventsMore: boolean;
}

export class DashboardEvents extends React.Component<
  DashboardEventsProps,
  DashboardEventsState
> {

  public static defaultProps: Partial<DashboardEventsProps> = {
  };

  constructor(props: DashboardEventsProps) {
    super(props);

    this.state = {
      activeBoards: [...boardNames],
      activeTypes: [0].concat(props.roleEventTypes.map((type) => type.id)),
      pastEvents: [],
      pastEventsLimit: eventIncrement,
      pastEventsMore: false,
      presentEvents: [],
      presentEventsLimit: Infinity,
      presentEventsMore: false,
      futureEvents: [],
      futureEventsLimit: eventIncrement,
      futureEventsMore: false,
    };

    this.displayBoard = this.displayBoard.bind(this);
    this.displayFilterCheckbox = this.displayFilterCheckbox.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  // --------------------------------- RENDER -------------------------------

  public render() {
    const {activeBoards} = this.state;

    return <>
      <Typography variant="h6" component="h6" align="center" gutterBottom>
        Event boards
      </Typography>

      {/* BOARD DISPLAY BUTTONS */}
      <Grid container direction="column" alignItems="center">
        <ButtonGroup
          color="primary"
          size="large"
        >
          {boardNames.map((name, i) => 
            <Button
              key={"eventBoard-" + i}
              size="small"
              variant={activeBoards.indexOf(name) !== -1 ? 'contained' : 'outlined'}
              onClick={(e) => this.toggleBoard(name)}
            >{name}</Button>
          )}
        </ButtonGroup>
      </Grid>

      {/* BOARDS */}
      <Grid container justify="space-around" alignItems="flex-start">
        {boardNames
          .filter((name) => activeBoards.indexOf(name) !== -1)
          .map(this.displayBoard)
        }
      </Grid>
      <br/>

      {/* EVENT FILTERS */}
      <Box display="flex" justifyContent="center" alignItems="center" flexWrap="wrap" mb={1}>
        <Box display="flex" mr={1} alignItems="center">
          <Tooltip
            title={`Tick/untick a checkbox to display/hide events of this type.
              Press Ctrl or Cmd and click a checkbox to display only events of this type.
              Do it again to display all event types.
            `}
          >
            <HelpOutlineIcon
              fontSize="small"
              style={{marginRight: 10}}
            />
          </Tooltip>
          <Typography variant="subtitle1">
            Filter events by type :
          </Typography>
        </Box>

        {this.props.roleEventTypes.map(this.displayFilterCheckbox)}

        {/* Filter for events with no categories */}
        <FormControlLabel
          control={<Checkbox
            checked={this.state.activeTypes.indexOf(0) !== -1}
            onChange={() => this.toggleTypeFilter(0)}
          />}
          label="Untyped events"
        />
      </Box>
    </>;
  }

  /**
   * Display an event board that corresponds to one period of time (past, present or future)
   *
   * @param name  string
   * @param i  number
   */
  displayBoard(name: 'past' | 'present' | 'future', i: number) {
    const state = this.state as any;

    return <Grid item
      key={'RoleEventBoard-' + name}
      xs={12}
      // @ts-ignore
      sm={12 / this.state.activeBoards.length}
    >
      <RoleEventBoard
        name={name}
        onChangeTime={this.props.onChangeTime}
        onLoadMore={() => this.setEventsLimit(name, state[name + 'EventsLimit'] + eventIncrement)}
        onRoleEventClick={this.props.onEventClick}
        roleEvents={state[name + 'Events']}
        types={this.props.roleEventTypes.filter((type) => this.state.activeTypes.indexOf(type.id) !== -1)}
        roleTime={this.props.roleTime}
        showMoreActive={state[name + 'EventsMore']}
        variant="dashboard"
      />
    </Grid>;
  }

  /**
   * Display a checkbox that allow to show or hide some types of events
   *
   * @param name  string
   * @param i  number
   */
  displayFilterCheckbox(type: RoleEventType, i: number) {
    return <Tooltip
      key={'RoleEventType-checkbox-' +  type.id}
      title={type.description}
    >
      <FormControlLabel
        control={<Checkbox
          checked={this.state.activeTypes.indexOf(type.id) !== -1}
          onChange={() => this.toggleTypeFilter(type.id)}
          style={{color: type.color}}
        />}
        label={type.name}
      />
    </Tooltip>
  }

  // --------------------------------- COMPONENT LIFECYCLE -------------------------------

  componentDidMount() {
    this.loadData();

    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('goToPreviousEvent', () => this.goToClosestEvent(false));
    window.addEventListener('goToNextEvent', () => this.goToClosestEvent(true));
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('goToPreviousEvent', () => this.goToClosestEvent(false));
    window.removeEventListener('goToNextEvent', () => this.goToClosestEvent(true));
  }

  componentDidUpdate(prevProps: DashboardEventsProps) {
    if (
      (prevProps.roleTime.formatToNumber() !== this.props.roleTime.formatToNumber()) ||
      (prevProps.roleEventsResetCount !== this.props.roleEventsResetCount)
    ) {
      this.setState({
        ...this.getEventsState(this.state.activeTypes)
      });
    }
  }

  /**
   * Load events and events types from database
   */
  loadData () {
    getAllFromProject('roleEvents', this.props.project.id, (events: RoleEvent[]) => {
      this.setState({
        ...this.getEventsState(this.state.activeTypes),
      });
    });
  }

  getEventsState(activeTypes: number[]) {
    // TODO: TO enhance performances, get rid of the events that were found in each time
    // Before filtering the next one
    const newState = {} as any;

    boardNames.forEach((time) => {
      const eventsData = this.filterByTime(this.props.roleEvents, time);
      // Filter by active type
      const events = eventsData.events.filter((e) => {
        const typeIds = !e.typeIds.length ? [0] : e.typeIds;
        return typeIds.find((typeId) => activeTypes.indexOf(typeId) !== -1) !== undefined;
      });
      newState[time + 'Events'] = events;
      newState[time + 'EventsMore'] = eventsData.showMore;
    });

    return newState;
  }

  // --------------------------------- CUSTOM FUNCTIONS -------------------------------

  /**
   * Filter, sort and then trim events from a list. Depending on the type of time
   * the events belong to (past, present or future), they will be sorted differently
   *
   * @param roleEvents  RoleEvent[]
   * @param time  string
   */
  filterByTime(roleEvents: RoleEvent[], time: 'past' | 'present' | 'future') {
    const now = this.props.roleTime.formatToNumber();
    let events: RoleEvent[] = [];

    switch (time) {
      case 'past':
        events = roleEvents.filter((e) => e.end < now)
          .sort((a, b) => b.end - a.end || b.start - a.start || b.id - a.id);
        break;
      case 'present':
        events = roleEvents.filter((e) => e.start <= now && e.end >= now)
          .sort((a, b) => a.end - b.end || a.start - b.start || b.id - a.id);
        break;
      case 'future':
        events = roleEvents.filter((e) => e.start > now)
          .sort((a, b) => a.start - b.start || a.end - b.end || b.id - a.id);
        break;
    }

    // @ts-ignore
    const max = this.state[time + 'EventsLimit'];
    const showMore = events.length > max;
    return {showMore, events: events.slice(0, max)};
  }

  /**
   * Change the max number of events that can be shown on one board
   *
   * @param time  string
   * @param newLimit  number
   */
  setEventsLimit(time: 'past' | 'present' | 'future', newLimit: number) {
    const newState = {} as any;
    newState[time + 'EventsLimit'] = newLimit;
    this.setState(newState, () => 
      this.setState(this.getEventsState(this.state.activeTypes))
    );
  }

  /**
   * Disable or enable the display of one of the board
   *
   * @param name  string
   */
  toggleBoard(name: string) {
    const activeBoards = [...this.state.activeBoards];
    const nameIndex = activeBoards.indexOf(name);
    if (nameIndex === -1) {
      activeBoards.push(name);
    } else {
      activeBoards.splice(nameIndex, 1);
    }
    
    this.setState({activeBoards});
  }

  /**
   * Toggle type filter to show and hide categories of events
   *
   * @param id  number
   */
  toggleTypeFilter(id: number) {
    const metaKeyPressed = (window.event as MouseEvent || {}).metaKey;
    let activeTypes = [...this.state.activeTypes];
    const index = activeTypes.indexOf(id);
    if (index === -1){
      if (metaKeyPressed) {
        activeTypes = [id];
      } else {
        activeTypes.push(id);
      }
    } else {
      if (metaKeyPressed && activeTypes.length > 1) {
        activeTypes = [id];
      } else if (metaKeyPressed) {
        activeTypes = [0, ...this.props.roleEventTypes.map((t) => t.id)];
      } else {
        activeTypes.splice(index, 1);
      }
    }

    this.setState({
      activeTypes,
      ...this.getEventsState(activeTypes),
    });
  }

  onKeyDown(e: KeyboardEvent){
    const {disableKeyboardShortcuts} = this.props;

    if (e.keyCode === 37 && e.metaKey && !disableKeyboardShortcuts) {
      e.preventDefault();
      this.goToClosestEvent(false);
    } else if (e.keyCode === 39 && e.metaKey && !disableKeyboardShortcuts) {
      e.preventDefault();
      this.goToClosestEvent(true);
    }
  }

  goToClosestEvent(next: boolean) {
    const {pastEvents, presentEvents, futureEvents} = this.state;

    let event: number | undefined;
    if (next) {
      if (presentEvents.length) {
        event = presentEvents[0].end + 1;
      }

      if (futureEvents.length) {
        const futureEvent = futureEvents[0].start;
        event = event === undefined || futureEvent < event ? futureEvent : event;
      }
    } else {
      if (presentEvents.length) {
        presentEvents.forEach((e, i) => {
          event = !event || event < e.start - 1 ? e.start - 1 : event;
        });
      }

      if (pastEvents.length) {
        const pastEvent = pastEvents[0].end
        event = event === undefined || pastEvent > event ? pastEvent : event
      }
    }

    if (event !== undefined) {
      this.props.onChangeTime(new RoleTime(event, this.props.roleTime.timeDefinitions));
    }
  }
}
