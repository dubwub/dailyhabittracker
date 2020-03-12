import React, { Component } from 'react';
import { Button, Dialog, FormGroup, ControlGroup, TextArea, InputGroup, Icon, NumericInput, HTMLSelect } from '@blueprintjs/core';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

import { connect } from 'react-redux';
import * as mapDispatchToProps from '../actions/index.actions.js'; 
import { returnLastXDays } from '../reducers/index.reducers.js';

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
                if (this.props.entries[day_fmt] && this.props.entries[day_fmt].value) {
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

    recentEntries() {
        // console.log(this.props.entries);
        let recentEntries = [];
        let maxReturnSize = 5; 
        if (this.props.entries) {
            for (let i = 0; i < this.props.days.length; i++) {
                const day_fmt = this.props.days[i].format("MM/DD/YYYY");
                if (this.props.entries[day_fmt] && this.props.entries[day_fmt].note) {
                    recentEntries.push(this.props.entries[day_fmt]);
                    if (recentEntries.length >= maxReturnSize) {
                        break;
                    }
                }
            }
        }
        return recentEntries;
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
                    {
                        this.recentEntries().map((entry, index) => (
                            <div key={index}>
                                <h3>{entry.value}</h3>
                                <h4>{entry.note}</h4>
                            </div>
                        ))
                    }
                    <div style={{width: "200px", height: "200px"}}>
                    <CalendarHeatmap
                        startDate={this.props.days[this.props.days.length - 1].toDate()} 
                        endDate={this.props.days[0].toDate()}
                        showWeekdayLabels={true}
                        values={this.entriesAsList().map((entry, index) => ({
                                date: this.props.days[index].format('YYYY-MM-DD'),
                                count: entry.value,
                            })
                        )}
                        classForValue={(value) => {
                            if (!value) {
                            return 'color-empty';
                            }
                            return `color-scale-${value.count%4 + 1}`;
                        }}
                    />
                    </div>
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
