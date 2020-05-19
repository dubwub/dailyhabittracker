import React, { Component } from 'react';
import { Button, Card, Dialog, Elevation, FormGroup, Icon, InputGroup, NumericInput } from '@blueprintjs/core';
import * as moment from "moment";
import { connect } from 'react-redux';
import * as mapDispatchToProps from '../../actions/index.actions.js';
import _ from 'lodash';

class DreamEditDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showDialog: false,
            showDreamEditor: false, // whether to show tab 1 (order change) or tab 2 (dream edit)
            dreamForEdit: undefined, // which dream to edit, null for new
            editedCategoryOrder: props.categoryOrder,
            editedCategories: props.categories,
            newCategoryTitle: "I want to feel...",
            newCategoryIcon: "heart-broken",
            newCategoryColor: "red",
            newCategoryOrder: 1,
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            ...prevState,
            showDialog: nextProps.showDialog,
            editedCategories: nextProps.categories,
            editedCategoryOrder: nextProps.categoryOrder,
        };
    }

    modifyNewCategoryField(field, value) {
        let newState = Object.assign({}, this.state);
        newState[field] = value;
        this.setState(newState);
    }

    modifyEditedCategoryField(category, field, value) {
        let newEditedCategories = Object.assign({}, this.state.editedCategories);
        newEditedCategories[category][field] = value;
        this.setState({
            ...this.state,
            editedCategories: newEditedCategories,
        })
    }

    // TODO: make it so that i only need to specify the order, everything else won't be overwritten
    modifyCategoryOrder(index, shift) {
        let category1 = this.state.editedCategoryOrder[index];
        let category2 = this.state.editedCategoryOrder[index + shift];
        let newEditedCategoryOrder = this.state.editedCategoryOrder;
        newEditedCategoryOrder[index] = category2;
        newEditedCategoryOrder[index + shift] = category1;
        this.setState({
            ...this.state,
            editedCategoryOrder: newEditedCategoryOrder,
        })
        // note indices are 0-indexed, so +1
        this.props.updateCategory(category1, this.state.editedCategories[category1].title, this.state.editedCategories[category1].icon, index + shift + 1, this.state.editedCategories[category1].color);
        this.props.updateCategory(category2, this.state.editedCategories[category2].title, this.state.editedCategories[category2].icon, index + 1, this.state.editedCategories[category2].color);
    }

    onClickEditButton(index) {
        this.setState({
            ...this.state,
            showDreamEditor: true,
            dreamForEdit: this.state.editedCategoryOrder[index],
        })
    }

    onClickBackButton() {
        this.setState({
            ...this.state,
            showDreamEditor: false,
            dreamForEdit: undefined,
        })
    }

    onClose() {
        this.setState({
            ...this.state,
            showDreamEditor: false,
            dreamForEdit: undefined,
        })
        this.props.toggleShowCategoryEditDialog(false)
    }

    onClickCreateNewDream() {
        this.setState({
            ...this.state,
            showDreamEditor: true,
            dreamForEdit: undefined,
        })
    }

    onDeleteDream(cid) {
        this.onClickBackButton();
        this.props.deleteCategory(cid);
    }

    render() {
        let body = (<div />)
        if (!this.state.showDreamEditor) {
            body = (
                <div>
                    {
                        this.state.editedCategoryOrder.map((cid, index) => {
                            const category = this.state.editedCategories[cid];
                            return (
                                <Card elevation={Elevation.TWO}
                                      style={{backgroundColor: category.color, position: "relative"}}
                                      key={cid}>
                                    <Icon icon={category.icon} />
                                    {category.title}
                                    <div style={{position: "absolute", right: 10, bottom: 10}}>
                                        <Button icon={"edit"} minimal={true} onClick={() => this.onClickEditButton(index)}/>
                                        <Button icon={"chevron-up"} minimal={true} disabled={index === 0} onClick={() => this.modifyCategoryOrder(index, -1)}/>
                                        <Button icon={"chevron-down"} minimal={true} disabled={index === this.props.categoryOrder.length - 1} onClick={() => this.modifyCategoryOrder(index, 1)}/>
                                    </div>
                                </Card>
                            );
                        })
                    }
                    <Button icon={"add"}
                            onClick={() => this.onClickCreateNewDream()}>Create New Dream</Button>
                </div>
            )
        } else {
            if (_.isNil(this.state.dreamForEdit)) {
                body = (
                    <div>
                        <Button icon={"undo"} onClick={() => this.onClickBackButton()}>Back</Button>
                        <h3>Add New Dream</h3>
                        <FormGroup
                            label="What is your dream?">
                            <InputGroup type="text" className="bp3-input" placeholder="I want to feel ..." 
                                value={this.state.newCategoryTitle}
                                onChange={(e) => this.modifyNewCategoryField("newCategoryTitle", e.target.value)}
                                />
                        </FormGroup>
                        <FormGroup
                            label="What's a picture that represents what your dream means to you?">
                            <InputGroup type="text" className="bp3-input" placeholder="Icon" 
                                value={this.state.newCategoryIcon}
                                onChange={(e) => this.modifyNewCategoryField("newCategoryIcon", e.target.value)}
                                />
                        </FormGroup>
                        <FormGroup
                            label="What color do you want this dream to be?">
                            <InputGroup id="edit-color" type="text" className="bp3-input" placeholder="Color" 
                                value={this.state.newCategoryColor}
                                onChange={(e) => this.modifyNewCategoryField("newCategoryColor", e.target.value)}
                                />
                        </FormGroup>
    
                        <div className="bp3-dialog-footer">
                            <Button
                                icon="floppy-disk"
                                intent="primary"
                                onClick={() => this.props.createCategory(
                                    this.state.newCategoryTitle,
                                    this.state.newCategoryIcon,
                                    this.state.editedCategoryOrder.length + 1,
                                    this.state.newCategoryColor,
                                )}>Save</Button>
                        </div>
                    </div>
                )
            } else {
                let cid = this.state.dreamForEdit;
                let category = this.state.editedCategories[cid];
                body = (
                    <div>
                        <Button icon={"undo"} onClick={() => this.onClickBackButton()}>Back</Button>
                        <FormGroup
                            label="What is your dream?">
                            <InputGroup type="text" className="bp3-input" placeholder="I want to feel ..." 
                                value={category.title}
                                onChange={(e) => this.modifyEditedCategoryField(cid, "title", e.target.value)}
                                />
                        </FormGroup>
                        <FormGroup
                            label="What's a picture that represents what your dream means to you?">
                            <InputGroup type="text" className="bp3-input" placeholder="Icon" 
                                value={category.icon}
                                onChange={(e) => this.modifyEditedCategoryField(cid, "icon", e.target.value)}
                                />
                        </FormGroup>
                        <FormGroup
                            label="What color do you want this dream to be?">
                            <InputGroup id="edit-color" type="text" className="bp3-input" placeholder="Color" 
                                value={category.color}
                                onChange={(e) => this.modifyEditedCategoryField(cid, "color", e.target.value)}
                                />
                        </FormGroup>
                        <Button
                            icon="floppy-disk"
                            intent="primary"
                            onClick={() => this.props.updateCategory(cid, category.title, category.icon, category.order, category.color)}>Save</Button>
                        <Button
                            icon="delete"
                            intent="warning"
                            onClick={() => this.onDeleteDream(cid)}>Delete</Button>
                    </div>
                );
            }
        }

        return (
            <Dialog 
                isOpen={this.state.showDialog}
                canOutsideClickClose={true}
                canEscapeKeyClose={true}
                isCloseButtonShown={true}
                onClose={() => this.onClose()}
                title={"Update your Dreams"}>
                <div className="bp3-dialog-body">
                    {body}
                </div>
            </Dialog>
        );
    }
}

function mapStateToProps(state) {
    return {
        categories: state.categories,
        categoryOrder: state.categoryOrder,
        showDialog: state.showCategoryEditDialog,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DreamEditDialog);
