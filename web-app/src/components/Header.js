import React, { Component } from 'react';

class DateLabel extends Component {
    render() {
        return (
            <div className="header-date-label">
                { this.props.date }    
            </div>
        )
    }
}

class Header extends Component {
    render() {
        return (
            <div className="header">
                <div className="header-padding" />
                <div className="header-date-labels">
                    { this.props.days.map((date, index) => <DateLabel key={index} date={date.format('MM/DD/YY')} />) }
                </div>
            </div>
        )
    }
}

export default Header;
