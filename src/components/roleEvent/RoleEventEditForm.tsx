
import * as React from 'react';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { RoleTimeAdvancedInput } from '../roleTime/RoleTimeAdvancedInput';

import Project from '../../models/Project';
import RoleEvent from '../../models/RoleEvent';
import RoleEventType from '../../models/RoleEventType';
import RoleTime from '../../models/RoleTime';

import { v4 as uuidv4 } from 'uuid';

export interface RoleEventEditFormProps {
  lockChangeType?: 'absolute' | 'relative'
  project: Project;
  roleTime: RoleTime;
  roleEvent?: RoleEvent;
  roleEventTypes: RoleEventType[];
  onConfirmForm: (roleEvent: RoleEvent) => void;
  onDelete?: (roleEvent: RoleEvent) => void;
}

export interface RoleEventEditFormState {
  roleEvent: RoleEvent;
  showErrors?: boolean;
}

export class RoleEventEditForm extends React.Component<
  RoleEventEditFormProps,
  RoleEventEditFormState
> {

  public static defaultProps: Partial<RoleEventEditFormProps> = {};

  constructor(props: RoleEventEditFormProps) {
    super(props);

    const now = props.roleTime.formatToNumber();
    this.state = {
      roleEvent: props.roleEvent ? {...props.roleEvent} : {
        id: 0,
        externalId: uuidv4(),
        projectId: props.project.id,
        name: '',
        notes: '',
        start: now,
        end: now,
        typeIds: [],
      },
    };

    this.onKeyDown = this.onKeyDown.bind(this);
  }

  // --------------------------------- RENDER -------------------------------

  public render() {
    const {roleEvent, showErrors} = this.state;
    const {roleTime, onDelete, lockChangeType} = this.props;

    return <>
      <Typography variant="h6" component="h6" align="center" gutterBottom>
        {this.props.roleEvent ? 'Edit event' : 'Create Event'}
      </Typography>

      {/* NAME */}
      <TextField
        autoFocus
        error={showErrors ? !roleEvent.name.trim() : false}
        fullWidth
        label="Name"
        onChange={(e) => this.onChange('name', e.currentTarget.value)}
        required
        value={roleEvent.name}
      />

      {/* CATEGORIES */}
      <FormControl fullWidth>
        <InputLabel id="categories">Event type</InputLabel>
        <Select
          labelId="categories"
          multiple
          value={roleEvent.typeIds}
          onChange={(e) => this.onChange('typeIds', e.target.value)}
          input={<Input />}
          renderValue={(typeIds) => (typeIds as number[])
            .map((typeId) => (this.props.roleEventTypes.find((t) => t.id === typeId) || {}).name)
            .join(', ')
          }
        >
          {this.props.roleEventTypes.map((type) => <MenuItem
            key={'roleEventType-' + type.id}
            value={type.id}
          >
            <Checkbox
              checked={roleEvent.typeIds.indexOf(type.id) > -1}
              style={{color: type.color}}
            />
            <ListItemText primary={type.name} />
          </MenuItem>)}
        </Select>
      </FormControl>

      {/* NOTES */}
      <TextField
        label="Notes"
        fullWidth
        multiline
        rowsMax={4}
        value={roleEvent.notes}
        onChange={(e) => this.onChange('notes', e.currentTarget.value)}
      />

      <br/>

      {/* IS ALL DAY CHECKBOX */}
      <FormControlLabel
        control={<Checkbox
          checked={!!roleEvent.isAllDay}
          onChange={() => this.onChange('isAllDay', !roleEvent.isAllDay)}
        />}
        label="Lasts all day"
      />

      {/* START TIME */}
      <Typography variant="h6" align="center">
        Start time
      </Typography>

      <RoleTimeAdvancedInput
        changeType={lockChangeType || (this.props.roleEvent ? 'absolute' : 'relative')}
        defaultValue={this.props.roleEvent ?
          new RoleTime(roleEvent.start, roleTime.timeDefinitions) :
          roleTime
        }
        hideToggle={!!lockChangeType}
        relativeTimeReference={roleTime}
        onChange={(roleTime) => this.onChange('start', roleTime.formatToNumber())}
        timeInputFormat={roleEvent.isAllDay ? 'date' : 'full'}
      />

      {/* END TIME */}
      {!roleEvent.isAllDay && <>
        <Typography variant="h6" align="center">
          {/* TODO: if end time is relative, replace 'End time' by 'duration' */}
          End time
        </Typography>
        <RoleTimeAdvancedInput
          changeType={lockChangeType || 'relative'}
          changeTypeTooltip={'Absolute let you set the exact date and time you want the event to end. ' +
            'Relative let\'s you simply define the event\'s duration.'}
          defaultValue={this.props.roleEvent ?
            new RoleTime(roleEvent.end, roleTime.timeDefinitions) :
            roleTime
          }
          hideToggle={!!lockChangeType}
          relativeTimeReference={new RoleTime(roleEvent.start, roleTime.timeDefinitions)}
          onChange={(roleTime) => this.onChange('end', roleTime.formatToNumber())}
        />
        {this.endDateIsValid() && <Typography
          color="error"
          variant="caption"
          align="center"
        >
            End time cannot be set before start time
        </Typography>}
      </>}

      <Box display="flex" flexDirection="row-reverse">
        {/* VALIDATE BUTTON */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => this.confirmForm()}
        >
          Submit
        </Button>

        {/* DELETE BUTTON */}
        {onDelete && <Box mr={1}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => onDelete ? onDelete(roleEvent) : null}
            >
            Delete
          </Button>
        </Box>}
      </Box>
    </>;
  }

  // --------------------------------- COMPONENT LIFECYCLE -------------------------------

  componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
  }

  // --------------------------------- CUSTOM FUNCTIONS -------------------------------

  /**
   * Handle a press of keyboard
   *
   * @param e  KeyboardEvent
   */
  onKeyDown(e: KeyboardEvent) {
    // Enter key trigger form 
    if (e.keyCode === 13) {
      e.preventDefault();
      this.confirmForm();
    }
  }

  /**
   * Change any value in the RoleEvent
   *
   * @param prop  string  property of the RoleEvent object to change
   * @param value  any  value to put in property
   */
  onChange(prop: keyof RoleEvent, value: any) {
    const roleEvent = {...this.state.roleEvent} as any;
    roleEvent[prop] = value;
    this.setState({roleEvent});
  }

  /**
   * Submit the form
   */
  confirmForm() {
    const roleEvent = {...this.state.roleEvent};

    if (
      // Validate event name
      !roleEvent.name.trim() ||
      // Validate end date
      this.endDateIsValid()
    ) {
      this.setState({showErrors: true});
      return;
    }

    // Adjust start and end of event if it's supposed to be for the whole
    if (roleEvent.isAllDay) {
      const start = new RoleTime(roleEvent.start, this.props.roleTime.timeDefinitions);
      start.beginningOfDay();
      const end = new RoleTime(roleEvent.start, this.props.roleTime.timeDefinitions);
      end.endOfDay();
      roleEvent.start = start.formatToNumber();
      roleEvent.end = end.formatToNumber();
    }

    this.props.onConfirmForm(roleEvent);
  }

  /**
   * Validate if the end date of the roleEvent is before the start date
   */
  endDateIsValid() {
    const {roleEvent} = this.state;
    return !roleEvent.isAllDay && roleEvent.end < roleEvent.start
  }
}
