
import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from '../../actions/index.actions.js'; 
import { Button, Icon, Tag } from "@blueprintjs/core";
import { syncScroll, getThresholdFromValue } from '../../utils/habits.utils';
import _ from 'lodash';
import * as moment from "moment";

const DEFAULT_RETRO_THRESHOLDS = [
    {
        icon: "heart-broken",
        color: "#ea9999",
        condition: "le",
        minValue: undefined,
        maxValue: 2
    },
    {
        icon: "cross",
        color: "#f5b880",
        condition: "le",
        minValue: 3,
        maxValue: 4
    },
    {
        icon: "",
        color: "#ffd666",
        condition: "le",
        minValue: 5,
        maxValue: 6
    },
    {
        icon: "tick",
        color: "#abc978",
        condition: "le",
        minValue: 7,
        maxValue: 8
    },
    {
        icon: "clean",
        color: "#57bb8a",
        condition: "ge",
        minValue: 9,
        maxValue: 10
    }
];

export interface LongFormProps {
    days: moment.Moment[]
    retros: any // Retros[]
    startDate: moment.Moment
    endDate: moment.Moment
 
    // functions from index.actions
    selectRetroForEdit: any
    deleteRetro: any
}

export interface State {
}

export interface RetrosProps {
    startDate: moment.Moment
    endDate: moment.Moment
    selectRetroForEdit: any
    deleteRetro: any
    retros: any
}

class Retros extends React.Component<RetrosProps, State> {
    onClick(e: any, retroId: string) {
        // TODO: this is jank as all hell, there may be a better way to do this
        console.log("Responding to click retro with nodeName: " + e.target.nodeName);

        if (["path", "svg"].indexOf(e.target.nodeName) === -1) {
            this.props.selectRetroForEdit(retroId, true);
        } 
    }

    renderRetro(index: number, retro: any) {
        // for display purposes, don't display parts of retros out of range
        let truncStartDate = moment.max(retro.startDate, this.props.startDate);
        let truncEndDate = moment.min(retro.endDate, this.props.endDate);

        let timeBeforeToday = this.props.endDate.diff(truncEndDate, "days");
        let durationOfRetro = truncEndDate.diff(truncStartDate, "days");
        let timeAfterEnding = truncStartDate.diff(this.props.startDate, "days");
        
        return (
            // TODO: deleting a retro brings up the dialog
            <div key={index} style={{"width": "100%", "height": "100px", "whiteSpace": "nowrap", "overflowX": "auto"}}>
                <div style={{"display": "inline-block", "width": timeBeforeToday*50, "height": 30}} />
                <Tag 
                    interactive={true}
                    style={{
                        "width": (durationOfRetro+1)*50,
                        "backgroundColor": getThresholdFromValue(DEFAULT_RETRO_THRESHOLDS, retro.value).color,
                        "display": "inline-block",
                    }}
                    onRemove={() => this.props.deleteRetro(retro._id)}
                    onClick={(e: any) => this.onClick(e, retro._id)}
                >
                    <Icon icon={getThresholdFromValue(DEFAULT_RETRO_THRESHOLDS, retro.value).icon}/>
                    {retro.title}
                </Tag>
                <div style={{"display": "inline-block", "width": timeAfterEnding*50, "height": 30}} />
            </div>
        );
    }

    render() {
        return (
            <div className="header-retro" style={{"width": 3000}}>
                {
                    this.props.retros.map((retro: any, index: number) => this.renderRetro(index, retro))
                }
            </div>            
        )
    }
}

class LongRetroContainer extends React.Component<LongFormProps, State> {

    render() {
        return (
            <div style={{position: "relative"}}>
            <div className={"row-header habit"} style={{position: "relative", maxWidth: 500, paddingRight: 0}}>
                <div className="habit-title">
                    <h5 style={{margin: 0}}>Sagas</h5>
                </div>
                <Button 
                    style={{position: "absolute", top: 0, right: 0}}
                    onClick={() => this.props.selectRetroForEdit(undefined, true)}
                    icon={"new-drawing"} />
            </div>
            <div className={"row-contents hide-scrollbar habit"} onScroll={syncScroll} style={{overflowY: "auto"}}>
                <Retros startDate={this.props.startDate}
                        endDate={this.props.endDate}
                        retros={this.props.retros}
                        selectRetroForEdit={this.props.selectRetroForEdit}
                        deleteRetro={this.props.deleteRetro}
                            />
            </div>
        </div>
        )
    }
}

function mapStateToProps(state: any) {
    return {
        days: state.days,
        retros: state.retros,
        startDate: state.days[state.days.length - 1], // TODO: this should never be empty... right?
        endDate: state.days[0],
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LongRetroContainer);