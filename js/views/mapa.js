$(function () {

    const dataUser = JSON.parse(localStorage.getItem('userDataGTU'));

    
    var LatandLong = {lat: 10.9832981, lng: -74.8017122};
    var zoom = 13;
    var map;
    var markers = {};
    var pendienteLoad = false;
    var datosRecorrido;
    var markerRecorrido;
    var poliRecorrido = [];
    var intervaloRecorrido;
    var intervaloAnclado;
    var polilineaRecorrido;
    var recorriendo = false;

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
        url: urlAPI + "/vehiculos/getVehiculos",
        type: "POST",
        dataType: 'JSON',
        contentType: 'application/json',
        data: JSON.stringify({cedula: dataUser.identificacion, isUnited: 1}),
        beforeSend: function (xhr){ 
            xhr.setRequestHeader('Authorization', localStorage.getItem('tokenGTU'));
        },
        success: function (res){
            $.each(res.data, function(key, value) {
                $("#inpVehiculoRecorrido").append("<option value="+value.codigo+"-"+value.idEmpresa+">"+value.codigo+" ("+value.empresaCorto+")</option>");
            });
            return false;
        },
        error: function (res){
            swal.error(res.responseJSON.message);
            return false;
        }
    });

    function getDataVehiculo(vehiculo) {
        $.ajax({
            url: urlAPI + "/viajes/getDatosUltimoViaje",
            type: "POST",
            dataType: 'JSON',
            contentType: 'application/json',
            data: JSON.stringify({vehiculo: vehiculo}),
            beforeSend: function (xhr){ 
                xhr.setRequestHeader('Authorization', localStorage.getItem('tokenGTU'));
            },
            success: function (response) {
                $(".inpDatosVehiculo").val("N/A");
                $("#spanVehiculo").text("");
                $("#inpVehiculoHidden").val(vehiculo);
                let data = response.data[0];
                
                $("#spanVehiculo").text("(" + data["Codigo"] + ")");
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

    function getDataVehiculoTracking(vehiculo) {
        $.ajax({
            url: urlAPI + "/tracking/getUltimaPosicion",
            type: "POST",
            dataType: 'JSON',
            contentType: 'application/json',
            data: JSON.stringify({vehiculo: vehiculo}),
            beforeSend: function (xhr){ 
                xhr.setRequestHeader('Authorization', localStorage.getItem('tokenGTU'));
            },
            success: function (response) {
                $(".inpDatosVehiculoTracking").val("N/A");
                let data = response.data[0];

                $("#inpVelocidad").val(data["VelocidadKPH"]);
                $("#inpUltimoDato").val(data["FechaHora"]);
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

    function AjaxDatosGrillaDetalle(vehiculo) {
        $.ajax({
            url: urlAPI + "/tracking/getDetalleMovilidad",
            type: "POST",
            dataType: 'JSON',
            contentType: 'application/json',
            data: JSON.stringify({fecha: $("#inpFechaDetalle").val(), vehiculo: vehiculo}),
            beforeSend: function (xhr){ 
                xhr.setRequestHeader('Authorization', localStorage.getItem('tokenGTU')); 
                $("#btnCargarDetalle").prop("disabled", true);
            },
            success: function (response) {
                var rtn = [];
                $.each(response.data, function(key, value) {
                    rtn.push({val:[{fecha: value.FechaHora, descripcion: value.Descripcion, 
                                    punto: value.PuntoVirtual, registradora: value.Registradora}]});
                });
                crearGrillaDetalle(rtn);
            },
            error: function (res) {
                swal.error(res.responseJSON.message);
            },
            complete: function (res){
                $("#btnCargarDetalle").prop("disabled", false);
            }
        });
    } 

    function AjaxRecorrido(fecha, hora1, hora2, vehiculo) {
        $.ajax({
            url: urlAPI + "/tracking/getRecorrido",
            type: "POST",
            dataType: 'JSON',
            contentType: 'application/json',
            data: JSON.stringify({fecha: fecha, hora1: hora1, hora2: hora2, vehiculo: vehiculo}),
            beforeSend: function (xhr){ 
                xhr.setRequestHeader('Authorization', localStorage.getItem('tokenGTU')); 
                $("#btnCargarRecorrido").prop("disabled", true);
            },
            success: function (response) {
                datosRecorrido = response.data;
                recorrido();
            },
            error: function (res) {
                swal.error(res.responseJSON.message);
            },
            complete: function (res){
                $("#btnCargarRecorrido").prop("disabled", false);
            }
        });
    }

    function limpiarMarkers() {
        $.each(markers, function (index, i) {
            markers[index].setMap(null);
        });
        markers = {};
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

     function mostrarIconsRecorridos(){
        $("#btnsFlotantesRecorridos").removeClass("displayNone");
        $("#btnsFlotantesRecorridos").addClass("displayBlock");   
    }

    function ocultarIconsRecorridos(){
        $("#btnsFlotantesRecorridos").removeClass("displayBlock");
        $("#btnsFlotantesRecorridos").addClass("displayNone");   
    }

    function createMarker(lat, longi, codigo, empresa, rumbo, velocidad, idEvento) {
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
            empresa: empresa
        });
        google.maps.event.addListener(marker, 'click', function () {
            getDataVehiculo(codigo+"-"+empresa);
            getDataVehiculoTracking(codigo+"-"+empresa);
            AjaxDatosGrillaDetalle(codigo+"-"+empresa);
            $("#modalDetalle").modal();
        })
        markers[codigo] = markers[codigo] || marker;
    }

    function refreshMarker(marker, lat, longi, rumbo, velocidad, idEvento) {
        marker.setPosition(new google.maps.LatLng(lat, longi), {
            easing: "linear",
            duration: 6000,
        });
        marker.setIcon(imagenRumbo(rumbo, idEvento, velocidad));  
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
                              var info = "<div style='background: "+((punto.descripcion=="RG")?("#fffda1"):("#e9ecef"))+"; margin: 5px; margin-left: 10px; margin-bottom: 3px; padding: 10px 15px; border-radius: 10pt; font-size: 15px'>";
                              info += "<div class='row'><div class='col-12 textCenter' style='background: white; color: #039be5; font-weight: bold; margin-bottom: 5px'>"+punto.fecha+"</div><div class='col-7 textCenter'>"+((punto.punto=="N/A")?"PASAJERO":punto.punto)+"</div><div class='col-5 textCenter'>Reg.: "+punto.registradora+"</div></div>";
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
            if (markerRecorrido != null) {
                limpiarRecorrido();
            }
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
                strokeColor: '#343a40',
                strokeOpacity: 1.0,
                strokeWeight: 3
            });
            polilineaRecorrido.setMap(map);

            markerRecorrido = new google.maps.Marker({
                position: {lat: parseFloat(datosRecorrido[0].latitud), lng: parseFloat(datosRecorrido[0].longitud)},
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
        markerRecorrido.setPosition(new google.maps.LatLng(parseFloat(datosRecorrido[indexPos].latitud), parseFloat(datosRecorrido[indexPos].longitud)));
        map.setCenter(new google.maps.LatLng(parseFloat(datosRecorrido[indexPos].latitud), parseFloat(datosRecorrido[indexPos].longitud)));
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

    $("#btnCargarDetalle").click(function () {
        AjaxDatosGrillaDetalle($("#inpVehiculoHidden").val());
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

    try{
        var socket;
        var host = urlSocketOpto + "/ultimasPosiciones/"+"123"+"/"+"P"+"/"+dataUser.identificacion;
        var socket = new WebSocket(host);
        pendienteLoad = false;
        socket.onmessage = function(msg){
            if (pendienteLoad == false) {
                $.each(JSON.parse(msg.data), function (i, item) {  
                    if((dataUser.empresas.findIndex((element) => element.empresa == item.empresa)) == -1) return false;
                    createMarker(item.Latitude, item.longitude, item.codigo, item.empresa, item.Rumbo, item.VelocidadKPH, item.IDEvento);
                });
                pendienteLoad = true;
            }else{
                $.each(JSON.parse(msg.data), function (i, item) {
                    if((dataUser.empresas.findIndex((element) => element.empresa == item.empresa)) == -1) return false;
                    refreshMarker(markers[item.codigo], item.Latitude, item.longitude, item.Rumbo, item.VelocidadKPH, item.IDEvento);
                });
            }
        }

    }catch(exception){
        console.log('<p>Error'+exception);
    }


});
