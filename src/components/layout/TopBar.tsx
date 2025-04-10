
import * as React from 'react';
import settings from '../../general-settings.json';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import Project from '../../models/Project';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    selectProject: {
      marginRight: theme.spacing(1),
    },
    title: {
      flexGrow: 1,
    },
  }),
);

export interface TopBarProps {
  menuIsOpen: boolean;
  projects: Project[];
  goToProjectsView: () => void;
  selectProject: (projectId: number) => void;
  selectedProject?: Project;
  showProjects: boolean;
  toggleDrawer: (open: boolean) => any;
}

export function TopBar(props: TopBarProps) {
  const classes = useStyles();

  const displaySelectProject = () => {
    if (!props.selectedProject || !props.showProjects) {
      return null;
    }

    return (
      <Select
        className={classes.selectProject}
        onChange={(e: any) => props.selectProject(e.target.value)}
        value={props.selectedProject.id}
      >
        {props.projects.map((project) =>
          <MenuItem value={project.id} key={"project-" + project.id}>
            {project.name}
          </MenuItem>
        )}
      </Select>
    );
  };

  const displayManageProjectsButton = () => {
    if (!props.showProjects) {
      return null;
    }

    return (
      <Tooltip title="Manage projects">
        <IconButton
          aria-label="Manage projects"
          onClick={props.goToProjectsView}
        >
          <LibraryBooksIcon />
        </IconButton>
      </Tooltip>
    );
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            className={classes.menuButton}
            edge="start"
            onClick={props.toggleDrawer(true)}
            color="inherit"
            aria-label="menu">
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" className={classes.title}>
            {settings.projectTitle}
          </Typography>

          {displaySelectProject()}
          {displayManageProjectsButton()}

        </Toolbar>
      </AppBar>
    </div>
  );
}
