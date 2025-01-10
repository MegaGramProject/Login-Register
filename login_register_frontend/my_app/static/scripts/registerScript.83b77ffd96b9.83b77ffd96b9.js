$(document).ready(function() {
    /*
        at the bottom of this function will be a function
        called 'toBeExecutedWhenDocumentIsReady()',
        which contains all the code to be executed when
        document is ready
    */
    const numberEmail = $('#numberEmail');
    const fullName = $('#fullName');
    const username = $('#username');
    const password = $('#password');
    const signupButton = $('#signupButton');
    const togglePassword = $('#togglePassword');
    const numberEmailContainerInfo =  $('#numberEmailContainerInfo');
    const fullNameContainerInfo = $('#fullNameContainerInfo');
    const usernameContainerInfo = $('#usernameContainerInfo');
    const passwordContainerInfo = $('#passwordContainerInfo');
    const checkmark1 = $('#checkmark1');
    const wrong1 = $('#wrong1');
    const checkmark2 = $('#checkmark2');
    const wrong2 = $('#wrong2');
    const checkmark3 = $('#checkmark3');
    const wrong3 = $('#wrong3');
    const checkmark4 = $('#checkmark4');
    const wrong4 = $('#wrong4');
    const passwordStrength = $("#passwordStrength");
    const passwordStrengthContainer = $("#passwordStrengthContainer");
    const loginText = $("#loginText");
    const numberEmailTakenError = $("#numberEmailTakenError");
    const numberEmailInvalidError = $("#numberEmailInvalidError");
    const usernameTakenError = $("#usernameTakenError");
    const usernameInvalidError = $("#usernameInvalidError");
    const passwordInvalidError = $("#passwordInvalidError");
    const fullNameInvalidError = $("#fullNameInvalidError");
    const otherError = $('#otherError');
    const bcrypt = dcodeIO.bcrypt; //this is used for hashing the user-inputted password
    let currLanguage = "en";
    let numberEmailError;
    let usernameError;
    let currentInput;
    const numberEmailTakenCache = {};
    /*
        above is a dict where keys are numbers/emails whose taken status has already been
        fetched and values are true if the number/email is taken, false otherwise
    */
    const usernameTakenCache = {};
    /*
        above is a dict where keys are usernames whose taken status has already been
        fetched and values are true if the username is taken, false otherwise
    */
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


    loginText.on("click", function() {
        let currentLanguageLongForm;
        if (currLanguage==="en") {
            window.location.href = "http://34.111.89.101/loginregister/login";
            return;
        }
        else {
            currentLanguageLongForm = languageCodeToLongFormMappings[currLanguage];
        }
        window.location.href = `http://34.111.89.101/loginregister/login?language=${currentLanguageLongForm}`;
    });

    numberEmail.on("input", function() {
        currentInput = numberEmail;
        wrong1.css('display', 'none');
        checkmark1.css('display', 'none');
        otherError.css('display', 'none');
        numberEmailInvalidError.css('display', 'none');
        numberEmailTakenError.css('display', 'none');

        if (numberEmail.val().length > 0) {
            numberEmailContainerInfo.css('display', 'inline-block');
            numberEmail.css('padding-top', '8.5px');
        }
        else {
            numberEmailContainerInfo.css('display', 'none');
            numberEmail.css('padding-top', '6px');
        }
    });

    fullName.on("input", function() {
        currentInput = fullName;
        wrong2.css('display', 'none');
        checkmark2.css('display', 'none');
        otherError.css('display', 'none');
        fullNameInvalidError.css('display', 'none');

        if (fullName.val().length > 0) {
            fullNameContainerInfo.css('display', 'inline-block');
            fullName.css('padding-top', '8.5px');
        }
        else {
            fullNameContainerInfo.css('display', 'none');
            fullName.css('padding-top', '6px');
        }
    });

    username.on("input", function() {
        currentInput = username;
        wrong3.css('display', 'none');
        checkmark3.css('display', 'none');
        otherError.css('display', 'none');
        usernameInvalidError.css('display', 'none');

        if (username.val().length > 0) {
            usernameContainerInfo.css('display', 'inline-block');
            username.css('padding-top', '8.5px');
        }
        else {
            usernameContainerInfo.css('display', 'none');
            username.css('padding-top', '6px');
        }
    });

    password.on("input", function() {
        currentInput = password;
        wrong4.css('display', 'none');
        checkmark4.css('display', 'none');
        otherError.css('display', 'none');
        passwordInvalidError.css('display', 'none');
        
        passwordStrengthContainer.css('display', 'inline-block');
        const passwordScore = getPasswordValidity(password.val());
        const newPasswordStrengthWidth = (passwordScore/1 * 16.75).toString();
        if(passwordScore < 0.15) {
            passwordStrength.css('background-color', 'red');
        }
        else if(passwordScore < 0.3) {
            passwordStrength.css('background-color', 'orange');
        }
        else if(passwordScore < 0.45) {
            passwordStrength.css('background-color', 'gold');
        }
        else if(passwordScore < 0.55) {
            passwordStrength.css('background-color', 'yellow');
        }
        else if(passwordScore < 0.65){
            passwordStrength.css('background-color', 'lightgreen');
        }
        else if(passwordScore < 0.75) {
            passwordStrength.css('background-color', 'green');
        }
        else {
            passwordStrength.css('background-color', 'darkgreen');
        }
        
        passwordStrength.css('width', newPasswordStrengthWidth + 'em');
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
    });

    const setLanguage = async function (lang) {
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

        let redisCachedLanguageTranslations = {};
        try {
            const response = await fetch(
                `http://34.111.89.101/loginregister/api/getRedisCachedLanguageTranslations/
                ${languageCodeToLongFormMappings[currLanguage]}/${languageCodeToLongFormMappings[newLanguage]}`
            );
            if(!response.ok) {
                console.error("The server had trouble providing the Redis-cached language-translations");
            }
            redisCachedLanguageTranslations = await response.json();
        }
        catch (error) {
            console.error("There was trouble connecting to the server to get the Redis-cached language-translations");
        }
        
        const allElements = document.querySelectorAll('*');
        const listsOfNodeTextsToTranslate = [];
        const listOfNodesToTranslate = [];
        allElements.forEach(element => {
            const text = element.innerText.trim();
            if (text !== '' && (element.tagName.toLowerCase()==="p" || element.tagName.toLowerCase()==="footer" ||
            element.tagName.toLowerCase()==="input" || element.tagName.toLowerCase()==="button" ||
            element.tagName.toLowerCase()=="a") && element.className!=="orLine") {
                for (let node of element.childNodes) {
                    if (node.nodeType === Node.TEXT_NODE) {
                        if(node.textContent in redisCachedLanguageTranslations) {
                            node.textContent = redisCachedLanguageTranslations[node.textContent];
                        }
                        else {
                            listsOfNodeTextsToTranslate.push(node.textContent);
                            listOfNodesToTranslate.push(node);
                        }
                    }
                }
            }
        });

        const listOfInputElemTextsToTranslate = [];
        const listOfInputElemsToTranslate = [];
        if(numberEmail.attr('placeholder') in redisCachedLanguageTranslations) {
            numberEmail.attr('placeholder', redisCachedLanguageTranslations[numberEmail.attr('placeholder')]);
        }
        else {
            listOfInputElemTextsToTranslate.push(numberEmail.attr('placeholder'));
            listOfInputElemsToTranslate.push(numberEmail);
        }

        if(fullName.attr('placeholder') in redisCachedLanguageTranslations) {
            fullName.attr('placeholder', redisCachedLanguageTranslations[fullName.attr('placeholder')]);
        }
        else {
            listOfInputElemTextsToTranslate.push(fullName.attr('placeholder'));
            listOfInputElemsToTranslate.push(fullName);
        }

        if(username.attr('placeholder') in redisCachedLanguageTranslations) {
            username.attr('placeholder', redisCachedLanguageTranslations[username.attr('placeholder')]);
        }
        else {
            listOfInputElemTextsToTranslate.push(username.attr('placeholder'));
            listOfInputElemsToTranslate.push(username);
        }

        if(password.attr('placeholder') in redisCachedLanguageTranslations) {
            password.attr('placeholder', redisCachedLanguageTranslations[password.attr('placeholder')]);
        }
        else {
            listOfInputElemTextsToTranslate.push(password.attr('placeholder'));
            listOfInputElemsToTranslate.push(password);
        }

        const allTextsToTranslate = [...listsOfNodeTextsToTranslate, ...listOfInputElemTextsToTranslate];
        if(allTextsToTranslate.length>0) {
            let translatedTexts = [];
            try {
                const response1 = await fetch( `http://34.111.89.101/loginregister/api/translateTextsWithRapidApi/`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        input_texts: allTextsToTranslate,
                        source_lang_shortened_code: currLanguage,
                        target_lang_shortened_code: newLanguage
                    })
                });
                if(!response1.ok) {
                    console.error("The server had trouble providing the 'not-already-Redis-cached' language-translations");
                }

                translatedTexts = await response1.json();
            }
            catch (error) {
                console.error(
                    "There was trouble connecting to the server to get the 'not-already-Redis-cached' language-translations"
                );
            }

            for(let i=0; i<listsOfNodeTextsToTranslate.length; i++) {
                listOfNodesToTranslate[i].textContent = translatedTexts[i];
            }

            if(listOfInputElemTextsToTranslate.length>0) {
                for(let i=listsOfNodeTextsToTranslate.length; i<translatedTexts.length; i++) {
                    listOfInputElemTextsToTranslate[i].attr('placeholder', translatedTexts[i]);
                }
            }
        }

        if(newLanguage==='en') {
            history.pushState(null, 'Register', 'http://34.111.89.101/loginregister/signup');
        }
        else {
            history.pushState(null, 'Register', `http://34.111.89.101/loginregister/signup?language=${languageCodeToLongFormMappings[newLanguage]}`);
        }
        
        currLanguage = newLanguage;
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


    const checkNumberEmail = async function(numberEmailInput) {
        if(!isValidEmail(numberEmailInput) && !isValidNumber(numberEmailInput)) {
            numberEmailError = "invalid";
            return;
        }

        if(numberEmailInput in numberEmailTakenCache) {
            if(numberEmailTakenCache[numberEmailInput]==true) {
                numberEmailError = "taken";
                return false;
            }
            else {
                numberEmailError = "";
                return true;
            }
        }

        try {
            const response = await fetch("http://34.111.89.101/loginregister/api/doesUserExist", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "contact_info": numberEmailInput
                })
            });
            const data = await response.json();
            if ('user_exists' in data) {
                numberEmailError = "";
                numberEmailTakenCache[numberEmailInput] = false;
                return true;
            }
            numberEmailError = "taken";
            numberEmailTakenCache[numberEmailInput] = true;
            return false;
        }
        catch (error) {
            numberEmailError = "";
            otherError.css('display', 'inline-block');
            otherError.text('Trouble connecting to server to see if number/email is taken or not.');
            return false;
        }
    }

    const fullNameIsValid = function(fullNameInput) {
        if(fullNameInput.length==0 || fullNameInput[0]===" ") {
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

    const usernameIsValid = async function(usernameInput) {
        if (usernameInput.length < 1) {
            usernameError = "invalid"
            return false;
        }
    
        for (let i = 0; i < usernameInput.length; i++) {
            let char = usernameInput[i];
            if (!(char >= 'A' && char <= 'Z') && !(char >= 'a' && char <= 'z') &&
                !(char >= '0' && char <= '9') && char !== '.' && char!="_") {
                usernameError = "invalid"
                return false;
            }
        }

        if(usernameInput in usernameTakenCache) {
            if(usernameTakenCache[usernameInput]==true) {
                usernameError = "taken";
                return false;
            }
            else {
                usernameError = "";
                return true;
            }
        }

        try {
            const response = await fetch("http://34.111.89.101/loginregister/api/doesUserExist", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "username": usernameInput
                })
            });
            
            const data = await response.json();
            if ('user_exists' in data) {
                usernameError = "";
                usernameTakenCache[usernameInput] = false;
                return true;
            }
            usernameError = "taken";
            usernameTakenCache[usernameInput] = true;
            return false;
        }
        catch (error) {
            usernameError = "";
            otherError.css('display', 'inline-block');
            otherError.text('Trouble connecting to the server to check if username is taken or not.');
            return false;
        }
    }

    const getPasswordValidity = function(passwordInput) {
        if(passwordInput.length == 0) {
            return 0;
        }
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

    const getSalt = function() {
        return bcrypt.genSaltSync(12);
    }

    const getHashedPassword = function(password, salt) {
        return bcrypt.hashSync(password, salt);
    }

    const takeUserToNextPage = async function() {
        if (fullNameIsValid(fullName.val()) && getPasswordValidity(password.val()) >= 0.65
        && (isValidEmail(numberEmail.val()) || isValidNumber(numberEmail.val()))) {
            const numberEmailIsValid = await checkNumberEmail(numberEmail.val());
            if (numberEmailIsValid) {
                const usernameIsOk = await usernameIsValid(username.val());
                if(usernameIsOk) {
                    signupButton.css('background-color', '#347aeb');
                    signupButton.css('cursor', 'pointer');
                }
                else {
                    signupButton.css('background-color', '#82bbf5');
                    signupButton.css('cursor', '');
                    signupButton.off("click");
                    return;
                }
            }
            else {
                signupButton.css('background-color', '#82bbf5');
                signupButton.css('cursor', '');
                signupButton.off("click");
                return;
            }
        }
        else {
            signupButton.css('background-color', '#82bbf5');
            signupButton.css('cursor', '');
            signupButton.off("click");
            return;
        }

        let currentLanguageLongForm = languageCodeToLongFormMappings[currLanguage];

        if (isValidEmail(numberEmail.val())) {
            sessionStorage.setItem("email", numberEmail.val());
        }
        else {
            sessionStorage.setItem("number", numberEmail.val());
        }

        sessionStorage.setItem("fullName", fullName.val());
        sessionStorage.setItem("username", username.val());
        const salt = getSalt();
        sessionStorage.setItem("salt", salt);
        sessionStorage.setItem("hashedPassword", getHashedPassword(password.val(), salt));
        window.location.href = `http://34.111.89.101/loginregister/ageCheck?language=${currentLanguageLongForm}`;
    }
        

    $(document).on('click', function (event) {
        let checkIfUserCanProceed = false;
        if(currentInput===numberEmail && !$.contains(numberEmail[0], event.target)) {
            checkNumberEmail(numberEmail.val()).then(inputIsValid => {
                if (inputIsValid) {
                    checkIfUserCanProceed = true;
                    checkmark1.css('display', 'inline-block');
                    wrong1.css('display', 'none');
                    numberEmailInvalidError.css('display', 'none');
                    numberEmailTakenError.css('display', 'none');
                }
                else {
                    wrong1.css('display', 'inline-block');
                    checkmark1.css('display', 'none');
                    if (numberEmailError==="invalid") {
                        numberEmailInvalidError.css('display', 'inline-block');
                        numberEmailTakenError.css('display', 'none');
                    }
                    else if(numberEmailError==='taken'){
                        numberEmailInvalidError.css('display', 'none');
                        numberEmailTakenError.css('display', 'inline-block');
                    }
                    else {
                        //Trouble connecting to the server
                        checkmark1.css('display', 'none');
                        wrong1.css('display', 'none');
                        numberEmailInvalidError.css('display', 'none');
                        numberEmailTakenError.css('display', 'none');
                    }
                }
            });
        }
        else if(currentInput===fullName && !$.contains(fullName[0], event.target)) {
            let inputIsValid = fullNameIsValid(fullName.val());
            if (inputIsValid) {
                checkIfUserCanProceed = true;
                checkmark2.css('display', 'inline-block');
                wrong2.css('display', 'none');
                fullNameInvalidError.css('display', 'none');
            }
            else {
                checkmark2.css('display', 'none');
                wrong2.css('display', 'inline-block');
                fullNameInvalidError.css('display', 'inline-block');
            }
        }
        else if(currentInput===username && !$.contains(username[0], event.target)) {
            usernameIsValid(username.val()).then(inputIsValid => {
                if (inputIsValid) {
                    checkIfUserCanProceed = true;
                    checkmark3.css('display', 'inline-block');
                    wrong3.css('display', 'none');
                    usernameTakenError.css('display', 'none');
                    usernameInvalidError.css('display', 'none');
                }
                else {
                    wrong3.css('display', 'inline-block');
                    checkmark3.css('display', 'none');
                    if (usernameError==="invalid") {
                        usernameInvalidError.css('display', 'inline-block');
                        usernameTakenError.css('display', 'none');
                    }
                    else if(usernameError==="taken") {
                        usernameTakenError.css('display', 'inline-block');
                        usernameInvalidError.css('display', 'none');
                    }
                    else {
                        //Trouble connecting to the server
                        checkmark3.css('display', 'none');
                        wrong3.css('display', 'none');
                        usernameTakenError.css('display', 'none');
                        usernameInvalidError.css('display', 'none');
                    }
                }
            });
        }
        else if(currentInput==password && !$.contains(password[0], event.target)) {
            if (getPasswordValidity(password.val()) > 0.65){
                checkIfUserCanProceed = true;
                checkmark4.css('display', 'inline-block');
                wrong4.css('display', 'none');
                passwordInvalidError.css('display', 'none');
            }
            else {
                checkmark4.css('display', 'none');
                wrong4.css('display', 'inline-block');
                passwordInvalidError.css('display', 'inline-block');
            }
        }

        if(!checkIfUserCanProceed) {
            return;
        }

        if (fullNameIsValid(fullName.val()) && getPasswordValidity(password.val()) >= 0.65
        && (isValidEmail(numberEmail.val()) || isValidNumber(numberEmail.val()))) {
            checkNumberEmail(numberEmail.val()).then(numberEmailIsValid => {
                if (numberEmailIsValid) {
                    usernameIsValid(username.val()).then(usernameIsValid => {
                        if(usernameIsValid) {
                            signupButton.css('background-color', '#347aeb');
                            signupButton.css('cursor', 'pointer');
                            signupButton.off("click");
                            signupButton.on("click", () => takeUserToNextPage());
                        }
                        else {
                            signupButton.css('background-color', '#82bbf5');
                            signupButton.css('cursor', '');
                            signupButton.off("click");
                        }
                    });
                }
                else {
                    signupButton.css('background-color', '#82bbf5');
                    signupButton.css('cursor', '');
                    signupButton.off("click");
                }
            });
        }
        else {
            signupButton.css('background-color', '#82bbf5');
            signupButton.css('cursor', '');
            signupButton.off("click");
        }
    });

    window.setLanguage = setLanguage;

    function toBeExecutedWhenDocumentIsReady() {
        if(sessionStorage.getItem("number")) {
            numberEmail.val(sessionStorage.getItem("number"));
        }
        if(sessionStorage.getItem("email")) {
            numberEmail.val(sessionStorage.getItem("email"));
        }
        if(sessionStorage.getItem("fullName")) {
            fullName.val(sessionStorage.getItem("fullName"));
        }
        if (sessionStorage.getItem("username")) {
            username.val(sessionStorage.getItem("username"));
        }

        const queryString = window.location.search.substring(1);
        const params = new URLSearchParams(queryString);
        let lingo = params.get("language");
        if (lingo) {
            setLanguage(lingo);
        }
    }

    toBeExecutedWhenDocumentIsReady();
});