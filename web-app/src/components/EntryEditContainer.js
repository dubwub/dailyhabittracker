import React, { Component } from 'react';
import { Button, NumericInput, TextArea } from '@blueprintjs/core';

import { connect } from 'react-redux';
import * as mapDispatchToProps from '../actions/index.actions.js'; 

class EntryEditContainer extends Component {
    constructor(props) {
        super(props);
         
        if (props.days.length === 0) {
            console.log("BIG ERROR (this should be thrown): WHY IS DAYS 0???"); 
        }

        this.state = {
            selectedHabit: undefined,
            selectedDate: undefined,
            editedValue: undefined,
            editedNote: undefined,
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.selectedHabit !== prevState.selectedHabit || nextProps.selectedDate !== prevState.selectedDate) {
            const date_fmt = nextProps.selectedDate.format("MM/DD/YYYY");
            return {
                ...prevState,
                selectedHabit: nextProps.selectedHabit || "daily-retro",
                selectedDate: nextProps.selectedDate,
                editedValue: nextProps.entries[nextProps.selectedHabit][date_fmt].value || -1,
                editedNote: nextProps.entries[nextProps.selectedHabit][date_fmt].note || "",
            }
        } else {
            return null;
        }
    }

    onValueChange(value, note) {
        // quick note, if value or note are undefined, they will not be set, so you don't have to worry about
        // accidentally setting the value if you only want to update the note.
        let newState = {
            ...this.state
        };
        if (value) { newState["editedValue"] = value; }
        if (note) { newState["editedNote"] = note; }

        this.setState(newState);
        this.props.updateEntry(this.props.selectedHabit, this.props.selectedDate, value, note);
    }

    render() {
        let displayText = "";
        if (this.props.selectedDate) {
            displayText = "Selected day: " + this.props.selectedDate.format("MM/DD") + ", habit: " + this.props.selectedHabit;
        }

        return (
            <div className="ctr retro">
                <div className="retro-top">
                    <div>
                        <Button icon="collapse-all"
                                intent="primary"
                                style={{
                                    "position": "absolute",
                                    "top": 0,
                                    "right": 0
                                }}
                                onClick={() => this.props.selectEntry(undefined, undefined)}
                                >Collapse</Button>
                        <b>{displayText}</b>
                        <NumericInput
                            allowNumericCharactersOnly={false}
                            value={this.state.editedValue}
                            onValueChange={(value) => this.onValueChange(value, undefined)}
                        />
                    </div>
                </div>
                <div className="retro-bottom">
                    <TextArea style={{"width":"100%", "height":"100%"}}
                        value={this.state.editedNote} 
                        onChange={(e) => this.onValueChange(undefined, e.target.value)}
                        />
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        days: state.days,
        entries: state.entries,
        selectedDate: state.dateOfSelectedEntry,
        selectedHabit: state.habitOfSelectedEntry
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(EntryEditContainer);
