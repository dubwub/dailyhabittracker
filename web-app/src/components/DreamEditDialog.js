import React, { Component } from 'react';
import { Button, Dialog, FormGroup, InputGroup, NumericInput } from '@blueprintjs/core';
import * as moment from "moment";
import { connect } from 'react-redux';
import * as mapDispatchToProps from '../actions/index.actions.js'; 

class DreamEditDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showDialog: false,
            editedCategoryOrder: props.categoryOrder,
            editedCategories: props.categories,
            newCategoryTitle: "New Category Title",
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

    render() {
        return (
            <Dialog 
                isOpen={this.state.showDialog}
                canOutsideClickClose={true}
                canEscapeKeyClose={true}
                isCloseButtonShown={true}
                onClose={() => this.props.toggleShowCategoryEditDialog(false)}
                title={"Update category fields"}>
                <div className="bp3-dialog-body">
                    <h3>Edit Existing Categories</h3>

                    {
                        this.props.categoryOrder.map((cid, index) => {
                            const category = this.state.editedCategories[cid];
                            return (
                                <div key={index}>
                                    <FormGroup
                                        label="Edit Category Title">
                                        <InputGroup type="text" className="bp3-input" placeholder="Title" 
                                            value={category.title}
                                            onChange={(e) => this.modifyEditedCategoryField(cid, "title", e.target.value)}
                                            />
                                    </FormGroup>
                                    <FormGroup
                                        label="Edit Category Icon">
                                        <InputGroup type="text" className="bp3-input" placeholder="Icon" 
                                            value={category.icon}
                                            onChange={(e) => this.modifyEditedCategoryField(cid, "icon", e.target.value)}
                                            />
                                    </FormGroup>
                                    <FormGroup
                                        label="Edit Category Order">
                                        <NumericInput value={category.order}
                                            onValueChange={(value) => this.modifyEditedCategoryField(cid, "order", value)}/>
                                    </FormGroup>
                                    <FormGroup
                                        label="Edit Event Color">
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
                                        onClick={() => this.props.deleteCategory(cid)}>Delete</Button>
                                </div>
                            );
                        })
                    }

                    <h3>Add New Category</h3>
                    <FormGroup
                        label="Edit Category Title">
                        <InputGroup type="text" className="bp3-input" placeholder="Title" 
                            value={this.state.newCategoryTitle}
                            onChange={(e) => this.modifyNewCategoryField("newCategoryTitle", e.target.value)}
                            />
                    </FormGroup>
                    <FormGroup
                        label="Edit Category Icon">
                        <InputGroup type="text" className="bp3-input" placeholder="Icon" 
                            value={this.state.newCategoryIcon}
                            onChange={(e) => this.modifyNewCategoryField("newCategoryIcon", e.target.value)}
                            />
                    </FormGroup>
                    <FormGroup
                        label="Edit Category Order">
                        <NumericInput value={this.state.newCategoryOrder}
                            onValueChange={(value) => this.modifyNewCategoryField("newCategoryOrder", value)}/>
                    </FormGroup>
                    <FormGroup
                        label="Edit Event Color">
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
                                this.state.newCategoryOrder,
                                this.state.newCategoryColor,
                            )}>Save</Button>
                    </div>
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
