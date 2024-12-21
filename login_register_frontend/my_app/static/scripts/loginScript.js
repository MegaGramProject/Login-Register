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
    const languageCodeToLongFormMappings = {
        en: "English",
        fr: "Français",
        es: "Español",
        hi: "हिंदी",
        bn: "বাংলা",
        "zh-CN": "中国人",
        ar: "العربية",
        de: "Deutsch",
        id: "Bahasa Indonesia",
        it: "Italiano",
        ja: "日本語",
        ru: "Русский"
    };
    

    const loginUser = async function() {
        const postOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (isValidEmail(numberNameEmail.val()) || isValidNumber(numberNameEmail.val())) {
            postOptions.body = JSON.stringify({
                "contact_info": numberNameEmail.val()
            });
        }
        else {
            postOptions.body = JSON.stringify({
                "username": numberNameEmail.val()
            });
        }

        try {
            const response = await fetch("http://localhost:8001/doesUserExist", postOptions);
            const data = await response.json();
            const salt = data['salt'];
            
            if (typeof salt === 'undefined') {
                errorMessage.css('display', 'inline-block');
                errorMessage.text("User not found");
            }
            else {
                const hashedPassword = data['hashed_password'];
                if (bcrypt.hashSync(password.val(), salt) === hashedPassword) {
                    errorMessage.css('display', 'none');
                    postOptions.body = JSON.stringify(
                        {
                        "username": data['username']
                        }
                    );
                    postOptions.credentials = 'include';
                    try {
                        const tokenResponse = await fetch('http://localhost:8003/cookies/getTokensAfterLogin', postOptions);
                        if (!tokenResponse.ok) {
                            errorMessage.css('display', 'inline-block');
                            errorMessage.text("Your info is correct, but the server is having problems logging you in.");
                            return;
                        }
                        const responseData = await tokenResponse.text();
                        if (responseData === "Cookies set successfully") {
                            window.location.href = "http://localhost:3100/" + data['username'];
                        }
                        else {
                            errorMessage.css('display', 'inline-block');
                            errorMessage.text("Your info is correct, but the server is having problems logging you in.");
                        }
                    }
                    catch (error) {
                        errorMessage.css('display', 'inline-block');
                        errorMessage.text("Your info is correct, but there's trouble connecting to the server for logging you in.");
                    }
                }
                else {
                    errorMessage.css('display', 'inline-block');
                    errorMessage.text("Incorrect password");
                }
            }
        }
        catch (error) {
            errorMessage.css('display', 'inline-block');
            errorMessage.text("Trouble connecting to the server to validate your details");
        }
    }

    signupLink.on("click", function() {
        let currentLanguageLongForm;
        if (currLanguage==="en") {
            window.location.href = "http://localhost:8000/signup";
            return;
        }
        else {
            currentLanguageLongForm = languageCodeToLongFormMappings[currLanguage];
        }
        window.location.href = `http://localhost:8000/signup?language=${currentLanguageLongForm}`;
    });

    const setLanguage = function (lang) {
        let newLanguage = "";
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
        allElements.forEach(element => {
            const text = element.innerText.trim();
            if (text !== '' && (element.tagName.toLowerCase()==="p" || element.tagName.toLowerCase()==="footer" ||
            element.tagName.toLowerCase()==="input" || element.tagName.toLowerCase()==="button" ||
            element.tagName.toLowerCase()=="a") && element.className!=="orLine") {
                for (let node of element.childNodes) {
                    if (node.nodeType === Node.TEXT_NODE) {
                        data["q"] = node.textContent;
                        options.body = JSON.stringify(data);
                        fetch(apiUrl, options)
                        .then(response => {
                            if (!response.ok) {
                                console.error(`The server had trouble translating the text: '${node.textContent}'`);
                                return;
                            }
                            return response.json();
                        }).then(data => {
                            if(typeof data !== 'undefined') {
                                node.textContent = data['data']['translations']['translatedText'];
                            }
                        }).catch(_ => {
                            console.error(`Trouble connecting to the server to translate the text: '${node.textContent}'`);
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
                console.error(`The server had trouble translating the text: '${numberNameEmail.attr('placeholder')}'`);
                return;
            }
            return response.json();
        }).then(data => {
            if(typeof data !=='undefined') {
                numberNameEmail.attr('placeholder', data['data']['translations']['translatedText']);
            }
        }).catch(_ => {
            console.error(`Trouble connecting to the server to translate the text: '${numberNameEmail.attr('placeholder')}'`);
        });

        data["q"] = password.attr('placeholder');
        options.body = JSON.stringify(data);
        fetch(apiUrl, options)
        .then(response => {
            if (!response.ok) {
                console.error(`The server had trouble translating the text: '${password.attr('placeholder')}'`);
                return;
            }
            return response.json();
        }).then(data => {
            if(typeof data !=='undefined') {
                password.attr('placeholder', data['data']['translations']['translatedText']);
            }
        }).catch(_ => {
            console.error(`Trouble connecting to the server to translate the text: '${password.attr('placeholder')}'`);
        });

        if(newLanguage==='en') {
            history.pushState(null, 'Login', 'http://localhost:8000/login');
        }
        else {
            history.pushState(null, 'Login', `http://localhost:8000/login?language=${languageCodeToLongFormMappings[newLanguage]}`);
        }
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
            $('#userContainerInfo').css('display', 'inline-block');
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
            togglePassword.css('display', 'inline-block');
            passwordContainerInfo.css('display', 'inline-block');
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
            loginButton.off("click");
            loginButton.on("click", loginUser);
        }
        else {
           updateUIBecauseUserIsNotReadyToLogin();
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
            const currOpacity = parseFloat(loginPhotos[0].style.opacity);
            if (currOpacity < 1) {
                loginPhotos[0].style.opacity = (currOpacity + 0.01).toString();
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
        currentPhoto.style.opacity = "1";

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
                recaptchaErrorMessage.css('display', 'inline-block');
                recaptchaErrorMessage.text('The server could not assess the results of your test');
                recaptchaIsVerified = false;
                updateUIBecauseUserIsNotReadyToLogin();
                return;
            }
            return response.json();
        }).then(data => {
            if(typeof data === 'undefined') {
                return;
            }
            if (data["verified"]==true) {
                recaptchaErrorMessage.css('display', 'none');
                recaptchaIsVerified = true;
                checkIfReadyToLogin();
            }
            else {
                recaptchaErrorMessage.css('display', 'inline-block');
                recaptchaErrorMessage.text('You did not pass the test');
                recaptchaIsVerified = false;
                updateUIBecauseUserIsNotReadyToLogin();
            }
        }).catch(_ => {
            recaptchaErrorMessage.css('display', 'inline-block');
            recaptchaErrorMessage.text('Trouble connecting to the server to assess the results of your test');
            recaptchaIsVerified = false;
            updateUIBecauseUserIsNotReadyToLogin();
        });
    }

    function updateUIBecauseUserIsNotReadyToLogin() {
        loginButton.css('background-color', '#82bbf5');
        loginButton.css('cursor', '');
        loginButton.off("click");
    }

    function onSigningInWithGoogle(googleUser) {
        //this code is executed after the user gets redirected.
        var profile = googleUser.getBasicProfile();
        console.log('ID: ' + profile.getId());
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail());
    }

    window.setLanguage = setLanguage;
    window.onSubmittingRecaptchaResults = onSubmittingRecaptchaResults;
    window.onSigningInWithGoogle = onSigningInWithGoogle;

    function toBeExecutedWhenDocumentIsReady() {
        setTimeout(() => {
            $('#loadingScreen').css('display', 'none');
            $('#loginScreen').css('display', 'inline-block');
        }, 740);
        displayFirstLoginPhoto();

        const queryString = window.location.search.substring(1);
        const params = new URLSearchParams(queryString);
        let lingo = params.get("language");
        if (lingo) {
            setLanguage(lingo);
        }

        /* The following code will be uncommented once this website runs on HTTPS.
        google.accounts.id.initialize({
            client_id: '43485011077-027qkbinu13lr1esvh85v5oolgf33dhn.apps.googleusercontent.com',
            callback: onSigningInWithGoogle,
        });
        
        google.accounts.id.renderButton(
            document.getElementById('signInWithGoogle'),
            { theme: 'outline', size: 'large' }
        );
        */
    }
    toBeExecutedWhenDocumentIsReady();

});