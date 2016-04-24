if(!!localStorage.getItem("tokken") && !!localStorage.getItem("username")){
	$("a[name='loginButton']").html(localStorage.getItem("username"));
} else {
	$("#logoutButton").hide();
}

function isLogged(){
	return (!!localStorage.getItem("tokken") && !!localStorage.getItem("username"));
}
	
$("#login").click(function(e) { 
	var data = {};
	data["username"] = $('input[name="username"]').val()
	data["password"] = $('input[name="password"]').val()

	jQuery.ajax({
		url: "/backend/login.php",
		type: "POST",
		data: JSON.stringify(data),
		success: function(resultData) {
			var res = JSON.parse(resultData);
			window.localStorage.setItem("tokken", res["tokken"]);
			window.localStorage.setItem("username", data["username"]);
			$("a[name='loginButton']").html(data["username"]);
			console.log("success");
			$('#logoutButton').show();
			$(".popup, .overlay").hide(); 
			$(".button").unbind();
			$('input[name="username"]').val('')
			$('input[name="password"]').val('')
		},
		error : function(jqXHR, textStatus, errorThrown) {
			console.log(errorThrown+" "+textStatus);
		},
		timeout: 120000,
	});
}); 
$("#logoutButton").click(function(e) {
	localStorage.removeItem("username");
	localStorage.removeItem("tokken");
	$("a[name='loginButton']").html("Login");
	$("#logoutButton").hide();
	$(".button").click(function(e) {
		showLogin();
	}); 
}); 

function showLogin(){
	console.log("login up");
	$("body").append(''); $(".popup").show(); 
	$(".button").unbind();
	$(".button").click(function(e) {
		closeLogin();
	});
}

function closeLogin(){
	$(".popup, .overlay").hide(); 
	$(".button").unbind();
	$(".button").click(function(e) {
		showLogin();
	});
}

$(".button").click(function(e) {
	showLogin();
}); 
