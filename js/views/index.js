$(function() {

	function setLogin(cedula, pass) {
	    $.ajax({
	        url: urlAPI + "/login",
	        type: "POST",
	        dataType: 'JSON',
	        contentType: 'application/json',
	        data: JSON.stringify({cedula: cedula, pass: pass}),
	        success: function (res){
	        	localStorage.setItem('token', res.data.token);
	        	localStorage.setItem('userData', JSON.stringify(res.data.userData));
	            alert(res.message);
	            $(location).attr('href','views/app.html');

	            return false;
	        },
	        error: function (res){
	        	alert(res.responseJSON.message);
	            return false;
	        }
	    });
    }
    

	$("#btnlogin").click(function(){
		if($("#inputCedula").val()==""){
			alert("Debe ingresar una cedula");
			return false;
		}

		if($("#inputPassword").val()==""){
			alert("Debe ingresar una contraseña");
			return false;
		}

		setLogin($("#inputCedula").val(), $("#inputPassword").val());			
	});





});