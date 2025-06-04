$(document).ready(() => {
    const scene = document.getElementById('scene');
    const parallax = new Parallax(scene);


    function takeUserToHomePage() {
        window.location.href = 'https://project-megagram.com/';
    }

    
    window.takeUserToHomePage = takeUserToHomePage;
})