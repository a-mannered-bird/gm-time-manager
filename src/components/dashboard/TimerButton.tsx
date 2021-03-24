
import * as React from 'react';

import IconButton from '@material-ui/core/IconButton';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import { RoleTimeCounterEdit } from '../roleTime/RoleTimeCounterEdit';
import Modal from '../utilities/Modal';

import RoleTime from '../../models/RoleTime';

export interface TimerButtonProps {
  clockOn: boolean;
  roleTime: RoleTime;
  onTimerSet: () => void;
  onTimerStop?: () => void;
}

export interface TimerButtonState {
  showEditModal: boolean;
  timeLimit?: RoleTime;
}

export class TimerButton extends React.Component<
  TimerButtonProps,
  TimerButtonState
> {

  public static defaultProps: Partial<TimerButtonProps> = {
  };

  constructor(props: TimerButtonProps) {
    super(props);

    this.state = {
      showEditModal: false,
    };

    this.setTimer = this.setTimer.bind(this);
  }

  // --------------------------------- RENDER -------------------------------

  public render() {
    const {timeLimit, showEditModal} = this.state;
    const {roleTime} = this.props;

    return <>
      <Tooltip
        title={!timeLimit ? "Start a timer" : "Edit Timer"}
      >
        <IconButton
          color={timeLimit ? "secondary" : "default"}
          aria-label={!timeLimit ? "Start a timer" : "Edit Timer"}
          onClick={() => this.setState({showEditModal: !showEditModal})}
        >
          <HourglassEmptyIcon />
        </IconButton>
      </Tooltip>

      {/* EDIT MODAL */}
      <Modal
        open={this.state.showEditModal}
        onClose={() => this.setState({showEditModal: false})}
      ><>
        {timeLimit && <Typography align="center">
          Time left:
          {" "}
          {new RoleTime(
            timeLimit.formatToNumber() - roleTime.formatToNumber(),
            roleTime.timeDefinitions
          ).timeString}
        </Typography>}

        <Typography variant="h6" component="h6" align="center">
          Set the timer to
        </Typography>

        <RoleTimeCounterEdit
          changeType={'relative'}
          onConfirm={this.setTimer}
          roleTime={this.props.roleTime}
          timeInputFormat={'time'}
        />

        {/* TODO: Add option to stop clock when timer stops */}
      </></Modal>
    </>;
  }

  // --------------------------------- COMPONENT LIFECYCLE -------------------------------

  componentDidUpdate(prevProps: TimerButtonProps) {

    // If the timer has been reached
    if (
      this.state.timeLimit &&
      this.props.roleTime.formatToNumber() >= this.state.timeLimit.formatToNumber()
    ) {
      this.stopTimer()
    }
  }

  // --------------------------------- CUSTOM FUNCTIONS -------------------------------

  setTimer(roleTime: RoleTime) {
    const isPastOrPresent = roleTime.formatToNumber() <= this.props.roleTime.formatToNumber();

    this.setState({
      showEditModal: false,
      timeLimit: isPastOrPresent ? undefined : roleTime,
    }, () => !isPastOrPresent ? this.props.onTimerSet() : null);
  }

  stopTimer() {
    const audio = new Audio('/bell.mp3');
    audio.play();

    this.setState({
      timeLimit: undefined,
    }, () => this.props.onTimerStop ? this.props.onTimerStop() : null);
  }
}
