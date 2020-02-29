import React, { Component } from 'react';
import axios from 'axios';
import { syncScroll } from '../utils/habits.utils';
import { connect } from 'react-redux';
import * as mapDispatchToProps from '../actions/index.actions.js'; 
import { Button } from "@blueprintjs/core";

// assumptions
const MIN_HABIT_SCORE = 1;
const DEFAULT_HABIT_SCORE = 3;
const MAX_HABIT_SCORE = 5;

class Habit extends Component { 
    
    constructor(props) {
        super(props);

        this.state = {
            edit_mode: false
        };
    }

    toggleEditMode() {
        console.log("Toggling: " + this.props.habit + " to edit mode: " + !this.state.edit_mode);
        this.setState({
            ...this.state,
            edit_mode: !this.state.edit_mode
        });
    }

    habitEntryClassName(value) {
        // TODO: remove bp3-intent-primary, hack to get the text inside to be white
        let className = "bp3-minimal bp3-outlined habit-entry ";
        switch (value) {
            case 1:
                return className + "very-negative bp3-icon-heart-broken";
                break;
            case 2:
                return className + "negative bp3-icon-cross";
                break;
            case 3:
                return className + "neutral";
                break;
            case 4:
                return className + "positive bp3-icon-tick";
                break;
            case 5:
                return className + "very-positive bp3-icon-clean";
                break;
            default:
                return className + "neutral";
        }
    }

    getNextHabitValue(value) {
        value = value || DEFAULT_HABIT_SCORE;
        value++;

        if (value > MAX_HABIT_SCORE) {
            value = MIN_HABIT_SCORE;
        }

        return value;
    }
    
    render() {
        const color = this.props.color || "";
        const className = this.state.edit_mode ? "habit-edit-mode" : "habit";

        let editForm = (<div></div>);
        if (this.state.edit_mode) {
            editForm = (
                <div>
                    <input type="text" ref="habit-name" placeholder="Name of habit" />
                    <input type="text" ref="habit-description" placeholder="Habit description" />
                    <input type="text" ref="habit-color" placeholder="Color of habit (red/blue)" />
                    <input type='submit' className='btn' onClick={() => this.props.updateHabit(this.props.habit, this.refs["habit-name"].value, this.refs["habit-description"].value, this.refs["habit-color"].value)}/>
                </div>
            );
        }

        return (
            <div className={"ctr " + className}>
                <div className={"ctr-header " + className}>
                    <div className="habit-name" style={{"color": color}}>
                        <h5>{ this.props.name }</h5>
                    </div>
                    <div className="habit-description" style={{"color": color}}>
                        <h6>{ this.props.description || "" }</h6>
                        <input type="button" onClick={() => this.toggleEditMode()} value={"Toggle edit mode: " + this.state.edit_mode}/>
                        { editForm }
                    </div>
                </div>
                <div className={"ctr-contents " + className} onScroll={syncScroll}>
                    { 
                        this.props.days.map((day) => {
                            const day_fmt = day.format("MM/DD/YYYY");
                            let value = this.props.entries[day_fmt]["entry"];
                            return (
                                <div className={"ctr-entry " + className} key={day_fmt}>
                                    <Button    
                                        className={this.habitEntryClassName(this.props.entries[day_fmt]["entry"])}
                                        onClick={() => this.props.updateEntry(this.props.habit, day, this.getNextHabitValue(this.props.entries[day_fmt]["entry"]))}>
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
        name: state["habits"][ownProps.habit]["name"],
        description: state["habits"][ownProps.habit]["description"],
        color: state["habits"][ownProps.habit]["color"],
        entries: state["entries"][ownProps.habit]
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Habit);
