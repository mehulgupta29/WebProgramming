(function ($) {

	var btnCreateTrip = $('#create-trip-btn');
	var errCreateTripDiv = $('#error-message-create-trip');
	
	function isValidDate(dateString) {
	  var regEx = /^\d{4}-\d{2}-\d{2}$/;
	  return dateString.match(regEx) != null;
	}

	function validateCreateTrip()
	{
		
		var tripName = $('#tripName').val();
		var tripLocation = $('#tripLocation').val();
		var tripDate = $('#tripDate').val();
		var tripMembers = $('#tripMembers').val();

		if (tripName === undefined || tripName === "" || tripName === null) {
            throw "Trip Name required";
        }
		if (tripLocation === undefined || tripLocation === "" || tripLocation === null) {
            throw "Psssst!! I wanna know where you are going!!";
        }
        if (tripDate === undefined || tripDate === "" || tripDate === null) {
            throw "What's the date of your trip?";
        }
        if (tripMembers === undefined || tripMembers === "" || tripMembers === null) {
            throw "Going Solo?? Lets go explore the world...";
        }

        //Datae Validation
        if(!isValidDate(tripDate)){
        	throw "Invalid Trip Date";
        }
		return true;
	}
	
	btnCreateTrip.click(function(){
		errCreateTripDiv.addClass('hidden alert alert-danger');
		try{
			validateCreateTrip();
			return true;
		}
		catch(error){
			errCreateTripDiv.text(error)
			errCreateTripDiv.removeClass('hidden');
			return false;
		}
	});
})(jQuery);
