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
    
    $('#btnSubmitPayment').on('click', function (evt) {
        evt.preventDefault();
        console.log("Successful submission");
        hideShow('#formStep1', '#formStep2');
        /*
        validateForm('#myForm', function () {
            // On success
            // Build the form submission result, go to next step
        }, function () {
            // On error
            // Nothing beyond Parsley defaults
        });
        */
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