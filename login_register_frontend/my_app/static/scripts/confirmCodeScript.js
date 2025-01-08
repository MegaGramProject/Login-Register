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
    const DEEP_TRANSLATE_API_KEY = $("DEEP_TRANSLATE_API_KEY").text();
    const EMAIL_CONFIRMATION_CODE_API_KEY = $("EMAIL_CONFIRMATION_CODE_API_KEY").text();
    const TEXT_CONFIRMATION_CODE_API_KEY = $("#TEXT_CONFIRMATION_CODE_API_KEY").text();
    const CREATE_USER_API_KEY = $("#CREATE_USER_API_KEY").text();
    const username = sessionStorage.getItem("username");
    const salt = sessionStorage.getItem("salt");
    const hashedPassword = sessionStorage.getItem("hashedPassword");
    const fullName = sessionStorage.getItem("fullName");
    const dateOfBirth = sessionStorage.getItem("dateOfBirth");
    const queryString = window.location.search.substring(1);
    const params = new URLSearchParams(queryString);
    let currLanguage = "en";
    let timeRemainingValue = 59;
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
            const emailURL = "http://34.111.89.101/loginregister/api/sendConfirmationCodeEmail";
            const data = {"email": params.get("email")};
            const headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${EMAIL_CONFIRMATION_CODE_API_KEY}`
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
            const textURL = "http://34.111.89.101/loginregister/api/sendConfirmationCodeText"+params.get("number");
            const headers = {
                'Accept': 'application/json',
                'Authorization': `Bearer ${TEXT_CONFIRMATION_CODE_API_KEY}`
            }
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
            window.location.href = 'http://34.111.89.101/loginregister/login';
            return;
        }
        else {
            currentLanguageLongForm = languageCodeToLongFormMappings[currLanguage];
        }

        window.location.href = `http://34.111.89.101/loginregister/login?language=${currentLanguageLongForm}`;
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
        allElements.forEach(element => {
            const text = element.innerText.trim();
            if (text !== '' && (element.tagName.toLowerCase()==="p" || element.tagName.toLowerCase()==="footer" ||
            element.tagName.toLowerCase()==="input" || element.tagName.toLowerCase()==="button" || element.tagName.toLowerCase()=="a") &&
            element.className!=="orLine") {
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
                        "salt":salt,
                        "hashed_password":hashedPassword,
                        "username":username,
                        "full_name":fullName,
                        "date_of_birth":dateOfBirth
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
                            'Authorization': `Bearer ${CREATE_USER_API_KEY}`
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
                                nextButton.css('display', 'inline-block');
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
                                nextButton.css('display', 'inline-block');
                            }
                        })
                        .catch(_ => {
                            errorMessage.css('display', 'inline-block');
                            errorMessage.text(`Your account has been created successfully, but there was trouble connecting to the
                            server to log you in.`);
                            nextButton.css('display', 'inline-block');
                        });
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