
import * as React from 'react';

import Project from '../../models/Project';

export interface ActionsDashboardProps {
  project: Project;
}

export interface ActionsDashboardState {}

export class ActionsDashboard extends React.Component<
  ActionsDashboardProps,
  ActionsDashboardState
> {

  public static defaultProps: Partial<ActionsDashboardProps> = {
  };

  constructor(props: ActionsDashboardProps) {
    super(props);

    this.state = {};
  }

  // --------------------------------- RENDER -------------------------------

  public render() {
    return <>
      Hello World!
    </>;
  }

  // --------------------------------- COMPONENT LIFECYCLE -------------------------------

  // --------------------------------- CUSTOM FUNCTIONS -------------------------------

}
