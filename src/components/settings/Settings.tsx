
import * as React from 'react';

export interface SettingsProps {
  projectId?: number;
}

export interface SettingsState {}

export class Settings extends React.Component<
  SettingsProps,
  SettingsState
> {

  public static defaultProps: Partial<SettingsProps> = {
  };

  constructor(props: SettingsProps) {
    super(props);

    this.state = {};
  }

  // --------------------------------- RENDER -------------------------------

  public render() {
    return (<div>Hello World!</div>);
  }

  // --------------------------------- COMPONENT LIFECYCLE -------------------------------

  // --------------------------------- CUSTOM FUNCTIONS -------------------------------

}
