$(function() {

	function setLogin(cedula, pass) {
	    $.ajax({
	        url: urlAPI + "/login",
	        type: "POST",
	        dataType: 'JSON',
	        contentType: 'application/json',
	        data: JSON.stringify({cedula: cedula, pass: pass, isUnited: 1}),
	        success: function (res){
	        	localStorage.setItem('token', res.data.token);
	        	localStorage.setItem('userData', JSON.stringify(res.data.userData));

	        	if(res.data.userData.empresas.lenght == 0){
					swal.error('Sus vehiculos no estan vinculados a ninguna empresa disponible');
					return false;
				}

	        	if(res.data.userData.tipo_app == "BASIC"){
	        		$.each(res.data.userData.empresas, function(key, value) {
					  	$("#inputEmpresa").append("<option value='"+value.id+"'>"+value.empresa+"</option>");
					});
	        		$("#cardLogin").addClass("displayNone");
	        		$("#cardEmpresa").removeClass("displayNone");
	        	}else{
	        		redirect();
	        	}

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

	$("#btnSelectEmpresa").click(function(){

		if($("#inputEmpresa").val() == null){
			swal.error('Debe escoger una empresa');
			return false;	
		}

		let dataUser = JSON.parse(localStorage.getItem('userData'));
		let empresaSelect = [{id: parseInt($("#inputEmpresa").val()), empresa: $("#inputEmpresa option:selected").text()}];
		dataUser.empresas = empresaSelect;
		localStorage.setItem('userData', JSON.stringify(dataUser));

		redirect();
	});

	function redirect(){
		// ANIMACION ROTACION DE BODY
    	$("body").addClass("classAnimationBodyLogin");
    	setTimeout(function(){
			$(location).attr('href','views/app.html');	
		}, 3000);
	}


	$(window).resize(function(){
		if($(window).height() < 600){
			$("#footerLogin").addClass("displayNone");
		}else{
			$("#footerLogin").removeClass("displayNone");
		}
	});


});