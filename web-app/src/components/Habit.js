import React, { Component } from 'react';
import axios from 'axios';

class HabitEntry extends Component {
    constructor(props) {
        super(props);
        console.log(props);
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

    render() {
        return (
            <div className="habit-entry">
                <input type="checkbox" ref="checkbox" checked={this.state.entry} onChange={() => this.postUpdate(this.props.habit, this.props.user, this.props.day)} />
            </div>
        );
    }
};

class Habit extends Component {
    processEntries(entries) {
        let map = {};

        for (let i = 0; i < entries.length; i++) {
            map[entries[i]["date"]] = entries[i]["value"];
        }

        return map;
    }

    render() {
        const dateMap = this.processEntries(this.props.entries);

        return (
            <div className="habit">
                <div className="habit-header">
                    <div className="habit-name">
                        { this.props.name }
                    </div>
                    <div className="habit-description">
                        { this.props.description }
                    </div>
                </div>
                <div className="habit-entries">
                    { this.props.days.map((date, index) => <HabitEntry user={this.props.user} key={index} day={date} habit={this.props.habit._id} entry={dateMap[date.format("MM/DD/YYYY")]}/>) }
                </div>
            </div>
        )
    }

};

export default Habit;
