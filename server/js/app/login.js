if(!!localStorage.getItem("tokken") && !!localStorage.getItem("username")){
	$("a[name='loginButton']").html(localStorage.getItem("username"));
} else {
	$("#logoutButton").hide();
}

function isLogged(){
	return (!!localStorage.getItem("tokken") && !!localStorage.getItem("username"));
}
	
$("#login").click(function(e) { 
	event.preventDefault();
	login($('input[name="username"]').val(), $('input[name="password"]').val());
}); 

function login(username, password){
	console.log("TEST");
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
			window.location.replace("/index.html");
		},
		error : function(jqXHR, textStatus, errorThrown) {
			console.log(errorThrown+" "+textStatus);
		},
		timeout: 120000,
	});
}

$("#register").click(function(e) { 
	event.preventDefault();
	registration();
}); 

function registration(){
	console.log("TEST");
	var data = {};
	data["username"] = $('input[name="newUsername"]').val()
	data["password"] = $('input[name="newPassword"]').val()

	jQuery.ajax({
		url: "/backend/registration.php",
		type: "POST",
		data: JSON.stringify(data),
		success: function(resultData) {
			console.log("TESTETSET");
			setTimeout(login(data["username"],data["password"]), 1000);
		},
		error : function(jqXHR, textStatus, errorThrown) {
			console.log(errorThrown+" "+textStatus);
		},
		timeout: 120000,
	});
}
$("#logoutButton").click(function(e) {
	localStorage.removeItem("username");
	localStorage.removeItem("tokken");
	window.location.replace("/registration.html");
}); 
