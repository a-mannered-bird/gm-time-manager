
import * as React from 'react';
import { forwardRef } from 'react';
import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import ClassIcon from '@material-ui/icons/Class';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

export default {
  Add: forwardRef(() => <AddBox />),
  Check: forwardRef(() => <Check />),
  Category: forwardRef(() => <ClassIcon />),
  Clear: forwardRef(() => <Clear />),
  Delete: forwardRef(() => <DeleteOutline />),
  DetailPanel: forwardRef(() => <ChevronRight />),
  Edit: forwardRef(() => <Edit />),
  Export: forwardRef(() => <SaveAlt />),
  Filter: forwardRef(() => <FilterList />),
  FirstPage: forwardRef(() => <FirstPage />),
  LastPage: forwardRef(() => <LastPage />),
  NextPage: forwardRef(() => <ChevronRight />),
  PreviousPage: forwardRef(() => <ChevronLeft />),
  ResetSearch: forwardRef(() => <Clear />),
  Search: forwardRef(() => <Search />),
  SortArrow: forwardRef(() => <ArrowUpward />),
  ThirdStateCheck: forwardRef(() => <Remove />),
  ViewColumn: forwardRef(() => <ViewColumn />)
};