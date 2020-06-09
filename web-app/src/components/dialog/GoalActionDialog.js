import React, { Component } from 'react';
import { Button, Colors, Dialog, FormGroup, TextArea, InputGroup, Icon, NumericInput, HTMLSelect, Switch } from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import _ from 'lodash';
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

class GoalActionDialog extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            selectedHabit: undefined,
            editedTitle: "",
            editedValue: 3,
            editedNote: "",
            editedEndDate: moment().toDate()
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.selectedGoalForAction !== prevState.selectedHabit) {
            if (nextProps.selectedGoalForAction) { // edit existing habit
                return {
                    ...prevState,
                    selectedHabit: nextProps.selectedGoalForAction,
                    editedEndDate: nextProps.habit.endDate ? nextProps.habit.endDate.toDate() : moment().toDate(),
                };
            } else { // create new habit
                return {
                    ...prevState,
                    selectedHabit: undefined,
                    editedEndDate: moment().toDate(),
                }
            }
        } else {
            return null;
        }
    }

    modifyTitle(title) {
        this.setState({
            ...this.state,
            editedTitle: title,
        })
    }

    modifyValue(value) {
        this.setState({
            ...this.state,
            editedValue: value,
        })
    }

    modifyNote(note) {
        this.setState({
            ...this.state,
            editedNote: note,
        })
    }

    archiveHabit() {
        this.props.archiveHabit(
            this.props.selectedGoalForAction
        );
        this.props.createRetro(
            this.state.editedTitle,
            this.props.habit.startDate,
            this.props.habit.endDate,
            this.state.editedValue,
            this.state.editedNote,
            this.props.selectedGoalForAction
        )
        this.props.selectGoalForAction(undefined, false);
    }

    dialogTitle() {
        if (!_.isNil(this.props.habit)) {
            return "Taking action on: " + this.props.habit.title;
        } else {
            return "";
        }
    }

    modifyEndDate(date) {
        this.setState({
            ...this.state,
            editedEndDate: date,
        })
    }

    render() {
        const onClick = (i) => {
            this.modifyValue(i);
        }

        return (
            <Dialog 
                isOpen={this.props.showDialog}
                canOutsideClickClose={true}
                canEscapeKeyClose={true}
                isCloseButtonShown={true}
                onClose={() => this.props.selectGoalForAction(undefined, false)}
                style={{
                    "width": 400
                }}
                title={this.dialogTitle()}>
                <div className="bp3-dialog-body">
                    <FormGroup
                        label="How do you want to remember this saga of your life?">
                        <InputGroup
                            id="edit-title" type="text" className="bp3-input" placeholder="Title"
                            value={this.state.editedTitle}
                            onChange={(e) => this.modifyTitle(e.target.value)} />
                    </FormGroup>
                    
                    <DateInput
                        formatDate={date => moment(date).format('MM/DD/YYYY')}
                        onChange={(date) => this.modifyEndDate(date)}
                        parseDate={str => moment(str, 'MM/DD/YYYY').toDate()}
                        value={this.state.editedEndDate}
                        shortcuts={false}
                        enableTimePicker={false}
                        allowSingleDayRange={true}
                        timePrecision={undefined}
                    />

                    <FormGroup
                        label="How did you feel about your progress?">
                        { generateQuickAddButtons(DEFAULT_THRESHOLDS, 1, 5, onClick) }
                    </FormGroup>

                    <TextArea style={{"width":200, "height":100}} autoFocus={true}
                        value={this.state.editedNote}
                        onChange={(e) => this.modifyNote(e.target.value)}
                        />

                    <div className="bp3-dialog-footer">
                        <Button
                            icon="floppy-disk"
                            intent="primary"
                            onClick={() => this.archiveHabit()}>Save Retro & Archive Habit</Button>
                        {/* <Button
                            icon="delete"
                            intent="warning"
                            onClick={() => {
                                this.props.selectHabitForEdit(undefined, false);
                                this.props.deleteHabit(this.props.habit._id)
                            }}>Delete</Button> */}
                    </div>
                </div>
            </Dialog>
        );
    }
}

function mapStateToProps(state) {
    let habit = undefined;
    if (state.selectedGoalForAction) {
        habit = state.habits[state.selectedGoalForAction];
    }

    return {
        selectedGoalForAction: state.selectedGoalForAction,
        showDialog: state.showGoalActionDialog,
        habit: habit,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(GoalActionDialog);
