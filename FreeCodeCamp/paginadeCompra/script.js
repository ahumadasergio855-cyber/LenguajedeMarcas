
// =================================
// VARIABLES
// =================================

const botonesAgregar = document.querySelectorAll(".agregar-carrito");

const abrirCarrito = document.getElementById("abrir-carrito");
const cerrarCarrito = document.getElementById("cerrar-carrito");

const panelCarrito = document.getElementById("panel-carrito");
const fondoCarrito = document.getElementById("fondo-carrito");

const listaCarrito = document.getElementById("lista-carrito");

const contadorCarrito = document.getElementById("contador-carrito");
const totalCarrito = document.getElementById("total-carrito");

const finalizarCompra = document.getElementById("finalizar-compra");


// =================================
// RECUPERAR CARRITO
// =================================

let carrito = [];

try {
    carrito = JSON.parse(localStorage.getItem("carritoEvarkion")) || [];
    
    if (!Array.isArray(carrito)) {
        carrito = [];
    }
} catch {
    carrito = [];
}


// =================================
// ABRIR Y CERRAR CARRITO
// =================================

function mostrarCarrito() {
    panelCarrito.classList.add("activo");
    fondoCarrito.classList.add("activo");
}

function ocultarCarrito() {
    panelCarrito.classList.remove("activo");
    fondoCarrito.classList.remove("activo");
}

abrirCarrito.addEventListener("click", mostrarCarrito);

cerrarCarrito.addEventListener("click", ocultarCarrito);

fondoCarrito.addEventListener("click", ocultarCarrito);


// =================================
// GUARDAR CARRITO
// =================================

function guardarCarrito() {
    localStorage.setItem("carritoEvarkion", JSON.stringify(carrito));
}


// =================================
// AÑADIR PRODUCTOS
// =================================

botonesAgregar.forEach(boton => {

    boton.addEventListener("click", () => {

        const id = boton.dataset.id;
        const nombre = boton.dataset.nombre;
        const precio = Number(boton.dataset.precio);

        if (!id || !nombre || !Number.isFinite(precio) || precio < 0) {
            return;
        }

        const productoExistente = carrito.find(
            producto => producto.id === id
        );

        if (productoExistente) {

            productoExistente.cantidad++;

        } else {

            carrito.push({
                id: id,
                nombre: nombre,
                precio: precio,
                cantidad: 1
            });

        }

        guardarCarrito();
        actualizarCarrito();

        mostrarCarrito();

    });

});


// =================================
// ACTUALIZAR CARRITO
// =================================

function actualizarCarrito() {

    listaCarrito.innerHTML = "";

    let total = 0;
    let cantidadTotal = 0;

    if (carrito.length === 0) {

        listaCarrito.textContent = "Tu carrito está vacío.";

    }

    carrito.forEach(producto => {

        const subtotal = producto.precio * producto.cantidad;

        total += subtotal;
        cantidadTotal += producto.cantidad;

        const elemento = document.createElement("div");
        elemento.className = "item-carrito";

        const titulo = document.createElement("h4");
        titulo.textContent = producto.nombre;

        const precio = document.createElement("p");
        precio.className = "item-precio";
        precio.textContent = subtotal.toFixed(2) + " €";

        const controles = document.createElement("div");
        controles.className = "controles-cantidad";

        const botonMenos = document.createElement("button");
        botonMenos.textContent = "-";
        botonMenos.dataset.accion = "menos";
        botonMenos.dataset.id = producto.id;

        const cantidad = document.createElement("span");
        cantidad.textContent = producto.cantidad;

        const botonMas = document.createElement("button");
        botonMas.textContent = "+";
        botonMas.dataset.accion = "mas";
        botonMas.dataset.id = producto.id;

        const eliminar = document.createElement("button");
        eliminar.textContent = "✕";
        eliminar.className = "eliminar-producto";
        eliminar.dataset.accion = "eliminar";
        eliminar.dataset.id = producto.id;

        controles.append(
            botonMenos,
            cantidad,
            botonMas,
            eliminar
        );

        elemento.append(titulo, precio, controles);

        listaCarrito.appendChild(elemento);

    });

    contadorCarrito.textContent = cantidadTotal;

    totalCarrito.textContent = total.toFixed(2) + " €";

    finalizarCompra.disabled = carrito.length === 0;

}


// =================================
// MODIFICAR CANTIDADES
// =================================

listaCarrito.addEventListener("click", evento => {

    const boton = evento.target.closest("button");

    if (!boton) return;

    const id = boton.dataset.id;
    const accion = boton.dataset.accion;

    const producto = carrito.find(
        elemento => elemento.id === id
    );

    if (!producto) return;

    if (accion === "mas") {

        producto.cantidad++;

    }

    if (accion === "menos") {

        producto.cantidad--;

        if (producto.cantidad <= 0) {

            carrito = carrito.filter(
                elemento => elemento.id !== id
            );

        }

    }

    if (accion === "eliminar") {

        carrito = carrito.filter(
            elemento => elemento.id !== id
        );

    }

    guardarCarrito();
    actualizarCarrito();

});


// =================================
// FINALIZAR COMPRA
// =================================

finalizarCompra.addEventListener("click", () => {

    if (carrito.length === 0) return;

    alert(
        "¡Tu carrito está preparado! " +
        "En la siguiente fase conectaremos los métodos de pago."
    );

});


// =================================
// INICIALIZAR
// =================================

actualizarCarrito();
