$(document).ready(function () {
    // sidenav
    $('.sidenav').sidenav();

    // slider
    $('.slider').slider({
        indicators: false,
        duration: 200,
        interval: 2000
    });
    // carousel
    $('#top-5-costs.carousel').carousel({
        shift: -80
    })

    $('#top-5-time-left.carousel').carousel({
        noWrap: true
    })

    $('#top-5-votes.carousel').carousel({
        dist: 0
    })
})
