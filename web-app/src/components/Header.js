import React, { Component } from 'react';
import { syncScroll } from '../utils/habits.utils';
import { connect } from 'react-redux';
import * as mapDispatchToProps from '../actions/index.actions.js'; 

class DateLabel extends Component {
    render() {
        return (
            <div className="ctr-entry header">
                { this.props.day }    
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
                    { this.props.days.map((day, index) => <DateLabel key={index} day={day.format('ddd MM/DD')} />) }
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        days: state.days
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
