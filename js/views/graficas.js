$(function () {
    
    const dataUser = JSON.parse(localStorage.getItem('userData'));


    Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
    Chart.defaults.global.defaultFontColor = '#292b2c';
    
    var myLineChart;

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
            AjaxGraficaVentasDiarias();
            return false;
        },
        error: function (res){
            swal.error(res.responseJSON.message);
            return false;
        }
    });

    function AjaxGraficaVentasDiarias() {
        $.ajax({
            url: urlAPI + "/viajes/getSumTimbByCarroAndFecha",
            type: "POST",
            dataType: 'JSON',
            contentType: 'application/json',
            data: JSON.stringify({fecha: $("#inpFecha").val(), vehiculo: $("#inpVehiculo").val(), idPropietario: dataUser.idPropietario}),
            beforeSend: function (xhr){ 
                xhr.setRequestHeader('Authorization', localStorage.getItem('token')); 
                $("#btnCargar").prop("disabled", true);
            },
            success: function (response) {
                let fechas = new Array();
                let data =  new Array();
                $.each(response.data, function(index, value) {
                  fechas.push(value.fecha);
                  data.push(value.total);
                });
                cargarGraficaTimbradas(fechas, data);
                return false;
            },
            error: function (res) {
                swal.error(res.responseJSON.message);
                return false;
            },
            complete: function (res){
                $("#btnCargar").prop("disabled", false);
            }
        });
    }

    function AjaxGraficaCombustible() {
        $.ajax({
            url: urlAPI + "/gastos/getSumCombsByCarroAndFecha",
            type: "POST",
            dataType: 'JSON',
            contentType: 'application/json',
            data: JSON.stringify({fecha: $("#inpFecha").val(), vehiculo: $("#inpVehiculo").val(), idPropietario: dataUser.idPropietario}),
            beforeSend: function (xhr){ 
                xhr.setRequestHeader('Authorization', localStorage.getItem('token')); 
                $("#btnCargar").prop("disabled", true);
            },
            success: function (response) {
                let fechas = new Array();
                let data =  new Array();
                $.each(response.data, function(index, value) {
                  fechas.push(value.fecha);
                  data.push(value.total);
                });
                cargarGraficaCombustible(fechas, data);
                return false;
            },
            error: function (res) {
                swal.error(res.responseJSON.message);
                return false;
            },
            complete: function (res){
                $("#btnCargar").prop("disabled", false);
            }
        });
    }

    function AjaxGraficaPromedioDiario() {
        $.ajax({
            url: urlAPI + "/viajes/getPromedioByCarroAndFecha",
            type: "POST",
            dataType: 'JSON',
            contentType: 'application/json',
            data: JSON.stringify({fecha: $("#inpFecha").val(), vehiculo: $("#inpVehiculo").val()}),
            beforeSend: function (xhr){ 
                xhr.setRequestHeader('Authorization', localStorage.getItem('token')); 
                $("#btnCargar").prop("disabled", true);
            },
            success: function (response) {
                let fechas = new Array();
                let dataV =  new Array();
                let dataR =  new Array();
                $.each(response.data, function(index, value) {
                  fechas.push(value.fecha);
                  dataV.push(value.prom);
                  dataR.push(value.promRuta);
                });
                cargarGraficaPromedios(fechas, dataV, dataR);
                return false;
            },
            error: function (res) {
                swal.error(res.responseJSON.message);
                return false;
            },
            complete: function (res){
                $("#btnCargar").prop("disabled", false);
            }
        });
    }

    function cargarGraficaTimbradas(fechas, data){
        var ctx = document.getElementById("myAreaChart");
        myLineChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: fechas,
            datasets: [{
              label: "Timbs.",
              lineTension: 0.3,
              backgroundColor: "rgba(0,123,255,0.2)",
              borderColor: "rgba(0,123,255,0.7)",
              pointRadius: 5,
              pointBackgroundColor: "rgba(0,123,255,1)",
              pointBorderColor: "rgba(0,123,255,0.7)",
              pointHoverRadius: 5,
              pointHoverBackgroundColor: "rgba(2,117,216,1)",
              pointHitRadius: 50,
              pointBorderWidth: 2,
              data: data,
            }],
          },
          options: {
            title: {
                display: true,
                text: 'Grafica Timbradas Vendidas',
                fontSize: 18,
                fontStyle: 500,
                padding: 20
            },
            scales: {
              xAxes: [{
                time: {
                  unit: 'date'
                },
                gridLines: {
                  display: false
                },
                ticks: {
                }
              }],
              yAxes: [{
                ticks: {
                    min: 0
                },
                gridLines: {
                  color: "rgba(0, 0, 0, .125)",
                }
              }],
            },
            legend: {
              display: false
            }
          }
        });
    }

    function cargarGraficaPromedios(fechas, dataV, dataR){
        var ctx = document.getElementById("myAreaChart");
        myLineChart = Chart.Line(ctx, {
            data: {
                labels: fechas,
                datasets: [{
                    label: 'Prom. Vehiculo',
                    borderColor: "#0069d9",
                    backgroundColor: "#0069d9",
                    fill: false,
                    data: dataV,
                    yAxisID: 'y-axis-1',
                }, {
                    label: 'Prom. Ruta',
                    borderColor: "#FF6384",
                    backgroundColor: "#FF6384",
                    fill: false,
                    data: dataR,
                    yAxisID: 'y-axis-2'
                }]
            },
            options: {
                responsive: true,
                hoverMode: 'index',
                stacked: false,
                title: {
                    display: true,
                    text: 'Grafica Promedio Vehiculo vs Ruta',
                    fontSize: 18,
                    fontStyle: 500,
                    padding: 20
                },
                scales: {
                    yAxes: [{
                        type: 'linear',
                        display: true,
                        position: 'left',
                        id: 'y-axis-1',
                    }, {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        id: 'y-axis-2',
                        gridLines: {
                            drawOnChartArea: false,
                        },
                    }],
                }
            }
        });
    }

    function cargarGraficaCombustible(fechas, data){
        var ctx = document.getElementById("myAreaChart");
        myLineChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: fechas,
            datasets: [{
              label: "Combustible",
              lineTension: 0.3,
              backgroundColor: "rgba(0,123,255,0.2)",
              borderColor: "rgba(0,123,255,0.7)",
              pointRadius: 5,
              pointBackgroundColor: "rgba(0,123,255,1)",
              pointBorderColor: "rgba(0,123,255,0.7)",
              pointHoverRadius: 5,
              pointHoverBackgroundColor: "rgba(2,117,216,1)",
              pointHitRadius: 50,
              pointBorderWidth: 2,
              data: data,
            }],
          },
          options: {
            title: {
                display: true,
                text: 'Grafica Combustible Gastado',
                fontSize: 18,
                fontStyle: 500,
                padding: 20
            },
            scales: {
              xAxes: [{
                time: {
                  unit: 'date'
                },
                gridLines: {
                  display: false
                },
                ticks: {
                }
              }],
              yAxes: [{
                ticks: {
                    min: 0,
                    callback: function(value, index, values) {
                      if(parseInt(value) >= 1000){
                        return '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                      } else {
                        return '$' + value;
                      }
                    }
                },
                gridLines: {
                  color: "rgba(0, 0, 0, .125)",
                }
              }],
            },
            legend: {
              display: false
            }
          }
        });
    }

    function removeData(chart) {
        if(chart === undefined){
        }else{
            chart.data.labels.pop();
            chart.data.datasets.pop();
            chart.data.datasets.pop();
            chart.update();
        }
    }

    $("#btnCargar").click(function(){
        removeData(myLineChart);
        
        switch($("#inpTipo").val()) {
            case "VentasDiaria":
                AjaxGraficaVentasDiarias();
                break;
            case "Combustible":
                AjaxGraficaCombustible();
                break;
            case "PromDiario":
                if($("#inpVehiculo").val() == "N/A"){
                    toast.question("Esta grafica solo esta disponible por vehiculo");
                    return false;
                }
                AjaxGraficaPromedioDiario();
                break;
        }
    });


});

