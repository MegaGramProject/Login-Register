import { DEEP_TRANSLATE_API_KEY, GOOGLE_RECAPTCHA_SECRET } from './config.js';

$(document).ready(function() {
    /*
        at the bottom of this function will be a function
        called 'toBeExecutedWhenDocumentIsReady()',
        which contains all the code to be executed when
        document is ready
    */
    const numberNameEmail = $('#numberNameEmail');
    const password = $('#password');
    const loginButton = $('#loginButton');
    const togglePassword = $('#togglePassword');
    const passwordContainerInfo = $('#passwordContainerInfo');
    const loginPhotos = $(".slide").get();
    const signupLink = $('#signupLink');
    const errorMessage = $('#errorMessage');
    const recaptchaErrorMessage = $('#recaptchaErrorMessage');
    const bcrypt = dcodeIO.bcrypt; //this is used for hashing the user-inputted password
    let recaptchaIsVerified = false;
    let slideIdx = 0;
    let currLanguage = "en";

    const loginUser = async function() {
        if (isValidEmail(numberNameEmail.val()) || isValidNumber(numberNameEmail.val())) {
            const userVerifyURL = "http://localhost:8001/doesUserExist";
            const postOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "contact_info": numberNameEmail.val()
                })
            };
            
            try {
                const response = await fetch(userVerifyURL, postOptions);
                const data = await response.json();
                const salt = data['salt'];
                
                if (typeof salt === 'undefined') {
                    errorMessage.css('display', '');
                    errorMessage.text("User not found");
                }
                else {
                    const hashedPassword = data['hashedPassword'];
                    if (bcrypt.hashSync(password.val(), salt) === hashedPassword) {
                        errorMessage.css('display', 'none');
                        postOptions.body = JSON.stringify(
                            {
                            "username": data['username']
                            }
                        );

                        postOptions.credentials = 'include';
                        const tokenResponse = await fetch('http://localhost:8003/cookies/getTokensAfterLogin', postOptions);
                        if (!tokenResponse.ok) {
                            errorMessage.css('display', '');
                            errorMessage.text("Your info is correct, but the server is having problems logging you in right now.");
                        }

                        const responseData = await tokenResponse.text();
                        if (responseData === "Cookies set successfully") {
                            window.location.href = "http://localhost:3100/" + data['username'];
                        }
                        else {
                            errorMessage.css('display', '');
                            errorMessage.text("Your info is correct, but the server is having problems logging you in right now.");
                        }
                    }
                    else {
                        errorMessage.css('display', '');
                        errorMessage.text("Incorrect password");
                    }
                }
            }
            catch (error) {
                errorMessage.css('display', '');
                errorMessage.text("Trouble connecting to the server");
            }
        }
        else {
            const userVerifyURL = "http://localhost:8001/doesUserExist";
            const postOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "username": numberNameEmail.val()
                })
            };
    
            try {
                const response = await fetch(userVerifyURL, postOptions);
                const data = await response.json();
                const salt = data['salt'];
    
                if (typeof salt === 'undefined') {
                    errorMessage.css('display', '');
                    errorMessage.text("User not found");
                }
                else {
                    const hashedPassword = data['hashedPassword'];
                    if (bcrypt.hashSync(password.val(), salt) === hashedPassword) {
                        errorMessage.css('display', 'none');
                        postOptions.body = JSON.stringify(
                            {
                                "username": numberNameEmail.val()
                            }
                        );
                        postOptions.credentials = 'include';
    
                        const tokenResponse = await fetch('http://localhost:8003/cookies/getTokensAfterLogin', postOptions);
                        if (!tokenResponse.ok) {
                            errorMessage.css('display', '');
                            errorMessage.text("Your info is correct, but the server is having problems logging you in right now.");
                        }
                        const responseData = await tokenResponse.text();
                        if (responseData === "Cookies set successfully") {
                            window.location.href = "http://localhost:3100/" + data['username'];
                        }
                        else {
                            errorMessage.css('display', '');
                            errorMessage.text("Your info is correct, but the server is having problems logging you in right now.");
                        }
                    }
                    else {
                        errorMessage.css('display', '');
                        errorMessage.text("Incorrect password");
                    }
                }
            } catch (error) {
                errorMessage.css('display', '');
                errorMessage.text("Trouble connecting to the server");
            }
        }
    }

    signupLink.on("click", function() {
        let currentLanguageLongForm;
        if (currLanguage==="en") {
            window.location.href = "http://localhost:8000/signup";
            return;
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
        else if(currLanguage==="zh-CN"){
            currentLanguageLongForm = "中国人";
        }
        else if(currLanguage==="ar") {
            currentLanguageLongForm = "العربية";
        }
        else if(currLanguage==="de") {
            currentLanguageLongForm = "Deutsch";
        }
        else if(currLanguage==="id") {
            currentLanguageLongForm = "Bahasa Indonesia";
        }
        else if(currLanguage==="it"){
            currentLanguageLongForm = "Italiano";
        }
        else if(currLanguage==="ja") {
            currentLanguageLongForm = "日本語";
        }
        else if(currLanguage==="ru") {
            currentLanguageLongForm = "Русский";
        }
        window.location.href = `http://localhost:8000/signup?language=${currentLanguageLongForm}`;
    });

    const setLanguage = function (lang) {
        return;
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
        else if(lang==="العربية") {
            newLanguage = "ar";
        }
        else if(lang==="Deutsch") {
            newLanguage = "de";
        }
        else if(lang==="Bahasa Indonesia") {
            newLanguage = "id";
        }
        else if(lang==="Italiano"){
            newLanguage = "it";
        }
        else if(lang==="日本語") {
            newLanguage = "ja";
        }
        else {
            newLanguage = "ru";
        }
        if (!currLanguage) {
            currLanguage = "en";
        }
        if (currLanguage === newLanguage) {
            return;
        }

        const apiUrl = "https://deep-translate1.p.rapidapi.com/language/translate/v2";
        const data = {
            q: "",
            source: "",
            target: ""
        };
        data["source"] = currLanguage;
        data["target"] = newLanguage;
        const options = {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'x-rapidapi-host': 'deep-translate1.p.rapidapi.com',
            'x-rapidapi-key': DEEP_TRANSLATE_API_KEY
            },
            body: null
        };
        const allElements = document.querySelectorAll('*');
        const elementsText = [];
        allElements.forEach(element => {
            const text = element.innerText.trim();
            if (text !== '' && (element.tagName.toLowerCase()==="p" || element.tagName.toLowerCase()==="footer" ||
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

        data["q"] = numberNameEmail.attr('placeholder');
        options.body = JSON.stringify(data);
        fetch(apiUrl, options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        }).then(data => {
            numberNameEmail.attr('placeholder', data['data']['translations']['translatedText']);
        }).catch(error => {
            console.error('Error:', error);
        });

        data["q"] = password.attr('placeholder');
        options.body = JSON.stringify(data);
        fetch(apiUrl, options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        }).then(data => {
            password.attr('placeholder', data['data']['translations']['translatedText']);
        }).catch(error => {
            console.error('Error:', error);
        });

        currLanguage = newLanguage;
    }

    const isValidEmail = function (email) {
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

    const isValidNumber = function (phoneNumberInput) {
        const phoneRegex = /^\d{8,17}$/;
        return phoneRegex.test(phoneNumberInput);
    };

    const usernameIsValid = function(usernameInput) {
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

    numberNameEmail.on('input', function () {
        if(numberNameEmail.val().length > 0) {
            $('#userContainerInfo').css('display', '');
            numberNameEmail.css('padding-top', '8.5px');

        }
        else {
            $('#userContainerInfo').css('display', 'none');
            numberNameEmail.css('padding-top', '6px');
        }

        checkIfReadyToLogin();
    });

    password.on("input", function() {
        if (password.val().length > 0) {
            togglePassword.css('display', '');
            passwordContainerInfo.css('display', '');
            password.css('padding-top', '8.5px');
        }
        else {
            togglePassword.css('display', 'none');
            passwordContainerInfo.css('display', 'none');
            password.css('padding-top', '6px');
        }

        checkIfReadyToLogin();
    });

    const checkIfReadyToLogin = function() {
        if ((isValidEmail(numberNameEmail.val()) || isValidNumber(numberNameEmail.val()) || usernameIsValid(numberNameEmail.val()))
        &&  password.val().length > 0 && recaptchaIsVerified) {
            loginButton.css('background-color', '#347aeb');
            loginButton.css('cursor', 'pointer');
            loginButton.on("click", loginUser);
        }
        else {
            loginButton.css('background-color', '#82bbf5');
            loginButton.css('cursor', '');
            loginButton.on("click", null);
        }
    }

    togglePassword.on("click", function() {
        if (password.attr('type') === "password") {
            password.attr('type', 'text');
            togglePassword.text('Hide');
        } else {
            password.attr('type', 'password');
            togglePassword.text('Show');
        }
    });
    
    const displayFirstLoginPhoto = function() {
        let incrementOpacity = function() {
            const currOpacity = parseFloat(loginPhotos[slideIdx].style.opacity);
            if (currOpacity < 1) {
                loginPhotos[slideIdx].style.opacity = (currOpacity + 0.01).toString();
                setTimeout(incrementOpacity, 50);
            }
            else {
                setInterval(displayLoginPhotos, 4500);
            }
        };
    
        incrementOpacity();
    }


    const displayLoginPhotos = function() {
        const currentPhoto = loginPhotos[slideIdx];
        if (slideIdx==3) {
            slideIdx=0;
        }
        else{
            slideIdx++;
        }

        const newPhoto = loginPhotos[slideIdx];
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


    const onSubmittingRecaptchaResults = function(token)  {
        const options = {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'secret': GOOGLE_RECAPTCHA_SECRET,
                'response': token
            })
        };

        fetch("http://localhost:8001/verifyCaptcha", options)
        .then(response => {
            if (!response.ok) {
                recaptchaErrorMessage.css('display', '');
                recaptchaErrorMessage.text('The server could not assess the results of your test');
            }
            return response.json();
        }).then(data => {
            if (data["verified"]==true) {
                recaptchaErrorMessage.css('display', 'none');
                recaptchaIsVerified = true;
                checkIfReadyToLogin();
            }
            else {
                recaptchaErrorMessage.css('display', '');
                recaptchaErrorMessage.text('You did not pass the test');
            }
        }).catch(_ => {
            recaptchaErrorMessage.css('display', '');
            recaptchaErrorMessage.text('Trouble connecting to the server to assess the results of your test');
        });
    }

    window.setLanguage = setLanguage;
    window.onSubmittingRecaptchaResults = onSubmittingRecaptchaResults;

    function toBeExecutedWhenDocumentIsReady() {
        setTimeout(function() {
            $('#loadingScreen').css('display', 'none');
            $('#loginScreen').css('display', '');
        }, 740);
        displayFirstLoginPhoto();

        const queryString = window.location.search.substring(1);
        const params = new URLSearchParams(queryString);
        let lingo = params.get("language");
        if (lingo) {
            setLanguage(lingo);
        }
    }
    toBeExecutedWhenDocumentIsReady();

});