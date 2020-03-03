import axios from 'axios';
import React, { Component } from 'react';
import { syncScroll } from '../utils/habits.utils';
import { NumericInput, TextArea } from '@blueprintjs/core';

import { connect } from 'react-redux';
import * as mapDispatchToProps from '../actions/index.actions.js'; 

const moment = require('moment');

class EntryEditContainer extends Component {
    constructor(props) {
        super(props);
         
        if (props.days.length === 0) {
            console.log("BIG ERROR (this should be thrown): WHY IS DAYS 0???"); 
        }
        this.state = {
            
        }
    }

    dayHasEntry(day) {
        return this.props.entries[day.format("MM/DD/YYYY")]["entry"] || this.props.entries[day.format("MM/DD/YYYY")]["note"];
    }

    displayValue() {
        if (this.props.dateOfSelectedEntry && this.props.habitOfSelectedEntry) {
            return this.props.entries[this.props.habitOfSelectedEntry][this.props.dateOfSelectedEntry.format("MM/DD/YYYY")]["value"];
        } else {
            return -1;
        }
    }

    displayNote() {
        if (this.props.dateOfSelectedEntry && this.props.habitOfSelectedEntry) {
            return this.props.entries[this.props.habitOfSelectedEntry][this.props.dateOfSelectedEntry.format("MM/DD/YYYY")]["note"] || "";
        } else {
            return "";
        }
    }

    onValueChange(value, note) {
        // quick note, if value or note are undefined, they will not be set, so you don't have to worry about
        // accidentally setting the value if you only want to update the note.
        this.props.updateEntry(this.props.habitOfSelectedEntry, this.props.dateOfSelectedEntry, value, note);
    }

    render() {
        let displayText = "";
        if (this.props.dateOfSelectedEntry) {
            displayText = "Selected day: " + this.props.dateOfSelectedEntry.format("MM/DD") + ", habit: " + this.props.habitOfSelectedEntry;
        }

        return (
            <div className="ctr retro">
                <div className="retro-top">
                    <div>
                        <b>{displayText}</b>
                        <NumericInput
                            allowNumericCharactersOnly={false}
                            value={this.displayValue()}
                            onValueChange={(value) => this.onValueChange(value, undefined)}
                        />
                    </div>
                </div>
                <div className="retro-bottom">
                    <TextArea style={{"width":"100%", "height":"100%"}}
                        value={this.displayNote()} 
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
        dateOfSelectedEntry: state.dateOfSelectedEntry,
        habitOfSelectedEntry: state.habitOfSelectedEntry
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(EntryEditContainer);
