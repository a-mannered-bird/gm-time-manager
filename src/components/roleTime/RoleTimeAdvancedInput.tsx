
import * as React from 'react';

import Grid from '@material-ui/core/Grid';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import Switch from '@material-ui/core/Switch';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import {RoleTimeInput} from './RoleTimeInput';

import RoleTime from '../../models/RoleTime';

export interface RoleTimeAdvancedInputProps {
  changeType: 'absolute' | 'relative';
  changeTypeTooltip: string;
  defaultValue: RoleTime;
  onChange: (roleTime: RoleTime, changeType?: 'absolute' | 'relative') => void;
  timeInputFormat: 'full' | 'date' |'time';
}

export interface RoleTimeAdvancedInputState {
  absoluteTime: RoleTime;
  changeType: 'absolute' | 'relative';
  relativeTime: RoleTime;
}

export class RoleTimeAdvancedInput extends React.Component<
  RoleTimeAdvancedInputProps,
  RoleTimeAdvancedInputState
> {

  public static defaultProps: Partial<RoleTimeAdvancedInputProps> = {
    changeTypeTooltip: 'Absolute let you set the exact date and time you want. ' +
      'Relative will add or remove an amount from the current time.',
    timeInputFormat: 'full',
  };

  constructor(props: RoleTimeAdvancedInputProps) {
    super(props);
    this.state = {
      absoluteTime: props.defaultValue,
      relativeTime: new RoleTime('0/0/0/0/0/0', props.defaultValue.timeDefinitions),
      changeType: props.changeType || 'relative',
    };

    this.onChangeRoleTime = this.onChangeRoleTime.bind(this);
  }

  // --------------------------------- RENDER -------------------------------

  public render() {
    const {changeType, absoluteTime, relativeTime} = this.state;
    const roleTime = changeType === 'relative' ? relativeTime : absoluteTime;
    return <>

      {/* SWITCH ABSOLUTE / RELATIVE */}
      <Typography component="div">
        <Grid component="label" container alignItems="center">
          <Grid item>Absolute</Grid>
          <Grid item>
            <Switch
              checked={changeType === 'relative'}
              onChange={() => this.onChangeRoleTime(
                undefined, 
                changeType === 'relative' ? 'absolute' : 'relative'
              )}
            />
          </Grid>
          <Grid item>Relative</Grid>
          <Grid item>
            <Tooltip
              title={this.props.changeTypeTooltip}
            >
              <HelpOutlineIcon
                fontSize="small"
                style={{marginLeft: 10}}
              />
            </Tooltip>
          </Grid>
        </Grid>
      </Typography>

      {/* TIME INPUT */}
      <RoleTimeInput
        onChange={this.onChangeRoleTime}
        timeInputFormat={this.props.timeInputFormat}
        useTimeDefinitionsForMaxMin={changeType === 'absolute'}
        value={roleTime}
      />
    </>;
  }

  // --------------------------------- COMPONENT LIFECYCLE -------------------------------

  // --------------------------------- CUSTOM FUNCTIONS -------------------------------

  private onChangeRoleTime(roleTime?: RoleTime, changeType?: 'absolute' | 'relative') {
    changeType = changeType || this.state.changeType;
    const isAbsolute = changeType === 'absolute';
    roleTime = roleTime || (isAbsolute ? this.state.absoluteTime : this.state.relativeTime);
    this.setState({
      absoluteTime: isAbsolute ? roleTime : this.state.absoluteTime,
      changeType,
      relativeTime: !isAbsolute ? roleTime : this.state.relativeTime,
    }, () => {
      const newRoleTime = changeType === 'relative' ?
        this.props.defaultValue.addRoleTime(this.state.relativeTime) :
        this.state.absoluteTime;
      this.props.onChange(newRoleTime, changeType);
    });
  }
}
