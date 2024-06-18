document.addEventListener('DOMContentLoaded', function() {
    const appleDropdown = document.getElementById("appleDropdown");
    const androidDropdown = document.getElementById("androidDropdown");
    const windowsDropdown = document.getElementById("windowsDropdown");
    const appleDevices = document.getElementById("appleDevices");
    const androidDevices = document.getElementById("androidDevices");
    const windowsDevices = document.getElementById("windowsDevices");
    const language = document.getElementById("language");
    const lang = document.getElementById("lang");
    const loginText = document.getElementById("loginText");
    let currLanguage = "en";
    const goBackButton = document.getElementById("goBackButton");
    const apiUrl = "https://deep-translate1.p.rapidapi.com/language/translate/v2";
    const data = {"q":"","source":"","target":""};
    const options = {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-host': 'deep-translate1.p.rapidapi.com',
        'x-rapidapi-key': '14da2e3b7emsh5cd3496c28a4400p16208cjsn947339fe37a4'
        },
        body: null
    };
    const nextButton = document.getElementById("nextButton");
    const confirmCode = document.getElementById("confirmCode");
    const username = sessionStorage.getItem("username");
    const salt = sessionStorage.getItem("salt");
    const hashedPassword = sessionStorage.getItem("hashedPassword");
    const fullName = sessionStorage.getItem("fullName");
    const dateOfBirth = sessionStorage.getItem("dateOfBirth");
    let confirmationCodeValue = document.getElementById("confirmationCodeValue").textContent;
    const resendCode = document.getElementById("resendCode");
    const incorrectCode = document.getElementById("incorrectCode");
    const timeRemaining = document.getElementById("timeRemaining");
    const tooLateCode = document.getElementById("tooLateCode");
    const networkFailure = document.getElementById("networkFailure");
    let timeRemainingValue = 59;
    let intervalId;

    showTimeRemaining = function() {
        if(timeRemainingValue==0) {
            timeRemaining.innerText = "Time's up!";
        }
        else {
            timeRemaining.innerText = timeRemainingValue.toString() + "s";
            timeRemainingValue -=1;
        }
    }

    intervalId = setInterval(showTimeRemaining, 1000);


    resendCode.addEventListener("click", function() {
        const queryString = window.location.search.substring(1);
        const params = new URLSearchParams(queryString);
        if (params.get("email")) {
            const emailURL = "http://localhost:8001/sendEmail/";
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
                    throw new Error('Failed to send email');
                }
            }).then(data => {
                confirmationCodeValue = data["confirmationCode"];
                timeRemainingValue = 60;
            }).catch(error => {
                console.error(error);
            });
        }
        else {
            const textURL = "http://localhost:8001/sendText/"+params.get("number");
            const headers = {'Accept': 'application/json'}
            fetch(textURL, {
                method: 'GET',
                headers: headers,
            }).then(response => {
                if(response.status === 201) {
                    return response.json();
                }
                else {
                    throw new Error('Failed to send text');
                }
            }).then(data => {
                confirmationCodeValue = data["confirmationCode"];
                timeRemainingValue = 60;
            }).catch(error => {
                console.error(error);
            });
        }
        
    });

    loginText.addEventListener("click", function() {
        let currentLanguageLongForm;
        if (currLanguage==="en") {
            currentLanguageLongForm = "English";
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
        window.location.href = "http://localhost:8000/login?language=" + currentLanguageLongForm;
    });


    setLanguage = function (lang) {
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
        else if(lang==="Русский") {
            newLanguage = "ru";
        }
        else {
            return;
        }
        if (currLanguage === newLanguage) {
            return;
        }
        if(!currLanguage) {
            currLanguage = "en";
        }
        data["source"] = currLanguage;
        data["target"] = newLanguage;

        const allElements = document.querySelectorAll('*');
        language.innerText = lang;
        const elementsText = [];
        allElements.forEach(element => {
            const text = element.innerText.trim();
            if (text !== '' && (element.className !=="lang" && element.id!=="language") && (element.tagName.toLowerCase()==="p" || element.tagName.toLowerCase()==="footer" ||
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

        currLanguage = newLanguage;
    }

    const queryString = window.location.search.substring(1);
    const params = new URLSearchParams(queryString);
    const lingo = params.get("language");
    if (lingo) {
        setLanguage(lingo);
    } else {
        setLanguage("English");
    }


    goBackButton.addEventListener("click", function() {
        let currentLanguageLongForm;
        if (currLanguage==="en") {
            currentLanguageLongForm = "English";
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
        let ageCheckUrl;
        const queryString = window.location.search.substring(1);
        const params = new URLSearchParams(queryString);
        if (params.get("email")) {
            ageCheckUrl= "http://localhost:8000/ageCheck?language=" + currentLanguageLongForm + "&email=" + params.get("email");
        }
        else {
            ageCheckUrl = "http://localhost:8000/ageCheck?language=" + currentLanguageLongForm + "&number=" + params.get("number");
        }
        window.location.href = ageCheckUrl;

    });


    appleDropdown.addEventListener("click", function(event) {
        event.stopPropagation();
        appleDevices.style.display = 'inline-block';
    });

    androidDropdown.addEventListener("click", function(event) {
        event.stopPropagation();
        androidDevices.style.display = 'inline-block';
    });

    windowsDropdown.addEventListener("click", function(event) {
        event.stopPropagation();
        windowsDevices.style.display = 'inline-block';
    });

    confirmCode.addEventListener('input', function() {
        if(confirmCode.value.length > 5) {
            nextButton.style.backgroundColor = '#347aeb';
            nextButton.style.cursor = 'pointer';
            nextButton.onclick = function() {
                if (confirmationCodeValue==confirmCode.value && timeRemainingValue>0) {
                    const createUserURL = "http://localhost:8001/createUser/";
                    const userData = {"salt":salt,"hashedPassword":hashedPassword,"username":username, "fullName":fullName};
                    userData["dateOfBirth"] = dateOfBirth;
                    const queryString = window.location.search.substring(1);
                    const params = new URLSearchParams(queryString);
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
                            throw new Error('Network response was not ok');
                            networkFailure.style.display = 'inline-block';
                            incorrectCode.style.display =  'none';
                            tooLateCode.style.display = 'none';
                        }
                        const getTokensURL = "http://localhost:8003/getTokens";
                        const data = {"username": username};
                        headers["body"] = JSON.stringify(data);
                        fetch(getTokensURL, headers)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                                networkFailure.style.display = 'inline-block';
                                incorrectCode.style.display =  'none';
                                tooLateCode.style.display = 'none';
                            }
                            return response.json();
                        })
                        .then(data => {
                            incorrectCode.style.display =  'none';
                            tooLateCode.style.display = 'none';
                            networkFailure.style.display = 'none';
                            window.location.href = 'https://www.google.com';
                            });
                        });
                    }
                else if(confirmationCodeValue==confirmCode.value) {
                    tooLateCode.style.display = 'inline-block';
                    incorrectCode.style.display =  'none';
                    networkFailure.style.display = 'none';
                }
                else {
                    incorrectCode.style.display =  'inline-block';
                    tooLateCode.style.display = 'none';
                    networkFailure.style.display = 'none';
                }
            }
        }
        else {
            nextButton.style.backgroundColor =  '#82bbf5';
            nextButton.style.cursor = 'initial';
            nextButton.onclick = null;
        }
    });


    document.addEventListener('click', function (event) {
        if (!appleDevices.contains(event.target) && appleDevices.style.display !== 'none') {
            appleDevices.style.display = 'none';
        }
        if (!androidDevices.contains(event.target) && androidDevices.style.display !== 'none') {
            androidDevices.style.display = 'none';
        }
        if (!windowsDevices.contains(event.target) && windowsDevices.style.display !== 'none') {
            windowsDevices.style.display = 'none';
        }
    });




});