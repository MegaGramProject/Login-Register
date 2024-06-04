document.addEventListener('DOMContentLoaded', function() {
    const numberEmail = document.getElementById('numberEmail');
    const fullName = document.getElementById('fullName');
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    const facebookIcon = document.getElementById('facebookIcon');
    const googleIcon = document.getElementById('googleIcon');
    const appleIcon = document.getElementById('appleIcon');
    const signupButton = document.getElementById('signupButton');
    const togglePassword = document.getElementById('togglePassword');
    const numberEmailContainerInfo =  document.getElementById('numberEmailContainerInfo');
    const fullNameContainerInfo = document.getElementById('fullNameContainerInfo');
    const appleDropdown = document.getElementById("appleDropdown");
    const androidDropdown = document.getElementById("androidDropdown");
    const windowsDropdown = document.getElementById("windowsDropdown");
    const appleDevices = document.getElementById("appleDevices");
    const androidDevices = document.getElementById("androidDevices");
    const windowsDevices = document.getElementById("windowsDevices");

    


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
        if (numberEmail.value.length > 0) {
            numberEmailContainerInfo.style.display = 'inline-block';
            numberEmail.style.paddingTop = '8.5px';

        }
        else {
            numberEmailContainerInfo.style.display = 'none';
            numberEmail.style.paddingTop = '6px';
        }
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
        if (fullName.value.length > 0) {
            fullNameContainerInfo.style.display = 'inline-block';
            fullName.style.paddingTop = '8.5px';

        }
        else {
            fullNameContainerInfo.style.display = 'none';
            fullName.style.paddingTop = '6px';
        }
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
        if (username.value.length > 0) {
            usernameContainerInfo.style.display = 'inline-block';
            username.style.paddingTop = '8.5px';

        }
        else {
            usernameContainerInfo.style.display = 'none';
            username.style.paddingTop = '6px';
        }
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
        if (password.value.length > 0) {
            togglePassword.style.display = 'inline-block';
            passwordContainerInfo.style.display = 'inline-block';
            password.style.paddingTop = '8.5px';
        }
        else {
            togglePassword.style.display = 'none';
            passwordContainerInfo.style.display = 'none';
            password.style.paddingTop = '6px';
        }
        if (numberEmail.value.length > 0 &&  fullName.value.length > 0 && username.value.length > 0 && password.value.length > 0) {
            signupButton.style.backgroundColor = '#347aeb';
            signupButton.style.cursor = 'pointer';
        }
        else {
            signupButton.style.backgroundColor =  '#82bbf5';
            signupButton.style.cursor = 'initial';
        }

    })

    setLanguage = function (lang) {
        language.innerText = lang;

    }

    togglePassword.addEventListener("click", function(event) {
        event.preventDefault();
        if (password.type === "password") {
            password.type = "text";
            togglePassword.textContent = 'Hide';
        } else {
            password.type = "password";
            togglePassword.textContent = 'Show';
        }
    })

    appleDropdown.addEventListener("click", function(event) {
        event.stopPropagation();
        appleDevices.style.display = 'inline-block';
    });

    androidDropdown.addEventListener("click", function(event) {
        event.stopPropagation();
        androidDevices.style.display = 'inline-block';
    });

    windowsDropdown.addEventListener("click", function(event) {
        event.stopPropagation();
        windowsDevices.style.display = 'inline-block';
    });

    document.addEventListener('click', function (event) {
        if (!appleDevices.contains(event.target) && appleDevices.style.display !== 'none') {
            appleDevices.style.display = 'none';
        }
        if (!androidDevices.contains(event.target) && androidDevices.style.display !== 'none') {
            androidDevices.style.display = 'none';
        }
        if (!windowsDevices.contains(event.target) && windowsDevices.style.display !== 'none') {
            windowsDevices.style.display = 'none';
        }  });

});
