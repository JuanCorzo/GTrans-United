$(function () {

    var LatandLong;
    var zoom;
    var map;
    var markers = {};
    var markersRelojes = {};
    var markersRelojesReferencia = {};
    var markersPasajeros = {};
    var markersVelocidades = {};
    var kmlRutas = {};
    var panelLateralCerrado = true;
    var pendienteLoad = false;
    var datosRecorrido;
    var markerRecorrido;
    var poliRecorrido = [];
    var intervaloRecorrido;
    var intervaloAnclado;
    var polilineaRecorrido;
    var recorriendo = false;
    var fullScreen = false;
    var misVehiculo = [510, 730, 536, 616, 812];
    // ---------------------------
/*
    $.ajax({
        url: "getListarVehiculo",
        type: "POST",
        dataType: "JSON",
        success: function (response) {
            $.each(response.data, function (index, value) {
                misVehiculo.push(value.placa);
            });
            return false;
        },
        error: function (xhr) {
            toastr.error("Error cargando vehiculos");
            return false;
        }
    });
*/
    var LatandLong = {lat: 11.0073953, lng: -74.8286633};
    var zoom = 13;

    map = new google.maps.Map(document.getElementById('googleMap'), {
        zoom: zoom,
        center: LatandLong,
        fullscreenControl: false,
        mapTypeControl: false
    });

    function cargarRutas() {
        let data = {"resultado":true,"data":[{"id":"3","nombre":"D - 7 ECOLOGICA - CALLE 17","nombreRL":"CALLE 17","estado":"1","idCliente":"1","Vueltas":"3","maxintercalar":"25","color":"#ffff80","kml":null,"kmlPHP":"D-7C17","guid":"F7CC32E1-C995-45B0-A96C-C2DAECB4FD87","tiempo":null,"hora_despacho_maximo":"20:30:00","limit_bono":"320","limit_bono_f":"260","minTimbradasLogicas":"30","rutaKml":"http:\/\/anubis.lmsoluciones.co\/gema_lacarolina\/assets\/uploads\/kml\/D-7C17.kml"},{"id":"4","nombre":"D - 6 ECOLOGICA - CALLE 30","nombreRL":"CALLE 30","estado":"1","idCliente":"1","Vueltas":"3","maxintercalar":"25","color":"#008000","kml":null,"kmlPHP":"--CLL30","guid":"24612C68-8A1D-4D7F-8198-1A8640F915B8","tiempo":null,"hora_despacho_maximo":"20:30:00","limit_bono":"320","limit_bono_f":"260","minTimbradasLogicas":"30","rutaKml":"http:\/\/anubis.lmsoluciones.co\/gema_lacarolina\/assets\/uploads\/kml\/--CLL30.kml"},{"id":"6","nombre":"A - 16 MIRAMAR","nombreRL":"MIRAMAR","estado":"1","idCliente":"1","Vueltas":"4","maxintercalar":"25","color":"#0080ff","kml":null,"kmlPHP":"Miramar43","guid":"2FA3F145-BCA5-478F-A8C0-D355BC25A9A2","tiempo":null,"hora_despacho_maximo":"20:30:00","limit_bono":"400","limit_bono_f":"350","minTimbradasLogicas":"30","rutaKml":"http:\/\/anubis.lmsoluciones.co\/gema_lacarolina\/assets\/uploads\/kml\/Miramar43.kml"},{"id":"7","nombre":"A -- 16 MIRAMAR","nombreRL":"EXPRESS","estado":"1","idCliente":"1","Vueltas":"5","maxintercalar":"25","color":"#ff0000","kml":null,"kmlPHP":"--EXP","guid":"9BB50A77-AB0C-4C6E-8122-404C67F0D66C","tiempo":null,"hora_despacho_maximo":"21:00:00","limit_bono":"320","limit_bono_f":"250","minTimbradasLogicas":"30","rutaKml":"http:\/\/anubis.lmsoluciones.co\/gema_lacarolina\/assets\/uploads\/kml\/--EXP.kml"}]};
        $.each(data.data, function (index, value) {
            new google.maps.KmlLayer(value["rutaKml"], {
              suppressInfoWindows: true,
              preserveViewport: false,
              map: map
            });
        });
       // cargarRelojes();
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

    function ocultarMarkersPorRuta(idRuta) {
        $.each(markers, function (index, marker) {
            if (marker.idRuta == idRuta) {
                marker.setMap(null);
            }
        });
    }

    function mostrarMarkersPorRuta(idRuta) {
        $.each(markers, function (index, marker) {
            if (marker.idRuta == idRuta) {
                marker.setMap(map);
            }
        });
    }

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

    function createMarker(lat, longi, codigo, rumbo, velocidad, hora, placa, idEvento, idRuta) {
        var marker = new google.maps.Marker({
            position: {lat: lat, lng: longi},
            icon: imagenRumbo(rumbo, idEvento, true, idRuta, velocidad),
            label: {
              text: codigo,
              color: '#fff',
              fontSize: '11px',
              fontWeight: 'bold',
            },
            map: map,
            title: codigo,
            idRuta: idRuta
        });
        google.maps.event.addListener(marker, 'click', function () {
           
        })
        markers[codigo] = markers[codigo] || marker;
    }

    function createMarker2(lat, longi, codigo, rumbo, velocidad, hora, placa, idEvento, idRuta, abordo
                            , subidas, bajadas) {
        var lat2 = ConvertDMSToDD(lat);        
        var longi2 = ConvertDMSToDD(longi);
        var marker = new google.maps.Marker({
            position: {lat: lat2, lng: longi2},
            icon: imagenRumbo(rumbo, idEvento, true, "", velocidad),
            label: {
              text: codigo,
              color: '#fff',
              fontSize: '11px',
              fontWeight: 'bold',
            },
            map: map,
            title: codigo,
            idRuta: idRuta,
            codigo: codigo,
            abordo: abordo,
            subidas: subidas,
            bajadas: bajadas
        });
        google.maps.event.addListener(marker, 'click', function () {
            
        })
        markers[codigo] = markers[codigo] || marker;
    }

    function ConvertDMSToDD(dms) {
        if (!dms) { 
            return Number.NaN; 
        } 
        try {
            var neg = dms.match(/(^\s?-)|(\s?[SW]\s?$)/)!=null? -1.0 : 1.0; 
            dms = dms.replace(/(^\s?-)|(\s?[NSEW]\s?)$/,''); 
            var parts=dms.match(/(\d{1,3})[.,Â°d ]?\s*(\d{0,2}(?:\.\d+)?)[']?/); 
            if (parts==null) { 
                return Number.NaN; 
            } 
            var d= (parts[1]?         parts[1]  : '0.0')*1.0; 
            var m= (parts[2]?         parts[2]  : '0.0')*1.0; 
            var dec= (d + (m/60.0))*neg; 
            return dec; 
        } catch (ex){
            console.log(ex)
            return Number.NaN; 
        }
    } 

    function refreshMarker(marker, lat, longi, rumbo, velocidad, hora, placa, idEvento, idRuta) {
        marker.setPosition(new google.maps.LatLng(lat, longi), {
            easing: "linear",
            duration: 6000,
        });
        marker.setIcon(imagenRumbo(rumbo, idEvento, true, idRuta, velocidad));
    }

    var rad = function(x) {
        return x * Math.PI / 180;
    };

    function getDistance(p1, p2, p3, p4) {
        var R = 6378137;
        var dLat = rad(p3 - p1);
        var dLong = rad(p4 - p2);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(rad(p1)) * Math.cos(rad(p3)) *
        Math.sin(dLong / 2) * Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d;
    }

    function refreshMarker2(marker, lat, longi, rumbo, evento, codigo, ruta, velocidad, fueraRuta, abordo,
                            subidas, bajadas) {
        var latFormat = ConvertDMSToDD(lat);        
        var longFormat = ConvertDMSToDD(longi);
        var latAnterior = marker.getPosition().lat();
        var longAnterior = marker.getPosition().lng();

        marker.ruta = ruta;
        marker.abordo = abordo;
        marker.subidas = subidas;
        marker.bajadas = bajadas;

        if(getDistance(latAnterior, longAnterior, latFormat, longFormat)>1){
            marker.setIcon(imagenRumbo(Math.round(getRumbo(latAnterior, longAnterior, latFormat, longFormat)), evento, true, "", velocidad));
        }

        marker.setPosition(new google.maps.LatLng(latFormat, longFormat));
    }

    function buscarMarker(param) {
        var marker = markers[param]
        if (marker == null) {
            toastr.error("El vehiculo no se encuentra en el mapa");
            return false;
        }
        map.setCenter(marker.position);
        map.setZoom(16);
    }

    function anclarVehiculo(param) {
        $("#anclarVehiculo").css("transform", "rotate(30deg)");
        toastr.info("Vehiculo " + param + " anclado para seguimiento");
        intervaloAnclado =
                setInterval(
                        function () {
                            map.setCenter(markers[param].position);
                        }
                , 5000);
    }

    function desanclarVehiculo() {
        clearInterval(intervaloAnclado);
        $("#anclarVehiculo").css("transform", "rotate(0deg)");
    }

    function AjaxRecorrido(fecha, hora1, hora2, codigo) {
        $.ajax({
            url: "http://anubis.lmsoluciones.co/gema_lacarolina/index.php/c_trackingII/getListRecorridoII",
            type: "POST",
            dataType: "JSON",
            data: {fecha: fecha, hora1: hora1, hora2: hora2, codigo: codigo},
            success: function (response) {
                if (response.resultado) {
                    datosRecorrido = response.data;
                    recorrido();
                } else {
                    toastr.error("OcurriÃ³ un error: " + response.message);
                }
                return false;
            },
            error: function (xhr) {
                toastr.error("Error al cargar el recorrido");
                return false;
            }
        });
    }

    function AjaxDatosGrillaViajesRecorridos(codigo, fecha) {
        $.ajax({
            url: "http://anubis.lmsoluciones.co/gema_lacarolina/index.php/c_tracking/getListViajesVehiculoByFecha",
            type: "POST",
            dataType: "JSON",
            data: {codigo: codigo, fecha: fecha},
            success: function (response) {
                if (response.resultado) {
                    var datos = response.data;
                    llenarGrillaViajesRecorridos(datos);
                    toastr.info("Doble Click en la grilla para cargar el recorrido");
                } else {
                    toastr.error("OcurriÃ³ un error: " + response.message);
                }
                return false;
            },
            error: function (xhr) {
                toastr.error("Error al cargar los viajes");
                return false;
            }
        });
    }

    function llenarGrillaViajesRecorridos(datos) {
        var source =
                {
                    localdata: datos,
                    datafields:
                            [
                                {name: 'viaje', type: 'string'},
                                {name: 'salida', type: 'string'},
                                {name: 'llegada', type: 'string'},
                            ],
                    datatype: "array"
                };
        var dataAdapter = new $.jqx.dataAdapter(source);
        $("#gridViajesRecorridos").jqxDataTable(
                {
                    width: '100%',
                    height: '200px',
                    source: dataAdapter,
                    pageable: false,
                    theme: "metro",
                    filterable: true,
                    filterMode: "advanced",
                    selectionMode: 'singleRow',
                    sortable: true,
                    columns: [
                        {text: 'Viaje', datafield: 'viaje', width: 100},
                        {text: 'Salida', datafield: 'salida', minwidth: 150},
                        {text: 'Llegada', datafield: 'llegada', minwidth: 150},
                    ]
                });
        $('#gridViajesRecorridos').jqxGrid('render');
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
            limpiarMarkersPasajeros();
            limpiarMarkersVelocidades();
        }
        desanclarVehiculo();
        map.setZoom(zoom);
        $("#inpVehiculo").val("");
    });

    var indexPos = 0;
    function recorrido() {
        if (datosRecorrido.length == 0) {
            toastr.error("No hay datos para mostrar");
            limpiarRecorrido();
            return false;
        } else {
            if (markerRecorrido != null) {
                limpiarRecorrido();
            }
            $.each(datosRecorrido, function (index, dato) {
                poliRecorrido.push({lat: parseFloat(datosRecorrido[index].latitud), lng: parseFloat(datosRecorrido[index].longitud)})
            });

            polilineaRecorrido = new google.maps.Polyline({
                path: poliRecorrido,
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2
            });
            polilineaRecorrido.setMap(map);

            markerRecorrido = new MarkerWithLabel({
                position: {lat: parseFloat(datosRecorrido[0].latitud), lng: parseFloat(datosRecorrido[0].longitud)},
                draggable: false,
                map: map,
                labelContent: datosRecorrido[0].codigo,
                labelAnchor: new google.maps.Point(22, 0),
                labelClass: "labelMarker",
                icon: '../../assets/images/map-markerBlue.png',
                title: datosRecorrido[0].codigo
            });
            ocultarMarkers();
            desanclarVehiculo();
            $("#modalRecorrido").modal("hide");
            console.log("INICIO DE RECORRIDO");
            indexPos = 0;
            runRecorrido();
        }
    }

    function runRecorrido() {
        $("#btnPause").html("<i class='fa fa-pause'></i>");
        recorriendo = true;
        intervaloRecorrido =
                setInterval(
                        function () {
                            moverMarkerRecorrido();
                            if (indexPos == datosRecorrido.length - 1) {
                                console.log("FIN DE RECORRIDO")
                                clearInterval(intervaloRecorrido);
                            }
                            indexPos += 1;
                        }
                , 3000);
    }

    function moverMarkerRecorrido() {
        markerRecorrido.animateTo(new google.maps.LatLng(parseFloat(datosRecorrido[indexPos].latitud), parseFloat(datosRecorrido[indexPos].longitud)), {
            easing: "linear",
            duration: 1000,
        });
        map.setCenter(new google.maps.LatLng(parseFloat(datosRecorrido[indexPos].latitud), parseFloat(datosRecorrido[indexPos].longitud)));
    }

    $("#btnPause").click(function () {
        if (recorriendo) {
            recorriendo = false;
            clearInterval(intervaloRecorrido);
            $("#btnPause").html("<i class='fa fa-play'></i>");
        } else {
            runRecorrido();
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

    $("#inpVehiculo").keypress(function (e) {
        if (e.which == 13) {
            buscarMarker(this.value);
        }
    });

    $("#inpCheckStyle").click(function () {
        if ($("#inpCheckStyle").prop("checked")) {
            $(".inpsHorasRecorridos").removeAttr("disabled");
            $("#inpCargarRecorrido").val("Cargar Recorrido");
            $("#rowGrillaViajesRecorrido").removeClass("displayBlock");
            $("#rowGrillaViajesRecorrido").addClass("displayNone");
        } else {
            $(".inpsHorasRecorridos").attr("disabled", "disabled");
            $("#inpCargarRecorrido").val("Ver Viajes");
            $("#rowGrillaViajesRecorrido").removeClass("displayNone");
            $("#rowGrillaViajesRecorrido").addClass("displayBlock");
        }
    });

    $("#inpCargarRecorrido").click(function () {
        if ($("#inpVehiculoRecorrido").val() == "") {
            toastr.error("Debe digitar un vehiculo");
            return false;
        }
        if ($("#inpFechaRecorrido").val() == "") {
            toastr.error("Debe digitar una fecha");
            return false;
        }
        if ($("#inpCheckStyle").prop("checked")) {
            if ($("#inpHoraInicialRecorrido").val() == "" || $("#inpHoraFinalRecorrido").val() == "") {
                toastr.error("Debe digitar una hora");
                return false;
            }
            AjaxRecorrido($("#inpFechaRecorrido").val(), $("#inpHoraInicialRecorrido").val(), $("#inpHoraFinalRecorrido").val(), $("#inpVehiculoRecorrido").val());
        } else {
            AjaxDatosGrillaViajesRecorridos($("#inpVehiculoRecorrido").val(), $("#inpFechaRecorrido").val());
        }
    });

    $('#gridViajesRecorridos').on('rowDoubleClick', function (event) {
        var row = args.row;
        console.log(row);
        AjaxRecorrido($("#inpFechaRecorrido").val(), row.salida, row.llegada, $("#inpVehiculoRecorrido").val());
    });

    $("#anclarVehiculo").click(function () {
        if ($("#inpVehiculo").val() == "") {
            toastr.error("Debe buscar un vehiculo");
            return false;
        }
        anclarVehiculo($("#inpVehiculo").val());
    });

    cargarRutas();

    function getRumbo(lat1, lon1, lat2, lon2){
        var dLon = ToRad(lon2 - lon1);
        var dPhi = Math.log(Math.tan(ToRad(lat2) / 2 + Math.PI / 4) / Math.tan(ToRad(lat1) / 2 + Math.PI / 4));
        if (Math.abs(dLon) > Math.PI){
            if (dLon > 0) {
                dLon=2 * Math.PI - dLon;
            }else{
                dLon=2 * Math.PI + dLon;
            }
        }
        return ToBearing(Math.atan2(dLon, dPhi));
    }

    function ToBearing(radians){
        return (ToDegrees(radians) + 360) % 360;
    }

    function ToDegrees(radians){
        return radians * 180 / Math.PI;
    }

    function ToRad(degrees){
        return degrees * (Math.PI / 180);
    }

    try{
        var socket2;
        var host2 = "ws://192.190.43.26:9001/ultimasPosiciones/"+"123"+"/"+"P"+"/"+"123";
        var socket2 = new WebSocket(host2);
        pendienteLoad2 = false;
        socket2.onmessage = function(msg){
            if (pendienteLoad2 == false) {
                $.each(JSON.parse(msg.data), function (i, item) {
                    if(misVehiculo.indexOf(parseInt(item.codigo)) != -1){
                        createMarker2(item.Latitude, item.longitude, item.codigo, "", item.VelocidadKPH, item.FechaHora, 
                        item.placa, item.IDEvento, item.idRuta, parseInt(item.ABORDO), parseInt(item.SUBIDAS), 
                        parseInt(item.BAJADAS));    
                    }
                });
                pendienteLoad2 = true;
            }else{
                $.each(JSON.parse(msg.data), function (i, item) {
                    if(misVehiculo.indexOf(parseInt(item.codigo)) != -1){
                        refreshMarker2(markers[item.codigo], item.Latitude, item.longitude, "", item.IDEvento, item.codigo, 
                        item.idRuta, parseInt(item.VelocidadKPH), true, parseInt(item.ABORDO), parseInt(item.SUBIDAS), 
                        parseInt(item.BAJADAS));
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
