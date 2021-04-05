
/**
  TODO: Add form validation
  TODO: Reduce latency on time definitions edition
*/

import * as React from 'react';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import SaveIcon from '@material-ui/icons/Save';
import Typography from '@material-ui/core/Typography';

import { SettingsTimeDefinitions } from './SettingsTimeDefinitions';

import Project from '../../models/Project';

import { getAllFromProject, putItems, postItems, deleteItems, removeItemLinks } from '../../api/localdb';

export interface SettingsProps {
  project: Project;
  updateProject: (project: Project) => void;
}

export interface SettingsState {
  pristine: boolean;
  project: Project;
  projectCached: Project;
}

export class Settings extends React.Component<
  SettingsProps,
  SettingsState
> {

  public static defaultProps: Partial<SettingsProps> = {
  };

  constructor(props: SettingsProps) {
    super(props);

    this.state = {
      pristine: true,
      project: props.project,
      projectCached: props.project,
    };

    this.onChangeSettings = this.onChangeSettings.bind(this);
  }

  // --------------------------------- RENDER -------------------------------

  public render() {
    return <>
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>

      {this.displaySettings()}

      {/* SAVE BUTTON */}
      <Box mt={2} display="flex" flexDirection="row-reverse">
        <Button
          variant="contained"
          color="primary"
          disabled={this.state.pristine}
          startIcon={<SaveIcon />}
          onClick={() => this.saveSettings()}
        >
          Save
        </Button>
      </Box>
    </>;
  }

  public displaySettings() {
    if (!this.state.project){
      return;
    }

    return <>
      {/* TIME DEFINITIONS */}
      <Paper>
        <Box p={2}>
          <SettingsTimeDefinitions
            project={this.state.project}
            onChangeSettings={this.onChangeSettings}
          />
        </Box>
      </Paper>

      <br/>

    </>;
  }

  // --------------------------------- COMPONENT LIFECYCLE -------------------------------

  // tslint:disable-next-line:member-ordering
  public static getDerivedStateFromProps(props: SettingsProps, state: SettingsState) {
    let {project} = state;

    if (state.projectCached !== props.project) {
      project = props.project;
    }

    return {
      project,
      projectCached: props.project,
    };
  }

  // --------------------------------- CUSTOM FUNCTIONS -------------------------------

  /**
   * Handle a change on one of the project settings
   *
   * @param e  event
   * @param settingProperty  string
   */
  onChangeSettings(e: any, settingProperty: string) {
    const project = this.state.project;
    const fieldName = e.currentTarget.name;
    const fieldNameSplit = fieldName.split(".");

    if (fieldNameSplit.length > 1) {
      project.settings[settingProperty][fieldNameSplit[0]][fieldNameSplit[1]] = e.currentTarget.value;
    } else {
      project.settings[settingProperty][fieldNameSplit[0]] = e.currentTarget.value;
    }

    this.setState({
      pristine: false,
      project,
    });
  }

  /**
   * Save settings
   */
  saveSettings() {
    const {project} = this.state;

    // TODO: add loader?
    this.setState({
      pristine: true,
    }, () => this.props.updateProject(project));
  }
}
