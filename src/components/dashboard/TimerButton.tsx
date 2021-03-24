
import * as React from 'react';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
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
  activeTimeLimit?: RoleTime;
  showEditModal: boolean;
  newTimeLimit: RoleTime;
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
      newTimeLimit: new RoleTime(props.roleTime),
    };
  }

  // --------------------------------- RENDER -------------------------------

  public render() {
    const {newTimeLimit, activeTimeLimit, showEditModal} = this.state;
    const {roleTime} = this.props;

    return <>
      <Tooltip
        title={!activeTimeLimit ? "Start a timer" : "Edit Timer"}
      >
        <IconButton
          color={activeTimeLimit ? "secondary" : "default"}
          aria-label={!activeTimeLimit ? "Start a timer" : "Edit Timer"}
          onClick={() => this.setState({
            newTimeLimit: roleTime,
            showEditModal: !showEditModal,
          })}
        >
          <HourglassEmptyIcon />
        </IconButton>
      </Tooltip>

      {/* EDIT MODAL */}
      <Modal
        open={this.state.showEditModal}
        onClose={() => this.setState({showEditModal: false})}
      ><>

        {/* Timer counter */}
        {activeTimeLimit && <Typography align="center">
          Time left:
          {" "}
          {new RoleTime(
            activeTimeLimit.formatToNumber() - roleTime.formatToNumber(),
            roleTime.timeDefinitions
          ).timeString}
          {" "}

          <Tooltip title="Cancel timer">
            <IconButton
              aria-label="Cancel timer"
              size="small"
              onClick={() => this.setState({activeTimeLimit: undefined})}
            >
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </Typography>}

        <Typography variant="h6" component="h6" align="center">
          Set the timer to
        </Typography>

        <RoleTimeAdvancedInput
          changeType={'relative'}
          defaultValue={roleTime}
          onChange={(newTimeLimit) => this.setState({newTimeLimit})}
          timeInputFormat="time"
        />

        {/* BUTTONS */}
        <Box display="flex" flexDirection="row-reverse">
          <Button variant="contained" color="primary" disabled={!this.validateTimer()}
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
      this.state.activeTimeLimit && 
      this.props.roleTime.formatToNumber() >= this.state.activeTimeLimit.formatToNumber()
    ) {
      this.stopTimer()
    }
  }

  // --------------------------------- CUSTOM FUNCTIONS -------------------------------

  /**
   * Activate the timer
   */
  startTimer() {
    this.setState({
      showEditModal: false,
      activeTimeLimit: this.state.newTimeLimit,
    }, () => this.props.onTimerStart())
  }

  /**
   * Play a sound and stop the timer
   */
  stopTimer() {
    const audio = new Audio('/bell.mp3');
    audio.play();

    this.setState({
      newTimeLimit: this.props.roleTime,
      activeTimeLimit: undefined,
    }, () => this.props.onTimerStop ? this.props.onTimerStop() : null);
  }

  validateTimer() {
    console.log(this.state.newTimeLimit.formatToNumber(), this.props.roleTime.formatToNumber());
    return this.state.newTimeLimit.formatToNumber() > this.props.roleTime.formatToNumber();
  }
}
