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
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import DateFnsUtils from '@date-io/moment';
import { InlineDateTimePicker, MuiPickersUtilsProvider } from 'material-ui-pickers';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import AuthContext from '../context/auth-context';
import CustomSnackBar from '../components/SnackBars/CustomSnackBar'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
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
    message: {
        display: 'flex',
        alignItems: 'center',
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
    marginTop20: {
        marginTop: '20px',
    },
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    },
    fullWidth: {
        width: '100%'
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing.unit,
    }
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
        open: false,
        openSnack: false,
        selectedDate: new Date(),
        messageVariant: 'error',
        message: 'Please fill in all the fields',
        events: []
    };

    static contextType = AuthContext;

    handleDateChange = date => {
        this.setState({ selectedDate: date });
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
        const title = this.titleElRef.current.value;
        const price = +this.priceElRef.current.value;
        const date = this.dateElRef.current.value;
        const description = this.descriptionElRef.current.value;

        if(title.trim().length === 0 || price <= 0 || date.trim().length === 0 || description.trim().length === 0){
            this.setState({openSnack: true});
            return;
        }

        const reqBody = {
            query:`
                mutation{
                    createEvent(eventInput:{title: "${title}", price: ${price}, date: "${date}", description: "${description}"}){
                        _id
                        title
                        description
                        date
                        price
                        creator{
                            _id
                            email
                        }
                    }
                }
            `
        };

        const token = this.context.token;
        fetch('http://localhost:3001/api',{
            method: 'POST',
            body: JSON.stringify(reqBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+token
            }
        }).then(res=> {
            if(res.status !== 200 && res.status !== 201){
                throw new Error('Failed to create event');
            }
            return res.json();
        }).then(resData => {
            this.fetchEvents();
        }).catch(err=> {
            console.log('Error while creating event', err);
        });    
        this.setState({open: false});
    };

    handleClose = () =>{ 
        this.setState({openSnack: false});
    }

    formatDate = (date) => {
        return date.format("DD-MMM-YYYY hh:mm A");
    }

    fetchEvents(){
        const reqBody = {
            query:`
                query{
                    events{
                        _id
                        title
                        description
                        date
                        price
                        creator{
                            _id
                            email
                        }
                    }
                }
            `
        };

         fetch('http://localhost:3001/api',{
            method: 'POST',
            body: JSON.stringify(reqBody),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res=> {
            if(res.status !== 200 && res.status !== 201){
                throw new Error('Failed to create event');
            }
            return res.json();
        }).then(resData => {
            this.setState({events: resData.data.events});
        }).catch(err=> {
            console.log('Error while creating event', err);
        });    
    }

    constructor(props){
        super(props);
        classes = props.classes;
        this.titleElRef = React.createRef();
        this.priceElRef = React.createRef();
        this.dateElRef = React.createRef();
        this.descriptionElRef = React.createRef();
    }

    componentDidMount(){
        this.fetchEvents();
    }

    render(){
        const { selectedDate } = this.state;
        return(
            <MuiThemeProvider theme={theme}>
                <main className={classes.main}>
                    <CssBaseline />
                
                    <Paper className={classes.paper} elevation={2}>
                        {this.context.token &&
                            <React.Fragment>
                                <Typography variant="h5" component="h5">
                                Share your own events
                                </Typography>
                                <Fab variant="extended"
                                    size="medium"
                                    color="primary"
                                    aria-label="Create Event"
                                    onClick={this.triggerModalOpen}
                                    className={[classes.margin, classes.marginTop20, classes.button].join(' ')}>
                                    <AddIcon className={classes.extendedIcon}/>
                                    Create Event
                                </Fab>
                            </React.Fragment>
                        }
                        <List className={classes.root}>
                            {this.state.events.map((event, key) => {
                               return (
                                <React.Fragment key={event._id}>
                                    <ListItem alignItems="flex-start">
                                        <ListItemText
                                        primary={event.title}
                                        secondary={
                                            <React.Fragment>
                                            <Typography component="span" className={classes.inline} color="textPrimary">
                                                {event.description}
                                            </Typography>
                                            {event.creator.email}
                                            <Typography component="span" className={classes.inline}>
                                                ${event.price}
                                            </Typography>
                                            </React.Fragment>
                                        }
                                        />
                                    </ListItem>
                                    <Divider/>
                                </React.Fragment>
                               )
                            })}
                            
                        </List>
                    </Paper>
                    {this.context.token &&
                        <CustomModal title='ADD EVENT' canCanel canConfirm {...this.state} onClose={this.triggerModalClose} onCancel={this.eventCancelHandler} onConfirm={this.eventConfirmHandler}>
                            <form className={classes.form}>
                                <FormControl margin="normal" required fullWidth>
                                    <InputLabel htmlFor="title">Title</InputLabel>
                                    <Input id="title" name="title" autoFocus inputRef={this.titleElRef}/>
                                </FormControl>
                                <FormControl margin="normal" required fullWidth>
                                    <InputLabel htmlFor="price">Price</InputLabel>
                                    <Input name="price" type="number" inputRef={this.priceElRef} id="price"/>
                                </FormControl>
                                <div className={classes.marginTop20}>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <InlineDateTimePicker
                                            keyboard
                                            clearable
                                            disablePast
                                            label="Date"
                                            ampm={false}
                                            inputRef={this.dateElRef}
                                            value={selectedDate}
                                            className={classes.fullWidth}
                                            labelFunc={this.formatDate}
                                            onChange={this.handleDateChange}
                                        />
                                    </MuiPickersUtilsProvider>
                                </div>
                                <FormControl margin="normal" required fullWidth>
                                    <TextField
                                        id="description"
                                        label="Description"
                                        multiline
                                        rows="4"
                                        inputRef={this.descriptionElRef}
                                        name="description"
                                        margin="normal"
                                        />
                                </FormControl>
                            </form>
                        </CustomModal>
                    }
                    <Snackbar
                        anchorOrigin={{ vertical:'top', horizontal: 'center' }}
                        open={this.state.openSnack}
                        onClose={this.handleClose}
                        autoHideDuration={6000}
                        ContentProps={{
                            'aria-describedby': 'message-id',
                        }}>
                        <CustomSnackBar
                            variant={this.state.messageVariant}
                            className={classes.margin}
                            onClose={this.handleClose}
                            message={this.state.message}
                        />
                    </Snackbar>
                </main>
            </MuiThemeProvider>
        );
    }
}

EventsPage.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  

  export default withStyles(styles)(EventsPage);