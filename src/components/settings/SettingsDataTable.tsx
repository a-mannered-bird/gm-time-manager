
// TODO: Add form validation
// TODO: Add search
// TODO: Add pagination?
// TODO: Display popup if trying to quit page while not pristine
// TODO: Work on padding a bit more
// TODO: Reduce text inputs font size
// TODO: Description should automatically get on multilines.

import * as React from 'react';

import AddIcon from '@material-ui/icons/Add';
import Box from '@material-ui/core/Box';
import Checkbox from '@material-ui/core/Checkbox';
import { ColorPicker } from 'material-ui-color';
import DeleteIcon from '@material-ui/icons/Delete';
import Fab from '@material-ui/core/Fab';
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

import { getAllFromProject } from '../../api/localdb';

import { v4 as uuidv4 } from 'uuid';

export interface TableColumn {
  label: string;
  prop: string;
  type: 'text' | 'color' | 'textarea';
}

export interface SettingsDataTableProps {
  blankObject: any;
  columns: TableColumn[];
  itemNameSingular: string;
  itemNameDb: string;
  onSave: (toCreate: any[], toEdit: any[], toDelete: any[], callback:() => void) => void;
  projectId: number;
}

export interface SettingsDataTableState {
  pristine: boolean;
  orderAsc: boolean;
  items: any[];
  itemsSelected: any[];
  itemsToCreate: any[];
  itemsToEdit: any[];
  itemsToDelete: any[];
}

export class SettingsDataTable extends React.Component<
  SettingsDataTableProps,
  SettingsDataTableState
> {

  public static defaultProps: Partial<SettingsDataTableProps> = {
  };

  constructor(props: SettingsDataTableProps) {
    super(props);

    this.state = {
      pristine: true,
      orderAsc: true,
      items: [],
      itemsSelected: [],
      itemsToCreate: [],
      itemsToEdit: [],
      itemsToDelete: [],
    };

    this.displayTableHeader = this.displayTableHeader.bind(this);
    this.displayRow = this.displayRow.bind(this);
  }

  // --------------------------------- RENDER -------------------------------

  public render() {

    return <>
      {this.displayTable()}


      <Box width="100%" display="flex" position="absolute" flexDirection="row-reverse"
        bottom="0" left="0" padding="20px"
      >
        {/* SAVE BUTTON */}
        {!this.state.pristine && <Tooltip title="Save changes">
          <Fab
            color="secondary"
            style={{marginLeft: 10}}
            onClick={() => this.saveSettings()}>
            <SaveIcon />
          </Fab>
        </Tooltip>}

        {/* ADD BUTTON */}
        <Tooltip title={`Create ${this.props.itemNameSingular}`}>
          <Fab
            color="primary"
            style={{marginLeft: 10}}
            onClick={() => this.createNewItem()}>
            <AddIcon />
          </Fab>
        </Tooltip>

        {/* DELETE BUTTON */}
        {!!this.state.itemsSelected.length && <Tooltip title="Delete selected item(s)">
          <Fab
            color="primary"
            style={{marginLeft: 10}}
            onClick={() => this.onDelete()}>
            <DeleteIcon />
          </Fab>
        </Tooltip>}
      </Box>
    </>;
  }

  displayTable() {
    return <TableContainer>
      <Table size='small'>
        <TableHead>
          <TableRow>
            <TableCell/>
            {this.props.columns.map(this.displayTableHeader)}
          </TableRow>
        </TableHead>
        <TableBody>
          {this.state.items.map(this.displayRow)}
        </TableBody>
      </Table>
    </TableContainer>
  }

  displayTableHeader(column: TableColumn, i: number) {
    return <TableCell
      key={'settings-data-table-column-' + i}
      padding="none"
    >
      {column.prop === 'name' && <TableSortLabel
        direction={this.state.orderAsc ? 'asc' : 'desc'}
        onClick={() => this.setState({
          orderAsc: !this.state.orderAsc,
          items: this.sortTypes(this.state.items, !this.state.orderAsc),
        })}
      >
        {column.label}
      </TableSortLabel>}

      {column.prop !== 'name' && column.label}
    </TableCell>
  }

  displayRow(item: any, i: number){
    const isSelected = !!this.state.itemsSelected.find((i) => i.externalId === item.externalId);

    return <TableRow
      key={`settings-data-table-row-${item.externalId}`}
    >
      <TableCell padding="checkbox" style={{padding: 0}}>
        <Checkbox
          checked={isSelected}
          onChange={() => this.toggleItemSelection(item, !isSelected)}
        />
      </TableCell>
      {this.props.columns.map((col, j) => this.displayCell(col, j, item))}
    </TableRow>
  }

  displayCell(col: TableColumn, i: number, item: any) {
    return <TableCell
      key={`settings-data-table-row-${item.externalId}-${i}`}
      padding="none"
      style={{}}
    >
      {/* Text */}
      {(col.type === 'text' || col.type === 'textarea') && <TextField
        fullWidth
        multiline={col.type === 'textarea'}
        onChange={(e) => this.onChange(item, col.prop, e.target.value)}
        placeholder={col.label}
        required
        size="small"
        style={{fontSize: 14}}
        value={item[col.prop]}
      />}

      {/* Color */}
      {col.type === 'color' && <ColorPicker
        disableTextfield
        hideTextfield
        disablePlainColor
        onChange={(color) => this.onChange(item, col.prop, color)}
        value={item[col.prop]}
      />}
    </TableCell>
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
    getAllFromProject(this.props.itemNameDb, this.props.projectId, (items) => {
      this.setState({
        items: this.sortTypes(items, this.state.orderAsc),
      });
    });
  }

  // --------------------------------- CUSTOM FUNCTIONS -------------------------------

  onChange(item: any, prop: string, value: any){
    const newItem = {...item} as any;
    newItem[prop] = value;

    let {items, itemsToEdit, itemsToCreate, pristine} = this.state;
    const i = items.findIndex((t) => t.externalId === newItem.externalId);
    items[i] = newItem;

    if (newItem.id) {
      const iEdit = itemsToEdit.findIndex((t) => t.id === newItem.id);
      if (iEdit === -1) {
        itemsToEdit.push(newItem);
      } else {
        itemsToEdit[iEdit] = newItem;
      }
      pristine = false;
    } else {
      const iCreate = itemsToCreate.findIndex((t) => t.externalId === newItem.externalId);
      itemsToCreate[iCreate] = newItem;
    }
    this.setState({items, itemsToEdit, pristine});
  }

  createNewItem() {
    let {items, itemsToCreate, pristine} = this.state;

    const newType = {
      id: 0,
      externalId: uuidv4(),
      projectId: this.props.projectId,
      ...this.props.blankObject,
    };

    itemsToCreate.push(newType);
    items.push(newType);
    pristine = false;
    this.setState({items, itemsToCreate, pristine});
  }

  toggleItemSelection(item: any, toggle: boolean) {
    let {itemsSelected} = this.state;

    if (toggle) {
      itemsSelected.push(item);
    } else {
      itemsSelected = itemsSelected.filter((i) => i.externalId !== item.externalId);
    }
    this.setState({itemsSelected});
  }

  sortTypes(items: any[], isAsc: boolean) {
    const newTypes = [...items];
    newTypes.sort((a, b) => {
      if(a.name < b.name) { return isAsc ? -1 : 1; }
      if(a.name > b.name) { return isAsc ? 1 : -1; }
      return 0;
    })
    return newTypes;
  }

  onDelete() {
    let {itemsToCreate, itemsToDelete, itemsSelected, items, pristine} = this.state;

    itemsSelected.forEach((item) => {
      if (item.id) {
        itemsToDelete.push(item);
      } else {
        itemsToCreate = itemsToCreate.filter((i) => i.externalId !== item.externalId);
      }
      items = items.filter((i) => i.externalId !== item.externalId);
    });
    pristine = false;
    this.setState({pristine, items, itemsToCreate, itemsToDelete, itemsSelected: []});
  }

  saveSettings() {
    let {itemsToCreate, itemsToEdit, itemsToDelete} = this.state;
    if (!itemsToCreate.length && !itemsToDelete && !itemsToEdit.length){
      this.setState({pristine: true});
      return;
    }

    this.props.onSave(itemsToCreate, itemsToEdit, itemsToDelete, () => {
      this.setState({
        pristine: true,
        itemsToCreate: [],
        itemsToEdit: [],
        itemsToDelete: [],
      });
    });
  }
}