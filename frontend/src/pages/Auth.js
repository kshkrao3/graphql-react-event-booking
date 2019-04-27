import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';

const theme = createMuiTheme({
    palette:{
        primary:blue
    },
    typography: {
        useNextVariants: true,
    }
});
let classes;

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
    avatar: {
      margin: theme.spacing.unit,
      backgroundColor: '#2196f3',
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing.unit,
    },
    submit: {
      marginTop: theme.spacing.unit * 3,
    },
  });
class AuthPage extends React.Component{
    
    state = {
        isLogin: true,

    }

    constructor(props){
        super(props);
        classes = props.classes;
        this.emailEl = React.createRef();
        this.passwordEl = React.createRef();
    }

    switchModeHandler = () => {
        this.setState(prevState=> {
            return {isLogin: !prevState.isLogin};
        })
    };

    submitHandler = (event) => {
        event.preventDefault();
        const email = this.emailEl.current.value;
        const password = this.passwordEl.current.value;

        if(email && password){
            let reqBody = {
                query: `
                    query {
                        login(email: "${email}", password: "${password}"){
                            userId
                            token
                            tokenExpiration
                        }
                    }
                `
            };
            if(!this.state.isLogin){
                reqBody = {
                    query:`
                        mutation{
                            createUser(userInput:{email: "${email}", password: "${password}"}){
                                _id
                                email
                            }
                        }
                    `
                }
            }
            fetch('http://localhost:3001/api',{
                method: 'POST',
                body: JSON.stringify(reqBody),
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(res=> {
                if(res.status !== 200 && res.status !== 201){
                    throw new Error('Failed to create user');
                }
                return res.json();
            }).then(resData => {
                console.log(resData);
            }).catch(err=> {
                console.log('Error while creating user', err);
            });    
        }else{

        }
        
    };

    render(){
        return(
            <MuiThemeProvider theme={theme}>
                <main className={classes.main}>
                    <CssBaseline />
                    <Paper className={classes.paper}>
                        <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                        {!this.state.isLogin ? 'Sign up' : 'Sign in'}
                        </Typography>
                        <form className={classes.form} onSubmit={this.submitHandler}>
                        <FormControl margin="normal" required fullWidth>
                            <InputLabel htmlFor="email">Email Address</InputLabel>
                            <Input id="email" inputRef={this.emailEl} name="email" autoComplete="email" autoFocus />
                        </FormControl>
                        <FormControl margin="normal" required fullWidth>
                            <InputLabel htmlFor="password">Password</InputLabel>
                            <Input name="password" inputRef={this.passwordEl} type="password" id="password" autoComplete="current-password" />
                        </FormControl>
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Submit
                        </Button>
                        <Button
                            type="button"
                            onClick={this.switchModeHandler}
                            fullWidth
                            variant="contained"
                            color="secondary"
                            className={classes.submit}
                        >
                            Switch to {this.state.isLogin ? 'Signup' : 'Signin'}
                        </Button>
                        </form>
                    </Paper>
                </main>
            </MuiThemeProvider>
        );
    }
}

AuthPage.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  

  export default withStyles(styles)(AuthPage);