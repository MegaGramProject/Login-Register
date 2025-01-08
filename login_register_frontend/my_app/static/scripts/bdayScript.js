$(document).ready(function() {
    /*
        at the bottom of this function will be a function
        called 'toBeExecutedWhenDocumentIsReady()',
        which contains all the code to be executed when
        document is ready
    */
    const whyBday = $("#whyBday");
    const whyBdayPopup = $("#whyBdayPopup");
    const exitPopup = $("#exitPopup");
    const birthMonth = $("#birthMonth");
    const birthDay = $("#birthDay");
    const birthYear = $("#birthYear");
    const nextButton = $("#nextButton");
    const goBackText = $("#goBackText");
    const loginText = $("#loginText");
    const errorMessage = $("#errorMessage");
    const darkScreen = $("#darkScreen");
    const DEEP_TRANSLATE_API_KEY = $("DEEP_TRANSLATE_API_KEY").text();
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
        const data = {"q":"","source":"","target":""};
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
        language.innerText = lang;
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
            history.pushState(null, 'Age Check', 'http://34.111.89.101/loginregister/ageCheck');
        }
        else {
            history.pushState(null, 'Age Check', `http://34.111.89.101/loginregister/ageCheck?language=${languageCodeToLongFormMappings[newLanguage]}`);
        }
        currLanguage = newLanguage;
    }
    

    goBackText.on("click", function() {
        let currentLanguageLongForm;
        if (currLanguage==="en") {
            window.location.href = 'http://34.111.89.101/loginregister/signup';
            return;
        }
        else {
            currentLanguageLongForm = languageCodeToLongFormMappings[currLanguage];
        }

        window.location.href = `http://34.111.89.101/loginregister/signup?language=${currentLanguageLongForm}`;
    });
    
    whyBday.on('click', function() {
        darkScreen.css('display', '');
        whyBdayPopup.css('display', 'flex');
    });

    exitPopup.on('click', function() {
        darkScreen.css('display', 'none');
        whyBdayPopup.css('display', 'none');
    });

    darkScreen.on('click', function() {
        darkScreen.css('display', 'none');
        whyBdayPopup.css('display', 'none');
    });

    const takeUserToFinalPage = function() {
        nextButton.css('display', 'none');
        goBackText.css('display', 'none');

        let currentLanguageLongForm = languageCodeToLongFormMappings[currLanguage];
        let confirmCodeUrl;
        if (sessionStorage.getItem("email")) {
            confirmCodeUrl= "http://34.111.89.101/loginregister/confirmCode?language=" + currentLanguageLongForm + "&email=" +
            sessionStorage.getItem("email");
        }
        else {
            confirmCodeUrl = "http://34.111.89.101/loginregister/confirmCode?language=" + currentLanguageLongForm + "&number=" +
            sessionStorage.getItem("number");
        }
        sessionStorage.setItem("dateOfBirth", birthMonth.val() + birthDay.val() + birthYear.val());

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

    birthMonth.on('input', function() {
        if(birthMonth.val() && birthDay.val() && birthYear.val() && isValidAge(birthMonth.val(), parseInt(birthDay.val(),10),
        parseInt(birthYear.val(),10))) {
            errorMessage.css('display', 'none');
            nextButton.css('background-color', '#347aeb');
            nextButton.css('cursor', 'pointer');
            nextButton.off('click');
            nextButton.on('click', () => takeUserToFinalPage());
        }
        else if(birthMonth.val() && birthDay.val() && birthYear.val()) {
            errorMessage.css('display', 'inline-block');
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
    });

    birthDay.on('input', function() {
        if(birthMonth.val() && birthDay.val() && birthYear.val() && isValidAge(birthMonth.val(), parseInt(birthDay.val(),10),
        parseInt(birthYear.val(),10))) {
            errorMessage.css('display', 'none');
            nextButton.css('background-color', '#347aeb');
            nextButton.css('cursor', 'pointer');
            nextButton.off('click');
            nextButton.on('click', () => takeUserToFinalPage());
        }
        else if(birthMonth.val() && birthDay.val() && birthYear.val()) {
            errorMessage.css('display', 'inline-block');
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
    });
    
    birthYear.on('input', function() {
        if(birthMonth.val() && birthDay.val() && birthYear.val() && isValidAge(birthMonth.val(), parseInt(birthDay.val(),10),
        parseInt(birthYear.val(),10))) {
            errorMessage.css('display', 'none');
            nextButton.css('background-color', '#347aeb');
            nextButton.css('cursor', 'pointer');
            nextButton.off('click');
            nextButton.on('click', () => takeUserToFinalPage());
        }
        else if (birthMonth.val() && birthDay.val() && birthYear.val()) {
            errorMessage.css('display', 'inline-block');
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
    });

    const isValidAge = function(month, day, year) {
        const monthIndex = new Date(Date.parse(month + " 1, 2022")).getMonth();
        const inputDate = new Date(year, monthIndex, day);
        if (inputDate.getDate() !== day || inputDate.getMonth() !== monthIndex || inputDate.getFullYear() !== year) {
            return false;
        }
        
        const currentDate = new Date();
        const tenYearsAgo = new Date();
        tenYearsAgo.setFullYear(currentDate.getFullYear() - 10);
        return inputDate <= tenYearsAgo;
    };
    
    window.setLanguage = setLanguage;

    function toBeExecutedWhenDocumentIsReady() {
        if (sessionStorage.getItem("dateOfBirth")) {
            birthMonth.val(sessionStorage.getItem("dateOfBirth").substring(0, 3));
            birthDay.val(sessionStorage.getItem("dateOfBirth").substring(3, 5));
            birthYear.val(sessionStorage.getItem("dateOfBirth").substring(5, 9));
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