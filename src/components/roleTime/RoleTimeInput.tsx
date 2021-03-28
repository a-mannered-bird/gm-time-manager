
import * as React from 'react';

import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import RoleTime, {RoleTimeValue} from '../../models/RoleTime';

export interface RoleTimeInputProps {
  useTimeDefinitionsForMaxMin: boolean;
  label?: string | React.ReactElement;
  onChange: (roleTime: RoleTime) => void;
  timeInputFormat: 'full' | 'date' | 'time';
  value: RoleTime;
}

export interface RoleTimeInputState {}

export class RoleTimeInput extends React.Component<
  RoleTimeInputProps,
  RoleTimeInputState
> {

  public static defaultProps: Partial<RoleTimeInputProps> = {
    timeInputFormat: 'full',
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
    const {timeInputFormat} = this.props;

    // Set which parts of the date and time we display
    let inputs = [] as any[];
    if (['full', 'date'].indexOf(timeInputFormat) !== -1) {
      inputs = inputs.concat([
        ["Year", "year", year, 70],
        ["Month", "month", month, 50, monthMin, monthMax],
        ["Day", "day", day, 50, dayMin, dayMax],
      ]);
    }

    if (['full', 'time'].indexOf(timeInputFormat) !== -1) {
      inputs = inputs.concat([
        ["Hour", "hour", hour, 50, hourMin, hourMax],
        ["Minute", "minute", minute, 50, minuteMin, minuteMax],
        ["Second", "second", second, 50, secondMin, secondMax],
      ]);
    }

    return <>
      {this.props.label && <Box>
        <Typography>
          {this.props.label}
        </Typography>
      </Box>}

      <Box>
        {/*
        // @ts-ignore */}
        {inputs.map((i, index) => this.displayInput(i[0], i[1], i[2], i[3], i[4], i[5], index === inputs.length - 1))}
      </Box>
    </>;
  }

  public displayInput(label: string, name: keyof RoleTimeValue, value: number | undefined, width: number, min: number | undefined, max: number | undefined, isLast: boolean) {
    const inputProps = this.props.useTimeDefinitionsForMaxMin ? {min, max} : {};

    return <TextField
      inputProps={inputProps}
      key={name}
      label={label}
      name={name}
      onChange={this.onChangeInput}
      onFocus={(e) => (e.currentTarget as HTMLInputElement).select()}
      style={{
        marginBottom: 20,
        marginRight: isLast ? 0 : 10,
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
