$(function() {

    var map;
    var LatandLong = {lat: parseFloat(10.9738178), lng: parseFloat(-74.7939255)};

    map = new google.maps.Map(document.getElementById('googleMap'), {
        zoom: 14,
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

    $('#inpFecha').val(dateNow());

    let dataUser = JSON.parse(localStorage.getItem('userData'));

    $.ajax({
        url: "http://192.190.42.212:3000/vehiculos/getVehiculos/"+dataUser.idPropietario,
        type: "GET",
        dataType: 'JSON',
        contentType: 'application/json',
        beforeSend: function (xhr){ 
            xhr.setRequestHeader('Authorization', localStorage.getItem('token')); 
        },
        success: function (res){
             $.each(res.data, function(key, value) {
                 $("#inpVehiculo").append("<option value="+value.codigo+">"+value.codigo+"</option>");
              });
        },
        error: function (res){
            console.log(res.responseJSON)
        }
    });


  function getVelocidades(fecha, vehiculo, limit) {
      $.ajax({
          url: "http://192.190.42.212:3000/tracking/getVelocidadesOpto/"+fecha+"/"+vehiculo+"/"+limit,
          type: "GET",
          dataType: 'JSON',
          contentType: 'application/json',
          beforeSend: function (xhr){ 
            xhr.setRequestHeader('Authorization', localStorage.getItem('token')); 
          },
          success: function (res){

              var rtn = [];
              $.each(res.data, function(key, value) {
                  rtn.push({val:[{
                  fecha: value.fechaFormat, latitud: (String(value.latitud).substr(0,10)), longitud: (String(value.longitud).substr(0,10)), 
                  velocidad: value.velocidad
                  }]});
              });

              cargarData(rtn)

              return false;
          },
          error: function (res){
              console.log(res);
              return false;
          }
      });
    }


   function cargarData(datos){
        console.log(datos)
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
                          console.log(punto);

                          var container = "<div>";
                          for (var i = 0; i < punto.length; i++) {
                              var punto = punto[i];
                              var item = "<div style='width: 100%; overflow: hidden; white-space: nowrap;'>";
                              var info = "<div style='background: #e9ecef; margin: 5px; margin-left: 10px; margin-bottom: 3px; padding: 10px 15px; border-radius: 10pt; font-style: italic; font-size: 15px'>";
                              info +=  "<div class='row'><div class='col-12 col-sm-4'>Fecha: "+punto.fecha+"</div><div class='col-6 col-sm-4'>Lat "+punto.latitud+"</div><div class='col-6 col-sm-4'>Long "+punto.longitud+"</div><div class='col-6 col-sm-4'>Velocidad: "+punto.velocidad+"</div></div>";
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
        getVelocidades($("#inpFecha").val(), $("#inpVehiculo").val() ,$("#inpVelocidad").val())
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
