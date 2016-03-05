/*==========================================================
    
    Parsley Helper Functions

=========================================================*/

// Standardize Parsley initialization options
// ------------------------------------------

// We add '[disabled]' to the list of exclusions, so that we can
// show/hide fields dynamically and disable their child fields, 
// which allows Parsley to work properly.

var parsleyOptions = {
    excluded: "input[type=button], input[type=submit], input[type=reset], input[type=hidden], [disabled]"
};


// Utilities for enabling/disabling fields
// ---------------------------------------

// When form fields get shown/hidden dynamically, Parsley needs to be reset
// in order for validation to work properly.

function resetParsley(form) { 
    $(form).parsley().destroy();
    $(form).parsley(parsleyOptions);
}

// The set of form field objects we want to enable/disable should be 
// the same as Parsley's included objects, with the added fact that
// we only need to care about those that are [required]. 

var incInputs = $(Parsley.options.inputs).not(Parsley.options.excluded).filter('[required]');

// When we disable inputs, we don't care about special cases.
// But when we enable inputs, we sometimes need to care, so we can 
// optionally check for a `.do-not-enable` flag on the input or any ancestors.

function disableInputsWithin(obj) {
    $(obj).find(incInputs).prop('disabled', true);
    resetParsley($(obj).closest('form'));
}

function enableInputsWithin(obj, filter) {
    var inputs = $(obj).find(incInputs);
    if (filter) {
        inputs = inputs.filter(':not(.do-not-enable):not(.do-not-enable *)');
    }
    inputs.prop('disabled', false);
    resetParsley($(obj).closest('form'));
}

// Hiding/showing form sections is a matter of:
// 1. Toggling the container's visibility
// 2. Toggling enabled/disabled on all form field children,
//    but leaving any .do-not-enable fields alone.
//
// Note that these are built to accommodate objects that
// consist of multiple form sections, not necessarily just one.

function hideFormSection(sections) {
    var s = $(sections);
    s.each(function() {
        $(this).addClass('hidden');
        disableInputsWithin($(this));
    });
}

function showFormSection(sections) {
    var s = $(sections);
    s.each(function() {
        $(this).removeClass('hidden');
        enableInputsWithin($(this), true);
    });
}

// In most cases we'll use both Hide and Show together

function hideShowFormSections(x, y) {
    hideFormSection(x);
    showFormSection(y);
}


// Define all custom Parsley validator functions
// ---------------------------------------------

function addCustomValidators() {
    window.Parsley.addValidator('date', {
        requirementType: 'string',
        validateString: function (value) {
            var reGoodDate = /^((0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](19|20)?[0-9]{2})*$/;
            return reGoodDate.test(value);
        },
        messages: {
            en: 'Value must be a valid date.',
            es: 'El valor debe ser una fecha válida.'
        }
    }).addValidator('phone', {
        requirementType: 'string',
        validateString: function (value) {
            var reGoodPhNum = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
            return reGoodPhNum.test(value);
        },
        messages: {
            en: 'Phone numbers must be in valid 10-digit format, e.g. 123-456-7890.',
            es: 'Los números de teléfono deben estar en formato de 10 dígitos válido, por ejemplo: 123-456-7890.'
        }
    }).addValidator('zip', {
        requirementType: 'string',
        validateString: function (value) {
            var reGoodZip = /^\d{5}(?:[-\s]\d{4})?$/;
            return reGoodZip.test(value);
        },
        messages: {
            en: 'Enter a 5- or 9-digit zip code.',
            es: 'Código postal debe ser 5 o 9 dígitos.'
        }
    }).addValidator('creditcard', {
        requirementType: 'string',
        validateString: function (value) {
            var reGoodCC =  /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/;
            return reGoodCC.test(value);
        },
        messages: {
            en: 'Value must be a valid credit card number.',
            es: 'El valor debe ser un número de tarjeta de crédito válida.'
        }
    });
}

// Validate the form and run success/error callbacks
// -------------------------------------------------

function validateForm(form, success, error) {
    var f = $(form);
    f.parsley().validate();
    
    if (f.parsley().isValid()) {
        if (typeof success === "function") { success(); }
    } else {
        if (typeof error === "function") { error(); }
    }
}
