document.addEventListener('DOMContentLoaded', function() {
    const appleDropdown = document.getElementById("appleDropdown");
    const androidDropdown = document.getElementById("androidDropdown");
    const windowsDropdown = document.getElementById("windowsDropdown");
    const appleDevices = document.getElementById("appleDevices");
    const androidDevices = document.getElementById("androidDevices");
    const windowsDevices = document.getElementById("windowsDevices");
    const whyBday = document.getElementById("whyBday");
    const language = document.getElementById("language");
    const lang = document.getElementById("lang");
    let currLanguage = "en";
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
    const whyBdayPopup = document.getElementById("whyBdayPopup");
    const main = document.getElementById("main");
    const exitPopup = document.getElementById("exitPopup");
    const birthMonth = document.getElementById("birthMonth");
    const birthDay = document.getElementById("birthDay");
    const birthYear = document.getElementById("birthYear");
    const nextButton = document.getElementById("nextButton");
    const goBackText = document.getElementById("goBackText");
    const loginText = document.getElementById("loginText");
    const username = sessionStorage.getItem("username");
    const salt = sessionStorage.getItem("salt");
    const hashedPassword = sessionStorage.getItem("hashedPassword");
    const fullName = sessionStorage.getItem("fullName");
    const errorMessage = document.getElementById("errorMessage");

    if (sessionStorage.getItem("dateOfBirth")) {
        birthMonth.value = sessionStorage.getItem("dateOfBirth").substring(0, 3);
        birthYear.value = sessionStorage.getItem("dateOfBirth").slice(-4);
    }

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
        if (currLanguage === newLanguage) {
            return;
        }
        if (!currLanguage) {
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
    let lingo = params.get("language");
    if (lingo) {
        setLanguage(lingo);
    } else {
        setLanguage("English");
    }
    if (params.get("dateOfBirth")) {
        const dob = params.get("dateOfBirth");
        birthMonth.value = dob.substring(0, 3);
        if(dob.length==8) {
            birthDay.value = dob[3];
            birthYear.value = dob.substring(4);
        }
        else {
            birthDay.value =  dob.substring(3,5);
            birthYear.value = dob.substring(5);
        }
    }
    

    goBackText.addEventListener("click", function() {
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
        let signUpURL = "http://localhost:8000/signup?language=" + currentLanguageLongForm;
        window.location.href = signUpURL;
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

    
    whyBday.addEventListener('click', function(event) {
        main.style.opacity = '0.25';
        whyBdayPopup.style.display = 'flex';

    });

    exitPopup.addEventListener('click', function(event) {
        main.style.opacity = '1';
        whyBdayPopup.style.display = 'none';

    });

    takeUserToConfirm = function() {
        nextButton.style.display = 'none';
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
        let confirmCodeUrl;
        const queryString = window.location.search.substring(1);
        const params = new URLSearchParams(queryString);
        if (params.get("email")) {
            confirmCodeUrl= "http://localhost:8000/confirmCode?language=" + currentLanguageLongForm + "&email=" + params.get("email");
        }
        else {
            confirmCodeUrl = "http://localhost:8000/confirmCode?language=" + currentLanguageLongForm + "&number=" + params.get("number");
        }
        sessionStorage.setItem("dateOfBirth", birthMonth.value + birthDay.value + birthYear.value);
        window.location.href = confirmCodeUrl;
    }

    birthMonth.addEventListener('input', function() {
        birthMonth.style.borderColor = "#caced1";
        if(birthMonth.value && birthDay.value && birthYear.value && isValidDate(birthMonth.value, parseInt(birthDay.value,10), parseInt(birthYear.value,10))) {
            errorMessage.style.display = "none";
            nextButton.style.backgroundColor = '#347aeb';
            nextButton.style.cursor = 'pointer';
            nextButton.onclick = takeUserToConfirm;
        }
        else if(birthMonth.value && birthDay.value && birthYear.value) {
            errorMessage.style.display = "inline-block";
            nextButton.style.backgroundColor =  '#82bbf5';
            nextButton.style.cursor = 'initial';
            nextButton.onclick = null;
        }
        else {
            nextButton.style.backgroundColor =  '#82bbf5';
            nextButton.style.cursor = 'initial';
            nextButton.onclick = null;
        }
    });

    birthDay.addEventListener('input', function() {
        birthDay.style.borderColor = "#caced1";
        if(birthMonth.value && birthDay.value && birthYear.value && isValidDate(birthMonth.value, parseInt(birthDay.value,10), parseInt(birthYear.value,10))) {
            errorMessage.style.display = "none";
            nextButton.style.backgroundColor = '#347aeb';
            nextButton.style.cursor = 'pointer';
            nextButton.onclick = takeUserToConfirm;
        }
        else if(birthMonth.value && birthDay.value && birthYear.value) {
            errorMessage.style.display = "inline-block";
            nextButton.style.backgroundColor =  '#82bbf5';
            nextButton.style.cursor = 'initial';
            nextButton.onclick = null;
        }
        else {
            nextButton.style.backgroundColor =  '#82bbf5';
            nextButton.style.cursor = 'initial';
            nextButton.onclick = null;
        }
    });
    
    birthYear.addEventListener('input', function() {
        birthYear.style.borderColor = "#caced1";
        if(birthMonth.value && birthDay.value && birthYear.value && isValidDate(birthMonth.value, parseInt(birthDay.value,10), parseInt(birthYear.value,10))) {
            errorMessage.style.display = "none";
            nextButton.style.backgroundColor = '#347aeb';
            nextButton.style.cursor = 'pointer';
            nextButton.onclick = takeUserToConfirm;
        }
        else if (birthMonth.value && birthDay.value && birthYear.value) {
            errorMessage.style.display = "inline-block";
            nextButton.style.backgroundColor =  '#82bbf5';
            nextButton.style.cursor = 'initial';
            nextButton.onclick = null;
        }
        else {
            nextButton.style.backgroundColor =  '#82bbf5';
            nextButton.style.cursor = 'initial';
            nextButton.onclick = null;
        }
    });


    isValidDate = function(month, day, year) {
        if (2024-year<10) {
            return false;
        }
        if (day>29 && month==='feb') {
            return false;
        }
        if (day == 31 && (month==='apr' || month==='jun' || month==='sep' || month==='nov' || month==='feb')) {
            return false;
        }
        if(day== 29 && month==='feb' && year%4!== 0) {
            return false;
        }
        return true;
        
    }
    
    

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