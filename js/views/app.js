$(function() {
   	
	if(localStorage.getItem('userData') == null || localStorage.getItem('token') == null){
		cerrarSesion();
	}

	const dataUser = JSON.parse(localStorage.getItem('userData'));

	toast.success("Bienvenido Sr(a) " + dataUser.personalCorto);

    $('#lblpropietario').text(dataUser.personalCorto);

	$("#btnCerrarSesion").click(function(){
		cerrarSesion();
	});
 	
 	
 	// FAST CLICK (300 ms)
 	FastClick.attach(document.body);


	// FUNCIONES MENU
	$(document).on('click','.MenuLink',function(){
		
		$("#sidebarToggle").click();
			
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
			    cargarVistaIframe("viajes.html");
			    break;
			case "MenuGastos":
			    cargarVistaIframe("gastos.html");
			    break;
			case "MenuGraficas":
			    cargarVistaIframe("grafica.html");
			    break;
		}

	});

	function cargarVistaIframe(contenido){
		$("#divIframe").html("<iframe src="+contenido+" class='width100porciento height100porciento' frameborder='0' vspace='0' hspace='0' marginwidth='0' marginheight='0'/></iframe>");
	}

	function cerrarSesion(){
		localStorage.removeItem('token');
		localStorage.removeItem('userData');
		$(location).attr('href','../index.html');
	}


});