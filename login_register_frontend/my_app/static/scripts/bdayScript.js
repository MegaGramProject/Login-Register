import { DEEP_TRANSLATE_API_KEY } from './config.js';

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
    let currLanguage = "en";

    loginText.on("click", function() {
        let currentLanguageLongForm;
        if (currLanguage==="en") {
            window.location.href = "http://localhost:8000/login";
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
        let newLanguage;
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
        const elementsText = [];
        allElements.forEach(element => {
            const text = element.innerText.trim();
            if (text !== '' && (element.tagName.toLowerCase()==="p" || element.tagName.toLowerCase()==="footer" ||
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
    

    goBackText.on("click", function() {
        let currentLanguageLongForm;
        if (currLanguage==="en") {
            window.location.href = 'http://localhost:8000/signup';
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

        window.location.href = `http://localhost:8000/signup?language=${currentLanguageLongForm}`;
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
        else {
            currentLanguageLongForm = "Русский";
        }

        let confirmCodeUrl;
        const queryString = window.location.search.substring(1);
        const params = new URLSearchParams(queryString);
        if (params.get("email")) {
            confirmCodeUrl= "http://localhost:8000/confirmCode?language=" + currentLanguageLongForm + "&email=" + params.get("email");
        }
        else {
            confirmCodeUrl = "http://localhost:8000/confirmCode?language=" + currentLanguageLongForm + "&number=" + params.get("number");
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
        if(birthMonth.val() && birthDay.val() && birthYear.val() && isValidAge(birthMonth.val(), parseInt(birthDay.val(),10), parseInt(birthYear.val(),10))) {
            errorMessage.css('display', 'none');
            nextButton.css('background-color', '#347aeb');
            nextButton.css('cursor', 'pointer');
            nextButton.on('click', () => takeUserToFinalPage());
        }
        else if(birthMonth.val() && birthDay.val() && birthYear.val()) {
            errorMessage.css('display', 'inline-block');
            nextButton.css('background-color', '#82bbf5');
            nextButton.css('cursor', '');
            nextButton.on('click', null);
        }
        else {
            errorMessage.css('display', 'none');
            nextButton.css('background-color', '#82bbf5');
            nextButton.css('cursor', '');
            nextButton.on('click', null);
        }
    });

    birthDay.on('input', function() {
        if(birthMonth.val() && birthDay.val() && birthYear.val() && isValidAge(birthMonth.val(), parseInt(birthDay.val(),10), parseInt(birthYear.val(),10))) {
            errorMessage.css('display', 'none');
            nextButton.css('background-color', '#347aeb');
            nextButton.css('cursor', 'pointer');
            nextButton.on('click', () => takeUserToFinalPage());
        }
        else if(birthMonth.val() && birthDay.val() && birthYear.val()) {
            errorMessage.css('display', 'inline-block');
            nextButton.css('background-color', '#82bbf5');
            nextButton.css('cursor', '');
            nextButton.on('click', null);
        }
        else {
            errorMessage.css('display', 'none');
            nextButton.css('background-color', '#82bbf5');
            nextButton.css('cursor', '');
            nextButton.on('click', null);
        }
    });
    
    birthYear.on('input', function() {
        if(birthMonth.val() && birthDay.val() && birthYear.val() && isValidAge(birthMonth.val(), parseInt(birthDay.val(),10), parseInt(birthYear.val(),10))) {
            errorMessage.css('display', 'none');
            nextButton.css('background-color', '#347aeb');
            nextButton.css('cursor', 'pointer');
            nextButton.on('click', () => takeUserToFinalPage());
        }
        else if (birthMonth.val() && birthDay.val() && birthYear.val()) {
            errorMessage.css('display', 'inline-block');
            nextButton.css('background-color', '#82bbf5');
            nextButton.css('cursor', '');
            nextButton.on('click', null);
        }
        else {
            errorMessage.css('display', 'none');
            nextButton.css('background-color', '#82bbf5');
            nextButton.css('cursor', '');
            nextButton.on('click', null);
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
            birthYear.val(sessionStorage.getItem("dateOfBirth").slice(-4));
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