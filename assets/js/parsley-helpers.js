/*
============================================================
    
    Parsley Helper Functions

============================================================
*/

/*
------------------------------------------------------------
    1. Parsley setup & validation
------------------------------------------------------------
*/

/**
 * Custom Parsley validator functions
 * 
 * Must be added after Parsley is initialized. These validate text strings for 
 * proper formatting of the following types, which are not included with Parsley
 * out of the box:
 * 
 * Date (US):       e.g. 4/29/15 or 4-29-15
 * Phone:           e.g. (617) 555-1234 or 617-555-1234
 * Zip (US):        e.g. 02043 or 02043-1961
 * Credit Card:     e.g. 4444111111111111
 */
function addCustomValidators() {
    window.Parsley.addValidator('date', {
        requirementType: 'string',
        validateString: function (value) {
            var reGoodDate = /^((0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](19|20)?[0-9]{2})*$/;
            return reGoodDate.test(value);
        },
        messages: {
            en: 'Value must be a valid date.'
        }
    }).addValidator('phone', {
        requirementType: 'string',
        validateString: function (value) {
            var reGoodPhNum = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
            return reGoodPhNum.test(value);
        },
        messages: {
            en: 'Phone numbers must be in valid 10-digit format, e.g. 123-456-7890.'
        }
    }).addValidator('zip', {
        requirementType: 'string',
        validateString: function (value) {
            var reGoodZip = /^\d{5}(?:[-\s]\d{4})?$/;
            return reGoodZip.test(value);
        },
        messages: {
            en: 'Enter a 5- or 9-digit zip code.'
        }
    }).addValidator('creditcard', {
        requirementType: 'string',
        validateString: function (value) {
            var reGoodCC =  /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/;
            return reGoodCC.test(value);
        },
        messages: {
            en: 'Value must be a valid credit card number.'
        }
    });
}

/**
 * Validate the form itself
 * 
 * Allows a success callback function (needed if you want the form to do 
 * something), and an error callback function (often not needed since Parsley's
 * default behavior prevents submission and displays error messages).
 */  
function validateForm(form, success, error) {
    var f = $(form);
    f.parsley().validate();
    
    if (f.parsley().isValid()) {
        if (typeof success === "function") { success(); }
    } else {
        if (typeof error === "function") { error(); }
    }
}





/*
------------------------------------------------------------
    2. Parsley with dynamically shown/hidden fieldsets
------------------------------------------------------------
*/

/**
 * Once Parsley has been initialized, it keeps track of all fields marked 
 * [required]. So if a required field gets hidden via user action, Parsley 
 * will still think it's required and invalidate the form.
 * 
 * To prevent this situation, we do several things:
 *
 * 1. Configure Parsley's options so that it will ignore fields that are 
 *    [disabled], even if they are marked [required].
 * 2. Ensure that every time we hide a set of form fields, we also disable 
 *    all fields in that set (and vice versa when we re-show it). 
 * 3. Re-initialize Parsley every time a change happens that hides or shows 
 *    a set of form fields, to make sure it requires only the ones shown.
 */

/*  Custom Parsley initialization
--------------------------------------*/

/** 
 * Adds '[disabled]' to the list of excluded selectors, per #1 above.
 */
var parsleyOptions = {
    excluded: "input[type=button], input[type=submit], input[type=reset], input[type=hidden], [disabled]"
};


/*  Customizable utility selectors
---------------------------------------------*/

/** 
 * These selectors are used in the functions below; you can replace them 
 * with your own preferred alternatives. 
 *
 * hiddenClass: CSS class used to hide content, usually via display: none. This 
 * must be defined in your stylesheet. Leave off the initial '.'
 */
var hiddenClass = 'hidden';
 
/**
 * doNotEnableSelector: A selector that acts as a flag to prevent the enabling 
 * of a form field, if it should stay disabled.
 */
var doNotEnableSelector = '.do-not-enable';


/*  Resetting Parsley
---------------------------------------------*/

/** 
 * Function for re-initializing Parsley, per #3 above.
 * 
 * Note that we need to re-initialize using our customized options, to make 
 * sure the [disabled] behavior still works.
 */
function resetParsley(form) { 
    $(form).parsley().destroy();
    $(form).parsley(parsleyOptions);
}


/*  Enabling/disabling form fields 
---------------------------------------------*/

/**
 * Custom collection of form field objects to enable/disable
 * 
 * The set of form field objects we want to act on should be the same as 
 * Parsley's included objects, with the added fact that we only need to care 
 * about those that are [required]. 
 */
var incInputs = $(Parsley.options.inputs).not(Parsley.options.excluded).filter('[required]');

/**
 * When disabling fields, set the `disabled` property, then reset Parsley.
 * 
 * Note that this function (and its counterpart below) targets the *parent* of 
 * the form field(s), not the field(s) themselves, because 98% of the time 
 * we want to disable a set of fields at once, not just one. This means that 
 * any field you want to enable/disable must have a targetable parent.
 */
function disableInputsWithin(obj) {
    $(obj).find(incInputs).prop('disabled', true);
    resetParsley($(obj).closest('form'));
}

/**
 * When enabling fields, we need to be careful, since some fields may be 
 * disabled for an unrelated reason (and should stay that way). So we optionally
 * check for a `do not enable` flag on each field and its ancestors, then set 
 * the `disabled` property, then reset Parsley.
 */
function enableInputsWithin(obj, filter) {
    var inputs = $(obj).find(incInputs);
    if (filter) {
        inputs = inputs.filter(':not(' + doNotEnableSelector + '):not(' + doNotEnableSelector + ' *)');
    }
    inputs.prop('disabled', false);
    resetParsley($(obj).closest('form'));
}


/*  Hiding/showing form sections 
---------------------------------------------*/

/** 
 * Hiding/showing form sections consists of:
 * 1. Toggling the section containers' visibility
 * 2. Using our functions above to enable/disable all form field children,
 *    but leave any `do not enable` fields alone.
 * 
 * Note that these are built to accommodate objects that
 * consist of multiple form sections, not necessarily just one.
 */
function hideFormSection(sections) {
    var s = $(sections);
    s.each(function() {
        $(this).addClass(hiddenClass);
        disableInputsWithin($(this));
    });
}

function showFormSection(sections) {
    var s = $(sections);
    s.each(function() {
        $(this).removeClass(hiddenClass);
        enableInputsWithin($(this), true);
    });
}

/**
 * In most cases we'll use both Hide and Show together, so here they are.
 * 
 * The order is important, because you want to be able to, for example, 
 * hide *all* form sections, then show just the one you want.
 */
function hideShowFormSections(x, y) {
    hideFormSection(x);
    showFormSection(y);
}
