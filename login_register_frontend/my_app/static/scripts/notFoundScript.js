$(document).ready(() => {
    const scene = document.getElementById('scene');
    const parallax = new Parallax(scene);

    const takeUserToHomePage = function() {
        window.location.href = 'http://34.111.89.101/homefeed';
    }

    window.takeUserToHomePage = takeUserToHomePage;
})