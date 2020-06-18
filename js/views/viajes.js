$(function() {

    $('#inpFecha').val(dateNow());

    let dataUser = JSON.parse(localStorage.getItem('userData'));

 
    function getViajes(fecha, tipo, propietario) {
      $.ajax({
          url: urlAPI + "/viajes/getViajesRecaudados/"+fecha+"/"+tipo+"/"+propietario,
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
                  fecha: value.dfechadia, recaudo: value.rfecharecaudo, codigo: value.Codigo, 
                  factura: value.factura, bruto: value.Bruto, timbradas: value.Timbradas, viajes: value.Viaje, extemporaneo: value.extemporaneo
                  }]});
              });

              cargarData(rtn)

              return false;
          },
          error: function (res){
              alert(res.responseJSON.message);
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
                      text: 'Ventas', align: 'left', dataField: 'model',
                      cellsRenderer: function (row, column, value, rowData) {

                          var punto = rowData.val;
                          console.log(punto);

                          var container = "<div>";
                          for (var i = 0; i < punto.length; i++) {
                              var punto = punto[i];
                              var item = "<div style='width: 100%; overflow: hidden; white-space: nowrap;'>";
                              var info = "<div style='background: "+((punto.extemporaneo==1)?("#fffda1"):("#e9ecef"))+"; margin: 5px; margin-left: 10px; margin-bottom: 3px; padding: 10px 15px; border-radius: 10pt; font-style: italic; font-size: 15px'>";
                              info += "<div class='row'><div class='col-12 col-sm-4'>Dia: "+punto.recaudo+"</div><div class='col-6 col-sm-4'>Fecha: "+punto.fecha+"</div><div class='col-6 col-sm-4'>Tims: "+punto.timbradas+"</div><div class='col-6 col-sm-4'>Factura: "+punto.factura+"</div><div class='col-6 col-sm-3' >Bruto: "+punto.bruto+"</div><div class='col-6 col-sm-3' >Vehiculo: "+punto.codigo+"</div> <div class='col-6 col-sm-3' >Viaje: "+punto.viajes+"</div> </div>";
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
        getViajes($("#inpFecha").val(), $("input[name='inpCheckDia']:checked").val(), dataUser.idPropietario)
    });






});
