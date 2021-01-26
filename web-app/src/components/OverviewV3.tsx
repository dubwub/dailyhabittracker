import * as React from 'react';

import _ from 'lodash';
import { connect } from 'react-redux';
import * as mapDispatchToProps from '../actions/index.actions.js'; 
import { Button, InputGroup, H3, H4, H5, Tag, Tab, Tabs, Checkbox, TextArea } from "@blueprintjs/core";
import { Props } from "../types/types"; 
import { callbackify } from 'util';
import { base_emotions, color_map, feelings_wheel } from '../utils/safe-constants'; 
const moment = require('moment-timezone');

interface State {
    editedTitle: string
    editedNote: string
    editedType: string
    editedTags: {
        type: string,
        tag: string,
        background: string,
        textColor: string,
    }[]
    editedParents: string[]
    editedNeighbors: string[]
    editedTag: string

    searchString: string
    tagSearch: string[]
}

class OverviewV3 extends React.Component<Props, State>{    
    constructor(props: Props) {
        super(props);
        this.props.loadUserV3();
        this.state = {
            editedTitle: "",
            editedNote: "",
            editedType: "journal",
            editedTags: [],
            editedTag: "",
            tagSearch: [],
            searchString: "",
            editedParents: [],
            editedNeighbors: [],
        }
    }

    clear(){
        this.setState({
            ...this.state,
            editedTitle: "",
            editedNote: "",
            editedType: "journal",
            editedTags: [],
            editedTag: "",
            tagSearch: [],
            searchString: "",
            editedParents: [],
            editedNeighbors: [],
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
            editedTags: this.state.editedTags.concat([tag]),
            editedTag: "",
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

    modifySearchString(searchString: string) {
        this.setState({
            ...this.state,
            searchString: searchString
        })
    }

    loadEntryAsState(entry: any) {
        this.setState({
            ...this.state,
            editedTitle: entry.title,
            editedNote: entry.note,
            editedType: entry.entryType,
            editedTags: entry.tags,
            editedParents: [entry._id],
            editedNeighbors: [],
        })
    }

    render() {
        let pageContents = (<div />);
        switch (this.props.currentTabV2) {
            case "write":
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
                            height: "50%",
                            overflowY: "auto",
                            top: 0,
                        }}> 
                            <Button disabled={this.state.editedType === "curiosity"} onClick={() => this.modifyType("curiosity")}>curiosity</Button>
                            <Button disabled={this.state.editedType === "journal"} onClick={() => this.modifyType("journal")}>journal</Button>
                            <Button disabled={this.state.editedType === "document"} onClick={() => this.modifyType("document")}>document</Button>
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

                        <div style={{
                            position: "absolute",
                            width: "30%",
                            height: "50%",
                            overflowY: "auto",
                            top: "50%",
                        }}>
                            <InputGroup id="edit-tag" type="text" placeholder="Add a tag" 
                                    value={this.state.editedTag}
                                    onChange={(e: any) => this.modifyTag(e.target.value)}
                                    style={{
                                        width: "70%",
                                    }}
                                    />
                            <Button icon={"floppy-disk"} style={{
                                position: "absolute",
                                top: 0,
                                left: "70%",
                            }} onClick={() => { this.addTag({ tag: this.state.editedTag, type: "other" }); }}
                            ></Button>
                            {
                                this.state.editedTags.map((tag: any) => (
                                    <div><Button 
                                        onClick={(e: any) => this.removeTag(tag.tag)}
                                        intent={"primary"}
                                        >{tag.tag}</Button></div>
                                ))
                            }
                            {
                                this.props.tagOrder.filter((tag: any) => 
                                    {
                                        if (_.isNil(this.props.tags[tag])) { return false; }
                                        return this.props.tags[tag].tag.includes(this.state.editedTag);
                                    }
                                ).map((tag: any) => (
                                    <div><Button 
                                        onClick={(e: any) => this.addTag(this.props.tags[tag])}
                                        >{this.props.tags[tag].tag}</Button></div>
                                ))
                            }
                        </div>


                        <InputGroup id="edit-title" type="text" placeholder="Title (OPTIONAL)" 
                                    value={this.state.editedTitle}
                                    onChange={(e: any) => this.modifyTitle(e.target.value)}
                                    style={{
                                        width: "40%",
                                        marginLeft: "30%",
                                        position: "absolute",
                                        top: 20,
                                    }}
                                    />
                        <br/><TextArea
                            id="edit-note"
                            growVertically={false}
                            large={true}
                            placeholder="Write whatever you want!"
                            value={this.state.editedNote}
                            onChange={(e) => { this.modifyNote(e.target.value)}}
                            style={{
                                width: "40%",
                                height: 400,
                                position: "absolute",
                                marginLeft: "30%",
                                top: 100,
                            }}
                            />

                        <br/>
                        <div style={{position: "absolute", top: 30, right: "10%"}}>
                            <Button icon="floppy-disk" intent={"success"} onClick={() => this.props.createEntryV3(this.state.editedType, this.state.editedTitle, this.state.editedNote, this.state.editedTags, this.state.editedParents, this.state.editedNeighbors)}>Save new entry</Button>
                            <div style={{display:"inline-block", width: 50}}></div><Button intent={"danger"} onClick={() => this.clear()}>Clear</Button>
                        </div>
                    </div>
                )
                break;
            case "reflect":
                let tags: string[] = [];
                for (let id of this.props.entriesV3Order) {
                    let entry = this.props.entriesV3[id];
                    for (let tag of entry.tags) {
                        if (tags.indexOf(tag.tag) === -1 && tag.tag.toLowerCase().replace(/[^a-z]+/g, '').includes(this.state.searchString)) {
                            tags.push(tag.tag)
                        }
                    }
                }

                let flatEmotions: string[] = [];
                for (let entry of this.props.entriesV2) {
                    for (let emotion of entry.observations) {
                        if (flatEmotions.indexOf(entry) === -1) {
                            flatEmotions.push(emotion);
                        }
                    }
                }

                let levels = [
                    "document", "journal", "curiosity"
                ]

                pageContents = (
                    <div className={"mainpage"}>
                        <InputGroup type="text" className="bp3-input" placeholder="Note Search" 
                                value={this.state.searchString}
                                onChange={(e: any) => this.modifySearchString(e.target.value.toLowerCase().replace(/[^a-z]+/g, ''))}
                                />
                        {tags.map((tag: string) => {
                            return <Button intent={this.state.tagSearch.indexOf(tag) !== -1 ? "primary": "none"}
                            onClick={() => {
                                if (this.state.tagSearch.indexOf(tag) !== -1) {
                                    this.removeTagSearch(tag);
                                } else {
                                    this.addTagSearch(tag);
                                }
                            }}>{tag}</Button>
                        })}
                        
                        {
                            levels.map((level: string, index: number) => {
                                let prevDay: any = moment().tz('America/New_York').add(1, 'days');
                                return (
                                    <div style={{width: "100%", position: "absolute", height: 400, top: index * 400 + 80, overflowX: "auto", overflowY: "hidden", wordWrap: "break-word"}}>
                                        {
                                            this.props.entriesV3Order.filter((id: any) => { 
                                                let entry = this.props.entriesV3[id];
                                                let cleanedEntryForFilter = ((_.isNil(entry.title) ? "" : entry.title) + entry.note).toLowerCase().replace(/[^a-z]+/g, '');
                                                if (!_.isNil(entry.tags)) {
                                                    for (let tag of entry.tags) {
                                                        cleanedEntryForFilter += tag.tag.toLowerCase().replace(/[^a-z]+/g, '')
                                                    }
                                                    for (let tag of this.state.tagSearch) {
                                                        if (entry.tags.map((tag: any) => tag.tag).indexOf(tag) === -1) return false;
                                                    }
                                                } else {
                                                    if (this.state.tagSearch.length > 0) return false;
                                                }
                                                return entry.latest && entry.entryType === level && !(this.state.searchString.length > 0 && !cleanedEntryForFilter.includes(this.state.searchString))
                                            }).slice().reverse().map((_entry: any, index: number) => {
                                                let entry = this.props.entriesV3[_entry];
                                                let entryDate = moment.utc(entry.time).subtract(5, 'hours'); // hardcoded for EST
                                                let dayIsSame = entryDate.isSame(prevDay, "day");
                                                prevDay = entryDate;
                                                let emotionColors = entry.tags.filter((tag: any) => tag.entryType === "emotion").map((tag: any) => {
                                                    let color = color_map[tag.tag];
                                                    return (
                                                        <div style={{width: 20, height: 20, margin: 5, display: "inline-block", backgroundColor: color}}></div>
                                                    )
                                                });

                                                return (
                                                    <div style={{position: "absolute", top: 0, left: index * 310, width: 300, height: 150}}>
                                                        { dayIsSame ? <span></span> : <H3>{entryDate.format("MM/DD/YYYY")}</H3>}
                                                        <div style={{whiteSpace: "pre-line", padding: 10, margin: 5, marginTop: dayIsSame ? 0 : 10}}>
                                                            <div>{emotionColors}</div>
                                                            <H5>{entry.entryType} : [{entry.title}]</H5>
                                                            <Button icon={"upload"} onClick={() => {
                                                                this.loadEntryAsState(entry);
                                                                this.props.selectTabV2("write");
                                                            }}>Load</Button>
                                                            {entryDate.format()}
                                                            <div>
                                                                {
                                                                    entry.tags.map((tag: any) => <Tag>{tag.tag}</Tag>)
                                                                }
                                                            </div>
                                                            {entry.note}
                                                            {/* <div>
                                                                {
                                                                    entry.observations.map((observation: string) => <Tag>{observation}</Tag>)
                                                                }
                                                            </div> */}
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                )
                            })
                        }
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
