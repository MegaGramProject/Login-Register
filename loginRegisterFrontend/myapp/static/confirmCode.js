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
    const postedUsername = document.getElementById("postedUsername").textContent;
    const postedSalt = document.getElementById("postedSalt").textContent;
    const postedHashedPassword = document.getElementById("postedHashedPassword").textContent;
    const postedFullName = document.getElementById("postedFullName").textContent;
    const postedDateOfBirth = document.getElementById("postedDateOfBirth").textContent;
    const confirmationCodeValue = document.getElementById("confirmationCodeValue").textContent;

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
        else {
            currentLanguageLongForm = "中国人";
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
        else {
            currentLanguageLongForm = "中国人";
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
        const userData = {"salt":postedSalt,"hashedPassword":postedHashedPassword,"username":postedUsername, "fullName":postedFullName};
        const postOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        };
        fetch(ageCheckUrl, postOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text(); })
        .then(html => {
            history.pushState(null, '', ageCheckUrl.substring(22));
            document.open();
            document.write(html);
            document.close();
        }).catch(error => {
            console.error('Error:', error);
        });
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
                if (confirmationCode==confirmCode.value) {
                    window.location.href = 'https://www.google.com';
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