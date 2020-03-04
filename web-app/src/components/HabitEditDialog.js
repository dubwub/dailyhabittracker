import axios from 'axios';
import React, { Component } from 'react';
import { syncScroll } from '../utils/habits.utils';
import { Button, Dialog, FormGroup, ControlGroup, TextArea, InputGroup, Icon, NumericInput, HTMLSelect } from '@blueprintjs/core';

import { connect } from 'react-redux';
import * as mapDispatchToProps from '../actions/index.actions.js'; 

const moment = require('moment');

const DEFAULT_THRESHOLDS = [
    {
        icon: "heart-broken",
        color: "#9E2B0E",
        condition: "le",
        minValue: undefined,
        maxValue: 1
    },
    {
        icon: "cross",
        color: "#D13913",
        condition: "eq",
        minValue: 2,
        maxValue: 2
    },
    {
        icon: "",
        color: "#5C7080",
        condition: "eq",
        minValue: 3,
        maxValue: 3
    },
    {
        icon: "tick",
        color: "#0A6640",
        condition: "eq",
        minValue: 4,
        maxValue: 4
    },
    {
        icon: "clean",
        color: "#D99E0B",
        condition: "gt",
        minValue: 5,
        maxValue: undefined
    }
];

class HabitEditDialog extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            selectedHabit: undefined,
            editedTitle: "Short display title of habit",
            editedDescription: "How do I know if I completed this habit?",
            editedColor: "Habit color",
            editedThresholds: DEFAULT_THRESHOLDS
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.selectedHabitForEdit !== prevState.selectedHabit) {
            if (nextProps.selectedHabitForEdit) { // edit existing habit
                return {
                    ...prevState,
                    selectedHabit: nextProps.selectedHabitForEdit,
                    editedTitle: nextProps.habit.title,
                    editedDescription: nextProps.habit.description,
                    editedColor: nextProps.habit.color,
                    editedThresholds: nextProps.habit.thresholds
                };
            } else { // create new habit
                return {
                    ...prevState,
                    selectedHabit: undefined,
                    editedTitle: "Short display title of habit",
                    editedDescription: "How do I know if I completed this habit?",
                    editedColor: "Habit color",
                    editedThresholds: DEFAULT_THRESHOLDS
                }
            }
        } else {
            return null;
        }
    }

    undoChanges() {
        this.setState({
            ...this.state,
            editedTitle: this.props.habit.title,
            editedDescription: this.props.habit.description,
            editedColor: this.props.habit.color,
            editedThresholds: this.props.habit.thresholds
        })
    }

    resetThresholds() {
        this.setState({
            ...this.state,
            editedThresholds: DEFAULT_THRESHOLDS
        })
    }

    addThreshold() {
        // TODO: would be cute to make this random
        this.setState({
            ...this.state,
            editedThresholds: this.state.editedThresholds.concat([{
                icon: "new-layers",
                color: "#752F75",
                condition: "eq",
                minValue: 3,
                maxValue: 3,
            }])
        })
    }

    deleteThreshold(index) {
        let newThresholds = this.state.editedThresholds;
        newThresholds.splice(index, 1);
        this.setState({
            ...this.state,
            editedThresholds: newThresholds
        })
    }

    modifyTitle(title) {
        this.setState({
            ...this.state,
            editedTitle: title,
        })
    }

    modifyDescription(desc) {
        this.setState({
            ...this.state,
            editedDescription: desc,
        })
    }

    modifyColor(color) {
        this.setState({
            ...this.state,
            editedColor: color,
        })
    }

    modifyThresholdField(index, field, value) {
        let newState = Object.assign({}, this.state);
        newState.editedThresholds[index][field] = value;
        this.setState(newState);
    }

    submitHabitEntryForm() {
        if (this.props.selectedHabitForEdit) { // editing existing habit
            this.props.updateHabit(
                this.props.selectedHabitForEdit,
                this.state.editedTitle,
                this.state.editedDescription,
                this.state.editedColor,
                this.state.editedThresholds,
            );
            this.props.selectHabitForEdit(undefined, false);
        } else { // add new habit
            this.props.createHabit(
                this.state.editedTitle,
                this.state.editedDescription,
                this.state.editedColor,
                this.state.editedThresholds,
            )
            this.props.selectHabitForEdit(undefined, false);
        }
    }

    dialogTitle() {
        if (this.state.selectedHabit) {
            return "Editing habit: " + this.state.editedTitle;
        } else {
            return "Create New Habit";
        }
    }

    render() {
        return (
            <Dialog 
                isOpen={this.props.showDialog}
                canOutsideClickClose={true}
                canEscapeKeyClose={true}
                isCloseButtonShown={true}
                onClose={() => this.props.selectHabitForEdit(undefined, false)}
                style={{
                    "width": 400
                }}
                title={this.dialogTitle()}>
                <div className="bp3-dialog-body">
                    <Button icon="reset"
                            onClick={() => this.undoChanges()}
                            disabled={ this.state.selectedHabit ? false : true }>
                            Undo changes</Button>
                    <FormGroup
                        label="Edit Habit Title">
                        <InputGroup
                            id="edit-title" type="text" className="bp3-input" placeholder="Title"
                            value={this.state.editedTitle}
                            onChange={(e) => this.modifyTitle(e.target.value)} />
                    </FormGroup>
                    <FormGroup
                        label="Edit Habit Description">
                        <TextArea
                            id="edit-desc"
                            growVertically={false}
                            large={true}
                            placeholder="Description"
                            value={this.state.editedDescription}
                            onChange={(e) => this.modifyDescription(e.target.value)}
                            />
                    </FormGroup>
                    <FormGroup
                        label="Edit Habit Color">
                        <InputGroup id="edit-color" type="text" className="bp3-input" placeholder="Color" 
                            value={this.state.editedColor}
                            onChange={(e) => this.modifyColor(e.target.value)}
                            />
                    </FormGroup>
                    <FormGroup
                        label="Modify Thresholds (Advanced)">
                        <Button icon="reset" onClick={() => this.resetThresholds()}>Reset</Button>
                        {
                            this.state.editedThresholds.map((threshold, index) => {
                                // show different forms depending on whether it's less than or between or greater than
                                let numericInputForm = (<div />);
                                if (["lt", "le", "eq"].indexOf(threshold.condition) !== -1) {
                                    numericInputForm = (
                                        <NumericInput value={threshold.maxValue}
                                                      onValueChange={(value) => this.modifyThresholdField(index, "maxValue", value)}/>
                                    );
                                } else if (threshold.condition === "between") {
                                    numericInputForm = (
                                        <div>
                                            <NumericInput value={threshold.minValue}
                                                        onValueChange={(value) => this.modifyThresholdField(index, "minValue", value)}/>
                                            <NumericInput value={threshold.maxValue}
                                                        onValueChange={(value) => this.modifyThresholdField(index, "maxValue", value)}/>
                                        </div>
                                    );
                                } else if (["ge", "gt"].indexOf(threshold.condition) !== -1) {
                                    numericInputForm = (
                                        <NumericInput value={threshold.minValue}
                                                      onValueChange={(value) => this.modifyThresholdField(index, "minValue", value)}/>
                                    );
                                }

                                return (
                                    <ControlGroup label="test" key={index}>
                                        <Button icon="delete" onClick={() => this.deleteThreshold(index)}/>
                                        <div style={{"backgroundColor": threshold.color, "width": 50, "height": 50}}>
                                            <Icon icon={threshold.icon} style={{"width": 50, "height": 50}}/>
                                        </div>
                                        <InputGroup type="text" className="bp3-input"
                                            value={threshold.icon}
                                            onChange={(e) => this.modifyThresholdField(index, "icon", e.target.value)}
                                         />
                                        <InputGroup type="text" className="bp3-input"
                                            value={threshold.color}
                                            onChange={(e) => this.modifyThresholdField(index, "color", e.target.value)}
                                        />
                                        <HTMLSelect value={threshold.condition}
                                                    onChange={(e) => this.modifyThresholdField(index, "condition", e.target.value)}
                                                    options={[
                                                        { label: "less than", value: "lt" },
                                                        { label: "less than or equal to", value: "le" },
                                                        { label: "equal to", value: "eq" },
                                                        { label: "between (inclusive)", value: "between" },
                                                        { label: "greater than or equal to", value: "ge" },
                                                        { label: "greater than", value: "gt" },
                                                    ]}>
                                        </HTMLSelect>
                                        { numericInputForm }
                                    </ControlGroup>
                                )
                            })
                        }
                        <Button icon="add" onClick={() => this.addThreshold()}>Add a new threshold</Button>
                    </FormGroup>
                    <div className="bp3-dialog-footer">
                        <Button
                            icon="floppy-disk"
                            intent="primary"
                            onClick={() => this.submitHabitEntryForm()}>Save</Button>
                    </div>
                </div>
            </Dialog>
        );
    }
}

function mapStateToProps(state) {
    let habit = undefined;
    if (state.selectedHabitForEdit) {
        habit = state.habits[state.selectedHabitForEdit];
    }
    return {
        selectedHabitForEdit: state.selectedHabitForEdit,
        showDialog: state.showHabitEditDialog,
        habit: habit,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(HabitEditDialog);
