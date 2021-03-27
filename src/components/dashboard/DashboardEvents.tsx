
import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Typography from '@material-ui/core/Typography';

import {RoleEventBoard} from '../roleEvent/RoleEventBoard';

import { getAllFromProject } from '../../api/localdb';

import Project from '../../models/Project';
import RoleEvent from '../../models/RoleEvent';
import RoleTime from '../../models/RoleTime';

const boardNames = ['past', 'present', 'future'] as ('past'|'present'|'future')[];
const eventIncrement = 10;

export interface DashboardEventsProps {
  project: Project;
  roleTime: RoleTime;
}

export interface DashboardEventsState {
  activeBoards: string[];
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
        roleTime={this.props.roleTime}
        showMoreActive={state[name + 'EventsMore']}
      />
    </Grid>;
  }

  // --------------------------------- COMPONENT LIFECYCLE -------------------------------

  componentDidMount() {
    this.loadEvents();
  }

  componentDidUpdate(prevProps: DashboardEventsProps) {
    if (prevProps.roleTime.formatToNumber() !== this.props.roleTime.formatToNumber()) {
      this.setState(this.getEventsState(this.state.allEvents));
    }
  }

  loadEvents () {
    getAllFromProject('roleEvents', this.props.project.id, (data: RoleEvent[]) => {
      this.setState({
        allEvents: data,
        ...this.getEventsState(data),
      });
    });
  }

  getEventsState(roleEvents: RoleEvent[]) {
    // TODO: TO enhance performances, get rid of the events that were found in each time
    // Before filtering the next one
    const newState = {} as any;

    boardNames.forEach((name) => {
      const eventsData = this.filterByTime(roleEvents, name);
      newState[name + 'Events'] = eventsData.events;
      newState[name + 'EventsMore'] = eventsData.showMore;
    });

    return newState;
  }

  // --------------------------------- CUSTOM FUNCTIONS -------------------------------

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

  setEventsLimit(time: 'past' | 'present' | 'future', newLimit: number) {
    const newState = {} as any;
    newState[time + 'EventsLimit'] = newLimit;
    this.setState(newState, () => this.setState(this.getEventsState(this.state.allEvents)));
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
}
