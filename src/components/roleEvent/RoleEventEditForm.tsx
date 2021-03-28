
// TODO: validate that the start date is not before the end date

import * as React from 'react';

import Project from '../../models/Project';
import RoleEvent from '../../models/RoleEvent';
// import RoleEventType from '../../models/RoleEventType';
import RoleTime from '../../models/RoleTime';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { RoleTimeAdvancedInput } from '../roleTime/RoleTimeAdvancedInput';

import { v4 as uuidv4 } from 'uuid';

export interface RoleEventEditFormProps {
  project: Project;
  roleTime: RoleTime;
  roleEvent?: RoleEvent;
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

      <TextField 
        label="Name"
        onChange={(e) => this.onChange('name', e.currentTarget.value)}
        value={roleEvent.name}
      />
      <br/><br/>

      <Typography variant="h6">
        Start time
      </Typography>
      <RoleTimeAdvancedInput
        changeType='relative'
        defaultValue={roleTime}
        onChange={(roleTime) => this.onChange('start', roleTime.formatToNumber())}
      />

      <Typography variant="h6">
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
