import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import BarChart from '@material-ui/icons/BarChart';
import List from '@material-ui/icons/List';
import AuthContext from '../context/auth-context';
import Spinner from '../components/Spinner/Spinner';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import Paper from '@material-ui/core/Paper';
import CssBaseline from '@material-ui/core/CssBaseline';
import BookingList from '../components/Bookings/BookingList/BookingList';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import CustomSnackBar from '../components/SnackBars/CustomSnackBar';
import BookingsChart from '../components/Bookings/BookingsChart/BookingsChart';

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
    error: {
        backgroundColor: '#B00020',
        color: 'white'
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
function TabContainer(props) {
    return (
      <Typography component="div" style={{ padding: 8 * 3 }}>
        {props.children}
      </Typography>
    );
  }
  
  TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
  };
let classes;
class BookingsPage extends React.Component{

    state = {
        isLoading: false,
        bookings: [],
        activeTab: 0,
        openSnack: false,
        messageVariant: 'success',
        message: 'Event cancelled successfully!',
    };

    static contextType = AuthContext;

    constructor(props){
        super(props);
        classes = props.classes;
    }

    handleTabChange = (event, value) => {
        this.setState({activeTab: value});
    }

    componentDidMount(){
        this.fetchBookings();
    }

    deleteBookingHandler = bookingId => {
        this.setState({isLoading: true});
        const reqBody = {
            query:`
                mutation CancelBooking($id: ID!){
                    cancelBooking(bookingId: $id){
                        _id
                        title
                    }
                }
            `,
            variables: {
                id: bookingId
            }
        };

         fetch('http://localhost:3001/api',{
            method: 'POST',
            body: JSON.stringify(reqBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ this.context.token
            }
        }).then(res=> {
            if(res.status !== 200 && res.status !== 201){
                throw new Error('Failed to create event');
            }
            return res.json();
        }).then(resData => {
            this.setState(prevState => {
                const updatedBookings = prevState.bookings.filter(booking => {
                    return booking._id !== bookingId;
                });
                return {bookings : updatedBookings, isLoading: false, openSnack: true};
            });
        }).catch(err=> {
            console.log('Error while creating event', err);
            this.setState({isLoading: false, openSnack: true, message: 'Failed to cancel the booking', messageVariant: 'error'});
        }); 
    };

    fetchBookings = () => {
        this.setState({isLoading: true});
        const reqBody = {
            query:`
                query{
                    bookings{
                        _id
                        event{
                            _id
                            title
                            description
                            price
                            date
                        }
                        user{
                            _id
                            email
                        }
                        createdAt
                        updatedAt
                    }
                }
            `
        };

         fetch('http://localhost:3001/api',{
            method: 'POST',
            body: JSON.stringify(reqBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ this.context.token
            }
        }).then(res=> {
            if(res.status !== 200 && res.status !== 201){
                throw new Error('Failed to create event');
            }
            return res.json();
        }).then(resData => {
            this.setState({bookings: resData.data.bookings, isLoading: false});
        }).catch(err=> {
            console.log('Error while creating event', err);
            this.setState({isLoading: false});
        });    
    }

    handleClose = () =>{ 
        this.setState({openSnack: false});
    }

    render(){
        const { activeTab } = this.state;
        return(
            <MuiThemeProvider theme={theme}>
                <main className={classes.main}>
                    <CssBaseline />
                    <Paper className={classes.paper} elevation={2}>
                        {this.state.isLoading ? 
                            <React.Fragment>
                                <Spinner invisible={this.state.isLoading}/>
                            </React.Fragment>
                            :
                            <React.Fragment>
                                <Tabs
                                    value={activeTab}
                                    onChange={this.handleTabChange}
                                    scrollButtons="on"
                                    className={classes.fullWidth}
                                    indicatorColor="primary"
                                    centered
                                    textColor="primary"
                                >
                                    <Tab label="Event List" icon={<List />} />
                                    <Tab label="Event Chart" icon={<BarChart />} />
                                </Tabs>
                                {activeTab === 0 && 
                                    <BookingList classes={classes} onBookingDelete={this.deleteBookingHandler} bookings={this.state.bookings} authUserId={this.context.userId}/>
                                }
                                {activeTab === 1 && 
                                    <BookingsChart classes={classes} bookings={this.state.bookings}/>
                                }
                            </React.Fragment>
                        }
                    </Paper>
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

BookingsPage.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(BookingsPage);