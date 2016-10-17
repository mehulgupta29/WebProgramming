// Remember, we're in a browser: prevent global variables from happening
// I am passing the jQuery variable into the IIFE so that
// I don't have to rely on global variable name changes in the future
//alert ("login validation called");
(function ($) {

	var loginemail = $("#email");
	var loginpass = $("#pwd");
	var loginbtn = $("#btnlogin");
	var error_login_div = $("#error-message-login");
	
	function extractLoginInputs(){
		var login_value = loginemail.val();
		var pass_value = loginpass.val();
		//alert (login_value);
		//alert (pass_value);
		console.log("Values extracted");
		
		if(login_value == "" || pass_value == ""){
			throw "Username/Password is empty. Please provide input.";
		}
	}
	
	loginbtn.click(function(){
		error_login_div.addClass('hidden');
		try{
			//alert ("Button Clicked");
			extractLoginInputs();
			//alert ("Successful Input");
			return true;
			
		}catch(error){
			error_login_div.text(error)
			error_login_div.removeClass('hidden');
			return false;
		//alert ("Error in input")
		}
	});
	
})(jQuery);
