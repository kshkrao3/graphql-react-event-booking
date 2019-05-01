import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import Fab from '@material-ui/core/Fab';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import Paper from '@material-ui/core/Paper';
import CustomModal from '../components/Modal/CustomModal';
const styles = theme => ({
    main: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
          width: 400,
          marginLeft: 'auto',
          marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing.unit * 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    },
    button: {
      margin: theme.spacing.unit,
      cursor: 'pointer'
    },
    input: {
      display: 'none',
    },
    margin: {
        margin: theme.spacing.unit,
    },
    extendedIcon: {
        marginRight: theme.spacing.unit,
    },
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    },
  });
const theme = createMuiTheme({
    palette:{
        primary:blue
    },
    typography: {
        useNextVariants: true,
    }
});

let classes;
class EventsPage extends React.Component{

    state = {
        open: false
    };

    triggerModalOpen = () => {
        this.setState({open: true});
    };

    triggerModalClose = () => {
        this.setState({open: false});
    };

    eventCancelHandler = () =>{ 
        this.setState({open: false});
    };

    eventConfirmHandler = () =>{ 
        this.setState({open: false});
    };

    constructor(props){
        super(props);
        classes = props.classes;
    }

    render(){
        return(
            <MuiThemeProvider theme={theme}>
                <main className={classes.main}>
                    <Paper className={classes.paper} elevation={2}>
                    <Typography variant="h5" component="h5">
                      Share your own events
                    </Typography>
                        <Fab variant="extended"
                            size="medium"
                            color="primary"
                            aria-label="Create Event"
                            onClick={this.triggerModalOpen}
                            className={[classes.margin, classes.button].join(' ')}>
                            <AddIcon className={classes.extendedIcon}/>
                            Create Event
                        </Fab>
                    </Paper>
                    <CustomModal title='ADD EVENT' canCanel canConfirm {...this.state} onClose={this.triggerModalClose} onCancel={this.eventCancelHandler} onConfirm={this.eventConfirmHandler}>
                        <Typography component="p">
                            Modal Content
                        </Typography>
                    </CustomModal>
                </main>
            </MuiThemeProvider>
        );
    }
}

EventsPage.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  

  export default withStyles(styles)(EventsPage);