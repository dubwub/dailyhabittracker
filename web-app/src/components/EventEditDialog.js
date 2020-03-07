import React, { Component } from 'react';
import { Button, Dialog, FormGroup, InputGroup } from '@blueprintjs/core';
import { DateRangeInput } from '@blueprintjs/datetime';
import * as moment from "moment";
import { connect } from 'react-redux';
import * as mapDispatchToProps from '../actions/index.actions.js'; 

class EventEditDialog extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            selectedEvent: undefined,
            showDialog: false,
            editedTitle: "Short display title of Event",
            editedColor: "Event color",
            editedStartDate: undefined, // TODO: these are JS dates, not moment dates
            editedEndDate: undefined,
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.selectedEventForEdit !== prevState.selectedEvent ||
            nextProps.showDialog !== prevState.showDialog) {
            if (nextProps.selectedEventForEdit) { // edit existing Event
                return {
                    ...prevState,
                    selectedEvent: nextProps.selectedEventForEdit,
                    showDialog: nextProps.showDialog,
                    editedTitle: nextProps.event.title,
                    editedColor: nextProps.event.color,
                    editedStartDate: nextProps.event.startDate,
                    editedEndDate: nextProps.event.endDate,
                };
            } else { // create new Event
                return {
                    ...prevState,
                    selectedEvent: undefined,
                    showDialog: nextProps.showDialog,
                    editedTitle: "Short display title of Event",
                    editedColor: "Event color",
                    editedStartDate: undefined,
                    editedEndDate: undefined,
                }
            }
        } else {
            return null;
        }
    }

    undoChanges() {
        this.setState({
            ...this.state,
            editedTitle: "Short display title of Event",
            editedColor: "Event color",
            editedStartDate: undefined,
            editedEndDate: undefined,
        })
    }

    modifyTitle(title) {
        this.setState({
            ...this.state,
            editedTitle: title,
        })
    }

    modifyColor(color) {
        this.setState({
            ...this.state,
            editedColor: color,
        })
    }

    modifyDates(dateArray) {
        this.setState({
            ...this.state,
            editedStartDate: dateArray[0],
            editedEndDate: dateArray[1],
        })
    }

    submitEventEntryForm() {
        if (this.props.selectedEventForEdit) { // editing existing event
            this.props.updateEvent(
                this.props.selectedEventForEdit,
                this.state.editedTitle,
                this.state.editedColor,
                this.state.editedStartDate,
                this.state.editedEndDate,
            );
            this.props.selectEventForEdit(undefined, false);
        } else { // add new event
            this.props.createEvent(
                this.state.editedTitle,
                this.state.editedColor,
                this.state.editedStartDate,
                this.state.editedEndDate,
            )
            this.props.selectEventForEdit(undefined, false);
        }
    }

    dialogTitle() {
        if (this.state.selectedEvent) {
            return "Editing event: " + this.state.editedTitle;
        } else {
            return "Create New Event";
        }
    }

    render() {
        return (
            <Dialog 
                isOpen={this.state.showDialog}
                canOutsideClickClose={true}
                canEscapeKeyClose={true}
                isCloseButtonShown={true}
                onClose={() => this.props.selectEventForEdit(undefined, false)}
                style={{
                    "width": 400
                }}
                title={this.dialogTitle()}>
                <div className="bp3-dialog-body">
                    <Button icon="reset"
                            onClick={() => this.undoChanges()}
                            disabled={ this.state.selectedEvent ? false : true }>
                            Undo changes</Button>
                    <FormGroup
                        label="Edit Event Title">
                        <InputGroup
                            id="edit-title" type="text" className="bp3-input" placeholder="Title"
                            value={this.state.editedTitle}
                            onChange={(e) => this.modifyTitle(e.target.value)} />
                    </FormGroup>
                    <FormGroup
                        label="Edit Event Color">
                        <InputGroup id="edit-color" type="text" className="bp3-input" placeholder="Color" 
                            value={this.state.editedColor}
                            onChange={(e) => this.modifyColor(e.target.value)}
                            />
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

                    <div className="bp3-dialog-footer">
                        <Button
                            icon="floppy-disk"
                            intent="primary"
                            onClick={() => this.submitEventEntryForm()}>Save</Button>
                    </div>
                </div>
            </Dialog>
        );
    }
}

function mapStateToProps(state) {
    let event = undefined;
    return {
        selectedEventForEdit: state.selectedEventForEdit,
        showDialog: state.showEventEditDialog,
        event: event,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(EventEditDialog);
