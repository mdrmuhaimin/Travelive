function calcSetDistance(directionResult) {
	var myRoute = directionResult.routes[0].legs[0];
	var spacing = 50000; //distance is measured in meters
	var runningTotal = spacing;

	//Export coordinates as array
	var coordinates = new Array();

	for(var i = 0; i < myRoute.steps.length; i++) {
		var stepDistance = myRoute.steps[i].distance.value;
		runningTotal -= stepDistance;
		if(runningTotal < 0) { //If less than 0, then in this path, we are passing the spacing mark
			var distancePerPoint = stepDistance / myRoute.steps[i].path.length;
			var goodPoint = myRoute.steps[i].path[abs(runningTotal) / distancePerPoint]; //Get point that is the right spacing away

			coordinates.push(goodPoint); //Add to our coordinates

			runningTotal = spacing;
		}

		if(i = myRoute.steps.length - 1) {
			//Add last point to route even if not past spacings
			coordinates.push(myRoute.steps[i].end_location);
		}
	}
	return coordinates;
}
