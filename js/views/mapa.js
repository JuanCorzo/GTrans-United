$(function () {

    const dataUser = JSON.parse(localStorage.getItem('userData'));

    
    var LatandLong = {lat: 10.9832981, lng: -74.8017122};
    var zoom = 13;
    var map;
    var markers = {};
   /* var markersRelojes = {};
    var markersRelojesReferencia = {};*/
   /* var markersPasajeros = {};
    var markersVelocidades = {};*/
  /*  var kmlRutas = {}; */
    var pendienteLoad2 = false;
    var datosRecorrido;
    var markerRecorrido;
    var poliRecorrido = [];
    var intervaloRecorrido;
    var intervaloAnclado;
    var polilineaRecorrido;
    var recorriendo = false;
    var misVehiculo = [];

    $('#inpFechaConsolidado').val(dateNow());
    $('#inpFechaDetalle').val(dateNow());
    $('#inpFechaRecorrido').val(dateNow());
    $('#inpHoraInicialRecorrido').val(timeNow());
    $('#inpHoraFinalRecorrido').val(timeNow());

    // ---------------------------

    map = new google.maps.Map(document.getElementById('googleMap'), {
        zoom: zoom,
        center: LatandLong,
        fullscreenControl: false,
        mapTypeControl: false
    });


    $.ajax({
        url: urlAPI + "/vehiculos/getVehiculos/"+dataUser.idPropietario,
        type: "GET",
        dataType: 'JSON',
        contentType: 'application/json',
        beforeSend: function (xhr){ 
            xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
        },
        success: function (res){
            $.each(res.data, function(key, value) {
                misVehiculo.push(value.codigo);
                $("#inpVehiculoRecorrido").append("<option value="+value.codigo+">"+value.codigo+"</option>");
            });
            return false;
        },
        error: function (res){
            swal.error(res.responseJSON.message);
            return false;
        }
    });

    function cargarRutas() {
        let data = {"resultado":true,"data":[{"id":"4","nombre":"D - 6 ECOLOGICA - CALLE 30","nombreRL":"CALLE 30","estado":"1","idCliente":"1","Vueltas":"3","maxintercalar":"25","color":"#008000","kml":null,"kmlPHP":"--CLL30","guid":"24612C68-8A1D-4D7F-8198-1A8640F915B8","tiempo":null,"hora_despacho_maximo":"20:30:00","limit_bono":"320","limit_bono_f":"260","minTimbradasLogicas":"30","rutaKml":"http:\/\/anubis.lmsoluciones.co\/gema_lacarolina\/assets\/uploads\/kml\/--CLL30.kml"},{"id":"6","nombre":"A - 16 MIRAMAR","nombreRL":"MIRAMAR","estado":"1","idCliente":"1","Vueltas":"4","maxintercalar":"25","color":"#0080ff","kml":null,"kmlPHP":"Miramar43","guid":"2FA3F145-BCA5-478F-A8C0-D355BC25A9A2","tiempo":null,"hora_despacho_maximo":"20:30:00","limit_bono":"400","limit_bono_f":"350","minTimbradasLogicas":"30","rutaKml":"http:\/\/anubis.lmsoluciones.co\/gema_lacarolina\/assets\/uploads\/kml\/Miramar43.kml"}]};
        $.each(data.data, function (index, value) {
            new google.maps.KmlLayer(value["rutaKml"], {
              suppressInfoWindows: true,
              preserveViewport: false,
              map: map
            });
        });
       // cargarRelojes();
    }

    function getDataVehiculo(codigo) {
        $.ajax({
            url: urlAPI + "/viajes/getDatosUltimoViaje/"+codigo,
            type: "GET",
            dataType: 'JSON',
            contentType: 'application/json',
            beforeSend: function (xhr){ 
                xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
            },
            success: function (response) {
                $(".inpDatosVehiculo").val("N/A");
                $("#spanVehiculo").text("");
                $("#inpVehiculoHidden").val(codigo);
                let data = response.data[0];
                
                $("#spanVehiculo").text("(" + codigo + ")");
                $("#inpConductor").val((data["Conductor"]==null)?"N/A":data["Conductor"]);
                $("#inpTurno").val(data["Turno"]);
                $("#inpRuta").val(data["Ruta"]);
                $("#inpHoraDespacho").val(data["HoraDespacho"]);
                $("#inpEstado").val(data["Estado"]);

                return false;
            },
            error: function (res) {
                swal.error(res.responseJSON.message);
                return false;
            }
        });
    }

    function getDataVehiculoTracking(codigo) {
        $.ajax({
            url: urlAPI + "/tracking/getUltimaPosicionOpto/"+codigo,
            type: "GET",
            dataType: 'JSON',
            contentType: 'application/json',
            beforeSend: function (xhr){ 
                xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
            },
            success: function (response) {
                $(".inpDatosVehiculoTracking").val("N/A");
                let data = response.data[0];

                $("#inpVelocidad").val(data["VelocidadKPH"]);
                $("#inpUltimoDato").val(data["fecha"]);
                $.get("https://maps.googleapis.com/maps/api/geocode/json?latlng="+data["Latitude"]+","+data["longitude"]+"&key=AIzaSyBvrBF3dUzhRUxM4C3Zh_OMAms0-gigDOU",{},  function (geoData){   
                    $("#inpDireccion").val(geoData.results[0].formatted_address);
                });
                return false;
            },
            error: function (res) {
                swal.error(res.responseJSON.message);
                return false;
            }
        });
    }

    function AjaxDatosGrillaConsolidado(codigo) {
        $("#lblTotTimConsolidado").text("Timbs: -");
        $("#lblTotBloqConsolidado").text("Bloqs: -");
        $.ajax({
            url: urlAPI + "/tracking/getConsolidadoMovilidadOpto/"+$("#inpFechaConsolidado").val()+"/"+codigo,
            type: "GET",
            dataType: 'JSON',
            contentType: 'application/json',
            beforeSend: function (xhr){ 
                xhr.setRequestHeader('Authorization', localStorage.getItem('token')); 
                $("#btnCargarConsolidado").prop("disabled", true);
            },
            success: function (response) {
                var rtn = [];
                let timbs = 0;
                let bloqs = 0;
                $.each(response.data, function(key, value) {
                    timbs += value.pasajeros_automatico;
                    bloqs += value.BLOQUEOS;
                    rtn.push({val:[{fecha: value.FECHA_FORMAT, tim: value.pasajeros_automatico, bloqueos: value.BLOQUEOS}]});
                });
                $("#lblTotTimConsolidado").text("Timbs: " + timbs);
                $("#lblTotBloqConsolidado").text("Bloqs: " + bloqs);
                crearGrillaConsolidado(rtn);
                return false;
            },
            error: function (res) {
                swal.error(res.responseJSON.message);
                return false;
            },
            complete: function (res){
                $("#btnCargarConsolidado").prop("disabled", false);
            }
        });
    }  

    function AjaxDatosGrillaDetalle(codigo) {
        $("#lblTotSubDetalle").text("Sub.: -");
        $("#lblTotBajDetalle").text("Baj.: -");
        $("#lblTotBloqDetalle").text("Bloqs: -");
        $.ajax({
            url: urlAPI + "/tracking/getDetalleMovilidadOpto/"+$("#inpFechaDetalle").val()+"/"+codigo,
            type: "GET",
            dataType: 'JSON',
            contentType: 'application/json',
            beforeSend: function (xhr){ 
                xhr.setRequestHeader('Authorization', localStorage.getItem('token')); 
                $("#btnCargarDetalle").prop("disabled", true);
            },
            success: function (response) {
                var rtn = [];
                let subs = 0;
                let bajs = 0;
                let bloqs = 0;
                $.each(response.data, function(key, value) {
                    subs += value.SUBIDAS;
                    bajs += value.BAJADAS;
                    bloqs += value.BLOQUEOS;
                    rtn.push({val:[{fecha: value.FECHA_HORA, subs: value.SUBIDAS, bajas: value.BAJADAS, bloqueos: value.BLOQUEOS}]});
                });
                $("#lblTotSubDetalle").text("Sub.: " + subs);
                $("#lblTotBajDetalle").text("Baj.: " + bajs);
                $("#lblTotBloqDetalle").text("Bloqs: " + bloqs);
                crearGrillaDetalle(rtn);
                return false;
            },
            error: function (res) {
                swal.error(res.responseJSON.message);
                return false;
            },
            complete: function (res){
                $("#btnCargarDetalle").prop("disabled", false);
            }
        });
    } 

    function AjaxRecorrido(fecha, hora1, hora2, codigo) {
        let fecha1 = fecha + " " + hora1;
        let fecha2 = fecha + " " + hora2;
        $.ajax({
            url: urlAPI + "/tracking/getRecorridoOpto",
            type: "POST",
            dataType: 'JSON',
            contentType: 'application/json',
            data: JSON.stringify({codigo: codigo, fecha1: fecha1, fecha2: fecha2}),
            beforeSend: function (xhr){ 
                xhr.setRequestHeader('Authorization', localStorage.getItem('token')); 
                $("#btnCargarRecorrido").prop("disabled", true);
            },
            success: function (response) {
                datosRecorrido = response.data;
                recorrido();
                return false;
            },
            error: function (res) {
                swal.error(res.responseJSON.message);
                return false;
            },
            complete: function (res){
                $("#btnCargarRecorrido").prop("disabled", false);
            }
        });
    }

/*
    function cargarRelojes() {
        let response = {"resultado":true,"data":[{"id":"17","nombre":"ANTIGUO REX","latitud":"10.984697212190314","longuitud":"-74.77964550422081","estado":"1","observacion":"ANTIGUO REX","abreviatura":"REX","codegps":"3","control":"1","base":"0","idtipogps":"323","nombreGps":"CELLOCATOR","idGps":"323"},{"id":"20","nombre":"BASE 52","latitud":"10.980720","longuitud":"-74.792720","estado":"1","observacion":"BASE 52","abreviatura":"B52","codegps":"6","control":"1","base":"0","idtipogps":"323","nombreGps":"CELLOCATOR","idGps":"323"},{"id":"21","nombre":"BASE GUADALUPE","latitud":"11.00025","longuitud":"-74.788230","estado":"1","observacion":"BASE GUADALUPE","abreviatura":"GDA","codegps":"7","control":"1","base":"0","idtipogps":"323","nombreGps":"CELLOCATOR","idGps":"323"},{"id":"29","nombre":"CARREFOUR CALLE 30","latitud":"10.955800","longuitud":"-74.786290","estado":"1","observacion":"CARREFOUR CALLE 30","abreviatura":"C30","codegps":"15","control":"1","base":"0","idtipogps":"323","nombreGps":"CELLOCATOR","idGps":"323"},{"id":"33","nombre":"E.D.S LOS MANGOS","latitud":"10.932880","longuitud":"-74.764760","estado":"1","observacion":"E.D.S LOS MANGOS","abreviatura":"MGO","codegps":"19","control":"1","base":"0","idtipogps":"323","nombreGps":"CELLOCATOR","idGps":"323"},{"id":"38","nombre":"RELOJ PARQUE 100","latitud":"11.000470","longuitud":"-74.837020","estado":"1","observacion":"RELOJ PARQUE 100","abreviatura":"100","codegps":"24","control":"1","base":"0","idtipogps":"323","nombreGps":"CELLOCATOR","idGps":"323"},{"id":"40","nombre":"TERMINAL TRANSPORTE","latitud":"10.90966674950678","longuitud":"-74.79207224652293","estado":"1","observacion":"TERMINAL ENTRADA","abreviatura":"TER","codegps":"99","control":"1","base":"1","idtipogps":"323","nombreGps":"CELLOCATOR","idGps":"323"},{"id":"43","nombre":"LAS MALLAS","latitud":"10.910330","longuitud":"-74.779350","estado":"1","observacion":"LAS MALLAS","abreviatura":"MLL","codegps":"28","control":"1","base":"0","idtipogps":"323","nombreGps":"CELLOCATOR","idGps":"323"},{"id":"44","nombre":"MURILLO CON LA 4","latitud":"10.938266237529046","longuitud":"-74.79925990954791","estado":"1","observacion":"MURILLO CON LA 4","abreviatura":"LA4","codegps":"29","control":"1","base":"0","idtipogps":"323","nombreGps":"CELLOCATOR","idGps":"323"},{"id":"45","nombre":"ESTRELLA","latitud":"10.911100","longuitud":"-74.798250","estado":"1","observacion":"ESTRELLA","abreviatura":"EST","codegps":"30","control":"1","base":"0","idtipogps":"323","nombreGps":"CELLOCATOR","idGps":"323"},{"id":"46","nombre":"CALLE 30 CON 38","latitud":"10.97623","longuitud":"-74.777350","estado":"1","observacion":"CALLE 30 CON 38","abreviatura":"338","codegps":"31","control":"1","base":"0","idtipogps":"323","nombreGps":"CELLOCATOR","idGps":"323"},{"id":"47","nombre":"VILLA CAROLINA","latitud":"11.020300","longuitud":"-74.816150","estado":"1","observacion":"VILLA CAROLINA","abreviatura":"VLL","codegps":"32","control":"1","base":"0","idtipogps":"323","nombreGps":"CELLOCATOR","idGps":"323"},{"id":"48","nombre":"CALLE 76 CON CRA 60","latitud":"11.006680","longuitud":"-74.800160","estado":"1","observacion":"CALLE 76 CON CRA 60","abreviatura":"C76","codegps":"33","control":"1","base":"0","idtipogps":"323","nombreGps":"CELLOCATOR","idGps":"323"},{"id":"49","nombre":"PANORAMA","latitud":"10.946670","longuitud":"-74.786220","estado":"1","observacion":"PANORAMA","abreviatura":"PNR","codegps":"34","control":"1","base":"0","idtipogps":"323","nombreGps":"CELLOCATOR","idGps":"323"},{"id":"50","nombre":"CALLE 79 CON CRA 49","latitud":"10.999600","longuitud":"-74.811120","estado":"1","observacion":"CALLE 79 CON CRA 49","abreviatura":"C79","codegps":"35","control":"1","base":"0","idtipogps":"323","nombreGps":"CELLOCATOR","idGps":"323"},{"id":"52","nombre":"CALLE 48 CON 22","latitud":"10.966270","longuitud":"-74.795250","estado":"1","observacion":"CALLE 48 CON 22","abreviatura":"C48","codegps":"37","control":"1","base":"0","idtipogps":"323","nombreGps":"CELLOCATOR","idGps":"323"},{"id":"53","nombre":"AUTONOMA","latitud":"11.007390","longuitud":"-74.824990","estado":"1","observacion":"AUTONOMA","abreviatura":"S93","codegps":"38","control":"1","base":"0","idtipogps":"323","nombreGps":"CELLOCATOR","idGps":"323"},{"id":"55","nombre":"N\/A","latitud":"10.861068900","longuitud":"-74.800470049","estado":"1","observacion":"N\/A","abreviatura":"TSAL","codegps":"98","control":"1","base":"1","idtipogps":"323","nombreGps":"CELLOCATOR","idGps":"323"},{"id":"56","nombre":"PANORAMA","latitud":"10.946670","longuitud":"-74.786220","estado":"1","observacion":"PANORAMA","abreviatura":"PNR","codegps":"4","control":"1","base":"0","idtipogps":"324","nombreGps":"OPTOCONTROL","idGps":"324"},{"id":"57","nombre":"TERMINAL LA CAROLINA","latitud":"10.90966674950678","longuitud":"-74.79207224652293","estado":"1","observacion":"TERMINAL LA CAROLINA","abreviatura":"TER","codegps":"1","control":"1","base":"1","idtipogps":"324","nombreGps":"OPTOCONTROL","idGps":"324"},{"id":"58","nombre":"RELOJ PARQUE 100","latitud":"11.000470","longuitud":"-74.837020","estado":"1","observacion":"RELOJ PARQUE 100","abreviatura":"100","codegps":"17","control":"1","base":"0","idtipogps":"324","nombreGps":"OPTOCONTROL","idGps":"324"},{"id":"59","nombre":"ESTRELLA","latitud":"10.911100","longuitud":"-74.798250","estado":"1","observacion":"ESTRELLA","abreviatura":"EST","codegps":"23","control":"1","base":"0","idtipogps":"324","nombreGps":"OPTOCONTROL","idGps":"324"},{"id":"60","nombre":"CALLE 79 CON CRA 49","latitud":"10.999600","longuitud":"-74.811120","estado":"1","observacion":"CALLE 79 CON CRA 49","abreviatura":"C79","codegps":"25","control":"1","base":"0","idtipogps":"324","nombreGps":"OPTOCONTROL","idGps":"324"},{"id":"61","nombre":"CALLE 76 CON CRA 60","latitud":"11.006680","longuitud":"-74.800160","estado":"1","observacion":"CALLE 76 CON CRA 60","abreviatura":"C76","codegps":"26","control":"1","base":"0","idtipogps":"324","nombreGps":"OPTOCONTROL","idGps":"324"},{"id":"62","nombre":"CARREFOUR CALLE 30","latitud":"10.955800","longuitud":"-74.786290","estado":"1","observacion":"CARREFOUR CALLE 30","abreviatura":"C30","codegps":"28","control":"1","base":"0","idtipogps":"324","nombreGps":"OPTOCONTROL","idGps":"324"},{"id":"63","nombre":"LAS MALLAS","latitud":"10.910330","longuitud":"-74.779350","estado":"1","observacion":"LAS MALLAS","abreviatura":"MLL","codegps":"34","control":"1","base":"0","idtipogps":"324","nombreGps":"OPTOCONTROL","idGps":"324"},{"id":"64","nombre":"E.D.S LOS MANGOS","latitud":"10.932880","longuitud":"-74.764760","estado":"1","observacion":"E.D.S LOS MANGOS","abreviatura":"MGO","codegps":"35","control":"1","base":"0","idtipogps":"324","nombreGps":"OPTOCONTROL","idGps":"324"},{"id":"65","nombre":"BASE 52","latitud":"10.980720","longuitud":"-74.792720","estado":"1","observacion":"BASE 52","abreviatura":"B52","codegps":"38","control":"1","base":"0","idtipogps":"324","nombreGps":"OPTOCONTROL","idGps":"324"},{"id":"66","nombre":"BASE GUADALUPE","latitud":"11.00025","longuitud":"-74.788230","estado":"1","observacion":"BASE GUADALUPE","abreviatura":"GDA","codegps":"40","control":"1","base":"0","idtipogps":"324","nombreGps":"OPTOCONTROL","idGps":"324"},{"id":"67","nombre":"ANTIGUO REX","latitud":"10.984697212190314","longuitud":"-74.77964550422081","estado":"1","observacion":"ANTIGUO REX","abreviatura":"REX","codegps":"41","control":"1","base":"0","idtipogps":"324","nombreGps":"OPTOCONTROL","idGps":"324"},{"id":"68","nombre":"VILLA CAROLINA","latitud":"11.020300","longuitud":"-74.816150","estado":"1","observacion":"VILLA CAROLINA","abreviatura":"VLL","codegps":"49","control":"1","base":"0","idtipogps":"324","nombreGps":"OPTOCONTROL","idGps":"324"},{"id":"69","nombre":"CALLE 48 CON 22","latitud":"10.966270","longuitud":"-74.795250","estado":"1","observacion":"CALLE 48 CON 22","abreviatura":"C48","codegps":"50","control":"1","base":"0","idtipogps":"324","nombreGps":"OPTOCONTROL","idGps":"324"},{"id":"70","nombre":"AUTONOMA","latitud":"11.007390","longuitud":"-74.824990","estado":"1","observacion":"SAO DE LA 93","abreviatura":"AUTO","codegps":"51","control":"1","base":"0","idtipogps":"324","nombreGps":"OPTOCONTROL","idGps":"324"},{"id":"71","nombre":"CALLE 30 CON 38","latitud":"10.97623","longuitud":"-74.777350","estado":"1","observacion":"CALLE 30 CON 38","abreviatura":"338","codegps":"33","control":"1","base":"0","idtipogps":"324","nombreGps":"OPTOCONTROL","idGps":"324"},{"id":"72","nombre":"ALAMEDA","latitud":"10.997929421474456","longuitud":"-74.84089009485615","estado":"1","observacion":"ALAMEDA","abreviatura":"ALA","codegps":"52","control":"1","base":"0","idtipogps":"324","nombreGps":"OPTOCONTROL","idGps":"324"},{"id":"73","nombre":"ALAMEDA","latitud":"10.997929421","longuitud":"-74.840890094","estado":"1","observacion":"ALAMEDA","abreviatura":"ALA","codegps":"40","control":"1","base":"0","idtipogps":"323","nombreGps":"CELLOCATOR","idGps":"323"},{"id":"74","nombre":"HOTEL DEL PRADO","latitud":"10.997929421","longuitud":"-74.840890094","estado":"1","observacion":"HOTEL DEL PRADO","abreviatura":"PRA","codegps":"53","control":"1","base":"0","idtipogps":"324","nombreGps":"OPTOCONTROL","idGps":"324"},{"id":"75","nombre":"HOTEL DEL PRADO","latitud":"10.997929421474456","longuitud":"-74.84089009485615","estado":"1","observacion":"HOTEL DEL PRADO","abreviatura":"PRA","codegps":"53","control":"1","base":"0","idtipogps":"324","nombreGps":"OPTOCONTROL","idGps":"324"},{"id":"77","nombre":"MURILLO-KRA 8","latitud":"10.946146824465364","longuitud":"-74.79973800698875","estado":"1","observacion":"MURILLO-KRA 8","abreviatura":"KR8M","codegps":"57","control":"1","base":"0","idtipogps":"324","nombreGps":"OPTOCONTROL","idGps":"324"},{"id":"78","nombre":"UNICO","latitud":"10.989971319840475","longuitud":"-74.8112088687027","estado":"1","observacion":"UNICO","abreviatura":"UNIC","codegps":"58","control":"1","base":"0","idtipogps":"324","nombreGps":"OPTOCONTROL","idGps":"324"},{"id":"79","nombre":"TROJA","latitud":"10.993806513434997","longuitud":"-74.80881019619578","estado":"1","observacion":"TROJA","abreviatura":"TROJ","codegps":"59","control":"1","base":"0","idtipogps":"324","nombreGps":"OPTOCONTROL","idGps":"324"},{"id":"80","nombre":"PORTAL PRADO","latitud":"10.989782943868537","longuitud":"-74.78930120094645","estado":"1","observacion":"PORTAL PRADO","abreviatura":"PORT","codegps":"56","control":"1","base":"0","idtipogps":"324","nombreGps":"OPTOCONTROL","idGps":"324"},{"id":"81","nombre":"CALANCALA","latitud":"10.974229758","longuitud":"-74.792565893","estado":"1","observacion":"CALANCALA","abreviatura":"CALA","codegps":"60","control":"1","base":"0","idtipogps":"324","nombreGps":"OPTOCONTROL","idGps":"324"},{"id":"82","nombre":"UNI ATALANTICO","latitud":"11.020213780506278","longuitud":"-74.87141325053817","estado":"1","observacion":"UNI ATLANTICO","abreviatura":"ATLA","codegps":"54","control":"1","base":"0","idtipogps":"324","nombreGps":"OPTOCONTROL","idGps":"324"},{"id":"83","nombre":"ARGOS","latitud":"10.914026734","longuitud":"-74.776950579","estado":"1","observacion":"ARGOS","abreviatura":"ARGO","codegps":"55","control":"1","base":"0","idtipogps":"324","nombreGps":"OPTOCONTROL","idGps":"324"},{"id":"84","nombre":"HOTEL DEL PRADO","latitud":"10.997929421","longuitud":"-74.840890094","estado":"1","observacion":"HOTEL DEL PRADO","abreviatura":"PRA","codegps":"41","control":"1","base":"0","idtipogps":"323","nombreGps":"CELLOCATOR","idGps":"323"},{"id":"85","nombre":"MURILLO-KRA 8","latitud":"10.946146824","longuitud":"-74.799738006","estado":"1","observacion":"MURILLO-KRA 8","abreviatura":"KR8M","codegps":"42","control":"1","base":"0","idtipogps":"323","nombreGps":"CELLOCATOR","idGps":"323"},{"id":"86","nombre":"UNICO","latitud":"10.989971319","longuitud":"-74.811208868","estado":"1","observacion":"UNICO","abreviatura":"UNIC","codegps":"43","control":"1","base":"0","idtipogps":"323","nombreGps":"CELLOCATOR","idGps":"323"},{"id":"87","nombre":"TROJA","latitud":"10.993806513","longuitud":"-74.808810196","estado":"1","observacion":"TROJA","abreviatura":"TROJ","codegps":"44","control":"1","base":"0","idtipogps":"323","nombreGps":"CELLOCATOR","idGps":"323"},{"id":"88","nombre":"PORTAL PRADO","latitud":"10.989782943","longuitud":"-74.789301200","estado":"1","observacion":"PORTAL PRADO","abreviatura":"PORT","codegps":"45","control":"1","base":"0","idtipogps":"323","nombreGps":"CELLOCATOR","idGps":"323"},{"id":"89","nombre":"CALANCALA","latitud":"10.974229758","longuitud":"-74.792565893","estado":"1","observacion":"CALANCALA","abreviatura":"CALA","codegps":"46","control":"1","base":"0","idtipogps":"323","nombreGps":"CELLOCATOR","idGps":"323"},{"id":"90","nombre":"UNI ATLANTICO","latitud":"11.020213780","longuitud":"-74.871413250","estado":"1","observacion":"UNI ATLANTICO","abreviatura":"ATLA","codegps":"47","control":"1","base":"0","idtipogps":"323","nombreGps":"CELLOCATOR","idGps":"323"},{"id":"91","nombre":"ARGOS","latitud":"10.914026734","longuitud":"-74.776950579","estado":"1","observacion":"ARGOS","abreviatura":"ARGO","codegps":"48","control":"1","base":"0","idtipogps":"323","nombreGps":"CELLOCATOR","idGps":"323"}]};       
        if (response.resultado) {
            $.each(response.data, function (i, item) {
                createRelojes(parseFloat(item.latitud), parseFloat(item.longuitud), item.nombre, parseInt(item.id), item.control);
            });
        } else {
            toastr.error("OcurriÃ³ un error: " + response.message);
        }
    }
*/
    function limpiarMarkers() {
        $.each(markers, function (index, i) {
            markers[index].setMap(null);
        });
        markers = {};
    }
/*
    function limpiarMarkersPasajeros() {
        $.each(markersPasajeros, function (index, i) {
            markersPasajeros[index].setMap(null);
        });
        markersPasajeros = {};
    }

    function limpiarMarkersVelocidades() {
        $.each(markersVelocidades, function (index, i) {
            markersVelocidades[index].setMap(null);
        });
        markersVelocidades = {};
    }
*/
    function ocultarMarkers() {
        $.each(markers, function (index, marker) {
            marker.setMap(null);
        });
    }

    function mostrarMarkers() {
        $.each(markers, function (index, marker) {
            marker.setMap(map);
        });
    }

     function mostrarIconsRecorridos(){
        $("#btnsFlotantesRecorridos").removeClass("displayNone");
        $("#btnsFlotantesRecorridos").addClass("displayBlock");   
    }

    function ocultarIconsRecorridos(){
        $("#btnsFlotantesRecorridos").removeClass("displayBlock");
        $("#btnsFlotantesRecorridos").addClass("displayNone");   
    }

/*
    function createRelojes(lat, longi, nombre, id, control) {
        if (control == 1) {
            var mkReloj = new google.maps.Marker({
                position: new google.maps.LatLng(lat, longi),
                map: map,
                icon: '../images/markers/relojes/markerRelojControl.png',
                title: nombre
            });
            var contentString = '<div id="content">'+
                '<div id="siteNotice">'+
                '</div>'+
                '<div id="bodyContent">'+
                '<p style="margin:2px; font-weight: bold; color: #1A7BB9; text-align: center"><small style="font-size:9px">PUNTO DE CONTROL</small> <br>'+nombre+'</p>'+
                '</div>'+
                '</div>';
            var infowindow = new google.maps.InfoWindow({
              content: contentString
            });
            mkReloj.addListener('click', function() {
              infowindow.open(map, mkReloj);
            });

            markersRelojes[id] = markersRelojes[id] || mkReloj;
        } else {
            var mkRelojReferencia = new google.maps.Marker({
                position: new google.maps.LatLng(lat, longi),
                map: map,
                icon: '../images/markers/relojes/markerRelojReferencia.png',
                title: nombre
            });
            var contentString = '<div id="content">'+
                '<div id="siteNotice">'+
                '</div>'+
                '<div id="bodyContent">'+
                '<p style="margin:2px; font-weight: bold; color: #1A7BB9; text-align: center"><small style="font-size:9px">PUNTO DE REFERENCIA</small> <br>'+nombre+'</p>'+
                '</div>'+
                '</div>';
            var infowindow = new google.maps.InfoWindow({
              content: contentString
            });
            mkRelojReferencia.addListener('click', function() {
              infowindow.open(map, mkRelojReferencia);
            });

            markersRelojesReferencia[id] = markersRelojesReferencia[id] || mkRelojReferencia;
        }
    }

    function createPasajeros(lat, longi, registradora, id) {
        var mkPasajero = new MarkerWithLabel({
            position: new google.maps.LatLng(lat, longi),
            draggable: false,
            map: map,
            labelContent: 'Pasajero NÂ° ' + registradora,
            icon: '../images/markers/otros/user.png',
            labelAnchor: new google.maps.Point(30, 0),
            labelClass: "labelMarker",
            title: 'Pasajero NÂ° ' + registradora
        });
        markersPasajeros[id] = markersPasajeros[id] || mkPasajero;
    }

    function createVelocidad(lat, longi, velocidad, id) {
        var mkVelocidad = new MarkerWithLabel({
            position: new google.maps.LatLng(lat, longi),
            draggable: false,
            map: map,
            labelContent: 'Max: ' + velocidad,
            icon: '../images/markers/otros/tacometro.png',
            labelAnchor: new google.maps.Point(30, 0),
            labelClass: "labelMarker",
            title: 'Max: ' + velocidad
        });
        markersVelocidades[id] = markersVelocidades[id] || mkVelocidad;
    }
*/
    function createMarker(lat, longi, codigo, rumbo, velocidad, idEvento) {
        var marker = new google.maps.Marker({
            position: {lat: lat, lng: longi},
            icon: imagenRumbo(rumbo, idEvento, velocidad),
            label: {
              text: codigo,
              color: '#fff',
              fontSize: '11px',
              fontWeight: 'bold',
            },
            map: map,
            title: codigo,
            codigo: codigo,
        });
        google.maps.event.addListener(marker, 'click', function () {
            getDataVehiculo(codigo);
            getDataVehiculoTracking(codigo);
            AjaxDatosGrillaConsolidado(codigo);
            AjaxDatosGrillaDetalle(codigo);
            $("#modalDetalle").modal();
        })
        markers[codigo] = markers[codigo] || marker;
    }

    function refreshMarker(marker, lat, longi, rumbo, velocidad, idEvento, opto) {
        marker.setPosition(new google.maps.LatLng(lat, longi), {
            easing: "linear",
            duration: 6000,
        });
        // marker.setPosition(new google.maps.LatLng(lat, longi));
        
        if(opto){
            var latAnterior = marker.getPosition().lat();
            var longAnterior = marker.getPosition().lng();

            if(getDistance(latAnterior, longAnterior, lat, longi)>1){
                marker.setIcon(imagenRumbo(Math.round(getRumbo(latAnterior, longAnterior, lat, longi)), idEvento, velocidad));
            }
        }else{
            marker.setIcon(imagenRumbo(rumbo, idEvento, velocidad));  
        }
        
    }

    function buscarMarker(param) {
        var marker = markers[param];
        if (marker == null) {
            swal.warning("El vehiculo no se encuentra en el mapa");
            return false;
        }
        map.setCenter(marker.position);
        map.setZoom(16);

        marker.setAnimation(google.maps.Animation.BOUNCE);

        window.setTimeout(function() {
            marker.setAnimation(null);
        }, 10000);
    }

    function crearGrillaConsolidado(datos){
        var source = {
            localData: datos,
            dataType: "array"
        };
        dataAdapter = new $.jqx.dataAdapter(source); 
        $("#gridConsolidados").jqxDataTable({
            width: '99.5%',
            theme: 'material', 
            source: dataAdapter,
            sortable: false,
            pageable: true,
            pageSize: 20,
            pagerButtonsCount: 5,
            enableHover: false,
            selectionMode: 'none',
            columns: [
                  {
                      text: 'Ventas', align: 'left', dataField: 'model',
                      cellsRenderer: function (row, column, value, rowData) {
                          var punto = rowData.val;
                          var container = "<div>";
                          for (var i = 0; i < punto.length; i++) {
                              var punto = punto[i];
                              var item = "<div style='width: 100%; overflow: hidden; white-space: nowrap;'>";
                              var info = "<div style='background: #E9ECEF; margin: 5px; margin-left: 10px; margin-bottom: 3px; padding: 10px 15px; border-radius: 10pt; font-size: 15px'>";
                              info += "<div class='row'><div class='col-12 col-sm-6 textCenter' style='font-weight: bold; margin-bottom: 5px'>"+punto.fecha+"</div><div class='col-6 col-sm-3'>Timbs: "+punto.tim+"</div><div class='col-6 col-sm-3' style='background: white; color: #039be5; font-weight: bold; border-radius: 7pt 0pt 0pt 7pt;'>Bloqs: "+punto.bloqueos+"</div></div>";
                              info += "</div>";
                              item += info;
                              item += "</div>";
                              container += item;
                          }
                          container += "</div>";
                          return container;
                      }
                  }
            ]
        });
    }

    function crearGrillaDetalle(datos){
        var source = {
            localData: datos,
            dataType: "array"
        };
        dataAdapter = new $.jqx.dataAdapter(source); 
        $("#gridDetalle").jqxDataTable({
            width: '99.5%',
            theme: 'material', 
            source: dataAdapter,
            sortable: false,
            pageable: true,
            pageSize: 20,
            pagerButtonsCount: 5,
            enableHover: false,
            selectionMode: 'none',
            columns: [
                  {
                      text: 'Ventas', align: 'left', dataField: 'model',
                      cellsRenderer: function (row, column, value, rowData) {
                          var punto = rowData.val;
                          var container = "<div>";
                          for (var i = 0; i < punto.length; i++) {
                              var punto = punto[i];
                              var item = "<div style='width: 100%; overflow: hidden; white-space: nowrap;'>";
                              var info = "<div style='background: #E9ECEF; margin: 5px; margin-left: 10px; margin-bottom: 3px; padding: 10px 15px; border-radius: 10pt; font-size: 15px'>";
                              info += "<div class='row'><div class='col-12 textCenter' style='background: white; color: #039be5; font-weight: bold; margin-bottom: 5px'>"+punto.fecha+"</div><div class='col-4 textCenter'>Subs.: "+punto.subs+"</div><div class='col-4 textCenter'>Bajs.: "+punto.bajas+"</div><div class='col-4 textCenter'>Bloqs: "+punto.bloqueos+"</div></div>";
                              info += "</div>";
                              item += info;
                              item += "</div>";
                              container += item;
                          }
                          container += "</div>";
                          return container;
                      }
                  }
            ]
        });     
    }

    function limpiarRecorrido() {
        markerRecorrido.setMap(null);
        markerRecorrido = null;
        polilineaRecorrido.setMap(null);
        clearInterval(intervaloRecorrido);
        poliRecorrido = [];
        recorriendo = false;
    }

    $("#btnRefrecar").click(function () {
        if (markerRecorrido) {
            limpiarRecorrido();
            mostrarMarkers();
          /*  limpiarMarkersPasajeros();
            limpiarMarkersVelocidades();*/
        }
        map.setCenter(LatandLong);
        map.setZoom(zoom);
        ocultarIconsRecorridos();
        $("#inpVehiculo").val("");
    });

    var indexPos = 0;
    function recorrido() {
        if (datosRecorrido.length == 0) {
            swal.error("No hay datos para mostrar");
            limpiarRecorrido();
            return false;
        } else {
            if (markerRecorrido != null) {
                limpiarRecorrido();
            }
            $.each(datosRecorrido, function (index, dato) {
                poliRecorrido.push({lat: parseFloat(datosRecorrido[index].LATITUD), lng: parseFloat(datosRecorrido[index].LONGITUD)})
            });

            polilineaRecorrido = new google.maps.Polyline({
                path: poliRecorrido,
                geodesic: true,
                strokeColor: '#343a40',
                strokeOpacity: 1.0,
                strokeWeight: 3
            });
            polilineaRecorrido.setMap(map);

            markerRecorrido = new google.maps.Marker({
                position: {lat: parseFloat(datosRecorrido[0].LATITUD), lng: parseFloat(datosRecorrido[0].LONGITUD)},
                icon: '../images/markers/SinRuta/1.svg',
                label: {
                  text: datosRecorrido[0].codigo,
                  color: '#fff',
                  fontSize: '11px',
                  fontWeight: 'bold',
                },
                map: map,
                title: datosRecorrido[0].codigo,
                codigo: datosRecorrido[0].codigo,
            });

            ocultarMarkers();
            mostrarIconsRecorridos();
            $("#modalRecorrido").modal("hide");
            indexPos = 0;
            runRecorrido();
        }
    }

    function runRecorrido() {
        $("#btnPause").html("<i class='fa fa-pause'></i>");
        map.setZoom(17);
        recorriendo = true;
        intervaloRecorrido =
        setInterval(
            function () {
                moverMarkerRecorrido();
                if (indexPos == datosRecorrido.length - 1) {
                    clearInterval(intervaloRecorrido);
                }
                indexPos += 1;
            }
        , 2000);
    }

    function moverMarkerRecorrido() {
        markerRecorrido.setPosition(new google.maps.LatLng(parseFloat(datosRecorrido[indexPos].LATITUD), parseFloat(datosRecorrido[indexPos].LONGITUD)));
        map.setCenter(new google.maps.LatLng(parseFloat(datosRecorrido[indexPos].LATITUD), parseFloat(datosRecorrido[indexPos].LONGITUD)));
    }

    $("#btnPause").click(function () {
        if (recorriendo) {
            recorriendo = false;
            clearInterval(intervaloRecorrido);
            $("#btnPause").html("<i class='fa fa-play'></i>");
            markerRecorrido.setIcon('../images/markers/otros/pausado.svg');  
        } else {
            runRecorrido();
            markerRecorrido.setIcon('../images/markers/SinRuta/1.svg');  
        }
    });

    $("#btnNext").click(function () {
        if (indexPos == datosRecorrido.length - 1) {
            return false;
        }
        indexPos += 1;
        moverMarkerRecorrido();
    });

    $("#btnBack").click(function () {
        if (indexPos == 0) {
            return false;
        }
        indexPos -= 1;
        moverMarkerRecorrido();
    });

    $("#btnFirst").click(function () {
        if (indexPos == 0) {
            return false;
        }
        indexPos = 0;
        moverMarkerRecorrido();
    });

    $("#btnLast").click(function () {
        if (indexPos == datosRecorrido.length - 1) {
            return false;
        }
        indexPos = datosRecorrido.length - 1;
        moverMarkerRecorrido();
    });

    $("#btnRecorrido").click(function () {
        $("#modalRecorrido").modal();
    });

    $("#btnBusqueda").click(function () {
        buscarMarker($("#inpVehiculo").val());
    });

    $("#btnCargarConsolidado").click(function () {
        AjaxDatosGrillaConsolidado($("#inpVehiculoHidden").val());
    });

    $("#btnCargarDetalle").click(function () {
        AjaxDatosGrillaDetalle($("#inpVehiculoHidden").val());
    });

    $("#aTabConsolidado").click(function () {
        $('#gridConsolidados').jqxDataTable({width: $('#gridConsolidados').jqxDataTable('width') - 1 });
        $('#gridConsolidados').jqxDataTable({width: $('#gridConsolidados').jqxDataTable('width') + 1 });
    });

    $("#aTabDetalle").click(function () {
        $('#gridDetalle').jqxDataTable({width: $('#gridDetalle').jqxDataTable('width') - 1 });
        $('#gridDetalle').jqxDataTable({width: $('#gridDetalle').jqxDataTable('width') + 1 }); 
    });

    $("#btnCargarRecorrido").click(function () {

        if ($("#inpVehiculoRecorrido").val() == "") {
            swal.error("Debe digitar un vehiculo");
            return false;
        }
        if ($("#inpFechaRecorrido").val() == "") {
            swal.error("Debe digitar una fecha");
            return false;
        }
        
        if ($("#inpHoraInicialRecorrido").val() == "" || $("#inpHoraFinalRecorrido").val() == "") {
            swal.error("Debe digitar las horas");
            return false;
        }

        AjaxRecorrido($("#inpFechaRecorrido").val(), $("#inpHoraInicialRecorrido").val(), $("#inpHoraFinalRecorrido").val(), $("#inpVehiculoRecorrido").val());
        
    });

    cargarRutas();

    try{
        var socket2;
        var host2 = urlSocketOpto + "/ultimasPosiciones/"+"123"+"/"+"P"+"/"+"123";
        var socket2 = new WebSocket(host2);
        pendienteLoad2 = false;
        socket2.onmessage = function(msg){
            if(misVehiculo.length == 0){
                return false;
            }
            if (pendienteLoad2 == false) {
                $.each(JSON.parse(msg.data), function (i, item) {  
                    if(misVehiculo.indexOf(item.codigo) != -1){
                        let lat = ConvertDMSToDD(item.Latitude);        
                        let longi = ConvertDMSToDD(item.longitude);

                        createMarker(lat, longi, item.codigo, "", item.VelocidadKPH, item.IDEvento);
                    }
                });
                pendienteLoad2 = true;
            }else{
                $.each(JSON.parse(msg.data), function (i, item) {
                    if(misVehiculo.indexOf(item.codigo) != -1){
                        let lat = ConvertDMSToDD(item.Latitude);        
                        let longi = ConvertDMSToDD(item.longitude);

                        refreshMarker(markers[item.codigo], lat, longi, "", parseInt(item.VelocidadKPH), item.IDEvento, true);
                    }
                });
            }
        }

    }catch(exception){
        console.log('<p>Error'+exception);
    }

/*
    try{
        var socket;
        var host = "ws://"+IPSocket+":9002/ultimasPosiciones/"+idUsuarioApp+"/"+"U"+"/"+identificacionApp;
        var socket = new WebSocket(host);
        pendienteLoad = false;
        socket.onmessage = function(msg){
            if (pendienteLoad== false) {
                $.each( JSON.parse(msg.data), function (i, item) {
                    createMarker(parseFloat(item.Latitude), parseFloat(item.longitude), item.codigo, 
                        parseInt(item.Rumbo), parseInt(item.VelocidadKPH), item.FechaHora, item.placa, 
                        item.IDEvento, parseInt(item.idRuta));
                });
                pendienteLoad=true;
            } else{
                $.each( JSON.parse(msg.data), function (i, item) {
                    refreshMarker(markers[item.codigo], parseFloat(item.Latitude), parseFloat(item.longitude), 
                        parseInt(item.Rumbo), parseInt(item.VelocidadKPH), item.FechaHora, item.placa, item.IDEvento, 
                        parseInt(item.idRuta));
                });
            }
        }

    }catch(exception){
        message('<p>Error'+exception);
    }
*/


});
