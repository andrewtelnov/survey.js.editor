import {
  SurveyElement,
  propertyArray,
  Base,
  SurveyModel,
  SurveyTemplateRendererTemplateData,
  property,
  QuestionHtmlModel,
  PanelModelBase
} from "survey-core";
import { CreatorBase } from "../creator-base";
import { DragDropHelper } from "../dragdrophelper";
import { IPortableDragEvent, IPortableMouseEvent } from "../utils/events";
import "./question.scss";

export class QuestionAdornerViewModel extends Base {
  public creator: CreatorBase<SurveyModel>;
  public surveyElement: SurveyElement;

  @propertyArray() actions;
  @property() isDragged: boolean;

  constructor(
    creator: CreatorBase<SurveyModel>,
    surveyElement: SurveyElement,
    public templateData: SurveyTemplateRendererTemplateData
  ) {
    super();
    this.creator = creator;
    this.surveyElement = surveyElement;
    this.actions = creator.getContextActions(surveyElement);
  }
  select(model: QuestionAdornerViewModel, event: IPortableMouseEvent) {
    event.stopPropagation();
    event.cancelBubble = true;
    model.creator.selectElement(model.surveyElement);
    return true;
  }
  css() {
    let result = this.creator.isElementSelected(this.surveyElement)
      ? "svc-question__content--selected"
      : "";

    if (this.isEmptyElement) {
      result += " svc-question__content--empty";
    }

    return result;
  }
  dispose() {}
  get isDraggable() {
    return true;
  }

  public get isEmptyElement(): boolean {
    if (this.surveyElement instanceof QuestionHtmlModel) {
      return !this.surveyElement.html;
    }

    if (this.surveyElement instanceof PanelModelBase) {
      const panel = this.surveyElement as any as PanelModelBase;
      return (
        !panel.rows || panel.rows.length <= 0 || panel.elements.length === 0
      );
    }

    return false;
  }

  public get placeholderText(): string {
    return "Drop questions here";
  }

  private get dragDropHelper(): DragDropHelper {
    return this.creator.dragDropHelper;
  }

  startDragSurveyElement(event: PointerEvent) {
    this.dragDropHelper.startDragSurveyElement(event, <any>this.surveyElement);
    return true;
  }
}
