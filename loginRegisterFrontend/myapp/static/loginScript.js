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
    const loginPhotos = document.getElementsByClassName("slide");
    let slideIdx = 0;
    const lang = document.getElementById("lang");
    let currLanguage = "en";
    const apiUrl = "https://deep-translate1.p.rapidapi.com/language/translate/v2";
    const data = {"q":"","source":"","target":""};
    const options = {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-host': 'deep-translate1.p.rapidapi.com',
        'x-rapidapi-key': '14da2e3b7emsh5cd3496c28a4400p16208cjsn947339fe37a4'
        },
        body: null
    };


    facebookIcon.onclick = function() {
        window.location.href = 'https://www.facebook.com';
    }
    
    googleIcon.onclick = function() {
        window.location.href = 'https://www.google.com';
    }

    appleIcon.onclick = function() {
        window.location.href = 'https://www.apple.com';
    }

    isValidEmail = function (email) {
        let atIndex = email.indexOf('@');
        if (atIndex < 1 || email.indexOf('@', atIndex + 1) !== -1) {
            return false;
        }
        let localPart = email.substring(0, atIndex);
        let domainPart = email.substring(atIndex + 1);
        if (localPart.length === 0 || localPart.length > 64) {
            return false;
        }
    
        if (domainPart.length === 0 || domainPart.length > 255) {
            return false;
        }
        let dotIndex = domainPart.indexOf('.');
        if (dotIndex < 1 || dotIndex === domainPart.length - 1) {
            return false;
        }
        let domainLabels = domainPart.split('.');
        for (let label of domainLabels) {
            if (label.length === 0 || label.length > 63) {
                return false;
            }
        }
        return true;
    }

    isValidNumber = function(phoneNumberInput) {
        if (phoneNumberInput.length !== 10) {
            return false;
        }
    
        for (let i = 0; i < phoneNumberInput.length; i++) {
            if (isNaN(phoneNumberInput[i])) {
                return false;
            }
        }
    
        return true;
    }

    usernameIsValid = function(usernameInput) {
        if (usernameInput.length > 30 || usernameInput.length < 1) {
            return false;
        }
    
        for (let i = 0; i < usernameInput.length; i++) {
            let char = usernameInput[i];
            if (!(char >= 'A' && char <= 'Z') && !(char >= 'a' && char <= 'z') && 
                !(char >= '0' && char <= '9') && char !== '.' && char!="_") {
                return false;
            }
        }
    
        return true;
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

        if ((isValidEmail(numberNameEmail.value) || isValidNumber(numberNameEmail.value) || usernameIsValid(numberNameEmail.value)) &&  password.value.length > 0) {
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
        if ((isValidEmail(numberNameEmail.value) || isValidNumber(numberNameEmail.value) || usernameIsValid(numberNameEmail.value)) &&  password.value.length > 0) {
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
        newLanguage = "";
        if (lang==="English"){
            newLanguage = "en";
        }
        else if(lang==="Español") {
            newLanguage = "es";
        }
        else if(lang==="Français") {
            newLanguage = "fr";
        }
        else if(lang==="हिंदी") {
            newLanguage = "hi";
        }
        else if(lang==="中国人") {
            newLanguage = "zh-CN";
        }
        else if(lang==="বাংলা"){
            newLanguage = "bn";
        }
        if (currLanguage === newLanguage) {
            return;
        }
        data["source"] = currLanguage;
        data["target"] = newLanguage;

        const allElements = document.querySelectorAll('*');
        language.innerText = lang;
        const elementsText = [];
        allElements.forEach(element => {
            const text = element.innerText.trim();
            if (text !== '' && (element.className !=="lang" && element.id!=="language") && (element.tagName.toLowerCase()==="p" || element.tagName.toLowerCase()==="footer" ||
            element.tagName.toLowerCase()==="input" || element.tagName.toLowerCase()==="button") &&
            element.className!=="orLine" || element.tagName.toLowerCase()=="a") {
                for (let node of element.childNodes) {
                    if (node.nodeType === Node.TEXT_NODE) {
                        data["q"] = node.textContent;
                        options.body = JSON.stringify(data);
                        fetch(apiUrl, options)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.json();
                        }).then(data => {
                            node.textContent = data['data']['translations']['translatedText'];
                        }).catch(error => {
                            console.error('Error:', error);
                        });
                    }
                }
            }
        });

        data["q"] = numberNameEmail.placeholder;
        options.body = JSON.stringify(data);
        fetch(apiUrl, options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        }).then(data => {
            numberNameEmail.placeholder = data['data']['translations']['translatedText'];
        }).catch(error => {
            console.error('Error:', error);
        });

        data["q"] = password.placeholder;
        options.body = JSON.stringify(data);
        fetch(apiUrl, options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        }).then(data => {
            password.placeholder = data['data']['translations']['translatedText'];
        }).catch(error => {
            console.error('Error:', error);
        });

        currLanguage = newLanguage;

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

    
    displayFirstLoginPhoto = function() {
        loginPhotos[slideIdx].style.display = "inline-block";
        loginPhotos[slideIdx].style.opacity = "0";
        
        let incrementOpacity = function() {
            if (parseFloat(loginPhotos[slideIdx].style.opacity) < 1) {
                loginPhotos[slideIdx].style.opacity = (parseFloat(loginPhotos[slideIdx].style.opacity) + 0.01).toString();
                setTimeout(incrementOpacity, 30);
            }
        };
    
        incrementOpacity();
    }
    

    displayFirstLoginPhoto();


    displayLoginPhotos = function() {
        currentPhoto = loginPhotos[slideIdx];
        if (slideIdx==3) {
            slideIdx=0;
        }
        else{
            slideIdx++;
        }
        newPhoto = loginPhotos[slideIdx];
        newPhoto.style.display = "inline";
        newPhoto.style.opacity = "0";
        let enableTransition = function() {
            if (parseFloat(newPhoto.style.opacity) < 1) {
                newPhoto.style.opacity = (parseFloat(newPhoto.style.opacity) + 0.01).toString();
                currentPhoto.style.opacity = (parseFloat(currentPhoto.style.opacity) - 0.01).toString();
                setTimeout(enableTransition, 30);
            }
        };
        enableTransition();

    }
    
    setInterval(displayLoginPhotos, 4500);



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