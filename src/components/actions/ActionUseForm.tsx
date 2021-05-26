
import React, {useState, useEffect} from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { RoleEventBoard } from '../roleEvent/RoleEventBoard';

import RoleAction from '../../models/RoleAction';
import RoleEvent from '../../models/RoleEvent';
import RoleEventType from '../../models/RoleEventType';
import RoleTime from '../../models/RoleTime';

export interface ActionUseFormProps {
  actions: RoleAction[];
  onSubmit: (events: RoleEvent[]) => void;
  roleEventTypes: RoleEventType[];
  roleTimeQuickview: RoleTime; 
  roleTimeSubmit: RoleTime;
}

export default function ActionUseForm(props: ActionUseFormProps) {
  const [selectedAction, setSelectedAction] = useState<RoleAction | undefined>(undefined);
  const events = (selectedAction || {}).events || [];

  const render = () => <>
    <Typography variant="h6" component="h6" align="center" gutterBottom>
      Use quick action
    </Typography>

    <Typography gutterBottom>
      TODO: Add explanation text
    </Typography>

    <Autocomplete
      id="grouped-demo"
      options={props.actions}
      // TODO: group by types
      // groupBy={(option) => option.firstLetter}
      onChange={(e, action) => setSelectedAction(action || undefined)}
      getOptionLabel={(action) => action.name}
      style={{ width: 300 }}
      renderInput={(params) => <TextField {...params}
        autoFocus
        label="Search an action"
        variant="outlined" 
      />}
    />

    <br/>

    <Typography gutterBottom>
      <strong>Events that will be created with this action</strong>
    </Typography>

    <RoleEventBoard
      roleEvents={events}
      roleTime={props.roleTimeQuickview}
      types={props.roleEventTypes}
      variant="settings"
    />

    <br/>

    <Box display="flex" flexDirection="row-reverse">
      {/* VALIDATE BUTTON */}
      <Button
        color="primary"
        disabled={!selectedAction}
        onClick={() => submitForm(events)}
        variant="contained"
      >
        Submit
      </Button>
    </Box>
  </>;

  /**
   * Convert events to the right timestamps (relative to the roleTime passed as prop)
   * before sending the resulting events to the parent component
   *
   * @param event  RoleEvent[]
   */
  const submitForm = (events: RoleEvent[]) => {
    let timeCount = props.roleTimeSubmit.formatToNumber();
    const absoluteEvents = events.map((e) => {
      const length = e.end;
      e.start = timeCount + e.start;
      e.end = timeCount + e.end;
      timeCount += length;
      return e;
    });
    props.onSubmit(absoluteEvents);
  }

  return render();
}
