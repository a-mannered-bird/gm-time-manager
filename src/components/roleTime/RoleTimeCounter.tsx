
import * as React from 'react';

// import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { RoleTimeCounterEdit } from './RoleTimeCounterEdit';
import Modal from '../utilities/Modal';

import RoleTime from '../../models/RoleTime';

export interface RoleTimeCounterProps {
  roleTime: RoleTime;
  onChange: (roleTime: RoleTime, clockOn?: boolean) => void;
  defaultTimeType: 'relative' | 'absolute';
}

export interface RoleTimeCounterState {
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
      showEditModal: false,
    };

    this.onRoleTimeChange = this.onRoleTimeChange.bind(this);
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
      ><>
        <Typography variant="h6" component="h6" align="center">
          When to?
        </Typography>

        <RoleTimeCounterEdit
          onConfirm={this.onRoleTimeChange}
          roleTime={this.props.roleTime}
          changeType={this.props.defaultTimeType}
        />
      </></Modal>
    </>;
  }

  // --------------------------------- COMPONENT LIFECYCLE -------------------------------

  // --------------------------------- CUSTOM FUNCTIONS -------------------------------

  onRoleTimeChange(roleTime: RoleTime) {
    this.setState({showEditModal: false}, () => this.props.onChange(roleTime, false));
  }
}
