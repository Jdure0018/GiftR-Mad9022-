/*****************************************************************
 File: Giftr app.js
 Author: Jonathan Dure
 Version: 1.0.0
 Updated: Mar 31, 2017

 *****************************************************************/
var app = {
    currentPerson: 0
    , currentIdea: 0
    , currentName: ""
    , currentDob: ""
    , people: []
    , gifts: []
    , init: function () {
        document.addEventListener('deviceready', app.onDeviceReady);
    }
    , onDeviceReady: function () {
        window.addEventListener('push', app.pagination);
        console.log("working");
    }
    , pagination: function (ev) {
        var content = document.querySelector(".content");
        var id = content.id;
        console.log(id);
        switch (id) {
        case "profiles":
            app.showList();
            var saveBtn = document.getElementById('addPerson').addEventListener('touchend', app.savePerson);
            var cancelBtn = document.getElementById('cancel').addEventListener('touchend', app.clearPerson);
            var addPerson = document.getElementById('personAdd').addEventListener('touchstart', app.newContact);
            console.log('Working');
            break;
        case "ideaPage":
            app.addGifts();
            console.log(ev);
            var addGift = document.getElementById('saveGift').addEventListener('click', app.addGifts);
            var cancelGift = document.getElementById('closeBtn').addEventListener('click', app.clearFormGift);    
            break;
        default:
            app.showList();
        }
    }
    , newContact: function () {
        app.currentPerson = 0;
        var name = document.getElementById('name').value = "";
        var birth = document.getElementById('dob').value = "";
    }
    , showList: function () {
        var contactList = document.getElementById('contact-list');
        var isExistLocalStorage = localStorage.getItem('giftr-dure0018');
        //Display local storage items on load
        if (isExistLocalStorage) {
            contactList.innerHTML = "";
            app.people = JSON.parse(localStorage.getItem('giftr-dure0018'));
            var people = app.people;
            people.sort(app.compareDob);
            //ForEach Loop
            people.forEach(function (person) {
                var li = document.createElement('li');
                li.className = "table-view-cell";
                //                li.setAttribute('data-id', person.id);
                var spanName = document.createElement('span');
                spanName.className = 'name';
                var editAnchor = document.createElement('a');
                editAnchor.setAttribute('href', '#personModal');
                editAnchor.className = "contactName"
                editAnchor.textContent = person.name;
                editAnchor.setAttribute('data-id', person.id);
                var giftAnchor = document.createElement('a');
                giftAnchor.className = "navigate-right pull-right";
                giftAnchor.setAttribute('href', "gifts.html");
                var spanDob = document.createElement('span');
                spanDob.className = 'dob';
                spanDob.textContent = moment(person.dob).format("MMMM DD");
                // appending them to the parent
                spanName.appendChild(editAnchor);
                giftAnchor.appendChild(spanDob);
                li.appendChild(spanName);
                li.appendChild(giftAnchor);
                contactList.appendChild(li);
                //Get person ID
                contactList.addEventListener("touchstart", function (ev) {
                    app.currentPerson = editAnchor.getAttribute('data-id');
                    console.log(app.currentPerson);
                    app.editPerson(app.currentPerson);
                })
            });
        }
    }
    , compareDob: function (a, b) {
        if (a.dob.substring(5) < b.dob.substring(5)) return -1;
        if (a.dob.substring(5) > b.dob.substring(5)) return 1;
        return 0;
    }
    , editPerson: function (current) {
        app.people.forEach(function (value) {
            if (value.id == current) {
                document.getElementById("name").value = value.name
                    , document.getElementById("dob").value = value.dob;
            }
        });
    }
    , savePerson: function () {
        var current = app.currentPerson;
        var people = app.people;
        var name = document.getElementById('name').value;
        var birth = document.getElementById('dob').value;
        var id = Math.floor(Date.now() / 1000);
        var ideas = [];
        if (current == 0) {
            var personObj = {
                name: name
                , dob: birth
                , id: id
                , ideas: ideas
            };
            //Save to Local Storage
            people.push(personObj);
            localStorage.setItem('giftr-dure0018', JSON.stringify(people));
        }
        else {
            app.people.forEach(function (person) {
                if (person.id == app.currentPerson) {
                    person.name = document.getElementById('name').value;
                    person.dob = document.getElementById('dob').value;
                }
            });
            localStorage.setItem('giftr-dure0018', JSON.stringify(app.people));
        }
        app.clearPerson();
        app.showList();
    }
    , clearPerson: function (ev) {
        document.getElementById('myForm').reset();
        document.getElementById('personModal').className = "modal";
    }
    , addGifts: function () {
        var giftList = document.querySelector("#gift-list");
        giftList.innerHTML = "";
        //        ForEach loop
        app.people.forEach(function (contact, value) {
            if (contact.id == app.currentPerson) {
                document.querySelector("#pageName").innerHTML = contact.name;
                document.querySelector("#personGift").innerHTML = contact.name + " " + " " +  "gift idea."
                contact.ideas.forEach(function (value, prop) {
                    //LI
                    var li = document.createElement('li');
                    li.className = "table-view-cell media";
                    //Span
                    var spantrash = document.createElement('span');
                    spantrash.className = "pull-right icon icon-trash midline";
        [].forEach.call(spantrash, function (value) {
                            value.addEventListener("click", app.removeIdea);
                        })
                        //Div  
                    var mediaDiv = document.createElement('div');
                    mediaDiv.className = "media-body";
                    mediaDiv.setAttribute("gift-id", value.id);
                    mediaDiv.appendChild(p);
                    li.appendChild(mediaDiv);
                    li.appendChild(spantrash);
                    giftList.appendChild(li);
                    //give gift Id
                    li.addEventListener("touchstart", function (ev) {
                        app.currentIdea = mediaDiv.getAttribute("gift-id");
                        console.log(app.currentIdea);
                        app.changeGift(app.currentIdea);
                    })
                    if (value.at != "") {
                        var store = documeent.createElement('p');
                        store.innerHTML = value.at;
                        mediaDiv.appendChild(store);
                    }
                    else if (value.url != "") {
                        var linkAnchor = document.createElement('a');
                        store.innerHTML = value.at;
                        linkAnchor.setAttribute('href', "#");
                        linkAnchor.setAttribute('target', "_blank");
                        var p = document.createElement('p');
                        p.appendChild(linkAnchor);
                    }
                    else if (value.cost != "") {
                        var price = document.createElement('p');
                        price.innerHTML = value.cost;
                        mediaDiv.appendChild(price);
                    }
                })
            }
        })
    }
    , newIdea() {
        var id = Math.floor(Date.now() / 1000),
          title = document.getElementById('title').value,
          store =  document.getElementById('store').value,
          link =  document.getElementById('url').value,
           price = document.getElementById('cost').value; 
        if (app.currentIdea == 0) {
            var ideaObj = {
                id: Math.floor(Date.now() / 1000)
                , title: title
                , at: store
                , url: link
                , cost: price
            };
            app.people.forEach(function (person) {
                if (person.id == app.currentPerson) {
                    person.ideas.push(ideaObj);
                }
            })
            localStorage.setItem('giftr-dure0018', JSON.stringify(app.people));
        }
        else {
            app.people.forEach(function (gift) {
                gift.ideas.forEach(function (obj, index) {
                    if (gift.id == app.currentID) {
                        gift.title = document.getElementById('title').value
                            , gift.at = document.getElementById('store').value
                            , gift.url = document.getElementById('url').value
                            , gift.cost = document.getElementById('cost').value
                    }
                })
            })
            localStorage.setItem('giftr-dure0018', JSON.stringify(app.people));
        }
        app.addGifts();
        app.clearFormGift();
        
    },
    removeIdea: function () {
        app.people.forEach(function (gift) {
            gift.ideas.forEach(function (obj, index) {
                if (app.currentIdea == obj.id) {
                    gift.ideas.splice(index, 1);
                    localStorage.setItem('giftr-dure0018', JSON.stringify(app.people));
                    app.addGifts();
                }
            })
        })
    }
    , changeGift: function (current) {
        app.people.forEach(function (gift) {
            gift.ideas.forEach(function (obj, index) {
                if (gift.id == app.currentID) {
                    gift.title = document.getElementById('title').value
                        , gift.at = document.getElementById('store').value
                        , gift.url = document.getElementById('url').value
                        , gift.cost = document.getElementById('cost').value
                }
            })
        })
    }
    , clearFormGift: function (ev) {
        document.getElementById('giftForm').reset();
        document.querySelector('#giftModal').classList.remove('active');
    }
, };
app.init();
app.pagination();
app.addGifts();