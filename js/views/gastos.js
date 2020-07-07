$(function() {

    const dataUser = JSON.parse(localStorage.getItem('userData'));



    $('#inpFecha').val(dateNow());

    // ---------------------------

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
                $("#inpVehiculo").append("<option value="+value.codigo+">"+value.codigo+"</option>");
            });
            AjaxGetGastos();
            return false;
        },
        error: function (res){
            swal.error(res.responseJSON.message);
            return false;
        }
    });

    function AjaxGetGastos() {
      $.ajax({
          url: urlAPI + "/gastos/getDescuentosDiarios",
          type: "POST",
          dataType: 'JSON',
          contentType: 'application/json',
          data: JSON.stringify({fecha: $("#inpFecha").val(), vehiculo: $("#inpVehiculo").val(), idPropietario: dataUser.idPropietario}),
          beforeSend: function (xhr){ 
              xhr.setRequestHeader('Authorization', localStorage.getItem('token')); 
              $("#btnCargar").prop("disabled", true);
          },
          success: function (res){
              var rtn = [];
              $.each(res.data, function(key, value) {
                  rtn.push({val:[{
                    fecha: value.fecha, nombre: value.nombre, codigo: value.codigo, valor: value.valor 
                  }]});
              });
              cargarData(rtn);
              return false;
          },
          error: function (res){
              swal.error(res.responseJSON.message);
              return false;
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
                  text: 'Gastos', align: 'left', dataField: 'model',
                  cellsRenderer: function (row, column, value, rowData) {
                      var punto = rowData.val;
                      var container = "<div>";
                      for (var i = 0; i < punto.length; i++) {
                          var punto = punto[i];
                          var item = "<div style='width: 100%; overflow: hidden; white-space: nowrap;'>";
                          var info = "<div style='background: #e9ecef; margin: 5px; margin-left: 10px; margin-bottom: 3px; padding: 10px 15px; border-radius: 10pt; font-size: 15px'>";
                          info += "<div class='row'><div class='col-6' style='margin-bottom: 5px;'>Fecha: "+punto.fecha+"</div><div class='col-6' style='margin-bottom: 5px;'>Vehiculo: "+punto.codigo+"</div><div class='col-6 textCenter fontBold'>"+punto.nombre+"</div><div class='col-6' style='background: white; color: #039be5; font-weight: bold; border-radius: 7pt 0pt 0pt 7pt;'>Valor: <b>"+punto.valor+"</b></div></div>";
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
        AjaxGetGastos();
    });


});
