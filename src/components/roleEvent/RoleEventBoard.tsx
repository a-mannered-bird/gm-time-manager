
import * as React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Paper from '@material-ui/core/Paper';

import RoleEvent from '../../models/RoleEvent';

export interface RoleEventBoardProps {
  name?: string;
  roleEvents: RoleEvent[]
}

export interface RoleEventBoardState {}

export class RoleEventBoard extends React.Component<
  RoleEventBoardProps,
  RoleEventBoardState
> {

  public static defaultProps: Partial<RoleEventBoardProps> = {
  };

  constructor(props: RoleEventBoardProps) {
    super(props);

    this.state = {};

    this.displayEventRow = this.displayEventRow.bind(this);
  }

  // --------------------------------- RENDER -------------------------------

  public render() {
    const {name, roleEvents} = this.props;

    return <Paper style={{
      marginTop: 10, marginBottom: 10, marginLeft: 5, marginRight: 5,
      flexGrow: 1,
    }}>
      <List dense
        subheader={name ?
          <ListSubheader component="div" color="primary" style={{textAlign: "center"}}>
            {name.toUpperCase()}
          </ListSubheader>
        : undefined}
      >
        {roleEvents.map(this.displayEventRow)}
      </List>
    </Paper>;
  }

  displayEventRow(e: RoleEvent, i: number) {
    return <ListItem button
      key={this.props.name + '-event-' + e.id}
    >
      <ListItemText primary={e.name} />
    </ListItem>;
  }

  // --------------------------------- COMPONENT LIFECYCLE -------------------------------

  // --------------------------------- CUSTOM FUNCTIONS -------------------------------

}
