$(function() {

    const dataUser = JSON.parse(localStorage.getItem('userDataGTU'));


    Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
    Chart.defaults.global.defaultFontColor = '#292b2c';

    var vehiculosDashboard = [];

    function getValoresDashboard() {
        $.ajax({
            url: urlAPI + "/viajes/getValoresDashboard",
            type: "POST",
            dataType: 'JSON',
            contentType: 'application/json',
            data: JSON.stringify({cedula: dataUser.identificacion, empresas: JSON.stringify(dataUser.empresas)}),
            beforeSend: function (xhr){ 
                xhr.setRequestHeader('Authorization', localStorage.getItem('tokenGTU')); 
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

    function getVehiculosDashboard() {
        $.ajax({
            url: urlAPI + "/viajes/getVehiculosDashboard",
            type: "POST",
            dataType: 'JSON',
            contentType: 'application/json',
            data: JSON.stringify({cedula: dataUser.identificacion, empresas: JSON.stringify(dataUser.empresas)}),
            beforeSend: function (xhr){ 
                xhr.setRequestHeader('Authorization', localStorage.getItem('tokenGTU')); 
            },
            success: function (res){
                if(res.data.length > 0){
                    vehiculosDashboard = res.data;
                    createVehiculos();
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
                xhr.setRequestHeader('Authorization', localStorage.getItem('tokenGTU')); 
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
                xhr.setRequestHeader('Authorization', localStorage.getItem('tokenGTU')); 
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

    function createVehiculos(){
        $.each(vehiculosDashboard, function(index, value) {
            createRowTitleVehiculo(value.empresa);
            $.each(value.data, function(indexV, valueV) {
                createBurbujaMiniVehiculo(value.empresa, valueV);
            });  
        });
    }

    function createVehiculosFilter(type, empresa){
        $("#divRowVehiculos_"+empresa).html("");
        $.each(vehiculosDashboard, function(index, value) {
            if(value.empresa == empresa){
                $.each(value.data, function(indexV, valueV) {
                    if(type == 1){
                        createBurbujaMiniVehiculo(value.empresa, valueV);    
                    }else{
                        createBurbujaVehiculo(value.empresa, valueV);
                    }
                }); 
            }
        });
    }

    function createRowTitleVehiculo(empresa){
        let str = '<div class="row marginTop15px"><div class="col-7"><h5 class="fontSize18px margin0 text-center paddingSuperiores10px" style="color: white; background: #57a8ff; border-radius: 10px;">'+empresa+'</h5></div><div class="col-5"><div class="width100porciento height100porciento paddingSuperiores10px btnTypeGridVehiculos" data-empresa="'+empresa+'" data-type="1" style="border-bottom: 4px solid #e9ecef; color: #899197"><span class="float-right">Vista: <i class="fas fa-th-large fontSize20px marginLeft10px"></i></span></div></div></div>';
        $("#tabVehiculos").append(str);
        /* ***************** */
        let strRow = '<div class="row" id="divRowVehiculos_'+empresa+'"></div>';
        $("#tabVehiculos").append(strRow);
    }

    function createBurbujaMiniVehiculo(empresa, vehiculo){
        let str;
        switch(vehiculo.estado) {
          case "EN_VIAJE":
            str = '<div class="col-6 marginTop15px"><div class="sombraMasSuave burbujaVehiculoDash miniature bur-yellow"><div class="bur-title"><label class="margin0 fontWeight500">EN VIAJE</label></div><div class="centerDiv marginSuperior10px"><div class="text-center"><i class="fas fa-bus-alt fontSize50px text-center icon-bus"></i><br><label class="margin0 fontWeight500 width100porciento marginTop10px">Cod: <span class="fontWeight400">'+vehiculo.codigo+'</span></label><br><label class="margin0 fontWeight500 width100porciento">Placa: <span class="fontWeight400">'+vehiculo.placa+'</span></label></div></div></div></div>';   
            break;
          case "EN_ESPERA":
            str = '<div class="col-6 marginTop15px"><div class="sombraMasSuave burbujaVehiculoDash miniature bur-green"><div class="bur-title"><label class="margin0 fontWeight500">EN ESPERA</label></div><div class="centerDiv marginSuperior10px"><div class="text-center"><i class="fas fa-bus-alt fontSize50px text-center icon-bus"></i><br><label class="margin0 fontWeight500 width100porciento marginTop10px">Cod: <span class="fontWeight400">'+vehiculo.codigo+'</span></label><br><label class="margin0 fontWeight500 width100porciento">Placa: <span class="fontWeight400">'+vehiculo.placa+'</span></label></div></div></div></div>';
            break;
          case "NO_PROGRAMADO":
            str = '<div class="col-6 marginTop15px"><div class="sombraMasSuave burbujaVehiculoDash miniature bur-gray"><div class="bur-title"><label class="margin0 fontWeight500">NO PROGRAM.</label></div><div class="centerDiv marginSuperior10px"><div class="text-center"><i class="fas fa-bus-alt fontSize50px text-center icon-bus"></i><br><label class="margin0 fontWeight500 width100porciento marginTop10px">Cod: <span class="fontWeight400">'+vehiculo.codigo+'</span></label><br><label class="margin0 fontWeight500 width100porciento">Placa: <span class="fontWeight400">'+vehiculo.placa+'</span></label></div></div></div></div>';
            break;
          case "NO_TRABAJO":
            str = '<div class="col-6 marginTop15px"><div class="sombraMasSuave burbujaVehiculoDash miniature bur-red"><div class="bur-title"><label class="margin0 fontWeight500">NO TRABAJO</label></div><div class="centerDiv marginSuperior10px"><div class="text-center"><i class="fas fa-bus-alt fontSize50px text-center icon-bus"></i><br><label class="margin0 fontWeight500 width100porciento marginTop10px">Cod: <span class="fontWeight400">'+vehiculo.codigo+'</span></label><br><label class="margin0 fontWeight500 width100porciento">Placa: <span class="fontWeight400">'+vehiculo.placa+'</span></label></div></div></div></div>';
            break;
        }        
        $("#divRowVehiculos_"+empresa).append(str);
    }

    function createBurbujaVehiculo(empresa, vehiculo){
        let str;
        switch(vehiculo.estado) {
          case "EN_VIAJE":
            str = '<div class="col-12 marginTop15px"><div class="sombraMasSuave burbujaVehiculoDash bur-yellow"><div class="row"><div class="col-3 centerDiv" style="padding-right: 0"><i class="fas fa-bus-alt fontSize50px icon-bus"></i></div><div class="col-9"><div class="bur-title"><label class="margin0 fontWeight500">EN VIAJE</label><div style="float: right; display: flex;"><div class="centerDiv bur-btns"><i class="fas fa-info"></i></div><div class="centerDiv bur-btns"><i class="fas fa-directions"></i></div><div class="centerDiv bur-btns"><i class="fas fa-map-marker-alt"></i></div></div></div><div class="row marginTop5px"><div class="col-7 paddingR5"><label class="margin0 fontWeight500">Cod: <span class="fontWeight400">'+vehiculo.codigo+'</span></label><br><label class="margin0 fontWeight500">Placa: <span class="fontWeight400">'+vehiculo.placa+'</span></label></div><div class="col-5 paddingL5"><label class="margin0 fontWeight500">Viaje: <span class="fontWeight400">'+vehiculo.viaje+'</span></label><br><label class="margin0 fontWeight500">Turno: <span class="fontWeight400">'+vehiculo.turno+'</span></label></div></div></div></div><div class="row marginTop10px"><div class="col-7"><label class="margin0 fontWeight500">Cond.: <span class="fontWeight400 fontSize13px">'+vehiculo.conductor+'</span></label></div><div class="col-5"><label class="margin0 fontWeight500">H.D: <span class="fontWeight400">'+vehiculo.horadespacho+'</span></label></div></div><label class="margin0 width100porciento fontWeight500">Ruta: <span class="fontWeight400 fontSize13px">'+vehiculo.ruta+'</span></label></div></div>';   
            break;
          case "EN_ESPERA":
            str = '<div class="col-12 marginTop15px"><div class="sombraMasSuave burbujaVehiculoDash bur-green"><div class="row"><div class="col-3 centerDiv" style="padding-right: 0"><i class="fas fa-bus-alt fontSize50px icon-bus"></i></div><div class="col-9"><div class="bur-title"><label class="margin0 fontWeight500">EN ESPERA</label><div style="float: right; display: flex;"><div class="centerDiv bur-btns"><i class="fas fa-info"></i></div><div class="centerDiv bur-btns"><i class="fas fa-directions"></i></div><div class="centerDiv bur-btns"><i class="fas fa-map-marker-alt"></i></div></div></div><div class="row marginTop5px"><div class="col-7 paddingR5"><label class="margin0 fontWeight500">Cod: <span class="fontWeight400">'+vehiculo.codigo+'</span></label><br><label class="margin0 fontWeight500">Placa: <span class="fontWeight400">'+vehiculo.placa+'</span></label></div><div class="col-5 paddingL5"><label class="margin0 fontWeight500">T.Vjs: <span class="fontWeight400">'+vehiculo.totVjs+'</span></label><br><label class="margin0 fontWeight500">T.Tims: <span class="fontWeight400">'+vehiculo.totalTims+'</span></label> </div></div></div></div><label class="margin0 width100porciento fontWeight500 marginTop10px">Cond.: <span class="fontWeight400 fontSize13px">'+vehiculo.conductor+'</span></label><label class="margin0 width100porciento fontWeight500">Ruta: <span class="fontWeight400 fontSize13px">'+vehiculo.ruta+'</span></label></div></div>';
            break;
          case "NO_PROGRAMADO":
            str = '<div class="col-12 marginTop15px"><div class="sombraMasSuave burbujaVehiculoDash bur-gray"><div class="row"><div class="col-3 centerDiv" style="padding-right: 0"><i class="fas fa-bus-alt fontSize50px icon-bus"></i></div><div class="col-9"><div class="bur-title"><label class="margin0 fontWeight500">NO PROGRAM.</label><div style="float: right; display: flex;"><div class="centerDiv bur-btns"><i class="fas fa-info"></i></div><div class="centerDiv bur-btns"><i class="fas fa-map-marker-alt"></i></div></div></div><div class="row marginTop5px"><div class="col-7"><label class="margin0 fontWeight500">Cod: <span class="fontWeight400">'+vehiculo.codigo+'</span></label><br><label class="margin0 fontWeight500">Placa: <span class="fontWeight400">'+vehiculo.placa+'</span></label></div></div></div></div><label class="margin0 width100porciento fontWeight500 marginTop10px text-center"> - Vehiculo no programado - </label></div></div>';
            break;
          case "NO_TRABAJO":
            str = '<div class="col-12 marginTop15px"><div class="sombraMasSuave burbujaVehiculoDash bur-red"><div class="row"><div class="col-3 centerDiv" style="padding-right: 0"><i class="fas fa-bus-alt fontSize50px icon-bus"></i></div><div class="col-9"><div class="bur-title"><label class="margin0 fontWeight500">NO TRABAJO</label><div style="float: right; display: flex;"><div class="centerDiv bur-btns"><i class="fas fa-info"></i></div><div class="centerDiv bur-btns"><i class="fas fa-map-marker-alt"></i></div></div></div><div class="row marginTop5px"><div class="col-7 paddingR5"><label class="margin0 fontWeight500">Cod: <span class="fontWeight400">'+vehiculo.codigo+'</span></label><br><label class="margin0 fontWeight500">Placa: <span class="fontWeight400">'+vehiculo.placa+'</span></label></div><div class="col-5 paddingL5"><label class="margin0 fontWeight500">T.Vjs P: <span class="fontWeight400">'+vehiculo.totVjsPerd+'</span></label><br><label class="margin0 fontWeight500">Turno: <span class="fontWeight400">'+vehiculo.turno+'</span></label></div></div></div></div><label class="margin0 fontWeight500 marginTop10px">Cond.: <span class="fontWeight400 fontSize13px">'+vehiculo.conductor+'</span></label><label class="margin0 width100porciento fontWeight500">Ruta: <span class="fontWeight400 fontSize13px">'+vehiculo.ruta+'</span></label></div></div>';
            break;
        }        
        $("#divRowVehiculos_"+empresa).append(str);
    }

    $("body").on('click tap touchstart','.btnTypeGridVehiculos',function(){
        if($(this).data("type") == 1){
            $(this).html('<span class="float-right">Vista: <i class="fas fa-th-list fontSize20px marginLeft10px"></i></span>');
            $(this).data("type", 2);
        }else{
            $(this).html('<span class="float-right">Vista: <i class="fas fa-th-large fontSize20px marginLeft10px"></i></span>');
            $(this).data("type", 1);
        }
        createVehiculosFilter($(this).data("type"), $(this).data("empresa"));
    });
    

    
    AjaxGraficaBars();
    AjaxGraficaDona();
    getValoresDashboard();
    getVehiculosDashboard();


});