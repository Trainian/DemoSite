/* Burger Menu */

$('.menu div').on('click', () => {
    $('.menu nav ul').toggleClass('open');
    $('.menu div span').toggleClass('active');
});

$('.cards .box').on('mouseover', () => {
    $('.box .box__hide_color').toggleClass('box__hide_unhide');
})