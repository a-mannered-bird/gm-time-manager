
// TODO: Add the total duration of each event inside the autocomplete dropdown?

import React, {useState, useRef, useEffect} from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { useTheme } from '@material-ui/core/styles';

import { RoleEventBoard } from '../roleEvent/RoleEventBoard';
import { RoleTimeAdvancedInput } from '../roleTime/RoleTimeAdvancedInput';

import RoleAction from '../../models/RoleAction';
import RoleEvent from '../../models/RoleEvent';
import RoleEventType from '../../models/RoleEventType';
import RoleTime from '../../models/RoleTime';

import usePrevious from '../../helpers/usePrevious';

export interface ActionUseFormProps {
  actions: RoleAction[];
  onSubmit: (events: RoleEvent[]) => void;
  roleEventTypes: RoleEventType[];
  roleTime: RoleTime;
}

export default function ActionUseForm(props: ActionUseFormProps) {
  const [selectedAction, setSelectedAction] = useState<RoleAction | undefined>(undefined);
  const prevSelectedAction = usePrevious(selectedAction);
  const [events, setEvents] = useState<RoleEvent[]>([]);
  const [delayStart, setDelayStart] = useState<boolean>(false)
  const [startTime, setStartTime] = useState<RoleTime>(props.roleTime)
  const submitRef = useRef<HTMLButtonElement>(null);
  const theme = useTheme();

  useEffect(() => {
    // Select submit btn after action selection
    if (selectedAction && (selectedAction || {}).id !== (prevSelectedAction || {}).id) {
      const submit = submitRef.current
      submit && submit.focus()
    }
  })

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
      groupBy={(action) => (action.typeIds[0] || -1).toString()}
      onChange={(e, action) => {
        setSelectedAction(action || undefined)
        setEvents((action || {}).events || [])
      }}
      getOptionLabel={(action) => action.name}
      style={{ width: 370 }}
      renderGroup={(params) => {
        const type = props.roleEventTypes.find((t) => t.id === parseInt(params.group));
        const name = (type || {}).name || 'Untyped action'
        return <React.Fragment key={`action-group-${(type || {}).id}`}>
          <ListSubheader
            style={{color: type ? type.color : theme.palette.secondary.main}}
          >
            {name}
          </ListSubheader>
          {params.children}
        </React.Fragment>
      }}
      renderInput={(params) => <TextField {...params}
        autoFocus
        label="Search an action"
        variant="outlined" 
      />}
      renderOption={(option) => <Tooltip
        title={option.description}
      >
        <ListItemText>
          {option.name}
        </ListItemText>
      </Tooltip>}
    />

    <br/>

    {/* DESCRIPTION */}
    {selectedAction && <Typography>
      {selectedAction.description}
    </Typography>}

    <br/>

    {/* EVENTS */}
    <Typography gutterBottom>
      <strong>Events that will be created with this action</strong>
    </Typography>

    <RoleEventBoard
      roleEvents={convertToAbsolute(events)}
      roleTime={props.roleTime}
      types={props.roleEventTypes}
      variant="settings"
    />

    <br/>

    {/* DELAY BEGIN OF FIRST EVENT */}
    <FormControlLabel
      control={<Checkbox
        checked={delayStart}
        onChange={() => setDelayStart(!delayStart)}
      />}
      label="Delay the events"
    />

    {delayStart && <RoleTimeAdvancedInput
      changeType="relative"
      defaultValue={props.roleTime}
      onChange={(newRoleTime) => setStartTime(newRoleTime)}
      // Allow negative values?
      preventNegative
      relativeTimeReference={props.roleTime}
    />}

    {/* SUBMIT BUTTON */}
    <Box display="flex" flexDirection="row-reverse">
      <Button
        color="primary"
        disabled={!events.length}
        onClick={() => props.onSubmit(convertToAbsolute(events))}
        ref={submitRef}
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
  const convertToAbsolute = (events: RoleEvent[]) => {
    let timeCount = (delayStart ? startTime : props.roleTime).formatToNumber();
    return events.map((event) => {
      const e = {...event};
      const length = e.end;
      e.start = timeCount + e.start;
      e.end = timeCount + e.end;
      timeCount += length;
      return e;
    });
  }

  return render();
}
