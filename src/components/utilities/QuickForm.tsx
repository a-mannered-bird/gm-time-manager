
import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import SaveIcon from '@material-ui/icons/Save';

import Modal from './Modal';

import { Autocomplete, OptionType } from '../utilities/Autocomplete';
import { ValueType } from 'react-select/src/types';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttons: {
      display: 'flex',
      justifyContent: 'flex-end',
    }
  }),
);

export interface QuickFormInput {
  defaultValue?: any;
  label?: string;
  id: string;
  options?: OptionType[];
  placeholder?: any;
  type: string;
}

interface QuickFormProps {
  onClose: () => void;
  onSave: (data: any) => void;
  open: boolean;
  title: string;
  inputs: QuickFormInput[];
}

export default function QuickForm(props: QuickFormProps) {
  const classes = useStyles();

  // Set inputs default values
  const defaultInputValues = {} as any;
  props.inputs.forEach((input) => defaultInputValues[input.id] = input.defaultValue);
  const [inputValues, setInputValues] = React.useState(defaultInputValues);

  /**
   * Depending on a type, return a different form input
   *
   * @param input  QuickFormInput
   */
  const displayInput = (input: QuickFormInput, i: number) => {
    let inputEl = null;
    switch (input.type) {
      case "text":
        inputEl = displayTextInput(input);

      case "autocomplete-single":
        inputEl = displayAutocomplete(input, false);

      case "autocomplete-multi":
        inputEl = displayAutocomplete(input, true);
    }

    return (
      <div key={"quickforminput-" + i + "-" + input.id}>
        {inputEl}
        <br />
      </div>
    )
  }

  /**
   * Display simple text input
   *
   * @param input  QuickFormInput
   */
  const displayTextInput = (input: QuickFormInput) => {
    return (
      <TextField
        id={input.id}
        label={input.label || ''}
        value={inputValues[input.id]}
        onChange={(e) => setInputValues({ ...inputValues, [input.id]: e.target.value })}
      />
    );
  }

  /**
   * Display select input with autocomplete
   *
   * @param input  QuickFormInput
   */
  const displayAutocomplete = (input: QuickFormInput, isMulti: boolean) => {
    return (
      <Autocomplete
        id={input.id}
        isMulti={isMulti}
        label={input.label || ''}
        value={inputValues[input.id]}
        options={input.options || []}
        placeholder={input.placeholder || ''}
        onChange={(value: ValueType<OptionType>) => setInputValues({
          ...inputValues,
          [input.id]: value,
        })}
      />
    );
  }

  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
    >
      <div>
        <h2 id="transition-modal-title">{props.title}</h2>

        {props.inputs.map(displayInput)}

        <div className={classes.buttons}>
          <Button
            variant="contained"
            color="primary"
            size="medium"
            startIcon={<SaveIcon />}
            onClick={(e) => props.onSave(inputValues)}
          >
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
}
