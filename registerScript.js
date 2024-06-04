document.addEventListener('DOMContentLoaded', function() {
    const numberEmail = document.getElementById('numberEmail');
    const fullName = document.getElementById('fullName');
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    const facebookIcon = document.getElementById('facebookIcon');
    const googleIcon = document.getElementById('googleIcon');
    const appleIcon = document.getElementById('appleIcon');
    const signupButton = document.getElementById('signupButton');


    facebookIcon.onclick = function() {
        window.location.href = 'https://www.facebook.com';
    }
    
    googleIcon.onclick = function() {
        window.location.href = 'https://www.google.com';
    }

    appleIcon.onclick = function() {
        window.location.href = 'https://www.apple.com';
    }

    numberEmail.addEventListener("input", function() {
        if (numberEmail.value.length > 0 &&  fullName.value.length > 0 && username.value.length > 0 && password.value.length > 0) {
            signupButton.style.backgroundColor = '#347aeb';
            signupButton.style.cursor = 'pointer';
        }
        else {
            signupButton.style.backgroundColor =  '#82bbf5';
            signupButton.style.cursor = 'initial';
        }

    })

    fullName.addEventListener("input", function() {
        if (numberEmail.value.length > 0 &&  fullName.value.length > 0 && username.value.length > 0 && password.value.length > 0) {
            signupButton.style.backgroundColor = '#347aeb';
            signupButton.style.cursor = 'pointer';
        }
        else {
            signupButton.style.backgroundColor =  '#82bbf5';
            signupButton.style.cursor = 'initial';
        }

    })

    username.addEventListener("input", function() {
        if (numberEmail.value.length > 0 &&  fullName.value.length > 0 && username.value.length > 0 && password.value.length > 0) {
            signupButton.style.backgroundColor = '#347aeb';
            signupButton.style.cursor = 'pointer';
        }
        else {
            signupButton.style.backgroundColor =  '#82bbf5';
            signupButton.style.cursor = 'initial';
        }

    })

    password.addEventListener("input", function() {
        if (numberEmail.value.length > 0 &&  fullName.value.length > 0 && username.value.length > 0 && password.value.length > 0) {
            signupButton.style.backgroundColor = '#347aeb';
            signupButton.style.cursor = 'pointer';
        }
        else {
            signupButton.style.backgroundColor =  '#82bbf5';
            signupButton.style.cursor = 'initial';
        }

    })
});
