
// npm init -yield
// touch application.js 
// npm i express ejs 
// npm i socket.io 
// npx nodemon app.js 



const express = require('express');
const app = express();
const http = require("http");
const path = require("path");
const socketio = require("socket.io");

const server = http.createServer(app);
const io = socketio(server);

// Set the view engine to EJS
app.set("view engine", "ejs");
// app.set(express.static(path.join(__dirname, "public")));


// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));



// Handle socket.io connections

io.on("connection", function(socket){
    console.log("connectied")
    //accept location in backend and send location  to frontend
    socket.on("send-location", function(data){
        io.emit("receive-location", {id: socket.id, ...data });

    });

    // when disconnect, sent or emit to frontend
    socket.on("disconnect", function(){
        io.emit("user-disconnect", socket.id);

    })
})

// Define a route for the homepage
app.get("/", function(req,res){
   // res.send("server started")
   res.render("index");

});

// Start the server
// app.listen(3000);
server.listen(3000);



