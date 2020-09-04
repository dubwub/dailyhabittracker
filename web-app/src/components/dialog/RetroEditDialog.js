import React, { Component } from 'react';
import { Button, Dialog, FormGroup, Icon, InputGroup, Tag, TextArea } from '@blueprintjs/core';
import { DateRangeInput } from '@blueprintjs/datetime';
import * as moment from "moment";
import { connect } from 'react-redux';
import * as mapDispatchToProps from '../../actions/index.actions.js'; 
import { getThresholdFromValue, generateQuickAddButtons } from '../../utils/habits.utils';

const DEFAULT_THRESHOLDS = [
    {
        icon: "heart-broken",
        color: "#ea9999",
        condition: "le",
        minValue: undefined,
        maxValue: 1
    },
    {
        icon: "cross",
        color: "#f5b880",
        condition: "eq",
        minValue: 2,
        maxValue: 2
    },
    {
        icon: "",
        color: "#ffd666",
        condition: "eq",
        minValue: 3,
        maxValue: 3
    },
    {
        icon: "tick",
        color: "#abc978",
        condition: "eq",
        minValue: 4,
        maxValue: 4
    },
    {
        icon: "clean",
        color: "#57bb8a",
        condition: "ge",
        minValue: 5,
        maxValue: undefined
    }
];

class RetroEditDialog extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            selectedRetro: undefined,
            showDialog: false,
            editedTitle: "I tried my best and accomplished very much!",
            editedStartDate: moment().toDate(), // TODO: these are JS dates, not moment dates
            editedEndDate: moment().toDate(),
            editedValue: -1,
            editedNote: ""
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.selectedRetroForEdit !== prevState.selectedRetro ||
            nextProps.showDialog !== prevState.showDialog) {
            if (nextProps.selectedRetroForEdit) { // edit existing Retro
                return {
                    ...prevState,
                    selectedRetro: nextProps.selectedRetroForEdit,
                    showDialog: nextProps.showDialog,
                    editedTitle: nextProps.retro.title,
                    editedStartDate: nextProps.retro.startDate.toDate(),
                    editedEndDate: nextProps.retro.endDate.toDate(),
                    editedValue: nextProps.retro.value,
                    editedNote: nextProps.retro.note,
                };
            } else { // create new Retro
                return {
                    ...prevState,
                    selectedRetro: undefined,
                    showDialog: nextProps.showDialog,
                    editedTitle: "I tried my best and accomplished very much!",
                    editedStartDate: moment().toDate(),
                    editedEndDate: moment().toDate(),
                    editedValue: -1,
                    editedNote: "",
                }
            }
        } else {
            return null;
        }
    }

    undoChanges() {
        this.setState({
            ...this.state,
            editedTitle: "I tried my best and accomplished very much!",
            editedStartDate: moment().toDate(),
            editedEndDate: moment().toDate(),
            editedValue: -1,
            editedNote: "",
        })
    }

    modifyTitle(title) {
        this.setState({
            ...this.state,
            editedTitle: title,
        })
    }

    modifyDates(dateArray) {
        this.setState({
            ...this.state,
            editedStartDate: dateArray[0],
            editedEndDate: dateArray[1],
        })
    }

    modifyValue(value) {
        this.setState({
            ...this.state,
            editedValue: value
        })
    }

    modifyNote(note) {
        this.setState({
            ...this.state,
            editedNote: note
        })
    }

    submitRetroEntryForm() {
        if (this.props.selectedRetroForEdit) { // editing existing event
            this.props.updateRetro(
                this.props.selectedRetroForEdit,
                this.state.editedTitle,
                this.state.editedStartDate,
                this.state.editedEndDate,
                this.state.editedValue,
                this.state.editedNote
            );
            this.props.selectRetroForEdit(undefined, false);
        } else { // add new retro
            this.props.createRetro(
                this.state.editedTitle,
                this.state.editedStartDate,
                this.state.editedEndDate,
                this.state.editedValue,
                this.state.editedNote,
                undefined
            )
            this.props.selectRetroForEdit(undefined, false);
        }
    }

    dialogTitle() {
        if (this.state.selectedRetro) {
            return "Editing retro: " + this.state.editedTitle;
        } else {
            return "Create New Retro";
        }
    }

    render() {
        const onClick = (i) => {
            this.modifyValue(i);
        }

        return (
            <Dialog 
                isOpen={this.state.showDialog}
                canOutsideClickClose={true}
                canEscapeKeyClose={true}
                isCloseButtonShown={true}
                onClose={() => this.props.selectRetroForEdit(undefined, false)}
                style={{
                    "width": 600
                }}
                title={this.dialogTitle()}>
                <div className="bp3-dialog-body">
                    <Button icon="reset"
                            onClick={() => this.undoChanges()}
                            disabled={ this.state.selectedRetro ? false : true }>
                            Undo changes</Button>
                    <FormGroup
                        label="How do you want to remember this saga of your life?">
                        <InputGroup
                            id="edit-title" type="text" className="bp3-input" placeholder="Title"
                            value={this.state.editedTitle}
                            onChange={(e) => this.modifyTitle(e.target.value)} />
                    </FormGroup>
                    
                    <DateRangeInput
                        formatDate={date => moment(date).format('MM/DD/YYYY')}
                        onChange={(dates) => this.modifyDates(dates)}
                        parseDate={str => moment(str, 'MM/DD/YYYY').toDate()}
                        value={[this.state.editedStartDate, this.state.editedEndDate]}
                        shortcuts={false}
                        enableTimePicker={false}
                        allowSingleDayRange={true}
                        timePrecision={undefined}
                    />

                    <FormGroup
                        label="How did you feel about your progress?">
                        { generateQuickAddButtons(DEFAULT_THRESHOLDS, 1, 5, onClick, this.state.editedValue) }
                    </FormGroup>

                    <TextArea style={{"width":600, "height":300}} autoFocus={true}
                        value={this.state.editedNote}
                        onChange={(e) => this.modifyNote(e.target.value)}
                        />

                    <FormGroup
                        label="Display preview">
                        <Tag 
                            large={true}
                            style={{
                                "backgroundColor": getThresholdFromValue(DEFAULT_THRESHOLDS, this.state.editedValue).color,
                                "display": "inline-block",
                            }}
                        >
                            <Icon icon={getThresholdFromValue(DEFAULT_THRESHOLDS, this.state.editedValue).icon}/>
                            {this.state.editedTitle}
                        </Tag>
                    </FormGroup>

                    <div className="bp3-dialog-footer">
                        <Button
                            icon="floppy-disk"
                            intent="primary"
                            onClick={() => this.submitRetroEntryForm()}>Save</Button>
                    </div>
                </div>
            </Dialog>
        );
    }
}

function mapStateToProps(state) {
    // TODO: should I just keep the entire retro in here? otherwise i'm iterating an array twice
    // it does denormalize retro, idk
    let retro = undefined;
    if (state.selectedRetroForEdit) {
        for (let i = 0; i < state.retros.length; i++) {
            if (state.retros[i]._id === state.selectedRetroForEdit) {
                retro = state.retros[i];
                break;
            }
        }
    }
    
    return {
        selectedRetroForEdit: state.selectedRetroForEdit,
        showDialog: state.showRetroEditDialog,
        retro: retro,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(RetroEditDialog);
