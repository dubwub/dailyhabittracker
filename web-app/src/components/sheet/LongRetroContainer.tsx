
import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from '../../actions/index.actions.js'; 
import { Button, Icon, Tag } from "@blueprintjs/core";
import { syncScroll, getThresholdFromValue } from '../../utils/habits.utils';
import _ from 'lodash';
import * as moment from "moment";

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

export interface LongFormProps {
    days: moment.Moment[]
    retroRows: any // [Retros[]]
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
    retroRows: any
}

class Retros extends React.Component<RetrosProps, State> {
    onClick(e: any, retroId: string) {
        // TODO: this is jank as all hell, there may be a better way to do this
        console.log("Responding to click retro with nodeName: " + e.target.nodeName);

        if (["path", "svg"].indexOf(e.target.nodeName) === -1) {
            this.props.selectRetroForEdit(retroId, true);
        } 
    }

    renderRetroRows(retroRows: any) {
        // turn retro rows into whitespace and retros
        let retroDisplay = [];
        for (let i = 0; i < retroRows.length; i++) {
            for (let j = 0; j < retroRows[i].length; j++) {
                let retro = retroRows[i][j];
                if (retro.endDate < this.props.startDate) {
                    continue;
                }

                // for display purposes, don't display parts of retros out of range
                let truncStartDate = moment.max(retro.startDate, this.props.startDate);
                let truncEndDate = moment.min(retro.endDate, this.props.endDate);

                let timeBeforeToday = truncStartDate.diff(this.props.startDate, "days");
                let durationOfRetro = truncEndDate.diff(truncStartDate, "days") + 1;

                retroDisplay.push((
                    <div style={{ verticalAlign: "top", display: "inline-block", position: "absolute", left: timeBeforeToday * 70 + 20, top: 30 * i, width: durationOfRetro * 70 - 20, height: 30 }}>
                        <Tag 
                            interactive={true}
                            style={{
                                "backgroundColor": getThresholdFromValue(DEFAULT_THRESHOLDS, retro.value).color,
                                height: 30,
                            }}
                            fill={true}
                            onRemove={() => this.props.deleteRetro(retro._id)}
                            onClick={(e: any) => this.onClick(e, retro._id)}
                            rightIcon={getThresholdFromValue(DEFAULT_THRESHOLDS, retro.value).icon}
                        >
                            {retro.title}
                        </Tag>
                    </div>
                ))
            }
        }
        
        return retroDisplay;
    }

    render() {
        return (
            <div className="header-retro" style={{width: 3000, position: "relative"}}>
                {
                    this.renderRetroRows(this.props.retroRows)
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
            <div className={"row-contents hide-scrollbar habit"} onScroll={syncScroll} style={{overflowY: "auto", overflowX: "auto"}}>
                <Retros startDate={this.props.startDate}
                        endDate={this.props.endDate}
                        retroRows={this.props.retroRows}
                        selectRetroForEdit={this.props.selectRetroForEdit}
                        deleteRetro={this.props.deleteRetro}
                            />
            </div>
        </div>
        )
    }
}

function mapStateToProps(state: any) {
    // greedily put the latest retro into the first row, then next-latest into the first fitting row
    const sortedRetros = _.orderBy(state.retros, (retro: any) => {
        return retro.endDate.format('YYYYMMDD')
    }, ['desc']);
    
    let rowDisplay: any = [[]];
    for (let i = 0; i < sortedRetros.length; i++) {
        let insertionRow = 0;
        while (insertionRow < rowDisplay.length) {
            let willFitInRow = true;
            for (let j = 0; j < rowDisplay[insertionRow].length; j++) {
                if (
                    (rowDisplay[insertionRow][j].startDate <= sortedRetros[i].startDate && sortedRetros[i].startDate <= rowDisplay[insertionRow][j].endDate) ||
                    (rowDisplay[insertionRow][j].startDate <= sortedRetros[i].endDate && sortedRetros[i].endDate <= rowDisplay[insertionRow][j].endDate)
                ) {
                    willFitInRow = false;
                    break;
                }
            }
            if (willFitInRow) {
                rowDisplay[insertionRow].push(sortedRetros[i]);
                break;
            } else {
                insertionRow++;
            }
        }
        if (insertionRow === rowDisplay.length) {
            rowDisplay.push([sortedRetros[i]]);
        }
    }

    return {
        days: state.days,
        retroRows: rowDisplay,
        startDate: state.days[0], // TODO: this should never be empty... right?
        endDate: state.days[state.days.length - 1],
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LongRetroContainer);