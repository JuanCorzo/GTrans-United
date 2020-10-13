$(function() {

    const dataUser = JSON.parse(localStorage.getItem('userDataGTU'));


    Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
    Chart.defaults.global.defaultFontColor = '#292b2c';


    $('#inpFecha').val(dateNow());

    // ---------------------------

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
            AjaxGetViajes();
            return false;
        },
        error: function (res){
            swal.error(res.responseJSON.message);
            return false;
        }
    });

    function AjaxGraficaPie() {
        $.ajax({
            url: urlAPI + "/viajes/getGraficaPiePerdidos",
            type: "POST",
            dataType: 'JSON',
            contentType: 'application/json',
            data: JSON.stringify({cedula: dataUser.identificacion, empresas: JSON.stringify(dataUser.empresas)}),
            beforeSend: function (xhr){ 
                xhr.setRequestHeader('Authorization', localStorage.getItem('tokenGTU')); 
            },
            success: function (res){
                var rtn = {name: [], data: []};
                $.each(res.data, function(key, value) {
                    rtn.name.push(value.Novedad);
                    rtn.data.push(value.total);
                });
                cargarGraficaPie(rtn);
                return false;
            },
            error: function (res){
                swal.error(res.responseJSON.message);
                return false;
            }
        });
    }
    
    function AjaxGetViajes() {
      $.ajax({
          url: urlAPI + "/viajes/getViajesPerdidos",
          type: "POST",
          dataType: 'JSON',
          contentType: 'application/json',
          data: JSON.stringify({fecha: $("#inpFecha").val(), vehiculo: $("#inpVehiculo").val(), cedula: dataUser.identificacion, empresas: JSON.stringify(dataUser.empresas)}),
          beforeSend: function (xhr){ 
              xhr.setRequestHeader('Authorization', localStorage.getItem('tokenGTU')); 
              $("#btnCargar").prop("disabled", true);
          },
          success: function (res){
              var rtn = [];
              $.each(res.data, function(key, value) {
                  rtn.push({val:[{
                  fecha: value.fechaFormat, codigo: value.Codigo, viaje: value.Viaje, 
                  turno: value.Turno, estado: value.Estado, novedad: value.Novedad, ruta: value.Ruta
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

    function cargarGraficaPie(data){
        var ctx = document.getElementById("myAreaChart");
        var myLineChart = new Chart(ctx, {
            type: 'pie',
            data: {
              labels: data.name,
              datasets: [{
                label: 'Viajes',
                data: data.data,
                backgroundColor: getRandomColor(data.data.length)
              }]
            },
            options: {
              responsive: true,
              legend: {
                position: 'bottom',
              },
              title: {
                display: true,
                text: 'Consolidado viajes perdidos por novedad',
                fontSize: 16
              },
              animation: {
                animateScale: true,
                animateRotate: true
              }
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
                  text: 'Viajes Perdidos', align: 'left', dataField: 'model',
                  cellsRenderer: function (row, column, value, rowData) {
                      var punto = rowData.val;
                      var container = "<div>";
                      for (var i = 0; i < punto.length; i++) {
                          var punto = punto[i];
                          var item = "<div style='width: 100%; overflow: hidden; white-space: nowrap;'>";
                          var info = "<div style='background: #e9ecef; margin: 5px; margin-left: 10px; margin-bottom: 3px; padding: 10px 15px; border-radius: 10pt; font-size: 15px'>";
                          info += "<div class='row'><div class='col-6'>Fecha: "+punto.fecha+"</div><div class='col-6'>Vehiculo: "+punto.codigo+"</div><div class='col-4'>Viaje: "+punto.viaje+"</div><div class='col-8 textCenter' style='background: white; color: #039be5; font-weight: bold; border-radius: 7pt 0pt 0pt 7pt;'>"+punto.estado+"</div><div class='col-12'>Nov.: <b>"+punto.novedad+"</b></div><div class='col-12'>Ruta: "+punto.ruta+"</div></div>";
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

    $("#btnVerDetalles").click(function(){
        $("#aTabDetalle").click();
    });

    AjaxGraficaPie();

});
