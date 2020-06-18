$(function() {

/*
    plugin.google.maps.environment.setEnv({
      'API_KEY_FOR_BROWSER_RELEASE': 'AIzaSyBvrBF3dUzhRUxM4C3Zh_OMAms0-gigDOU',
      'API_KEY_FOR_BROWSER_DEBUG': 'AIzaSyBvrBF3dUzhRUxM4C3Zh_OMAms0-gigDOU'
    });
*/
    document.addEventListener('deviceready', function() {

      var div = document.getElementById("googleMap");
      var map = plugin.google.maps.Map.getMap(div);

      // Move to the position with animation
      map.animateCamera({
        target: {lat: 37.422359, lng: -122.084344},
        zoom: 17,
        tilt: 60,
        bearing: 140,
        duration: 5000
      });

      // Add a maker
      var marker = map.addMarker({
        position: {lat: 37.422359, lng: -122.084344},
        title: "Welecome to \n" +
               "Cordova GoogleMaps plugin for iOS and Android",
        snippet: "This plugin is awesome!",
        animation: plugin.google.maps.Animation.BOUNCE
      });

      // Show the info window
      marker.showInfoWindow();

    }, false);

/*
    var markers = {};

    var latMapa = "11.0073953";
    var lonMapa = "-74.8286633";
    var zoom = 13;
    var mapProp = {center: new google.maps.LatLng(latMapa, lonMapa), zoom: zoom, mapTypeId: google.maps.MapTypeId.ROADMAP};
    map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
    var infowindow = new google.maps.InfoWindow({
        content: ''
    });
*/







    $("#inpFechaConsolidado").val(dateNow());
    $("#inpFechaDetalle").val(dateNow());

    function loadDatosVehiculos() {
        $.ajax({
            url: "jsnlistPosiciones",
            type: "POST",
            contentType: "application/json ; charset=UTF-8",
            dataType: "JSON",
            success: function (response) {
                $.each(response, function (i, item) {
                      createMarker(parseFloat(item.lati), parseFloat(item.longi), parseFloat(item.velocidad), item.codigo);
                  });
                refreshVehiculos();
                return false;
            },
            error: function (xhr) {
                return false;
            }
        });
    }

    function refreshVehiculos() {
      $.ajax({
            url: "jsnlistPosiciones",
            type: "POST",
            contentType: "application/json ; charset=UTF-8",
            dataType: "JSON",
            success: function (response) {
    	        $.each(response, function (i, item) {
    	         	RefreshMarker(markers[item.codigo], parseFloat(item.lati), parseFloat(item.longi), parseFloat(item.velocidad), item.codigo);
    	    	});

    			window.setTimeout(refreshVehiculos, 3000);
    			return false;
    		},
    		error: function (xhr) {
    		    return false;
    		}
    	});
    }
    	
    function getDataVehiculo(codigo) {
      $.ajax({
            url: "jsnGetDataVehiculoMapa",
            type: "POST",
            dataType: "JSON",
            data: {codigo: codigo},
            success: function (response) {
    	        $(".inpDatosVehiculo").val("N/A");
    	        $("#spanVehiculo").text("");
    	        $("#inpVehiculoHidden").val(codigo);
    	        let data = response[0];
    	        
    	        $("#spanVehiculo").text(codigo);
    	        $("#inpConductor").val((data["Conductor"]==null)?"N/A":data["Conductor"]);
    	        $("#inpTurno").val(data["TurnoProgramado"]);
    	        $("#inpVelocidad").val(data["Velocidad"]);
    	        $("#inpUltimoDato").val(data["ultimaFecha"]);
    	        $("#inpHoraDespacho").val(data["HoraDespacho"]);
    	        $("#inpEstado").val(data["Estado"]);

    	        $.get("https://maps.googleapis.com/maps/api/geocode/json?latlng="+data["lati"]+","+data["longi"]+"&key=AIzaSyBvrBF3dUzhRUxM4C3Zh_OMAms0-gigDOU",{},  function (geoData){   
                      $("#inpDireccion").val(geoData.results[0].formatted_address);
              });

    			return false;
    		},
    		error: function (xhr) {
    		    return false;
    		}
    	});
    }

    function AjaxDatosGrillaConsolidado(codigo) {
    	$("#lblTotTimConsolidado").text("Timbs: -");
    	$("#lblTotBloqConsolidado").text("Bloqs: -");
          $.ajax({
              url: "jsnGetConsolidadoMovilidadMapa",
              type: "POST",
              dataType: "JSON",
              data: {codigo: codigo, fecha: $("#inpFechaConsolidado").val()},
              success: function (response) {
                  var rtn = [];
                  let timbs = 0;
                  let bloqs = 0;
                  $.each(response, function(key, value) {
                  	timbs += value.pasajeros_automatico;
                  	bloqs += value.BLOQUEOS;
                      rtn.push({val:[{fecha: value.FECHA_HORA_FINAL, tim: value.pasajeros_automatico, bloqueos: value.BLOQUEOS}]});
                  });
                  $("#lblTotTimConsolidado").text("Timbs: " + timbs);
    			        $("#lblTotBloqConsolidado").text("Bloqs: " + bloqs);
                  crearGrillaConsolidado(rtn);
                  return false;
              },
              error: function (xhr) {
                  return false;
              }
          });
    }  

    function AjaxDatosGrillaDetalle(codigo) {
    	$("#lblTotSubDetalle").text("Sub.: -");
    	$("#lblTotBajDetalle").text("Baj.: -");
    	$("#lblTotBloqDetalle").text("Bloqs: -");
        $.ajax({
            url: "jsnGetDetalleMovilidadMapa",
            type: "POST",
            dataType: "JSON",
            data: {codigo: codigo, fecha: $("#inpFechaDetalle").val()},
            success: function (response) {
                var rtn = [];
                let subs = 0;
                let bajs = 0;
                let bloqs = 0;
                $.each(response, function(key, value) {
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
            error: function (xhr) {
                return false;
            }
        });
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
                              var item = '<div style="width: 100%; overflow: hidden; white-space: nowrap;">';
                              var info = "<div style='background: #E9ECEF; margin: 5px; margin-left: 10px; margin-bottom: 3px; padding: 10px 15px; border-radius: 10pt; font-style: italic; font-size: 15px'>";
                              info += "<div class='row'><div class='col-12 col-sm-6'>Fecha: "+punto.fecha+"</div><div class='col-6 col-sm-3'>Timbs: "+punto.tim+"</div><div class='col-6 col-sm-3' style='background: white; color: #039be5; font-weight: bold; border-radius: 7pt 0pt 0pt 7pt;'>Bloqs: "+punto.bloqueos+"</div></div>";
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
                            var info = "<div style='background: #E9ECEF; margin: 5px; margin-left: 10px; margin-bottom: 3px; padding: 10px 15px; border-radius: 10pt; font-style: italic; font-size: 15px'>";
                            info += "<div class='row'><div class='col-12 textCenter' style='background: white; color: #039be5; font-weight: bold;'>"+punto.fecha+"</div><div class='col-4 textCenter'>Subs.: "+punto.subs+"</div><div class='col-4 textCenter'>Bajs.: "+punto.bajas+"</div><div class='col-4 textCenter'>Bloqs: "+punto.bloqueos+"</div></div>";
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

    function createMarker(lat, longi, velocidad, codigo) {
        var marker = new MarkerWithLabel({
            position: {lat: lat, lng: longi},
            draggable: false,
            map: map,
            labelContent: codigo,
            labelAnchor: new google.maps.Point(22, 0),
            labelClass: "labels",
            icon: imagenRumbo(1, 2, true, 1, velocidad),
            labelStyle: {opacity: 0.95},
            title: codigo
        });
        google.maps.event.addListener(marker, 'click', function () {
        	getDataVehiculo(codigo);
        	AjaxDatosGrillaConsolidado(codigo);
        	AjaxDatosGrillaDetalle(codigo);
            $("#modalDetalle").modal();
        })
        markers[codigo] = markers[codigo] || marker;
    }

    function RefreshMarker(marker, lat, longi, velocidad, codigo) {
       marker.setPosition(new google.maps.LatLng(lat, longi));
       marker.setIcon(imagenRumbo(1, 2, true, 1, velocidad));
    }

    function Buscar(codigo) {
        marker = markers[codigo];
        if (marker == null) {
        	toast({
          type: 'error',
          title: 'No se encontro el vehiculo'
        });
            return;
        }
        map.setCenter(marker.position);
        map.setZoom(16);
    }

    $("#btnBusqueda").click(function () {
        Buscar($("#inpVehiculo").val());
    });

    $("#btnCargarConsolidado").click(function () {
        AjaxDatosGrillaConsolidado($("#inpVehiculoHidden").val());
    });

    $("#btnCargarDetalle").click(function () {
        AjaxDatosGrillaDetalle($("#inpVehiculoHidden").val());
    });









    //loadDatosVehiculos();
});