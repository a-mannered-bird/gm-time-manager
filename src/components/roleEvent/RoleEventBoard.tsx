
import * as React from 'react';
import AddIcon from '@material-ui/icons/Add';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';


import RoleEvent from '../../models/RoleEvent';

export interface RoleEventBoardProps {
  name?: string;
  roleEvents: RoleEvent[]
  onClickMore?: () => void;
  showMoreTooltip?: string;
  showMoreActive?: boolean;
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
          <ListSubheader
            component="div"
            color="primary"
            style={{textAlign: "center", lineHeight: '36px'}}
          >
            {name.toUpperCase()}
          </ListSubheader>
        : undefined}
      >
        {roleEvents.map(this.displayEventRow)}
        {!roleEvents.length && <ListItem>
          <ListItemText primary="No events found" />
        </ListItem>}
      </List>

      <Box display="flex" justifyContent="center" mb={1}>
        {this.displayMoreButton()}
      </Box>
    </Paper>;
  }

  displayEventRow(e: RoleEvent, i: number) {
    return <ListItem button 
      key={this.props.name + '-event-' + e.id}
    >
      <ListItemText primary={e.name} />
    </ListItem>;
  }

  displayMoreButton() {
    if (!this.props.showMoreActive) {
      return null;
    }

    return <Tooltip
      title={this.props.showMoreTooltip || 'Show more'}
    >
      <IconButton
        color="default"
        size="small"
        aria-label={this.props.showMoreTooltip || 'Show more'}
        onClick={() => this.props.onClickMore ? this.props.onClickMore() : null}
      >
        <AddIcon />
      </IconButton>
    </Tooltip>;
  }

  // --------------------------------- COMPONENT LIFECYCLE -------------------------------

  // --------------------------------- CUSTOM FUNCTIONS -------------------------------

}
