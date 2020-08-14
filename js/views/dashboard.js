$(function() {

    const dataUser = JSON.parse(localStorage.getItem('userData'));


    Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
    Chart.defaults.global.defaultFontColor = '#292b2c';


    function getValoresDashboard() {
        $.ajax({
            url: urlAPI + "/viajes/getValoresDashboard",
            type: "POST",
            dataType: 'JSON',
            contentType: 'application/json',
            data: JSON.stringify({cedula: dataUser.identificacion, empresas: JSON.stringify(dataUser.empresas)}),
            beforeSend: function (xhr){ 
                xhr.setRequestHeader('Authorization', localStorage.getItem('token')); 
            },
            success: function (res){
                if(res.data.length > 0){
                    $("#divAlarmasA").text(res.data[0].tim);
                    $("#divAlarmasB").text(res.data[0].descuento);
                    $("#divAlarmasC").text(res.data[0].rfecharecaudo);
                }
                return false;
            },
            error: function (res){
                swal.error(res.responseJSON.message);
                return false;
            }
        });
    }

    function AjaxGraficaDona() {
        $.ajax({
            url: urlAPI + "/viajes/getGraficaDonaDashboard",
            type: "POST",
            dataType: 'JSON',
            contentType: 'application/json',
            data: JSON.stringify({cedula: dataUser.identificacion, empresas: JSON.stringify(dataUser.empresas)}),
            beforeSend: function (xhr){ 
                xhr.setRequestHeader('Authorization', localStorage.getItem('token')); 
            },
            success: function (res){
                var rtn = {name: [], data: []};
                $.each(res.data, function(key, value) {
                    rtn.name.push(value.tipo);
                    rtn.data.push(value.total);
                });
                cargarGraficaDona(rtn);
                return false;
            },
            error: function (res){
                swal.error(res.responseJSON.message);
                return false;
            }
        });
    }

    function AjaxGraficaBars() {
        $.ajax({
            url: urlAPI + "/viajes/getGraficaBarsDashboard",
            type: "POST",
            dataType: 'JSON',
            contentType: 'application/json',
            data: JSON.stringify({cedula: dataUser.identificacion, empresas: JSON.stringify(dataUser.empresas)}),
            beforeSend: function (xhr){ 
                xhr.setRequestHeader('Authorization', localStorage.getItem('token')); 
            },
            success: function (res){
                var rtn = {name: [], data: []};
                $.each(res.data, function(key, value) {
                    rtn.name.push(value.Codigo);
                    rtn.data.push(value.timbradas);
                });
                cargarGraficaBars(rtn);
                return false;
            },
            error: function (res){
                swal.error(res.responseJSON.message);
                return false;
            }
        });
    }

    function cargarGraficaDona(data){
        var ctx = document.getElementById("myAreaChart2");
        var myLineChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
              labels: data.name,
              datasets: [{
                label: 'Viajes',
                backgroundColor: ["#4BC0C0", "#FF6384", "#FFCD56"],
                data: data.data
              }]
            },
            options: {
              responsive: true,
              legend: {
                position: 'bottom',
              },
              title: {
                display: true,
                text: 'Consolidado viajes por estado',
                fontSize: 16
              },
              animation: {
                animateScale: true,
                animateRotate: true
              }
            }
        });
    }

    function cargarGraficaBars(data){
        var ctx = document.getElementById("myAreaChart");
        var myLineChart = new Chart(ctx, {
            type: 'horizontalBar',
            data: {
              labels: data.name,
              datasets: [{
                label: 'Timbradas',
                backgroundColor: "#33c5e4",
                borderColor: "#33c5e4",
                borderWidth: 1,
                data: data.data
              }]
            },
            options: {
              elements: {
                rectangle: {
                  borderWidth: 2,
                }
              },
              responsive: true,
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Consolidado ventas por vehiculo',
                fontSize: 16
              }
            }
        });
    }


    
    

    
    AjaxGraficaBars();
    AjaxGraficaDona();
    getValoresDashboard();

});