
import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Typography from '@material-ui/core/Typography';

const boardNames = ['past', 'present', 'future'];

export interface DashboardEventsProps {}

export interface DashboardEventsState {
  activeBoards: string[];
}

export class DashboardEvents extends React.Component<
  DashboardEventsProps,
  DashboardEventsState
> {

  public static defaultProps: Partial<DashboardEventsProps> = {
  };

  constructor(props: DashboardEventsProps) {
    super(props);

    this.state = {
      activeBoards: [...boardNames],
    };
  }

  // --------------------------------- RENDER -------------------------------

  public render() {
    const {activeBoards} = this.state;

    return <>
      <Typography variant="h6" component="h6" align="center" gutterBottom>
        Event boards
      </Typography>

      <Grid container direction="column" alignItems="center">
        <ButtonGroup
          color="primary"
          size="large"
        >
          {boardNames.map((name, i) => 
            <Button
              key={"eventBoard-" + i}
              variant={this.state.activeBoards.indexOf(name) !== -1 ? 'contained' : 'outlined'}
              onClick={(e) => this.toggleBoard(name)}
            >{name}</Button>
          )}
        </ButtonGroup>
      </Grid>
    </>;
  }

  // --------------------------------- COMPONENT LIFECYCLE -------------------------------

  // --------------------------------- CUSTOM FUNCTIONS -------------------------------

  toggleBoard(name: string) {
    const activeBoards = [...this.state.activeBoards];
    const nameIndex = activeBoards.indexOf(name);
    if (nameIndex === -1) {
      activeBoards.push(name);
    } else {
      activeBoards.splice(nameIndex, 1);
    }
    
    this.setState({activeBoards});
  }
}
