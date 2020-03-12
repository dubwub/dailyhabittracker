import React, { Component } from 'react';
import { Button, Colors, Dialog, Card, Icon } from '@blueprintjs/core';
// import CalendarHeatmap from 'react-calendar-heatmap';
// import 'react-calendar-heatmap/dist/styles.css';
import * as moment from "moment";

import { connect } from 'react-redux';
import * as mapDispatchToProps from '../actions/index.actions.js'; 
import { getThresholdFromValue, returnLastXDays } from '../utils/habits.utils.js';

class HabitBreakdownDialog extends Component {

    dialogTitle() {
        if (this.props.habit) {
            return "Breaking down habit: " + this.props.habit.title;
        } else {
            return "User breakdown";
        }
    }

    entriesAsList() {
        let output = [];
        if (this.props.entries) {
            for (let i = 0; i < this.props.days.length; i++) {
                const day_fmt = this.props.days[i].format("MM/DD/YYYY");
                if (this.props.entries[day_fmt] && (this.props.entries[day_fmt].value || this.props.entries[day_fmt].note)) {
                    output.push({
                        date: this.props.days[i],
                        value: this.props.entries[day_fmt].value,
                        note: this.props.entries[day_fmt].note,
                    })
                }
            }
        }
        return output;
    }

    renderEntryCalendar() {
        const entryList = this.entriesAsList();
        const firstDate = this.props.days[this.props.days.length - 1]; // top left is firstDate

        let thresholds = [];
        if (this.props.habit) {
            thresholds = this.props.habit.thresholds;
        }

        let entryButtons = [];
        let labels = [];

        const daysOfWeek = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
        for (let i = 0; i < daysOfWeek.length; i++) {
            labels.push((
                <div style={{position: "absolute", left: 0, top: 40 * i + 50}}>
                    { daysOfWeek[i] }
                </div>
            ))
        }

        for (let i = this.props.days.length - 1; i >= 0; i--) { // days are in reverse order, so go chronologically
            let backgroundColor = Colors.GRAY5;
            let icon = "";
            let entryValue = undefined;
            let entryNote = undefined;
            if (this.props.entries && this.props.entries[this.props.days[i].format("MM/DD/YYYY")] &&
                this.props.entries[this.props.days[i].format("MM/DD/YYYY")].value) {
                let entry = this.props.entries[this.props.days[i].format("MM/DD/YYYY")];
                let relevantThreshold = getThresholdFromValue(thresholds, entry.value);
                backgroundColor = relevantThreshold.color;
                icon = relevantThreshold.icon;
                entryValue = entry.value;
                entryNote = entry.note;
            }

            let monthPadding = 0;
            if (this.props.days[i].dayOfYear() - 90 < 0) {
                monthPadding = 40 * (this.props.days[i].month() + 12 - firstDate.month())
            } else {
                monthPadding = 40 * (this.props.days[i].month() - firstDate.month())
            }
            
            let top = ((this.props.days[i].weekday() + 1) % 7) * 40 + 50;
            let left = Math.floor((this.props.days[i].diff(firstDate, 'days')) / 7) * 40 + monthPadding + 50;

            if (i === (this.props.days.length - 1) || this.props.days[i].date() === 1) {
                labels.push((
                    <div style={{position: "absolute", left: left, top: 0}}>
                        { months[this.props.days[i].month()] }
                    </div>
                ))
            }

            entryButtons.push((
                <Button style={{
                            width: 10,
                            height: 10,
                            backgroundColor: backgroundColor,
                            position: "absolute",
                            top: top,
                            left: left,
                        }}
                        minimal={true}>
                    { this.props.days[i].format("DD") }
                    <Icon icon={ icon } />
                    {
                        entryNote ? <Icon icon={"annotation"} /> : <span />
                    }
                </Button>
            ))
        }


        return (
            <div style={{position: "relative", width: "100%", height: "100%"}}>
                { labels }
                { entryButtons }
            </div>
        )
    }

    render() {
        return (
            <Dialog 
                isOpen={this.props.showDialog}
                canOutsideClickClose={true}
                canEscapeKeyClose={true}
                isCloseButtonShown={true}
                onClose={() => this.props.selectHabitForBreakdown(undefined, false)}
                style={{
                    "width": 800
                }}
                title={this.dialogTitle()}>
                    <h1>Recent Entry Heatmap</h1>
                    <div style={{width: "100%", height: "400px", padding: "20px"}}>
                        { this.renderEntryCalendar() }
                    </div>
                    <h1>Recent Notes</h1>
                    {
                        this.entriesAsList().filter(entry => entry.note).map((entry, index) => (
                            <Card key={index}>
                                <h2>{entry.value}</h2>
                                <h4>{entry.note}</h4>
                            </Card>
                        ))
                    }
            </Dialog>
        );
    }
}

function mapStateToProps(state) {
    let habit = undefined;
    let entries = undefined;
    if (state.selectedHabitForBreakdown) {
        habit = state.habits[state.selectedHabitForBreakdown];
        entries = state.entries[state.selectedHabitForBreakdown];
    }

    return {
        // categoryOrder: state.categoryOrder,
        // categories: state.categories,
        days: returnLastXDays(90),
        selectedHabitForBreakdown: state.selectedHabitForBreakdown,
        showDialog: state.showHabitBreakdownDialog,
        habit: habit,
        entries: entries,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(HabitBreakdownDialog);
