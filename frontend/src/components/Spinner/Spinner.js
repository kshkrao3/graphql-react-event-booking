/* eslint-disable react/no-multi-comp */

import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import { CircularProgress } from "@material-ui/core";


const styles = {
  root: {
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },

  paper: {
    backgroundColor: "transparent",
    boxShadow: "none",
    overflow: "hidden"
  },
};

class Spinner extends React.Component {

  render() {
    const { classes, invisible, ...other } = this.props;

    return (
      <Dialog
        open={invisible}
        aria-labelledby="Spinner-Dialog"
        {...other}
        BackdropProps={{
          classes: {
            root: classes.root
          }
        }}
        PaperProps={{
          classes: {
            root: classes.paper
          }
        }}
      >
        <div>
          <CircularProgress
            style={{ display: "inline-block" }}
            size={50}
            color={"primary"}
          />
        </div>
      </Dialog>
    );
  }
}

Spinner.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Spinner);
