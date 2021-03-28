
// TODO: validate that the start date is not before the end date
// TODO: On submit, isAllDay will modify the resulting dates

import * as React from 'react';

import Box from '@material-ui/core/Box';
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
  project: Project;
  roleTime: RoleTime;
  roleEvent?: RoleEvent;
  roleEventTypes: RoleEventType[];
}

export interface RoleEventEditFormState {
  roleEvent: RoleEvent;
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
  }

  // --------------------------------- RENDER -------------------------------

  public render() {
    const {roleEvent} = this.state;
    const {roleTime} = this.props;

    return <>
      <Typography variant="h6" component="h6" align="center" gutterBottom>
        {this.props.roleEvent ? 'Edit event' : 'Create Event'}
      </Typography>

      {/* NAME */}
      <TextField 
        fullWidth
        label="Name"
        onChange={(e) => this.onChange('name', e.currentTarget.value)}
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
            <Checkbox checked={roleEvent.typeIds.indexOf(type.id) > -1} />
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

      <br/><br/>

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
        changeType='relative'
        defaultValue={roleTime}
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
          changeType='relative'
          changeTypeTooltip={'Absolute let you set the exact date and time you want the event to end. ' +
            'Relative let\'s you simply define the event\'s duration.'}
          defaultValue={roleTime}
          relativeTimeReference={new RoleTime(roleEvent.start, roleTime.timeDefinitions)}
          onChange={(roleTime) => this.onChange('end', roleTime.formatToNumber())}
        />
      </>}
    </>;
  }

  // --------------------------------- COMPONENT LIFECYCLE -------------------------------

  // --------------------------------- CUSTOM FUNCTIONS -------------------------------

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
}
