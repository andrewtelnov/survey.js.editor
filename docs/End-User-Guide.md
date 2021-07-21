# End-User Guide - SurveyJS Creator

This page has been prepared as a starting point for documentation aimed at end-users of SurveyJS.

## Basic Overview/Quick Start Guide

The SurveyJS [Survey Creator](https://surveyjs.io/create-survey) page contains the survey design area with the Toolbox to the left and the Properties window to the right.

![Overview of the SurveyJS Creator interface](images/survey-editor-overview.png)

Survey elements (such as questions or panels) can be dragged from the toolbox onto the main design page (questions area). Once these elements are in questions area, they can be modified, edited and reordered to suit the needs of a specific survey. You can add pages to your survey by clicking the drop down menu at the top left of the page.

![Add survey page drop-down menu](images/survey-editor-new-page.png)

Detailed properties for the overall survey and each individual element can be accessed and edited by clicking the `Properties` tab to the right of the page. Ordering and reordering of each survey element can be done by dragging the `hamburger` glyph (three horizontal lines) to the top left of each element.

Once you have designed your survey you can test it by clicking the `Test Survey` link at the top left of the page. There you will be able to choose the target device for your test (for example, if you are going to deliver the survey via iPad, choose `iPad` from the drop-down list).

![Overview of Test Survey Area](images/survey-editor-test-survey.png)

If you need to develop the survey in more detail via the JSON file format, you can access an editor via the `JSON Editor` link at the top of the page.

![Image of JSON viewer/editor](images/survey-editor-json.png)

## Adorners

Each toolbox item will have its own configuration panel once it is placed into the Survey Creator. This panel contains a set of ``adorners``. Using adorners, you will be able to move and re-order the item using the ``hamburger`` button (three horizontal lines), delete the item using the ``cross`` button, toggle the item's visibility using the ``eye`` button, ``duplicate`` the item, ``add`` the item to the toolbox, see the item's ``mode`` and edit the items ``properties``. You may also set the item's ``required`` status if the tool allows it.

![picture of adorner configuration panel](images/survey-editor-adorner.png)

## Individual Toolbox Elements

![Overview of Toolbox](images/survey-editor-toolbox.png)

### Single Input

Single Input allows you to ask a simple question or request a non-predetermined input from a respondent. A single line is presented to the respondent for text input. There are no limits on the possible input so the respondent may enter any text and any amount of text.

### Checkbox

Checkbox allows for multiple questions or items to be asked of a respondent. The Checkbox question presents the survey respondent with a list of items with a checkbox next to each. Ticking the checkbox chooses that item. Multiple items can be checked and only those checked are recorded in the survey.

### Radiogroup

Radiogroup allows for multiple questions or items to be asked of a respondent. The respondent is presented with a list of items with a radio button next to each. Only one item may be selected from this list and only the selected item will be recorded in the survey.

### Dropdown 

A respondent is presented with a drop-down list of items. Only one of these items can be selected, and only the selected item will be recorded in the survey.

### Comment

The Comment survey element asks for a non-predetermined input from a respondent. A text box is presented to the respondent. There are no limits on the possible input so the respondent may enter any text and any amount of text.

### Rating

The Rating survey element asks a respondent to choose a number across the range presented. Only one value may be selected and only the selected value will be recorded in the survey.

### Ranking 

A respondent is presented with a list of items that can be rearranged according to rank or preference. The items are rearranged by dragging the items on the page. The final rank or order of all items is recorded in the survey.

### Image picker

The survey respondent is presented with a series of images. One of these images can be selected and only the value associated with that image will be recorded in the survey.
- To provide a numerical output for this element, enter a numeric value for each image in the `Properties` > `choices` > `value` field.
- Images can be ascribed different values via `Properties` > `Choices` > `Value`
- Toggle `Properties` > `General` > `Multi select` to allow the survey respondent to choose more than one image
- Image sizes can be changed via `Properties` > `General` > `Image Height`/`Image Width`

### Boolean

The Boolean survey element presents a respondent with a yes or no answer. The respondent's response will be recorded in the survey as `true` (yes) or `false` (no).

### Image

The Image survey element allows an image to be uploaded or linked into the survey. There is no associated value in relation to the survey.

### HTML

The HTML tool enables HTML to be added to the survey allowing for diverse formatting for text, paragraphs and the inclusion of links and images. There is no associated value in relation to the survey. 

- `HTML` elements allow the use of the HTML programming language within the survey to add images, files for download, text with HTML formatting among other things. They can be used in conjunction with other questions, and included in `panel` elements. `HTML` is a powerful feature and can be used in conjunction with other elements to address many text formatting questions.
- There may be security issues with `HTML` add ons, especially if they link to external sites
- `HTML` has a `name` field but not a `title`. It does not need to announce itself to the respondent, however because it has a `name` it can be called within the `conditional logic` of the survey. 
- The `HTML` field is for the presentation of text and other information directly to the respondent therefore it should not require its own `description` field.
- actions within the `HTML` field (such as clicking links and downloading files) may not be recorded and tracked directly within the survey. However due to the powerful natue of `HTML` alternative tracking could be applied. The security of any external tracking would need to be considered.

### Signature Pad

The Signature Pad survey element allows respondent input to be directly drawn on screen in a pre-set box or area. This is typically used to obtain a signature from the respondent, however it could be used to obtain any hand-drawn input. The size of the box presented to the respondent may be changed by clicking on the `Properties` tab. The color of the pen and background can also be changed. The input from the respondent is recorded in the survey in the following file formats: JPEG, PNG or SVG. This file format may be changed in the `Properties` tab.

### Expression

The Expression survey element allows for data and calculations to be presented to a respondent. For example, this element provides functionality for adding up the scores of previous question responses, showing the current date and time for the respondent. Configuration is available via the ``Properties`` tab; click ``General`` then edit the ``Expression`` text box. Examples are given:

- {question1}+{question2}
- ({price}\*{quantity})\*(100 - {discount})
- today()
- age()
- min()
- max()
- count()
- avg()
- iif()

### File

The File survey element presents a button to a respondent requesting that a file is uploaded. When the respondent presses the ``Choose File`` button, an upload file dialogue will launch within a web browser. Many details can be specified via the `Properties` tab such as maximum file size, multiple uploads, accepted file formats as well as preview area. The file(s) uploaded via the File element will be recorded/retained in the survey. File formats are restricted by a comma-separated list of file extensions including periods e.g.: `.jpg`,`.pdf`,`.png`. The uploaded file is recorded in the survey. **For security, it is important that you strictly specify the file formats that are allowed to be uploaded into the survey**.

### Matrix (Single Choice)

The Matrix (Single Choice) tool allows for an array of radio buttons to be presented to the survey respondent in rows and columns. The amount of rows and columns can be adjusted, however only one item per row can be selcted. Names of rows and columns can be edited via the `properties` tab: Click `Columns` and then `Fast Entry` to type these in. The order that rows are presented to the respondent can be set to `random` or `initial` (the latter will sort rows aphabetically by the first letter). Only radio buttons that have been selected will be recorded in the survey.
- `Properties` > `Rows` > `Text` controls what the user sees
- `Properties` > `Rows` > `Value` controls what is made available as data and within the `conditional logic` of the survey

### Matrix (Multiple Choice)

The Matrix (Multiple Choice) survey element presents a survey respondent with an array of columns and rows. Each cell of the array can be configured with a list of selectable items. These selectable items can be presented to the respondent through the following cell types:

- Dropdown
- Checkbox
- Radiogroup
- Single Input
- Comment
- Boolean
- Expression
- Rating

(Please see above for descriptions of these types of interaction)
Cell type can be changed via the `Properties` tab. The amount of columns and rows, the title of rows and the value of the selectable item can also be edited via the `Properties` tab. Click `Rows` and `Fast Entry` to name each row. Click `Choices` and `Fast Entry` to edit the item/value. To hide the name of each column, click `Layout` and uncheck `Show Header`. Click `Data` to set the `Default Value` for each cell and a `Correct Answer` if desired. The respondent makes a selection and this is recorded in the survey according to three values: Row, Column and Item/value. Only those selected are recorded in the survey.

### Matrix (Dynamic Rows)

The Matrix (Dynamic Rows) survey element contains the same functionality as the Matrix (Multiple Choice) element above, but adds a dynamic element that is controlled by a survey respondent. Respondents can ``add`` or ``remove rows`` according to their needs. Please see the overview for the Matrix (Multiple Choice) element above for more detail about configuring this element. 

### Multiple Text

The Multiple Text survey element allows for a respondent to input multiple single line inputs. See 'Single Input' above for a basic description. Multiple Text presents a stacked series of Single Input entries. The `Properties` tab allows for configuration of the default value of each field (is the text field empty or does it have pre-filled text?), the amount of columns used to display the text fields as well as the overall amount of text fields/items. Only the entries that have input from the respondent are recorded in the survey.

### Panel

The Panel survey element serves as a box or container that can include multiple questions and sub-panels.

### Panel (Dynamic Panels)

The Panel (Dynamic Panels) tool allows you to create a template box or container element that can include multiple questions and input types. This template is activated when the survey respondent actively clicks `Add New` in the survey. The respondent can activate any number of these templates by repeatedly clicking `Add New`.

### Hiding `Question Number` and `Title` in survey

The `Question Number` and `Title` can be hidden in the survey output. `Properties` > `layout` > `Hide number` removes the number at the start of the question while retaining your title. You can also remove the whole number and title with `Properties` > `Layout` > `Title location` and set it to `Hidden`. This can be useful if you are planning on using an `HTML` element to ask the question or otherwise direct the survey respondent. 

### Formatting text within the survey

Presenting text within the survey can be partially acheived using the `Title` and `Description` fields of each `Element`. These fields are an easy and direct way to add questions and direction to the survey respondent. While this is easy and direct, there are limitations to using these fields. For instance, the `Description` field of an `Element` does not allow formatting such as *italics* or **bold**. These limitations can be overcome by using an `HTML` element to provide the necessary textual material for your survey.

### Conditional Logic

Every survey element can be triggered by any question within the survey. This allows the `visibility` or `availability` of each element to be conditional on the responses made elsewhere in the survey. For example, `Conditional Logic` would allow for a `Matrix` to appear if a `Boolean` question was answered `Yes`, and an `Image Picker` to appear if the same `Boolean` was answered `No`. Using `Logic` within your survey makes it dynamic and responsive, and enables you to create separate pathways throughout the survey as a whole.

To define the `logic` for each element, go to `Properties` > `Logic`.

![Image of `Logic` dropdown within `Properties` section](images/survey-editor-logic.png)

- `Visible if` controls whether the element is made `Visible` via `Logic Expressions`. If these `Expressions` are defined, then the element will remain invisible within the survey unless the conditions of the expression are met.
- `Enable if` controls whether the element is `Enabled` via `Logic Expressions`. The element will be visible, but the responses will disabled until the conditions of the expression are met.
- `Required if` controls whether the element's `Required` state is determined through `Logic Expressions`. If an element is required, then it becomes compulsory and the survey cannot proceed or be completed unless that element has recorded a response (`Required` status can also be determined manually by toggling `Properties` > `General` > `Is required`).

### `Naming` an element for use in an `Expression`

When you add a survey element you are able to give it both a `Title` and a `Name` in the `Properties` > `General` section. Understanding the difference between `Title` and `Name` is important when developing the `Logic` of your survey. In short, `Name` refers to the question as a logical entity that can be refered to within the `Conditional Logic` of the survey without confusion. `Title` refers to text that is directed to the survey respondent and it may be unsuitable for use within the terse structure of the survey's logic.
    An example of a `Name` might be `Q1vegetables` while the corresponding `Title` might be `Please select your favourites from the following vegetables`. It is clear that the purpose of the `Title` is to direct the survey user, while the `Name` refers to the question within the `Logic` of the survey.  

- If there is no `Title` given, the `Name` will be used instead. 
- Both `Title` and `Name` can be hidden in the survey by setting `Properties` > `Layout` > `Title location` to `Hidden`. This might be useful if you plan on providing a question to the survey user using the `HTML` element, for example.

![Image comparing `Title` and `Name` properties](images/survey-editor-namevstitle.png)
![Image comparing `Title` and `Name` properties](images/survey-editor-namevstitle1.png)

### Building a `Logic` `Expression`

![Image of the `Logic` `Properties` menu](images/survey-editor-logic-expression.png)

To build the `Expression` for an element, go to `Properties` > `Logic` and choose how you would like to trigger the element (for example, choose `Visible if` if you would like the element to remain invisible until the conditions of the expresion are met). When you select `Visible if`, you will be directed to `Select question...`. This will open a drop-down dialogue that lists all available questions in the survey. The dialogue will list these by `Name`.

Select the question you would like to use within the `Expression`. Once selected, you will be able to select the `Operator` you would like to apply to your chosen question. Operators could be:

- `is empty`
- `is not empty`
- `equals`
- `not equals`
- `contains`
- `not contains`
- `any of`
- `all of`
- `greater`
- `less`
- `greater or equals`
- `less or equals`

Depending on the type of question you have chosen, only some of these `Operators` may be available and others will be grayed out.

Once you have chosen the question and the `Operator`, you will be able to select the state that the question must have in order to meet the requirements of the `Expression`. For example, in the following image `Q2` is the question, `equals` is the `Operator` and the state of `item1` as `Selected` fulfils the requirements of the  `Expression`:

![Image of the `Logic` `Properties` menu](images/survey-editor-logic-expression1.png)


You can also add more than one condition for your expression to meet in order to be valid. Press `Add condition` to develop the `Expression` further. Multiple conditions can be set and their interrelation is based on the logical `Operators` `And` and `Or`:

- `And` determines that the second `Expression` must also be valid in order for the whole `Expression` to be met. In this example, we are using an expression to determine if an element is `Visible`. Choosing the `And` `Operator` means that the element will not be visible unless the conditions of *both* expressions are met.
- `Or` determines that the second `Expression` is an alternative to the first: *either* the details of the first `Expression` fulfil the conditions to make the element `Visible`, *or* the details of the second `Expression` can also fulfil the conditions of the `Logic`.

![Image of the `Logic` `Properties` menu](images/survey-editor-logic-expression2.png)

### Specific use cases of `Conditional logic`

In general, `Conditional Logic` will be the same across all survey elements. However there are some interesting and specific use cases.

### `Logic` within a `Matrix` element

Conditional logic can be set within a `Matrix` element on a column-row basis. This means that you can set columns to `Visible` or `Enabled` by setting an `Expression` condition within the same row. This allows each row to have it's own conditional logic. 

The `Logic` of each specific column is set by editing the column details. Each column can be edited via `Properties` > `Columns` > `Edit`, and within this there is a `Logic` section specific to that column. 

![Image of the `Column` > `Edit` properties](images/survey-editor-logic-matrix-column.png)

Once you click `Edit` for a specific column, you will be shown a configuration section for that column:

![Image of the `Column` > `Edit` properties detail](images/survey-editor-logic-column-detail.png)

- The `Visiblity` or `Availability` of the column can be determined by a single question anywhere within the survey, including the `Matrix` the column belongs to.
- The column can also be made `Available` or `Visible` relative to a question within the same row of the `Matrix`. For example if you have a `Matrix` with four columns and you would like the `Visibility` of columns 2-4 to be triggered by a `Boolean` in column 1, you will need to set the `Logic` of columns 2, 3 and 4 to be `Visible if`  `row.<columnname>` equals `true`.
- The question `row.<columnname>` refers to the `row` that is *relative* to the question, then the `Name` that you have given the column. In this instance, `row` means 'in the current row' 
- It would be necessary to apply this `Logic` to all columns you would like to be affected by the trigger.

The end-result of setting logic within a `Matrix` can be seen in the following images. 

First, the survey only shows the `Boolean` questions from column one:

![Image of the survey output of internal `Matrix Logic`](images/survey-editor-logic-matrix.png)

Second, the `Boolean` from Column 1/Row 1 is set to `yes/true`, which makes columns 2-4  `Visible`. Notice how this only applies to Row 1.

![Image of the survey output of internal `Matrix Logic`](images/survey-editor-logic-matrix1.png)

Third, the `Boolean` from Column 1/Row 2 is set to `yes/true`, which makes columns 2-4 `Visible` in Row 2 as well as Row 1. Note that Columns 2-4 in Row 3 are still not `Visible`. 

![Image of the survey output of internal `Matrix Logic`](images/survey-editor-logic-matrix2.png)


## Additional Resources

- [SurveyJS Support Forums](https://surveyjs.answerdesk.io/ticket/list) - useful for searching user questions on specific features
