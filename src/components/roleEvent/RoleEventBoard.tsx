
import * as React from 'react';
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
  onLoadMore?: () => void;
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
      <List
        dense
        onScroll={(event) =>this.onScroll(event)}
        style={{
          height: 300,
          overflowY: 'scroll',
        }}
        subheader={name ?
          <ListSubheader
            component="div"
            style={{
              background: this.props.theme.palette.background.paper,
              lineHeight: '36px',
              textAlign: 'center',
            }}
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
    const timeStyle = {position: 'absolute', top: 0, fontSize: 9, right: 5} as React.CSSProperties;

    return <Tooltip
      title={e.notes}
      key={this.props.name + '-event-' + e.id}
    >
      <ListItem button 
        className="Role-event-item"
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
        <span className="Role-event-item__absolute-time" style={timeStyle}>
          {this.displayEventTimeLabel(e)}
        </span>
        <span className="Role-event-item__relative-time" style={timeStyle}>
          {this.displayEventTimeLabel(e, true)}
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
   * Return the correct event label
   *
   * @param e  RoleEvent
   */
  displayEventTimeLabel(e: RoleEvent, isRelative?: boolean){
    const {roleTime} = this.props;
    const useStart = this.props.name === 'future'
    const timestamp = useStart ? e.start : e.end;
    if (!isRelative) {
      const eRoleTime = new RoleTime(timestamp, roleTime.timeDefinitions)
      return `${eRoleTime.formatToDateString()} ${eRoleTime.formatToTimeString()}`;
    }

    const roundWord = roleTime.calculateRelativeTime(timestamp).formatRoundWord();
    if (roundWord === 'now') { return 'ends now'; }
    switch (this.props.name) {
      case 'past':
        return 'ended ' + roundWord + ' ago';
      case 'present':
        return 'ends in ' + roundWord;
      case 'future':
        return 'starts in ' + roundWord;
    }
  }

  // --------------------------------- COMPONENT LIFECYCLE -------------------------------

  // --------------------------------- CUSTOM FUNCTIONS -------------------------------

  /**
   * Load more on scroll to bottom
   */
  onScroll(e: any) {
    const {scrollTop, scrollHeight, offsetHeight} = e.currentTarget as HTMLElement;    
    if (this.props.onLoadMore && scrollTop + offsetHeight >= scrollHeight) {
      this.props.onLoadMore();
    }
  }

  /**
   * Return a rgba color for a RoleEvent
   *
   * @param e  RoleEvent
   */
  getEventColor(e: RoleEvent): string {
    let type: RoleEventType | undefined;
    for (let i = 0; i < e.typeIds.length; i++) {
      type = this.props.types.find((t) => t.id === e.typeIds[i])
      if (type) {
        break;
      }
    }
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
