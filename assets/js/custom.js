/*
============================================================
    
    Custom JavaScript for Parsley Helpers Demo

============================================================
*/

/**
 * The scripts below provide an example of how to use the functions
 * from `parsley-helpers.js` to add dynamic, conditional areas to a form 
 * that's validated via Parsley.
 */

$(document).ready(function () {
    
    /*  Parsley setup
    --------------------------------------*/
    
    /**
     * Bind form to Parsley for validation, with our customized options,
     * then add the custom validator functions we want.
     */
    $('#myForm').parsley(parsleyOptions);
    addCustomValidators();
    
    
    /*  Form fields setup
    --------------------------------------*/
    
    /**
     * Right away, disable form fields inside any container that's hidden. 
     */
    disableInputsWithin('.' + hiddenClass);
    
    
    /*  Show/hide conditional areas
    --------------------------------------*/
    
    /**
     * The basic pattern we use for this feature consists of:
     * 1. A form field with multiple options (such as a <select> or radio 
     *    button group).
     * 2. One or more other elements in the DOM whose display state 
     *    (shown/hidden) depends on which of #1's options is selected.
     * 
     * Note below that to identify the group of DOM elements tied to each 
     * option, we use custom `data-` attributes in the markup, such as 
     * `[data-rel-payment-method="creditcard"]`. This may feel verbose and 
     * awkward, but it makes more semantic sense than using CSS classes to 
     * specify this information.
     */
    
    /**
     * Payment Method toggle
     * 
     * When the value of the Payment Method <select> menu changes, show the 
     * content related to either Credit Card or eCheck.
     */
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
    
    /**
     * Payment Type toggle
     * 
     * When the value of the Payment Type radio button group changes, 
     * show the content related to either One-time or Recurring.
     */
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
    
    
    /*  Enable/disable fields via toggle switches
    -----------------------------------------------*/
    
    /**
     * This feature demonstrates a slightly different approach than the basic 
     * conditional-areas show/hide behavior.  
     * 
     * The expected pattern is something like:
     * 1. A group of radio options.
     * 2. One or more of the radio options contains an associated <input> or 
     *    <select> whose value is required if its parent option is checked.
     *
     * Example: the question "How did you hear about us?" might have 3 radio 
     * options: Advertisement, Word of Mouth, or Other. If Other is checked, 
     * the user must fill out a nearby text input explaining their answer.
     * 
     * To work with the rest of our Parsley behavior, and provide a good user 
     * experience, the target (input or select) is always [disabled] unless its 
     * toggle switch (radio option) is checked.
     * 
     * We don't specify a hierarchical relationship between the toggle switch 
     * and its target - i.e. the target does not need to be a child or a sibling 
     * of the toggle switch.
     * 
     * Instead, we use a custom `data-toggle-target` attribute on the toggle 
     * switch, whose value is a selector that matches the target; and we use a 
     * custom `data-toggled-by` attribute on the target, whose value is a 
     * selector that matches the toggle switch. (We could get by with just one 
     * of these attributes and not the other, but it's more performant and 
     * useful to have both.)
     */
    
    /**
     * Right away, disable any fields that are targets of a toggle switch
     * (unless the toggle switch happens to be checked).
     */
    $('[data-toggled-by]').each(function() {
        var antecedent = $(this).attr('data-toggled-by');
        if ($(antecedent).not(':checked')) {
            disableInputsWithin(this);
            $(this).addClass('do-not-enable');
        }
    });
    
    /**
     * When a toggle switch changes, toggle its target.
     * 
     * Note that we listen for a change on *all* radio buttons to make this work, 
     * since scoping to only those with `[data-toggle-target]` will only capture 
     * a change when those elements become checked, not when they become 
     * un-checked.
     * 
     * Two other things to note, which make this work with our other Parsley 
     * behavior:
     * 1. We filter our selection of objects to eliminate any that are children 
     *    of a 'hidden' container - anything that's hidden is irrelevant.
     * 2. We also manually add/remove the '.do-not-enable' class on the target 
     *    field whenever it becomes disabled/enabled; this sets a flag that 
     *    allows us to ignore this field if we need to hide/show its parent 
     *    form section. (See documentation for `enableInputsWithin()` in 
     *    `parsley-helpers.js`.)   
     */
    $(document).on('change', 'input:radio', function () {        
        $('[data-toggle-target]').filter(':not(.' + hiddenClass + ' *)').each(function() {
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

    
    /*  Button actions
    --------------------------------------*/
    
    /**
     * The Submit button uses Parsley to validate the form.
     */
    $('#btnSubmitPayment').on('click', function (evt) {
        evt.preventDefault();
        validateForm('#myForm', function () {
            // On success
            // Hide step 1, show step 2
            $('#formStep1').addClass(hiddenClass);
            $('#formStep2').removeClass(hiddenClass);
        }, function () {
            // On error
            // Do nothing beyond Parsley's default behavior
        });
    });
    
    /**
     * The Back button in Step 2 just toggles the form back to its initial 
     * state, to make the demo easier to use. Note that it does not clear 
     * the contents of any form fields.
     */
    $('#btnBack').on('click', function (evt) {
        evt.preventDefault();
        $('#formStep2').addClass(hiddenClass);
        $('#formStep1').removeClass(hiddenClass);
    }); 
    
});
