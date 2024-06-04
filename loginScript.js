document.addEventListener('DOMContentLoaded', function() {
    const numberNameEmail = document.getElementById('numberNameEmail');
    const password = document.getElementById('password');
    const facebookIcon = document.getElementById('facebookIcon');
    const googleIcon = document.getElementById('googleIcon');
    const appleIcon = document.getElementById('appleIcon');
    const loginButton = document.getElementById('loginButton');
    const togglePassword = document.getElementById('togglePassword');
    const userContainerInfo = document.getElementById('userContainerInfo');
    const passwordContainerInfo = document.getElementById('passwordContainerInfo');
    const language = document.getElementById("language");
    const languageList = document.getElementById("languageList");
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

    numberNameEmail.addEventListener("input", function() {
        if(numberNameEmail.value.length > 0) {
            userContainerInfo.style.display = 'inline-block';
            numberNameEmail.style.paddingTop = '8.5px';

        }
        else {
            userContainerInfo.style.display = 'none';
            numberNameEmail.style.paddingTop = '6px';
        }

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
        if (numberNameEmail.value.length > 0 &&  password.value.length > 0) {
            loginButton.style.backgroundColor = '#347aeb';
            loginButton.style.cursor = 'pointer';
        }
        else {
            loginButton.style.backgroundColor =  '#82bbf5';
            loginButton.style.cursor = 'initial';
        }

    })

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


    setLanguage = function (lang) {
        language.innerText = lang;

    }

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
