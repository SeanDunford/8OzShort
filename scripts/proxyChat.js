var proxyChat = proxyChat || {};

/*global window, $, Handlebars, nomen: true*/
proxyChat.appOpened = function() {
	proxyChat.initChatroom(); 
	proxyChat.initMap(); 
}	

proxyChat.changeMapLocation = function(location){
	map = L.map('map').setView([51.505, -0.09], 13);
}

proxyChat.initChatroom = function(chatroom){
	var myId;
	chatroom = 1; 
	// Get a reference to the root of the chat data.
	if(chatroom === 0){
		var messagesRef = new Firebase('https://8ozshort.firebaseIO.com/chatRoom1');
	}
	else if(chatroom === 1){
		var messagesRef = new Firebase('https://8ozshort.firebaseIO.com/chatRoom2');  
	}
	var usersRef = new Firebase('8ozshort.firebaseIO.com/users');
	// When the user presses enter on the message input, write the message to firebase.
	$('#messageInput').keypress(function (e) {
		if (e.keyCode == 13) {
			var name = $('#nameInput').val();
			var text = $('#messageInput').val();
			messagesRef.push({name:name, text:text});
			$('#messageInput').val('');

			usersRef.push({
				name:name, 
				latitude:latitude, 
				longitude:longitude,
				timestamp: new Date().getTime()
			})
		}
	});
	// Add a callback that is triggered for each chat message.
	messagesRef.limit(10).on('child_added', function (snapshot) {
	var message = snapshot.val();
	$('<div/>').text(message.text).prepend($('<em/>')
		.text(message.name+': ')).appendTo($('#messagesDiv'));
	$('#messagesDiv')[0].scrollTop = $('#messagesDiv')[0].scrollHeight;
	});
}

proxyChat.initMap = function(location){
	// set up the map
	map = L.map('map').setView([51.505, -0.09], 13);

	// create the tile layer with correct attribution
	var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	var osmAttrib='proxyChat <3\'s leaflet';
	var osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 18, attribution: osmAttrib});       
	map.addLayer(osm);
	var marker = L.marker([51.5, -0.09]).addTo(map);
	var circle = L.circle([51.508, -0.11], 500, {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5
	}).addTo(map);
	var polygon = L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
	]).addTo(map);

	map.on('click', proxyChat.onMapClick);
}

proxyChat.OpenStreetMapTileLayer = function(){
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
}

proxyChat.setMapToCurrentPostion = function() {
		if (!navigator.geolocation) 
			return false; 
		else
		navigator.geolocation.getCurrentPosition(proxyChat.showPosition);	
}

proxyChat.showPosition = function(position) {
	map.setView([51.505, -0.09], 13);
	var latitude = position.coords.latitude;
	var longitude = position.coords.longitude;

	map.setView(new L.LatLng(latitude, longitude), 14);
	var name = $('#nameInput').val();
	var usersRef = new Firebase('8ozshort.firebaseIO.com/users');
	var me = usersRef.push({
		name:name, 
		latitude:latitude, 
		longitude:longitude,
		timestamp: new Date().getTime()
	});
	var myId = me.name();
}

proxyChat.onMapClick = function(e) {
	//proxyChat.placePopup(e.latlng); 
	proxyChat.placeMarker(e.latlng.lat, e.latlng.lng); 
}
proxyChat.placePopup = function(latlng){
var popup = L.popup();
    popup
        .setLatLng(latlng)
        .setContent("You clicked the map at " + latlng.toString())
        .openOn(map);
		var popup = L.popup();
}

proxyChat.placeMarker = function (lattitude, longitude) {
	var marker = L.marker([lattitude, longitude])
	marker.bindPopup(proxyChat.generatePopupText()).openPopup();
	marker.addTo(map);
}

proxyChat.placeCircle = function (lattitude, longitude) {
	var marker = L.marker([lattitude, longitude])
	marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
	marker.addTo(map);
}
proxyChat.placePolygon = function (lattitude, longitude) {
	
}	
function foo(chatName){
	console.log(chatName); 
}
proxyChat.generatePopupText = function (name, description) {
    'use strict';
    var source, template, context, html;
    source   = $("#handleBarsTest").html();
    template = Handlebars.compile(source);
    context = {chatName: name, chatDescription: description};
    html    = template(context);
    console.log(html); 
    return html;
}