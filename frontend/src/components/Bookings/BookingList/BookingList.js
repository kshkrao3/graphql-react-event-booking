import React from 'react';
import List from '@material-ui/core/List';
import PropTypes from 'prop-types';
import BookingItem from './BookingItem/BookingItem';
let classes;

class BookingList extends React.Component{
    bookings = [];
    componentWillReceiveProps(nextProps){
        this.setState({bookings: nextProps.bookings});
    }

    constructor(props){
        super(props);
        this.state ={
            bookings: props.bookings,
            classes: props.classes
        };
        classes = this.state.classes;
    }

    render(){
        this.bookings = this.state.bookings.map(booking => {
            const data = {
                bookingId: booking._id,
                title: booking.event.title,
                createdAt: booking.createdAt
            };
            return <BookingItem key={booking._id} classes={classes} data={data} onDelete={this.props.onBookingDelete}/>
        });
        return(
            <List className={[classes.root, classes.fullWidth].join(' ')}>
                {this.bookings}
            </List>
        );
    }
};

BookingList.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  

  export default BookingList;