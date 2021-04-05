
// TODO: Add form validation

import * as React from 'react';

import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import {SettingsDataTable} from './SettingsDataTable';

import RoleEventType from '../../models/RoleEventType';

import { putItems, postItems, deleteItems, removeItemLinks } from '../../api/localdb';

export interface SettingsEventTypesProps {
  projectId: number;
}

export interface SettingsEventTypesState {}

export class SettingsEventTypes extends React.Component<
  SettingsEventTypesProps,
  SettingsEventTypesState
> {

  public static defaultProps: Partial<SettingsEventTypesProps> = {
  };

  constructor(props: SettingsEventTypesProps) {
    super(props);

    this.state = {};

    this.onSave = this.onSave.bind(this);
  }

  // --------------------------------- RENDER -------------------------------

  public render() {
    return <Paper>
      <Box p={2}>
        <Box display="flex" alignItems="center">
         <Box mr={1}>
            <Typography variant="h6">
              Event types
            </Typography>
          </Box>
        </Box>

        <br/>

        <SettingsDataTable
          blankObject={{
            name: '',
            color: ('#'+(Math.random()*0xFFFFFF<<0).toString(16)).toUpperCase(),
            description: '',
          }}
          columns={[
            {
              label: 'Name',
              prop: 'name',
              type: 'text',
            },
            {
              label: 'Color',
              prop: 'color',
              type: 'color',
            },
            {
              label: 'Description',
              prop: 'description',
              type: 'textarea',
            },
          ]}
          itemNameDb="roleEventTypes"
          itemNameSingular="event type"
          projectId={this.props.projectId}
          onSave={this.onSave}
        />
      </Box>
    </Paper>;
  }

  // --------------------------------- COMPONENT LIFECYCLE -------------------------------

  // --------------------------------- CUSTOM FUNCTIONS -------------------------------

  onSave(toCreate: RoleEventType[], toEdit: RoleEventType[], toDelete: RoleEventType[], callback: () => void) {
    const convertColors = (t: any) => t.color = t.color.hex ? '#' + t.color.hex : t.color;
    toCreate.forEach(convertColors);
    toEdit.forEach(convertColors);

    deleteItems('roleEventTypes', toDelete, () => {
      removeItemLinks('roleEvents', 'typeIds', toDelete, () => {
        putItems('roleEventTypes', toEdit, () => {
          postItems('roleEventTypes', toCreate, () => {
            callback();
          });
        })
      })
    });
  }
}
