import {editorLocalization} from "../editorLocalization"

var persianStrings = {
    //survey templates
    survey: {
        edit: "ویرایش",
        dropQuestion: "لطفا سوالی در اینجا قرار دهید",
        copy: "کپی",
        addToToolbox: "اضافه کردن به جعبه ابزار",
        deletePanel: "حذف پنل",
        deleteQuestion: "حذف سوال"
    },
    //questionTypes
    qt: {
        checkbox: "تیک",
        comment: "نظر",
        dropdown: "لیست انتخابی",
        file: "فایل",
        html: "Html",
        matrix: "ماتریس (تک انتخابی)",
        matrixdropdown: "ماتریس (چند انتخابی)",
        matrixdynamic: "ماتریس (سطرهای داینامیک)",
        multipletext: "متن چند خطی",
        panel: "پنل",
        paneldynamic: "پنل (پنل های داینامیک)",
        radiogroup: "گروه انتخاب",
        rating: "رتبه بندی",
        text: "متن تک خطی",
        boolean: "صحیح و غلط"
    },
    //Strings in Editor
    ed: {
        survey: "پرسشنامه",
        addNewPage: "درج صفحه جدید",
        newPageName: "page",
        newQuestionName: "question",
        newPanelName: "panel",
        testSurvey: "پیش نمایش",
        testSurveyAgain: "پیش نمایش مجدد",
        testSurveyWidth: "عرض پرسشنامه: ",
        embedSurvey: "کد پرسشنامه",
        saveSurvey: "ذخیره پرسشنامه",
        designer: "طراح پرسشنامه",
        jsonEditor: "ویرایشگر کد",
        undo: "قبلی",
        redo: "بعدی",
        options: "انتخاب ها",
        generateValidJSON: "تولید کد کارا",
        generateReadableJSON: "تولید کد خوانا",
        toolbox: "جعبه ابزار",
        delSelObject: "حذف مورد انتخابی",
        correctJSON: "کد صحیح نیست",
        surveyResults: "نتیجه پرسشنامه: "
    },
    //Property Editors
    pe: {
        apply: "اجرا",
        ok: "تایید",
        cancel: "لغو",
        reset: "بازنشانی",
        close: "بستن",
        delete: "حذف",
        addNew: "درج جدید",
        removeAll: "حذف همه",
        edit: "ویرایش",
        empty: "<خالی>",
        fastEntry: "ورود سریع",
        formEntry: "تکمیل فرم",
        testService: "بررسی سرویس",
        expressionHelp: "لطفا یک عبارت منطقی که صحیح یا غلط را برگرداند وارد کنید تا آیتم یا صفحات را مدیریت کنید. برای مثال: {question1} = 'value1' or ({question2} = 3 and {question3} < 5)",

        propertyIsEmpty: "مقداری را وارد کنید",
        value: "مقدار",
        text: "متن",
        required: "اجباری است؟",
        columnEdit: "ویرایش ستون: {0}",
        itemEdit: "ویرایش آیتم: {0}",

        hasOther: "دارای آیتم دیگر",
        name: "نام",
        title: "عنوان",
        cellType: "نوع سلول",
        colCount: "تعداد ستون",
        choicesOrder: "انتخاب ترتیب گزینه ها",
        visible: "نمایش داده شود؟",
        isRequired: "ضروری است؟",
        startWithNewLine: "با سطر جدید شروع شود؟",
        rows: "تعداد سطر",
        placeHolder: "نگهدارنده متن",
        showPreview: "پیشنمایش تصویر نشان داده شود؟",
        storeDataAsText: "ذخیره کردن محتوای فایل در کد نتیجه به عنوان متن",
        maxSize: "حداکثر سایز به بایت",
        imageHeight: "ارتفاع تصویر",
        imageWidth: "عرض تصویر",
        rowCount: "تعداد سطر",
        addRowText: "متن دکمه درج سطر",
        removeRowText: "متن دکمه حذف سطر",
        minRateDescription: "توضیح حداقل رتبه",
        maxRateDescription: "توضیح حداکثر رتبه",
        inputType: "نوع ورودی",
        optionsCaption: "نوشته انتخاب ها",

        qEditorTitle: "ویرایش سوال: {0}",
        tabs: {
            general: "عمومی",
            fileOptions: "انتخاب ها",
            html: "ویرایشگر HTML",
            columns: "ستون ها",
            rows: "سطرها",
            choices: "انتخاب ها",
            visibleIf: "نمایش در صورت",
            rateValues: "مقادیر رتبه بندی",
            choicesByUrl: "انتخاب ها از وب",
            matrixChoices: "انتخاب های پیشفرض",
            multipleTextItems: "فیلدهای متنی",
            validators: "اعتبارسنجی ها"
        },
        editProperty: "ویرایش خصوصیت '{0}'",
        items: "[ آیتم: {0} ]",

        enterNewValue: "مقداری را وارد کنید",
        noquestions: "سوالی در پرسشنامه درج نشده",
        createtrigger: "اجرا کننده ای بسازید",
        triggerOn: "در ",
        triggerMakePagesVisible: "صفحات را قابل نمایش کن:",
        triggerMakeQuestionsVisible: "سوالات را قابل نمایش کن:",
        triggerCompleteText: "پرسشنامه را تکمیل کن اگر موفق بود.",
        triggerNotSet: "اجرا کننده تنظیم نشده.",
        triggerRunIf: "اجرا در صورت",
        triggerSetToName: "تعییر مقدار از: ",
        triggerSetValue: "به: ",
        triggerIsVariable: "عدم درج متغییر در نتایج پرسشنامه",
        verbChangeType: "تغییر نوع ",
        verbChangePage: "تغییر صفحه "
    },
    //Property values
    pv: {
        true: "صحیح",
        false: "نادرست",

        ar: "العربية",
        cz: "čeština",
        da: "dansk",
        de: "deutsch",
        en: "english",
        es: "español",
        fi: "suomalainen",
        fr: "français",
        gr: "ελληνικά",
        it: "italiano",
        is: "íslenska",
        nl: "hollandsk",
        pl: "polski",
        pt: "português",
        ro: "română",
        ru: "русский",
        sv: "svenska",
        tr: "türkçe",
        zh_cn: "简体中文"
    },
    //Operators
    op: {
        empty: "خالی باشد",
        notempty: "خالی نباشد",
        equal: "مساوی باشد",
        notequal: "مساوی نباشد",
        contains: "شامل",
        notcontains: "شامل نباشد",
        greater: "بزرگتر",
        less: "کوچکتر",
        greaterorequal: "بزرگتر مساوی",
        lessorequal: "کوچکتر مساوی"
    },
    //Embed window
    ew: {
        angular: "Use Angular version",
        jquery: "Use jQuery version",
        knockout: "Use Knockout version",
        react: "Use React version",
        vue: "Use Vue version",
        bootstrap: "For bootstrap framework",
        standard: "No bootstrap",
        showOnPage: "Show survey on a page",
        showInWindow: "Show survey in a window",
        loadFromServer: "Load Survey JSON from server",
        titleScript: "Scripts and styles",
        titleHtml: "HTML",
        titleJavaScript: "JavaScript"
    },
    validators: {
        answercountvalidator: "تعداد پاسخ",
        emailvalidator: "ایمیل",
        numericvalidator: "عدد",
        regexvalidator: "regex",
        textvalidator: "متن"
    },
    triggers: {
        completetrigger: "تکمیل پرسشنامه",
        setvaluetrigger: "تنظیم مقدار",
        visibletrigger: "تغییر وضعیت دیده شدن"
    },
    //Properties
    p: {
        name: "name",
        title: { name: "title", title: "اگر خالی باشد مانند نام درج می شود" },
        survey_title: { name: "title", title: "در تمام صفحات دیده می شود" },
        page_title: { name: "title", title: "عنوان صفحه" }
    }
};

editorLocalization.locales["fa"] = persianStrings;
