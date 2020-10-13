$(function() {

    const dataUser = JSON.parse(localStorage.getItem('userDataGTU'));


    var LatandLong = {lat: 10.9832981, lng: -74.8017122};
    var zoom = 14;
    var map;

    $('#inpFecha').val(dateNow());

    // ---------------------------

    map = new google.maps.Map(document.getElementById('googleMap'), {
        zoom: zoom,
        center: LatandLong,
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false
    });

    var marker = new google.maps.Marker({
        draggable: false,
        map: null,
        labelStyle: {opacity: 0.95}
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
                $("#inpVehiculo").append("<option value="+value.codigo+"-"+value.empresa+">"+value.codigo+" ("+value.empresaCorto+")</option>");
            });
            AjaxGetVelocidades();
            return false;
        },
        error: function (res){
            swal.error(res.responseJSON.message);
            return false;
        }
    });

    function AjaxGetVelocidades() {
      $.ajax({
          url: urlAPI + "/tracking/getVelocidades",
          type: "POST",
          dataType: 'JSON',
          contentType: 'application/json',
          data: JSON.stringify({fecha: $("#inpFecha").val(), vehiculo: $("#inpVehiculo").val(), limit: $("#inpVelocidad").val()}),
          beforeSend: function (xhr){ 
              xhr.setRequestHeader('Authorization', localStorage.getItem('tokenGTU')); 
              $("#btnCargar").prop("disabled", true);
          },
          success: function (res){
              var rtn = [];
              $.each(res.data, function(key, value) {
                  rtn.push({val:[{fecha: value.fechaFormat, latitud: (String(value.latitud).substr(0,10)), longitud: (String(value.longitud).substr(0,10)), velocidad: value.velocidad}]});
              });
              cargarData(rtn);
          },
          error: function (res){
              swal.error(res.responseJSON.message);
          },
          complete: function (res){
              $("#btnCargar").prop("disabled", false);
          }
      });
    }

    function cargarData(datos){
        var source = {
            localData: datos,
            dataType: "array"
        };
        dataAdapter = new $.jqx.dataAdapter(source); 
        $("#gridDatos").jqxDataTable({
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
                    text: 'Velocidades', align: 'left', dataField: 'model',
                    cellsRenderer: function (row, column, value, rowData) {
                        var punto = rowData.val;
                        var container = "<div>";
                        for (var i = 0; i < punto.length; i++) {
                            var punto = punto[i];
                            var item = "<div style='width: 100%; overflow: hidden; white-space: nowrap;'>";
                            var info = "<div style='background: #e9ecef; margin: 5px; margin-left: 10px; margin-bottom: 3px; padding: 10px 15px; border-radius: 10pt; font-size: 15px'>";
                            info +=  "<div class='row'><div class='col-12 textCenter' style='background: white; color: #039be5; font-weight: bold; margin-bottom: 5px'>Fecha: "+punto.fecha+"</div><div class='col-12 textCenter'>Velocidad: "+punto.velocidad+" Km/H</div></div>";
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

    $("#btnCargar").click(function(){
        if($("#inpVehiculo").val() == ""){
            swal.error("Debe escojer un vehiculo");
            return false;
        }
        AjaxGetVelocidades();
    });

    $('#gridDatos').on('rowDoubleClick', function (event) { 
        var args = event.args;
        var data = args.row.val[0];
        LatandLong = {lat: parseFloat(data.latitud), lng: parseFloat(data.longitud)};
        marker.setMap(null);
        marker.setMap(map);
        marker.setPosition(LatandLong);
        map.setCenter(LatandLong); 
        $.get("https://maps.googleapis.com/maps/api/geocode/json?latlng="+data.latitud+","+data.longitud+"&key=AIzaSyBvrBF3dUzhRUxM4C3Zh_OMAms0-gigDOU",{},  function (geoData){   
            $("#lblDireccion").text(geoData.results[0].formatted_address);
        });
        $("#modalUbicar").modal();
    });




});
