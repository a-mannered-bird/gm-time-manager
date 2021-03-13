
import * as React from 'react';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import Switch from '@material-ui/core/Switch';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import {RoleTimeInput} from './RoleTimeInput';

import RoleTime from '../../models/RoleTime';

export interface RoleTimeCounterEditProps {
  roleTime: RoleTime;
  onConfirm: (roleTime: RoleTime) => void;
  changeType: 'absolute' | 'relative';
}

export interface RoleTimeCounterEditState {
  absoluteTime: RoleTime;
  relativeTime: RoleTime;
  changeType: 'absolute' | 'relative';
}

export class RoleTimeCounterEdit extends React.Component<
  RoleTimeCounterEditProps,
  RoleTimeCounterEditState
> {

  public static defaultProps: Partial<RoleTimeCounterEditProps> = {
  };

  constructor(props: RoleTimeCounterEditProps) {
    super(props);
    this.state = {
      absoluteTime: props.roleTime,
      relativeTime: new RoleTime('0/0/0/0/0/0', props.roleTime.timeDefinitions),
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
              onChange={() => this.setState({
                changeType: changeType === 'relative' ? 'absolute' : 'relative',
              })}
            />
          </Grid>
          <Grid item>Relative</Grid>
          <Grid item>
            <Tooltip
              title={"Absolute let you set the exact date and time you want. " +
                "Relative will add or remove an amount from the current time."
              }
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
        useTimeDefinitionsForMaxMin={changeType === 'absolute'}
        onChange={this.onChangeRoleTime}
        value={roleTime}
      />

      {/* VALIDATE BUTTON */}
      <Box display="flex" flexDirection="row-reverse">
        <Button variant="contained" color="primary"
          onClick={() => this.onGo()}
        >
          Go
        </Button>
      </Box>
    </>;
  }

  // --------------------------------- COMPONENT LIFECYCLE -------------------------------

  // --------------------------------- CUSTOM FUNCTIONS -------------------------------

  private onChangeRoleTime(roleTime: RoleTime) {
    if (this.state.changeType === 'absolute'){
      this.setState({absoluteTime: roleTime});
    } else {
      this.setState({relativeTime: roleTime});
    }
  }

  private onGo() {
    const roleTime = this.state.changeType === 'relative' ?
      this.props.roleTime.addRoleTime(this.state.relativeTime) :
      this.state.absoluteTime;

    console.log(roleTime.second, this.state.absoluteTime.second);
    this.props.onConfirm(roleTime);
  }
}
