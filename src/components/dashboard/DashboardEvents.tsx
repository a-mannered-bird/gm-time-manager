
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

const boardNames = ['past', 'present', 'future'];

export interface DashboardEventsProps {
  project: Project;
  roleTime: RoleTime;
}

export interface DashboardEventsState {
  activeBoards: string[];
  allEvents: RoleEvent[];
  pastEvents: RoleEvent[];
  presentEvents: RoleEvent[];
  futureEvents: RoleEvent[];
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
      presentEvents: [],
      futureEvents: [],
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
    </>;
  }

  displayBoard(name: string, i: number) {
    return <RoleEventBoard
      key={'RoleEventBoard-' + name}
      // @ts-ignore
      roleEvents={this.state[name + 'Events']}
      name={name}
    />
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
    return {
      pastEvents: this.filterByTime(roleEvents, 'past'),
      presentEvents: this.filterByTime(roleEvents, 'present'),
      futureEvents: this.filterByTime(roleEvents, 'future'),
    }
  }

  // --------------------------------- CUSTOM FUNCTIONS -------------------------------

  filterByTime(roleEvents: RoleEvent[], time: 'past' | 'present' | 'future'): RoleEvent[] {
    const now = this.props.roleTime.formatToNumber();
    switch (time) {
      case 'past':
        return roleEvents.filter((e) => e.end < now);
        break;
      case 'present':
        return roleEvents.filter((e) => e.start <= now && e.end >= now);
        break;
      case 'future':
        return roleEvents.filter((e) => e.start > now);
        break;
    }
  }

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
