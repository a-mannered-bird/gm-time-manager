
/*
 TODO: When focusing input, select the whole value
*/

import * as React from 'react';

import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import RoleTime, {RoleTimeValue} from '../../models/RoleTime';

export interface RoleTimeInputProps {
  useTimeDefinitionsForMaxMin: boolean;
  label?: string | React.ReactElement;
  onChange: (roleTime: RoleTime) => void;
  value: RoleTime;
}

export interface RoleTimeInputState {}

export class RoleTimeInput extends React.Component<
  RoleTimeInputProps,
  RoleTimeInputState
> {

  public static defaultProps: Partial<RoleTimeInputProps> = {
    useTimeDefinitionsForMaxMin: false,
  };

  constructor(props: RoleTimeInputProps) {
    super(props);
    this.state = {};

    this.onChangeInput = this.onChangeInput.bind(this);
  }

  // --------------------------------- RENDER -------------------------------

  public render() {
    const {year, month, day, hour, minute, second} = this.props.value;
    const {monthMin, dayMin, hourMin, minuteMin, secondMin} = this.props.value;
    const {monthMax, dayMax, hourMax, minuteMax, secondMax} = this.props.value;

    return <>
      {this.props.label && <Box>
        <Typography>
          {this.props.label}
        </Typography>
      </Box>}

      <Box>
        {this.displayInput("Year", "year", year, 70)}
        {this.displayInput("Month", "month", month, 50, monthMin, monthMax)}
        {this.displayInput("Day", "day", day, 50, dayMin, dayMax)}
        {this.displayInput("Hour", "hour", hour, 50, hourMin, hourMax)}
        {this.displayInput("Minute", "minute", minute, 50, minuteMin, minuteMax)}
        {this.displayInput("Second", "second", second, 50, secondMin, secondMax)}
      </Box>
    </>;
  }

  public displayInput(label: string, name: keyof RoleTimeValue, value: number | undefined, width: number, min?: number, max?: number) {
    const inputProps = this.props.useTimeDefinitionsForMaxMin ? {min, max} : {};

    return <TextField
      inputProps={inputProps}
      label={label}
      name={name}
      onChange={this.onChangeInput}
      onFocus={(e) => (e.currentTarget as HTMLInputElement).select()}
      style={{
        margin: '20px 10px',
        width,
      }}
      type="number"
      value={value !== undefined ? value : ''}
    />
  }

  // --------------------------------- COMPONENT LIFECYCLE -------------------------------

  // --------------------------------- CUSTOM FUNCTIONS -------------------------------

  private onChangeInput(e: React.ChangeEvent<HTMLInputElement>) {
    const newRoleTime = new RoleTime(this.props.value);
    const property = e.currentTarget.name as keyof RoleTimeValue;
    const value = e.currentTarget.value ? parseInt(e.currentTarget.value) : undefined;
    newRoleTime[property] = value;

    // Adjust value if it's exceeding the maximum or minimum (for absolute values)
    if (this.props.useTimeDefinitionsForMaxMin) {
      newRoleTime.applyMaxMinToAll();
    }

    this.props.onChange(newRoleTime);
  }
}
