import React, { Component } from 'react';
import { Button, Checkbox, NumericInput, TextArea } from '@blueprintjs/core';
import { getThresholdFromValue } from '../utils/habits.utils';
import _ from 'lodash';

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
            editedTags: undefined,
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.selectedHabit !== prevState.selectedHabit || nextProps.selectedDate !== prevState.selectedDate) {
            const date_fmt = nextProps.selectedDate.format("MM/DD/YYYY");
            const entry = nextProps.entries[nextProps.selectedHabit][date_fmt];
            return {
                ...prevState,
                selectedHabit: nextProps.selectedHabit || "daily-retro",
                selectedDate: nextProps.selectedDate,
                editedValue: entry.value || -1,
                editedNote: entry.note || "",
                editedTags: entry.tags || [],
            }
        } else {
            return null;
        }
    }

    onValueChange(value, note, tags) {
        // quick note, if value or note are undefined, they will not be set, so you don't have to worry about
        // accidentally setting the value if you only want to update the note.
        let newState = {
            ...this.state
        };
        if (!_.isNil(value)) { newState["editedValue"] = value; }
        if (!_.isNil(note)) { newState["editedNote"] = note; }
        if (!_.isNil(tags)) { newState["editedTags"] = tags; }

        this.setState(newState);
        this.props.updateEntry(this.props.selectedHabit, this.props.selectedDate, value, note, tags);
    }

    handleTagCheckboxChange(tag, checked) {
        if (checked) {
            let newTags = this.state.editedTags;
            newTags.push(tag);
            this.onValueChange(undefined, undefined, newTags);
        } else {
            let newTags = this.state.editedTags.filter((t) => (t !== tag));
            this.onValueChange(undefined, undefined, newTags);
        }
    }

    render() {
        let displayText = "";
        let quickAddButtons = [];
        let tagCheckboxes = [];
        if (!_.isNil(this.props.selectedDate)) {
            displayText = "Selected day: " + this.props.selectedDate.format("MM/DD");
        }
        if (!_.isNil(this.props.selectedHabit) && this.props.selectedHabit !== "daily-retro") {
            const habit = this.props.habits[this.props.selectedHabit];
            displayText += ", habit-title: " + habit.title + ", habit-description: " + habit.description;

            let thresholds = this.props.thresholds;
            for (let i = 1; i <= 5; i++) {
                quickAddButtons.push((
                    <Button key={i}
                            onClick={() => this.onValueChange(i, undefined, undefined)}
                            style={{"backgroundColor": getThresholdFromValue(thresholds, i).color}}
                            icon={getThresholdFromValue(thresholds, i).icon}>{i}</Button>
                ))
            }

            let tags = this.props.tags;
            for (let i = 0; i < tags.length; i++) {
                tagCheckboxes.push((
                    <Checkbox key={i}
                              checked={this.state.editedTags.indexOf(tags[i]._id) !== -1}
                              onChange={(e) => this.handleTagCheckboxChange(tags[i]._id, e.target.checked)}
                              tag={ tags[i]._id }>
                        { tags[i].title }
                    </Checkbox>
                ));
            }
        } else if (!_.isNil(this.props.selectedHabit) && this.props.selectedHabit === "daily-retro") {
            displayText += " (daily-retro)";
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
                            onValueChange={(value) => this.onValueChange(value, undefined, undefined)}
                        />
                        <b>Quick value change dial: </b>
                        { quickAddButtons }
                        <b>Tag editor:</b>
                        { tagCheckboxes }
                    </div>
                </div>
                <div className="retro-bottom">
                    <TextArea style={{"width":"100%", "height":"100%"}}
                        value={this.state.editedNote} 
                        onChange={(e) => this.onValueChange(undefined, e.target.value, undefined)}
                        />
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    let tags = [];
    let thresholds = [];
    if (!_.isNil(state.habitOfSelectedEntry)) {
        thresholds = state.habits[state.habitOfSelectedEntry].thresholds || [];
        tags = state.habits[state.habitOfSelectedEntry].tags || [];
    }

    return {
        days: state.days,
        entries: state.entries,
        habits: state.habits,
        thresholds: thresholds,
        tags: tags,
        selectedDate: state.dateOfSelectedEntry,
        selectedHabit: state.habitOfSelectedEntry
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(EntryEditContainer);
