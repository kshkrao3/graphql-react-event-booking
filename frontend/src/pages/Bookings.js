import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import AuthContext from '../context/auth-context';
import Spinner from '../components/Spinner/Spinner';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import Paper from '@material-ui/core/Paper';
import CssBaseline from '@material-ui/core/CssBaseline';

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
class BookingsPage extends React.Component{

    state = {
        isLoading: false,
        bookings: []
    };

    static contextType = AuthContext;

    constructor(props){
        super(props);
        classes = props.classes;
    }

    componentDidMount(){
        this.fetchBookings();
    }

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

    render(){
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
                                <List className={[classes.root, classes.fullWidth].join(' ')}>
                                    {this.state.bookings.map(booking => {
                                        return(
                                            <ListItem key={booking._id}>
                                                <Avatar>
                                                    <ImageIcon />
                                                </Avatar>
                                                <ListItemText primary={booking.event.title} secondary={new Date(booking.createdAt).toLocaleDateString()} />
                                            </ListItem>
                                        );
                                    })}
                                </List>
                            </React.Fragment>
                        }
                    </Paper>
                </main>
            </MuiThemeProvider>
            
        );
    }
}

BookingsPage.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(BookingsPage);