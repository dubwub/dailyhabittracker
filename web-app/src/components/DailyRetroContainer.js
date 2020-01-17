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
        return (
            <div className="ctr retro">
                <div className="retro-top">
                    <div className="ctr-header retro-top" />
                    <div className="ctr-contents retro-top" onScroll={syncScroll}>
                        { this.props.days.map((day, index) => <div className={"ctr-entry retro-top" + (index === this.state.selected_day_index ? " retro-top-selected" : "") + (this.dayHasEntry(day) ? " retro-top-has-entry":"")} onClick={() => this.updateDaySelection(index)} day={day} key={index}>{day.format('MM/DD/YY')}
                            <select value={this.props.entries[day.format("MM/DD/YYYY")]["entry"] || ""} onChange={(e) => this.props.updateEntry(undefined, this.props.days[this.state.selected_day_index], e.target.value)}>
                                <option value=""></option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9">9</option>
                                <option value="10">10</option>
                            </select>
                        </div>) }
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
        entries: state.entries["daily-retro"]
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DailyRetroContainer);
