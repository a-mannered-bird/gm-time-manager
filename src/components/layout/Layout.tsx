
import * as React from 'react';
import Container from '@material-ui/core/Container';
import {
  Switch,
  Redirect,
  Route,
  withRouter
} from "react-router-dom";
import { ActionsDashboard } from '../actions/ActionsDashboard';
import { Backups } from '../backups/Backups';
import { Dashboard } from '../dashboard/Dashboard';
import { Menu } from './Menu';
import { Projects } from '../sortingDatas/Projects';
import { Settings } from '../settings/Settings';
import { SettingsEventTypes } from '../settings/SettingsEventTypes';
import { TopBar } from './TopBar';

import Project from '../../models/Project';

import { getAll, putItem } from '../../api/localdb';

export interface LayoutProps {
  match: any;
  location: any;
  history: any;
}

export interface LayoutState {
  goTo?: string;
  menuIsOpen: boolean;
  projects: Project[];
  selectedProject?: Project;
}

class Layout extends React.Component<
  LayoutProps,
  LayoutState
> {

  public static defaultProps: Partial<LayoutProps> = {
  };

  constructor(props: LayoutProps) {
    super(props);

    this.state = {
      menuIsOpen: false,
      projects: [],
    };

    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.updateProject = this.updateProject.bind(this);
  }

  // --------------------------------- RENDER -------------------------------

  public render() {
    if (!this.state.selectedProject) {
      return null;
    }

    const selectedProjectId = this.state.selectedProject.id;
    return (
      <div>
        <TopBar
          menuIsOpen={this.state.menuIsOpen}
          projects={this.state.projects}
          goToProjectsView={() => this.setState({goTo: 'projects'})}
          selectProject={(projectId: number) => this.setState({
            selectedProject: this.state.projects.find((p) => p.id === projectId) || undefined,
            goTo: 'switchProject',
          })}
          selectedProject={this.state.selectedProject}
          showProjects={['/projects', '/'].indexOf(this.props.location.pathname) === -1}
          toggleDrawer={this.toggleDrawer} />

        <Menu
          location={this.props.location}
          open={this.state.menuIsOpen}
          selectedProjectId={(this.state.selectedProject || {}).id}
          toggleDrawer={this.toggleDrawer}
        />

        <Container>
          <br/><br/>
          <Switch>
            <Route exact path={["/", "/projects"]}>
              <Projects
                projects={this.state.projects}
                setProjects={(projects: Project[]) => this.setState({projects})}
                selectProject={(selectedProject: Project) => this.setState({
                  selectedProject,
                  goTo: 'dashboard',
                })}
              />
            </Route>
            <Route path="/:projectId/dashboard">
              <Dashboard
                project={this.state.selectedProject}
                updateProject={this.updateProject}
              />
            </Route>
            <Route path="/:projectId/settings">
              <Settings
                project={this.state.selectedProject}
                updateProject={this.updateProject}
              />
            </Route>
            <Route path="/:projectId/types">
              <SettingsEventTypes
                project={this.state.selectedProject}
              />
            </Route>
            <Route path="/:projectId/actions">
              <ActionsDashboard
                project={this.state.selectedProject}
              />
            </Route>
            <Route path="/:projectId/backups">
              <Backups
                projectId={selectedProjectId}
              />
            </Route>
          </Switch>
        </Container>

        {this.displayRedirections()}
      </div>
    );
  }

  public displayRedirections () {
    if (!this.state.goTo) {
      return null;
    }

    if (this.state.goTo === 'projects') {
      return <Redirect to="/projects" />
    }

    if (!this.state.selectedProject) {
      return null;
    }

    let path = "" as any;
    if (this.state.goTo === 'dashboard') {
      path = "/" + this.state.selectedProject.id + "/dashboard";
    }

    if (this.state.goTo === 'switchProject') {
      path = this.props.location.pathname.split('/');
      path[1] = this.state.selectedProject.id;
      path = path.join('/');
    }
    
    return <Redirect to={path} />
  }

  // --------------------------------- COMPONENT LIFECYCLE -------------------------------

  public componentDidMount() {
    this.loadDatas();
  }

  public componentDidUpdate(prevProps: LayoutProps, prevState: LayoutState) {
    // TODO: Bugfix: there seem to be a double render each time there a redirection ?
    if (prevState.goTo){
      this.setState({goTo: undefined});
    }
  }

  // --------------------------------- CUSTOM FUNCTIONS -------------------------------

  public loadDatas () {
    getAll('projects', (projects: Project[]) => {
      // Preselect the project depending on the url's value, or the first in the list if 
      const projectId = parseInt(this.props.location.pathname.split('/')[1], 10);
      const selectedProject = projectId ? projects.find((p) => p.id === projectId) : null;
      this.setState({
        projects,
        selectedProject: selectedProject || projects[0],
      });
    });
  }

  /**
   * Update all related projects states
   *
   * @param project  Project
   */
  public updateProject(project: Project) {
    putItem('projects', project, (data) => {
      const {projects} = this.state;
      const index = this.state.projects.findIndex((p) => project.id === p.id);
      projects[index] = project;
      this.setState({
        projects,
        selectedProject: project,
      });
    });
  }

  /**
   * Toggle Drawer menu
   *
   * @param open  boolean
   */
  public toggleDrawer (menuIsOpen: boolean) {
    return (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      this.setState({ menuIsOpen });
    };
  }
}

export default withRouter(Layout);
