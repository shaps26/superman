$("#buttonConnection").click(function (e) {
		e.preventDefault();
		var url= window.location.origin+'/login';
		console.log("je pass ici");
		$.post(url, {
			username: $('#inputUsername').val(),
			password: $('#inputPassword').val()
		}).done(function (result) {
			localStorage.setItem("serverToken", result.token);
			window.location.replace(window.location.origin);
		}).fail(function(){
			$("#reauth-email").html("Connection échoué");
		});
	});