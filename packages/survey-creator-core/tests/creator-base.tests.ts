import {
  Base,
  PanelModel,
  SurveyModel,
  QuestionHtmlModel,
  ElementFactory,
  QuestionTextModel,
  Serializer,
  QuestionRadiogroupModel,
  QuestionMatrixDropdownModel,
  QuestionMatrixDynamicModel,
  IActionBarItem
} from "survey-core";
import { CreatorBase, ICreatorOptions } from "../src/creator-base";
import { PageViewModel } from "../src/components/page";
import { PageNavigatorViewModel } from "../src/components/page-navigator/page-navigator";
import { TabDesignerPlugin } from "../src/components/tabs/designer";
import { SurveyHelper } from "../src/surveyHelper";

export class CreatorTester extends CreatorBase<SurveyModel> {
  constructor(options: ICreatorOptions = {}, options2?: ICreatorOptions) {
    super(options, options2);
  }
  protected createSurveyCore(json: any = {}): SurveyModel {
    return new SurveyModel(json);
  }
  public get selectedElementName(): string {
    if (!this.selectedElement) return "";
    var name = this.selectedElement["name"];
    if (!!name) return name;
    return this.selectedElement.getType();
  }
  public getActionBarItem(id: string): IActionBarItem {
    return this.getActionBarItemByActions(this.toolbarItems, id);
  }
  public getActionBarItemByActions(
    actions: Array<IActionBarItem>,
    id: string
  ): IActionBarItem {
    for (var i = 0; i < actions.length; i++) {
      if (actions[i].id == id) return actions[i];
    }
    return null;
  }
  public doSaveFunc() {
    this.doSave();
  }
}

test("options.questionTypes", (): any => {
  var creator = new CreatorTester();
  creator.JSON = {
    elements: [{ type: "text", name: "q1" }]
  };
  expect(creator.selectedElementName).toEqual("survey");
  expect(creator.isElementSelected(creator.survey)).toBeTruthy();
  var question = creator.survey.getAllQuestions()[0];
  creator.selectElement(question);
  expect(creator.selectedElementName).toEqual("q1");
  expect(creator.isElementSelected(question)).toBeTruthy();
  expect(creator.isElementSelected(creator.survey)).toBeFalsy();
});
test("do not deactivate/activate tabs on selecting the active tab", (): any => {
  var creator = new CreatorTester();
  creator.JSON = {
    elements: [{ type: "text", name: "q1" }]
  };
  expect(creator.activeTab).toEqual("designer");
  expect(creator.makeNewViewActive("test")).toBeTruthy();
  creator.activeTab = "test";
  expect(creator.makeNewViewActive("test")).toBeFalsy();
  creator.activeTab = "test";
});
test("Select new added question", (): any => {
  var creator = new CreatorTester();
  creator.JSON = {
    elements: [{ type: "text", name: "question1" }]
  };
  expect(creator.activeTab).toEqual("designer");
  creator.survey.currentPage = creator.survey.currentPage;
  creator.clickToolboxItem({ type: "text" });
  expect(creator.selectedElementName).toEqual("question2");
});
test("Update JSON before drag&drop", (): any => {
  var creator = new CreatorTester();
  creator.JSON = {
    elements: [{ type: "text", name: "question1" }]
  };
  expect(creator.activeTab).toEqual("designer");
  creator.survey.currentPage = creator.survey.currentPage;
  var json: any = {
    type: "panel",
    elements: [{ type: "text", name: "question1" }]
  };
  json = creator.getJSONForNewElement(json);
  expect(json.name).toEqual("panel1");
  expect(json.type).toEqual("panel");
  expect(json.elements[0].name).toEqual("question2");
});
test("PageViewModel", (): any => {
  var creator = new CreatorTester();
  creator.JSON = {
    elements: [{ type: "text", name: "question1" }]
  };
  expect(creator.currentPage.onPropertyChanged.isEmpty).toBeTruthy();
  var pageModel = new PageViewModel(creator, creator.survey.currentPage);
  var counter = 0;
  pageModel.onPageSelectedCallback = (): any => {
    counter++;
  };
  expect(creator.currentPage.onPropertyChanged.isEmpty).toBeFalsy();
  expect(pageModel.isSelected).toBeFalsy();
  creator.selectElement(creator.survey.getQuestionByName("question1"));
  expect(pageModel.isSelected).toBeFalsy();
  expect(counter).toEqual(0);
  creator.selectElement(creator.survey.currentPage);
  expect(pageModel.isSelected).toBeTruthy();
  expect(counter).toEqual(1);
  creator.selectElement(creator.survey);
  expect(pageModel.isSelected).toBeFalsy();
  expect(counter).toEqual(1);
  pageModel.dispose();
  expect(creator.currentPage.onPropertyChanged.isEmpty).toBeTruthy();
});

test("PagesController", (): any => {
  var creator = new CreatorTester();
  creator.JSON = {
    elements: [{ type: "text", name: "question1" }]
  };
  var counter = 0;
  creator.pagesController.onPagesChanged.add((sender, options) => {
    counter++;
  });
  creator.addPage();
  expect(counter).toEqual(1);
  creator.survey.removePage(creator.survey.pages[1]);
  expect(counter).toEqual(2);
  creator.JSON = {
    elements: [{ type: "text", name: "question2" }]
  };
  expect(counter).toEqual(3);
});
test("PageNavigatorViewModel", (): any => {
  var creator = new CreatorTester();
  var model = new PageNavigatorViewModel(creator.pagesController);
  expect(model.items).toHaveLength(1);
  creator.JSON = {
    pages: [
      {
        elements: [{ type: "text", name: "question1" }]
      },
      {
        elements: [{ type: "text", name: "question2" }]
      }
    ]
  };
  expect(model.items).toHaveLength(2);
  expect(model.items[0].active).toBeTruthy();
  expect(model.items[1].active).toBeFalsy();
  creator.addPage();
  expect(model.items).toHaveLength(3);
  expect(model.items[0].active).toBeFalsy();
  expect(model.items[1].active).toBeFalsy();
  expect(model.items[2].active).toBeTruthy();
  expect(model.items[0].title).toEqual("page1");
  creator.survey.pages[0].name = "page1-newName";
  expect(model.items[0].title).toEqual("page1-newName");
});

test("SelectionHistoryController: Go to next/prev", (): any => {
  var creator = new CreatorTester();
  creator.JSON = {
    elements: [
      {
        type: "text",
        name: "question1"
      },
      {
        type: "text",
        name: "question2"
      }
    ]
  };
  var controller = creator.selectionHistoryController;
  expect(controller.hasPrev).toBeFalsy();
  expect(controller.hasNext).toBeFalsy();
  creator.selectElement(creator.survey.pages[0]);
  expect(controller.hasPrev).toBeTruthy();
  expect(controller.hasNext).toBeFalsy();
  creator.selectElement(creator.survey.getQuestionByName("question1"));
  expect(controller.hasPrev).toBeTruthy();
  expect(controller.hasNext).toBeFalsy();
  creator.selectElement(creator.survey.pages[0]);
  expect(controller.hasPrev).toBeTruthy();
  expect(controller.hasNext).toBeFalsy();
  controller.prev();
  expect(creator.selectedElementName).toEqual("question1");
  expect(controller.hasPrev).toBeTruthy();
  expect(controller.hasNext).toBeTruthy();
  controller.next();
  expect(creator.selectedElementName).toEqual("page1");
  expect(controller.hasPrev).toBeTruthy();
  expect(controller.hasNext).toBeFalsy();
  controller.prev();
  controller.prev();
  expect(creator.selectedElementName).toEqual("survey");
  expect(controller.hasPrev).toBeFalsy();
  expect(controller.hasNext).toBeTruthy();
});
test("SelectionHistoryController: Reset history on changing survey", (): any => {
  var json = {
    elements: [
      {
        type: "text",
        name: "question1"
      },
      {
        type: "text",
        name: "question2"
      }
    ]
  };
  var creator = new CreatorTester();
  creator.JSON = json;

  var controller = creator.selectionHistoryController;
  expect(controller.hasPrev).toBeFalsy();
  expect(controller.hasNext).toBeFalsy();
  creator.selectElement(creator.survey.pages[0]);
  expect(controller.hasPrev).toBeTruthy();
  creator.JSON = json;
  expect(controller.hasPrev).toBeFalsy();
  expect(controller.hasNext).toBeFalsy();
});
test("SelectionHistoryController: Update history on deleting elements", (): any => {
  var creator = new CreatorTester();
  creator.JSON = {
    pages: [
      {
        name: "page1",
        elements: [
          {
            type: "text",
            name: "question1"
          },
          {
            type: "matrixdynamic",
            name: "question2",
            columns: [{ name: "col1" }, { name: "col2" }]
          },
          {
            type: "panel",
            name: "panel1",
            elements: [{ type: "text", name: "question3" }]
          }
        ]
      },
      {
        name: "page2"
      }
    ]
  };
  var controller = creator.selectionHistoryController;
  var page = creator.survey.pages[1];
  creator.selectElement(page);
  var question = creator.survey.getQuestionByName("question1");
  creator.selectElement(question);
  var panel = <PanelModel>creator.survey.getPanelByName("panel1");
  creator.selectElement(panel);
  var column = creator.survey.getQuestionByName("question2").columns[0];
  creator.selectElement(column);
  creator.selectElement(creator.survey);
  expect(controller.hasInHistory(page)).toBeTruthy();
  page.delete();
  expect(controller.hasInHistory(page)).toBeFalsy();
  expect(controller.hasInHistory(question)).toBeTruthy();
  question.delete();
  expect(controller.hasInHistory(question)).toBeFalsy();
  expect(controller.hasInHistory(panel)).toBeTruthy();
  panel.delete();
  expect(controller.hasInHistory(panel)).toBeFalsy();
  expect(controller.hasInHistory(column)).toBeTruthy();
  creator.survey.getQuestionByName("question2").columns.splice(0, 1);
  expect(controller.hasInHistory(column)).toBeFalsy();
});
test("Update expressions on deleting a question", (): any => {
  var creator = new CreatorTester();
  creator.JSON = {
    elements: [
      {
        type: "text",
        name: "question1",
        visibleIf: "{question2} = 1"
      },
      {
        type: "text",
        name: "question2"
      }
    ]
  };
  expect(creator.survey.getQuestionByName("question1").visibleIf).toEqual(
    "{question2} = 1"
  );
  creator.deleteElement(creator.survey.getQuestionByName("question2"));
  expect(creator.survey.getQuestionByName("question1").visibleIf).toBeFalsy();
});
test("Update expressions on deleting a panel with questions", (): any => {
  var creator = new CreatorTester();
  creator.JSON = {
    elements: [
      {
        type: "text",
        name: "question1",
        visibleIf: "{question2} = 1"
      },
      {
        type: "panel",
        name: "panel1",
        elements: [{ type: "text", name: "question2" }]
      }
    ]
  };
  expect(creator.survey.getQuestionByName("question1").visibleIf).toEqual(
    "{question2} = 1"
  );
  creator.deleteElement(<Base>(<any>creator.survey.getPanelByName("panel1")));
  expect(creator.survey.getQuestionByName("question1").visibleIf).toBeFalsy();
});
test("Update expressions on deleting a page with questions", (): any => {
  var creator = new CreatorTester();
  creator.JSON = {
    pages: [
      {
        name: "page1",
        elements: [
          {
            type: "text",
            name: "question1",
            visibleIf: "{question2} = 1"
          }
        ]
      },
      {
        name: "page2",
        elements: [
          {
            type: "panel",
            name: "panel1",
            elements: [{ type: "text", name: "question2" }]
          }
        ]
      }
    ]
  };
  expect(creator.survey.getQuestionByName("question1").visibleIf).toEqual(
    "{question2} = 1"
  );
  creator.deleteElement(<Base>(<any>creator.survey.getPageByName("page2")));
  expect(creator.survey.getQuestionByName("question1").visibleIf).toBeFalsy();
});
test("Create new page on creating designer plugin", (): any => {
  var creator = new CreatorTester();
  expect(creator.viewType).toEqual("designer");
  var designerPlugin = <TabDesignerPlugin<SurveyModel>>(
    creator.getPlugin("designer")
  );
  expect(designerPlugin.model.newPage).toBeTruthy();
});
test("canUndo/canRedo functions ", (): any => {
  var creator = new CreatorTester();
  expect(creator.undoRedoManager.canUndo()).toBeFalsy();
  expect(creator.undoRedoManager.canRedo()).toBeFalsy();
  creator.survey.title = "My title";
  expect(creator.undoRedoManager.canUndo()).toBeTruthy();
  expect(creator.undoRedoManager.canRedo()).toBeFalsy();
  creator.undo();
  expect(creator.undoRedoManager.canUndo()).toBeFalsy();
  expect(creator.undoRedoManager.canRedo()).toBeTruthy();
  creator.redo();
  expect(creator.undoRedoManager.canUndo()).toBeTruthy();
  expect(creator.undoRedoManager.canRedo()).toBeFalsy();
});

test("Check survey settings button ", (): any => {
  var creator = new CreatorTester();
  var item = creator.getActionBarItem("icon-settings");
  expect(item.active).toBeTruthy();
  creator.selectElement(creator.survey.pages[0]);
  expect(item.active).toBeFalsy();
  creator.selectElement(creator.survey);
  expect(item.active).toBeTruthy();
});
test("Check survey undo/redo buttons ", (): any => {
  var creator = new CreatorTester();
  var undoItem = creator.getActionBarItem("icon-undo");
  var redoItem = creator.getActionBarItem("icon-redo");
  expect(undoItem.active).toBeFalsy();
  expect(redoItem.active).toBeFalsy();
  creator.survey.title = "My title";
  expect(undoItem.active).toBeTruthy();
  expect(redoItem.active).toBeFalsy();
  creator.undo();
  expect(undoItem.active).toBeFalsy();
  expect(redoItem.active).toBeTruthy();
  creator.redo();
  expect(undoItem.active).toBeTruthy();
  expect(redoItem.active).toBeFalsy();
});
test("undo/redo add new page", (): any => {
  var creator = new CreatorTester();
  var designerPlugin = <TabDesignerPlugin<SurveyModel>>(
    creator.getPlugin("designer")
  );
  expect(creator.survey.pageCount).toEqual(1);
  expect(creator.survey.pages[0].name).toEqual("page1");
  expect(designerPlugin.model.newPage.name).toEqual("page2");
  designerPlugin.model.newPage["_addToSurvey"]();
  expect(creator.survey.pageCount).toEqual(2);
  expect(creator.survey.pages[1].name).toEqual("page2");
  expect(designerPlugin.model.newPage.name).toEqual("page3");

  designerPlugin.model.newPage["_addToSurvey"]();
  expect(creator.survey.pageCount).toEqual(3);
  expect(creator.survey.pages[2].name).toEqual("page3");
  expect(designerPlugin.model.newPage.name).toEqual("page4");
  creator.undo();
  creator.undo();
  expect(creator.survey.pageCount).toEqual(1);
  expect(creator.survey.pages[0].name).toEqual("page1");
  expect(designerPlugin.model.newPage.name).toEqual("page4");
});
test("undo/redo add new page, via page model by adding new question", (): any => {
  var creator = new CreatorTester();
  var designerPlugin = <TabDesignerPlugin<SurveyModel>>(
    creator.getPlugin("designer")
  );
  expect(creator.survey.pageCount).toEqual(1);
  expect(creator.survey.pages[0].name).toEqual("page1");
  expect(designerPlugin.model.newPage.name).toEqual("page2");
  var pageModel = new PageViewModel(creator, designerPlugin.model.newPage);
  pageModel.addNewQuestion(pageModel, null);
  expect(creator.survey.pageCount).toEqual(2);
  expect(creator.survey.pages[1].name).toEqual("page2");
  expect(creator.survey.pages[1].elements).toHaveLength(1);
  expect(creator.survey.pages[1].elements[0].name).toEqual("question1");
  expect(designerPlugin.model.newPage.name).toEqual("page3");

  pageModel = new PageViewModel(creator, designerPlugin.model.newPage);
  pageModel.addNewQuestion(pageModel, null);
  expect(creator.survey.pageCount).toEqual(3);
  expect(creator.survey.pages[2].name).toEqual("page3");
  expect(creator.survey.pages[2].elements).toHaveLength(1);
  expect(creator.survey.pages[2].elements[0].name).toEqual("question2");
  expect(designerPlugin.model.newPage.name).toEqual("page4");
  creator.undo();
  creator.undo();
  expect(creator.survey.pageCount).toEqual(1);
  expect(creator.survey.pages[0].name).toEqual("page1");
  expect(designerPlugin.model.newPage.name).toEqual("page4");
});
test("undo/redo make sure that the deleting element is not active", (): any => {
  var creator = new CreatorTester();
  creator.JSON = {
    elements: [
      { type: "text", name: "question1" },
      { type: "text", name: "question2" }
    ]
  };
  creator.clickToolboxItem({ type: "text", name: "question3" });
  expect(creator.selectedElementName).toEqual("question3");
  creator.undo();
  expect(creator.selectedElementName).toEqual("survey");
  creator.survey.addNewPage("page2");
  creator.selectElement(creator.survey.pages[1]);
  expect(creator.selectedElementName).toEqual("page2");
  creator.undo();
  expect(creator.selectedElementName).toEqual("survey");
});

test("fast copy tests, copy a question and check the index", (): any => {
  var creator = new CreatorTester();
  creator.JSON = {
    elements: [
      { type: "text", name: "question1" },
      { type: "text", name: "question2" },
      { type: "text", name: "question3" }
    ]
  };
  creator.fastCopyQuestion(creator.survey.getQuestionByName("question1"));
  expect(creator.survey.pages[0].questions).toHaveLength(4);
  expect(creator.survey.getQuestionByName("question4")).toBeTruthy();
  expect(creator.survey.getQuestionByName("question4").visibleIndex).toEqual(1);
});
test("Page duplicate action, copy a page and check the index", (): any => {
  var creator = new CreatorTester();
  creator.JSON = {
    pages: [
      {
        elements: [
          { type: "text", name: "question1" },
          { type: "text", name: "question2" },
          { type: "text", name: "question3" }
        ]
      },
      {
        elements: [{ type: "text", name: "question4" }]
      }
    ]
  };
  expect(creator.survey.pages).toHaveLength(2);
  var pageModel = new PageViewModel(creator, creator.survey.pages[0]);
  var action = creator.getActionBarItemByActions(
    pageModel.actions,
    "duplicate"
  );
  expect(action).toBeTruthy();
  action.action();
  expect(creator.survey.pages).toHaveLength(3);
  expect(creator.selectedElementName).toEqual("page3");
  expect(creator.survey.pages[1].name).toEqual("page3");
  expect(creator.survey.pages[1].elements).toHaveLength(3);
  expect(creator.survey.pages[1].elements[0].name).toEqual("question5");
  expect(creator.survey.pages[1].elements[2].name).toEqual("question7");
});
test("Show error on entering non-unique column value", (): any => {
  var creator = new CreatorTester();
  creator.JSON = {
    pages: [
      {
        elements: [
          {
            type: "matrixdynamic",
            name: "question1",
            columns: [{ name: "col1" }, { name: "col2" }]
          }
        ]
      }
    ]
  };
  var matrixQuestion = creator.survey.getAllQuestions()[0];
  creator.selectElement(matrixQuestion.columns[1]);
  var questionName = creator.propertyGrid.survey.getQuestionByName("name");
  expect(questionName.value).toEqual("col2");
  questionName.value = "col1";
  expect(questionName.errors).toHaveLength(1);
  expect(questionName.errors[0].getText()).toEqual(
    "Please enter a unique name"
  );
  expect(matrixQuestion.columns[1].name).toEqual("col2");
  questionName.value = "col2";
  expect(questionName.errors).toHaveLength(0);
  questionName.value = "col3";
  expect(questionName.errors).toHaveLength(0);
  expect(matrixQuestion.columns[1].name).toEqual("col3");
});
test("Warn on incorrect using constructor", (): any => {
  var oldFunc = SurveyHelper.warnText;
  var warnings = [];
  SurveyHelper.warnText = (text: string): void => {
    warnings.push(text);
  };
  new CreatorTester(<any>"creator");
  expect(warnings).toHaveLength(1);
  expect(warnings[0].indexOf("constructor") > 0).toBeTruthy();
  var creator = new CreatorTester(
    <any>"creator",
    <any>{ showTranslationTab: true }
  );
  expect(warnings).toHaveLength(2);
  expect(warnings[1].indexOf("constructor") > 0).toBeTruthy();
  expect(creator.showTranslationTab).toBeTruthy();
  SurveyHelper.warnText = oldFunc;
});
