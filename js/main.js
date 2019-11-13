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
        shift: -80
    })

    $('#top-5-votes.carousel').carousel({
        shift: -80
    })
    // dropdown
    $(".dropdown-trigger").dropdown({
        hover: true,
        coverTrigger: false,
    });

    $('.dropdown-button2').dropdown({
        hover: true,
        coverTrigger: false
    });
})
