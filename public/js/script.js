// send connection req to backend
// Connect to the backend using Socket.io
const socket = io();

console.log("hey in script.js")

// navigator is inbuilt
// Check if geolocation is available
if(navigator.geolocation){
    navigator.geolocation.watchPosition((position)=>{
        const { latitude, longitude } = position.coords ; 
        socket.emit("send-location", {latitude, longitude });
    },
(error) => {
    console.log(error)
},
{
    enableHighAccuracy: true,
    timout: 5000,
    maximumAge: 0, 
})
}


// Initialize the map with Leaflet
const map = L.map("map").setView([0,0], 10);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "OpenStringMap"
}).addTo(map);

const markers = {};


// Handle receiving location updates from the server
socket.on("receive-location", (data)=>{
    const {id, latitude, longitude} = data ;
    map.setView([latitude, longitude], 16);
    if(markers[id]){
        markers[id].setLatLng([latitude, longitude]);
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }

});


// Handle user disconnection and remove markers
// if disconnected, donot remove marker 
socket.on("user-disconnected", (id) =>{
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});
