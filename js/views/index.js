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
	            Swal.fire({title: res.message, icon: 'success'});
	            $(location).attr('href','views/app.html');

	            return false;
	        },
	        error: function (res){
	        	Swal.fire('Oops...', res.responseJSON.message, 'error');
	            return false;
	        }
	    });
    }
    

	$("#btnlogin").click(function(){
		if($("#inputCedula").val()==""){
			Swal.fire('Oops...', 'Debe ingresar una cedula', 'error');
			return false;
		}

		if($("#inputPassword").val()==""){
			Swal.fire('Oops...', 'Debe ingresar una contraseña', 'error');
			return false;
		}

		setLogin($("#inputCedula").val(), $("#inputPassword").val());			
	});





});