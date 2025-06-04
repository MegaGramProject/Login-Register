$(document).ready(function() {
    /*
        at the bottom of this function will be a function
        called 'toBeExecutedWhenDocumentIsReady()',
        which contains all the code to be executed when
        document is ready
    */
    const whyAgeCheck = $('#whyAgeCheck');
    const whyAgeCheckPopup = $('#whyAgeCheckPopup');

    const exitPopup = $('#exitPopup');

    const birthMonth = $('#birthMonth');
    const birthDay = $('#birthDay');
    const birthYear = $('#birthYear');

    const nextButton = $('#nextButton');
    const goBackText = $('#goBackText');

    const loginText = $('#loginText');

    const errorMessage = $('#errorMessage');

    const darkScreen = $('#darkScreen');

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
            history.pushState(null, 'Age Check', 'https://project-megagram.com/login-register/age-check');
        }
        else {
            history.pushState(null, 'Age Check', `https://project-megagram.com/login-register/age-check?language=
            ${langCodeToLongForm[newLangCode]}`);
        }

        currLangCode = newLangCode;
    }


    goBackText.on('click', function() {
        if (currLangCode === 'en') {
            window.location.href = 'https://project-megagram.com/login-register/register';
        }
        else { 
            window.location.href = `https://project-megagram.com/login-register/register?language=
            ${langCodeToLongForm[currLangCode]}`;
        }
    });
    

    whyAgeCheck.on('click', function() {
        darkScreen.css('display', '');
        whyAgeCheckPopup.css('display', 'flex');
    });


    exitPopup.on('click', function() {
        closeWhyAgeCheckPopup();
    });


    darkScreen.on('click', function() {
        closeWhyAgeCheckPopup();
    });


    function closeWhyAgeCheckPopup() {
        darkScreen.css('display', 'none');
        whyAgeCheckPopup.css('display', 'none');
    }


    function takeUserToFinalPage() {
        let confirmCodeUrl;
        if (currLangCode === 'en') {
            confirmCodeUrl = 'https://project-megagram.com/login-register/confirm-code';
        }
        else {
            confirmCodeUrl = 'https://project-megagram.com/login-register/confirm-code?language=' + 
            langCodeToLongForm[currLangCode];
        }
        sessionStorage.setItem('dateOfBirth', birthMonth.val() + birthDay.val() + birthYear.val());

        confetti({
            particleCount: Math.floor(Math.random()*1000+0),
            spread: Math.floor(Math.random()*1000+0),
            origin: { x: Math.random(), y: Math.random() },
        });

        confetti({
            particleCount: Math.floor(Math.random()*1000+0),
            spread: Math.floor(Math.random()*1000+0),
            origin: { x: Math.random(), y: Math.random() },
        });

        setTimeout(() => {
            window.location.href = confirmCodeUrl;
        }, 1900);
    }


    function updateBirthdayInputStatus() {
        if (birthMonth.val() && birthDay.val() && birthYear.val() && isValidAge(birthMonth.val(),
        parseInt(birthDay.val(),10), parseInt(birthYear.val(),10))) {
            errorMessage.css('display', 'none');

            nextButton.css('background-color', '#347aeb');
            nextButton.css('cursor', 'pointer');

            nextButton.off('click');
            nextButton.on('click', takeUserToFinalPage);
        }
        else if (birthMonth.val() && birthDay.val() && birthYear.val()) {
            errorMessage.css('display', 'inline-block');
            errorMessage.text('You must provide a valid-date and be born at-least 10 years ago.');

            nextButton.css('background-color', '#82bbf5');
            nextButton.css('cursor', '');

            nextButton.off('click');
        }
        else {
            errorMessage.css('display', 'none');

            nextButton.css('background-color', '#82bbf5');
            nextButton.css('cursor', '');

            nextButton.off('click');
        }
    }


    birthMonth.on('input', updateBirthdayInputStatus);

    
    birthDay.on('input', updateBirthdayInputStatus);


    birthYear.on('input', updateBirthdayInputStatus);


    function isValidAge(month, day, year) {
        const monthIndex = new Date(Date.parse(month + ' 1, 2022')).getMonth();
        const inputDate = new Date(year, monthIndex, day);
        if (inputDate.getDate() !== day || inputDate.getMonth() !== monthIndex || inputDate.getFullYear()
        !== year) {
            return false;
        }
        const currentDate = new Date();
        const tenYearsAgo = new Date().setFullYear(currentDate.getFullYear() - 10);
        return inputDate <= tenYearsAgo;
    };


    function toBeExecutedWhenDocumentIsReady() {
        if (sessionStorage.getItem('dateOfBirth')) {
            birthMonth.val(sessionStorage.getItem('dateOfBirth').substring(0, 3));
            birthDay.val(sessionStorage.getItem('dateOfBirth').substring(3, 5));
            birthYear.val(sessionStorage.getItem('dateOfBirth').substring(5, 9));
        }

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