
// TODO: Display events with no categories

import * as React from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import {RoleEventBoard} from '../roleEvent/RoleEventBoard';

import { getAllFromProject } from '../../api/localdb';

import Project from '../../models/Project';
import RoleEvent from '../../models/RoleEvent';
import RoleEventType from '../../models/RoleEventType';
import RoleTime from '../../models/RoleTime';

const boardNames = ['past', 'present', 'future'] as ('past'|'present'|'future')[];
const eventIncrement = 10;

export interface DashboardEventsProps {
  project: Project;
  roleTime: RoleTime;
  roleEventTypes: RoleEventType[];
}

export interface DashboardEventsState {
  activeBoards: string[];
  activeTypes: number[];
  allEvents: RoleEvent[];
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
      activeTypes: [],
      allEvents: [],
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
  }

  // --------------------------------- RENDER -------------------------------

  public render() {
    const {activeBoards} = this.state;

    return <>
      <Typography variant="h6" component="h6" align="center" gutterBottom>
        Event boards
      </Typography>

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

      <Grid container justify="space-around" alignItems="flex-start">
        {boardNames
          .filter((name) => activeBoards.indexOf(name) !== -1)
          .map(this.displayBoard)
        }
      </Grid>
      <br/>

      <Box display="flex" justifyContent="center" alignItems="center" mb={1}>
        <Box mr={1}>
          <Typography variant="subtitle1">
            Filter events by type :
          </Typography>
        </Box>
        {this.props.roleEventTypes.map(this.displayFilterCheckbox)}
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
      xs={12}
      // @ts-ignore
      sm={12 / this.state.activeBoards.length}
      key={'RoleEventBoard-' + name}
    >
      <RoleEventBoard
        name={name}
        onClickMore={() => this.setEventsLimit(name, state[name + 'EventsLimit'] + eventIncrement)}
        roleEvents={state[name + 'Events']}
        types={this.props.roleEventTypes.filter((type) => this.state.activeTypes.indexOf(type.id) !== -1)}
        roleTime={this.props.roleTime}
        showMoreActive={state[name + 'EventsMore']}
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
    return <FormControlLabel
      key={'RoleEventType-checkbox-' +  type.id}
      control={<Checkbox
        checked={this.state.activeTypes.indexOf(type.id) !== -1}
        onChange={() => this.toggleTypeFilter(type.id)}
        style={{color: type.color}}
      />}
      label={type.name}
    />
  }

  // --------------------------------- COMPONENT LIFECYCLE -------------------------------

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps: DashboardEventsProps) {
    if (prevProps.roleTime.formatToNumber() !== this.props.roleTime.formatToNumber()) {
      this.setState(this.getEventsState(this.state.allEvents, this.state.activeTypes));
    }
  }

  /**
   * Load events and events types from database
   */
  loadData () {
    getAllFromProject('roleEvents', this.props.project.id, (events: RoleEvent[]) => {
      const activeTypes = this.props.roleEventTypes.map((type) => type.id);
      this.setState({
        activeTypes,
        allEvents: events,
        ...this.getEventsState(events, activeTypes),
      });
    });
  }

  getEventsState(roleEvents: RoleEvent[], activeTypes: number[]) {
    // TODO: TO enhance performances, get rid of the events that were found in each time
    // Before filtering the next one
    const newState = {} as any;

    boardNames.forEach((name) => {
      const eventsData = this.filterByTime(roleEvents, name);
      // Filter by active type
      const events = eventsData.events.filter((e) => {
        return !!e.typeIds.find((typeId) => activeTypes.indexOf(typeId) !== -1);
      });
      newState[name + 'Events'] = events;
      newState[name + 'EventsMore'] = eventsData.showMore;
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
          .sort((a, b) => b.end - a.end || b.start - a.start);
        break;
      case 'present':
        events = roleEvents.filter((e) => e.start <= now && e.end >= now)
          .sort((a, b) => a.end - b.end || a.start - b.start);
        break;
      case 'future':
        events = roleEvents.filter((e) => e.start > now)
          .sort((a, b) => a.start - b.start || a.end - b.end);
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
      this.setState(this.getEventsState(this.state.allEvents, this.state.activeTypes))
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
    const activeTypes = [...this.state.activeTypes];
    const index = activeTypes.indexOf(id);
    if (index === -1){
      activeTypes.push(id);
    } else {
      activeTypes.splice(index, 1);
    }

    this.setState({
      activeTypes,
      ...this.getEventsState(this.state.allEvents, activeTypes),
    });
  }
}
