// Select form
var usrTable =          document.getElementById("fromTable");
var userColumn =        document.getElementById("tableColumn");
var querySubmit =       document.getElementById("querySubmit");

// Update form
var rowId =             document.getElementById("rowId");
var rowValue =          document.getElementById("rowValue");
var insertDbBtn =       document.getElementById("insertDbBtn");
var updateWhat =        document.getElementById("selectUpdate");

var textToBeChanged =   document.getElementById("textToBeChanged");


// var getCustmID = document.getElementById("getCustmID");
// var insertIntoDB = document.getElementById("insertIntoDB");


// Reading from a text file example
// $(document).ready(function() {
//     $("#getCustmID").click(function(){
//         $.ajax({url: "demo_test.txt", success: function(result){
//             $("#textToBeChanged").html(result);
//         }});
//     });
// });

// Read from a html file example
// $(document).ready(function() {
//     $("#getCustmID").click(function(){
//         $.ajax({url: "subpage.html", success: function(result){
//             $("#textToBeChanged").html(result);
//         }});
//     });
// });

// Get some id's from the database
// $(document).ready(function() {
//     $("#getCustmrID").click(function(){
//         showCustomersId();
//         console.log("Button pressed");
//     });
// });
//
// function showCustomersId() {
//     var xhttp;
//     xhttp = new XMLHttpRequest();
//     xhttp.onreadystatechange = function() {
//         if (this.readyState === 4 && this.status === 200) {
//             document.getElementById("textToBeChanged").innerHTML = this.responseText
//         }
//     };
//     xhttp.open("GET", "scripts/display_db.dart", true);
//     xhttp.send();
// }

/* Showing information from the database _START_*/
$(document).ready(function() {
    $("#querySubmit").click(function(){
        showDB();
    });
});

function showDB() {
    try {
        // VARIABLES
        var xhttp;
        function hideSubmit() {
            "use strict";
            querySubmit.style.visibility = "hidden";
        }
        function showSubmit() {
            "use strict";
            querySubmit.style.visibility = "visible";
        }

        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            var DONE = 4; // readyState 4 means the request is done.
            var OK = 200; // status 200 is a successful return.
            if (this.readyState === DONE && this.status === OK) {
                document.getElementById("textToBeChanged").innerHTML = this.responseText
            }
        };
        xhttp.open("POST", "../../server/queries/display_db.dart",  true);
        var usrInput = JSON.stringify({"userTable": usrTable.value + "",
                                        "userColumn": userColumn.value + ""});

        // Some checks before sending the request
        if(usrTable.value === "") {
            usrTable.classList.add("requiredField");
            setTimeout(function(){usrTable.classList.remove("requiredField")}, 2500);
        }
        if(userColumn.value === "") {
            userColumn.className += " requiredField";
            setTimeout(function(){userColumn.classList.remove("requiredField")}, 2500);
        }
        else {
            xhttp.send(usrInput);
            hideSubmit();
            setTimeout(showSubmit, 2000);
        }
    }
    catch(e) {
        console.log('Caught Exception: ' + e.message);
    }
}
/* Showing information from the database _END_ */

/* Updating the Database _START_ */
$(document).ready(function() {
    $("#insertDbBtn").click(function(){
        "use strict";
        updateDb();
    });
});

function updateDb() {
    try {
        // VARIABLES
        var xhttp;
        xhttp = new XMLHttpRequest();
        function hideSubmit() {
            "use strict";
            insertDbBtn.style.visibility = "hidden";
        }
        function showSubmit() {
            "use strict";
            insertDbBtn.style.visibility = "visible";
        }

        xhttp.onreadystatechange = function() {
            var DONE = 4; // readyState 4 means the request is done.
            var OK = 200; // status 200 is a successful return.
            if (this.readyState === DONE && this.status === OK) {
                var response = this.responseText;
                /* if returned string ends with , E (stands for error), like: "Couldn't update ID, E"
                display the response and colorize in red, else display the response in green colour */
                if(response.substr(response.length - 3) === ", E") {
                    textToBeChanged.innerHTML = response;
                    textToBeChanged.style.color = "red";
                }
                else {
                    textToBeChanged.innerHTML = response;
                    textToBeChanged.style.color = "green";
                }
            }
        };
        xhttp.open("POST", "../../server/queries/update_db.dart",  true);
        var usrInput = JSON.stringify({ "id": rowId.value + "",
                                        "value": rowValue.value + "",
                                        "selectValue": updateWhat.value + ""});

        // Some checks before sending the request
        if(rowId.value === "") {
            rowId.classList.add("requiredField");
            setTimeout(function(){rowId.classList.remove("requiredField")}, 2500);
        }
        if(rowValue.value === "") {
            rowValue.classList.add("requiredField");
            setTimeout(function(){rowValue.classList.remove("requiredField")}, 2500);
        }
        else {
            xhttp.send(usrInput);
            hideSubmit();
            setTimeout(showSubmit, 2000);
        }
    }
    catch(e) {
        console.log('Caught Exception: ' + e.message);
    }
}

/* Updating the Database _END_ */

