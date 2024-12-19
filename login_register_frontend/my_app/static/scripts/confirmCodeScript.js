import { DEEP_TRANSLATE_API_KEY } from './config.js';

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
    const salt = sessionStorage.getItem("salt");
    const hashedPassword = sessionStorage.getItem("hashedPassword");
    const fullName = sessionStorage.getItem("fullName");
    const dateOfBirth = sessionStorage.getItem("dateOfBirth");
    const queryString = window.location.search.substring(1);
    const params = new URLSearchParams(queryString);
    let currLanguage = "en";
    let timeRemainingValue = 59;
    let correctCodeValue = $("#correctCodeValue").text();
    let intervalIdForTimeRemaining;

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

    resendCode.on("click", function() {
        errorMessage.css('display', 'none');

        if (params.get("email")) {
            const emailURL = "http://localhost:8001/sendEmail";
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
                    timeRemainingValue = 59;
                    intervalIdForTimeRemaining = setInterval(updateTimeRemaining, 1000);
                }
            }).catch(_ => {
                errorMessage.css('display', 'inline-block');
                errorMessage.text('Trouble connecting to the server to resend the email.');
            });
        }

        else {
            const textURL = "http://localhost:8001/sendText"+params.get("number");
            const headers = {'Accept': 'application/json'}
            fetch(textURL, {
                method: 'POST',
                headers: headers,
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
                    timeRemainingValue = 59;
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
            window.location.href = 'http://localhost:8000/login';
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

        window.location.href = `http://localhost:8000/login?language=${currentLanguageLongForm}`;
    });


    const setLanguage = function (lang) {
        return;
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

        const apiUrl = "https://deep-translate1.p.rapidapi.com/language/translate/v2";
        const data = {
            q: "",
            source: "",
            target: ""
        };
        const options = {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'x-rapidapi-host': 'deep-translate1.p.rapidapi.com',
            'x-rapidapi-key': DEEP_TRANSLATE_API_KEY
            },
            body: null
        };
        data["source"] = currLanguage;
        data["target"] = newLanguage;

        const allElements = document.querySelectorAll('*');
        const elementsText = [];
        allElements.forEach(element => {
            const text = element.innerText.trim();
            if (text !== '' &&
            (element.tagName.toLowerCase()==="p" || element.tagName.toLowerCase()==="footer" ||
            element.tagName.toLowerCase()==="input" || element.tagName.toLowerCase()==="button") &&
            element.className!=="orLine" || element.tagName.toLowerCase()=="a") {
                for (let node of element.childNodes) {
                    if (node.nodeType === Node.TEXT_NODE) {
                        data["q"] = node.textContent;
                        options.body = JSON.stringify(data);
                        fetch(apiUrl, options)
                        .then(response => {
                            if (!response.ok) {
                                console.error('Translation network response not ok');
                            }
                            return response.json();
                        }).then(data => {
                            if(typeof data !==' undefined') {
                                node.textContent = data['data']['translations']['translatedText'];
                            }
                        }).catch(error => {
                            console.error('Trouble connecting to the server to translate the page');
                        });
                    }
                }
            }
        });

        currLanguage = newLanguage;
    }

    goBackButton.on("click", function() {
        let currentLanguageLongForm;
        if (currLanguage==="en") {
            window.location.href = 'http://localhost:8000/ageCheck'
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

        window.location.href = `http://localhost:8000/ageCheck?language=${currentLanguageLongForm}`;
    });

    confirmCode.on('input', function() {
        if(confirmCode.val().length > 5) {
            nextButton.css('background-color', '$347aeb');
            nextButton.css('cursor', 'pointer');
            nextButton.on('click', function() {
                errorMessage.css('display', 'none');

                if (correctCodeValue==parseInt(confirmCode.val()) && timeRemainingValue>0) {
                    const createUserURL = "http://localhost:8001/createUser";
                    const userData = {
                        "salt":salt,
                        "hashedPassword":hashedPassword,
                        "username":username,
                        "fullName":fullName,
                        "dateOfBirth":dateOfBirth
                    };
                    if (params.get("email")) {
                        userData["contactInfo"] = params.get("email");
                    }
                    else {
                        userData["contactInfo"] = params.get("number");
                    }
                    const headers  = {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(userData)
                    };

                    fetch(createUserURL, headers)
                    .then(response => {
                        if (!response.ok) {
                            errorMessage.css('display', 'inline-block');
                            errorMessage.text('The server had trouble creating your account.');
                            return;
                        }

                        const getTokensURL = "http://localhost:8003/cookies/getTokens";
                        const data = {
                            "username": username
                        };
                        headers["body"] = JSON.stringify(data);
                        headers["credentials"] = 'include';
                        fetch(getTokensURL, headers)
                        .then(response => {
                            if (!response.ok) {
                                errorMessage.css('display', 'inline-block');
                                errorMessage.text('Your account has been created successfully, but the server had trouble logging you in');
                                return;
                            }
                            return response.text();
                        })
                        .then(data => {
                            if(typeof data === 'undefined') {
                                return;
                            }
                            if(data==="Cookies set successfully") {
                                incorrectCode.css('display', 'none');
                                tooLateCode.css('display', 'none');
                                networkFailure.css('display', 'none');
                                window.location.href = 'http://localhost:3100/'+username;
                            }
                            else {
                                errorMessage.css('display', 'inline-block');
                                errorMessage.text('Your account has been created successfully, but the server had trouble logging you in');
                            }
                        })
                        .catch(_ => {
                            errorMessage.css('display', 'inline-block');
                            errorMessage.text(`Your account has been created successfully, but there was trouble connecting to the
                            server to log you in.`);
                        });
                    })
                    .catch(_ => {
                        errorMessage.css('display', 'inline-block');
                        errorMessage.text('There was trouble connecting to the server to create your account.')
                    });
                }
                else if(correctCodeValue==parseInt(confirmCode.val())) {
                    errorMessage.css('display', 'inline-block');
                    errorMessage.text('Your code is correct, but unfortunately it was given too late.');
                }
                else {
                    errorMessage.css('display', 'inline-block');
                    errorMessage.text('Incorrect code');
                }
            });
        }
        else {
            nextButton.css('background-color', '#82bbf5');
            nextButton.css('cursor', '');
            nextButton.on('click', null);
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