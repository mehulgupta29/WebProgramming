(function ($) {
	
	var signup_email = $('#email');
	var signup_passwd = $('#passwd');
	var signup_confpwd = $('#confpwd');
	var signup_fname = $('#fname');
	var signup_lname = $('#lname');
	var signup_agree = $('#agree');
	
	var btnSignup = $('#join');
	var error_signup_div = $('#error-message-signup');
	
	function extractSignupInput()
	{
		var email = signup_email.val();
		var passwd = signup_passwd.val();
		var confpwd = signup_confpwd.val();
		var fname = signup_fname.val();
		var lname = signup_lname.val();
		var agree = signup_agree.val();
		
		if(email === "" || passwd === "" || confpwd === "" || fname === "" || lname === ""){
			throw "Input is blank. Please provide input";
		}
		
		var atpos = email.indexOf("@");
		var dotpos = email.lastIndexOf(".");
		if (atpos<1 || dotpos<atpos+2 || dotpos+2>=email.length) 
		{
			throw "Not a valid e-mail address";
		} 
		
		var validpassw =  /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/;
		if(!passwd.match(validpassw)){
			throw "password should be 8 to 15 characters and contain at least one numeric digit and a special character";
		}
				
		if (passwd != confpwd){
			throw "Both passwords do not match.";
		}
	}
	
	btnSignup.click(function(){
		error_signup_div.addClass('hidden');
		
		try{
			extractSignupInput();
			return true;
		}
		catch(error){
			error_signup_div.text(error)
			error_signup_div.removeClass('hidden');
			return false;
		}
	});
	


})(jQuery);
