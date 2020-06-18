

var urlAPI = "http://192.190.42.212:3000";


var aggregatesRender = function (aggregates) {
	var value = aggregates['sum'];
	if( value == null){
	     value=0
	}
	var renderstring = '<div style="float: right; margin: 4px; overflow: hidden;"><b>' +   value  + '</b></div>';
	return renderstring;
}   

if ($(window).width() <= 530) {  
	var canvas = document.getElementsByClassName("chartResize");  
  	canvas[0].height = 90;
}     

function dateNow() {
    var now = new Date();
    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear() + "-" + (month) + "-" + (day);
    return today;
}

function imagenRumbo(rumbo, idEvento, enruta, ruta, velocidad) {
    url= '../../images/';
    imagen = "";
    if (velocidad>=50) {
        return '../../images/ExcesoVelocidadIcon.png';
    };
    if (enruta){
        if (idEvento == 1) {
             return  '../../images/pausado.png';
        }            
        else if (rumbo > 315 || (rumbo >= 0 && rumbo <= 45))
        {
            imagen = '../../images/1.png';
        }
        else if (rumbo > 45 && rumbo <= 135)
        {
            imagen = '../../images/3.png';
        }
        else if (rumbo > 135 && rumbo <= 225)
        {
            imagen = '../../images/2.png';
        }
        else if (rumbo > 225 && rumbo <= 315)
        {
            imagen = '../../images/4.png';
        }
    }else{
        if (idEvento == 1) {
            return  '../../images/pausadof.png';
        }            
        else if (rumbo > 315 || (rumbo >= 0 && rumbo <= 45))
        {
            imagen = '../../images/1f.png';
        }
        else if (rumbo > 45 && rumbo <= 135)
        {
            imagen = '../../images/3f.png';
        }
        else if (rumbo > 135 && rumbo <= 225)
        {
            imagen = '../../images/2f.png';
        }
        else if (rumbo > 225 && rumbo <= 315)
        {
            imagen = '../../images/4f.png';
        }

    }
    return imagen;
}

