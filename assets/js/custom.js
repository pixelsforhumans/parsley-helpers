/*==========================================================
    
    Custom JavaScript 

=========================================================*/

$(document).ready(function () {
    
    // Bind form to Parsley for validation, 
    // and add custom validator functions
    // ------------------------------------
    
    $('#myForm').parsley(parsleyOptions);
    addCustomValidators();
    
    
    // Manage showing/hiding form sections
    // -----------------------------------
    
    // Disable hidden fields right off the bat
    
    disableInputsWithin('.hidden');
    
    // Also disable fields that are controlled by a toggle switch
    
    $('[data-toggled-by]').each(function() {
        var antecedent = $(this).attr('data-toggled-by');
        if ($(antecedent).not(':checked')) {
            disableInputsWithin(this);
            $(this).addClass('do-not-enable');
        }
    });
    
    // When a toggle switch changes, toggle its target
    
    $(document).on('change', 'input:radio', function () {        
        $('[data-toggle-target]').filter(':not(.hidden *)').each(function() {
            var target = $(this).attr('data-toggle-target');
            if ($(this).is(':checked')) {
                enableInputsWithin(target);
                $(target).removeClass('do-not-enable');
            } else {
                disableInputsWithin(target);
                $(target).addClass('do-not-enable');
            }
        });
    });
    
    // Payment Method
    
    $(document).on('change', '#selectPaymentMethod', function () {
        var cc = '[data-rel-payment-method="creditcard"]';
        var ec = '[data-rel-payment-method="echeck"]';
        switch ($(this).val()) {
            case "Credit Card":
                hideShowFormSections(ec, cc);
                break;
            case "eCheck":
                hideShowFormSections(cc, ec);
                break;
            default:
                hideShowFormSections(ec, cc);
        }
    });
    
    // Payment Type
    
    $(document).on('change', 'input:radio[name="optionsPaymentType"]', function () {
        var ot = '[data-rel-payment-type="onetime"]';
        var rc = '[data-rel-payment-type="recurring"]';
        switch ($(this).val()) {
            case "One-time":
                hideShowFormSections(rc, ot);
                break;
            case "Recurring":
                hideShowFormSections(ot, rc);
                break;
            default:
                hideShowFormSections(rc, ot);
        }
    });
    
    
    // Button actions
    // --------------
    
    $('#btnSubmitPayment').on('click', function (evt) {
        evt.preventDefault();
        validateForm('#myForm', function () {
            // On success
            $('#formStep1').addClass('hidden');
            $('#formStep2').removeClass('hidden');
        }, function () {
            // On error
            // Nothing beyond Parsley's default behavior
        });
    });
    
    $('#btnBack').on('click', function (evt) {
        evt.preventDefault();
        $('#formStep2').addClass('hidden');
        $('#formStep1').removeClass('hidden');
    });
    
    
});
// The End