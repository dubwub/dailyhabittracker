import React, { Component } from 'react';
import axios from 'axios';
import { syncScroll } from '../utils/habits.utils';
import { connect } from 'react-redux';
import * as mapDispatchToProps from '../actions/index.actions.js'; 

// TODO: how's the best way to handle complex edit forms
const states = ["", "x", "X", "o", "O"];

class Habit extends Component { 
    
    habitEntryClassName(value) {
        switch (value) {
            case "":
                return "habit-entry neutral";
                break;
            case "x":
                return "habit-entry positive";
                break;
            case "X":
                return "habit-entry very-positive";
                break;
            case "o":
                return "habit-entry negative";
                break;
            case "O":
                return "habit-entry very-negative";
                break;
            default:
                return "habit-entry neutral";
                break;
        }
    }

    getNextHabitValue(value) {
        value = value || "";
        let stateIndex = states.indexOf(value);
        if (stateIndex === states.length - 1) {
            stateIndex = -1;
        }
        return states[stateIndex + 1];
    }
    
    render() {
        const color = this.props.color || "";
        return (
            <div className="ctr habit">
                <div className="ctr-header habit">
                    <div className="habit-name" style={{"color": color}}>
                        <h5>{ this.props.name }</h5>
                    </div>
                    <div className="habit-description" style={{"color": color}}>
                        <h6>{ this.props.description || "" }</h6>
                    </div>
                </div>
                <div className="ctr-contents habit" onScroll={syncScroll}>
                    { 
                        this.props.days.map((day) => {
                            const day_fmt = day.format("MM/DD/YYYY");
                            let value = this.props.entries[day_fmt]["entry"];
                            return (
                                <div className="ctr-entry habit" key={day_fmt}>
                                    <div 
                                        className={this.habitEntryClassName(this.props.entries[day_fmt]["entry"])}
                                        onClick={() => this.props.updateEntry(this.props.habit, day, this.getNextHabitValue(this.props.entries[day_fmt]["entry"]))}>
                                        {this.props.entries[day_fmt]["entry"]}
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }

};

function mapStateToProps(state, ownProps) {
    return {
        days: state["days"],
        name: state["habits"][ownProps.habit]["name"],
        description: state["habits"][ownProps.habit]["description"],
        color: state["habits"][ownProps.habit]["color"],
        entries: state["entries"][ownProps.habit]
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Habit);
