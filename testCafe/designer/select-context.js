import { url } from "../helper";
import { ClientFunction, Selector } from 'testcafe';
const title = "Select context object then edit string";

fixture`${title}`.page`${url}`.beforeEach(async (t) => {
    await t.maximizeWindow();
});

test("Matrix question", async (t) => {
    await t.expect(Selector(".svc-question__content").exists).notOk();
    await t.expect(Selector(`.svc-property-panel__title`).innerText).eql("Survey");

    await t.hover(Selector(`div[title="Matrix (single choice)"]`), {speed: 0.5});
    await t.click(Selector(`div[title="Matrix (single choice)"]`), {speed: 0.5});
    await t.expect(Selector(".svc-question__content").exists).ok();
    await t.expect(Selector(`.svc-property-panel__title`).innerText).eql("Question");

    await t.click(Selector(`span[aria-placeholder='Input page title here']`));
    await t.expect(Selector(`.svc-property-panel__title`).innerText).eql("Page");

    await t.click(Selector(`.sv-string-editor`).withText('question1'));
    await t.expect(Selector(`.svc-property-panel__title`).innerText).eql("Question");

    await t.click(Selector(`span[aria-placeholder='Input survey title here']`));
    await t.expect(Selector(`.svc-property-panel__title`).innerText).eql("Survey");
    await t.expect(Selector(`h5[aria-label='Columns'].spg-title`).visible).notOk();

    await t.click(Selector(`.sv-string-editor`).withText('Column 1'));
    await t.expect(Selector(`.svc-property-panel__title`).innerText).eql("Question");
    await t.expect(Selector(`h5[aria-label='Columns'].spg-title`).visible).ok();

    await t.click(Selector(`.sv-string-editor`).withText('Row 1'));
    await t.expect(Selector(`.svc-property-panel__title`).innerText).eql("Question");
    await t.expect(Selector(`h5[aria-label='Columns'].spg-title`).visible).notOk();
    await t.expect(Selector(`h5[aria-label='Row count'].spg-title`).visible).ok();
});

test("Matrix dropdown question", async (t) => {
    await t.expect(Selector(".svc-question__content").exists).notOk();
    await t.expect(Selector(`.svc-property-panel__title`).innerText).eql("Survey");

    await t.hover(Selector(`div[title="Matrix (multiple choice)"]`), {speed: 0.5});
    await t.click(Selector(`div[title="Matrix (multiple choice)"]`), {speed: 0.5});
    await t.expect(Selector(".svc-question__content").exists).ok();
    await t.expect(Selector(`.svc-property-panel__title`).innerText).eql("Question");

    await t.click(Selector(`.sv-string-editor`).withText('Column 1'));
    await t.expect(Selector(`.svc-property-panel__title`).innerText).eql("Column");
    await t.expect(Selector(`h5[aria-label='Columns'].spg-title`).visible).notOk();

    await t.click(Selector(`.sv-string-editor`).withText('Row 1'));
    await t.expect(Selector(`.svc-property-panel__title`).innerText).eql("Question");
    await t.expect(Selector(`h5[aria-label='Columns'].spg-title`).visible).notOk();
    await t.expect(Selector(`h5[aria-label='Row count'].spg-title`).visible).ok();
});

test("Matrix dropdown question select column", async (t) => {
    await t.expect(Selector(".svc-question__content").exists).notOk();
    await t.expect(Selector(`.svc-property-panel__title`).innerText).eql("Survey");

    await t.hover(Selector(`div[title="Matrix (multiple choice)"]`), {speed: 0.5});
    await t.click(Selector(`div[title="Matrix (multiple choice)"]`), {speed: 0.5});
    await t.expect(Selector(".svc-question__content").exists).ok();
    await t.expect(Selector(`.svc-property-panel__title`).innerText).eql("Question");
    await t.expect(Selector(`.svc-matrix-cell--selected`).visible).notOk();

    await t.hover(Selector(`.svc-matrix-cell`), {speed: 0.5});
    await t.expect(Selector(`.svc-matrix-cell--selected`).visible).ok();

    await t.click(Selector(`.sv-string-editor`).withText('Column 1'));
    await t.expect(Selector(`.svc-matrix-cell--selected.svc-visible`).visible).ok();
});

test("Matrix dynamic question select column", async (t) => {
    await t.expect(Selector(".svc-question__content").exists).notOk();
    await t.expect(Selector(`.svc-property-panel__title`).innerText).eql("Survey");

    await t.hover(Selector(`div[title="Matrix (dynamic rows)"]`), {speed: 0.5});
    await t.click(Selector(`div[title="Matrix (dynamic rows)"]`), {speed: 0.5});
    await t.expect(Selector(".svc-question__content").exists).ok();
    await t.expect(Selector(`.svc-property-panel__title`).innerText).eql("Question");
    await t.expect(Selector(`.svc-matrix-cell--selected`).visible).notOk();

    await t.hover(Selector(`.svc-matrix-cell`), {speed: 0.5});
    await t.expect(Selector(`.svc-matrix-cell--selected`).visible).ok();

    await t.click(Selector(`.sv-string-editor`).withText('Column 1'));
    await t.expect(Selector(`.svc-matrix-cell--selected.svc-visible`).visible).ok();
});
