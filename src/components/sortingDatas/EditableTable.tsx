
import * as React from 'react';

import MaterialTable from 'material-table';
import tableIcons from '../../helpers/materialTableIcons';

export interface EditableTableProps {
  // categories: any[];
  itemType: {
    itemName: string;
    singular: string;
    plural: string;
  };
  items: any[];
  onAdd: any;
  onClick?: any;
  onEdit: any;
  onRemove: any;
  // onCategorize?: any;
  searchable?: boolean;
  sortingCategories?: any[];
}

export interface EditableTableState {}

export class EditableTable extends React.Component<
  EditableTableProps,
  EditableTableState
> {

  public static defaultProps: Partial<EditableTableProps> = {
    searchable: true,
  };

  constructor(props: EditableTableProps) {
    super(props);

    this.state = {};
  }

  // --------------------------------- RENDER -------------------------------

  public render() {
    const columns = this.getColumns();
    // @ts-ignore
    return <MaterialTable icons={tableIcons}
      title={this.props.itemType.plural}
      columns={columns}
      data={this.props.items}
      options={{
        actionsColumnIndex: columns.length,
        pageSize: 10,
        pageSizeOptions: [10, 25, 50, 100],
        search: this.props.searchable,
        sorting: true,
      }}
      actions={this.getActions()}
      editable={{
        onRowAdd: (newData) => new Promise((resolve, reject) => {
          this.props.onAdd(newData, resolve);
        }),
        onRowUpdate: (newData, oldData) => new Promise((resolve, reject) => {
          this.props.onEdit(newData, resolve);
        }),
        onRowDelete: (oldData) => new Promise((resolve, reject) => {
          this.props.onRemove([oldData], resolve);
        }),
      }}
      localization={{
        body: {
          addTooltip: `Create new ${this.props.itemType.singular}`,
          deleteTooltip: `Delete ${this.props.itemType.singular}`,
          editTooltip: `Rename ${this.props.itemType.singular}`,
        },
      }}
      onRowClick={this.props.onClick}
    />;
  }

  // --------------------------------- COMPONENT LIFECYCLE -------------------------------

  // --------------------------------- CUSTOM FUNCTIONS -------------------------------

  /**
   * Return actions for material-table depending on what was passed as props
   */
  public getActions() {
    const actions = [] as any[];

    return actions;
  }

  /**
   * Return data info for the table
   */
  public getColumns() {
    const columns = [{title: 'Name', field: 'name', filterPlaceholder: 'Search by name...' }] as any[];
    columns.push({title: 'Color', field: 'color', filterPlaceholder: 'Search by color...' });

  //   if (this.props.categories){
  //     const categoriesLookup = {} as any;
  //     this.props.categories.forEach((c) => categoriesLookup[c.id] = c.name);

  //     columns.push({
  //       title: 'Categories',
  //       field: 'categoryId',
  //       type: 'numeric',
  //       lookup: categoriesLookup,
  //       filterPlaceholder: 'Search by category...'
  //     });
  //   }

    return columns;
  }
}
