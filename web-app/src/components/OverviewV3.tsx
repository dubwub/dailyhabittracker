import * as React from 'react';

import _ from 'lodash';
import { connect } from 'react-redux';
import * as mapDispatchToProps from '../actions/index.actions.js'; 
import { Button, InputGroup, H3, H4, H5, Tag, Tab, Tabs, Checkbox, TextArea } from "@blueprintjs/core";
import { Props } from "../types/types"; 
import { callbackify } from 'util';
import { base_emotions, feelings_wheel } from '../utils/safe-constants'; 
const moment = require('moment-timezone');

interface State {
    editedEntryId: string | undefined
    editedTitle: string
    editedNote: string
    editedType: string
    editedTags: {
        type: string,
        tag: string,
        background: string,
        textColor: string,
    }[]
    editedTransactions: {
        time: any,
        type: string,
        title: string,
        note: string,
    }[]
    editedTag: string

    searchString: string
    tagSearch: string[]
}

class OverviewV3 extends React.Component<Props, State>{    
    constructor(props: Props) {
        super(props);
        this.props.loadUserV2();
        this.state = {
            editedEntryId: undefined,
            editedTitle: "",
            editedNote: "",
            editedType: "journal",
            editedTags: [],
            editedTransactions: [],
            editedTag: "",
            tagSearch: [],
            searchString: "",
        }
    }

    clear(){
        this.setState({
            ...this.state,
            editedEntryId: undefined,
            editedTitle: "",
            editedNote: "",
            editedType: "journal",
            editedTags: [],
            editedTransactions: [],
            editedTag: "",
            tagSearch: [],
            searchString: "",
        })
    }

    modifyTitle(title: string) {
        this.setState({
            ...this.state,
            editedTitle: title,
        })
    }
    modifyType(type: string) {
        this.setState({
            ...this.state,
            editedType: type,
        })
    }
    modifyTag(tag: string) {
        this.setState({
            ...this.state,
            editedTag: tag,
        })
    }
    addTag(tag: any) {
        this.setState({
            ...this.state,
            editedTags: this.state.editedTags.concat([tag])
        })
    }
    removeTag(tag: string) {
        this.setState({
            ...this.state,
            editedTags: this.state.editedTags.filter((e: any) => e.tag !== tag)
        })
    }

    addTagSearch(tag: string) {
        this.setState({
            ...this.state,
            tagSearch: this.state.tagSearch.concat([tag])
        })
    }
    removeTagSearch(tag: string) {
        this.setState({
            ...this.state,
            tagSearch: this.state.tagSearch.filter((e: string) => e !== tag)
        })
    }
    modifyNote(note: string) {
        this.setState({
            ...this.state,
            editedNote: note
        })
    }

    loadEntryAsState(entry: any) {
        this.setState({
            ...this.state,
            editedEntryId: entry._id,
            editedTitle: entry.title,
            editedNote: entry.note,
            editedType: entry.type,
            editedTags: entry.tags,
            editedTransactions: [{
                time: entry.time,
                type: entry.type,
                note: entry.note,
                title: entry.title,
            }, ...entry.transactions],
        })
    }

    render() {
        let pageContents = (<div />);
        switch (this.props.currentTabV2) {
            case "write":
                // let cleanedNote = (this.state.editedTitle + " " + this.state.editedNote).toLowerCase().split(/\W/);
                // let cleanedTags: any = {};
                // let specificTagMap: any = {};
                // let numTags = this.props.dreamOrder.length + this.props.experimentOrder.length;
                // for (let i of this.props.dreamOrder) {
                //     let dream = this.props.dreams[i];
                //     let cleanedTitle = dream.title.toLowerCase().split(/\W/);
                //     for (let word of cleanedTitle) {
                //         if (stop_words.indexOf(word) !== -1) continue;
                //         if (cleanedTags[word]) {
                //             cleanedTags[word].push(dream.title);
                //         } else {
                //             cleanedTags[word] = [dream.title];
                //         }
                //     }
                // }
                // for (let i of this.props.experimentOrder) {
                //     let experiment = this.props.experiments[i];
                //     let cleanedTitle = experiment.title.toLowerCase().split(/\W/);
                //     for (let word of cleanedTitle) {
                //         if (stop_words.indexOf(word) !== -1) continue;
                //         if (cleanedTags[word]) {
                //             cleanedTags[word].push(experiment.title);
                //         } else {
                //             cleanedTags[word] = [experiment.title];
                //         }
                //     }
                // }
                // for (let entry of this.props.entriesV2) {
                //     let cleanWords = entry.note.toLowerCase().split(/\W/);
                //     for (let word of cleanWords) {
                //         if (stop_words.indexOf(word) !== -1) continue;
                //         if (entry.dreams.length > 0) {
                //             let dreamsExploded = entry.dreams.map((i: string) => this.props.dreams[i].title);
                //             if (specificTagMap[word]) {
                //                 for (let i = 0; i < dreamsExploded.length; i++) {
                //                     if (specificTagMap[word].indexOf(dreamsExploded[i]) === -1) {
                //                         specificTagMap[word].push(dreamsExploded[i]);
                //                     }
                //                 }
                //             } else {
                //                 specificTagMap[word] = dreamsExploded;
                //             }
                //         }
                //         if (entry.experiments.length > 0) {
                //             let experimentsExploded = entry.dreams.map((i: string) => this.props.dreams[i].title);
                //             if (specificTagMap[word]) {
                //                 for (let i = 0; i < experimentsExploded.length; i++) {
                //                     if (specificTagMap[word].indexOf(experimentsExploded[i]) === -1) {
                //                         specificTagMap[word].push(experimentsExploded[i]);
                //                     }
                //                 }
                //             } else {
                //                 specificTagMap[word] = experimentsExploded;
                //             }
                //         }
                //     }
                // }

                // let relevantTagTitles: string[] = [];
                // for (let i = 0; i < cleanedNote.length; i++) {
                //     if (cleanedTags[cleanedNote[i]] && cleanedTags[cleanedNote[i]].length <= numTags / 2) {
                //         for (let addTag of cleanedTags[cleanedNote[i]]) {
                //             if (relevantTagTitles.indexOf(addTag) === -1) {
                //                 relevantTagTitles.push(addTag);
                //             }
                //         }
                //     }
                //     if (specificTagMap[cleanedNote[i]] && specificTagMap[cleanedNote[i]].length < 3) {
                //         for (let addTag of specificTagMap[cleanedNote[i]]) {
                //             if (relevantTagTitles.indexOf(addTag) === -1) {
                //                 relevantTagTitles.push(addTag);
                //             }
                //         }
                //     }
                // }

                // get first layer of emotional depth
                let selectedEmotions = this.state.editedTags.filter((tag: any) => tag.type === "emotion");
                let suggestedEmotions: any[] = base_emotions;
                for (let i = 0; i < selectedEmotions.length; i++) {
                    if (typeof feelings_wheel[selectedEmotions[i].tag] === "undefined") continue;
                    suggestedEmotions = suggestedEmotions.concat(feelings_wheel[selectedEmotions[i].tag])
                }
                suggestedEmotions = suggestedEmotions.filter((tag: any) => this.state.editedTags.map((_tag: any) => _tag.tag).indexOf(tag.emotion) === -1);

                pageContents = (
                    <div className={"mainpage"}>
                        <div style={{
                            position: "absolute",
                            width: "30%",
                            height: "80%",
                            overflowY: "auto",
                            top: 50,
                        }}>
                            {/* {

                                this.props.dreamOrder.filter((dream: any) => 
                                    (relevantTagTitles.indexOf(this.props.dreams[dream].title) !== -1) ||
                                    (this.state.editedSubnotes.map((subnote: any) => subnote.dream).indexOf(dream) !== -1)).map((dream: any) => {
                                    // return <Checkbox 
                                    //     checked={this.state.editedDreams.includes(dream)}
                                    //     onChange={(e: any) => e.target.checked ? this.addDream(dream) : this.removeDream(dream)}
                                    // >{this.props.dreams[dream].title}</Checkbox>
                                    return <Button 
                                        onClick={(e: any) => this.addSubnote(dream, undefined)}
                                        intent={this.state.editedSubnotes.map((subnote: any) => subnote.dream).indexOf(dream) !== -1 ? "primary" : "none"}
                                    >{this.props.dreams[dream].title}</Button>
                                })
                            }
                            {
                                this.props.experimentOrder.filter((experiment: any) => 
                                    (relevantTagTitles.indexOf(this.props.experiments[experiment].title) !== -1) || 
                                    (this.state.editedSubnotes.map((subnote: any) => subnote.experiment).indexOf(experiment) !== -1)).map((experiment: any) => (
                                    // <Checkbox 
                                    //     checked={this.state.editedExperiments.includes(experiment)}
                                    //     onChange={(e: any) => e.target.checked ? this.addExperiment(experiment) : this.removeExperiment(experiment)}
                                    // >{this.props.experiments[experiment].title}</Checkbox>
                                    <Button 
                                        onClick={(e: any) => this.addSubnote(undefined, experiment)}
                                        intent={this.state.editedSubnotes.map((subnote: any) => subnote.experiment).indexOf(experiment) !== -1 ? "primary" : "none"}
                                    >{this.props.experiments[experiment].title}</Button>
                                ))
                            } */}
                            
                            {
                                <div>
                                    {
                                        this.state.editedTags.filter((tag: any) => tag.type === "emotion").map((tag: any) => {
                                            return (
                                                    <Button 
                                                        style={{
                                                            backgroundColor: tag.background,
                                                            color: tag.textColor,
                                                        }}
                                                        icon={"cross"}
                                                        onClick={(e: any) => { this.removeTag(tag.tag) }}>{tag.tag}</Button>
                                            )
                                        })
                                    }
                                </div>
                            }
                            {
                                suggestedEmotions.map((tag: any) => {
                                    return (
                                            <Button 
                                                style={{
                                                    backgroundColor: tag.background,
                                                    color: tag.textColor,
                                                }}
                                                minimal={true}
                                                onClick={(e: any) => { this.addTag({type: "emotion", tag: tag.emotion}) }}>{tag.emotion}</Button>
                                    )
                                })
                            }
                        </div>


                        {/* <InputGroup id="edit-title" type="text" placeholder="Title (OPTIONAL)" 
                                    value={this.state.editedTitle}
                                    onChange={(e: any) => this.modifyTitle(e.target.value)}
                                    style={{
                                        width: "40%",
                                        marginLeft: "30%",
                                        position: "absolute",
                                        top: 20,
                                    }}
                                    />

                        {
                            <div style={{marginLeft: "30%", position: "absolute", top: 60}}>
                                { generateQuickAddButtons(DEFAULT_THRESHOLDS, 1, 10, onClick, this.state.editedFeelingScore) }
                            </div>
                        }
                        <br/><TextArea
                            id="edit-note"
                            growVertically={false}
                            large={true}
                            placeholder="Write whatever you want!"
                            value={this.state.editedNote}
                            onSelect={(e: any) => { 
                                // e.persist();
                                // console.log(e);
                                // console.log(e.target.value.substring(e.target.selectionStart, e.target.selectionEnd))
                                this.setHighlightSelection(e.target.value.substring(e.target.selectionStart, e.target.selectionEnd))
                            }}
                            onChange={(e) => { this.modifyNote(e.target.value)}}
                            style={{
                                width: "40%",
                                height: 400,
                                position: "absolute",
                                marginLeft: "30%",
                                top: 100,
                            }}
                            />
                        
                        <div style={{
                            width: "28%",
                            position: "absolute",
                            left: "72%"
                        }}>
                        </div>

                        <div style={{
                            width: "28%",
                            position: "absolute",
                            left: "72%",
                            top: "50%",
                        }}>
                            <Button onClick={() => this.addHighlight(this.state.editedSelection)}>Save highlight</Button>
                            {
                                this.state.editedHighlights.map((highlight: string, index: number) => (
                                    <div>
                                        {highlight}
                                        <Button onClick={() => this.removeHighlight(index)}>X</Button>
                                    </div>
                                ))
                            }
                        </div>

                        <br/>
                        <div style={{position: "absolute", top: 550, marginLeft: "30%"}}>
                            <Button icon="floppy-disk" intent={"success"} onClick={() => 
                                this.props.createEntryV2(this.state.editedTitle, this.state.editedDreams, this.state.editedExperiments, this.state.editedFeelingScore, this.state.editedNote, this.state.editedObservations, this.state.editedHighlights, this.state.editedSubnotes)}>Save new entry</Button>
                            <div style={{display:"inline-block", width: 100}}></div><Button intent={"danger"} onClick={() => this.clear()}>Clear</Button>
                        </div> */}
                    </div>
                )
                break;
            case "reflect":
                let prevDay: any = moment().tz('America/New_York').add(1, 'days');

                let flatEmotions: string[] = [];
                for (let entry of this.props.entriesV2) {
                    for (let emotion of entry.observations) {
                        if (flatEmotions.indexOf(entry) === -1) {
                            flatEmotions.push(emotion);
                        }
                    }
                }

                pageContents = (
                    <div className={"mainpage"}>
                        <InputGroup type="text" className="bp3-input" placeholder="Note Search" 
                                value={this.state.searchString}
                                // onChange={(e: any) => this.modifyNoteSearch(e.target.value)}
                                />
                    </div>
                )
                break;
            default:
                pageContents = (
                    <div>
                        wtf is the tab name?
                    </div>
                );
                break;
        }

        if (this.props.user) { // because of async, this render happens twice, once on page load and once when we hear back from mongo
            return (
                <div>
                    <div>
                        <div className="topbar">
                            <Tabs id="headerTabs"
                                large={true}
                                onChange={(e) => this.props.selectTabV2(e)}
                                selectedTabId={this.props.currentTabV2}>
                                <Tab id="write" title="Write" />
                                <Tab id="reflect" title="Reflect" />
                                
                            </Tabs>
                        </div>
                        { pageContents }
                    </div>
                </div>
            );
        } else { // wait, cuz we're loading
            return (<div>Loading... (if you see this for more than 5 seconds, the server is probably dead, tell Darwin)</div>);
        }
    }
}

function mapStateToProps(state: any) {

    return {
        ...state
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(OverviewV3);
