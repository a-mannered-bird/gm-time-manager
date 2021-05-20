
import * as React from 'react';

import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import {SettingsDataTable} from '../settings/SettingsDataTable';

import Project from '../../models/Project';
import RoleAction from '../../models/RoleAction';

import { putItems, postItems, deleteItems, removeItemLinks } from '../../api/localdb';

export interface ActionsDashboardProps {
  project: Project;
}

export interface ActionsDashboardState {}

export class ActionsDashboard extends React.Component<
  ActionsDashboardProps,
  ActionsDashboardState
> {

  public static defaultProps: Partial<ActionsDashboardProps> = {
  };

  constructor(props: ActionsDashboardProps) {
    super(props);

    this.state = {};
  }

  // --------------------------------- RENDER -------------------------------

  public render() {
    const {project} = this.props;

    return <Paper>
      <Box p={2}>
        <Box display="flex" alignItems="center">
         <Box mr={1}>
            <Typography variant="h6">
              Actions
            </Typography>
          </Box>
        </Box>

        <br/>

        <SettingsDataTable
          blankObject={{
            description: '',
            events: [],
            name: '',
            typeIds: [],
          }}
          columns={[
            {
              label: 'Name',
              prop: 'name',
              required: true,
              type: 'text',
            },
            {
              label: 'Description',
              prop: 'description',
              required: true,
              type: 'textarea',
            },
            {
              label: 'Events',
              prop: 'events',
              type: 'eventBoard',
            },
          ]}
          itemNameDb="roleActions"
          itemNameSingular="action"
          project={project}
          onSave={this.onSave}
        />
      </Box>
    </Paper>;
  }

  // --------------------------------- COMPONENT LIFECYCLE -------------------------------

  // --------------------------------- CUSTOM FUNCTIONS -------------------------------

  onSave(toCreate: RoleAction[], toEdit: RoleAction[], toDelete: RoleAction[], callback: () => void) {
    deleteItems('roleActions', toDelete, () => {
      removeItemLinks('roleEvents', 'typeIds', toDelete, () => {
        putItems('roleActions', toEdit, () => {
          postItems('roleActions', toCreate, () => {
            callback();
          });
        })
      })
    });
  }

}
