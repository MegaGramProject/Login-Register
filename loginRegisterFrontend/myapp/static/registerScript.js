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
    const checkmark1 = document.getElementById("checkmark1");
    const wrong1 = document.getElementById("wrong1");
    const checkmark2 = document.getElementById("checkmark2");
    const wrong2 = document.getElementById("wrong2");
    const checkmark3 = document.getElementById("checkmark3");
    const wrong3 = document.getElementById("wrong3");
    const checkmark4 = document.getElementById("checkmark4");
    const wrong4 = document.getElementById("wrong4");
    const passwordStrength = document.getElementById("passwordStrength");
    const passwordStrengthContainer = document.getElementById("passwordStrengthContainer");
    const usernameSuggestion1 = document.getElementById("usernameSuggestion1");
    const usernameSuggestion2 = document.getElementById("usernameSuggestion2");
    const usernameSuggestions = document.getElementById("usernameSuggestions");
    let currentInput;
    const language = document.getElementById("language");
    const lang = document.getElementById("lang");
    const loginText = document.getElementById("loginText");
    let currLanguage;
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

    loginText.addEventListener("click", function() {
        let currentLanguageLongForm;
        if (currLanguage==="en") {
            currentLanguageLongForm = "English";
        }
        else if (currLanguage==="es") {
            currentLanguageLongForm = "Español";
        }
        else if(currLanguage==="fr") {
            currentLanguageLongForm = "Français";
        }
        else if(currLanguage==="hi") {
            currentLanguageLongForm = "हिंदी";
        }
        else if(currLanguage==="bn") {
            currentLanguageLongForm = "বাংলা";
        }
        else {
            currentLanguageLongForm = "中国人";
        }
        window.location.href = "http://localhost:8000/login?language=" + currentLanguageLongForm;

    });


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
        currentInput = numberEmail;
        wrong1.style.display = 'none';
        checkmark1.style.display = 'none';

        if (numberEmail.value.length > 0) {
            numberEmailContainerInfo.style.display = 'inline-block';
            numberEmail.style.paddingTop = '8.5px';

        }
        else {
            numberEmailContainerInfo.style.display = 'none';
            numberEmail.style.paddingTop = '6px';
        }
        if (checkNumberEmail(numberEmail.value) && fullNameIsValid(fullName.value) && usernameIsValid(username.value) && getPasswordValidity(password.value) > 0.65){
            signupButton.style.backgroundColor = '#347aeb';
            signupButton.style.cursor = 'pointer';
            signupButton.onclick = takeUserToBday;
        }
        else {
            signupButton.style.backgroundColor =  '#82bbf5';
            signupButton.style.cursor = 'initial';
            signupButton.onclick = null;
        }

    

    })

    fullName.addEventListener("input", function() {
        currentInput = fullName;
        wrong2.style.display = 'none';
        checkmark2.style.display = 'none';
        if (fullName.value.length > 0) {
            fullNameContainerInfo.style.display = 'inline-block';
            fullName.style.paddingTop = '8.5px';

        }
        else {
            fullNameContainerInfo.style.display = 'none';
            fullName.style.paddingTop = '6px';
        }
        if (checkNumberEmail(numberEmail.value) && fullNameIsValid(fullName.value) && usernameIsValid(username.value) && getPasswordValidity(password.value) > 0.65){
            signupButton.style.backgroundColor = '#347aeb';
            signupButton.style.cursor = 'pointer';
            signupButton.onclick = takeUserToBday;
        }
        else {
            signupButton.style.backgroundColor =  '#82bbf5';
            signupButton.style.cursor = 'initial';
            signupButton.onclick = null;
        }

    })

    username.addEventListener("input", function() {
        currentInput = username;
        wrong3.style.display = 'none';
        checkmark3.style.display = 'none';
        if(usernameSuggestions.style.display = 'none' && fullNameIsValid(fullName.value)) {
            usernameSuggestions.style.display = 'inline-block';
            usernameSuggestion1.innerText = fullName.value + '123';
            usernameSuggestion2.innerText = fullName.value + '.__';
        }
        if (username.value.length > 0) {
            usernameContainerInfo.style.display = 'inline-block';
            username.style.paddingTop = '8.5px';

        }
        else {
            usernameContainerInfo.style.display = 'none';
            username.style.paddingTop = '6px';
        }
        if (checkNumberEmail(numberEmail.value) && fullNameIsValid(fullName.value) && usernameIsValid(username.value) && getPasswordValidity(password.value) > 0.65){
            signupButton.style.backgroundColor = '#347aeb';
            signupButton.style.cursor = 'pointer';
            signupButton.onclick = takeUserToBday;
        }
        else {
            signupButton.style.backgroundColor =  '#82bbf5';
            signupButton.style.cursor = 'initial';
            signupButton.onclick = null;
        }


    })

    password.addEventListener("input", function() {
        currentInput = password;
        wrong4.style.display = 'none';
        checkmark4.style.display = 'none';
        passwordStrengthContainer.style.display = 'inline-block';
        passwordScore = getPasswordValidity(password.value);
        newPasswordStrengthWidth = (passwordScore/1 * 300).toString();
        if(passwordScore < 0.15) {
            passwordStrength.style.backgroundColor = 'red';
        }
        else if(passwordScore < 0.3) {
            passwordStrength.style.backgroundColor = 'orange';
        }
        else if(passwordScore < 0.45) {
            passwordStrength.style.backgroundColor = 'gold';
        }
        else if(passwordScore < 0.55) {
            passwordStrength.style.backgroundColor = 'yellow';
        }
        else if(passwordScore < 0.65){
            passwordStrength.style.backgroundColor = 'lightgreen';
        }
        else if(passwordScore < 0.75) {
            passwordStrength.style.backgroundColor = 'green';
        }
        else {
            passwordStrength.style.backgroundColor = 'darkgreen';
        }
        passwordStrength.style.width = newPasswordStrengthWidth + 'px';
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
        if (checkNumberEmail(numberEmail.value) && fullNameIsValid(fullName.value) && usernameIsValid(username.value) && passwordScore > 0.65){
            signupButton.style.backgroundColor = '#347aeb';
            signupButton.style.cursor = 'pointer';
            signupButton.onclick = takeUserToBday;
        }
        else {
            signupButton.style.backgroundColor =  '#82bbf5';
            signupButton.style.cursor = 'initial';
            signupButton.onclick = null;
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
        else {
            return;
        }
        if (currLanguage === newLanguage) {
            return;
        }
        if (!currLanguage) {
            currLanguage = "en";
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

        data["q"] = numberEmail.placeholder;
        options.body = JSON.stringify(data);
        fetch(apiUrl, options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        }).then(data => {
            numberEmail.placeholder = data['data']['translations']['translatedText'];
        }).catch(error => {
            console.error('Error:', error);
        });

        data["q"] = fullName.placeholder;
        options.body = JSON.stringify(data);
        fetch(apiUrl, options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        }).then(data => {
            fullName.placeholder = data['data']['translations']['translatedText'];
        }).catch(error => {
            console.error('Error:', error);
        });

        data["q"] = username.placeholder;
        options.body = JSON.stringify(data);
        fetch(apiUrl, options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        }).then(data => {
            username.placeholder = data['data']['translations']['translatedText'];
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

    const queryString = window.location.search.substring(1);
    const params = new URLSearchParams(queryString);
    let lingo = params.get("language");
    console.log(lingo);
    if (lingo) {
        setLanguage(lingo);
    } else {
        setLanguage("English");
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

    checkNumberEmail = function(numberEmailInput) {
        if (isValidEmail(numberEmailInput) || isValidNumber(numberEmailInput)) {
            return true;
        }
        return false;
    }

    fullNameIsValid = function(fullNameInput) {
        if(fullNameInput.length > 30) {
            return false;
        }
        if (fullNameInput.indexOf(' ') === -1) {
            return false;
        }
    
        for (let i = 0; i < fullNameInput.length; i++) {
            let char = fullNameInput[i];
            if (char !== ' ' && !(char >= 'A' && char <= 'Z') && !(char >= 'a' && char <= 'z')) {
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

    getPasswordValidity = function(passwordInput) {
        const lengthWeight = 0.6;
        const varietyWeight = 0.4;
        
        const lengthScore = Math.min(passwordInput.length / 20, 1);
        
        let varietyScore = 0;
        if (/[a-z]/.test(passwordInput)) varietyScore += 0.25;
        if (/[A-Z]/.test(passwordInput)) varietyScore += 0.25;
        if (/[0-9]/.test(passwordInput)) varietyScore += 0.25;
        if (/[^a-zA-Z0-9]/.test(passwordInput)) varietyScore += 0.25;
    
        const strengthScore = (lengthWeight * lengthScore) + (varietyWeight * varietyScore);
    
        return strengthScore;
        }

    usernameSuggestion1.addEventListener('click', function(){
        username.value = usernameSuggestion1.innerText;
        usernameSuggestions.style.display = 'none';
    })

    usernameSuggestion2.addEventListener('click', function(){
        username.value = usernameSuggestion2.innerText;
        usernameSuggestions.style.display = 'none';
    })


    takeUserToBday = function() {
        let currentLanguageLongForm;
        if (currLanguage==="en") {
            currentLanguageLongForm = "English";
        }
        else if (currLanguage==="es") {
            currentLanguageLongForm = "Español";
        }
        else if(currLanguage==="fr") {
            currentLanguageLongForm = "Français";
        }
        else if(currLanguage==="hi") {
            currentLanguageLongForm = "हिंदी";
        }
        else if(currLanguage==="bn") {
            currentLanguageLongForm = "বাংলা";
        }
        else {
            currentLanguageLongForm = "中国人";
        }
        if (isValidEmail(numberEmail.value)) {
            window.location.href = "http://localhost:8000/ageCheck?language=" + currentLanguageLongForm + "&email=" + numberEmail.value;
        }
        else {
            window.location.href = "http://localhost:8000/ageCheck?language=" + currentLanguageLongForm + "&number=" + numberEmail.value;
        }
    }
        

    document.addEventListener('click', function (event) {
        if (!appleDevices.contains(event.target) && appleDevices.style.display !== 'none') {
            appleDevices.style.display = 'none';
        }
        if (!androidDevices.contains(event.target) && androidDevices.style.display !== 'none') {
            androidDevices.style.display = 'none';
        }
        if (!windowsDevices.contains(event.target) && windowsDevices.style.display !== 'none') {
            windowsDevices.style.display = 'none';
        }
        if(currentInput===numberEmail && !numberEmail.contains(event.target)) {
            inputIsValid = checkNumberEmail(numberEmail.value);
            if (inputIsValid) {
                checkmark1.style.display = 'inline-block';
            }
            else {
                wrong1.style.display = 'inline-block';
            }
        }
        else if(currentInput===fullName && !fullName.contains(event.target)) {
            inputIsValid = fullNameIsValid(fullName.value);
            if (inputIsValid) {
                checkmark2.style.display = 'inline-block';
            }
            else {
                wrong2.style.display = 'inline-block';
            }
        }
        else if(currentInput===username && !username.contains(event.target)) {
            inputIsValid = usernameIsValid(username.value);
            if (inputIsValid) {
                checkmark3.style.display = 'inline-block';
                usernameSuggestions.style.display = 'none';
            }
            else {
                wrong3.style.display = 'inline-block';
            }
        }
        else if(currentInput==password && !password.contains(event.target)) {
            if (getPasswordValidity(password.value) > 0.65){
                checkmark4.style.display = 'inline-block';
            }
            else {
                wrong4.style.display = 'inline-block';
            }
        }
    });




});