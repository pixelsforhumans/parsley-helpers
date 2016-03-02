/*==========================================================
    
    Custom JavaScript for CommonCoach CMS 

=========================================================*/

//
// Globals
//

var col2expanded = false;
var col2enabled = false;


//
// Functions
//

// Set initial conditions

function toggleColClass(varName, elem, className, callback) {
    if (varName === true) {
        $(elem).removeClass(className);
    } else {
        $(elem).addClass(className);
    }
    if (typeof callback === "function") { callback(); }
}

// Multipurpose multi-item checker

function doAnyXHaveClassY(x, y, handlerIfYes, handlerIfNo) {
    var i = 0;
    $(x).each(function () {
        if ($(this).hasClass(y)) {
            i++;
        }
    });
    if (i > 0) {
        if (typeof handlerIfYes === "function") { handlerIfYes(); }
    } else {
        if (typeof handlerIfNo === "function") { handlerIfNo(); }
    }
}

// Check if any columns are disabled
//  (If one column is disabled, no collapsing allowed)

function toggleToggles() {
    doAnyXHaveClassY('.col-content', 'disabled', function () {
        $('.col-content .toggle-col').addClass('disabled');
    }, function () {
        $('.col-content .toggle-col').removeClass('disabled');
    });
}

// Column collapsing

function toggleCollapseOn(elem, callback) {
    $('.col-content').removeClass('col-min');
    $(elem).closest('.col-content').addClass('col-min');
    $('.stretch-container').addClass('showing-2');
    if (typeof callback === "function") { callback(); }
}

function toggleCollapseOff(elem, callback) {
    $('.col-content').removeClass('col-min');
    $('.stretch-container').removeClass('showing-2');
    if (typeof callback === "function") { callback(); }
}

// Toggle active state

function toggleActive(target, callback) {
    $(target).toggleClass('active');
    if (typeof callback === "function") { callback(); }
}

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
        trigger: 'hover focus',
        content: function () {
            return $($(this).data('contentwrapper')).html();
        }
    });
    
    
    // 
    //  Other Vendor Components 
    //
    
    // Initialize Chosen
    
    $(".chosen-select").chosen({
        width: "100%", // Workaround for an issue where if the select is initially hidden, width becomes 0
        disable_search_threshold: 5,
        allow_single_deselect: true
    });
    
    
    //
    //  Column Controls
    //
    
    // Check & enable/disable col2
    
    toggleColClass(col2expanded, '.col-content-2', 'col-min');
    toggleColClass(col2enabled, '.col-content-2', 'disabled', toggleToggles);
    
    // Collapse/expand behavior
    
    $('.toggle-col').on('click', function (evt) {
        evt.preventDefault();
        var pcol = $(this).closest('.col-content');
        if (!pcol.hasClass('disabled') && !$(this).hasClass('disabled')) {
            if (pcol.hasClass('col-min')) {
                toggleCollapseOff(this);
            } else {
                toggleCollapseOn(this);
            }
        }
    });
    
    
    //
    // Interactions
    //
    
    // Click on a hook to select it
    //  (Hooks are multi-select)
    
    $('.item-hook').on('click', function (evt) {
        evt.preventDefault();
        toggleActive(this);
        
        // temp - also update Details pane
        doAnyXHaveClassY('.item-hook', 'active', function () {
            $('.details-pane').hide();
            $('#sectionColInnerSingleItem, #sectionColInnerSingleItemBlank').hide();
            $('#sectionColInnerDefault .col-inner-content').removeClass('center');
            $('#sectionColInnerDefault').show();
            $('.details-pane.multi-selection').show();
        }, function () {
            $('.details-pane').hide();
            $('#sectionColInnerSingleItem, #sectionColInnerSingleItemBlank').hide();
            $('#sectionColInnerDefault .col-inner-content').addClass('center');
            $('#sectionColInnerDefault').show();
            $('.details-pane.hooks-empty-aftersearch').show();
        });
    });
    
    // Click on a hint to select it 
    //  (Hints are single-select)
    
    $('.item-hint').on('click', function (evt) {
        evt.preventDefault();
        $(this).removeClass('faded');
        toggleActive(this);
        if ($(this).hasClass('active')) {
            $('.item-hint').not(this).removeClass('active').addClass('faded');
            
            // temp - also update Details pane
            $('#sectionColInnerDefault').hide();
            $('#sectionColInnerSingleItem, #sectionColInnerSingleItem .details-pane').show();
        } else {
            $('.item-hint').removeClass('active faded');
            
            // temp - also update Details pane
            $('#sectionColInnerSingleItem, #sectionColInnerSingleItemBlank').hide();
            $('#sectionColInnerDefault .col-inner-content').addClass('center');
            $('#sectionColInnerDefault').show();
            $('.details-pane.hints-empty-aftersearch').show();
        }
    });
    
    // Click btn to open col2 search
    
    $('#btnApplyExistingHint').on('click', function () {
        col2expanded = true;
        col2enabled = true;
        toggleColClass(col2expanded, '.col-content-2', 'col-min');
        toggleColClass(col2enabled, '.col-content-2', 'disabled', toggleToggles);
        
        toggleCollapseOff('.col-content-3');
        
        // temp - also update Details pane
        $('.details-pane').hide();
        $('#sectionColInnerSingleItem, #sectionColInnerSingleItemBlank').hide();
        $('#sectionColInnerDefault .col-inner-content').addClass('center');
        $('#sectionColInnerDefault').show();
        $('.details-pane.hints-empty-aftersearch').show();
    });
    
    // Click btn to create blank hint
    
    $('#btnCreateNewHint').on('click', function () {
        col2expanded = false;
        col2enabled = false;
        //toggleColClass(col2expanded, '.col-content-2', 'col-min');
        //toggleColClass(col2enabled, '.col-content-2', 'disabled', toggleToggles);
        
        toggleCollapseOn('.col-content-2 .toggle-col');
        //toggleCollapseOff('.col-content-3');
        
        // temp - also update Details pane
        $('.details-pane').hide();
        $('#sectionColInnerDefault .col-inner-content').removeClass('center');
        $('#sectionColInnerDefault').hide();
        $('#sectionColInnerSingleItemBlank, #sectionColInnerSingleItemBlank .details-pane').show();
    });
    
    // Add filters to col 1 search - prototype only
    
    $('#btnAddSearchFilter1').on('click', function (evt) {
        evt.preventDefault();
        var filterElem = $('#additionalFilterHtml').html();
        console.log(filterElem);
                                
        $('#fieldsetSearch1HooksHintsParams').append(filterElem);
    });
    
    // Remove filters from col 1 search - prototype only
    // Doesn`t work... can`t find the elements that have been appended dynamically 
    
    $('.remove-filter').on('click', function (evt) {
        evt.preventDefault();
        $(this).closest('.additional-filter').css('background', 'red');
    });
    
    // Switch the Hooks/Hints search fields with the Browse College search fields
    
    $(document).on('change', 'input:radio[name="radioSearch1ContentTypes"]', function (evt) {
        if ($(this).val() == "Browse a College") {
            $('#fieldsetSearch1HooksHints').hide();
            $('#fieldsetSearch1BrowseCollege').show();
        } else {
            $('#fieldsetSearch1BrowseCollege').hide();
            $('#fieldsetSearch1HooksHints').show();
        }
    });
    
    // Click Search Hooks 1 btn to toggle slim header and display results
    
    $('#btnSearch1HooksHints').on('click', function (evt) {
        evt.preventDefault();
        $('#resultsListColleges').hide();
        $('#resultsListHooks').show();
    });
    
    // Click Search Colleges 1 btn to toggle slim header and display results
    
    $('#btnSearch1BrowseCollege').on('click', function (evt) {
        evt.preventDefault();
        $('#resultsListHooks').hide();
        $('#resultsListColleges').show();
    });
    
    // Edit/Preview buttons toggle between Edit and Preview
    
    $('#btnToggleEdit').on('click', function (evt) {
        evt.preventDefault();
        $('#sectionItemDetailPreview').hide();
        $('#sectionItemDetailEdit').show();
    });
    $('#btnTogglePreview').on('click', function (evt) {
        evt.preventDefault();
        $('#sectionItemDetailEdit').hide();
        $('#sectionItemDetailPreview').show();
    });
    
    
});
// The End