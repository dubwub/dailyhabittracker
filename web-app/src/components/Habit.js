import React, { Component } from 'react';

class HabitEntry extends Component {
    postUpdate(habit, day) {
        console.log("Posted update for " + habit + " on " + day);
    }

    render() {
        return (
            <div className="habit-entry">
                <input type="checkbox" onClick={() => this.postUpdate(this.props.habit, this.props.day)} />
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
