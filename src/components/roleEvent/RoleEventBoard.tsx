
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
import { withTheme } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';

import RoleEvent from '../../models/RoleEvent';
import RoleEventType from '../../models/RoleEventType';
import RoleTime from '../../models/RoleTime';

export interface RoleEventBoardProps {
  name?: string;
  roleEvents: RoleEvent[];
  roleTime: RoleTime;
  onClickMore?: () => void;
  showMoreTooltip?: string;
  showMoreActive?: boolean;
  theme: any;
  types: RoleEventType[];
}

export interface RoleEventBoardState {}

export class RoleEventBoardPure extends React.Component<
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
      marginTop: 10, marginBottom: -10, marginLeft: 5, marginRight: 5,
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
          <ListItemText secondary="No events found" />
        </ListItem>}
      </List>

      <Box display="flex" justifyContent="center" mb={1}>
        {this.displayMoreButton()}
      </Box>
    </Paper>;
  }

  /**
   * Display a row containing basic informations about an RoleEvent
   *
   * @param e  RoleEvent
   * @param i  number
   */
  displayEventRow(e: RoleEvent, i: number) {
    return <ListItem button 
      key={this.props.name + '-event-' + e.id}
      style={{
        background: this.getEventBg(e),
        border: '1px solid ' + this.getEventColor(e),
        marginBottom: 3,
      }}
    >
      <ListItemText
        primaryTypographyProps={{
          variant: 'caption',
        }}
        primary={e.name}
      />
    </ListItem>;
  }

  /**
   * Display button to expand more results
   */
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

  getEventColor(e: RoleEvent): string {
    const type = this.props.types.find((t) => e.typeIds.indexOf(t.id) !== -1);
    const color = (type || {}).color || this.props.theme.palette.secondary.main;
    return fade(color, 0.3);
  }

  /**
   * My function
   *
   * @param e  RoleEvent
   */
  getEventBg(e: RoleEvent): string {
    const {name, roleTime} = this.props;
    const color = this.getEventColor(e);
    
    switch (name) {
      case 'past':
        return color;
      case 'present':
        const progression = Math.round(
          (roleTime.formatToNumber() - e.start) / (e.end - e.start) * 100
        );
        return `linear-gradient(90deg, ${color} 0%, 
          ${color} ${progression}%, transparent ${progression}%)`;
    }
    return '';
  }
}

export const RoleEventBoard = withTheme(RoleEventBoardPure);
