
import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Modal, {ModalProps} from '@material-ui/core/Modal';

interface FadingModalProps extends ModalProps {
  isBig?: boolean;
}

const useStyles = makeStyles((theme: Theme)  =>
  createStyles({
    modal: (props: {isBig?: boolean}) => ({
      display: 'flex',
      alignItems: props.isBig ? 'baseline' : 'center',
      justifyContent: 'center',
      overflowY: 'scroll',
      margin: 20,
    }),
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }),
);

export default function FadingModal(props: FadingModalProps) {
  const classes = useStyles({isBig: props.isBig});
  const {children, isBig, ...otherProps} = props;

  return (
    <Modal
      {...otherProps}
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={props.open}>
        <div className={classes.paper}>
          {children}
        </div>
      </Fade>
    </Modal>
  );
}
