document.addEventListener('DOMContentLoaded', function() {
    const numberNameEmail = document.getElementById('numberNameEmail');
    const password = document.getElementById('password');
    const facebookIcon = document.getElementById('facebookIcon');
    const googleIcon = document.getElementById('googleIcon');
    const appleIcon = document.getElementById('appleIcon');
    const loginButton = document.getElementById('loginButton');


    facebookIcon.onclick = function() {
        window.location.href = 'https://www.facebook.com';
    }
    
    googleIcon.onclick = function() {
        window.location.href = 'https://www.google.com';
    }

    appleIcon.onclick = function() {
        window.location.href = 'https://www.apple.com';
    }

    numberNameEmail.addEventListener("input", function() {
        if (numberNameEmail.value.length > 0 &&  password.value.length > 0) {
            loginButton.style.backgroundColor = '#347aeb';
            loginButton.style.cursor = 'pointer';
        }
        else {
            loginButton.style.backgroundColor =  '#82bbf5';
            loginButton.style.cursor = 'initial';
        }

    })

    password.addEventListener("input", function() {
        if (numberNameEmail.value.length > 0 &&  password.value.length > 0) {
            loginButton.style.backgroundColor = '#347aeb';
            loginButton.style.cursor = 'pointer';
        }
        else {
            loginButton.style.backgroundColor =  '#82bbf5';
            loginButton.style.cursor = 'initial';
        }

    })
});
