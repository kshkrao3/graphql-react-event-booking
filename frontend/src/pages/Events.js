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
import EventList from '../components/Events/EventList/EventList';
import Spinner from '../components/Spinner/Spinner';
const styles = theme => ({
    main: {
        width: '100%',
        display: 'block', // Fix IE 11 issue.
        // marginLeft: theme.spacing.unit * 3,
        // marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(900 + theme.spacing.unit * 3 * 2)]: {
          width: '800px',  
          marginLeft: 'auto',
          marginRight: 'auto',
        },
        alignItems: 'center',
    },
    right: {
        textAlign: 'right'
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
        minHeight: '200px'
        //padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
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
    marginTop10: {
        marginTop: '10px'
    },
    backdrop:{
        zIndex: '1000'
    },
    progress: {
        zIndex: '1001'
    },
    viewDetaildesc:{
        fontWeight: '300',
        fontSize: '16px'
    },
    viewDetailprice:{
        fontWeight: '200',
        fontSize: '14px'
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
        events: [],
        isLoading: false,
        selectedEvent: null
    };

    static contextType = AuthContext;

    handleDateChange = date => {
        this.setState({ selectedDate: date });
    };

    triggerModalOpen = () => {
        this.setState({open: true});
    };

    triggerModalClose = () => {
        this.setState({open: false, selectedEvent: null});
    };

    eventCancelHandler = () =>{ 
        this.setState({open: false, selectedEvent: null});
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
            this.setState(prevState => {
                const updatedEvents = [...prevState.event];
                updatedEvents.push({
                    _id: resData.data.createEvent._id,
                    title: resData.data.createEvent.title,
                    description: resData.data.createEvent.description,
                    date: resData.data.createEvent.date,
                    price: resData.data.createEvent.price,
                    creator: {
                        _id: this.context.userId,
                        email: resData.data.createEvent.creator.email
                    }
                });
                return {events: updatedEvents};
            });
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
        this.setState({isLoading: true});
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
            this.setState({events: resData.data.events, isLoading: false});
        }).catch(err=> {
            console.log('Error while creating event', err);
            this.setState({isLoading: false});
        });    
    }

    showDetailHandler = eventId =>{
        this.setState(prevState => {
            const selectedEvent = prevState.events.find(e=> e._id === eventId);
            return {selectedEvent: selectedEvent, open: true};
        })
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

    bookEventHandler= () => {

    };

    render(){
        const { selectedDate } = this.state;
        return(
            <MuiThemeProvider theme={theme}>
                <main className={classes.main}>
                    <CssBaseline />
                    
                    <Paper className={classes.paper} elevation={2}>
                        {this.context.token &&
                            <React.Fragment>
                                <Typography variant="h5" className={classes.marginTop20} component="h5">
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
                        {this.state.isLoading ? 
                            <React.Fragment>
                                <Spinner invisible={this.state.isLoading}/>
                            </React.Fragment>
                            :
                            <EventList classes={classes} onViewDetail={this.showDetailHandler} events={this.state.events} authUserId={this.context.userId}/>
                        }
                    </Paper>
                    {this.context.token &&
                        <CustomModal confirmText="Confirm" title='ADD EVENT' canCanel canConfirm {...this.state} onClose={this.triggerModalClose} onCancel={this.eventCancelHandler} onConfirm={this.eventConfirmHandler}>
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
                    {this.state.selectedEvent && (
                        <CustomModal confirmText='Book Event' title={this.state.selectedEvent.title.toUpperCase()} canCanel canConfirm {...this.state} onClose={this.triggerModalClose} onCancel={this.eventCancelHandler} onConfirm={this.bookEventHandler}>
                            <Typography component="div" className={[classes.marginTop20, classes.viewDetaildesc].join(' ')}>{this.state.selectedEvent.description}</Typography>
                            <Typography component="div" className={[classes.marginTop20, classes.viewDetailprice].join(' ')}>${this.state.selectedEvent.price} - {new Date(this.state.selectedEvent.date).toLocaleDateString()}</Typography>
                        </CustomModal>
                    )}
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