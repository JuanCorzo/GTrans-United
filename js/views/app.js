$(function() {
   	
	let dataUser = JSON.parse(localStorage.getItem('userData'));

    $('#lblpropietario').text(dataUser.personalCorto);


	$("#btnCerrarSesion").click(function(){																	
		$(location).attr('href','../index.html');
		localStorage.removeItem('token');					
	});

 	
	// FUNCIONES MENU
	$(document).on('click','.MenuLink',function(){
	
		switch($(this).data('id')) {
			case "MenuDashboard":
			    cargarVistaIframe("dashboard.html");
			    break;
			case "MenuMapa":
			    cargarVistaIframe("mapa.html");
			    break;
			case "MenuExcesosVelocidad":
			    cargarVistaIframe("excesosVelocidad.html");
			    break;
			case "MenuViajes":
				Swal.fire({title: "Opcion en construccion", icon: "warning"});
			    // cargarVistaIframe("viajes.html");
			    break;
			case "MenuGraficas":
				Swal.fire({title: "Opcion en construccion", icon: "warning"});
			    // cargarVistaIframe("grafica.html");
			    break;
		}

		$("#sidebarToggle").click();
	});

	function cargarVistaIframe(contenido){
		$("#divIframe").html("<iframe src="+contenido+" class='width100porciento height100porciento' frameborder='0' vspace='0' hspace='0' marginwidth='0' marginheight='0'/></iframe>");
	}


});