//
$(document).ready(function () {
    $("#fullpage").fullpage({
        verticalCentered: false,
        scrollingSpeed: 600,
        autoScrolling: false,
        fitToSection: false,
        scrollBar: true,
        css3: true,
        navigation: true,
        navigationPosition: "right",
    });
});

// wow
$(function () {
    new WOW().init();
    $(".rotate").textrotator();
});
