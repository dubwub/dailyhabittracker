import React, { Component } from 'react';
import axios from 'axios';

class HabitEntry extends Component {
    postUpdate(habit, day) {
        const entry = this.refs.checkbox.checked;
        const data = {
            entry: entry,
            date: day,
            note: ""
        };
        
        console.log("Posting update for " + habit + " on " + day + ", entry: " + entry);
        axios.post('http://localhost:8082/api/users/5e041c1f66574a2b2cdc02f4/habit/' + habit, data)
            .then(res => {
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
                <input type="checkbox" ref="checkbox" onClick={() => this.postUpdate(this.props.habit, this.props.day)} />
            </div>
        );
    }
};

class Habit extends Component {
    render() {
        const { habit } = this.props;

        return (
            <div className="habit">
                <div className="habit-header">
                    <div className="habit-name">
                        { habit.name }
                    </div>
                    <div className="habit-description">
                        { habit.description }
                    </div>
                </div>
                <div className="habit-entries">
                    { this.props.days.map((date, index) => <HabitEntry key={index} day={date} habit={habit._id} />) }
                </div>
            </div>
        )
    }

};

export default Habit;
