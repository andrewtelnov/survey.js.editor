import * as ko from "knockout";
import {
  Question,
  SurveyElement,
  SurveyTemplateRendererTemplateData,
  SurveyTemplateRendererViewModel,
  SurveyModel
} from "survey-core";
import { ImplementorBase } from "survey-knockout-ui";
import { CreatorBase } from "@survey/creator";
import { KnockoutQuestionAdornerViewModel } from "./question";
// import "./question-dropdown.scss";
const template = require("./question-dropdown.html");
// import template from "./question-dropdown.html";

export class KnockoutDropdownQuestionAdornerViewModel extends KnockoutQuestionAdornerViewModel {
  constructor(
    creator: CreatorBase<SurveyModel>,
    surveyElement: SurveyElement,
    templateData: SurveyTemplateRendererTemplateData
  ) {
    super(creator, surveyElement, templateData);
  }
}

ko.components.register("svc-dropdown-question", {
  viewModel: {
    createViewModel: (params: SurveyTemplateRendererViewModel, componentInfo: any) => {
      const creator = params.componentData;
      const question = params.templateData.data;

      const scrollSubscription = ko.computed(() => {
        if (creator.isElementSelected(question)) {
          // componentInfo.element.scrollIntoView();
        }
      });
      const model = new KnockoutDropdownQuestionAdornerViewModel(
        params.componentData,
        params.templateData.data as Question,
        params.templateData
      );
      new ImplementorBase(model);
      ko.utils.domNodeDisposal.addDisposeCallback(componentInfo.element, () => {
        scrollSubscription.dispose();
        model.dispose();
      });
      return model;
    },
  },
  template: template,
});
