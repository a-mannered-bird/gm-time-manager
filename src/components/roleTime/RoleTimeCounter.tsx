
import * as React from 'react';

// import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import RoleTime from '../../models/RoleTime';

export interface RoleTimeCounterProps {
  roleTime: RoleTime;
}

export interface RoleTimeCounterState {}

export class RoleTimeCounter extends React.Component<
  RoleTimeCounterProps,
  RoleTimeCounterState
> {

  public static defaultProps: Partial<RoleTimeCounterProps> = {
  };

  constructor(props: RoleTimeCounterProps) {
    super(props);
    this.state = {};
  }

  // --------------------------------- RENDER -------------------------------

  public render() {
    const {dateStringLong, dateString, timeString} = this.props.roleTime;

    return <>
      <Typography variant="h6" component="h6" align="center">
        {dateStringLong} ({dateString})
        <br/>
        {timeString}
      </Typography>
    </>;
  }

  // --------------------------------- COMPONENT LIFECYCLE -------------------------------

  // --------------------------------- CUSTOM FUNCTIONS -------------------------------

}
