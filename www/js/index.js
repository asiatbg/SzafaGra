function init() {
    document.addEventListener('deviceready', onDeviceReady, false);
}

function onDeviceReady() {
    console.log(navigator.camera);
}
const btnLogin = document.getElementById('btnLogin');
const txtEmailLogin = document.getElementById('txtEmailLogin');
const txtPasswordLogin = document.getElementById('txtPasswordLogin');
const btnGoogleLogin = document.getElementById('btnGoogleLogin');
const txtPasswordConfirmRegistration = document.getElementById('txtPasswordConfirmRegistration');
const txtPasswordRegistration = document.getElementById('txtPasswordRegistration');
const txtEmailRegistration = document.getElementById('txtEmailRegistration');
const btnSignUp = document.getElementById('btnSignUp');
const btnFacebookLogin = document.getElementById('btnFacebookLogin');
const btnLogOut = document.getElementById('btnLogOut');
const txtEmailReset = document.getElementById('txtEmailReset');
const btnSendPass = document.getElementById('btnSendPass');
const btnAcceptImage = document.getElementById('btnAcceptImage');
const hideWardrobeDraw = document.getElementsByClassName("hideWardrobeDraw");
var wardrobe, category, warName, selectedCategory, selectedWeather = [], ul, li, snippet, a, text;
let wardrobeNameForDraw = "";

// Sign up with email and password
btnSignUp.addEventListener('click', function () {
    const email = txtEmailRegistration.value;
    const password = txtPasswordRegistration.value;
    const passwordConfirm = txtPasswordConfirmRegistration.value;

    if (password == "" || passwordConfirm == "" || email == "") {
        alert("Fill in all fields");
        return;
    }
    if (password === passwordConfirm) {
        firebase.auth().createUserWithEmailAndPassword(email, password).then(function () {
            alert("Account created");
            window.location.href = "#login";
        }).catch(function (error) {
            alert(error);
        });
    } else {
        alert("Wrong password");
    }

});

//Login with email and password
btnLogin.addEventListener('click', e => {
    const email =  txtEmailLogin.value;
    const password = txtPasswordLogin.value;
    if (password == "" || email == "") {
        alert("Fill in all fields");
        return;
    }
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function (result) {
            window.location.href = "#main";

        }).catch(function (error) {
            alert(error);
        });

});

//Login with Google
btnGoogleLogin.addEventListener('click', e => {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider)
        .then(function () {
            return firebase.auth().getRedirectResult();
        }).then(function (result) {
            window.location.href = "#main";

        }).catch(function (error) {
            alert(error.message);

        });
});

//Login with Facebook
btnFacebookLogin.addEventListener('click', e => {
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)
        .then(function () {
            var provider = new firebase.auth.FacebookAuthProvider();
            firebase.auth().signInWithRedirect(provider).then(function () {
                return firebase.auth().getRedirectResult();
            }).then(function (result) {
                if (result.credential) {
                    window.location.href = "#main";

                }
                var user = result.user;
            }).catch(function (error) {
                if (error.code === "auth/account-exists-with-different-credential") {
                    alert("This email is already used!");
                }
            });
        });
});

// Reset password
btnSendPass.addEventListener('click', e => {
    const email = txtEmailReset.value;
    var auth = firebase.auth();
    if (email == "") {
        alert("Fill in all fields");
        return 0;
    }
    auth.sendPasswordResetEmail(email).then(function () {
        alert("email sent");
    }).catch(function (error) {
        alert(error);
    });
});

//Sign out
function logOut() {
    firebase.auth().signOut()
        .then(function () {
            // Sign-out successful.
            window.location.href = "#login";
        }).catch(function (error) {
            console.log(error.message);
        });
}

//Show and hide wardrobe in lottery
function btnDraw() {
    for (let i = 0; i < hideWardrobeDraw.length; i++) {
        if (hideWardrobeDraw[i].style.display === "block") {
            hideWardrobeDraw[i].style.display = "none";
        } else {
            hideWardrobeDraw[i].style.display = "block";
        }
    }

}

//Take picture from gallery
function openFilePicker(selection) {
    const srcType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
    const options = setOptions(srcType);

    navigator.camera.getPicture(function cameraSuccess(imageUri) {
        window.location.href = "#liamneeson";
        displayImage(imageUri);
    }, function cameraError(error) {
        console.debug("Unable to obtain picture: " + error, "app");

    }, options);
}

function openCamera(selection) {
    const srcType = Camera.PictureSourceType.CAMERA;
    const options = setOptions(srcType);

    navigator.camera.getPicture(function cameraSuccess(imageUri) {
        window.location.href = "#liamneeson";
        displayImage(imageUri);
    }, function cameraError(error) {
        console.debug("Unable to obtain picture: " + error, "app");
    }, options);
}

// Option for openFilePicker() and openCamera()
function setOptions(srcType) {
    const options = {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        // In this app, dynamically set the picture source, Camera or photo gallery
        sourceType: srcType,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE,
        allowEdit: true,
        correctOrientation: true  //Corrects Android orientation quirks
    }
    return options;
}

// Show image in activity
function displayImage(imgUri) {
    const imgContainer = document.getElementById('containerImg');
    if (document.getElementById('addedImg') == null) {
        const img = document.createElement("img");
        img.id = "addedImg";
        img.src = 'data:image/png;base64,' + imgUri;
        img.style.height = "100%";
        containerImg.appendChild(img);
    } else {
        document.getElementById('addedImg').src = 'data:image/png;base64,' + imgUri;
    }
}

function setWardrobeName() {
    var name = prompt("Please enter wardrobe name, 10 characters max", "Ciuszki");
    if (name == '')
    {
        alert("Enter valid name!");
        return;
    }
    if (name.length > 10) {
        alert("10 characters max!");
        return;
    }
    return name;
}

function uploadToDatabase(downloadURL) {
    var minTemp = $('#range-from').val();
    var maxTemp = $('#range-to').val();

    if (minTemp == '' || maxTemp == '' || selectedCategory == '' || selectedWeather == '') {
        alert("Upload failed, you must fill in all fields!");
        return;
    }
    var postKey = firebase.database().ref('Users/' + getCurrentUser().uid + '/' + wardrobe + '/' + selectedCategory + '/').push().key;
    var updates = {};
    var postData = {
        key: postKey,
        url: downloadURL,
        category: selectedCategory,
        minTemp: minTemp,
        maxTemp: maxTemp,
        selectedWeather
    };
    updates['Users/' + getCurrentUser().uid + '/' + wardrobe + '/' + selectedCategory + '/' + postKey] = postData;
    firebase.database().ref().update(updates);
    alert("successful send!");
}

// Takes the date and changes it to a unique name 
function uniqueNameFile() {
    const date = new Date();
    return date.getTime().toString()
}

// takes the logged-in user
function getCurrentUser() {
    return firebase.auth().currentUser;
}

function uploadToStorage(imgUri) {
    var imgStorage = imgUri;
    var fileName = uniqueNameFile();
    var storageRef = firebase.storage().ref(getCurrentUser().uid + '/' + wardrobe + '/' + fileName);
    var uploadTask = storageRef.putString(imgStorage, 'data_url');
    uploadTask.on('state_changed', function (snapshot) {
    }, function (error) {
        console.log(error)
    }, function () {
        var downloadURL = uploadTask.snapshot.downloadURL;
        uploadToDatabase(downloadURL, fileName);
    });
}

btnAcceptImage.addEventListener('click', function () {
    getValueOfSelect();
    const imgUri = document.getElementById('addedImg').src;
    uploadToStorage(imgUri);
    window.location.href = '#wardrobe-cats';
});

// display wardrobe name in wardrobe-cats, get wardrobe name for database
function moveToWardrobeCats(getElement) {
    const wardrobeButton = document.getElementById(getElement);
    wardrobeButton.addEventListener('click', function () {
        document.getElementById('war-nr').innerHTML = getElement;
        wardrobe = getElement;
        window.location.href = '#wardrobe-cats';
    });
}

//get clicked name of wardrobe
$('.hideWardrobeDraw').click(function (event) {
    wardrobeNameForDraw = $(event.target).text();

});


// loading wardrobes to #main and Draw
function loadWardrobes() {
    $(".hideWardrobeDraw").empty();
    if (isUserSignedIn == false)
        return;

    return firebase.database().ref('Users/' + getCurrentUser().uid + '/').once('value').then(function (snapshot) {
        var postObject = snapshot.val();
        if (postObject == null) {
            return;
        }
        var warNum = Object.getOwnPropertyNames(postObject).toString();
        var wardrobeAmountArray = warNum.split(",");

        for (var i = 1; i <= wardrobeAmountArray.length; i++) {          
            
            $('.menu-wardrobe').append( createWardrobeImg(wardrobeAmountArray[i - 1]) );
             moveToWardrobeCats( wardrobeAmountArray[i - 1] );
            // Add li to Draw wardrobe
            for (let x = 0; x < hideWardrobeDraw.length; x++) {
                ul = document.createElement("ul");
                ul.classList.add("hideShowWardrobe");
                hideWardrobeDraw[x].appendChild(ul);

                // Put li and a tags into ul in div
                li = document.createElement("li");
                snippet = document.createTextNode(wardrobeAmountArray[i - 1]);

                li.classList.add(wardrobeAmountArray[i - 1]);
                ul.appendChild(li);

                a = document.createElement('a');
                a.href = "#lottery";
                a.appendChild(snippet);
                li.appendChild(a);
            }
        }
    });
}

//check if user is logged
function isUserSignedIn() {
    var token = getCurrentUser().uid;
    if (getCurrentUser()) {
        return true;
    } else {
        return false
    }
}

// download and display clothes for particular wardrobe and category
function loadClothes() {
    if (isUserSignedIn == false)
        return;

    $("#putImage").empty();
    return firebase.database().ref('Users/' + getCurrentUser().uid + '/' + wardrobe + '/' + category + '/').once('value', function (snapshot) {
        var postObject = snapshot.val();
        console.log(snapshot);
        if (postObject === null)
            return;

        var keys = Object.keys(postObject);
        for (var i = 0; i < keys.length; i++) {
            var currentObj = postObject[keys[i]];
            //displaying image on #clothes
            if (i % 2 == 0) {
                var div = document.createElement("div");
                $(div).addClass("i");
                $("#putImage").append(div);
            }
            var image = document.createElement("img");
            image.src = currentObj.url;
            $(image).addClass("contentImage");
            $(image).attr("id", currentObj.key);
            $(div).append(image);
        }

    });
}

$(document).on('taphold', '.menu-wardrobe img', tapWardrobe);
$(document).on('taphold', '.i img', tapImage);
//$.event.special.tap.tapholdThreshold = 2000; //tap This value dictates how long the user must hold their tap before the taphold event is fired on the target element

//loading wardrobes just in case if user delete all the pictures from categories
$(document).on('pageshow', 'body', function () {
    var activePage = $.mobile.activePage.attr('id');
    if (activePage == "main") {
        $(".menu-wardrobe").empty();
        loadWardrobes();
    }
    else if (activePage == "lottery") {
        getCityToDraw();
    }
});

//ask user to confirm delete
function deleteDecision() {
    var decision = confirm("Are you sure, you want to delete it?");
    if (decision == true)
        return true;

    return false;
}

// deleting image on taphold
function tapImage(event) {

    if (deleteDecision()) {
        var imageID = $(this).attr("id");
        $("#" + imageID).remove();
        var ref = firebase.database().ref('Users/' + getCurrentUser().uid + '/' + wardrobe + '/' + category + '/' + imageID + '/');
        ref.remove()
            .then(function () {
            })
            .catch(function (error) {
            });
    }
}

function deleteWardrobe(wardrobeID) { 
    var ref = firebase.database().ref('Users/' + getCurrentUser().uid + '/' + wardrobeID + '/');
    ref.remove()
        .then(function () {

        })
        .catch(function (error) {
            console.log("Remove failed: " + error.message)
        });
}

function tapWardrobe(event) { 
    if (deleteDecision()) {
        var wardrobeID = $(this).attr("id");
        $('#' + wardrobeID).get(0).nextSibling.remove(); // deleting span with wardrobe name
        $("#" + wardrobeID).parent().remove();
        $("." + wardrobeID).remove();
        deleteWardrobe(wardrobeID);
    }
}

function getCityToDraw() {
    var cityName = prompt("Enter city name ", "Kraków");
    console.log(cityName);
    if (cityName == '') {
        alert("Enter valid city name!");
        return;
    }
    getActualWeatherConditions(cityName);


}

function getActualWeatherConditions(cityName) {
    var city = cityName;
    var key = '33dbe3b930c23ad2c7a0630b49f3e440';

    $.get('http://api.openweathermap.org/data/2.5/weather', { q: city, appid: key, units: 'metric' }, function (data) {
        var zm = '', mainWeatherCondition = '';
        $.each(data.weather, function (index, val) {
            zm = data.main.temp;
            mainWeatherCondition = val.main;
        });
        if (zm == "") {
            zm = "15";
        }
        drawClothes(wardrobeNameForDraw, parseInt(zm), mainWeatherCondition);
        console.log(zm);
    }, 'json');

}

function getValueOfSelect() {
    selectedWeather = [];
    var selectWeather = document.getElementsByClassName('selectWeather');
    for (let x = 0; x < selectWeather.length; x++) {
        if (selectWeather[x].value != null) {
            selectedWeather.push(selectWeather[x].value);
        }

    }
    return selectedWeather;
}
const randomAgain = document.getElementById('randomAgain');
randomAgain.addEventListener('click', function () {
    getCityToDraw();
});
function drawClothes(wardrobeName, actualTemperature, actualWeatherCondition) {
    $("#putImgFromLottery").empty();

    return firebase.database().ref('Users/' + getCurrentUser().uid + '/' + wardrobeName + '/').once('value', function (snapshot) {
        var postObject = snapshot.val();
        if (postObject === null) {
            return;
        }

        const generatedClothes = [];

        if (postObject["Headgear"] != null) {
            // const generatedTopsObject = generateRandomClothObject(postObject, ["Headgear"], actualTemperature);
            generatedClothes.push(generateRandomClothObject(postObject, ["Headgear"], actualTemperature, actualWeatherCondition));
        }
        if (postObject["Outerwear"] != null) {
            // const generatedTopsObject = generateRandomClothObject(postObject, ["Outerwear"], actualTemperature);
            generatedClothes.push(generateRandomClothObject(postObject, ["Outerwear"], actualTemperature, actualWeatherCondition));

        }

        const onlyDresses = postObject["Dresses"] != null && postObject["Trousers"] == null && postObject["Skirts & Shorts"] == null && postObject["Tops"] == null && postObject["Tees & Sweaters"] == null;
        const onlyTrousersOrSkirtsShortsAndTopsOrTeesSweaters = ((postObject["Trousers"] != null || postObject["Skirts & Shorts"] != null) && (postObject["Tops"] != null || postObject["Tees & Sweaters"] != null)) && postObject["Dresses"] == null;

        if (onlyDresses) {
            // const generatedTopsObject = generateRandomClothObject(postObject, ["Dresses"], actualTemperature);
            generatedClothes.push(generateRandomClothObject(postObject, ["Dresses"], actualTemperature, actualWeatherCondition));
        } else if (onlyTrousersOrSkirtsShortsAndTopsOrTeesSweaters) {
            // const generatedFootwearObject = generateRandomClothObject(postObject, ["Trousers", "Skirts & Shorts"], actualTemperature);
            generatedClothes.push(generateRandomClothObject(postObject, ["Tops", "Tees & Sweaters"], actualTemperature, actualWeatherCondition));
            generatedClothes.push(generateRandomClothObject(postObject, ["Trousers", "Skirts & Shorts"], actualTemperature, actualWeatherCondition));

        } else if (postObject["Dresses"] == null && postObject["Trousers"] == null && postObject["Skirts & Shorts"] == null) {
            //Do nothing
        } else {
            const whatShouldIWear = Math.floor(Math.random() * 2);
            if (whatShouldIWear == 0) {
                // const generatedTopsObject = generateRandomClothObject(postObject, ["Dresses"], actualTemperature);
                generatedClothes.push(generateRandomClothObject(postObject, ["Dresses"], actualTemperature, actualWeatherCondition));

            } else {
                // const generatedFootwearObject = generateRandomClothObject(postObject, ["Trousers", "Skirts & Shorts"], actualTemperature);
                generatedClothes.push(generateRandomClothObject(postObject, ["Tops", "Tees & Sweaters"], actualTemperature, actualWeatherCondition));
                generatedClothes.push(generateRandomClothObject(postObject, ["Trousers", "Skirts & Shorts"], actualTemperature, actualWeatherCondition));

            }
        }
        if (postObject["Footwear"] != null) {
            // const generatedFootwearObject = generateRandomClothObject(postObject, ["Footwear"], actualTemperature);
            generatedClothes.push(generateRandomClothObject(postObject, ["Footwear"], actualTemperature, actualWeatherCondition));
            // console.log(generatedFootwearObject);
        }

        //Get all genereted clothes and put in slider
        var img;
        const putImgFromLottery = document.getElementById('putImgFromLottery');
        for (var i = 0; i < generatedClothes.length; i++) {

            img = document.createElement("img");
            img.src = generatedClothes[i]["url"];
            img.classList.add("contentImage");
            putImgFromLottery.appendChild(img);
        }
    });
}

function generateRandomClothObject(postObject, categoryNames, actualTemperature, actualWeatherCondition) {
    const clothesAvailableForTemperature = [];
    for (var i = 0; i < categoryNames.length; i++) {
        if (postObject[categoryNames[i]] == null) {
            continue;
        }
        const clothesObjectKeys = Object.getOwnPropertyNames(postObject[categoryNames[i]]).toString().split(",");

        let actualObject;
        for (var j = 0; j < clothesObjectKeys.length; j++) {
            actualObject = postObject[categoryNames[i]][clothesObjectKeys[j]];
            let isObjectContainingWeather = false;
            for (var k = 0; k < actualObject["selectedWeather"].length; k++) {
                if (actualObject["selectedWeather"][k] == actualWeatherCondition) {
                    isObjectContainingWeather = true;
                    break;
                }
            }
            if (!isObjectContainingWeather) {
                continue;
            }

            if (actualTemperature < parseInt(actualObject["maxTemp"].replace('°C', '')) &&
                actualTemperature > parseInt(actualObject["minTemp"].replace('°C', ''))) {
                clothesAvailableForTemperature.push(actualObject);
            }
        }
    }
    const randomClothIndex = Math.floor(Math.random() * clothesAvailableForTemperature.length);
    return postObject[clothesAvailableForTemperature[randomClothIndex]["category"]][clothesAvailableForTemperature[randomClothIndex]["key"]];
}

 function createWardrobeImg(name) {
        return $('<div/>') 
            .append($('<img />').attr({
                'id': name,
                'src': 'img/wardrobe.svg',
                'class': 'myWardrobe',
                'href': '#wardrobe-cats',
                
            }))
            .append($('<div/>')
                .append(name));
    }


//Mobile navigation
$(document).ready(function () {

    // activate and deactivate menu exept onclik on Draw
    $('.navbar').click(function (event) {
        var id = $(event.target).attr("class");
        if (id != "Draw") {
            $('.nav').toggleClass('active');
        }
    });

    //diplaying options to get picture from
    $(".btn-slide").click(function () {
        $(".btnFloatingAction").slideToggle();
    });

   

    // display wardrobe with given name
    $('.btn-war').click(function () {
        warName = setWardrobeName();
        const checkName = document.getElementById(warName);
        if (checkName !== null) {
            alert('This name already exist!');
            return;
        }
        else if (warName == '' )
        {
            return;
        } 
        else 
        {
            warName = warName.replace(/\s/g, '');
            $('.menu-wardrobe').append(createWardrobeImg(warName));
            moveToWardrobeCats(warName);            
            for (let x = 0; x < hideWardrobeDraw.length; x++) {
                ul = document.createElement("ul");
                ul.classList.add("hideShowWardrobe");
                hideWardrobeDraw[x].appendChild(ul);

                // Put li and a tags into ul in div
                li = document.createElement("li");
                snippet = document.createTextNode(warName);

                li.classList.add(warName);
                ul.appendChild(li);

                a = document.createElement('a');
                a.href = "#lottery";
                a.appendChild(snippet);
                li.appendChild(a);
            }
            warName = '';
        }              
    });

    // get the category name, launch function for loading clothes
    $('#wear span').click(function () {
        category = $(this).attr("id");
        loadClothes();
    });

    // get the selected by user category 
    $('#selectCategory').change(function () {
        selectedCategory = $('#selectCategory').val();
    });

    // get the selected by user weather
    // $('#selectWeather').change(function () {
    //     selectedWeather = $('#selectWeather').val();
    //     console.log(selectedWeather);

    // });


    //dodawanie list z tagami do zdjecia
    var target = $("div#target");
    var n = function () {
        return $("div.col-xs-2").length;
    };
    var newInput = function () {
        const div = $("<div/>", {
            "class": "input-group styled-select oneline"
        });
        const select = $("<select />", {
            "class": "form-control selectWeather"
        });
        const selectOption = $("<option>Select</option><option>Rain</option><option>Thunderstorm</option><option>Drizzle</option><option>Snow</option><option>Clear</option><option>Clouds</option>");

        var span = $("<span/>", {
            "class": "input-group-btn"
        });
        const button = $("<button/>", {
            "class": "removeBtn btn btn-sm btn-link",
            type: "button",
            id: n()
        });
        const glyph = $("<span/>", {
            "class": "fas fa-times"
        });
        const col = $("<div/>", {
            "class": "form-group col-xs-2",
            id: "newInput-" + n()
        });

        $(glyph).appendTo(button);
        $(button).appendTo(span);
        $(select).appendTo(div);
        $(selectOption).appendTo(select);
        $(span).appendTo(div);
        $(div).appendTo(col);
        return col;
    };

    $('button#add').on('click', function () {
        $(newInput()).appendTo(target);
    });

    $('#target').on('click', 'button', function () {
        var target = $("#target").find("#newInput-" + this.id);
        $(target).remove();
    });



    // get data for chart
    var dateUTC = [];
    var temp = [];
    var daysOfWeek;
    $("#getWeather").click(function () {
        var city = $("#city").val();
        var key = '33dbe3b930c23ad2c7a0630b49f3e440';
        var url = "https://api.openweathermap.org/data/2.5/forecast";

        $.get(url, { q: city, appid: key, units: 'metric' }, function (data) {

            dateUTC = [];
            temp = [];
            for (let i = 0; i < data.list.length; i += 8) {
                dateUTC.push(data.list[i].dt);
                temp.push(parseInt(data.list[i].main.temp));
            }
            daysOfWeek = [];
            if (dateUTC.length == 5 && temp.length == 5) {
                daysOfWeek = getDayOfWeek(dateUTC);
                plot(daysOfWeek, temp);
            }

        }, 'json');

    });
    // convert UNIX timestamp to day of the week
    function getDayOfWeek(dateUTC) {
        var daysOfWeek = [];
        var days = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'];
        for (let i = 0; i < dateUTC.length; i++) {
            var date = new Date();
            date.setTime(dateUTC[i] * 1000); // javascript timestamps are in milliseconds
            daysOfWeek.push(days[date.getUTCDay()]);
        }

        return daysOfWeek;
    };

    // chart    
    var myChart;
    function plot(date, temp) {

        var ctx = document.getElementById('chart').getContext("2d");
        if (myChart != null) {
            myChart.data.labels = [date[0], date[1], date[2], date[3], date[4]];
            myChart.data.datasets[0].data = [temp[0], temp[1], temp[2], temp[3], temp[4]];

            myChart.update();
        } else {
            myChart = new Chart(ctx, {

                type: 'line',
                data: {
                    labels: [date[0], date[1], date[2], date[3], date[4]],
                    datasets: [{
                        label: "Temperature",
                        borderColor: "#80b6f4",
                        pointBorderColor: "#80b6f4",
                        pointBackgroundColor: "#80b6f4",
                        pointHoverBackgroundColor: "#80b6f4",
                        pointHoverBorderColor: "#80b6f4",
                        pointBorderWidth: 15,
                        pointHoverRadius: 10,
                        pointHoverBorderWidth: 10,
                        pointRadius: 4,
                        fill: false,
                        borderWidth: 4,
                        data: [temp[0], temp[1], temp[2], temp[3], temp[4]]
                    }]
                },
                options: {
                    maintainAspectRatio: false,
                    legend: {
                        display: false
                    },
                    tooltips: {
                        displayColors: false,
                        bodyFontSize: 14,
                        callbacks: {
                            label: function (tooltipItems, data) {
                                return tooltipItems.yLabel + '°C';
                            }
                        }
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                fontColor: "rgba(0,0,0,0.5)",
                                fontStyle: "bold",
                                beginAtZero: true,
                                maxTicksLimit: 5,
                                padding: 15
                            },
                            gridLines: {
                                drawTicks: false,
                                display: false
                            }

                        }],
                        xAxes: [{
                            gridLines: {
                                zeroLineColor: "transparent"
                            },
                            ticks: {
                                padding: 10,
                                fontColor: "rgba(0,0,0,0.5)",
                                fontStyle: "bold"
                            }
                        }]
                    }
                }
            })
        }

    }

});