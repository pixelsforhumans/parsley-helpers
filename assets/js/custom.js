/*==========================================================
    
    Custom JavaScript 

=========================================================*/


//
// Functions
//


// Get HTML content of an element

function getHtmlContent(srcElem) {
    $(srcElem).html();
}

// Hide one thing, then show another

function hideShow(x, y) {
    $(x).addClass('hidden');
    $(y).removeClass('hidden');
}

//
// Document ready
//

$(document).ready(function () {
    
    //
    //  Bootstrap Components
    //
    
    // Initialize tooltips everywhere
    
    $('[data-toggle="tooltip"]').tooltip();
    
    // Initialize popovers everywhere
    
    $('[data-toggle="popover"]').popover({
        trigger: 'hover focus'
        /*content: function () {
            return $($(this).data('contentwrapper')).html();
        }*/
    });
    
    
    
    
    //
    // Form stuff
    //
    
    // Bind forms to Parsley for validation
    // ------------------------------------
    
    $('#myForm').parsley({
        excluded: "input[type=button], input[type=submit], input[type=reset], input[type=hidden], [disabled]"
    });
    
    
    // Add custom Parsley validators
    // -----------------------------
    
    addCustomValidators();
    
    
    // Manage showing/hiding form sections
    // -----------------------------------
    
    // Payment Method
    
    $(document).on('change', '#selectPaymentMethod', function (evt) {
        var cc = '[data-rel-payment-method="creditcard"]';
        var ec = '[data-rel-payment-method="echeck"]';
        switch ($(this).val()) {
            case "Credit Card":
                hideShow(ec, cc);
                break;
            case "eCheck":
                hideShow(cc, ec);
                break;
            default:
                hideShow(ec, cc);
        }
    });
    
    // Payment Type
    
    $(document).on('change', 'input:radio[name="optionsPaymentType"]', function (evt) {
        var ot = '[data-rel-payment-type="onetime"]';
        var rc = '[data-rel-payment-type="recurring"]';
        switch ($(this).val()) {
            case "One-time":
                hideShow(rc, ot);
                break;
            case "Recurring":
                hideShow(ot, rc);
                break;
            default:
                hideShow(rc, ot);
        }
    });
    
    
    // Button actions
    // --------------
    
    $('#btnSubmitPayment').on('click', function (evt) {
        evt.preventDefault();
        validateForm('#myForm', function () {
            // On success
            console.log("Successful submission");
            hideShow('#formStep1', '#formStep2');
        }, function () {
            // On error
            // Nothing beyond Parsley defaults
        });
    });
    
    $('#btnBack').on('click', function (evt) {
        evt.preventDefault();
        hideShow('#formStep2', '#formStep1');
    });
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    // 
    //  Other Vendor Components 
    //
    
    // Initialize Chosen
    
    /*
    $(".chosen-select").chosen({
        width: "100%", // Workaround for an issue where if the select is initially hidden, width becomes 0
        disable_search_threshold: 5,
        allow_single_deselect: true
    });
    */
    
    
    
});
// The End