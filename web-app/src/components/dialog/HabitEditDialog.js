import React, { Component } from 'react';
import { Button, Colors, Dialog, FormGroup, ControlGroup, TextArea, InputGroup, Icon, NumericInput, HTMLSelect, Switch } from '@blueprintjs/core';
import { DateRangeInput } from '@blueprintjs/datetime';
import _ from 'lodash';
import * as moment from "moment";
import { connect } from 'react-redux';
import * as mapDispatchToProps from '../../actions/index.actions.js'; 

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

const DEFAULT_TAGS = [
    {
        icon: "crown",
        color: Colors.VIOLET2,
        title: "Sample Tag 1",
    },
    {
        icon: "tree",
        color: Colors.TURQUOISE2,
        title: "Sample Tag 2",
    }
]

class HabitEditDialog extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            selectedHabit: undefined,
            editedTitle: "Short display title of habit",
            editedDescription: "How do I know if I completed this habit?",
            editedCategory: undefined,
            editedOrder: -1,
            editedColor: "Habit color",
            editedThresholds: DEFAULT_THRESHOLDS,
            editedTags: DEFAULT_TAGS,
            editedStartDate: moment().toDate(),
            editedEndDate: undefined,
            editedArchived: false,
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
                    editedCategory: nextProps.habit.category,
                    editedOrder: nextProps.habit.order,
                    editedColor: nextProps.habit.color,
                    editedThresholds: nextProps.habit.thresholds,
                    editedTags: nextProps.habit.tags,
                    editedStartDate: nextProps.habit.startDate ? nextProps.habit.startDate.toDate() : undefined,
                    editedEndDate: nextProps.habit.endDate ? nextProps.habit.endDate.toDate() : undefined,
                    editedArchived: nextProps.habit.archived || false,
                };
            } else { // create new habit
                return {
                    ...prevState,
                    selectedHabit: undefined,
                    editedTitle: "Short display title of habit",
                    editedDescription: "How do I know if I completed this habit?",
                    editedCategory: undefined,
                    editedOrder: -1,
                    editedColor: "Habit color",
                    editedThresholds: DEFAULT_THRESHOLDS,
                    editedTags: DEFAULT_TAGS,
                    editedStartDate: moment().toDate(),
                    editedEndDate: undefined,
                    editedArchived: false,
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
            editedCategory: this.props.habit.category,
            editedOrder: this.props.habit.order,
            editedColor: this.props.habit.color,
            editedThresholds: this.props.habit.thresholds,
            editedTags: this.props.habit.tags,
            editedStartDate: this.props.habit.startDate ? this.props.habit.startDate.toDate() : undefined,
            editedEndDate: this.props.habit.endDate ? this.props.habit.endDate.toDate() : undefined,
            editedArchived: this.props.habit.archived || false,
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

    addTag() {
        // TODO: would be cute to make this random
        this.setState({
            ...this.state,
            editedTags: this.state.editedTags.concat([{
                icon: "shopping-cart",
                color: Colors.LIME3,
                title: "Sample New Tag"
            }])
        })
    }

    deleteTag(index) {
        let newTags = this.state.editedTags;
        newTags.splice(index, 1);
        this.setState({
            ...this.state,
            editedTags: newTags,
        })
    }

    modifyCategory(category) {
        this.setState({
            ...this.state,
            editedCategory: category,
        })
    }

    modifyOrder(order) {
        this.setState({
            ...this.state,
            editedOrder: order,
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

    modifyTagField(index, field, value) {
        let newState = Object.assign({}, this.state);
        newState.editedTags[index][field] = value;
        this.setState(newState);
    }

    toggleArchived() {
        this.setState({
            ...this.state,
            editedArchived: !this.state.editedArchived,
        })
    }

    submitHabitEntryForm() {
        if (!_.isNil(this.props.selectedHabitForEdit)) { // editing existing habit
            this.props.updateHabit(
                this.props.selectedHabitForEdit,
                this.state.editedTitle,
                this.state.editedDescription,
                this.state.editedCategory,
                this.state.editedOrder,
                this.state.editedColor,
                this.state.editedThresholds,
                this.state.editedTags,
                this.state.editedStartDate,
                this.state.editedEndDate,
                this.state.editedArchived,
            );
            this.props.selectHabitForEdit(undefined, false);
        } else { // add new habit
            this.props.createHabit(
                this.state.editedTitle,
                this.state.editedDescription,
                this.state.editedCategory,
                this.state.editedOrder,
                this.state.editedColor,
                this.state.editedThresholds,
                this.state.editedTags,
                this.state.editedStartDate,
                this.state.editedEndDate
            )
            this.props.selectHabitForEdit(undefined, false);
        }
    }

    dialogTitle() {
        if (!_.isNil(this.state.selectedHabit)) {
            return "Editing goal: " + this.state.editedTitle;
        } else {
            return "Create New Goal";
        }
    }

    modifyDates(dateArray) {
        this.setState({
            ...this.state,
            editedStartDate: dateArray[0],
            editedEndDate: dateArray[1],
        })
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
                    {/* <Button icon="reset"
                            onClick={() => this.undoChanges()}
                            disabled={ this.state.selectedHabit ? false : true }>
                            Undo changes</Button> */}
                    <FormGroup label="What dream does this fulfill?">
                        <HTMLSelect value={this.state.editedCategory}
                                    onChange={(e) => this.modifyCategory(e.target.value)}
                                    options={
                                        [{
                                            key: -1,
                                            label: "No dream",
                                            value: undefined,
                                        }].concat(this.props.categoryOrder.map((cid, index) => {
                                            return {
                                                key: index,
                                                label: this.props.categories[cid].title,
                                                value: cid
                                            };
                                        }))
                                    }>
                        </HTMLSelect>
                    </FormGroup>
                    <FormGroup
                        label="What goal do you want to accomplish?">
                        <InputGroup
                            id="edit-title" type="text" className="bp3-input" placeholder="Title"
                            value={this.state.editedTitle}
                            onChange={(e) => this.modifyTitle(e.target.value)} />
                    </FormGroup>
                    <FormGroup
                        label="What criteria will you use to evaluate whether you achieved this goal?">
                        <TextArea
                            id="edit-desc"
                            growVertically={false}
                            large={true}
                            placeholder="Description"
                            value={this.state.editedDescription}
                            onChange={(e) => this.modifyDescription(e.target.value)}
                            />
                    </FormGroup>
                    <FormGroup label="When does this goal start & end?">
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
                    </FormGroup>
                    {/* <FormGroup label="Edit order">
                        <NumericInput value={this.state.editedOrder}
                                      onValueChange={(value) => this.modifyOrder(value)}/>
                    </FormGroup> */}
                    {/* <FormGroup
                        label="Edit Goal Color">
                        <InputGroup id="edit-color" type="text" className="bp3-input" placeholder="Color" 
                            value={this.state.editedColor}
                            onChange={(e) => this.modifyColor(e.target.value)}
                            />
                    </FormGroup> */}
                    {/* <FormGroup
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
                    </FormGroup> */}
                    {/* <FormGroup
                        label="Modify Tags (Advanced)">
                        {
                            this.state.editedTags.map((tag, index) => {
                                return (
                                    <ControlGroup key={index}>
                                        <Button icon="delete" onClick={() => this.deleteTag(index)}/>
                                        <div style={{"backgroundColor": tag.color, "width": 50, "height": 50}}>
                                            <Icon icon={tag.icon} style={{"width": 50, "height": 50}}/>
                                        </div>
                                        <InputGroup type="text" className="bp3-input"
                                            value={tag.title}
                                            onChange={(e) => this.modifyTagField(index, "title", e.target.value)}
                                         />
                                        <InputGroup type="text" className="bp3-input"
                                            value={tag.icon}
                                            onChange={(e) => this.modifyTagField(index, "icon", e.target.value)}
                                        />
                                        <InputGroup type="text" className="bp3-input"
                                            value={tag.color}
                                            onChange={(e) => this.modifyTagField(index, "color", e.target.value)}
                                        />
                                    </ControlGroup>
                                )
                            })
                        }
                        <Button icon="add" onClick={() => this.addTag()}>Add a new threshold</Button>
                    </FormGroup> */}
                    <FormGroup
                        label="Archive this goal?">
                        <Switch checked={this.state.editedArchived} label={"Archived"}
                                  onChange={(e) => this.toggleArchived()}
                        />
                    </FormGroup>
                    <div className="bp3-dialog-footer">
                        <Button
                            icon="floppy-disk"
                            intent="primary"
                            onClick={() => this.submitHabitEntryForm()}>Save</Button>
                        <Button
                            icon="delete"
                            intent="warning"
                            onClick={() => {
                                this.props.selectHabitForEdit(undefined, false);
                                this.props.deleteHabit(this.props.habit._id)
                            }}>Delete</Button>
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
        categoryOrder: state.categoryOrder,
        categories: state.categories,
        selectedHabitForEdit: state.selectedHabitForEdit,
        showDialog: state.showHabitEditDialog,
        habit: habit,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(HabitEditDialog);
