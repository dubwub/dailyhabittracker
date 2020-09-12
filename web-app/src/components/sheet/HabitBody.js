import React, { Component } from 'react';
import { syncScroll, getThresholdFromValue } from '../../utils/habits.utils';
import { connect } from 'react-redux';
import * as mapDispatchToProps from '../../actions/index.actions.js'; 
import { Button, Colors, Icon, Popover, Tag, TextArea } from "@blueprintjs/core";
import _ from 'lodash';
import * as moment from "moment";
import { INTENT_SUCCESS } from '@blueprintjs/core/lib/esm/common/classes';

class HabitBody extends Component {

    constructor(props) {
        super(props);
        this.state = {
            entries: this.props.entries,
            debounce: _.debounce((habit, day, note) => this.props.updateEntryNote(habit, day, note), 1000)
        }
    }

    toggleEditMode() {
        this.props.selectHabitForEdit(this.props.habit, true);
    }

    handleValueChange(day, value) {
        let entries = this.state.entries;
        entries[day.format("MM/DD/YYYY")]["value"] = value;
        this.setState({
            ...this.state,
            entries: entries,
        })
        this.props.updateEntryValue(this.props.habit, day, value);
    }

    handleTextAreaChange(habit, day, note) {
        let entries = this.state.entries;
        entries[day.format("MM/DD/YYYY")]["note"] = note;
        this.setState({
            ...this.state,
            entries: entries,
        })
        this.state.debounce(habit, day, note);
    }

    createTransaction(habit, day, value, note, transactions) {
        if (_.isNil(transactions)) {
            transactions = [];
        }
        transactions = transactions.concat([{
            time: Date.now(),
            value: value,
            note: note,
        }]);

        let entries = this.state.entries;
        entries[day.format("MM/DD/YYYY")]["transactions"] = transactions;
        this.setState({
            ...this.state,
            entries: entries,
        })
        this.props.updateEntryTransactions(habit, day, transactions)
    }

    deleteTransaction(habit, day, transactions, index) {
        transactions.splice(index, 1);
        let entries = this.state.entries;
        entries[day.format("MM/DD/YYYY")]["transactions"] = transactions;
        this.setState({
            ...this.state,
            entries: entries,
        })
        this.props.updateEntryTransactions(habit, day, transactions)
    }

    render() {
        return (
            <div className={"row-contents hide-scrollbar habit"} onScroll={syncScroll}>
                { 
                    this.props.days.map((day, index) => {
                        if ((_.isNil(this.props.startDate) || day >= this.props.startDate) &&
                            (_.isNil(this.props.endDate) || day <= this.props.endDate)) {
                            const day_fmt = day.format("MM/DD/YYYY");
                            let value = this.state.entries[day_fmt]["value"];

                            let backgroundColor = "";
                            let highlightIcon = (<span/>);

                            // if there is an empty value for today or yesterday, mark it purple with a star to indicate action should be taken
                            if (_.isNil(this.state.entries[day_fmt]["value"]) && _.isEmpty(this.state.entries[day_fmt]["note"])) {
                                if (day === this.props.days[this.props.days.length - 1] || day === this.props.days[this.props.days.length - 2]) {
                                    backgroundColor = Colors.INDIGO5;
                                    highlightIcon = (
                                        <Icon icon="star-empty" 
                                            style={{position: "absolute", width: 10, height: 10, bottom: 10, right: 10, color: "white"}}
                                        />
                                    )
                                }
                            } else {
                                backgroundColor = getThresholdFromValue(this.props.thresholds, value).color;
                            }

                            let helperIcons = (!_.isNil(this.state.entries[day_fmt]["note"]) && this.state.entries[day_fmt]["note"].length > 0) ?
                                (
                                    <Icon icon="edit" 
                                        style={{position: "absolute", width: 10, height: 10, bottom: 10, right: 10, color: "black"}}
                                    />
                                ) : (
                                    <span />    
                                )
                            
                            let tagIcons = [];
                            {/* if (!_.isNil(this.props.entries[day_fmt]["tags"])) {
                                const tags = this.props.entries[day_fmt]["tags"];
                                for (let i = 0; i < tags.length; i++) {
                                    tagIcons.push((
                                        <Icon key={i}
                                            icon={this.props.tags[tags[i]].icon}
                                            style={{
                                                        backgroundColor: this.props.tags[tags[i]].color,
                                                        position: "absolute",
                                                        bottom: 5, left: i * 20,
                                                    }} />
                                    ))
                                }
                            } */}

                            let transactionTags = [];
                            if (!_.isNil(this.state.entries[day_fmt]["transactions"])) {
                                const transactions = this.state.entries[day_fmt]["transactions"];
                                for (let i = 0; i < transactions.length; i++) {
                                    transactionTags.push((
                                        <Tag key={i} style={{backgroundColor: getThresholdFromValue(this.props.thresholds, transactions[i].value).color}}>
                                            <Button icon={"cross"}
                                                    onClick={() => this.deleteTransaction(this.props.habit, day, this.state.entries[day_fmt]["transactions"], i)} />
                                            Time: {moment.default(transactions[i].time).calendar()}, Note: {transactions[i].note}
                                        </Tag>
                                    ))
                                }
                            }

                            let lastThreeEntries = [];
                            for (let i = this.props.days.length - 2; i >= 0; i--) {
                                if (!_.isNil(this.props.entries[this.props.days[i].format("MM/DD/YYYY")]) && !_.isEmpty(this.props.entries[this.props.days[i].format("MM/DD/YYYY")].note)) {
                                    let value = !_.isNil(this.props.entries[this.props.days[i].format("MM/DD/YYYY")].value) ? this.props.entries[this.props.days[i].format("MM/DD/YYYY")].value : 3;
                                    lastThreeEntries.push({
                                        date: this.props.days[i].format("MM/DD/YYYY"),
                                        value: value,
                                        note: this.props.entries[this.props.days[i].format("MM/DD/YYYY")].note
                                    });
                                    if (lastThreeEntries.length === 3) break;
                                }
                            }



                            return (
                                <div className={"cell"} key={day_fmt}>
                                    <Popover content={(
                                        <div style={{width: 800, height: 700, overflowY: "auto", overflowX: "hidden"}}>
                                            <div style={{width: 600, height: 600, display: "inline-block"}}>
                                                <h4>How do I feel about my progress today?</h4>
                                                <b>My criteria for success:</b> { this.props.description } <br />
                                                <Button style={{"backgroundColor": getThresholdFromValue(this.props.thresholds, 1).color, width: 40, height: 30}} disabled={this.state.entries[day_fmt]["value"] === 1} onClick={() => this.handleValueChange(day, 1)}>1</Button>
                                                <Button style={{"backgroundColor": getThresholdFromValue(this.props.thresholds, 2).color, width: 40, height: 30}} disabled={this.state.entries[day_fmt]["value"] === 2} onClick={() => this.handleValueChange(day, 2)}>2</Button>
                                                <Button style={{"backgroundColor": getThresholdFromValue(this.props.thresholds, 3).color, width: 40, height: 30}} disabled={this.state.entries[day_fmt]["value"] === 3} onClick={() => this.handleValueChange(day, 3)}>3</Button>
                                                <Button style={{"backgroundColor": getThresholdFromValue(this.props.thresholds, 4).color, width: 40, height: 30}} disabled={this.state.entries[day_fmt]["value"] === 4} onClick={() => this.handleValueChange(day, 4)}>4</Button>
                                                <Button style={{"backgroundColor": getThresholdFromValue(this.props.thresholds, 5).color, width: 40, height: 30}} disabled={this.state.entries[day_fmt]["value"] === 5} onClick={() => this.handleValueChange(day, 5)}>5</Button><br />
                                                <TextArea style={{"width":600, "height":400}} autoFocus={true}
                                                    value={this.state.entries[day_fmt]["note"]}
                                                    onChange={(e) => this.handleTextAreaChange(this.props.habit, day, e.target.value)}
                                                    placeholder={"What would you keep, stop, start doing?"}
                                                    />
                                                <Button intent={"success"} icon="bookmark" onClick={() => this.createTransaction(this.props.habit, day, this.state.entries[day_fmt]["value"], this.state.entries[day_fmt]["note"], this.state.entries[day_fmt]["transactions"])}>Save checkpoint</Button>
                                                { transactionTags }
                                            </div>
                                            <div style={{width: 150, height: 600, display: "inline-block", overflowY: "auto"}}>
                                                <b>Last Three Notes:</b><br/>
                                                {
                                                    lastThreeEntries.map((entry) => {
                                                        return (
                                                            <div style={{paddingBottom: 10, backgroundColor: getThresholdFromValue(this.props.thresholds, entry.value).color, opacity: 0.8}}>{entry.date}: {entry.note}</div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                    )} modifiers={{preventOverflow: {enabled: true, boundariesElement: "window"}}} hoverOpenDelay={0} minimal={true} transitionDuration={0} position={"right"}>
                                        <Button    
                                            className={"bp3-minimal bp3-outlined cell"}
                                            style={{"backgroundColor": backgroundColor, position: "relative"}}>
                                            <b>{ value }</b>
                                            { helperIcons }
                                            { tagIcons }
                                            { highlightIcon }
                                        </Button>
                                    </Popover>
                                </div>
                            )
                        } else {
                            return (
                                <div className={"cell"} key={day.format("MM/DD/YYYY")} />
                            )
                        }
                        
                    })
                }
            </div>
        )
    }

};

function mapStateToProps(state, ownProps) {
    let tags = {};
    const rawTags = state["habits"][ownProps.habit]["tags"];
    for (let i = 0; i < rawTags.length; i++) {
        tags[rawTags[i]._id] = rawTags[i];
    }

    return {
        days: state["days"],
        description: state["habits"][ownProps.habit]["description"],
        category: state["habits"][ownProps.habit]["category"] ? state["categories"][state["habits"][ownProps.habit]["category"]] : undefined,
        thresholds: state["habits"][ownProps.habit]["thresholds"],
        startDate: state["habits"][ownProps.habit]["startDate"],
        endDate: state["habits"][ownProps.habit]["endDate"],
        tags: tags,
        entries: state["entries"][ownProps.habit],
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(HabitBody);
