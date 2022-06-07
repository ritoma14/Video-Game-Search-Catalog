//var express = require('express');
const express = require('express');
//var app = express();
const app = express();
var server = require('http').Server(app);
//const io = require('socket.io')(server, {cors: {origin: "*"}});
var io = require('socket.io')(server);
var psql = require('pg-promise')();
var path = require('path');

var str_connec = "postgres://ramy:D4t4b4s3@localhost:5432/video_catalog";
var video_db = psql(str_connec);

/*const cors = require ("cors")

app.use(cors({
//origin: "http://127.0.0.1:5432",}))
origin: "*",}))
*/

app.use(express.static(__dirname)); 
server.listen(8081);

app.get('/', function(req, res) {
    console.log('Got a GET request for homepage');
    res.sendFile(path.join(__dirname + '/gameSearch.html'));
});


io.on('connection', function (socket) {
    socket.on('userInput', function (games) {
    console.log('A connection has been made');
        var query = createSqlQuery(games);
        
        video_db.query(query, games)
        .then(data=> {
            var jsonData = [];
            io.emit('queryFinished', JSON.stringify(data));
        })
        .catch(error => {
                console.log(error);
            });
    });
});

function createSqlQuery(games){
    console.log('Database 1 connection established');

    var query = "SELECT * FROM games";
    var filter = [];
    if(games.name)
        filter.push("name ILIKE '%${name#}%'");
    if(games.gameConsole)
        filter.push("platform ILIKE '%${gameConsole#}_'");
    if(games.userRev)
        filter.push("user_review ILIKE '%${userRev#}%'");
    if(games.metaSc)
        filter.push("meta_score = ${metaSc#}");

    if(filter.length > 0) {
   
        query = query.concat(" WHERE ");
        var r;
        for(r = 0; r < filter.length; r++){
            if(r == filter.length - 1)
                query = query.concat(filter[r]);
            else
                query = query.concat(filter[r] + " AND ");
        }
    }
    
    if(filter.length <=0) {
        return 0;

    }

     console.log('Database 2 connection established');
    return query;
}
