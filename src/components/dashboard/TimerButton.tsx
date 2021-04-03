
import * as React from 'react';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import CloseIcon from '@material-ui/icons/Close';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import { RoleTimeAdvancedInput } from '../roleTime/RoleTimeAdvancedInput';
import Modal from '../utilities/Modal';

import RoleTime from '../../models/RoleTime';
import RoleEvent from '../../models/RoleEvent';
import Project from '../../models/Project';

import { v4 as uuidv4 } from 'uuid';

export interface TimerButtonProps {
  clockOn: boolean;
  roleTime: RoleTime;
  onTimerStart: (timerEvent?: RoleEvent) => void;
  onTimerStop?: (disableClock: boolean) => void;
  project: Project;
}

export interface TimerButtonState {
  activeTimeLimit?: RoleTime;
  createEvent: boolean;
  disableClock: boolean;
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
      createEvent: true,
      disableClock: true,
      showEditModal: false,
      newTimeLimit: new RoleTime(props.roleTime),
    };

    this.onKeyDown = this.onKeyDown.bind(this);
  }

  // --------------------------------- RENDER -------------------------------

  public render() {
    const {activeTimeLimit, createEvent, disableClock, showEditModal} = this.state;
    const {roleTime} = this.props;

    return <>
      <Tooltip
        title={!activeTimeLimit ? "Start a timer (Cmd/Ctrl + I)" : "Edit Timer (Cmd/Ctrl + I)"}
      >
        <IconButton
          color={activeTimeLimit ? "secondary" : "default"}
          aria-label={!activeTimeLimit ? "Start a timer" : "Edit Timer"}
          onClick={() => this.setState({
            newTimeLimit: new RoleTime(roleTime),
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
      ><Box textAlign="left">

        {/* Timer counter */}
        {activeTimeLimit && <Typography align="left">
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

        <Typography variant="h6" component="h6" align="left">
          Set the timer to
        </Typography>

        <RoleTimeAdvancedInput
          changeType={'relative'}
          changeTypeTooltip={'Absolute will let you pick a precise hour in the day for the timer to end. ' +
            'Relative lets you pick an amount of time before the timer ends.'}
          defaultValue={roleTime}
          onChange={(newTimeLimit) => this.setState({newTimeLimit})}
          timeInputFormat="time"
        />

        <FormControlLabel control={<Checkbox
            checked={disableClock}
            onChange={() => this.setState({disableClock: !disableClock})}
            color="secondary"
          />}
          label="Disable clock on ending"
        />
        <br/>

        <FormControlLabel control={<Checkbox
            checked={createEvent}
            onChange={() => this.setState({createEvent: !createEvent})}
            color="secondary"
          />}
          label="Create event for timer"
        />

        <br/>

        {/* BUTTONS */}
        <Box display="flex" flexDirection="row-reverse">
          <Button variant="contained" color="primary" disabled={!this.validateTimer()}
            onClick={() => this.startTimer()}
          >
            Confirm
          </Button>
        </Box>

        {/* TODO: Add option to stop clock when timer stops */}
      </Box></Modal>
    </>;
  }

  // --------------------------------- COMPONENT LIFECYCLE -------------------------------

  componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
  }

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

  onKeyDown(e: KeyboardEvent) {
    // Enter key trigger form 
    if (e.keyCode === 13 && this.state.showEditModal && this.validateTimer()) {
      e.preventDefault();
      this.startTimer();
    // Cmd/Ctrl + I
    } else if (e.keyCode === 73 && e.metaKey && !e.altKey) {
      e.preventDefault();
      this.setState({showEditModal: true});
    }
  }

  /**
   * Activate the timer
   */
  startTimer() {
    const event = this.state.createEvent ? {
      id: 0,
      externalId: uuidv4(),
      projectId: this.props.project.id,
      name: 'Timer',
      notes: '',
      start: this.props.roleTime.formatToNumber(),
      end: this.state.newTimeLimit.formatToNumber(),
      typeIds: [],
    } : undefined;

    this.setState({
      showEditModal: false,
      activeTimeLimit: this.state.newTimeLimit,
    }, () => this.props.onTimerStart(event))
  }

  /**
   * Play a sound and stop the timer
   */
  stopTimer() {
    const audio = new Audio('/bell.mp3');
    audio.play();

    this.setState({
      activeTimeLimit: undefined,
      newTimeLimit: new RoleTime(this.props.roleTime),
    }, () => this.props.onTimerStop ? this.props.onTimerStop(this.state.disableClock) : null);
  }

  /**
   * Check that the time limit being set is valid.
   */
  validateTimer() {
    return this.state.newTimeLimit.formatToNumber() > this.props.roleTime.formatToNumber();
  }
}
