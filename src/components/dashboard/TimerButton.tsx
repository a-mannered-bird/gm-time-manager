
import * as React from 'react';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import { RoleTimeAdvancedInput } from '../roleTime/RoleTimeAdvancedInput';
import Modal from '../utilities/Modal';

import RoleTime from '../../models/RoleTime';

export interface TimerButtonProps {
  clockOn: boolean;
  roleTime: RoleTime;
  onTimerStart: () => void;
  onTimerStop?: () => void;
}

export interface TimerButtonState {
  showEditModal: boolean;
  timeLimit?: RoleTime;
  timerOn: boolean;
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
      timerOn: false,
    };

    this.setTimer = this.setTimer.bind(this);
  }

  // --------------------------------- RENDER -------------------------------

  public render() {
    const {timeLimit, timerOn, showEditModal} = this.state;
    const {roleTime} = this.props;

    return <>
      <Tooltip
        title={!timerOn ? "Start a timer" : "Edit Timer"}
      >
        <IconButton
          color={timerOn ? "secondary" : "default"}
          aria-label={!timerOn ? "Start a timer" : "Edit Timer"}
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
        {timeLimit && timerOn && <Typography align="center">
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

        <RoleTimeAdvancedInput
          changeType={'relative'}
          defaultValue={this.props.roleTime}
          onChange={this.setTimer}
          timeInputFormat={'time'}
        />

        {/* VALIDATE BUTTON */}
        <Box display="flex" flexDirection="row-reverse">
          <Button variant="contained" color="primary" disabled={!timeLimit}
            onClick={() => this.startTimer()}
          >
            Confirm
          </Button>
        </Box>

        {/* TODO: Add option to stop clock when timer stops */}
      </></Modal>
    </>;
  }

  // --------------------------------- COMPONENT LIFECYCLE -------------------------------

  componentDidUpdate(prevProps: TimerButtonProps) {

    // If the timer has been reached
    if (
      this.state.timeLimit && this.state.timerOn && 
      this.props.roleTime.formatToNumber() >= this.state.timeLimit.formatToNumber()
    ) {
      this.stopTimer()
    }
  }

  // --------------------------------- CUSTOM FUNCTIONS -------------------------------

  /**
   * Set value of the timer through the edit modal
   *
   * @param roleTime  RoleTime
   */
  setTimer(roleTime: RoleTime) {
    const isPastOrPresent = roleTime.formatToNumber() <= this.props.roleTime.formatToNumber();

    this.setState({
      timeLimit: isPastOrPresent ? undefined : roleTime,
    });
  }

  /**
   * Activate the timer
   */
  startTimer() {
    if (!this.state.timeLimit) {
      return;
    }

    this.setState({
      showEditModal: false,
      timerOn: true,
    }, () => this.props.onTimerStart())
  }

  /**
   * Play a sound and stop the timer
   */
  stopTimer() {
    const audio = new Audio('/bell.mp3');
    audio.play();

    this.setState({
      timeLimit: undefined,
      timerOn: false,
    }, () => this.props.onTimerStop ? this.props.onTimerStop() : null);
  }
}
