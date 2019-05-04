import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import ChromeReaderMode from '@material-ui/icons/ChromeReaderMode';
let classes;

class EventItem extends React.Component{
    
    componentWillReceiveProps(nextProps){
        this.setState({data: nextProps.data});
    }

    constructor(props){
        super(props);
        this.state = {
            data: props.data,
            classes: props.classes
        };
        classes = this.state.classes;
    }

    render(){
        return(
            <React.Fragment key={this.state.data.eventId}>
                <ListItem alignItems="flex-start">
                    <ListItemText
                    primary={this.state.data.title}
                    secondary={
                        <React.Fragment>
                            <Grid component="span" container spacing={8}>
                                <Grid className={classes.marginTop10} component="span" item xl={9} lg={7} md={6} sm={12} xs={12}>
                                    <Typography component="span" className={classes.inline} color="textPrimary">
                                        {this.state.data.description}
                                    </Typography>
                                    <span>
                                    {this.state.data.creator.email}
                                    </span>
                                    <Typography component="span" className={classes.inline}>
                                        ${this.state.data.price} - {new Date(this.state.data.date).toLocaleDateString()}
                                    </Typography>
                                </Grid>
                                <Grid component="span" item xl={3} lg={5} md={6} sm={12} xs={12} className={classes.right}>
                                    <React.Fragment>
                                        {this.state.data.userId === this.state.data.creator._id ?
                                            <Typography component="span" className={classes.inline}>
                                                You are the creator of this event
                                            </Typography> 
                                            :
                                            <Fab variant="extended"
                                                size="small"
                                                color="primary"
                                                aria-label="View Details"
                                                onClick={this.props.onDetail.bind(this, this.state.data.eventId)}
                                                className={[classes.margin, classes.button].join(' ')}>
                                                <ChromeReaderMode className={classes.extendedIcon}/>
                                                View Details
                                            </Fab>
                                        }
                                    </React.Fragment>
                                </Grid>
                            </Grid>
                        </React.Fragment>
                    }
                    />
                </ListItem>
                <Divider/>
            </React.Fragment>
        );
    }
};

EventItem.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  

  export default EventItem;