/*==========================================================
    
    Parsley Helper Functions

=========================================================*/


// Utility for callbacks

function runCallback(fn, options) {
    if (typeof fn === "function") { fn(options); }
}

/*
    Note for below: rather than all the complicated traversal about radio button children...
    let's just specify '.selectable-child' and '.selectable-parent' classes 
    (really they don't have to be parent/child at all, just associated)
    which we can check within that utility function.
    
    Also let's specify a common set of jQuery objects for form fields that can be enabled/disabled,
    and use that below.
*/


// Utilities for managing Parsley validation

var incInputs = $(Parsley.options.inputs).not(Parsley.options.excluded);

function disableInputs(parent) {
    // When we disable inputs, we don't care about the ones inside radio options;
    // just disable them all to prevent validation
    $(parent).find(incInputs).prop('disabled', true);
}
function enableInputs(parent) {
    // But when we enable inputs, we do care about the ones inside radio options;
    // only enable a radio-option-input if its radio option is checked 
    var inputs = $(parent).find(incInputs);
    inputs.each(function() {
        // If it's inside a radio, test for checked
        var radio = $(this).closest('label').find('input[type="radio"]');
        if (radio.length > 0) {
            if (radio.is(":checked")) {
                $(this).prop('disabled', false);
            }
        } else {
            // If not inside a radio, just enable it
            $(this).prop('disabled', false);
        }
    });
}
function resetParsley(form) { 
    // Necessary for correct validation if form fields change dynamically
    $(form).parsley().destroy();
    $(form).parsley();
}


function hideFormSection(sections) {
    var s = $(sections);
    s.each(function() {
        // Hide the container in the DOM
        $(this).addClass('hidden');
        // Disable input fields to turn off validation
        disableInputs($(this));
        // Reset Parsley validation parameters on parent form
        var form = $(this).closest('form');
        resetParsley(form);
    });
}
function showFormSection(sections) {
    var s = $(sections);
    s.each(function() {
        // Show the container in the DOM
        $(this).removeClass('hidden');
        // Enable input fields to turn on validation
        enableInputs($(this));
        // Reset Parsley validation parameters on parent form
        var form = $(this).closest('form');
        resetParsley(form);
    });
}

function toggleRadioTextInputs(radio) {
    var r = $(radio);
    var parent = radio.closest('.form-group');
    if (r.val() == "Custom") {
        enableInputs(parent);
    } else {
        disableInputs(parent);
    }
}



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


function validateForm(form, success, error) {
    var f = $(form);
    f.parsley().validate();
    
    if (f.parsley().isValid()) {
        runCallback(success);
    } else {
        runCallback(error);
    }
}
