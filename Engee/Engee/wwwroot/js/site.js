$('document').ready(function () {
    $('#boton-consultar').click(function () {
        dni = $('#dni').val();
        buscar_persona_por_dni(dni);
    });
    $('#boton-ingresar').click(agregar_al_historial)
    cargar_filtros();
    cargar_historial();
    $("#elegir-sector").change(function () { cascada_filtros($("#elegir-sector").val()) })
});


function buscar_persona_por_dni() {
    $('#mostrar-nombreyapellido').html('');
    $('#mostrar-fecha-ingreso').html('');
    $('#mostrar-hora-ingreso').html('');
    $.ajaxSetup({ cache: false });
    $.ajax({
        url: '/Home/BuscarDNI',
        type: 'GET',
        data: {
            dni: dni
        },
        success: function (result)
        {
            if (result.data == null)
            {
                $('#mostrar-nombreyapellido').html('<p>DNI NO VALIDO<p>');
            }
            else
            {
                $('#mostrar-nombreyapellido').html('<span>' + result.data + '</span>');
                var hoy = new Date (Date.now());
                $("#mostrar-fecha-ingreso").html('<span>' + hoy.toDateString() + '</span>');
                var horaActual = new Date();
                $("#mostrar-hora-ingreso").html('<span>' + horaActual.toLocaleTimeString() + '</span>');
            }
                
        },
        error: function (error) {
            alert(error);
        }
    });
}

filtrosArray = []
sectorArray = []
nombreArray = []

function cargar_filtros() {
    $.ajaxSetup({ cache: false });
    $.ajax({
        url: '/Home/cargar_filtros',
        type: 'GET',
        data: {
            sector: $("#elegir-sector").val(),
            nombre: $("#elegir-visita-a").val()
        },
        success: function (result) {

            filtrosArray = result.data

            sectorArray = [... new Set(result.data.map(d => d.sector))]
            nombreArray = [... new Set(result.data.map(d => d.nombre))]
            
            $("#elegir-sector").html(sectorArray.map(function (e) { return '<option value=' + e + '>' + e + '</option>' }));
            $("#elegir-sector").prop('selectedIndex', -1);
            $("#elegir-visita-a").html(nombreArray.map(function (e) { return '<option value=' + e + '>' + e + '</option>' }));
            $("#elegir-visita-a").prop('selectedIndex', -1);

           
        },
        error: function (error) {

            alert(error);
        }
    });
}

function cascada_filtros(sectorValue) {
    
    nombreArray = filtrosArray.filter(function (d) { return d.sector == sectorValue }).map(function (e) { return e.nombre})
    $("#elegir-visita-a").html(nombreArray.map(function (e) { return '<option value=' + e + '>' + e + '</option>' }));
    $("#elegir-visita-a").prop('selectedIndex', -1);  

}

function cargar_historial() {
    $("#tabla_historial").html('');
    $.ajaxSetup({ cache: false });
    $.ajax({
        url: '/Home/cargar_historial',
        type: 'GET',
        success: function (result) {
            imprimirTabla(result);
        },
        error: function (error) {

            alert(error);
        }
    });
}

function imprimirTabla(result) {

    var tablaHistorial = document.getElementById('tabla_historial');

    result.data.forEach(function (d) {

        const filaHistorial = tablaHistorial.insertRow();

        Object.keys(d).forEach(function (e) {

            const celdaHistorial = filaHistorial.insertCell();

            celdaHistorial.appendChild(document.createTextNode(d[e]))
        })
    })
}

function agregar_al_historial() {
    $.ajaxSetup({ cache: false });
    $.ajax({
        url: '/Home/agregar_nuevo_historial',
        type: 'POST',
        data: {
            ingreso: $("#nro-tarjeta").val(),
            visito: $("#elegir-visita-a option:selected").text(),
            fecha: document.getElementById("mostrar-fecha-ingreso").innerText,
            hora: document.getElementById("mostrar-hora-ingreso").innerText
        },
        success: function (result) {
            alert(result.data);
            cargar_historial();            
        },
        error: function (error) {
            alert(error);
        }
    });

}