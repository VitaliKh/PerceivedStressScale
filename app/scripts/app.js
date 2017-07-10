/*global define */
define(['jquery', 'jqueryMobile'], function ($) {
    'use strict';

    // initialize components
    $(function(){
        $( "[data-role='navbar']" ).navbar();
        $( "[data-role='header'], [data-role='footer']" ).toolbar();
        $("[data-role='panel']").panel();
        $("[data-role='listview']").listview();
    });

    // Questionnaire handler and some validation check
    $('#getResult').on('click', function() {
        var value = 0;
        var textResult = '';

        var q10Value = $('input[name="q10"]:checked').val();
        if(q10Value == undefined) {
            $('#popupCheck').popup('open', {transition: "slidedown", positionTo: "window"});
            setTimeout(function() {
                $('#popupCheck').popup('close');
            }, 2000);
            return;
        }

        $('input[type="radio"]:checked').each(function(index, element) {

            value += +($(element).val());
        });

        if (value >= 0 && value <= 13) {
            textResult = "Your score is " + value + ".<br><br>Scores ranging from 0-13 are considered low stress.<br><br>" +
                "You are subject to low perceived stress category.";
        } else if (value >= 14 && value <= 26) {
            textResult = "Your score is " + value + ".<br><br>Scores ranging from 14-26 are considered moderate stress.<br><br>" +
                "You are subject to moderate perceived stress category.";
        } else {
            textResult = "Your score is " + value + ".<br><br>Scores ranging from 27-40 are considered high perceived stress.<br><br>" +
                "You are subject to high perceived stress category.";
        }

        $('#popupResult').append(textResult).popup('open', {transition: "pop", positionTo: "window"}).on( "popupafterclose", function() {
            $( "body" ).pagecontainer( "change", "index.html");
            location.reload();
        } );

    });


    // Questionnaire navigation
    $('input[type="radio"]').on('click', function() {

        var selector = $( "body" );
        var next = selector.pagecontainer( "getActivePage" ).next();
        if (selector.pagecontainer( "getActivePage" ).attr('id') == 'q10' ) return;
        selector.pagecontainer('change', next, {transition: "slide"});
    });


    // reload when click home
    $('a [href="#home"]').on('click', function() {
        location.reload();
    });
});



