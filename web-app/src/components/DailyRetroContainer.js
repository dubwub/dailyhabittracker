import axios from 'axios';
import React, { Component } from 'react';
import { syncScroll } from '../utils/habits.utils';

import { connect } from 'react-redux';
import * as mapDispatchToProps from '../actions/index.actions.js'; 

const moment = require('moment');

class DailyRetroContainer extends Component {i
    constructor(props) {
        super(props);
        this.state = {
            selected_day: props.days && props.days.length > 0 ? props.days[0] : moment().format('MM/DD/YYYY')
        }
    }

    updateDaySelection(day) {
        console.log("changing selected day to: " + day);
                     
        this.setState({
            ...this.state,
            selected_day: day
        });
    }

    dayHasEntry(day) {
        if (this.props.entries) {
            return (typeof this.props.entries[day] !== "undefined") && (this.props.entries[day].note !== "");
        }
        return false;
    }

    render() {
        let selected_note = "";
        if (this.state.selected_day in this.props.entries && this.props.entries[this.state.selected_day].note) {
            selected_note = this.props.entries[this.state.selected_day].note;
        }

        return (
            <div className="ctr retro">
                <div className="retro-top">
                    <div className="ctr-header retro-top" />
                    <div className="ctr-contents retro-top" onScroll={syncScroll}>
                        { this.props.days.map((day, index) => <div className={"ctr-entry retro-top" + (day === this.state.selected_day ? " retro-top-selected" : "") + (this.dayHasEntry(day) ? " retro-top-has-entry":"")} onClick={() => this.updateDaySelection(day)} day={day} key={index}>{day.format('MM/DD/YY')}
                            <select value={this.props.entries[day] ? this.props.entries[day]["entry"] : ""} onChange={(e) => this.props.updateEntry(undefined, this.state.selected_day, e.target.value)}>
                                <option value=""></option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">5</option>
                                <option value="7">5</option>
                                <option value="8">5</option>
                                <option value="9">5</option>
                                <option value="10">10</option>
                            </select>
                        </div>) }
                    </div>
                </div>
                <div className="retro-bottom">
                    <textarea style={{"width":"100%", "height":"100%"}} ref="retro-textbox" value={selected_note} onChange={(e) => this.updateEntryForSelectedDay(this.props.user, "note", e)}/>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        days: state.days,
        entries: state.entries["daily-retro"] ? state.entries["daily-retro"] : {}
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DailyRetroContainer);
