import React, { Component } from 'react';
import axios from 'axios';
import { syncScroll } from '../utils/habits.utils';

class HabitEntry extends Component {
    constructor(props) {
        super(props);
        if (props.entry) {
            this.state = {
                entry: props.entry
            };
        } else {
            this.state = {
                entry: false
            };
        }
    }

    postUpdate(habit, user, day) {
        const entry = this.refs.checkbox.checked;
        const data = {
            entry: entry,
            date: day.format('MM/DD/YYYY'),
            note: ""
        };
        
        console.log("Posting update for " + habit + " on " + data.date + ", entry: " + data.entry);
        axios.post('http://localhost:8082/api/users/' + user + '/habit/' + habit + '/entries', data)
            .then(res => {
                this.setState({
                    ...this.state,
                    entry: data.entry
                });
                console.log("Update posted successfully");
                console.log(res);   
            }).catch(err => {
                console.log("Update had an error");
                console.log(err);
            })
    }

    checkboxIsChecked() {
        if (this.state.entry === true || this.state.entry === "true") {
            return true;
        } else {
            return false;
        }
    }

    render() {
        return (
            <div className="ctr-entry habit">
                <input type="checkbox" ref="checkbox" checked={this.checkboxIsChecked()} onChange={() => this.postUpdate(this.props.habit, this.props.user, this.props.day)} />
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
        console.log('rendering habit');
        const dateMap = this.processEntries(this.props.entries);
        return (
            <div className="ctr habit">
                <div className="ctr-header habit">
                    <div className="habit-name">
                        <h5>{ this.props.habit.name }</h5>
                    </div>
                    <div className="habit-description">
                        <h6>description goes here</h6>
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
