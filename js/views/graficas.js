	
$(function () {
    
    // SET DE LA FECHA ACTUAL EN LOS INPUTS DE FECHA
    $('#inpFecha1').val(dateNow());
    $('#inpFecha2').val(dateNow());


    function AjaxCargarData(url) {
        var temp;
        $.ajax({
            url: url,
            type: "POST",
            dataType: "JSON",
            async: false,
            data: {fecha1: $("#inpFecha1").val(), fecha2: $("#inpFecha2").val()},
            beforeSend: function (xhr) {
                loading.mostrar("Cargando grafica");
            },
            success: function (response) {
                loading.ocultar();
                temp = response.data;
                return false;
            },
            error: function (xhr) {
                loading.ocultar();
                toastr.error("Error al cargar los datos");
                return false;
            }
        });
        return temp;
    }

    function cargarGraficaVentas(d) {
        var name = Array();
        var dias = Array();
        var data = Array();
        var dataArrayFinal = Array();
        for(i=0;i<d.length;i++) { 
            name[i] = d[i].fecha;
            data[i] = parseFloat(d[i].timbradas);  
            dias[i] = d[i].fecha;
        }
        for(j=0;j<data.length;j++) { 
            var temp = new Array(name[j],data[j],dias[j]); 
            dataArrayFinal[j] = temp;     
        }
        $(function () {
            $('#contenedorReportes').highcharts({
                chart: {
                    height: 700,
                    type: 'bar'
                },
                title: {
                    text: 'Grafica Ventas', 
                    style: {
                        fontWeight: 'bold',
                        fontSize: "27px",
                    }
                },
                subtitle: {
                    text: 'Totalizado por dia de las ventas', 
                    style: {
                        fontSize: "16px",
                    }
                },
                xAxis: {
                        categories: dias,
                        title: {
                            text: 'Fechas',
                            style: {
                                fontWeight: 'bold',
                                fontSize: "23px",
                            }
                        },
                        labels: {
                            style: {
                                fontSize: "17px",
                            }
                        }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Timbradas Vendidas',
                        align: 'high',
                        style: {
                            fontWeight: 'bold',
                            fontSize: "23px",
                        }
                    },
                    labels: {
                        overflow: 'justify',
                        style: {
                            fontSize: "20px",
                        }
                    }
                },
                plotOptions: {
                    series: {
                        cursor: 'pointer'
                    },
                    bar: {
                        dataLabels: {
                            enabled: true,
                            style: {
                                fontSize: "20px",
                            }
                        }
                    }
                },
                tooltip: {
                    pointFormat: 'Timbradas Vendidas: <b>{point.y}</b>'
                },
                legend: {
                   enabled: false
                },
                credits: {
                    enabled: false
                },
                series: [{
                    data: dataArrayFinal,
                    color: '#00e676',
                }]

            });
        });
    }

    function cargarGraficaVentasVehiculo(fechas, data) {
        $(function () {
            $('#contenedorReportes').highcharts({
                chart: {
                    height: 900,
                    type: 'bar'
                },
                title: {
                    text: 'Grafica Ventas', 
                    style: {
                        fontWeight: 'bold',
                        fontSize: "27px",
                    }
                },
                subtitle: {
                    text: 'Totalizado ventas por dia y vehiculo', 
                    style: {
                        fontSize: "16px",
                    }
                },
                xAxis: {
                        categories: fechas,
                        title: {
                            text: 'Fechas',
                            style: {
                                fontWeight: 'bold',
                                fontSize: "23px",
                            }
                        },
                        labels: {
                            style: {
                                fontSize: "17px",
                            }
                        }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Timbradas Vendidas',
                        align: 'high',
                        style: {
                            fontWeight: 'bold',
                            fontSize: "23px",
                        }
                    },
                    labels: {
                        overflow: 'justify',
                        style: {
                            fontSize: "20px",
                        }
                    }
                },
                plotOptions: {
                    series: {
                        cursor: 'pointer'
                    },
                    bar: {
                        dataLabels: {
                            enabled: true,
                            style: {
                                fontSize: "14px",
                            }
                        }
                    }
                },
                tooltip: {
                    pointFormat: 'Timbradas Vendidas: <b>{point.y}</b>'
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'top',
                    x: -40,
                    y: 80,
                    floating: true,
                    borderWidth: 1,
                    backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                    shadow: true,
                    title: {
                        text: "Vehiculos",
                    },
                    itemStyle: {
                        fontSize: "20px",
                    }
                },
                credits: {
                    enabled: false
                },
                series: data
            });
        });
    }

    function cargarGraficaGastos(d) {
        var name = Array();
        var dias = Array();
        var data = Array();
        var dataArrayFinal = Array();
        for(i=0;i<d.length;i++) { 
            name[i] = d[i].fecha;
            data[i] = parseFloat(d[i].descuentos);  
            dias[i] = d[i].fecha;
        }
        for(j=0;j<data.length;j++) { 
            var temp = new Array(name[j],data[j],dias[j]); 
            dataArrayFinal[j] = temp;     
        }
        $(function () {
            $('#contenedorReportes').highcharts({
                chart: {
                    height: 700,
                    type: 'bar'
                },
                title: {
                    text: 'Grafica Gastos', 
                    style: {
                        fontWeight: 'bold',
                        fontSize: "27px",
                    }
                },
                subtitle: {
                    text: 'Totalizado de GPS, Combustible y FET', 
                    style: {
                        fontSize: "16px",
                    }
                },
                xAxis: {
                        categories: dias,
                        title: {
                            text: 'Fechas',
                            style: {
                                fontWeight: 'bold',
                                fontSize: "23px",
                            }
                        },
                        labels: {
                            style: {
                                fontSize: "17px",
                            }
                        }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Gasto',
                        align: 'high',
                        style: {
                            fontWeight: 'bold',
                            fontSize: "23px",
                        }
                    },
                    labels: {
                        overflow: 'justify',
                        style: {
                            fontSize: "20px",
                        }
                    }
                },
                plotOptions: {
                    series: {
                        cursor: 'pointer'
                    },
                    bar: {
                        dataLabels: {
                            enabled: true,
                            style: {
                                fontSize: "20px",
                            }
                        }
                    }
                },
                tooltip: {
                    pointFormat: 'Gasto Total: <b>${point.y}</b>'
                },
                legend: {
                    enabled: false
                },
                credits: {
                    enabled: false
                },
                series: [{
                    data: dataArrayFinal,
                    color: '#00e676',
                }]

            });
        });
    }

    function cargarGraficaGastosVehiculo(fechas, data) {
        $(function () {
            $('#contenedorReportes').highcharts({
                chart: {
                    height: 900,
                    type: 'bar'
                },
                title: {
                    text: 'Grafica Gastos', 
                    style: {
                        fontWeight: 'bold',
                        fontSize: "27px",
                    }
                },
                subtitle: {
                    text: 'Totalizado de GPS, Combustible y FET Por Vehiculo', 
                    style: {
                        fontSize: "16px",
                    }
                },
                xAxis: {
                        categories: fechas,
                        title: {
                            text: 'Fechas',
                            style: {
                                fontWeight: 'bold',
                                fontSize: "23px",
                            }
                        },
                        labels: {
                            style: {
                                fontSize: "17px",
                            }
                        }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Gasto',
                        align: 'high',
                        style: {
                            fontWeight: 'bold',
                            fontSize: "23px",
                        }
                    },
                    labels: {
                        overflow: 'justify',
                        style: {
                            fontSize: "20px",
                        }
                    }
                },
                plotOptions: {
                    series: {
                        cursor: 'pointer'
                    },
                    bar: {
                        dataLabels: {
                            enabled: true,
                            style: {
                                fontSize: "14px",
                            }
                        }
                    }
                },
                tooltip: {
                    pointFormat: 'Gasto Total: <b>${point.y}</b>'
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'top',
                    x: -40,
                    y: 80,
                    floating: true,
                    borderWidth: 1,
                    backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                    shadow: true,
                    title: {
                        text: "Vehiculos",
                    },
                    itemStyle: {
                        fontSize: "20px",
                    }
                },
                credits: {
                    enabled: false
                },
                series: data
            });
        });
    }

    function cargarGraficaCombustible(d) {
        var name = Array();
        var dias = Array();
        var data = Array();
        var dataArrayFinal = Array();
        for(i=0;i<d.length;i++) { 
            name[i] = d[i].fecha;
            data[i] = parseFloat(d[i].valor);  
            dias[i] = d[i].fecha;
        }
        for(j=0;j<data.length;j++) { 
            var temp = new Array(name[j],data[j],dias[j]); 
            dataArrayFinal[j] = temp;     
        }
        $(function () {
            $('#contenedorReportes').highcharts({
                chart: {
                    height: 700,
                    type: 'bar'
                },
                title: {
                    text: 'Grafica Combustible', 
                    style: {
                        fontWeight: 'bold',
                        fontSize: "27px",
                    }
                },
                subtitle: {
                    text: 'Totalizado de combustible por fecha', 
                    style: {
                        fontSize: "16px",
                    }
                },
                xAxis: {
                        categories: dias,
                        title: {
                            text: 'Fechas',
                            style: {
                                fontWeight: 'bold',
                                fontSize: "23px",
                            }
                        },
                        labels: {
                            style: {
                                fontSize: "17px",
                            }
                        }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Combustible',
                        align: 'high',
                        style: {
                            fontWeight: 'bold',
                            fontSize: "23px",
                        }
                    },
                    labels: {
                        overflow: 'justify',
                        style: {
                            fontSize: "20px",
                        }
                    }
                },
                plotOptions: {
                    series: {
                        cursor: 'pointer'
                    },
                    bar: {
                        dataLabels: {
                            enabled: true,
                            style: {
                                fontSize: "20px",
                            }
                        }
                    }
                },
                tooltip: {
                    pointFormat: 'Gasto Total: <b>${point.y}</b>'
                },
                legend: {
                    enabled: false
                },
                credits: {
                    enabled: false
                },
                series: [{
                    data: dataArrayFinal,
                    color: '#00e676',
                }]

            });
        });
    }

    function cargarGraficaCombustibleVehiculo(fechas, data) {
        $(function () {
            $('#contenedorReportes').highcharts({
                chart: {
                    height: 900,
                    type: 'bar'
                },
                title: {
                    text: 'Grafica Combustible', 
                    style: {
                        fontWeight: 'bold',
                        fontSize: "27px",
                    }
                },
                subtitle: {
                    text: 'Totalizado de combustible por fecha y vehiculo', 
                    style: {
                        fontSize: "16px",
                    }
                },
                xAxis: {
                        categories: fechas,
                        title: {
                            text: 'Fechas',
                            style: {
                                fontWeight: 'bold',
                                fontSize: "23px",
                            }
                        },
                        labels: {
                            style: {
                                fontSize: "17px",
                            }
                        }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Combustible',
                        align: 'high',
                        style: {
                            fontWeight: 'bold',
                            fontSize: "23px",
                        }
                    },
                    labels: {
                        overflow: 'justify',
                        style: {
                            fontSize: "20px",
                        }
                    }
                },
                plotOptions: {
                    series: {
                        cursor: 'pointer'
                    },
                    bar: {
                        dataLabels: {
                            enabled: true,
                            style: {
                                fontSize: "14px",
                            }
                        }
                    }
                },
                tooltip: {
                    pointFormat: 'Gasto Total: <b>${point.y}</b>'
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'top',
                    x: -40,
                    y: 80,
                    floating: true,
                    borderWidth: 1,
                    backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                    shadow: true,
                    title: {
                        text: "Vehiculos",
                    },
                    itemStyle: {
                        fontSize: "20px",
                    }
                },
                credits: {
                    enabled: false
                },
                series: data
            });
        });
    }

    function cargarGraficaDescuentosOtros(d) {
        var name = Array();
        var dias = Array();
        var data = Array();
        var dataArrayFinal = Array();
        for(i=0;i<d.length;i++) { 
            name[i] = d[i].fecha;
            data[i] = parseFloat(d[i].valor);  
            dias[i] = d[i].fecha;
        }
        for(j=0;j<data.length;j++) { 
            var temp = new Array(name[j],data[j],dias[j]); 
            dataArrayFinal[j] = temp;     
        }
        $(function () {
            $('#contenedorReportes').highcharts({
                chart: {
                    height: 500,
                    type: 'column'
                },
                title: {
                    text: 'Grafica Descuentos Otros', 
                    style: {
                        fontWeight: 'bold',
                        fontSize: "27px",
                    }
                },
                xAxis: {
                        categories: dias,
                        title: {
                            text: 'Fechas',
                            style: {
                                fontWeight: 'bold',
                                fontSize: "23px",
                            }
                        },
                        labels: {
                            style: {
                                fontSize: "17px",
                            }
                        }
                },
                yAxis: {
                    title: {
                        text: 'Descuento',
                        align: 'high',
                        style: {
                            fontWeight: 'bold',
                            fontSize: "23px",
                        }
                    },
                    labels: {
                        overflow: 'justify',
                        style: {
                            fontSize: "20px",
                        }
                    }
                },
                plotOptions: {
                    series: {
                        cursor: 'pointer'
                    },
                    bar: {
                        dataLabels: {
                            enabled: true,
                            style: {
                                fontSize: "20px",
                            }
                        }
                    }
                },
                tooltip: {
                    pointFormat: 'Total Desc.: <b>${point.y}</b>'
                },
                legend: {
                   enabled: false
                },
                credits: {
                    enabled: false
                },
                series: [{
                    data: dataArrayFinal,
                    color: '#00e676',
                }]

            });
        });
    }

    function cargarGraficaDescuentosOtrosVehiculo(fechas, data) {
        $(function () {
            $('#contenedorReportes').highcharts({
                chart: {
                    height: 500,
                    type: 'column'
                },
                title: {
                    text: 'Grafica Descuentos Otros', 
                    style: {
                        fontWeight: 'bold',
                        fontSize: "27px",
                    }
                },
                xAxis: {
                        categories: fechas,
                        title: {
                            text: 'Fechas',
                            style: {
                                fontWeight: 'bold',
                                fontSize: "23px",
                            }
                        },
                        labels: {
                            style: {
                                fontSize: "17px",
                            }
                        }
                },
                yAxis: {
                    title: {
                        text: 'Descuento',
                        align: 'high',
                        style: {
                            fontWeight: 'bold',
                            fontSize: "23px",
                        }
                    },
                    labels: {
                        overflow: 'justify',
                        style: {
                            fontSize: "20px",
                        }
                    }
                },
                plotOptions: {
                    series: {
                        cursor: 'pointer'
                    },
                    bar: {
                        dataLabels: {
                            enabled: true,
                            style: {
                                fontSize: "14px",
                            }
                        }
                    }
                },
                tooltip: {
                    pointFormat: 'Total Desc.: <b>${point.y}</b>'
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'top',
                    x: -40,
                    y: 80,
                    floating: true,
                    borderWidth: 1,
                    backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                    shadow: true,
                    title: {
                        text: "Vehiculos",
                    },
                    itemStyle: {
                        fontSize: "20px",
                    }
                },
                credits: {
                    enabled: false
                },
                series: data
            });
        });
    }

    $("#btnCargar").click(function () {

        switch($("#inpTipo").val()) {
            case "ventas":
                var data = AjaxCargarData("getGraficaVentas");
                cargarGraficaVentas(data);
            break;
            case "ventasVehiculo":
                var data = AjaxCargarData("getGraficaVentasVehiculo");

                // FECHAS
                var fechasTemp = new Array();
                $.each(data, function(index, value) {
                    fechasTemp.push(value.fecha);
                });
                var fechas = Array.from(new Set(fechasTemp));

                // VEHICULOS
                var vehiculosTemp = new Array();
                $.each(data, function(index, value) {
                    vehiculosTemp.push(value.codigo);
                });
                var vehiculos = Array.from(new Set(vehiculosTemp));
                
                // DATA FINAL
                var dataFinal = new Array();
                $.each(vehiculos, function(indexV, vehiculo) {
                    var arrayTemp = new Array();
                    
                    $.each(fechas, function(indexF, fecha) {
                        var encontro = false;
                        $.each(data, function(index, value) {
                            if(value.codigo == vehiculo && value.fecha == fecha){
                                arrayTemp.push(parseFloat(value.timbradas));
                                encontro = true;
                            }
                        });  
                        if(!encontro){
                            arrayTemp.push(0);
                        } 
                    });

                    var dataVehiculo = new Array();
                    dataVehiculo["name"] = vehiculo;
                    dataVehiculo["data"] = arrayTemp;
                    dataFinal.push(dataVehiculo);
                });

                cargarGraficaVentasVehiculo(fechas, dataFinal);
            break;
            case "gastos":
                var data = AjaxCargarData("getGraficaGastos");
                cargarGraficaGastos(data);
            break;
            case "gastosVehiculo":
                var data = AjaxCargarData("getGraficaGastosVehiculo");

                // FECHAS
                var fechasTemp = new Array();
                $.each(data, function(index, value) {
                    fechasTemp.push(value.fecha);
                });
                var fechas = Array.from(new Set(fechasTemp));

                // VEHICULOS
                var vehiculosTemp = new Array();
                $.each(data, function(index, value) {
                    vehiculosTemp.push(value.codigo);
                });
                var vehiculos = Array.from(new Set(vehiculosTemp));
                
                // DATA FINAL
                var dataFinal = new Array();
                $.each(vehiculos, function(indexV, vehiculo) {
                    var arrayTemp = new Array();

                    $.each(fechas, function(indexF, fecha) {
                        var encontro = false;
                        $.each(data, function(index, value) {
                            if(value.codigo == vehiculo && value.fecha == fecha){
                                arrayTemp.push(parseFloat(value.descuentos));
                                encontro = true;
                            }
                        });  
                        if(!encontro){
                            arrayTemp.push(0);
                        } 
                    });

                    var dataVehiculo = new Array();
                    dataVehiculo["name"] = vehiculo;
                    dataVehiculo["data"] = arrayTemp;
                    dataFinal.push(dataVehiculo);
                });

                cargarGraficaGastosVehiculo(fechas, dataFinal);
            break;
            case "combustible":
                var data = AjaxCargarData("getGraficaCombustible");
                cargarGraficaCombustible(data);
            break;
            case "combustibleVehiculo":
                var data = AjaxCargarData("getGraficaCombustibleVehiculo");

                // FECHAS
                var fechasTemp = new Array();
                $.each(data, function(index, value) {
                    fechasTemp.push(value.fecha);
                });
                var fechas = Array.from(new Set(fechasTemp));

                // VEHICULOS
                var vehiculosTemp = new Array();
                $.each(data, function(index, value) {
                    vehiculosTemp.push(value.codigo);
                });
                var vehiculos = Array.from(new Set(vehiculosTemp));
                
                // DATA FINAL
                var dataFinal = new Array();
                $.each(vehiculos, function(indexV, vehiculo) {
                    var arrayTemp = new Array();
                    
                    $.each(fechas, function(indexF, fecha) {
                        var encontro = false;
                        $.each(data, function(index, value) {
                            if(value.codigo == vehiculo && value.fecha == fecha){
                                arrayTemp.push(parseFloat(value.valor));
                                encontro = true;
                            }
                        });  
                        if(!encontro){
                            arrayTemp.push(0);
                        } 
                    });

                    var dataVehiculo = new Array();
                    dataVehiculo["name"] = vehiculo;
                    dataVehiculo["data"] = arrayTemp;
                    dataFinal.push(dataVehiculo);
                });

                cargarGraficaCombustibleVehiculo(fechas, dataFinal);
            break;
            case "descuentosOtros":
                var data = AjaxCargarData("getGraficaDescuentosOtros");
                cargarGraficaDescuentosOtros(data);
            break;
            case "descuentosOtrosVehiculo":
                var data = AjaxCargarData("getGraficaDescuentosOtrosVehiculo");

                // FECHAS
                var fechasTemp = new Array();
                $.each(data, function(index, value) {
                    fechasTemp.push(value.fecha);
                });
                var fechas = Array.from(new Set(fechasTemp));

                // VEHICULOS
                var vehiculosTemp = new Array();
                $.each(data, function(index, value) {
                    vehiculosTemp.push(value.codigo);
                });
                var vehiculos = Array.from(new Set(vehiculosTemp));
                
                // DATA FINAL
                var dataFinal = new Array();

                $.each(vehiculos, function(indexV, vehiculo) {
                    var arrayTemp = new Array();

                    $.each(fechas, function(indexF, fecha) {
                        var encontro = false;
                        $.each(data, function(index, value) {
                            if(value.codigo == vehiculo && value.fecha == fecha){
                                arrayTemp.push(parseFloat(value.valor));
                                encontro = true;
                            }
                        });  
                        if(!encontro){
                            arrayTemp.push(0);
                        } 
                    });
                     
                    var dataVehiculo = new Array();
                    dataVehiculo["name"] = vehiculo;
                    dataVehiculo["data"] = arrayTemp;
                    dataFinal.push(dataVehiculo);
                });

                cargarGraficaDescuentosOtrosVehiculo(fechas, dataFinal);
            break;
        }

    });




});

