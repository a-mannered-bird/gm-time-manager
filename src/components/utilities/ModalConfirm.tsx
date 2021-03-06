
import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import Modal from './Modal';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttons: {
      display: 'flex',
      justifyContent: 'flex-end',
    }
  }),
);

export interface ModalConfirmProps {
  cancelLabel?: string;
  confirmLabel?: string;
  label?: string;
  onClose?: (event: {}) => void;
  onConfirm: (event: {}) => void;
  open: boolean;
}

export default function ModalConfirm(props: ModalConfirmProps) {
  const classes = useStyles();

  return (
    <Modal open={props.open} onClose={props.onClose} >
      <div>
        <p>
          {props.label || 'Are you sure?'}
        </p>

        <div className={classes.buttons}>
          <Button
            variant="contained"
            color="default"
            size="medium"
            onClick={props.onClose}
          >
            {props.cancelLabel || 'Cancel'}
          </Button>
          &nbsp;&nbsp;
          <Button
            variant="contained"
            color="primary"
            size="medium"
            onClick={props.onConfirm}
          >
            {props.cancelLabel || 'Confirm'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
