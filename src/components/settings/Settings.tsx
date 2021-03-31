
/**
  TODO: Add form validation
*/

import * as React from 'react';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import SaveIcon from '@material-ui/icons/Save';
import Typography from '@material-ui/core/Typography';

import { SettingsTimeDefinitions } from './SettingsTimeDefinitions';
import { SettingsEventTypes } from './SettingsEventTypes';

import Project from '../../models/Project';
import RoleEventType from '../../models/RoleEventType';

import { getAllFromProject, putItems, postItems, deleteItems, removeItemLinks } from '../../api/localdb';

export interface SettingsProps {
  project: Project;
  updateProject: (project: Project) => void;
}

export interface SettingsState {
  pristine: boolean;
  project: Project;
  projectCached: Project;
  roleEventTypes: RoleEventType[];
  roleEventTypesToCreate: RoleEventType[];
  roleEventTypesToEdit: RoleEventType[];
  roleEventTypesToDelete: RoleEventType[];
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
      roleEventTypes: [],
      roleEventTypesToCreate: [],
      roleEventTypesToEdit: [],
      roleEventTypesToDelete: [],
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

      {/* EVENT TYPES */}
      <Paper>
        <Box p={2}>
          <SettingsEventTypes
            onCreate={(type) => this.onCreateEventType(type)}
            onChange={(type) => this.onChangeEventType(type)}
            onDelete={(type) => this.onDeleteEventType(type)}
            project={this.props.project}
            types={this.state.roleEventTypes}
          />
        </Box>
      </Paper>
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

  componentDidMount() {
    this.loadDatas();
  }

  /**
   * Gather all the datas we need
   * TODO: Add loaders?
   */
  loadDatas() {
    getAllFromProject('roleEventTypes', this.props.project.id, (roleEventTypes: RoleEventType[]) => {
      this.setState({
        roleEventTypes,
      });
    });
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
   * Handle role event type creation
   *
   * @param type  RoleEventType
   */
  onCreateEventType(type: RoleEventType) {
    let {roleEventTypes, roleEventTypesToCreate, pristine} = this.state;
    roleEventTypesToCreate.push(type);
    roleEventTypes.push(type);
    pristine = false;
    this.setState({roleEventTypes, roleEventTypesToCreate, pristine});
  }

  /**
   * Handle role event type change
   *
   * @param type  RoleEventType
   */
  onChangeEventType(type: RoleEventType) {
    let {roleEventTypes, roleEventTypesToEdit, roleEventTypesToCreate, pristine} = this.state;
    const i = roleEventTypes.findIndex((t) => t.externalId === type.externalId);
    roleEventTypes[i] = type;

    if (type.id) {
      const iEdit = roleEventTypesToEdit.findIndex((t) => t.id === type.id);
      if (iEdit === -1) {
        roleEventTypesToEdit.push(type);
      } else {
        roleEventTypesToEdit[iEdit] = type;
      }
      pristine = false;
    } else {
      const iCreate = roleEventTypesToCreate.findIndex((t) => t.externalId === type.externalId);
      roleEventTypesToCreate[iCreate] = type;
    }
    this.setState({roleEventTypes, roleEventTypesToEdit, pristine});
  }

  /**
   * Handle role event type change
   *
   * @param type  RoleEventType
   */
  onDeleteEventType(type: RoleEventType) {
    const roleEventTypesToDelete = this.state.roleEventTypesToDelete;
    let pristine = this.state.pristine;
    if (type.id) {
      roleEventTypesToDelete.push(type);
      pristine = false;
    }
    const roleEventTypes = this.state.roleEventTypes.filter((t) => t.externalId !== type.externalId);
    this.setState({pristine, roleEventTypes, roleEventTypesToDelete});
  }

  /**
   * Save settings
   */
  saveSettings() {
    const {project} = this.state;

    // TODO: add loader?
    this.updateEventTypesInDB(() => {
      this.setState({
        pristine: true,
        roleEventTypesToCreate: [],
        roleEventTypesToEdit: [],
        roleEventTypesToDelete: [],
      }, () => this.props.updateProject(project));
    });
  }

  updateEventTypesInDB(callback: () => void) {
    let {roleEventTypesToCreate, roleEventTypesToEdit, roleEventTypesToDelete} = this.state;
    if (!roleEventTypesToCreate.length && !roleEventTypesToDelete && !roleEventTypesToEdit.length){
      callback();
    }

    const convertColors = (t: any) => t.color = t.color.hex ? '#' + t.color.hex : t.color;
    roleEventTypesToCreate.forEach(convertColors);
    roleEventTypesToEdit.forEach(convertColors);

    deleteItems('roleEventTypes', roleEventTypesToDelete, () => {
      removeItemLinks('roleEvents', 'typeIds', roleEventTypesToDelete, () => {
        putItems('roleEventTypes', roleEventTypesToEdit, () => {
          postItems('roleEventTypes', roleEventTypesToCreate, () => {
            callback();
          });
        })
      })
    });
  }
}
