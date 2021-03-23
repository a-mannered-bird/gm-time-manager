
import * as React from 'react';

import IconButton from '@material-ui/core/IconButton';
import TimerIcon from '@material-ui/icons/Timer';
import Tooltip from '@material-ui/core/Tooltip';

import RoleTime from '../../models/RoleTime';

export interface ClockButtonProps {
  clockOn: boolean;
  roleTime: RoleTime;
  onClockTick: (roleTime: RoleTime) => void;
  onClick: () => void;
}

export interface ClockButtonState {
  clockInterval?: NodeJS.Timeout;
}

export class ClockButton extends React.Component<
  ClockButtonProps,
  ClockButtonState
> {

  public static defaultProps: Partial<ClockButtonProps> = {};

  constructor(props: ClockButtonProps) {
    super(props);

    this.state = {};
  }

  // --------------------------------- RENDER -------------------------------

  public render() {
    const {clockOn} = this.props;

    return <Tooltip
      title={!clockOn ? "Start clock" : "Stop clock"}
    >
      <IconButton
        color={clockOn ? "secondary" : "default"}
        aria-label={!clockOn ? "Start clock" : "Stop clock"}
        onClick={() => this.props.onClick()}
      >
        <TimerIcon />
      </IconButton>
    </Tooltip>;
  }

  // --------------------------------- COMPONENT LIFECYCLE -------------------------------

  componentDidUpdate(prevProps: ClockButtonProps) {
    if (prevProps.clockOn !== this.props.clockOn) {
      this.toggleClock(this.props.clockOn);
    }
  }

  componentWillUnmount() {
    if (this.state.clockInterval) {
      clearInterval(this.state.clockInterval as NodeJS.Timeout);
    }
  }

  // --------------------------------- CUSTOM FUNCTIONS -------------------------------

  /**
   * Start or stop the roletime from passing realistically 
   */
  toggleClock(toggle: boolean) {
    let clockInterval = this.state.clockInterval;

    if (toggle) {
      clockInterval = setInterval(() => {
        // Add one second to current time
        this.props.onClockTick(new RoleTime(this.props.roleTime).addRoleTime(
          new RoleTime('0/0/0/0/0/1', this.props.roleTime.timeDefinitions)
        ));
      }, 1000);
    } else if (clockInterval) {
      clearInterval(clockInterval as NodeJS.Timeout);
      clockInterval = undefined;
    }

    this.setState({clockInterval});
  }
}
