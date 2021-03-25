
import * as React from 'react';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { RoleTimeAdvancedInput } from './RoleTimeAdvancedInput';
import Modal from '../utilities/Modal';

import Project from '../../models/Project';
import RoleTime from '../../models/RoleTime';

export interface RoleTimeCounterProps {
  roleTime: RoleTime;
  onChange: (roleTime: RoleTime, clockOn?: boolean) => void;
  project: Project;
  updateProject: (project: Project) => void;
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

    this.onNewRoleTimeChange = this.onNewRoleTimeChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
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
          onChange={this.onNewRoleTimeChange}
          defaultValue={this.props.roleTime}
          changeType={this.props.project.settings.changeTimeType}
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

  componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
  }

  // --------------------------------- CUSTOM FUNCTIONS -------------------------------

  onNewRoleTimeChange(newRoleTime: RoleTime, changeTimeType?: 'absolute' | 'relative') {
    this.setState({newRoleTime}, () => {

      // Update settings for changeTimeType if it's a new value
      const project = this.props.project;
      if (changeTimeType && changeTimeType !== project.settings.changeTimeType) {
        project.settings.changeTimeType = changeTimeType;
        this.props.updateProject(project);
      }
    });
  }

  onGo() {
    this.setState({showEditModal: false}, () => this.props.onChange(this.state.newRoleTime, false));
  }

  onKeyDown(e: KeyboardEvent) {
    // Enter key trigger form 
    if (e.keyCode === 13 && this.state.showEditModal) {
      e.preventDefault();
      this.onGo();
    }
  }
}
