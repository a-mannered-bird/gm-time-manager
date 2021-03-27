
import * as React from 'react';

import Project from '../../models/Project';
// import RoleEvent from '../../models/RoleEvent';
// import RoleEventType from '../../models/RoleEventType';
import RoleTime from '../../models/RoleTime';

export interface RoleEventEditFormProps {
  project: Project;
  roleTime: RoleTime;
}

export interface RoleEventEditFormState {}

export class RoleEventEditForm extends React.Component<
  RoleEventEditFormProps,
  RoleEventEditFormState
> {

  public static defaultProps: Partial<RoleEventEditFormProps> = {
  };

  constructor(props: RoleEventEditFormProps) {
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
