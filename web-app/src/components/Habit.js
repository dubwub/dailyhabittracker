import React, { Component } from 'react';
import axios from 'axios';
import { syncScroll } from '../utils/habits.utils';

const states = ["", "x", "X", "o", "O"];

class HabitEntry extends Component {
    constructor(props) {
        super(props);
        if (props.entry) {
            let entry = props.entry;
            if (entry === true || entry === "true") {
                entry = "x";    // fixing old entries
            } else if (entry === false || entry === "false") {
                entry = "";
            }
            this.state = {
                entry: entry
            };
        } else {
            this.state = {
                entry: ""
            };
        }
    }

    postUpdate(habit, user, day) {
        let stateIndex = states.indexOf(this.state.entry);
        if (stateIndex === states.length - 1) {
            stateIndex = -1;
        }

        this.setState({
            ...this.state,
            entry: states[stateIndex + 1]
        }, () => {
            const entry = this.state.entry;
            const data = {
                entry: entry,
                date: day.format('MM/DD/YYYY'),
                note: ""
            };
            
            console.log("Posting update for " + habit + " on " + data.date + ", entry: " + data.entry);
            axios.post('http://localhost:8082/api/users/' + user + '/habit/' + habit + '/entries', data)
                .then((res) => {
                    console.log("Update posted successfully");
                    console.log(res);   
                }).catch(err => {
                    console.log("Update had an error");
                    console.log(err);
                })
        });
    }

    getClassName() {
            }

    render() {
        let entryDisplay = this.state.entry || "";

        let className = "";
        switch (this.state.entry) {
            case "":
                className = "habit-entry neutral";
                break;
            case "x":
                className = "habit-entry positive";
                break;
            case "X":
                className = "habit-entry very-positive";
                break;
            case "o":
                className = "habit-entry negative";
                break;
            case "O":
                className = "habit-entry very-negative";
                break;
            default:
                className = "habit-entry neutral";
                break;
        }

        return (
            <div className="ctr-entry habit">
                <div className={className} onClick={() => this.postUpdate(this.props.habit, this.props.user, this.props.day)}>{entryDisplay}</div>
            </div>
        );
    }
};

class Habit extends Component { 
    processEntries(entries) {
        let map = {};

        for (let i = 0; i < entries.length; i++) {
            map[entries[i]["date"]] = entries[i]["entry"];
        }
        return map;
    }

    render() {
        const description = this.props.habit.description || "";
        const color = this.props.habit.color || "";

        const dateMap = this.processEntries(this.props.entries);
        return (
            <div className="ctr habit">
                <div className="ctr-header habit">
                    <div className="habit-name" style={{"color": color}}>
                        <h5>{ this.props.habit.name }</h5>
                    </div>
                    <div className="habit-description" style={{"color": color}}>
                        <h6>{ description }</h6>
                    </div>
                </div>
                <div className="ctr-contents habit" onScroll={syncScroll}>
                    { this.props.days.map((date, index) => <HabitEntry user={this.props.user} key={index} day={date} habit={this.props.habit._id} entry={dateMap[date.format("MM/DD/YYYY")]}/>) }
                </div>
            </div>
        )
    }

};

export default Habit;
