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
	            $(location).attr('href','views/app.html');
	            return false;
	        },
	        error: function (res){
	        	swal.error(res.responseJSON.message);
	            return false;
	        }
	    });
    }
    

	$("#btnlogin").click(function(){
		if($("#inputCedula").val()==""){
			swal.error('Debe ingresar una cedula');
			return false;
		}

		if($("#inputPassword").val()==""){
			swal.error('Debe ingresar una contraseña');
			return false;
		}

		setLogin($("#inputCedula").val(), $("#inputPassword").val());			
	});





});