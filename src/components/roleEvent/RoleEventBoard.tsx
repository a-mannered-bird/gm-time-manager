
import * as React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Paper from '@material-ui/core/Paper';

export interface RoleEventBoardProps {
  name?: string;
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
  }

  // --------------------------------- RENDER -------------------------------

  public render() {
    const {name} = this.props;

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
        <ListItem button>
          <ListItemText primary="Item" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Item" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Item" />
        </ListItem>
      </List>
    </Paper>;
  }

  // --------------------------------- COMPONENT LIFECYCLE -------------------------------

  // --------------------------------- CUSTOM FUNCTIONS -------------------------------

}
