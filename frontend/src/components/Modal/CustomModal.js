/* eslint-disable react/no-typos */
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const styles = theme => ({
    paper: {
      position: 'absolute',
      width: theme.spacing.unit * 50,
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      outline: 'none',
    },
    modalTitle: {
      padding: "20px 0px"
    },
    modalBody: {
      margin: '10px 0px',
      padding: '0px 20px'
    },
    modalFooter: {
      padding: '20px'
    },
    center: {
      textAlign: 'center'
    },
    button: {
      margin: theme.spacing.unit,
    }
  });

class CustomModal extends React.Component{
  render() {
    const { classes } = this.props;
    return (
      <div>
        <Modal
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          open={this.props.open}
          disableBackdropClick={true}
          onClose={this.props.onClose}>
          <div style={getModalStyle()} className={classes.paper}>
            <Grid
              container
              spacing={8}
              alignItems={'center'}
              direction={'row'}
              justify={'center'}>
                <Typography mb={2} variant="h6" className={classes.modalTitle} id="modal-title">
                  {this.props.title}
                </Typography>
            </Grid>
            <Typography component="div" className={classes.modalBody}>
              {this.props.children}
            </Typography>
            <Typography component="section" className={[classes.center, classes.modalFooter].join(' ')}>
              {this.props.canCanel && 
                <Button variant="contained" color="secondary" onClick={this.props.onCancel} className={classes.button}>
                  Cancel
                </Button>
              }
              {this.props.canConfirm && 
                <Button variant="contained" color="primary" onClick={this.props.onConfirm} className={classes.button}>
                  {this.props.confirmText}
                </Button>
              }
            </Typography>
          </div>
        </Modal>
      </div>
    );
  }
}

CustomModal.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CustomModal);