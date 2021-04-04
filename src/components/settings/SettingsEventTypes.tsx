
// TODO: Make table into reusable component for actions

import * as React from 'react';

import AddIcon from '@material-ui/icons/Add';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button'
import { ColorPicker } from 'material-ui-color';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import SaveIcon from '@material-ui/icons/Save';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import RoleEventType from '../../models/RoleEventType';

import { getAllFromProject, putItems, postItems, deleteItems, removeItemLinks } from '../../api/localdb';

import { v4 as uuidv4 } from 'uuid';

export interface SettingsEventTypesProps {
  projectId: number;
}

export interface SettingsEventTypesState {
  pristine: boolean;
  orderAsc: boolean;
  types: RoleEventType[];
  typesToCreate: RoleEventType[];
  typesToEdit: RoleEventType[];
  typesToDelete: RoleEventType[];
}

export class SettingsEventTypes extends React.Component<
  SettingsEventTypesProps,
  SettingsEventTypesState
> {

  public static defaultProps: Partial<SettingsEventTypesProps> = {
  };

  constructor(props: SettingsEventTypesProps) {
    super(props);

    this.state = {
      pristine: true,
      orderAsc: true,
      types: [],
      typesToCreate: [],
      typesToEdit: [],
      typesToDelete: [],
    };

    this.displayTypeItem = this.displayTypeItem.bind(this);
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
          <Tooltip title="Add event type">
            <IconButton
              onClick={() => this.createNewType()}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <TableContainer>
          <Table size='small'>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    direction={this.state.orderAsc ? 'asc' : 'desc'}
                    onClick={() => this.setState({
                      orderAsc: !this.state.orderAsc,
                      types: this.sortTypes(this.state.types, !this.state.orderAsc),
                    })}
                  >
                    Name
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  Color
                </TableCell>
                <TableCell align="right">
                  Delete
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.types.map(this.displayTypeItem)}
            </TableBody>
          </Table>
        </TableContainer>

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
      </Box>
    </Paper>;
  }

  displayTypeItem(t: RoleEventType, i: number){
    return <TableRow
      key={`event-type-${t.externalId}`}
    >
      <TableCell component="th" scope="row" padding="none">
        <TextField
          fullWidth
          onChange={(e) => this.onChange(t, 'name', e.target.value)}
          placeholder="Type name"
          required
          value={t.name}
        />
      </TableCell>
      <TableCell>
        <ColorPicker
          disablePlainColor
          onChange={(color) => this.onChange(t, 'color', color)}
          value={t.color}
        />
      </TableCell>
      <TableCell align="right">
        <IconButton
          onClick={() => this.onDelete(t)}
        >
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  }

  // --------------------------------- COMPONENT LIFECYCLE -------------------------------

  componentDidMount() {
    this.loadDatas();
  }

  /**
   * Gather all the datas we need
   * TODO: Add loaders?
   */
  loadDatas() {
    getAllFromProject('roleEventTypes', this.props.projectId, (types: RoleEventType[]) => {
      this.setState({
        types: this.sortTypes(types, this.state.orderAsc),
      });
    });
  }

  // --------------------------------- CUSTOM FUNCTIONS -------------------------------

  onChange(t: RoleEventType, prop: string, value: any){
    const type = {...t} as any;
    type[prop] = value;

    let {types, typesToEdit, typesToCreate, pristine} = this.state;
    const i = types.findIndex((t) => t.externalId === type.externalId);
    types[i] = type;

    if (type.id) {
      const iEdit = typesToEdit.findIndex((t) => t.id === type.id);
      if (iEdit === -1) {
        typesToEdit.push(type);
      } else {
        typesToEdit[iEdit] = type;
      }
      pristine = false;
    } else {
      const iCreate = typesToCreate.findIndex((t) => t.externalId === type.externalId);
      typesToCreate[iCreate] = type;
    }
    this.setState({types, typesToEdit, pristine});
  }

  createNewType() {
    let {types, typesToCreate, pristine} = this.state;

    const newType = {
      id: 0,
      externalId: uuidv4(),
      projectId: this.props.projectId,
      name: '',
      color: ('#'+(Math.random()*0xFFFFFF<<0).toString(16)).toUpperCase(),
      description: '',
    } as RoleEventType;

    typesToCreate.push(newType);
    types.push(newType);
    pristine = false;
    this.setState({types, typesToCreate, pristine});
  }

  sortTypes(types: RoleEventType[], isAsc: boolean) {
    const newTypes = [...types];
    newTypes.sort((a, b) => {
      if(a.name < b.name) { return isAsc ? -1 : 1; }
      if(a.name > b.name) { return isAsc ? 1 : -1; }
      return 0;
    })
    return newTypes;
  }

  /**
   * Handle role event type change
   *
   * @param type  RoleEventType
   */
  onDelete(type: RoleEventType) {
    const typesToDelete = this.state.typesToDelete;
    let pristine = this.state.pristine;
    if (type.id) {
      typesToDelete.push(type);
      pristine = false;
    }
    const types = this.state.types.filter((t) => t.externalId !== type.externalId);
    this.setState({pristine, types, typesToDelete});
  }

  /**
   * Save settings
   */
  saveSettings() {
    // TODO: add loader?
    this.updateEventTypesInDB(() => {
      this.setState({
        pristine: true,
        typesToCreate: [],
        typesToEdit: [],
        typesToDelete: [],
      });
    });
  }

  updateEventTypesInDB(callback: () => void) {
    let {typesToCreate, typesToEdit, typesToDelete} = this.state;
    if (!typesToCreate.length && !typesToDelete && !typesToEdit.length){
      callback();
    }

    const convertColors = (t: any) => t.color = t.color.hex ? '#' + t.color.hex : t.color;
    typesToCreate.forEach(convertColors);
    typesToEdit.forEach(convertColors);

    deleteItems('roleEventTypes', typesToDelete, () => {
      removeItemLinks('roleEvents', 'typeIds', typesToDelete, () => {
        putItems('roleEventTypes', typesToEdit, () => {
          postItems('roleEventTypes', typesToCreate, () => {
            callback();
          });
        })
      })
    });
  }
}
