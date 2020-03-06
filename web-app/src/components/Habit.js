import React, { Component } from 'react';
import axios from 'axios';
import { syncScroll } from '../utils/habits.utils';
import { connect } from 'react-redux';
import * as mapDispatchToProps from '../actions/index.actions.js'; 
import { Button } from "@blueprintjs/core";

// assumptions
// const MIN_HABIT_SCORE = 1;
// const DEFAULT_HABIT_SCORE = 3;
// const MAX_HABIT_SCORE = 5;

class Habit extends Component { 
    
    constructor(props) {
        super(props);
    }

    toggleEditMode() {
        this.props.selectHabitForEdit(this.props.habit, true);
    }

    habitEntryStyle(value) {
        if (!value) {
            return {
                color: "",
                icon: ""
            };
        }
        for (let i = 0; i < this.props.thresholds.length; i++) {
            switch (this.props.thresholds[i].condition) {
                case 'lt':
                    if (value < this.props.thresholds[i].maxValue) {
                        return {
                            color: this.props.thresholds[i].color,
                            icon: this.props.thresholds[i].icon
                        }
                    }
                    break;
                case 'le':
                    if (value <= this.props.thresholds[i].maxValue) {
                        return {
                            color: this.props.thresholds[i].color,
                            icon: this.props.thresholds[i].icon
                        }
                    }
                    break;
                case 'eq':
                    if (value === this.props.thresholds[i].maxValue) {
                        return {
                            color: this.props.thresholds[i].color,
                            icon: this.props.thresholds[i].icon
                        }
                    }
                    break;
                case 'ge':
                    if (value >= this.props.thresholds[i].minValue) {
                        return {
                            color: this.props.thresholds[i].color,
                            icon: this.props.thresholds[i].icon
                        }
                    }
                    break;
                case 'gt':
                    if (value > this.props.thresholds[i].minValue) {
                        return {
                            color: this.props.thresholds[i].color,
                            icon: this.props.thresholds[i].icon
                        }
                    }
                    break;
                case 'between':
                    if (this.props.thresholds[i].minValue <= value <= this.props.thresholds[i].maxValue) {
                        return {
                            color: this.props.thresholds[i].color,
                            icon: this.props.thresholds[i].icon
                        }
                    }
                    break;
            } 
        }
        return {
            color: "",
            icon: ""
        }
    }

    render() {
        const color = this.props.color || "";

        return (
            <div className={"ctr habit"}>
                <div className={"ctr-header habit"}>
                    <div className="habit-title" style={{"color": color}}>
                        <h5>{ this.props.title }</h5>
                    </div>
                    <div className="habit-description" style={{"color": color}}>
                        <h6>{ this.props.description || "" }</h6>
                        <Button 
                            onClick={() => this.props.selectHabitForEdit(this.props.habit, true)}
                            icon={"edit"} />
                    </div>
                </div>
                <div className={"ctr-contents habit"} onScroll={syncScroll}>
                    { 
                        this.props.days.map((day) => {
                            const day_fmt = day.format("MM/DD/YYYY");
                            let value = this.props.entries[day_fmt]["value"];
                            return (
                                <div className={"ctr-entry habit"} key={day_fmt}>
                                    <Button    
                                        className={"bp3-minimal bp3-outlined habit-entry"}
                                        icon={this.habitEntryStyle(value).icon}
                                        style={{"backgroundColor": this.habitEntryStyle(value).color}}
                                        onClick={() => this.props.selectEntry(day, this.props.habit)}>
                                    </Button>
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
        title: state["habits"][ownProps.habit]["title"],
        description: state["habits"][ownProps.habit]["description"],
        color: state["habits"][ownProps.habit]["color"],
        thresholds: state["habits"][ownProps.habit]["thresholds"],
        entries: state["entries"][ownProps.habit]
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Habit);
