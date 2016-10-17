 (function($) {
      //alert("Inside profile validation");
	var FirstName = $("#fname");
	   //   alert("Inside profile validation firstname");

	var LastName = $("#lname");
		   //   alert("Inside profile validation lasstname");

	var Passwd = $("#passwd");
			  //    alert("Inside profile validation passwd");

	var Confpwd = $("#confpwd");
				 //     alert("Inside profile validation confrim passwd");

	var btnSave = $("#save");
	var errorAlertSave = $("#errormessageprofile");
	
	function extractProfileInputs(){
			//alert("Inside extract input");

		var FirstNameVal = FirstName.val();
		var LastNameVal = LastName.val();
		var PasswdVal = Passwd.val();
		var ConfpwdVal = Confpwd.val();
		
			//alert(FirstNameVal+" "+LastNameVal+" "+PasswdVal+" "+ConfpwdVal);

		if (FirstNameVal === "" || LastNameVal === "" || PasswdVal === "" || ConfpwdVal === ""){
			throw "Please provide valid input.";
		}
		
	//	alert("PasswdVal" +typeof(PasswdVal));
		//		alert("ConfpwdVal" +typeof(PasswdVal));

		if (PasswdVal != ConfpwdVal){
			throw "Both passwords do not match.";
		}
		
		var validpassw =  /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/;
		if(!PasswdVal.match(validpassw)){
			throw "password should be 8 to 15 characters and contain at least one numeric digit and a special character";
		}
	}
	
	btnSave.click(function(){
		errorAlertSave.addClass('hidden');
		try{
			extractProfileInputs();
			return true;
		} catch(error){
			errorAlertSave.text(error);
			errorAlertSave.removeClass('hidden');
			return false;
		}
	});

  })(jQuery);