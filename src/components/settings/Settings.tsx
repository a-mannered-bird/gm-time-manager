
import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

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
    return <>
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>

      <Paper>
        <Box p={2}>
          <Typography variant="h6" component="h2" gutterBottom>
            Time definitions
          </Typography>

          
        </Box>
      </Paper>
    </>;
  }

  // --------------------------------- COMPONENT LIFECYCLE -------------------------------

  // --------------------------------- CUSTOM FUNCTIONS -------------------------------

}
