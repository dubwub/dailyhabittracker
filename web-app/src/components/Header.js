import React, { Component } from 'react';
import { syncScroll } from '../utils/habits.utils';

class DateLabel extends Component {
    render() {
        return (
            <div className="ctr-entry header">
                { this.props.date }    
            </div>
        )
    }
}

class Header extends Component {
    render() {
        return (
            <div className="ctr header">
                <div className="ctr-header header" />
                <div className="ctr-contents header" onScroll={syncScroll}>
                    { this.props.days.map((date, index) => <DateLabel key={index} date={date.format('ddd MM/DD')} />) }
                </div>
            </div>
        )
    }
}

export default Header;
