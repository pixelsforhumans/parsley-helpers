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