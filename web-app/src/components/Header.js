import React, { Component } from 'react';
import { syncScroll } from '../utils/habits.utils';
import { connect } from 'react-redux';
import * as mapDispatchToProps from '../actions/index.actions.js'; 

class DateLabel extends Component {
    render() {
        let className = "ctr-entry header-date-label";
        if (
            this.props.dayOfSelectedEntry &&
            this.props.dayOfSelectedEntry.format('MM/DD/YYYY') === this.props.day.format('MM/DD/YYYY') && this.props.habitOfSelectedEntry === "daily-retro") {
            className += " retro-top-selected";
        }
        return (
            <div className={className}>
                { this.props.day.format('ddd M/D') }    
            </div>
        )
    }
}

class DailyRetro extends Component {
    render() {
        return (
            <div className="ctr-entry header-retro">
                { this.props.value }
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
                    {
                        this.props.days.map((day, index) => (
                                <div onClick={() => this.props.selectEntry(day, "daily-retro")} key={index}>
                                    <DateLabel dayOfSelectedEntry={this.props.dayOfSelectedEntry} habitOfSelectedEntry={this.props.habitOfSelectedEntry} day={day} />
                                    <DailyRetro dayOfSelectedEntry={this.props.dayOfSelectedEntry} habitOfSelectedEntry={this.props.habitOfSelectedEntry} value={this.props.entries[day.format("MM/DD/YYYY")]["entry"] || -1} />
                                </div>    
                            )
                        )
                    }
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    console.log("rerender");
    return {
        days: state.days,
        entries: state.entries["daily-retro"],
        dayOfSelectedEntry: state.dayOfSelectedEntry,
        habitOfSelectedEntry: state.habitOfSelectedEntry
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
