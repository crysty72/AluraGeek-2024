$(document).ready(function() {
    // Llamada a la función para renderizar productos y configurar el controlador de eventos
    obtenerYMostrarProductos();

    // Controlador de eventos para eliminar productos
    $(document).on('click', '.delete-button', function() {
        var $button = $(this); // Guarda una referencia al botón
        var productId = $button.closest('.card-producto').data('product-id');
        
        $.ajax({
            url: 'http://localhost:3000/delete-product/' + productId,
            type: 'DELETE',
            success: function(response) {
                console.log(response);
                // Elimina la tarjeta del producto de la página
                $button.closest('.card-producto').remove(); // Usa la referencia al botón
            },
            error: function(err) {
                console.error(err);
            }
        });
    });

    // Función para obtener y mostrar productos
    function obtenerYMostrarProductos() {
        fetch("http://localhost:3000/productos")
            .then(res => {
                if (!res.ok) {
                    throw new Error("Error al cargar los productos");
                }
                return res.json();
            })
            .then(productos => renderizarProductos(productos))
            .catch(error => console.error(error));
    }

    // Función para renderizar productos en cards
    function renderizarProductos(productos) {
        const productosContainer = $("#product-cards");
        productosContainer.empty();

        productos.forEach(producto => {
            const card = createCard(producto);
            productosContainer.append(card);
        });
    }

    function createCard(producto) {
        const cardProducto = $("<div>").addClass('card-producto');

        // Asignar el ID del producto al atributo data-product-id
        cardProducto.attr('data-product-id', producto.id);

        const figura = $("<figure>");
        const imagenProducto = $("<img>").addClass('imagen-producto').attr({ src: producto.imagen_url, alt: producto.nombre });
        const figcaption = $("<figcaption>").addClass('nombre-producto').text(producto.nombre);

        figura.append(imagenProducto, figcaption);

        const contenedorPrecio = $("<span>").addClass('contenedor-precio');
        const precio = $("<p>").text(`$ ${producto.precio}`);
        contenedorPrecio.append(precio);

        // Crear el botón de eliminar
        function eliminarElemento() {
            // Encuentra el elemento que deseas eliminar (por ejemplo, la tarjeta del producto)
            const $tarjetaProducto = $(this).closest('.card-producto');
        
            // Elimina la tarjeta del producto de la página
            $tarjetaProducto.remove();
        }

        const botonEliminar = $("<button>").addClass('delete-button');
        const iconoEliminar = $("<img>").attr({ src: './src/icons8-basura-24.png', alt: 'Icono de eliminar' });

        // Asigna el evento de clic al botón
        botonEliminar.on('click', eliminarElemento);

        botonEliminar.append(iconoEliminar, "Eliminar");
        cardProducto.append(figura, contenedorPrecio, botonEliminar);

        return cardProducto;
    }
});
