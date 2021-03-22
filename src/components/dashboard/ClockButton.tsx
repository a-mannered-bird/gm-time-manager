
import * as React from 'react';

import IconButton from '@material-ui/core/IconButton';
import TimerIcon from '@material-ui/icons/Timer';
import Tooltip from '@material-ui/core/Tooltip';

import RoleTime from '../../models/RoleTime';

export interface ClockButtonProps {
  clockOn: boolean;
  roleTime: RoleTime;
  onChange: (roleTime: RoleTime, clockOn?: boolean) => void;
}

export interface ClockButtonState {
  clockInterval?: NodeJS.Timeout;
  clockOn: boolean;
  clockOnCached: boolean;
}

export class ClockButton extends React.Component<
  ClockButtonProps,
  ClockButtonState
> {

  public static defaultProps: Partial<ClockButtonProps> = {
  };

  constructor(props: ClockButtonProps) {
    super(props);

    this.state = {
      clockOn: props.clockOn,
      clockOnCached: props.clockOn,
    };
  }

  // --------------------------------- RENDER -------------------------------

  public render() {
    const {clockOn} = this.state;

    return <Tooltip
      title={!clockOn ? "Start clock" : "Stop clock"}
    >
      <IconButton
        color={clockOn ? "secondary" : "default"}
        aria-label={!clockOn ? "Start clock" : "Stop clock"}
        onClick={() => this.toggleClock()}
      >
        <TimerIcon />
      </IconButton>
    </Tooltip>;
  }

  // --------------------------------- COMPONENT LIFECYCLE -------------------------------

  // tslint:disable-next-line:member-ordering
  public static getDerivedStateFromProps(props: ClockButtonProps, state: ClockButtonState) {
    let {clockOn, clockInterval} = state;
    console.log(props.clockOn, state.clockOnCached);

    if (state.clockOnCached !== props.clockOn) {
      clockOn = props.clockOn;

      if (!clockOn && clockInterval) {
        clearInterval(clockInterval as NodeJS.Timeout);
        clockInterval = undefined;
      }
    }

    return {
      clockInterval,
      clockOn,
      clockOnCached: props.clockOn,
    };
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
  toggleClock() {
    let clockInterval = this.state.clockInterval;
    if (!this.state.clockOn) {
      clockInterval = setInterval(() => {
        // Add one second to current time
        this.props.onChange(new RoleTime(this.props.roleTime).addRoleTime(
          new RoleTime('0/0/0/0/0/1', this.props.roleTime.timeDefinitions)
        ), true);
      }, 1000);
    } else {
      clearInterval(clockInterval as NodeJS.Timeout);
      clockInterval = undefined;
    }

    this.setState({
      clockInterval,
      clockOn: !this.state.clockOn,
    });
  }
}
