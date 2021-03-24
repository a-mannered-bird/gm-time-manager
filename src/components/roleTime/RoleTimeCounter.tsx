
import * as React from 'react';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { RoleTimeAdvancedInput } from './RoleTimeAdvancedInput';
import Modal from '../utilities/Modal';

import RoleTime from '../../models/RoleTime';

export interface RoleTimeCounterProps {
  roleTime: RoleTime;
  onChange: (roleTime: RoleTime, clockOn?: boolean) => void;
  defaultTimeType: 'relative' | 'absolute';
}

export interface RoleTimeCounterState {
  newRoleTime: RoleTime;
  showEditModal: boolean;
}

export class RoleTimeCounter extends React.Component<
  RoleTimeCounterProps,
  RoleTimeCounterState
> {

  public static defaultProps: Partial<RoleTimeCounterProps> = {
  };

  constructor(props: RoleTimeCounterProps) {
    super(props);
    this.state = {
      newRoleTime: new RoleTime(props.roleTime),
      showEditModal: false,
    };
  }

  // --------------------------------- RENDER -------------------------------

  public render() {
    const {dateStringLong, dateString, timeString} = this.props.roleTime;

    return <>
      {/* COUNTER */}
      <Button
        onClick={() => this.setState({showEditModal: !this.state.showEditModal})}
      >
        <Typography variant="h6" component="h6" align="center">
          {dateStringLong} ({dateString})
          <br/>
          {timeString}
        </Typography>
      </Button>

      {/* EDIT MODAL */}
      <Modal
        open={this.state.showEditModal}
        onClose={() => this.setState({showEditModal: false})}
      ><>
        <Typography variant="h6" component="h6" align="center">
          When to?
        </Typography>

        <RoleTimeAdvancedInput
          onChange={(newRoleTime) => this.setState({newRoleTime})}
          defaultValue={this.props.roleTime}
          changeType={this.props.defaultTimeType}
        />

        {/* VALIDATE BUTTON */}
        <Box display="flex" flexDirection="row-reverse">
          <Button variant="contained" color="primary"
            onClick={() => this.onGo()}
          >
            Go
          </Button>
        </Box>
      </></Modal>
    </>;
  }

  // --------------------------------- COMPONENT LIFECYCLE -------------------------------

  // --------------------------------- CUSTOM FUNCTIONS -------------------------------

  private onGo() {
    this.setState({showEditModal: false}, () => this.props.onChange(this.state.newRoleTime, false));
  }
}
