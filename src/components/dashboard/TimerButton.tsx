
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
        <Typography variant="h6" component="h6" align="center">
          Set the timer to
        </Typography>

        <RoleTimeCounterEdit
          changeType={'relative'}
          onConfirm={this.setTimer}
          roleTime={this.props.roleTime}
          timeInputFormat={'time'}
        />
      </></Modal>
    </>;
  }

  // --------------------------------- COMPONENT LIFECYCLE -------------------------------

  // --------------------------------- CUSTOM FUNCTIONS -------------------------------

  private setTimer(roleTime: RoleTime) {
    this.setState({
      showEditModal: false,
      timeLimit: roleTime,
    }, () => this.props.onTimerSet());
  }
}