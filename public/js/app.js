$(document).ready(function () {

    let productos = [];
    let id = 1;

    // Función para mostrar alertas
    function mostrarAlerta(tipo, mensaje) {
        $("#alerta")
            .removeClass()
            .addClass("alert alert-" + tipo)
            .text(mensaje)
            .removeClass("d-none");

        setTimeout(() => $("#alerta").addClass("d-none"), 3000);
    }
 
    // Renderizar tabla   hecho por kevin shagñay
    function renderTabla(lista) {
    $("#tablaProductos").empty();

    lista.forEach(p => {
        $("#tablaProductos").append(`
            <tr>
                <td>${p.id}</td>
                <td>${p.nombre}</td>
                <td>${p.precio}</td>
                <td>${p.categoria}</td>
                <td>
                    <button class="btn btn-danger btn-sm btnEliminar" data-id="${p.id}">
                        Eliminar
                    </button>
                </td>
            </tr>
        `);
    });
}


    // Agregar producto
        $("#btnAgregar").click(function () {
            let nombre = $("#nombre").val().trim();
            let precio = Number($("#precio").val());
            let categoria = $("#categoria").val();

            if (nombre === "" || precio === 0 || categoria === "") {
                mostrarAlerta("warning", "Todos los campos son obligatorios");
                return;
            }

            let producto = {
                id: id++,
                nombre,
                precio,
                categoria
            };

            productos.push(producto);

            mostrarAlerta("success", "Producto agregado correctamente");
            renderTabla(productos);

            $("#formProducto")[0].reset();

            // Actualizar estadísticas automáticamente si están visibles
            if (!$("#cardStats").hasClass("d-none")) {
                $("#btnStats").click();
            }
        });


    // Filtro por categoría
    // Filtro por categoría por Bárbara Rodas
    $("#filtroCategoria").change(function () {
        let cat = $(this).val();

        if (cat === "Todos") {
            renderTabla(productos);
        } else {
            let filtrados = productos.filter(p => p.categoria === cat);
            renderTabla(filtrados);
        }
    });

    // Buscador en vivo
    // Buscador en vivo por Bárbara Rodas
    $("#buscador").keyup(function () {
        let texto = $(this).val().toLowerCase();

        let filtrados = productos.filter(p =>
            p.nombre.toLowerCase().includes(texto)
        );

        renderTabla(filtrados);
    });

    // Ordenamiento
    $("#ordenPrecio").change(function () {
        let tipo = $(this).val();

        if (tipo === "asc") {
            productos.sort((a, b) => a.precio - b.precio);
        } else if (tipo === "desc") {
            productos.sort((a, b) => b.precio - a.precio);
        }

        renderTabla(productos);
    });

    // Estadísticas
    $("#btnStats").click(function () {
        if (productos.length === 0) {
            mostrarAlerta("warning", "No hay productos para calcular estadísticas");
            return;
        }

        let total = productos.length;

        let suma = 0;
        let max = productos[0];
        let min = productos[0];

        productos.forEach(p => {
            suma += p.precio;

            if (p.precio > max.precio) max = p;
            if (p.precio < min.precio) min = p;
        });

        let promedio = suma / total;

        $("#statTotal").text(total);
        $("#statPromedio").text(promedio.toFixed(2));
        $("#statCaro").text(`${max.nombre} ($${max.precio})`);
        $("#statBarato").text(`${min.nombre} ($${min.precio})`);

        $("#cardStats").removeClass("d-none");
    });

    // Evento eliminar producto 
        $(document).on("click", ".btnEliminar", function () {
            let idEliminar = $(this).data("id");

            // Confirmación simple
            let seguro = confirm("¿Estás seguro de eliminar este producto?");
            if (!seguro) return; // Si el usuario presiona "Cancelar", no hacer nada

            // Buscar índice del producto
            let indice = productos.findIndex(p => p.id === idEliminar);

            if (indice !== -1) {
                // Eliminar producto del array
                productos.splice(indice, 1);

                // Mostrar alerta de eliminación
                mostrarAlerta("danger", "Producto eliminado");

                // Actualizar tabla
                renderTabla(productos);

                // Si el card de estadísticas está visible, recalcular estadísticas
                if (!$("#cardStats").hasClass("d-none")) {
                    $("#btnStats").click();
                }
            }
        });



});

