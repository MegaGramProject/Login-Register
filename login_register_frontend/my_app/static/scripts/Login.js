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

    const toggleDisplayPasswordText = $('#toggleDisplayPasswordText');
    const passwordContainerInfo = $('#passwordContainerInfo');

    const signupLink = $('#signupLink');

    const loginErrorMessage = $('#loginErrorMessage');

    const loginPhotos = $('.slide').get();

    let slideIdx = 0;

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


    async function loginUser() {
        loginButton.off('click');

        const postOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        };

        if (isValidEmail(numberNameEmail.val()) || isValidNumber(numberNameEmail.val())) {
            postOptions.body = JSON.stringify({
                contact_info: numberNameEmail.val(),
                password: password.val()
            });
        }
        else {
            postOptions.body = JSON.stringify({
                username: numberNameEmail.val(),
                password: password.val()
            });
        }

        try {
            const response = await fetch(`https://project-megagram.com/api/login_register_backend/loginUser`,
            postOptions)
            
            if (response.status == 404) {
                loginErrorMessage.css('display', 'inline-block');
                loginErrorMessage.text('User not found');
            }

            else if (response.status == 403) {
                loginErrorMessage.css('display', 'inline-block');
                loginErrorMessage.text('Incorrect password');
            }

            else if (response.status == 200) {
                const usernameOfLoggedInUser = await response.text();
                window.location.href = `https://project-megagram.com/${usernameOfLoggedInUser}`;
            }
        }
        catch {
            loginErrorMessage.css('display', 'inline-block');
            loginErrorMessage.text('There was trouble connecting to the server to log you in');
        }

        loginButton.on('click', loginUser);
    }


    signupLink.on('click', function() {
        if (currLangCode === 'en') {
            window.location.href = 'https://project-megagram.com/login-register/register';
        }
        else {
            window.location.href = `https://project-megagram.com/login-register/register?language=
            ${langCodeToLongForm[currLangCode]}`;
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
            if (text !== '' && (element.tagName.toLowerCase()=== 'p' || element.tagName.toLowerCase() === 'footer'
            || element.tagName.toLowerCase()=== 'input' || element.tagName.toLowerCase() === 'button' ||
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
            history.pushState(null, 'Login', 'https://project-megagram.com/login-register/login');
        }
        else {
            history.pushState(null, 'Login', `https://project-megagram.com/login-register/login?language=
            ${newLanguage}`);
        }

        currLangCode = newLangCode;
    }


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


    function isValidNumber (phoneNumberInput) {
        const phoneRegex = /^\d{8,17}$/;
        return phoneRegex.test(phoneNumberInput);
    };


    function isValidUsername(usernameInput) {
        if (usernameInput.length > 30 || usernameInput.length < 1) {
            return false;
        }
    
        for (let i = 0; i < usernameInput.length; i++) {
            let char = usernameInput[i];
            if (!(char >= 'A' && char <= 'Z') && !(char >= 'a' && char <= 'z') &&
                !(char >= '0' && char <= '9') && char !== '.' && char!='_') {
                return false;
            }
        }
    
        return true;
    }

    
    numberNameEmail.on('input', function () {
        if (numberNameEmail.val().length > 0) {
            $('#userContainerInfo').css('display', 'inline-block');
            numberNameEmail.css('padding-top', '2.1em');
        }
        else {
            $('#userContainerInfo').css('display', 'none');
            numberNameEmail.css('padding-top', '1.5em');
        }

        checkIfReadyToLogin();
    });


    password.on('input', function() {
        if (password.val().length > 0) {
            passwordContainerInfo.css('display', 'inline-block');
            password.css('padding-top', '2.1em');

            toggleDisplayPasswordText.css('display', 'inline-block');
        }
        else {
            passwordContainerInfo.css('display', 'none');
            password.css('padding-top', '1.5em');

            toggleDisplayPasswordText.css('display', 'none');
        }

        checkIfReadyToLogin();
    });


    function checkIfReadyToLogin() {
        if ((isValidEmail(numberNameEmail.val()) || isValidNumber(numberNameEmail.val()) ||
        isValidUsername(numberNameEmail.val())) &&  password.val().length > 0) {
            loginButton.css('background-color', '#347aeb');
            loginButton.css('cursor', 'pointer');

            loginButton.off('click');
            loginButton.on('click', loginUser);
        }
        else {
           updateUISoThatUserCannotLogin();
        }
    }


    toggleDisplayPasswordText.on('click', function() {
        if (password.attr('type') === 'password') {
            password.attr('type', 'text');
            toggleDisplayPasswordText.text('Hide');
        }
        else {
            password.attr('type', 'password');
            toggleDisplayPasswordText.text('Show');
        }
    });
    

    function displayFirstLoginPhoto() {
        function incrementOpacity() {
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


    function displayLoginPhotos() {
        const currentPhoto = loginPhotos[slideIdx];
        if (slideIdx==3) {
            slideIdx=0;
        }
        else {
            slideIdx++;
        }

        const newPhoto = loginPhotos[slideIdx];
        newPhoto.style.opacity = '0';
        currentPhoto.style.opacity = '1';

        let enableTransition = function() {
            if (parseFloat(newPhoto.style.opacity) < 1) {
                newPhoto.style.opacity = (parseFloat(newPhoto.style.opacity) + 0.01).toString();
                currentPhoto.style.opacity = (parseFloat(currentPhoto.style.opacity) - 0.01).toString();
                setTimeout(enableTransition, 30);
            }
        };

        enableTransition();
    }


    function updateUISoThatUserCannotLogin() {
        loginButton.css('background-color', '#82bbf5');
        loginButton.css('cursor', '');
        loginButton.off('click');
    }


    async function toBeExecutedWhenDocumentIsReady() {
        const queryString = window.location.search.substring(1);
        const params = new URLSearchParams(queryString);
        let lingo = params.get('language');
        if (lingo) {
            setLanguage(lingo);
        }

        setTimeout(() => {
            $('#loadingScreen').css('display', 'none');
            $('#loginScreen').css('display', 'flex');
        }, 740);

        displayFirstLoginPhoto();
    }

    
    toBeExecutedWhenDocumentIsReady();


    window.setLanguage = setLanguage;
});