
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SaveIcon from '@material-ui/icons/Save';
import SettingsIcon from '@material-ui/icons/Settings';
import { Link as RouterLink, LinkProps as RouterLinkProps } from "react-router-dom";
import { Omit } from '@material-ui/types';

/* List Item link is on item of the menu */
interface ListItemLinkProps {
  icon?: React.ReactElement;
  primary: string;
  to: string;
}

function ListItemLink(props: ListItemLinkProps) {
  const { icon, primary, to } = props;

  const renderLink = React.useMemo(
    () =>
      React.forwardRef<HTMLAnchorElement, Omit<RouterLinkProps, 'innerRef' | 'to'>>(
        (itemProps, ref) => (
          // With react-router-dom@^6.0.0 use `ref` instead of `innerRef`
          // See https://github.com/ReactTraining/react-router/issues/6056
          <RouterLink to={to} {...itemProps} innerRef={ref} />
        ),
      ),
    [to],
  );

  return (
    <li>
      <ListItem button component={renderLink}>
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  );
}

const useStyles = makeStyles({
  list: {
    width: 250,
  },
});

export interface MenuProps {
  open: boolean;
  selectedProjectId?: number;
  toggleDrawer: (open: boolean) => any;
}

export function Menu(props: MenuProps) {
  const classes = useStyles();

  if (!props.selectedProjectId) {
    return <div></div>;
  }

  return (
    <div>
      <Drawer open={props.open} onClose={props.toggleDrawer(false)}>
        <div
          className={classes.list}
          role="presentation"
          onClick={props.toggleDrawer(false)}
          onKeyDown={props.toggleDrawer(false)}
        >
          <List>
            <ListItemLink
              to={"/" + props.selectedProjectId + "/settings"}
              primary="Settings"
              icon={<SettingsIcon />} />
            <ListItemLink
              to={"/" + props.selectedProjectId + "/backups"}
              primary="Backups"
              icon={<SaveIcon />} />
          </List>
        </div>
      </Drawer>
    </div>
  );
}