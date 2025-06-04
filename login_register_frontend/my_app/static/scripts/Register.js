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

    const passwordStrength = $('#passwordStrength');
    const passwordStrengthContainer = $('#passwordStrengthContainer');

    const loginText = $('#loginText');

    const numberEmailTakenError = $('#numberEmailTakenError');
    const numberEmailInvalidError = $('#numberEmailInvalidError');
    const usernameTakenError = $('#usernameTakenError');
    const usernameInvalidError = $('#usernameInvalidError');
    const passwordInvalidError = $('#passwordInvalidError');
    const fullNameInvalidError = $('#fullNameInvalidError');
    const otherError = $('#otherError');

    let currentInput;

    /*
        below is a dict where keys are numbers/emails whose taken status has already been
        fetched and values are true if the number/email is taken, false otherwise
    */
    const numberEmailTakenCache = {};
    
    /*
        below is a dict where keys are usernames whose taken status has already been
        fetched and values are true if the username is taken, false otherwise
    */
    const usernameTakenCache = {};
    
    let currLangCode = 'en';
    const langCodeToLongForm = {
        en: 'English',
        fr: 'Français',
        es: 'Español',
        hi: 'हिंदी',
        bn: 'বাংলা',
        'zh-CN': '中国人',
        ar: 'العربية',
        de: 'Deutsch',
        id: 'Bahasa Indonesia',
        it: 'Italiano',
        ja: '日本語',
        ru: 'Русский'
    };
    const langsToLangCode = {
        English: 'en',
        Français: 'fr',
        Español: 'es',
        हिंदी: 'hi',
        বাংলা: 'bn',
        中国人: 'zh-CN',
        العربية: 'ar',
        Deutsch: 'de',
        'Bahasa Indonesia': 'id',
        Italiano: 'it',
        日本語: 'ja',
        Русский: 'ru'
    };


    loginText.on('click', function() {
        if (currLangCode === 'en') {
            window.location.href = 'https://project-megagram.com/login-register/login';
        }
        else {
            window.location.href = `https://project-megagram.com/login-register/login?language=
            ${langCodeToLongForm[currLangCode]}`;
        }
    });


    numberEmail.on('input', function() {
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


    fullName.on('input', function() {
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


    username.on('input', function() {
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

    
    password.on('input', function() {
        currentInput = password;

        wrong4.css('display', 'none');
        checkmark4.css('display', 'none');
        otherError.css('display', 'none');
        passwordInvalidError.css('display', 'none');

        if (password.val().length > 0) {
            passwordStrengthContainer.css('display', 'inline-block');

            const passwordScore = getPasswordValidity(password.val());
            const newPasswordStrengthWidth = (passwordScore/1 * 16.75).toString();
    
            if (passwordScore < 0.15) {
                passwordStrength.css('background-color', 'red');
            }
            else if (passwordScore < 0.3) {
                passwordStrength.css('background-color', 'orange');
            }
            else if (passwordScore < 0.45) {
                passwordStrength.css('background-color', 'gold');
            }
            else if (passwordScore < 0.55) {
                passwordStrength.css('background-color', 'yellow');
            }
            else if (passwordScore < 0.65) {
                passwordStrength.css('background-color', 'lightgreen');
            }
            else if (passwordScore < 0.75) {
                passwordStrength.css('background-color', 'green');
            }
            else {
                passwordStrength.css('background-color', 'darkgreen');
            }
            
            passwordStrength.css('width', newPasswordStrengthWidth + 'em');
        }
        else {
            passwordStrengthContainer.css('display', 'none');
        }

        if (password.val().length > 0) {
            passwordContainerInfo.css('display', 'inline-block');
            password.css('padding-top', '8.5px');

            togglePassword.css('display', 'inline-block');
        }
        else {
            passwordContainerInfo.css('display', 'none');
            password.css('padding-top', '6px');

            togglePassword.css('display', 'none');
        }
    });

    
    async function setLanguage(newLanguage) {
        let newLangCode = langsToLangCode[newLanguage];
        
        if (currLangCode === newLangCode) {
            return;
        }

        let redisCachedLanguageTranslations = {};
        try {
            const response = await fetch(
                `https://project-megagram.com/api/login_register_backend/getRedisCachedLanguageTranslations/
                ${langCodeToLongForm[currLangCode]}/${newLanguage}`
            );
            if (!response.ok) {
                console.error('The server had trouble providing the Redis-cached language-translations');
            }
            else {
                redisCachedLanguageTranslations = await response.json();
            }
        }
        catch {
            console.error(
                'There was trouble connecting to the server to get the Redis-cached language-translations'
            );
        }
        
        const allElements = document.querySelectorAll('*');
        const listsOfNodeTextsToTranslate = [];
        const listOfNodesToTranslate = [];
        allElements.forEach(element => {
            const text = element.innerText.trim();
            if (text !== '' && (element.tagName.toLowerCase() === 'p' || element.tagName.toLowerCase()==='footer'
            || element.tagName.toLowerCase()==='input' || element.tagName.toLowerCase() === 'button' ||
            element.tagName.toLowerCase() === 'a') && element.className !== 'orLine') {
                for (let node of element.childNodes) {
                    if (node.nodeType === Node.TEXT_NODE) {
                        if (node.textContent in redisCachedLanguageTranslations) {
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
        if (numberNameEmail.attr('placeholder') in redisCachedLanguageTranslations) {
            numberNameEmail.attr('placeholder', redisCachedLanguageTranslations[
                numberNameEmail.attr('placeholder')
            ]);
        }
        else {
            listOfInputElemTextsToTranslate.push(numberNameEmail.attr('placeholder'));
            listOfInputElemsToTranslate.push(numberNameEmail);
        }

        if (password.attr('placeholder') in redisCachedLanguageTranslations) {
            password.attr('placeholder', redisCachedLanguageTranslations[password.attr('placeholder')]);
        }
        else {
            listOfInputElemTextsToTranslate.push(password.attr('placeholder'));
            listOfInputElemsToTranslate.push(password);
        }

        const allTextsToTranslate = [...listsOfNodeTextsToTranslate, ...listOfInputElemTextsToTranslate];
        if (allTextsToTranslate.length>0) {
            let translatedTexts = [];
            try {
                const response1 = await fetch(
                    `https://project-megagram.com/api/login_register_backend/
                    translateTextsWithRapidAPIDeepTranslate`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        input_texts: allTextsToTranslate,
                        source_lang_shortened_code: currLangCode,
                        target_lang_shortened_code: newLangCode
                    })
                });
                if (!response1.ok) {
                    console.error(
                        "The server had trouble providing the 'not-already-Redis-cached' language-translations"
                    );
                }
                else {
                    translatedTexts = await response1.json();
                     for(let i=0; i<listsOfNodeTextsToTranslate.length; i++) {
                        listOfNodesToTranslate[i].textContent = translatedTexts[i];
                    }

                    if (listOfInputElemTextsToTranslate.length>0) {
                        for(let i=listsOfNodeTextsToTranslate.length; i<translatedTexts.length; i++) {
                            listOfInputElemTextsToTranslate[i].attr('placeholder', translatedTexts[i]);
                        }
                    }
                }
            }
            catch {
                console.error(
                    `There was trouble connecting to the server to get the 'not-already-Redis-cached'
                    language-translations`
                );
            }
        }
        

        if (newLangCode === 'en') {
            history.pushState(null, 'Register', 'https://project-megagram.com/login-register/register');
        }
        else {
            history.pushState(null, 'Register', `https://project-megagram.com/login-register/register?language=
            ${newLanguage}`);
        }

        currLangCode = newLangCode;
    }


    togglePassword.on('click', function() {
        if (password.attr('type') === 'password') {
            password.attr('type', 'text');
            togglePassword.text('Hide');
        }
        else {
            password.attr('type', 'password');
            togglePassword.text('Show');
        }
    });


    function isValidEmail(email) {
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


    function isValidNumber(phoneNumberInput) {
        const phoneRegex = /^\d{8,17}$/;
        return phoneRegex.test(phoneNumberInput);
    };


    async function numberOrEmailIsValid(numberEmailInput) {
        if (numberEmailInput in numberEmailTakenCache) {
            if (numberEmailTakenCache[numberEmailInput]) {
                numberEmailTakenError.css('display', 'inline-flex');

                return false;
            }

            return true;
        }

        if (!isValidEmail(numberEmailInput) && !isValidNumber(numberEmailInput)) {
            numberEmailInvalidError.css('display', 'inline-flex');
            return;
        }

        try {
            const response = await fetch(`https://project-megagram.com/api/login_register_backend/
            doesUserExistWithGivenContactInfo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'contact_info': numberEmailInput
                })
            });

            const userExists = await response.json();
            
            if (!userExists) {
                numberEmailTakenCache[numberEmailInput] = false;
                return true;
            }

            numberEmailTakenError.css('display', 'inline-flex');

            numberEmailTakenCache[numberEmailInput] = true;

            return false;
        }
        catch {
            otherError.css('display', 'inline-block');
            otherError.text(
                'There was trouble connecting to the server to check if the provided number/email is taken or not.'
            );

            return false;
        }
    }


    function fullNameIsValid(fullNameInput) {
        if (fullNameInput.length==0 || fullNameInput[0]===' ') {
            fullNameInvalidError.css('display', 'inline-block');
            return false;
        }
        if (fullNameInput.indexOf(' ') === -1) {
            fullNameInvalidError.css('display', 'inline-block');
            return false;
        }
    
        for (let i = 0; i < fullNameInput.length; i++) {
            let char = fullNameInput[i];
            if (char !== ' ' && !(char >= 'A' && char <= 'Z') && !(char >= 'a' && char <= 'z')) {
                fullNameInvalidError.css('display', 'inline-block');
                return false;
            }
        }
    
        return true;
    }


    async function usernameIsValid(usernameInput) {
        if (usernameInput in usernameTakenCache) {
            if (usernameTakenCache[usernameInput]) {
                usernameTakenError.css('display', 'inline-flex');

                return false;
            }

            return true;
        }

        if (usernameInput.length < 1) {
            usernameInvalidError.css('display', 'inline-flex');

            return false;
        }
    
        for (let i = 0; i < usernameInput.length; i++) {
            let char = usernameInput[i];
            if (!(char >= 'A' && char <= 'Z') && !(char >= 'a' && char <= 'z') &&
            !(char >= '0' && char <= '9') && char !== '.' && char!='_') {
                usernameInvalidError.css('display', 'inline-flex');

                return false;
            }
        }

        try {
            const response = await fetch(`https://project-megagram.com/api/login_register_backend
            /doesUserExistWithGivenUsername/${usernameInput}`);
            
            const userExists = await response.json();

            if (!userExists) {
                usernameTakenCache[usernameInput] = false;
                return true;
            }

            usernameError = 'taken';
            usernameTakenCache[usernameInput] = true;
            return false;
        }
        catch {
            otherError.css('display', 'inline-block');
            otherError.text(
                'There was trouble connecting to the server to check if the provided username is taken or not.'
            );

            return false;
        }
    }


    function getPasswordValidity(passwordInput) {
        if (passwordInput.length == 0) {
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


    async function takeUserToNextPage() {
        let usernameIsOk = false;

        if (fullNameIsValid(fullName.val()) && getPasswordValidity(password.val()) >= 0.65
        && (isValidEmail(numberEmail.val()) || isValidNumber(numberEmail.val()))) {
            const numberOrEmailIsOk = await numberOrEmailIsValid(numberEmail.val());

            if (numberOrEmailIsOk) {
                usernameIsOk = await usernameIsValid(username.val());
            }
        }

        if (!usernameIsOk) {
            signupButton.css('background-color', '#82bbf5');
            signupButton.css('cursor', '');

            signupButton.off('click');
            return;
        }

        if (isValidEmail(numberEmail.val())) {
            sessionStorage.setItem('email', numberEmail.val());
        }
        else {
            sessionStorage.setItem('number', numberEmail.val());
        }

        sessionStorage.setItem('fullName', fullName.val());
        sessionStorage.setItem('username', username.val());

        sessionStorage.setItem('password', password.val());

        if (currLangCode === 'en') {
            window.location.href = 'https://project-megagram.com/login-register/age-check';
        }
        else {
            window.location.href = `https://project-megagram.com/login-register/age-check?language=
            ${langCodeToLongForm[currLangCode]}`;
        }
    }
        

    $(document).on('click', function (event) {
        let userCanProceed = false;

        if (currentInput === numberEmail && !$.contains(numberEmail[0], event.target)) {
            numberOrEmailIsValid(numberEmail.val()).then(inputIsValid => {
                if (inputIsValid) {
                    userCanProceed = true;

                    checkmark1.css('display', 'inline-block');
                    wrong1.css('display', 'none');
                }
                else {
                    checkmark1.css('display', 'none');
                    wrong1.css('display', 'inline-block');
                }
            });
        }
        else if (currentInput === fullName && !$.contains(fullName[0], event.target)) {
            let inputIsValid = fullNameIsValid(fullName.val());

            if (inputIsValid) {
                userCanProceed = true;

                checkmark2.css('display', 'inline-block');
                wrong2.css('display', 'none');
            }
            else {
                checkmark2.css('display', 'none');
                wrong2.css('display', 'inline-block');
            }
        }
        else if (currentInput === username && !$.contains(username[0], event.target)) {
            usernameIsValid(username.val()).then(inputIsValid => {
                if (inputIsValid) {
                    userCanProceed = true;
    
                    checkmark3.css('display', 'inline-block');
                    wrong3.css('display', 'none');
                }
                else {
                    checkmark3.css('display', 'none');
                    wrong3.css('display', 'inline-block');
                }
            });
        }
        else if (currentInput === password && !$.contains(password[0], event.target)) {
            if (getPasswordValidity(password.val()) >= 0.65) {
                userCanProceed = true;
    
                checkmark4.css('display', 'inline-block');
                wrong4.css('display', 'none');
            }
            else {
                passwordInvalidError.css('display', 'inline-flex');

                checkmark4.css('display', 'none');
                wrong4.css('display', 'inline-block');
            }
        }

        if (!userCanProceed) {
            signupButton.css('background-color', '#82bbf5');
            signupButton.css('cursor', '');

            signupButton.off('click');
        }
        else if (fullNameIsValid(fullName.val()) && getPasswordValidity(password.val()) >= 0.65
        && (isValidEmail(numberEmail.val()) || isValidNumber(numberEmail.val()))) {
            let userCanProceedEvenFurther = false;

            numberOrEmailIsValid(numberEmail.val()).then(numberEmailIsValid => {
                if (numberEmailIsValid) {
                    usernameIsValid(username.val()).then(usernameIsValid => {
                        if (usernameIsValid) {
                            userCanProceedEvenFurther = true;
                        }
                    });
                }
            });

            if (userCanProceedEvenFurther) {
                signupButton.css('background-color', '#347aeb');
                signupButton.css('cursor', 'pointer');

                signupButton.off('click');
                signupButton.on('click', takeUserToNextPage);
            }
            else {
                signupButton.css('background-color', '#82bbf5');
                signupButton.css('cursor', '');

                signupButton.off('click');
            }
        }
    });


    function toBeExecutedWhenDocumentIsReady() {
        if (sessionStorage.getItem('number')) {
            numberEmail.val(sessionStorage.getItem('number'));
        }
        if (sessionStorage.getItem('email')) {
            numberEmail.val(sessionStorage.getItem('email'));
        }
        if (sessionStorage.getItem('fullName')) {
            fullName.val(sessionStorage.getItem('fullName'));
        }
        if (sessionStorage.getItem('username')) {
            username.val(sessionStorage.getItem('username'));
        }

        sessionStorage.removeItem('password');

        const queryString = window.location.search.substring(1);
        const params = new URLSearchParams(queryString);
        let lingo = params.get('language');
        if (lingo) {
            setLanguage(lingo);
        }
    }


    toBeExecutedWhenDocumentIsReady();


    window.setLanguage = setLanguage;
});