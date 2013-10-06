
	var directionResponse;
	var directionsDisplay;
	var directionsService = new google.maps.DirectionsService();
	var map;
	var markers = new Array();

	function initialize() {
	  directionsDisplay = new google.maps.DirectionsRenderer();
	  var chicago = new google.maps.LatLng(41.850033, -87.6500523);
	  var mapOptions = {
	    zoom:7,
	    mapTypeId: google.maps.MapTypeId.ROADMAP,
	    center: chicago
	  };
	  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	  directionsDisplay.setMap(map);
	  calcRoute();
	}

	function calcRoute() {
	  var start = document.getElementById('start').value;
	  var end = document.getElementById('end').value;
	  var request = {
	      origin:start,
	      destination:end,
	      travelMode: google.maps.DirectionsTravelMode.DRIVING
	  };

	  directionsService.route(request, function(response, status) {
	    if (status == google.maps.DirectionsStatus.OK) {
	      directionsDisplay.setDirections(response);
	      directionResponse = response;
	      testDirection(directionResponse);
	    }
	  });
	}
	
	function testDirection(directionResponse2) {
		var myRoute = directionResponse2.routes[0].legs[0];
		var spacing = 160 * 1000; //distance is measured in meters
		var runningTotal = spacing;

		//Export coordinates as array
		var coordinates = new Array();

		for(var i = 0; i < myRoute.steps.length; i++) {
			var stepDistance = myRoute.steps[i].distance.value;
			runningTotal -= stepDistance;
			while(runningTotal <= 0) { //If less than 0, then in this path, we are passing the spacing mark
				var distancePerPoint = stepDistance / myRoute.steps[i].path.length;
				var d = (stepDistance + runningTotal) / distancePerPoint;

				var goodPoint = myRoute.steps[i].path[Math.round(d)];

				coordinates.push(goodPoint); //Add to our coordinates

				runningTotal += spacing;
			}
		}

		//Add beginning and ending points
		coordinates.push(myRoute.start_location);
		coordinates.push(myRoute.end_location);

		clearMarkers();

		for(var i = 0; i < coordinates.length; i++) {
			wunderGroundFetch(coordinates[i], map);
		}
		return coordinates;
	}

	function wunderGroundFetch(coordinate, map){
		var key = "31e5badd4441213c";
		var url = "http://api.wunderground.com/api/"+key+"/conditions/q/"+coordinate.lat()+","+coordinate.lng()+".json";
		console.log(url);
		var weather; 
		var temp;
		var humidity; 
					
		jQuery(document).ready(function($) { 
			weather = $.ajax({ 
				url : url, 
				dataType : "jsonp", 
				success : function(parsed_json) { 
					weather = parsed_json['current_observation']['icon_url']; 
					temp = parsed_json['current_observation']['temperature_string'];
					humidity = parsed_json['current_observation']['relative_humidity']; 
					
					console.log(weather);
					console.log(temp);
					console.log(humidity);

					setMarker(coordinate, map, weather, temp);
				}
				
			});
		});
	}

	function clearMarkers() {
		for (var i = 0; i < markers.length; i++) {
    		markers[i].setMap(null);
  		}
		markers = [];
	}

	function setMarker(coordinate, map, image, temp) {
		var marker = new google.maps.Marker({
		        position: coordinate,
		        icon: image,
		        map: map
	   	});

		var markerLabel = new MapLabel({
			position: coordinate,
			text: temp,
			map: map, 
			strokeWeight: 10,
			strokeColor: "#E6E6E6"
		})

	   	markers.push(marker);
	   	markers.push(markerLabel);
	}
	
	google.maps.event.addDomListener(window, 'load', initialize);

