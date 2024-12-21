var scene = document.getElementById('scene');
var parallax = new Parallax(scene);

const takeUserToHomePage = function() {
    window.location.href = "http://localhost:3100";
}

window.takeUserToHomePage = takeUserToHomePage;
