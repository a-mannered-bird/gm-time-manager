
import * as React from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Box from '@material-ui/core/Box';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

// import { } from '../../api/localdb';

import Project, {TimeDefinitions} from '../../models/Project';

export interface SettingsTimeDefinitionsProps {
  project: Project;
  onChangeSettings: (e: any, settingsPropertyName: string) => void;
}

export interface SettingsTimeDefinitionsState {}

export class SettingsTimeDefinitions extends React.Component<
  SettingsTimeDefinitionsProps,
  SettingsTimeDefinitionsState
> {

  public static defaultProps: Partial<SettingsTimeDefinitionsProps> = {
  };

  constructor(props: SettingsTimeDefinitionsProps) {
    super(props);

    this.state = {};
    this.onChangeSettings = this.onChangeSettings.bind(this);
  }

  // --------------------------------- RENDER -------------------------------

  public render() {
    const {timeDefinitions} = this.props.project.settings;
    return <>
      <Typography variant="h6" component="h2" gutterBottom>
        Time definitions
      </Typography>

      {this.displayInput('Months number', 'number', 'yearMonthsCount')}

      {this.displayInput('Weekdays number', 'number', 'weekDaysCount')}

      {this.displayAccordeon(
        'Month names',
        this.displayInputListForCount(timeDefinitions.yearMonthsCount, 'Month name', 'text', 'monthNames')
      )}

      {this.displayAccordeon(
        'Number of days per month',
        this.displayInputListForCount(timeDefinitions.yearMonthsCount, 'Month days count', 'text', 'monthDaysCount')
      )}

      {this.displayAccordeon(
        'Weekday names',
        this.displayInputListForCount(timeDefinitions.weekDaysCount, 'Weekday name', 'text', 'weekDaysNames')
      )}
    </>;
  }

  public displayAccordeon(title: string, contents: React.ReactElement){
    return <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box>
          {contents}
        </Box>
      </AccordionDetails>
    </Accordion>;
  }

  public displayInputListForCount(inputCount: number, label: string, valueType: string, propertyTarget: keyof TimeDefinitions){
    const fields = [];
    for (let i = 0; i < inputCount; i++) {
      fields.push(this.displayInput(label, valueType, propertyTarget, i));
    }
    return <>
      {fields}
    </>;
  }

  public displayInput(label: string, valueType: string, propertyTarget: keyof TimeDefinitions, key?: number){

    const {timeDefinitions} = this.props.project.settings;

    return <TextField
      style={{margin: '20px 10px'}}
      key={propertyTarget + (key !== undefined ? '.' + key : '')}
      name={propertyTarget + (key !== undefined ? '.' + key : '')}
      label={label + (key !== undefined ? ' ' + (key + 1) : '')}
      type={valueType}
      defaultValue={key !== undefined ? timeDefinitions[propertyTarget][key] : timeDefinitions[propertyTarget]}
      onChange={this.onChangeSettings}
      required
    />
  }

  // --------------------------------- COMPONENT LIFECYCLE -------------------------------


  // --------------------------------- CUSTOM FUNCTIONS -------------------------------

  private onChangeSettings(e: any){
    this.props.onChangeSettings(e, 'timeDefinitions');
  }
}
