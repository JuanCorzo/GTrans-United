$(function() {

    const dataUser = JSON.parse(localStorage.getItem('userData'));



    $('#inpFecha').val(dateNow());

    // ---------------------------

    $.ajax({
        url: urlAPI + "/vehiculos/getVehiculos",
        type: "POST",
        dataType: 'JSON',
        contentType: 'application/json',
        data: JSON.stringify({cedula: dataUser.identificacion, isUnited: 1}),
        beforeSend: function (xhr){ 
            xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
        },
        success: function (res){
            $.each(res.data, function(key, value) {
                $("#inpVehiculo").append("<option value="+value.codigo+"-"+value.empresa+">"+value.codigo+" ("+value.empresaCorto+")</option>");
            });
            AjaxGetViajes();
            return false;
        },
        error: function (res){
            swal.error(res.responseJSON.message);
            return false;
        }
    });

    function AjaxGetViajes() {
      $.ajax({
          url: urlAPI + "/viajes/getViajesRecaudados",
          type: "POST",
          dataType: 'JSON',
          contentType: 'application/json',
          data: JSON.stringify({fecha: $("#inpFecha").val(), tipo: $("input[name='inpCheckDia']:checked").val(), vehiculo: $("#inpVehiculo").val(), cedula: dataUser.identificacion, empresas: JSON.stringify(dataUser.empresas)}),
          beforeSend: function (xhr){ 
              xhr.setRequestHeader('Authorization', localStorage.getItem('token')); 
              $("#btnCargar").prop("disabled", true);
          },
          success: function (res){
              var rtn = [];
              $.each(res.data, function(key, value) {
                  rtn.push({val:[{
                  fecha: value.dfechadia, recaudo: value.rfecharecaudo, codigo: value.Codigo, 
                  factura: value.factura, bruto: value.Bruto, timbradas: value.Timbradas, viajes: value.Viaje, extemporaneo: value.extemporaneo
                  }]});
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
                  text: 'Ventas', align: 'left', dataField: 'model',
                  cellsRenderer: function (row, column, value, rowData) {
                      var punto = rowData.val;
                      var container = "<div>";
                      for (var i = 0; i < punto.length; i++) {
                          var punto = punto[i];
                          var item = "<div style='width: 100%; overflow: hidden; white-space: nowrap;'>";
                          var info = "<div style='background: "+((punto.extemporaneo==1)?("#fffda1"):("#e9ecef"))+"; margin: 5px; margin-left: 10px; margin-bottom: 3px; padding: 10px 15px; border-radius: 10pt; font-size: 15px'>";
                          info += "<div class='row'><div class='col-12 textCenter' style='background: white; color: #039be5; font-weight: bold; margin-bottom: 5px'>Recaudo: "+punto.recaudo+"</div><div class='col-6'>Fecha: "+punto.fecha+"</div><div class='col-6'>Vehiculo: "+punto.codigo+"</div><div class='col-6'>Viaje: "+punto.viajes+"</div><div class='col-6' >Bruto: <b>"+punto.bruto+"</b></div><div class='col-6' >Tims: "+punto.timbradas+"</div><div class='col-6'>Factura: "+punto.factura+"</div></div>";
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
        AjaxGetViajes();
    });


});
