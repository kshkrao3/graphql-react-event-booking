import React from 'react';
import List from '@material-ui/core/List';
import PropTypes from 'prop-types';
import EventItem from './EventItem/EventItem';
let classes;

class EventList extends React.Component{
    events = [];
    componentWillReceiveProps(nextProps){
        this.setState({events: nextProps.events});
    }

    constructor(props){
        super(props);
        this.state ={
            events: props.events,
            classes: props.classes
        };
        classes = this.state.classes;
    }

    render(){
        this.events = this.state.events.map(event => {
            const data = {
                eventId: event._id,
                title: event.title,
                creator: event.creator,
                description: event.description,
                date: event.date,
                price: event.price,
                userId: this.props.authUserId
            };
            return <EventItem key={event._id} classes={classes} data={data} onDetail={this.props.onViewDetail}/>
        });
        return(
            <List className={classes.root}>
                {this.events}
            </List>
        );
    }
};

EventList.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  

  export default EventList;