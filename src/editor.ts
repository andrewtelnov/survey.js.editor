﻿import * as ko from "knockout";
import {editorLocalization} from "./editorLocalization";
import {SurveyObjectEditor} from "./objectEditor";
import {ISurveyObjectEditorOptions} from "./propertyEditors/propertyEditorBase";
import {SurveyPagesEditor} from "./pagesEditor";
import {SurveyEmbedingWindow} from "./surveyEmbedingWindow";
import {SurveyObjects} from "./surveyObjects";
import {SurveyVerbs} from "./objectVerbs";
import {SurveyPropertyEditorShowWindow} from "./questionEditors/questionEditor";
import {SurveyJSONEditor} from "./surveyJSONEditor";
import {SurveyTextWorker} from "./textWorker"
import {SurveyUndoRedo, UndoRedoItem} from "./undoredo";
import {SurveyHelper, ObjType} from "./surveyHelper";
import {DragDropHelper} from "./dragdrophelper";
import {QuestionToolbox} from "./questionToolbox";
import {SurveyJSON5} from "./json5";
var templateEditorHtml = require("html-loader?interpolate!val-loader!./templates/entry.html");
import * as Survey from "survey-knockout";
import {SurveyForDesigner} from "./surveyjsObjects"

/**
 * The toolbar item description
 */
export interface IToolbarItem {
    /**
     * Unique string id
     */
    id: string;
    /**
     * Set this property to false to make the toolbar item invisible.
     */
    visible: KnockoutObservable<boolean> | boolean;
    /**
     * Toolbar item title
     */
    title: KnockoutObservable<string> | string;
    /**
     * Set this property to false to disable the toolbar item.
     */
    enabled?: KnockoutObservable<boolean> | boolean;
    /**
     * A callback that calls on toolbar item click.
     */
    action?: () => void;
    /**
     * css class
     */
    css?: KnockoutObservable<string> | string;
    innerCss?: KnockoutObservable<string> | string;
    data?: any;
    template?: string;
    items?: KnockoutObservableArray<IToolbarItem>;
}
/**
 * Survey Editor is WYSIWYG editor. 
 */
export class SurveyEditor implements ISurveyObjectEditorOptions {
    public static defaultNewSurveyText: string = "{ pages: [ { name: 'page1'}] }";
    private renderedElement: HTMLElement;
    private surveyjs: HTMLElement;
    private surveyjsExample: HTMLElement;

    private jsonEditor: SurveyJSONEditor;
    private selectedObjectEditorValue: SurveyObjectEditor;
    private questionEditorWindow: SurveyPropertyEditorShowWindow;
    private pagesEditor: SurveyPagesEditor;
    private surveyEmbeding: SurveyEmbedingWindow;
    private surveyObjects: SurveyObjects;
    private toolboxValue: QuestionToolbox;
    private surveyVerbs: SurveyVerbs;
    private undoRedo: SurveyUndoRedo;
    private surveyValue: SurveyForDesigner;
    private saveSurveyFuncValue: (no: number, onSaveCallback: (no: number, isSuccess: boolean) => void) => void;
    private options: any;
    private stateValue: string = "";
    private dragDropHelper: DragDropHelper = null;
    private showJSONEditorTabValue: boolean;
    private showTestSurveyTabValue: boolean;
    private showEmbededSurveyTabValue: boolean;
    private select2: any = null;
    private alwaySaveTextInPropertyEditorsValue: boolean = false;
    private showApplyButtonValue: boolean = true;
    private isRTLValue: boolean = false;

    /**
     * This property is assign to the survey.surveyId property on showing in the "Embed Survey" tab.
     * @see showEmbededSurveyTab
     */
    public surveyId: string = null;
    /**
     * This property is assign to the survey.surveyPostId property on showing in the "Embed Survey" tab.
     * @see showEmbededSurveyTab
     */
    public surveyPostId: string = null;
    /**
     * This callback is called on changing "Generate Valid JSON" option.
     */
    public generateValidJSONChangedCallback: (generateValidJSON: boolean) => void;
    /**
     * The event is called before showing a property in the Property Grid or in Question Editor. 
     * <br/> sender the survey editor object that fires the event
     * <br/> options.obj the survey object, Survey, Page, Panel or Question
     * <br/> options.property the object property (Survey.JsonObjectProperty object). It has name, className, type, visible, readOnly and other properties.
     * <br/> options.canShow a boolean value. It is true by default. Set it false to hide the property from the Property Grid or in Question Editor
     */
    public onCanShowProperty: Survey.Event<(sender: SurveyEditor, options: any) => any, any> = new Survey.Event<(sender: SurveyEditor, options: any) => any, any>();
    /**
     * The event is called on adding a new question into the survey. Typically, when a user dropped a Question from the Question Toolbox into designer Survey area.
     * <br/> sender the survey editor object that fires the event
     * <br/> options.question a new added survey question. Survey.QuestionBase object
     * <br/> options.page the survey Page object where question has been added.
     */
    public onQuestionAdded: Survey.Event<(sender: SurveyEditor, options: any) => any, any> = new Survey.Event<(sender: SurveyEditor, options: any) => any, any>();
    /**
     * The event is called on adding a new Survey.ItemValue object. It uses as an element in choices array in Radiogroup, checkbox and dropdown questions or Matrix columns and rows properties.
     * Use this event, to set ItemValue.value and ItemValue.text properties by default or set a value to the custom property.
     * <br/> sender the survey editor object that fires the event
     * <br/> options.property  the object property (Survey.JsonObjectProperty object). It has name, className, type, visible, readOnly and other properties.
     * <br/> options.newItem a new created Survey.ItemValue object.
     */
    public onItemValueAdded: Survey.Event<(sender: SurveyEditor, options: any) => any, any> = new Survey.Event<(sender: SurveyEditor, options: any) => any, any>();
    /**
     * The event is called when a user adds a new column into MatrixDropdown or MatrixDynamic questions. Use it to set some properties of Survey.MatrixDropdownColumn by default, for example name or a custom property. 
     * <br/> sender the survey editor object that fires the event
     * <br/> options.newColumn a new created Survey.MatrixDropdownColumn object.
     */
    public onMatrixColumnAdded: Survey.Event<(sender: SurveyEditor, options: any) => any, any> = new Survey.Event<(sender: SurveyEditor, options: any) => any, any>();
    /**
     * The event is called on adding a new panel into the survey.  Typically, when a user dropped a Panel from the Question Toolbox into designer Survey area.
     * <br/> sender the survey editor object that fires the event
     * <br/> options.panel a new added survey panel. Survey.Panel object
     * <br/> options.page the survey Page object where question has been added.
     */
    public onPanelAdded: Survey.Event<(sender: SurveyEditor, options: any) => any, any> = new Survey.Event<(sender: SurveyEditor, options: any) => any, any>();
    /**
     * The event is called when a survey is changed in the designer. A new page/question/page is added or existing is removed, a property is changed and so on.
     * <br/> sender the survey editor object that fires the event
     */
    public onModified: Survey.Event<(sender: SurveyEditor, options: any) => any, any> = new Survey.Event<(sender: SurveyEditor, options: any) => any, any>();
    /**
     * The event is fired when the Survey Editor is initialized and a survey object (Survey.Survey) is created.
     * <br/> sender the survey editor object that fires the event
     * <br/> options.survey  the survey object showing in the editor.
     */
    public onDesignerSurveyCreated: Survey.Event<(sender: SurveyEditor, options: any) => any, any> = new Survey.Event<(sender: SurveyEditor, options: any) => any, any>();
    /**
     * Use this event to control Property Editors UI.
     * <br/> sender the survey editor object that fires the event
     * <br/> options.obj  the survey object which property is edited in the Property Editor.
     * <br/> options.propertyName  the name of the edited property.
     * <br/> options.editorOptions  options that can be changed.
     * <br/> options.editorOptions.allowAddRemoveItems a boolean property, true by default. Set it false to disable add/remove items in array properties. For example 'choices', 'columns', 'rows'.
     * <br/> options.editorOptions.showTextView a boolean property, true by default. Set it false to disable "Fast Entry" tab for "choices" property.
     */
    public onSetPropertyEditorOptions: Survey.Event<(sender: SurveyEditor, options: any) => any, any> = new Survey.Event<(sender: SurveyEditor, options: any) => any, any>();
    /**
     * Use this event to show a custom error in the Question Editor on pressing Apply or OK buttons, if the values are not set correctly. The error will be displayed under the property editor.
     * <br/> sender the survey editor object that fires the event
     * <br/> options.obj  the survey object which property is edited in the Property Editor.
     * <br/> options.propertyName  the name of the edited property.
     * <br/> options.value the property value.
     * <br/> options.error the error you want to display. Set the empty string (the default value) or null if there is no errors.
     */
    public onCustomErrorOnValidation: Survey.Event<(sender: SurveyEditor, options: any) => any, any> = new Survey.Event<(sender: SurveyEditor, options: any) => any, any>();
    koAutoSave = ko.observable(false);
    /**
     * A boolean property, false by default. Set it to true to call protected doSave method automatically on survey changing.
     */
    public get isAutoSave() { return this.koAutoSave();}
    public set isAutoSave(newVal) { this.koAutoSave(newVal); }
    koShowState = ko.observable(false);
    /**
     * A boolean property, false by default. Set it to true to show the state in the toolbar (saving/saved).
     */
    public get showState() { return this.koShowState();}
    public set showState(newVal) { this.koShowState(newVal); }

    koIsShowDesigner: any;
    koViewType: any;
    koCanDeleteObject: any;
    koObjects: any; koSelectedObject: any;
    koShowSaveButton: any;
    koGenerateValidJSON: any; koShowOptions: any; koTestSurveyWidth: any; koDesignerHeight: any;
    selectDesignerClick: any; selectEditorClick: any; selectTestClick: any; selectEmbedClick: any;
    generateValidJSONClick: any; generateReadableJSONClick: any;
    doUndoClick: any; doRedoClick: any;
    deleteObjectClick: any;
    koState = ko.observable("");
    runSurveyClick: any; embedingSurveyClick: any;
    saveButtonClick: any;
    draggingToolboxItem: any; clickToolboxItem: any;
    dragEnd: any;
    /**
     * The Survey Editor constructor.
     * @param renderedElement HtmlElement or html element id where Survey Editor will be rendered
     * @param options Survey Editor options. The following options are available: showJSONEditorTab, showTestSurveyTab, showEmbededSurveyTab, showOptions, generateValidJSON, isAutoSave, designerHeight.
     */
    constructor(renderedElement: any = null, options: any = null) {

        this.koShowOptions = ko.observable();
        this.koGenerateValidJSON = ko.observable(true);
        this.koDesignerHeight = ko.observable();
        this.setOptions(options);
        this.koCanDeleteObject = ko.observable(false);

        var self = this;

        this.koShowSaveButton = ko.observable(false);
        this.koTestSurveyWidth = ko.observable("100%");
        this.saveButtonClick = function () { self.doSave(); };
        this.koObjects = ko.observableArray();
        this.koSelectedObject = ko.observable();
        this.koSelectedObject.subscribe(function (newValue) { self.selectedObjectChanged(newValue != null ? newValue.value : null); });
        this.koGenerateValidJSON.subscribe(function (newValue) {
            if (!self.options) self.options = {};
            self.options.generateValidJSON = newValue;
            if (self.generateValidJSONChangedCallback) self.generateValidJSONChangedCallback(newValue);
        });
        this.surveyObjects = new SurveyObjects(this.koObjects, this.koSelectedObject);
        this.undoRedo = new SurveyUndoRedo();

        this.surveyVerbs = new SurveyVerbs(function () { self.setModified(); });

        this.selectedObjectEditorValue = new SurveyObjectEditor(this);
        this.selectedObjectEditorValue.onCanShowPropertyCallback = function (object: any, property: Survey.JsonObjectProperty) {
            return self.onCanShowObjectProperty(object, property);
        }
        this.selectedObjectEditorValue.onPropertyValueChanged.add((sender, options) => {
            self.onPropertyValueChanged(options.property, options.object, options.newValue);
        });
        this.questionEditorWindow = new SurveyPropertyEditorShowWindow();
        this.questionEditorWindow.onCanShowPropertyCallback = function (object: any, property: Survey.JsonObjectProperty) {
            return self.onCanShowObjectProperty(object, property);
        }
        this.pagesEditor = new SurveyPagesEditor(() => { self.addPage(); }, (page: Survey.Page) => { self.surveyObjects.selectObject(page); },
            (indexFrom: number, indexTo: number) => { self.movePage(indexFrom, indexTo); }, (page: Survey.Page) => { self.deleteCurrentObject(); });
        this.surveyEmbeding = new SurveyEmbedingWindow();
        this.toolboxValue = new QuestionToolbox(this.options && this.options.questionTypes ? this.options.questionTypes : null);

        this.koViewType = ko.observable("designer");
        this.koIsShowDesigner = ko.computed(function () { return self.koViewType() == "designer"; });
        this.selectDesignerClick = function () { self.showDesigner(); };
        this.selectEditorClick = function () { self.showJsonEditor(); };
        this.selectTestClick = function () { self.showTestSurvey(); };
        this.selectEmbedClick = function () { self.showEmbedEditor(); };
        this.generateValidJSONClick = function () { self.koGenerateValidJSON(true); };
        this.generateReadableJSONClick = function () { self.koGenerateValidJSON(false); };
        this.runSurveyClick = function () { self.showLiveSurvey(); };
        this.embedingSurveyClick = function () { self.showSurveyEmbeding(); };
        this.deleteObjectClick = function () { self.deleteCurrentObject(); };
        this.draggingToolboxItem = function (item, e) { self.doDraggingToolboxItem(item.json, e); };
        this.clickToolboxItem = function (item) { self.doClickToolboxItem(item.json); };
        this.dragEnd = function (item, e) { self.dragDropHelper.end(); };

        this.doUndoClick = function () { self.doUndoRedo(self.undoRedo.undo()); };
        this.doRedoClick = function () { self.doUndoRedo(self.undoRedo.redo()); };

        this.jsonEditor = new SurveyJSONEditor();

        if (renderedElement) {
            this.render(renderedElement);
        }

        this.text = "";

        this.toolbarItems.push({
            id: 'svd-undo',
            visible: this.koIsShowDesigner,
            enabled: this.undoRedo.koCanUndo,
            action: this.doUndoClick,
            title: this.getLocString('ed.undo')
        });
        this.toolbarItems.push({
            id: 'svd-redo',
            visible: this.koIsShowDesigner,
            enabled: this.undoRedo.koCanRedo,
            action: this.doRedoClick,
            title: this.getLocString('ed.redo')
        });
        this.toolbarItems.push({
            id: 'svd-options',
            visible: ko.computed(() => this.koIsShowDesigner() && this.koShowOptions()),
            title: this.getLocString('ed.options'),
            template: 'svd-toolbar-options',
            items: ko.observableArray([
                { id: 'svd-valid-json', visible: true, css: ko.computed(() => (this.koGenerateValidJSON() ? 'active' : '')), action: this.generateValidJSONClick, title: this.getLocString('ed.generateValidJSON') },
                { id: 'svd-readable-json', visible: true, css: ko.computed(() => (!this.koGenerateValidJSON() ? 'active' : '')), action: this.generateReadableJSONClick, title: this.getLocString('ed.generateReadableJSON') }
            ])
        });
        this.toolbarItems.push({
            id: 'svd-test',
            visible: ko.computed(() => this.koViewType() === 'test'),
            title: ko.computed(() => this.getLocString('ed.testSurveyWidth') + ' ' + this.koTestSurveyWidth()),
            template: 'svd-toolbar-options',
            items: ko.observableArray([
                { id: 'svd-100-json', visible: true, action: () => this.koTestSurveyWidth('100%'), title: '100%' },
                { id: 'svd-1200px-json', visible: true, action: () => this.koTestSurveyWidth('1200px'), title: '1200px' },
                { id: 'svd-1000px-json', visible: true, action: () => this.koTestSurveyWidth('1000px'), title: '1000px' },
                { id: 'svd-800px-json', visible: true, action: () => this.koTestSurveyWidth('800px'), title: '800px' },
                { id: 'svd-600px-json', visible: true, action: () => this.koTestSurveyWidth('600px'), title: '600px' },
                { id: 'svd-400px-json', visible: true, action: () => this.koTestSurveyWidth('400px'), title: '400px' },
            ])
        });
        this.toolbarItems.push({
            id: 'svd-save',
            visible: this.koShowSaveButton,
            action: this.saveButtonClick,
            innerCss: 'svd_save_btn',
            title: this.getLocString('ed.saveSurvey')
        });
        this.toolbarItems.push({
            id: 'svd-state',
            visible: this.koShowState,
            css: 'svd_state',
            innerCss: ko.computed(() => 'icon-' + this.koState()),
            title: ko.computed(() => this.koState() && (this.koState().charAt(0).toUpperCase() + this.koState().slice(1))),
            template: 'svd-toolbar-state'
        });
    }
    protected setOptions(options: any) {
        if(!options) options = {};
        if(!options.hasOwnProperty('generateValidJSON'))  options.generateValidJSON = true;
        this.options = options;
        this.showJSONEditorTabValue = typeof (options.showJSONEditorTab) !== 'undefined' ? options.showJSONEditorTab : true;
        this.showTestSurveyTabValue = typeof (options.showTestSurveyTab) !== 'undefined' ? options.showTestSurveyTab : true;
        this.showEmbededSurveyTabValue = typeof (options.showEmbededSurveyTab) !== 'undefined' ? options.showEmbededSurveyTab : false;
        this.koShowOptions(typeof (options.showOptions) !== 'undefined' ? options.showOptions : false);
        this.koGenerateValidJSON(this.options.generateValidJSON);
        this.isAutoSave = typeof (options.isAutoSave) !== 'undefined' ? options.isAutoSave : false;
        this.isRTLValue = typeof (options.isRTL) !== 'undefined' ? options.isRTL : false;
        if(options.designerHeight) {
            this.koDesignerHeight(options.designerHeight);
        }
        if(options.objectsIntend) {
            SurveyObjects.intend = options.objectsIntend;
        }
        this.koDesignerHeight()
    }
    /**
     * The editing survey object (Survey.Survey)
     */
    public get survey(): SurveyForDesigner {
        return this.surveyValue;
    }
    public get selectedObjectEditor() : SurveyObjectEditor { return this.selectedObjectEditorValue; }
    /**
     * Call this method to render the survey editor.
     * @param element HtmlElement or html element id where Survey Editor will be rendered
     * @param options Survey Editor options. The following options are available: showJSONEditorTab, showTestSurveyTab, showEmbededSurveyTab, showOptions, generateValidJSON, isAutoSave, designerHeight.
     */
    public render(element: any = null, options: any = null) {
        if (options) this.setOptions(options);
        var self = this;
        if (element && typeof element == "string") {
            element = document.getElementById(element);
        }
        if (element) {
            this.renderedElement = element;
        }
        element = this.renderedElement;
        if (!element) return;
        element.innerHTML = templateEditorHtml;
        self.applyBinding();
    }
    public loadSurvey(surveyId: string) {
        var self = this;
        new Survey.dxSurveyService().loadSurvey(surveyId, function (success: boolean, result: string, response: any) {
            if (success && result) {
                self.text = JSON.stringify(result);
            }
        });
    }
    /**
     * The Survey JSON as a text. Use it to get Survey JSON or change it.
     */
    public get text() {
        if (this.koIsShowDesigner()) return this.getSurveyTextFromDesigner();
        return this.jsonEditor.text;
    }
    public set text(value: string) {
        this.changeText(value, true);
    }
    /**
     * Set JSON as text  into survey. Clear undo/redo states optionally.
     * @param value JSON as text
     * @param clearState default false. Set this parameter to true to clear undo/redo states.
     */
    public changeText(value: string, clearState = false) {
        var textWorker = new SurveyTextWorker(value);
        if (textWorker.isJsonCorrect) {
            this.initSurvey(new Survey.JsonObject().toJsonObject(textWorker.survey));
            this.showDesigner();
            this.setUndoRedoCurrentState(clearState);
        } else {
            this.setTextValue(value);
            this.koViewType("editor");
        }
    }
    /**
     * Toolbox object. Contains information about Question toolbox items.
     * @see QuestionToolbox
     */
    public get toolbox(): QuestionToolbox { return this.toolboxValue; }
    /**
     * The list of toolbar items. You may add/remove/replace them.
     * @see IToolbarItem
     */
    public toolbarItems = ko.observableArray<IToolbarItem>();
    /**
     * Get and set the maximum of copied questions/panels in the toolbox. The default value is 3
     */
    public get customToolboxQuestionMaxCount(): number { return this.toolbox.copiedItemMaxCount; }
    public set customToolboxQuestionMaxCount(value: number) { this.toolbox.copiedItemMaxCount = value; }
    /**
     * Returns the Editor state. It may return empty string or "saving" and "saved".
     */
    public get state(): string { return this.stateValue; }
    protected setState(value: string) {
        this.stateValue = value;
        this.koState(this.state);
    }
    saveNo: number = 0;
    protected doSave() {
        this.setState("saving");
        if (this.saveSurveyFunc) {
            this.saveNo++;
            var self = this;
            this.saveSurveyFunc(this.saveNo,
                function doSaveCallback(no: number, isSuccess: boolean) {
                    self.setState("saved");
                    if (self.saveNo == no) {
                        if (isSuccess) self.setState("saved");
                        //else TODO
                    }
                });
        }
    }
    protected setModified() {
        this.setState("modified");
        this.setUndoRedoCurrentState();
        this.onModified.fire(this, null);
        this.isAutoSave && this.doSave();
    }
    private setUndoRedoCurrentState(clearState: boolean = false) {
        if (clearState) {
            this.undoRedo.clear();
        }
        var selObj = this.koSelectedObject() ? this.koSelectedObject().value : null;
        this.undoRedo.setCurrent(this.surveyValue, selObj ? selObj.name : null);
    }
    /**
     * Assign to this property a function that will be called on clicking the 'Save' button or on any change if isAutoSave equals true.
     * @see isAutoSave
     */
    public get saveSurveyFunc() { return this.saveSurveyFuncValue; }
    public set saveSurveyFunc(value: any) {
        this.saveSurveyFuncValue = value;
        this.koShowSaveButton(value != null && !this.isAutoSave);
    }
    /**
     * Set it to true to show "Options" menu and to false to hide the menu
     */
    public get showOptions() { return this.koShowOptions(); }
    public set showOptions(value: boolean) { this.koShowOptions(value); }
    /**
     * Set it to true to show "JSON Editor" tab and to false to hide the tab
     */
    public get showJSONEditorTab() { return this.showJSONEditorTabValue; }
    public set showJSONEditorTab(value: boolean) { this.showJSONEditorTabValue = value; }
    /**
     * Set it to true to show "Test Survey" tab and to false to hide the tab
     */
    public get showTestSurveyTab() { return this.showTestSurveyTabValue; }
    public set showTestSurveyTab(value: boolean) { this.showTestSurveyTabValue = value; }
    /**
     * Set it to true to show "Embed Survey" tab and to false to hide the tab
     */
    public get showEmbededSurveyTab() { return this.showEmbededSurveyTabValue; }
    public set showEmbededSurveyTab(value: boolean) { this.showEmbededSurveyTabValue = value; }
    /**
     * Set it to true to active RTL support
     */
    public get isRTL() { return this.isRTLValue; }
    public set isRTL(value: boolean) { this.isRTLValue = value; }

    protected onCanShowObjectProperty(object: any, property: Survey.JsonObjectProperty): boolean {
        var options = { obj: object, property: property, canShow: true };
        this.onCanShowProperty.fire(this, options);
        return options.canShow;
    }

    private setTextValue(value: string) {
        this.jsonEditor.text = value;
    }
    /**
     * Add a new page into the editing survey.
     */
    public addPage() {
        var name = SurveyHelper.getNewPageName(this.survey.pages);
        var page = <Survey.Page>this.surveyValue.addNewPage(name);
        this.addPageToUI(page);
        this.setModified();
    }
    /**
     * Returns the localized string by it's id
     * @param str the string id.
     */
    public getLocString(str: string) { return editorLocalization.getString(str); }
    private movePage(indexFrom: number, indexTo: number) {
        var page = <Survey.Page>this.survey.pages[indexFrom];
        this.survey.pages.splice(indexFrom, 1);
        this.survey.pages.splice(indexTo, 0, page);
        this.pagesEditor.survey = this.survey;
        this.surveyObjects.selectObject(page)
        this.setModified();
    }
    private addPageToUI(page: Survey.Page) {
        this.pagesEditor.survey = this.surveyValue;
        this.surveyObjects.addPage(page);
    }
    private doOnQuestionAdded(question: Survey.QuestionBase, parentPanel: any) {
        var page = <Survey.Page>this.survey.getPageByElement(question);
        var options = { question: question, page: page };
        this.onQuestionAdded.fire(this, options);
        this.surveyObjects.addElement(question, parentPanel);
        this.survey.render();
    }
    private doOnElementRemoved(question: Survey.QuestionBase) {
        this.surveyObjects.removeObject(question);
        this.survey.render();
    }
    private doOnPanelAdded(panel: Survey.Panel, parentPanel: any) {
        var page = <Survey.Page>this.survey.getPageByElement(panel);
        var options = { panel: panel, page: page };
        this.onPanelAdded.fire(this, options);
        this.surveyObjects.addElement(panel, parentPanel);
        this.survey.render();
    }
    private onPropertyValueChanged(property: Survey.JsonObjectProperty, obj: any, newValue: any) {
        var isDefault = property.isDefaultValue(newValue);
        obj[property.name] = newValue;
        if (property.name == "name") {
            this.surveyObjects.nameChanged(obj);
            if (SurveyHelper.getObjectType(obj) == ObjType.Page) {
                this.pagesEditor.changeName(<Survey.Page>obj);
            }
        }
        this.setModified();
        //TODO add a flag to a property, may change other properties
        if(property.name == "locale" || property.name == "hasComment" || property.name == "hasOther") {
            this.selectedObjectEditorValue.objectChanged();
        }
        this.survey.render();
    }
    private doUndoRedo(item: UndoRedoItem) {
        this.initSurvey(item.surveyJSON);
        if (item.selectedObjName) {
            var selObj = this.findObjByName(item.selectedObjName);
            if (selObj) {
                this.surveyObjects.selectObject(selObj);
            }
        }
        this.setState("modified");
        this.isAutoSave && this.doSave();
    }
    private findObjByName(name: string): Survey.Base {
        var page = this.survey.getPageByName(name);
        if (page) return page;
        var question = <Survey.QuestionBase>this.survey.getQuestionByName(name);
        if (question) return question;
        return null;
    }
    private canSwitchViewType(newType: string): boolean {
        if (newType && this.koViewType() == newType) return false;
        if (this.koViewType() == "designer") {
            this.jsonEditor.text = this.getSurveyTextFromDesigner();
        }
        if (this.koViewType() != "editor") return true;
        if (!this.jsonEditor.isJsonCorrect) {
            alert(this.getLocString("ed.correctJSON"));
            return false;
        }
        this.initSurvey(new Survey.JsonObject().toJsonObject(this.jsonEditor.survey));
        this.setModified();
        return true;
    }
    /**
     * Make a "Survey Designer" tab active.
     */
    public showDesigner() {
        if (!this.canSwitchViewType("designer")) return;
        this.koViewType("designer");
    }
    /**
     * Make a "JSON Editor" tab active.
     */
    public showJsonEditor() {
        if (this.koViewType() == "editor") return;
        this.jsonEditor.show(this.getSurveyTextFromDesigner());
        this.koViewType("editor");
    }
    /**
     * Make a "Test Survey" tab active.
     */
    public showTestSurvey() {
        if (!this.canSwitchViewType(null)) return;
        this.showLiveSurvey();
        this.koViewType("test");
    }
    /**
     * Make a Embed Survey" tab active.
     */
    public showEmbedEditor() {
        if (!this.canSwitchViewType("embed")) return;
        this.showSurveyEmbeding();
        this.koViewType("embed");
    }
    private getSurveyTextFromDesigner() {
        var json = new Survey.JsonObject().toJsonObject(this.survey);
        if (this.options && this.options.generateValidJSON) return JSON.stringify(json, null, 1);
        return new SurveyJSON5().stringify(json, null, 1);
    }
    private selectedObjectChanged(obj: Survey.Base) {
        var canDeleteObject = false;
        this.selectedObjectEditorValue.selectedObject = obj;
        this.surveyVerbs.obj = obj;
        var objType = SurveyHelper.getObjectType(obj);
        if (objType == ObjType.Page) {
            this.survey.currentPage = <Survey.Page>obj;
            canDeleteObject = this.survey.pages.length > 1;
        }
        if (objType == ObjType.Question || objType == ObjType.Panel) {
            this.survey.selectedElement = obj;
            canDeleteObject = true;
            this.survey.currentPage = this.survey.getPageByQuestion(this.survey.selectedElement);
        } else {
            this.survey.selectedElement = null;
        }
        this.koCanDeleteObject(canDeleteObject);
        //Select2 work-around
        if(this.select2) {
            var el = <HTMLElement>this.renderedElement.querySelector("#select2-objectSelector-container"); //TODO
            if(el) {
                var item = this.surveyObjects.koSelected();
                if(item && item.text) {
                    el.innerText = item.text();
                }
            }
        }
    }
    private applyBinding() {
        if (this.renderedElement == null) return;
        ko.cleanNode(this.renderedElement);
        ko.applyBindings(this, this.renderedElement);
        this.surveyjs = <HTMLElement>this.renderedElement.querySelector("#surveyjs");
        if (this.surveyjs) {
            var self = this;
            this.surveyjs.onkeydown = function (e) {
                if (!e) return;
                if (e.keyCode == 46) self.deleteQuestion();
                if (e.keyCode == 38 || e.keyCode == 40) {
                    self.selectQuestion(e.keyCode == 38);
                }
            };
        }
        this.surveyjsExample = <HTMLElement>this.renderedElement.querySelector("#surveyjsExample");

        this.initSurvey(this.getDefaultSurveyJson());
        this.setUndoRedoCurrentState(true);

        this.jsonEditor.init();
        if(jQuery && jQuery()["select2"]) {
            this.select2 = jQuery("#objectSelector")["select2"](this.isRTLValue ? {dir: "rtl"} : '');
            jQuery("#objectSelector").width("100%");
        }
    }
    private getDefaultSurveyJson(): any {
        var json = new SurveyJSON5().parse(SurveyEditor.defaultNewSurveyText);
        if(json["pages"] && json["pages"]["length"] > 0 && json["pages"][0]["name"]) {
            json["pages"][0]["name"] = editorLocalization.getString("ed.newPageName") + "1";
        }
        return json;
    }
    private initSurvey(json: any) {
        var self = this;
        this.surveyValue = new SurveyForDesigner();
        this.dragDropHelper = new DragDropHelper(<Survey.ISurvey>this.survey, function () { self.setModified() }, this.renderedElement);
        this.surveyValue["setJsonObject"](json); //TODO
        if (this.surveyValue.isEmpty) {
            this.surveyValue["setJsonObject"](this.getDefaultSurveyJson()); //TODO
        }
        this.surveyValue["dragDropHelper"] = this.dragDropHelper;
        this.survey.render(this.surveyjs);
        this.surveyObjects.survey = this.survey;
        this.pagesEditor.survey = this.survey;
        this.pagesEditor.setSelectedPage(<Survey.Page>this.survey.currentPage);
        this.surveyVerbs.survey = this.survey;
        this.surveyValue.onSelectedElementChanged.add((sender: Survey.Survey, options) => { self.surveyObjects.selectObject(sender["selectedElement"]); });
        this.surveyValue.onEditQuestion.add((sender: Survey.Survey, options) => { self.showQuestionEditor(self.koSelectedObject().value); });
        this.surveyValue.onCopyQuestion.add((sender: Survey.Survey, options) => { self.addCustomToolboxQuestion(self.koSelectedObject().value); });
        this.surveyValue.onFastCopyQuestion.add((sender: Survey.Survey, options) => { self.fastCopyQuestion(self.koSelectedObject().value); });
        this.surveyValue.onDeleteCurrentObject.add((sender: Survey.Survey, options) => { self.deleteCurrentObject(); });
        this.surveyValue.onProcessHtml.add((sender: Survey.Survey, options) => { options.html = self.processHtml(options.html); });
        this.surveyValue.onCurrentPageChanged.add((sender: Survey.Survey, options) => { self.pagesEditor.setSelectedPage(<Survey.Page>sender.currentPage); });
        this.surveyValue.onQuestionAdded.add((sender: Survey.Survey, options) => { self.doOnQuestionAdded(options.question, options.parentPanel); });
        this.surveyValue.onQuestionRemoved.add((sender: Survey.Survey, options) => { self.doOnElementRemoved(options.question); });
        this.surveyValue.onPanelAdded.add((sender: Survey.Survey, options) => { self.doOnPanelAdded(options.panel, options.parentPanel); });
        this.surveyValue.onPanelRemoved.add((sender: Survey.Survey, options) => { self.doOnElementRemoved(options.panel); });
        this.onDesignerSurveyCreated.fire(this, {survey: this.surveyValue});
    }
    private processHtml(html: string): string {
        if (!html) return html;
        var scriptRegEx = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
        while (scriptRegEx.test(html)) {
            html = html.replace(scriptRegEx, "");
        }
        return html;
    }
    private doDraggingToolboxItem(json: any, e) {
        this.dragDropHelper.startDragToolboxItem(e, this.getNewName(json["type"]), json);
    }
    private newQuestions: Array<any> = [];
    private newPanels: Array<any> = [];
    private doClickToolboxItem(json: any) {
        var newElement = Survey.JsonObject.metaData.createClass(json["type"]);
        new Survey.JsonObject().toObject(json, newElement);
        this.newQuestions = [];
        this.newPanels = [];
        this.setNewNames(newElement);
        this.doClickQuestionCore(newElement);
    }
    private setNewNames(element: Survey.IElement) {
        element.name = this.getNewName(element["getType"]());
        if(element.isPanel) {
            this.newPanels.push(element);
            var panel = <Survey.Panel>element;
            for(var i = 0; i < panel.elements.length; i ++) {
                this.setNewNames(panel.elements[i]);
            }
        } else {
            this.newQuestions.push(element);
        }
    }
    private getNewName(type: string) : string {
        return type == "panel" ? this.getNewPanelName() : this.getNewQuestionName();
    }
    private getNewQuestionName(): string {
        return SurveyHelper.getNewQuestionName(this.getAllQuestions());
    }
    private getNewPanelName(): string {
        return SurveyHelper.getNewPanelName(this.getAllPanels());
    }
    private getAllQuestions(): Array<any> {
        var result =  [];
        for(var i = 0; i < this.survey.pages.length; i ++) {
            this.addElements(this.survey.pages[i].elements, false, result);
        }
        this.addElements(this.newPanels, false, result);
        this.addElements(this.newQuestions, false, result);
        return result;
    }
    private getAllPanels(): Array<any> {
        var result = [];
        for(var i = 0; i < this.survey.pages.length; i ++) {
            this.addElements(this.survey.pages[i].elements, true, result);
        }
        this.addElements(this.newPanels, true, result);
        this.addElements(this.newQuestions, true, result);
        return result;
    }
    private addElements(elements: Array<any>, isPanel : boolean, result: Array<any>) {
        for(var i = 0; i < elements.length; i ++) {
            if(elements[i].isPanel === isPanel) {
                result.push(elements[i]);
            }
            this.addElements(SurveyHelper.getElements(elements[i]), isPanel, result);
        }
    }
    private doClickQuestionCore(question: Survey.QuestionBase) {
        var page = this.survey.currentPage;
        var index = -1;
        if (this.survey.selectedElement != null) {
            index = page.questions.indexOf(this.survey.selectedElement) + 1;
        }
        page.addQuestion(question, index);
        if(this.renderedElement) {
            this.dragDropHelper.scrollToElement(<HTMLElement>this.renderedElement.querySelector("#"+question.id));
        }
        this.setModified();
    }
    private deleteQuestion() {
        var question = this.getSelectedObjAsQuestion();
        if (question) {
            this.deleteCurrentObject();
        }
    }
    private selectQuestion(isUp: boolean) {
        var question = this.getSelectedObjAsQuestion();
        if (question) {
            this.surveyObjects.selectNextQuestion(isUp)
        }
    }
    private getSelectedObjAsQuestion(): Survey.QuestionBase {
        var obj = this.koSelectedObject().value;
        if (!obj) return null;
        return SurveyHelper.getObjectType(obj) == ObjType.Question ? <Survey.QuestionBase>(obj): null;
    }
    private deleteCurrentObject() {
        this.deleteObject(this.koSelectedObject().value);
    }
    /**
     * Show the Question Editor dialog.
     * @param question The Survey.Question object
     */
    public showQuestionEditor(question: Survey.QuestionBase) {
        var self = this;
        this.questionEditorWindow.show(question, function (question) { self.onQuestionEditorChanged(question); }, this);
    }
    private onQuestionEditorChanged(question: Survey.QuestionBase) {
        this.surveyObjects.nameChanged(question);
        this.selectedObjectEditorValue.objectChanged();
        this.setModified();
        this.survey.render();
    }
    /**
     * Add a question into Toolbox object
     * @param question an added Survey.Question
     * @see toolbox
     */
    public addCustomToolboxQuestion(question: Survey.QuestionBase) {
        this.toolbox.addCopiedItem(question);
    }
    /**
     * Copy a question to the active page
     * @param question A copied Survey.Question
     */
    public fastCopyQuestion(question: Survey.Base) {
        var json = new Survey.JsonObject().toJsonObject(question);
        json.type = question.getType();
        this.doClickToolboxItem( json );
    }

    private deleteObject(obj: any) {
        this.surveyObjects.removeObject(obj);
        var objType = SurveyHelper.getObjectType(obj);
        if (objType == ObjType.Page) {
            this.survey.removePage(obj);
            this.pagesEditor.removePage(obj);
        } else {
            this.survey.currentPage.removeElement(obj);
            this.survey.selectedElement = null;
            this.surveyObjects.selectObject(this.survey.currentPage);
        }
        this.setModified();
        this.survey.render();
    }
    private showLiveSurvey() {
        if (!this.surveyjsExample) return;
        var json = this.getSurveyJSON();
        if (json != null) {
            if (json.cookieName) {
                delete json.cookieName;
            }
            var survey = new Survey.Survey(json);
            var self = this;
            var surveyjsExampleResults = <HTMLElement>this.renderedElement.querySelector("#surveyjsExampleResults");
            var surveyjsExamplereRun = <HTMLElement>this.renderedElement.querySelector("#surveyjsExamplereRun");
            if (surveyjsExampleResults) surveyjsExampleResults.innerHTML = "";
            if (surveyjsExamplereRun) surveyjsExamplereRun.style.display = "none";
            survey.onComplete.add((sender: Survey.Survey) => { if (surveyjsExampleResults) surveyjsExampleResults.innerHTML = this.getLocString("ed.surveyResults") + JSON.stringify(survey.data); if (surveyjsExamplereRun) surveyjsExamplereRun.style.display = ""; });
            survey.render(this.surveyjsExample);
        } else {
            this.surveyjsExample.innerHTML = this.getLocString("ed.correctJSON");
        }
    }
    private showSurveyEmbeding() {
        var json = this.getSurveyJSON();
        this.surveyEmbeding.json = json;
        this.surveyEmbeding.surveyId = this.surveyId;
        this.surveyEmbeding.surveyPostId = this.surveyPostId;
        this.surveyEmbeding.generateValidJSON = this.options && this.options.generateValidJSON;
        this.surveyEmbeding.show();
    }
    private getSurveyJSON(): any {
        if (this.koIsShowDesigner()) return new Survey.JsonObject().toJsonObject(this.survey);
        if (this.jsonEditor.isJsonCorrect) return new Survey.JsonObject().toJsonObject(this.jsonEditor.survey);
        return null;
    }
    private createAnnotations(text: string, errors: any[]): AceAjax.Annotation[] {
        var annotations = new Array<AceAjax.Annotation>();
        for (var i = 0; i < errors.length; i++) {
            var error = errors[i];
            var annotation: AceAjax.Annotation = { row: error.position.start.row, column: error.position.start.column, text: error.text, type: "error" };
            annotations.push(annotation);
        }
        return annotations;
    }
    //implements ISurveyObjectEditorOptions
    get alwaySaveTextInPropertyEditors(): boolean { return this.alwaySaveTextInPropertyEditorsValue; }
    set alwaySaveTextInPropertyEditors(value: boolean) { this.alwaySaveTextInPropertyEditorsValue = value; }
    get showApplyButtonInEditors(): boolean { return this.showApplyButtonValue; }
    set showApplyButtonInEditors(value: boolean) { this.showApplyButtonValue = value; }
    onItemValueAddedCallback(propertyName: string, itemValue: Survey.ItemValue) {
        var options = {propertyName: propertyName, newItem: itemValue};
        this.onItemValueAdded.fire(this, options);
    }
    onMatrixDropdownColumnAddedCallback(column: Survey.MatrixDropdownColumn) {
        var options = {newColumn: column};
        this.onMatrixColumnAdded.fire(this, options);
    }
    onSetPropertyEditorOptionsCallback(propertyName: string, obj: Survey.Base, editorOptions: any) {
        var options = {propertyName: propertyName, obj: obj, editorOptions: editorOptions};
        this.onSetPropertyEditorOptions.fire(this, options);
    }
    onGetErrorTextOnValidationCallback(propertyName: string, obj: Survey.Base, value: any): string {
        var options = {propertyName: propertyName, obj: obj, value: value, error: ""};
        this.onCustomErrorOnValidation.fire(this, options);
        return options.error;
    }
    
}

Survey.Survey.cssType = "bootstrap";