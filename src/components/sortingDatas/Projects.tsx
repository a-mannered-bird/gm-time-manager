
/*
  // TODO: Initialize datas in project on creation
*/

import * as React from 'react';
import defaultDb from '../../api/defaultdb'
import { EditableTable } from './EditableTable';
import Project from '../../models/Project';

import { postItem, putItem, deleteItems, removeLinkedItems } from '../../api/localdb';


export interface ProjectsProps {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  selectProject: (selectedProject: Project) => void;
}

export interface ProjectsState {}

export class Projects extends React.Component<
  ProjectsProps,
  ProjectsState
> {

  public static defaultProps: Partial<ProjectsProps> = {
  };

  constructor(props: ProjectsProps) {
    super(props);

    this.state = {};

    this.handleCreateItem = this.handleCreateItem.bind(this);
    this.handleUpdateItem = this.handleUpdateItem.bind(this);
    this.handleDeleteItems = this.handleDeleteItems.bind(this);
  }

  // --------------------------------- RENDER -------------------------------

  public render() {
    const type = {
      itemName: 'projects',
      singular: 'Project',
      plural: 'Projects - pick the project you want to work on',
    };

    return (
      <EditableTable
        itemType={type}
        items={this.props.projects}
        onAdd={this.handleCreateItem}
        onClick={(e: Event, data: any) => this.props.selectProject(data)}
        onEdit={this.handleUpdateItem}
        onRemove={this.handleDeleteItems}
        searchable={false}
      />
    );
  }

  // --------------------------------- COMPONENT LIFECYCLE -------------------------------

  // --------------------------------- CUSTOM FUNCTIONS -------------------------------

  /**
   * Create a project
   */
  public handleCreateItem(item: any, resolve: any) {
    if (item.name) {
      postItem('projects', {...defaultDb.projects.items[0], ...item}, (res) => {
        this.props.setProjects(res.items);
        resolve();
      });
    } else {
      resolve();
    }
  }

  /**
   * Update a project
   */
  public handleUpdateItem(item: any, resolve: any) {
    if (item.name) {
      putItem('projects', item, (res) => {
        this.props.setProjects(res.items);
        resolve();
      });
    } else {
      resolve();
    }
  }

  /**
   * Delete a project and all items associated with it.
   */
  public handleDeleteItems(items: any[], resolve: any) {
    deleteItems('projects', items, (res: any[]) => {
      const projects = [...this.props.projects].filter((project) =>
        !res.find((p) => project.id === p.id)
      );
      this.props.setProjects(projects);
      resolve();

      ['categories', 'documents', 'extracts', 'tags', 'tagCategories'].forEach((name) => {
        removeLinkedItems(name, 'projectId', items, () => {});
      });
    });
  }
}
