
// TODO: fix events with pagination
// TODO: Add search
// TODO: Popup on route to warn user if they haven't saved their contents

import * as React from 'react';

import AddIcon from '@material-ui/icons/Add';
import Box from '@material-ui/core/Box';
import Checkbox from '@material-ui/core/Checkbox';
import DeleteIcon from '@material-ui/icons/Delete';
import Fab from '@material-ui/core/Fab';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import IconButton from '@material-ui/core/IconButton';
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
import { ColorPicker } from 'material-ui-color';

import ItemSelector from '../utilities/ItemSelector';
import Modal from '../utilities/Modal';
import Pagination from '../utilities/Pagination';
import { RoleEventBoard } from '../roleEvent/RoleEventBoard';
import { RoleEventEditForm } from '../roleEvent/RoleEventEditForm';

import Project from '../../models/Project';
import RoleEvent from '../../models/RoleEvent';
import RoleTime from '../../models/RoleTime';
import RoleEventType from '../../models/RoleEventType';

import { getAllFromProject } from '../../api/localdb';
import { duplicateArray, isArray, sortByName } from '../../helpers/utils';

import { v4 as uuidv4 } from 'uuid';

export interface TableColumn {
  label: string;
  prop: string;
  type: 'text' | 'color' | 'textarea' | 'eventBoard' | 'roleEventTypes';
  required?: boolean;
}

export interface SettingsDataTableProps {
  blankObject: any;
  columns: TableColumn[];
  itemNameSingular: string;
  itemNameDb: string;
  itemsPerPage: number;
  onSave: (toCreate: any[], toEdit: any[], toDelete: any[], callback:() => void) => void;
  project: Project;
  roleTime?: RoleTime;
}

export interface SettingsDataTableState {
  hasEvents: boolean;
  items: any[];
  itemsSelected: any[];
  itemsToCreate: any[];
  itemsToDelete: any[];
  itemsToEdit: any[];
  orderAsc: boolean;
  selectedPage: number;
  pristine: boolean;
  eventToEdit?: RoleEvent;
  eventToEditParentIndex?: number;
  roleEventTypes: RoleEventType[];
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
      hasEvents: !!props.columns.find((col) =>
        ['eventBoard', 'roleEventTypes'].indexOf(col.type) !== -1
      ),
      items: [],
      itemsSelected: [],
      itemsToCreate: [],
      itemsToDelete: [],
      itemsToEdit: [],
      orderAsc: true,
      selectedPage: 0,
      pristine: true,
      roleEventTypes: [],
    };

    this.displayTableHeader = this.displayTableHeader.bind(this);
    this.displayRow = this.displayRow.bind(this);
  }

  // --------------------------------- RENDER -------------------------------

  public render() {
    return <>

      <Pagination
        pageCount={Math.ceil(this.state.items.length / this.props.itemsPerPage)}
        onPageChange={(selectedPage) => this.setState({selectedPage})}
        selectedPage={this.state.selectedPage}
      />

      <br/>

      {this.displayTable()}

      {this.state.hasEvents && this.displayCreateEventModal()}

      {this.displayButtons()}
    </>
  }

  displayTable() {
    const indexMin = this.state.selectedPage * this.props.itemsPerPage
    const indexMax = (this.state.selectedPage + 1) * this.props.itemsPerPage
    const pageItems = this.state.items.filter((item, i) => {
      return i >= indexMin && i < indexMax
    })

    return <TableContainer>
      <Table size='small'>
        <TableHead>
          <TableRow>
            <TableCell/>
            {this.props.columns.map(this.displayTableHeader)}
          </TableRow>
        </TableHead>
        <TableBody>
          {pageItems.map(this.displayRow)}
        </TableBody>
      </Table>
    </TableContainer>
  }

  displayTableHeader(column: TableColumn, i: number) {
    return <TableCell
      key={'settings-data-table-column-' + i}
      style={{width: column.prop === 'color' ? "1px" : undefined}}
    >
      {column.prop === 'name' && <TableSortLabel
        direction={this.state.orderAsc ? 'asc' : 'desc'}
        onClick={() => this.setState({
          orderAsc: !this.state.orderAsc,
          items: sortByName(this.state.items, !this.state.orderAsc),
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
      {this.props.columns.map((col, j) => this.displayCell(col, j, item, i))}
    </TableRow>
  }

  displayCell(col: TableColumn, i: number, item: any, itemI: number) {
    return <TableCell
      key={`settings-data-table-row-${item.externalId}-${i}`}
    >
      {/* Text */}
      {(col.type === 'text' || col.type === 'textarea') && <TextField
        error={this.hasError(col, item[col.prop])}
        fullWidth
        multiline={col.type === 'textarea'}
        onChange={(e) => this.onChange(item, col.prop, e.target.value)}
        placeholder={col.label}
        required={col.required}
        size="small"
        style={{
          fontSize: 14,
          minWidth: col.type === 'textarea' ? 200 : 100,
        }}
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

      {/* Select propItems */}
      {['roleEventTypes'].indexOf(col.type) !== -1 && <ItemSelector
        hasColor
        items={this.state.roleEventTypes}
        value={item[col.prop]}
        onChange={(e) => this.onChange(item, col.prop, e.target.value)}
      />}

      {/* Event Board */}
      {col.type === 'eventBoard' && <Box
        alignItems="center"
        display="flex"
        minWidth="250px"
        flexDirection="column"
      >
        <Box width="100%">
          <RoleEventBoard
            onRoleEventClick={(e) => this.setState({
              eventToEditParentIndex: itemI,
              eventToEdit: e,
            })}
            roleEvents={item[col.prop]}
            roleTime={this.props.roleTime}
            types={this.state.roleEventTypes}
            variant="settings"
          />
        </Box>

        <Tooltip title="Add an event">
          <IconButton
            aria-label="Add an event to the action"
            onClick={() => this.setState({eventToEditParentIndex: itemI})}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Box>}
    </TableCell>
  }

  /**
   * Display a modal containing the form to create a new event
   */
  displayCreateEventModal() {
    const {project} = this.props;
    const {eventToEditParentIndex, eventToEdit} = this.state;

    return <Modal
      open={eventToEditParentIndex !== undefined}
      onClose={() => this.setState({
        eventToEdit: undefined,
        eventToEditParentIndex: undefined,
      })}
    ><>
      <RoleEventEditForm
        lockChangeType="relative"
        onConfirmForm={(roleEvent) => this.saveEvent(roleEvent)}
        onDelete={eventToEdit ? (roleEvent) => this.saveEvent(roleEvent, true) : undefined}
        preventNegative={true}
        project={project}
        roleEvent={eventToEdit}
        roleEventTypes={this.state.roleEventTypes}
        roleTime={this.props.roleTime}
      />
    </></Modal>;
  }

  /**
   * Display a floating bar of buttons
   */
  displayButtons() {
    const hasError = !this.validateAllItems();
    const hasSelection = !!this.state.itemsSelected.length;

    return <Box display="flex" position="fixed" flexDirection="row-reverse"
        bottom="0" right="0" padding="20px"
      >
      {/* ADD BUTTON */}
      <Tooltip title={`Create ${this.props.itemNameSingular}`}>
        <Fab
          color="primary"
          style={{marginLeft: 10}}
          onClick={() => this.createNewItems()}>
          <AddIcon />
        </Fab>
      </Tooltip>

      {/* DELETE BUTTON */}
      {hasSelection && <Tooltip title="Delete selected item(s)">
        <Fab
          color="primary"
          style={{marginLeft: 10}}
          onClick={() => this.onDelete()}>
          <DeleteIcon />
        </Fab>
      </Tooltip>}

      {/* DUPLICATE BUTTON */}
      {hasSelection && <Tooltip title="Duplicate selected item(s)">
        <Fab
          color="primary"
          style={{marginLeft: 10}}
          onClick={() => this.onDuplicate()}>
          <FileCopyIcon />
        </Fab>
      </Tooltip>}

      {/* SAVE BUTTON */}
      {!this.state.pristine && <Tooltip
        title={hasError ? `You need to fix errors before being able to save` : `Save changes`}
      ><span>
        <Fab
          color="secondary"
          disabled={hasError}
          style={{marginLeft: 10}}
          onClick={() => this.saveSettings()}>
          <SaveIcon />
        </Fab>
      </span></Tooltip>}
    </Box>
  }

  // --------------------------------- COMPONENT LIFECYCLE -------------------------------

  componentDidMount() {
    this.loadDatas();

    /*
      The event listener below will ask the user for confirmation when he tries to leave
      close the page without saving his changes first.
    */
    window.onbeforeunload = (e: any) => {
      if (!this.state.pristine) {
        e.preventDefault();
        e.returnValue = '';
        return;
      }
      delete e['returnValue'];
    };
  }

  /**
   * Gather all the datas we need
   * TODO: Add loaders?
   */
  loadDatas() {
    const {project, itemNameDb} = this.props;
    const {orderAsc, hasEvents} = this.state;
    const newState = {} as any;

    getAllFromProject(itemNameDb, project.id, (items) => {
      newState.items = sortByName(items, orderAsc);
      if (!hasEvents) {
        this.setState(newState);
      } else {
        getAllFromProject('roleEventTypes', project.id, (roleEventTypes: RoleEventType[]) => {
          newState.roleEventTypes = roleEventTypes;
          this.setState(newState);
        })
      }
    });
  }

  // --------------------------------- CUSTOM FUNCTIONS -------------------------------

  hasError(col: TableColumn, value: any){
    if (this.state.pristine) {
      return false;
    }

    if (col.required && !value) {
      return true;
    }
  }

  validateAllItems(){
    const cols = this.props.columns;
    const items = this.state.items;
    for (let i = 0; i < cols.length; i++) {
      if (!cols[i].required) {
        continue;
      }

      if (cols[i].required) {
        for (let j = 0; j < items.length; j++) {
          if (!items[j][cols[i].prop]) {
            return false;
          }
        }
      }
    }
    return true;
  }

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

  createNewItems(itemsToDuplicate?: any[]) {
    let {items, itemsToCreate, pristine} = this.state;

    const newItems = (itemsToDuplicate || [this.props.blankObject]).map((i) => {
      const newItem = {
        ...i,
        id: 0,
        externalId: uuidv4(),
        projectId: this.props.project.id,
      }

      // This fixes the mutation of the blank object when adding new items in arrays
      for (let prop in newItem) {
        if (isArray(newItem[prop])) {
          newItem[prop] = duplicateArray(newItem[prop])
        }
      }

      return newItem;
    });

    itemsToCreate = itemsToCreate.concat(newItems);
    items = items.concat(newItems);
    pristine = false;
    const selectedPage = Math.ceil(items.length / this.props.itemsPerPage) - 1;
    this.setState({items, itemsToCreate, pristine, selectedPage});
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

  onDelete() {
    let {itemsToCreate, itemsToDelete, itemsSelected, items, pristine, selectedPage} = this.state;

    itemsSelected.forEach((item) => {
      if (item.id) {
        itemsToDelete.push(item);
      } else {
        itemsToCreate = itemsToCreate.filter((i) => i.externalId !== item.externalId);
      }
      items = items.filter((i) => i.externalId !== item.externalId);
    });
    pristine = false;
    const maxNewPage = Math.ceil(items.length / this.props.itemsPerPage) - 1;
    this.setState({
      pristine, items, itemsToCreate, itemsToDelete,
      itemsSelected: [],
      selectedPage: selectedPage > maxNewPage ? maxNewPage : selectedPage,
    });
  }

  onDuplicate() {
    let {itemsSelected} = this.state;
    this.createNewItems(itemsSelected);
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

  saveEvent(roleEvent: RoleEvent, deleteEvent?: boolean) {
    const {eventToEditParentIndex, items} = this.state;
    if (eventToEditParentIndex === undefined) {
      return;
    }

    const index = this.state.selectedPage * this.props.itemsPerPage + eventToEditParentIndex
    const item = items[index];
    const events = item.events as RoleEvent[];
    const isNew = roleEvent.id === 0;
    const i = isNew ? events.length + 1 : roleEvent.id - 1;

    if (isNew) {
      roleEvent.id = i;
      events.push(roleEvent);
    } else if (!deleteEvent){
      events[i] = roleEvent;
    } else {
      events.splice(i, 1);
      for (let j = i; j < events.length; j++) {
        events[j].id = events[j].id - 1;
      }
    }

    this.setState({
      eventToEdit: undefined,
      eventToEditParentIndex: undefined,
    }, () => this.onChange(item, 'events', events))
  }
}
