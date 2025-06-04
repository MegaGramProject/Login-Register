$(document).ready(function() {
    /*
        at the bottom of this function will be a function
        called 'toBeExecutedWhenDocumentIsReady()',
        which contains all the code to be executed when
        document is ready
    */
    const emailImg = $('#emailImg');
    const phoneImg = $('#phoneImg');

    const statusText = $('#statusText');

    const loginText = $('#loginText');

    const goBackButton = $('#goBackButton');
    const nextButton = $('#nextButton');

    const timeRemaining = $('#timeRemaining');

    const confirmCode = $('#confirmCode');
    const resendCode = $('#resendCode');

    const username = sessionStorage.getItem('username');
    const fullName = sessionStorage.getItem('fullName');
    const password = sessionStorage.getItem('password');
    const dateOfBirth = sessionStorage.getItem('dateOfBirth');

    let emailAddress = null;
    let phoneNumber = null;

    let intervalIdForTimeRemaining = null;
    let timeRemainingValue = 0;

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

    const monthToIndexMappings = {
        jan: 0,
        feb: 1,
        mar: 2,
        apr: 3,
        may: 4,
        jun: 5,
        jul: 6,
        aug: 7,
        sep: 8,
        oct: 9,
        nov: 10,
        dec: 11
    };


    function updateTimeRemaining() {
        if (timeRemainingValue == 0) {
            timeRemaining.text("Time's up!");
            clearInterval(intervalIdForTimeRemaining);
        }
        else {
            timeRemaining.text(timeRemainingValue.toString() + 's');
            timeRemainingValue--;
        }
    }


    function getDateObjectFromDOBString(DOBString) {
        //Example DOBString: 'apr022008' which represents 'April 2nd, 2008'
        const month = DOBString.substring(3);
        const day = DOBString.substring(3,5);
        const year = DOBString.substring(5);
        
        return new Date(parseInt(year), monthToIndexMappings[month], parseInt(day));
    }


    resendCode.on('click', async function() {
        if (emailAddress !== null) {
            sendConfirmationCodeViaEmail();
        }
        else {
            sendConfirmationCodeViaText();
        }
    });


    loginText.on('click', function() {
        if (currLangCode === 'en') {
            window.location.href = 'https://project-megagram.com/login-register/login';
        }
        else {
            window.location.href = `https://34.111.89.101/login-register/login?language=
            ${langCodeToLongFormMappings[currLangCode]}`;
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
            history.pushState(null, 'Confirm Code', 'https://project-megagram.com/login-register/confirm-code');
        }
        else {
            history.pushState(null, 'Confirm Code', `https://project-megagram.com/login-register/confirm-code?
            language=${newLanguage}`);
        }

        currLangCode = newLangCode;
    }


    goBackButton.on('click', function() {
        if (currLangCode === 'en') {
            window.location.href = 'https://project-megagram.com/login-register/age-check'
        }
        else {
            window.location.href = `https://project-megagram.com/login-register/age-check?language=
            ${langCodeToLongFormMappings[currLangCode]}`;
        }
    });


    confirmCode.on('input', function() {
        if (confirmCode.val().length > 5) {
            nextButton.css('background-color', '#347aeb');

            nextButton.css('cursor', 'pointer');
            nextButton.off('click');

            nextButton.on('click', function() {
                if (timeRemainingValue > 0) {
                    nextButton.css('display', 'none');

                    statusText.text('');

                    const createUserURL = 'https://project-megagram.com/api/login_register_backend/createUser';
                    const userData = {
                        username: username,
                        fullName: fullName,
                        password: password,
                        dateOfBirth: getDateObjectFromDOBString(dateOfBirth),
                        confirmationCode: confirmCode.val()
                    };

                    if (emailAddress !== null) {
                        userData.contactInfo = emailAddress;
                    }
                    else {
                        userData.contactInfo = phoneNumber;
                    }

                    const headers  = {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            credentials: 'include'
                        },
                        body: JSON.stringify(userData)
                    };

                    fetch(createUserURL, headers)
                    .then(response => {
                        if (!response.ok) {
                            statusText.css('color', '#ba3240');
                            statusText.text(
                                `The server had trouble creating your account. This may or may not be due to an
                                incorrectly provided confirmation-code.`
                            );

                            nextButton.css('display', 'inline-block');
                        }
                        else {
                            sessionStorage.clear();

                            window.location.href = `https://project-megagram.com/${username}`;
                        }
                    })
                    .catch(_ => {
                        statusText.css('color', '#ba3240');
                        statusText.text(
                            `There was trouble connecting to the server to create your account. The provided 
                            confirmation-code may or may not be correct.`
                        );

                        nextButton.css('display', 'inline-block');
                    });
                }
                else {
                    statusText.css('color', '#ba3240');
                    statusText.text(`Too late! Try resending the code and entering it within 60s.`);
                }
            });
        }
        else {
            nextButton.css('background-color', '#82bbf5');
            nextButton.css('cursor', '');

            nextButton.off('click');
        }
    });


    async function sendConfirmationCodeViaEmail() {
        resendCode.css('display', 'none');

        statusText.text('');

        try {
            const response = await fetch(`https://project-megagram.com/api/login_register_backend/
            sendConfirmationCodeViaEmail`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    email: emailAddress
                })
            });

            if (!response.ok) {
                statusText.css('color', '#ba3240');
                statusText.text(`The server had trouble sending the confirmation-code to
                your email-address ${emailAddress}.`);
            }
            else {
                statusText.css('color', '');
                statusText.text(`Enter the confirmation-code that was sent to your
                email-address ${emailAddress}.`);

                timeRemainingValue = 60;
                updateTimeRemaining();
                intervalIdForTimeRemaining = setInterval(updateTimeRemaining, 1000);
            }
        }
        catch {
            statusText.css('color', '#ba3240');
            statusText.text(`There was trouble connecting to the server to send the 
            confirmation-code to your email-address ${emailAddress}.`);
        }

        resendCode.css('display', '');
    }


    async function sendConfirmationCodeViaText() {
        resendCode.css('display', 'none');

        statusText.text('');

        try {
            const response = await fetch(`https://project-megagram.com/api/login_register_backend/
            sendConfirmationCodeViaText/${phoneNumber}`);

            if (!response.ok) {
                statusText.css('color', '#ba3240');
                statusText.text(`The server had trouble texting the confirmation-code to
                your phone-number ${phoneNumber}.`);
            }
            else {
                statusText.css('color', '');
                statusText.text(`Enter the confirmation-code that was texted to your
                phone-number ${phoneNumber}.`);

                timeRemainingValue = 60;
                updateTimeRemaining();
                intervalIdForTimeRemaining = setInterval(updateTimeRemaining, 1000);
            }
        }
        catch {
            statusText.css('color', '#ba3240');
            statusText.text(`There was trouble connecting to the server to text the 
            confirmation-code to your phone-number ${phoneNumber}.`);
        }

        resendCode.css('display', '');
    }


    async function toBeExecutedWhenDocumentIsReady() {
        const queryString = window.location.search.substring(1);
        const params = new URLSearchParams(queryString);

        const lingo = params.get('language');
        if (lingo) {
            setLanguage(lingo);
        }

        if (sessionStorage.getItem('email')) {
            emailAddress = sessionStorage.getItem('email');
            emailImg.css('display', '');

            sendConfirmationCodeViaEmail();
        }
        else if (sessionStorage.getItem('number')) {
            phoneNumber = sessionStorage.getItem('number');
            phoneImg.css('display', '');

            sendConfirmationCodeViaText();
        }
        else {
            window.location.href = 'https://project-megagram.com/Not-Found-Page/404';
        }
    }


    toBeExecutedWhenDocumentIsReady();


    window.setLanguage = setLanguage;
});