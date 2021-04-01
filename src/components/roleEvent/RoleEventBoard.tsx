
import * as React from 'react';
import AddIcon from '@material-ui/icons/Add';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
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
  onRoleEventClick?: (e: RoleEvent) => void;
  onChangeTime?: (roleTime: RoleTime) => void;
  showMoreTooltip?: string;
  showMoreActive?: boolean;
  theme: any;
  types: RoleEventType[];
}

export interface RoleEventBoardState {
  eventMenu?: {event: RoleEvent, anchor: HTMLElement};
}

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
    const {eventMenu} = this.state;

    return <Paper style={{
      marginTop: 10, marginBottom: -10, marginLeft: 5, marginRight: 5,
      flexGrow: 1,
    }}>
      <List dense
        subheader={name ?
          <ListSubheader
            component="div"
            disableSticky
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

      <Menu
        anchorEl={(eventMenu || {}).anchor}
        keepMounted
        open={!!eventMenu}
        onClose={() => this.setState({eventMenu: undefined})}
        style={{
          // width: eventMenu ? eventMenu.anchor.offsetWidth : 'auto',
        }}
      >
        <MenuItem onClick={() => this.onRoleEventClick((eventMenu || {}).event as RoleEvent)}>
          Edit
        </MenuItem>
        {this.props.onChangeTime && <MenuItem
          onClick={() => this.goToEventTime(((eventMenu || {}).event as RoleEvent).start)}
        >
          Go to event start
        </MenuItem>}
        {this.props.onChangeTime && <MenuItem
          onClick={() => this.goToEventTime(((eventMenu || {}).event as RoleEvent).end + 1)}
        >
          Go to event end
        </MenuItem>}
      </Menu>
    </Paper>;
  }

  /**
   * Display a row containing basic informations about an RoleEvent
   *
   * @param e  RoleEvent
   * @param i  number
   */
  displayEventRow(e: RoleEvent, i: number) {
    return <Tooltip
      title={e.notes}
      key={this.props.name + '-event-' + e.id}
    >
      <ListItem button 
        style={{
          background: this.getEventBg(e),
          border: '1px solid ' + this.getEventColor(e),
          marginBottom: 3,
        }}
        onClick={() => this.onRoleEventClick(e)}
        onContextMenu={(ev) => {
          ev.preventDefault();
          this.setState({eventMenu: {event: e, anchor: ev.currentTarget}})
        }}
      >
        <span style={{
          position: 'absolute',
          top: 0,
          fontSize: 9,
          right: 5,
        }}>
          {this.displayEventTimeLabel(e)}
        </span>
        <ListItemText
          primaryTypographyProps={{
            variant: 'caption',
          }}
          primary={e.name}
        />
      </ListItem>
    </Tooltip>;
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

  /**
   * Return the correct event label
   *
   * TODO: Display stuff like "in a year", "in 2 minutes", etc... instead of exact date and time
   *
   * @param e  RoleEvent
   */
  displayEventTimeLabel(e: RoleEvent){
    const useStart = this.props.name === 'future'
    const roleTime = new RoleTime(useStart ? e.start : e.end, this.props.roleTime.timeDefinitions)
    return `${roleTime.formatToDateString()} ${roleTime.formatToTimeString()}`;
  }

  // --------------------------------- COMPONENT LIFECYCLE -------------------------------

  // --------------------------------- CUSTOM FUNCTIONS -------------------------------

  /**
   * Return a rgba color for a RoleEvent
   *
   * @param e  RoleEvent
   */
  getEventColor(e: RoleEvent): string {
    const type = this.props.types.find((t) => e.typeIds.indexOf(t.id) !== -1);
    const color = (type || {}).color || this.props.theme.palette.secondary.main;
    return fade(color, 0.3);
  }

  /**
   * Return the background of the roleEvent that indicates the progression of the event.
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

  onRoleEventClick(e: RoleEvent) {
    if (this.state.eventMenu) {
      this.setState(
        {eventMenu: undefined},
        () => this.props.onRoleEventClick ? this.props.onRoleEventClick(e) : null
      );
    } else if (this.props.onRoleEventClick) {
      this.props.onRoleEventClick(e);
    }
  }

  goToEventTime(time: number) {
    this.setState({
      eventMenu: undefined,
    }, () => this.props.onChangeTime ?
      this.props.onChangeTime(new RoleTime(time, this.props.roleTime.timeDefinitions))
    : null)
  }
}

export const RoleEventBoard = withTheme(RoleEventBoardPure);
