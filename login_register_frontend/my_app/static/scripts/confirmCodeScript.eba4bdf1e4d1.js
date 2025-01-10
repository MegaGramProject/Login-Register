$(document).ready(function() {
    /*
        at the bottom of this function will be a function
        called 'toBeExecutedWhenDocumentIsReady()',
        which contains all the code to be executed when
        document is ready
    */
    const loginText = $("#loginText");
    const goBackButton = $("#goBackButton");
    const nextButton = $("#nextButton");
    const timeRemaining = $('#timeRemaining');
    const confirmCode = $("#confirmCode");
    const resendCode = $("#resendCode");
    const errorMessage = $("#errorMessage");
    const username = sessionStorage.getItem("username");
    const fullName = sessionStorage.getItem("fullName");
    const password = sessionStorage.getItem("password");
    const dateOfBirth = sessionStorage.getItem("dateOfBirth");
    const queryString = window.location.search.substring(1);
    const params = new URLSearchParams(queryString);
    let currLanguage = "en";
    let timeRemainingValue = 59;

    //DISCLAIMER! Yes, I am aware the correctCodeValue should not be exposed in frontend.
    //For the sake of convenience(& since this website is for the sake of portfolio and doesn't actually have customers),
    //I just left it as it is.
    let correctCodeValue = $("#CORRECT_CODE_VALUE").text(); 
    let intervalIdForTimeRemaining;
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
    const monthToIndexMappings = {
        'jan': 0,
        'feb': 1,
        'mar': 2,
        'apr': 3,
        'may': 4,
        'jun': 5,
        'jul': 6,
        'aug': 7,
        'sep': 8,
        'oct': 9,
        'nov': 10,
        'dec': 11
      };

    const updateTimeRemaining = function() {
        if(timeRemainingValue==0) {
            timeRemaining.text("Time's up!");
            clearInterval(intervalIdForTimeRemaining);
        }
        else {
            timeRemaining.text(timeRemainingValue.toString() + "s");
            timeRemainingValue -=1;
        }
    }

    const getDateObjectFromDOBString = function(DOBString) {
        //Example DOBString: 'apr022008' which represents 'April 2nd, 2008'
        const month = DOBString.substring(3);
        const day = DOBString.substring(3,5);
        const year = DOBString.substring(5);
        return new Date(parseInt(year), monthToIndexMappings[month], parseInt(day));
    }

    resendCode.on("click", function() {
        errorMessage.css('display', 'none');

        if (params.get("email")) {
            const emailURL = "http://34.111.89.101/loginregister/api/sendConfirmationCodeEmail";
            const data = {"email": params.get("email")};
            const headers = new Headers({
                'Content-Type': 'application/json'
            });

            fetch(emailURL, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data)
            }).then(response => {
                if (response.status === 201) {
                    return response.json();
                }
                else {
                    errorMessage.css('display', 'inline-block');
                    errorMessage.text('The server could not resend the email');
                }
            }).then(data => {
                if(typeof data !== 'undefined') {
                    correctCodeValue = data["confirmation_code"];
                    clearInterval(intervalIdForTimeRemaining);
                    timeRemaining.text('60s');
                    timeRemainingValue = 60;
                    intervalIdForTimeRemaining = setInterval(updateTimeRemaining, 1000);
                }
            }).catch(_ => {
                errorMessage.css('display', 'inline-block');
                errorMessage.text('Trouble connecting to the server to resend the email.');
            });
        }

        else {
            const textURL = "http://34.111.89.101/loginregister/api/sendConfirmationCodeText"+params.get("number");
            fetch(textURL, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json'
                },
            }).then(response => {
                if(response.status === 201) {
                    return response.json();
                }
                else {
                    errorMessage.css('display', 'inline-block');
                    errorMessage.text('The server could not resend the text');
                }
            }).then(data => {
                if(typeof data !== 'undefined') {
                    correctCodeValue = data["confirmation_code"];
                    clearInterval(intervalIdForTimeRemaining);
                    timeRemaining.text('60s');
                    timeRemainingValue = 60;
                    intervalIdForTimeRemaining = setInterval(updateTimeRemaining, 1000);
                }
            }).catch(_ => {
                errorMessage.css('display', 'inline-block');
                errorMessage.text('Trouble connecting to the server to resend the text.');
            });
        }
    });

    loginText.on("click", function() {
        let currentLanguageLongForm;
        if (currLanguage==="en") {
            window.location.href = 'http://34.111.89.101/loginregister/login';
            return;
        }
        else {
            currentLanguageLongForm = languageCodeToLongFormMappings[currLanguage];
        }

        window.location.href = `http://34.111.89.101/loginregister/login?language=${currentLanguageLongForm}`;
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
        if(!currLanguage) {
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
            else {
                redisCachedLanguageTranslations = await response.json();
            }
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
            element.tagName.toLowerCase()==="input" || element.tagName.toLowerCase()==="button" || element.tagName.toLowerCase()=="a") &&
            element.className!=="orLine") {
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

        if(listsOfNodeTextsToTranslate.length>0) {
            let translatedTexts = [];
            try {
                const response1 = await fetch( `http://34.111.89.101/loginregister/api/translateTextsWithRapidAPIDeepTranslate`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        input_texts: listsOfNodeTextsToTranslate,
                        source_lang_shortened_code: currLanguage,
                        target_lang_shortened_code: newLanguage
                    })
                });
                if(!response1.ok) {
                    console.error("The server had trouble providing the 'not-already-Redis-cached' language-translations");
                }
                else {
                    translatedTexts = await response1.json();
                    for(let i=0; i<translatedTexts.length; i++) {
                        listOfNodesToTranslate[i].textContent = translatedTexts[i];
                    }
                }
            }
            catch (error) {
                console.error(
                    "There was trouble connecting to the server to get the 'not-already-Redis-cached' language-translations"
                );
            }
        }

        if(newLanguage==='en') {
            history.pushState(null, 'Confirm Code', 'http://34.111.89.101/loginregister/confirmCode');
        }
        else {
            history.pushState(null, 'Confirm Code',
            `http://34.111.89.101/loginregister/confirmCode?language=${languageCodeToLongFormMappings[newLanguage]}`);
        }
        
        currLanguage = newLanguage;
    }

    goBackButton.on("click", function() {
        let currentLanguageLongForm;
        if (currLanguage==="en") {
            window.location.href = 'http://34.111.89.101/loginregister/ageCheck'
            return;
        }
        else {
            currentLanguageLongForm = languageCodeToLongFormMappings[currLanguage];
        }

        window.location.href = `http://34.111.89.101/loginregister/ageCheck?language=${currentLanguageLongForm}`;
    });

    confirmCode.on('input', function() {
        if(confirmCode.val().length > 5) {
            nextButton.css('background-color', '$347aeb');
            nextButton.css('cursor', 'pointer');
            nextButton.off('click');
            nextButton.on('click', function() {
                errorMessage.css('display', 'none');
                nextButton.css('display', 'none');
                if (correctCodeValue==parseInt(confirmCode.val()) && timeRemainingValue>0) {
                    const createUserURL = "http://34.111.89.101/loginregister/api/createUser";
                    const userData = {
                        "username":username,
                        "full_name":fullName,
                        "password": password,
                        "date_of_birth": getDateObjectFromDOBString(dateOfBirth)
                    };
                    if (params.get("email")) {
                        userData["contact_info"] = params.get("email");
                    }
                    else {
                        userData["contact_info"] = params.get("number");
                    }
                    const headers  = {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'credentials': 'include'
                        },
                        body: JSON.stringify(userData)
                    };

                    fetch(createUserURL, headers)
                    .then(response => {
                        if (!response.ok) {
                            errorMessage.css('display', 'inline-block');
                            errorMessage.text('The server had trouble creating your account.');
                            nextButton.css('display', 'inline-block');
                            return;
                        }

                        window.location.href = `http://34.111.89.101/homefeed/${username}`;
                    })
                    .catch(_ => {
                        errorMessage.css('display', 'inline-block');
                        errorMessage.text('There was trouble connecting to the server to create your account.');
                        nextButton.css('display', 'inline-block');
                    });
                }
                else if(correctCodeValue==parseInt(confirmCode.val())) {
                    errorMessage.css('display', 'inline-block');
                    errorMessage.text('Your code is correct, but unfortunately it was given too late.');
                    nextButton.css('display', 'inline-block');
                }
                else {
                    errorMessage.css('display', 'inline-block');
                    errorMessage.text('Incorrect code');
                    nextButton.css('display', 'inline-block');
                }
            });
        }
        else {
            nextButton.css('background-color', '#82bbf5');
            nextButton.css('cursor', '');
            nextButton.off('click');
        }
    });

    window.setLanguage = setLanguage;

    function toBeExecutedWhenDocumentIsReady() {
        intervalIdForTimeRemaining = setInterval(updateTimeRemaining, 1000);

        const lingo = params.get("language");
        if (lingo) {
            setLanguage(lingo);
        }
    }

    toBeExecutedWhenDocumentIsReady();
});