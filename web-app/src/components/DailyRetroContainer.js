import axios from 'axios';
import React, { Component } from 'react';
import { syncScroll } from '../utils/habits.utils';

import { connect } from 'react-redux';
import * as mapDispatchToProps from '../actions/index.actions.js'; 

const moment = require('moment');

class DailyRetroContainer extends Component {
    constructor(props) {
        super(props);
         
        if (props.days.length === 0) {
            console.log("BIG ERROR (this should be thrown): WHY IS DAYS 0???"); 
        }
        this.state = {
            selected_day_index: 0 // dailyretroctr should only load if overview 
        }
    }

    updateDaySelection(index) {
        console.log("changing selected day to: " + this.props.days[index].format("MM/DD/YY"));
                     
        this.setState({
            ...this.state,
            selected_day_index: index
        });
    }

    dayHasEntry(day) {
        return this.props.entries[day.format("MM/DD/YYYY")]["entry"] || this.props.entries[day.format("MM/DD/YYYY")]["note"];
    }

    render() {
        let displayText = "";
        if (this.props.dayOfSelectedEntry) {
            displayText = "Selected day: " + this.props.dayOfSelectedEntry.format("MM/DD") + ", habit: " + this.props.habitOfSelectedEntry;
        }

        return (
            <div className="ctr retro">
                <div className="retro-top">
                    <div>
                        <b>{displayText}</b>
                        Add selector
                    </div>
                </div>
                <div className="retro-bottom">
                    <textarea style={{"width":"100%", "height":"100%"}} ref="retro-textbox" value={this.props.entries[this.props.days[this.state.selected_day_index].format("MM/DD/YYYY")]["note"] || ""} 
                        onChange={(e) => this.props.updateNote(undefined, this.props.days[this.state.selected_day_index], e.target.value)}/>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        days: state.days,
        entries: state.entries["daily-retro"],
        dayOfSelectedEntry: state.dayOfSelectedEntry,
        habitOfSelectedEntry: state.habitOfSelectedEntry
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DailyRetroContainer);
