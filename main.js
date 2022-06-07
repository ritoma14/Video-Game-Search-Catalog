$(document).ready(function(){
    });
function send() {
    var gameName = $("#cd-name").val();
    var consoles = $("platform-name").val();
    var userReview = $("#user-review").val();
    var metaScore = $("#meta-score").val();

    var objectGames = { name: gameName, gameConsole: consoles, userRev: userReview, metaSc: metaScore
};

    var socket = io.connect('http://localhost:8081');
    socket.emit('userInput', objectGames);

    socket.on('queryFinished', function(jsondata){
        $("#table1 tbody tr").remove(); 
        var data = JSON.parse(jsondata);
        data.forEach(function(item){
            console.log(item);
            addRow(item);
        })
    })
}

function addRow(objectGames){
    var table = $("#tbody")[0];

    console.log(table);
    var row = table.insertRow(-1);

/*
Row of the index of new row. If index is -1 or equal to number of rows,
 the row is appended as the last row. If index omitted, it defaults to -1
*/

    for (var key in objectGames){
        if (objectGames.hasOwnProperty(key)){

/*hasOwnProperty returns true if specified property is a direct property of object-
even if value is null or undefined. Method returns false if property is inherited or has
not been declared at all
*/
        var cell = row.insertCell(-1);
        cell.innerHTML = objectGames[key];
        }
    }
}
  
