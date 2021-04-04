
// TODO: Solve lag issues

import * as React from 'react';
import AddIcon from '@material-ui/icons/Add';
import Box from '@material-ui/core/Box';
import { ColorPicker } from 'material-ui-color';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
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

import Project from '../../models/Project';
import RoleEventType from '../../models/RoleEventType';

import { v4 as uuidv4 } from 'uuid';

export interface SettingsEventTypesProps {
  onDelete: (type: RoleEventType) => void;
  onCreate: (type: RoleEventType) => void;
  onChange: (type: RoleEventType) => void;
  project: Project;
  types: RoleEventType[];
}

export interface SettingsEventTypesState {
  orderAsc: boolean;
  // sortedTypes: RoleEventType[];
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
      orderAsc: true,
      // sortedTypes: this.sortTypes(props.types, true),
    };

    this.displayTypeItem = this.displayTypeItem.bind(this);
  }

  // --------------------------------- RENDER -------------------------------

  public render() {
    const sortedTypes = this.sortTypes(this.props.types, this.state.orderAsc);

    return <>
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
                  onClick={() => this.setState({orderAsc: !this.state.orderAsc})}
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
            {sortedTypes.map(this.displayTypeItem)}
          </TableBody>
        </Table>
      </TableContainer>
    </>;
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
          onClick={() => this.props.onDelete(t)}
        >
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  }

  // --------------------------------- COMPONENT LIFECYCLE -------------------------------

  // --------------------------------- CUSTOM FUNCTIONS -------------------------------

  onChange(t: RoleEventType, prop: string, value: any){
    const type = {...t} as any;
    type[prop] = value;
    this.props.onChange(type);
  }

  createNewType() {
    const newType = {
      id: 0,
      externalId: uuidv4(),
      projectId: this.props.project.id,
      name: '',
      color: ('#'+(Math.random()*0xFFFFFF<<0).toString(16)).toUpperCase(),
      description: '',
    } as RoleEventType;
    this.props.onCreate(newType);
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
}
