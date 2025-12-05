// public/store/store.js
const API_BASE = "/api";
const TOKEN_KEY = "mt_token";
const USER_KEY = "mt_user";

// ====== Helpers de sesión ======
function getSession() {
  const token = localStorage.getItem(TOKEN_KEY);
  const userStr = localStorage.getItem(USER_KEY);
  let user = null;
  if (userStr) {
    try {
      user = JSON.parse(userStr);
    } catch {
      user = null;
    }
  }
  return { token, user };
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

// ====== Helper fetch con JWT ======
async function apiFetch(path, options = {}) {
  const { token } = getSession();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // puede no venir body
  }

  if (!res.ok) {
    const error = new Error(
      data?.message || `Error ${res.status} en la petición`
    );
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

// ====== Referencias DOM ======
const globalMessageEl = document.getElementById("globalMessage");
const userNameEl = document.getElementById("userName");
const btnLogout = document.getElementById("btnLogout");

const navLinks = document.querySelectorAll(".nav-link");
const viewCatalogo = document.getElementById("view-catalogo");
const viewPedidos = document.getElementById("view-pedidos");

const categoryFiltersEl = document.getElementById("categoryFilters");
const productsGridEl = document.getElementById("productsGrid");

// Pedidos
const tbodyPedidosEl = document.getElementById("tbodyPedidos");

// Carrito & drawer
const btnCart = document.getElementById("btnCart");
const cartCountEl = document.getElementById("cartCount");
const cartDrawerEl = document.getElementById("cartDrawer");
const cartBackdropEl = document.getElementById("cartBackdrop");
const btnCloseCart = document.getElementById("btnCloseCart");
const cartItemsEl = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const btnCheckout = document.getElementById("btnCheckout");

// Checkout modal
const checkoutModalEl = document.getElementById("checkoutModal");
const btnCloseCheckout = document.getElementById("btnCloseCheckout");
const btnCancelCheckout = document.getElementById("btnCancelCheckout");
const checkoutForm = document.getElementById("checkoutForm");
const direccionSelectEl = document.getElementById("direccionSelect");
const metodoPagoEl = document.getElementById("metodoPago");
const observacionesEl = document.getElementById("observaciones");

// ====== Estado en memoria ======
let categorias = [];
let productos = [];
let categoriaActiva = null; // null = todas
let carrito = null; // { id, items:[], total }
let pedidos = [];
let direcciones = [];
let pedidosCargados = false;

// ====== UI helpers ======
function showMessage(msg, type = "") {
  globalMessageEl.textContent = msg || "";
  globalMessageEl.classList.remove("error", "success");
  if (!msg) return;
  if (type) globalMessageEl.classList.add(type);
}

function setView(view) {
  navLinks.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.view === view);
  });
  if (view === "catalogo") {
    viewCatalogo.classList.add("active");
    viewPedidos.classList.remove("active");
  } else {
    viewCatalogo.classList.remove("active");
    viewPedidos.classList.add("active");
    if (!pedidosCargados) {
      loadPedidos().catch((err) =>
        console.error("Error al cargar pedidos:", err)
      );
    }
  }
}

function openCart() {
  cartDrawerEl.classList.remove("hidden");
  cartBackdropEl.classList.remove("hidden");
}

function closeCart() {
  cartDrawerEl.classList.add("hidden");
  cartBackdropEl.classList.add("hidden");
}

function openCheckoutModal() {
  checkoutModalEl.classList.remove("hidden");
}

function closeCheckoutModal() {
  checkoutModalEl.classList.add("hidden");
}

// ====== Render categorías ======
function renderCategorias() {
  categoryFiltersEl.innerHTML = "";

  const chipTodas = document.createElement("button");
  chipTodas.type = "button";
  chipTodas.textContent = "Todas";
  chipTodas.className = "chip" + (categoriaActiva === null ? " active" : "");
  chipTodas.dataset.catId = "";
  categoryFiltersEl.appendChild(chipTodas);

  categorias.forEach((cat) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className =
      "chip" + (categoriaActiva === cat.id ? " active" : "");
    chip.dataset.catId = String(cat.id);
    chip.textContent = cat.nombre;
    categoryFiltersEl.appendChild(chip);
  });
}

// ====== Render productos ======
function renderProductos() {
  productsGridEl.innerHTML = "";

  if (!productos.length) {
    const empty = document.createElement("p");
    empty.textContent = "No hay productos disponibles.";
    productsGridEl.appendChild(empty);
    return;
  }

  const productosFiltrados = productos.filter((p) =>
    categoriaActiva ? p.categoriaId === categoriaActiva : true
  );

  productosFiltrados.forEach((p) => {
    const card = document.createElement("article");
    card.className = "product-card";

    const imgDiv = document.createElement("div");
    imgDiv.className = "product-image";
    if (p.urlImagen) {
      imgDiv.style.backgroundImage = `url("${p.urlImagen}")`;
    }
    const badge = document.createElement("div");
    badge.className = "product-badge";
    badge.textContent = p.categoriaNombre || "Healthy";

    imgDiv.appendChild(badge);

    const body = document.createElement("div");
    body.className = "product-body";

    const cat = document.createElement("div");
    cat.className = "product-category";
    cat.textContent = p.categoriaNombre || "Categoría";

    const name = document.createElement("h3");
    name.className = "product-name";
    name.textContent = p.nombre;

    const desc = document.createElement("p");
    desc.className = "product-desc";
    const texto = p.descripcion || "";
    desc.textContent =
      texto.length > 100 ? texto.substring(0, 97) + "..." : texto;

    const tags = document.createElement("div");
    tags.className = "product-tags";
    if (p.esVegano) {
      const tag = document.createElement("span");
      tag.className = "tag-pill";
      tag.textContent = "Vegano";
      tags.appendChild(tag);
    }
    if (p.esSinGluten) {
      const tag = document.createElement("span");
      tag.className = "tag-pill";
      tag.textContent = "Sin gluten";
      tags.appendChild(tag);
    }

    body.appendChild(cat);
    body.appendChild(name);
    body.appendChild(desc);
    if (tags.children.length) {
      body.appendChild(tags);
    }

    const footer = document.createElement("div");
    footer.className = "product-footer";

    const price = document.createElement("div");
    price.className = "product-price";
    price.innerHTML = `$${Number(p.precio).toFixed(2)} <span>MXN</span>`;

    const btnAdd = document.createElement("button");
    btnAdd.className = "btn-primary";
    btnAdd.type = "button";
    btnAdd.textContent = "Agregar";
    btnAdd.dataset.productId = String(p.id);

    footer.appendChild(price);
    footer.appendChild(btnAdd);

    card.appendChild(imgDiv);
    card.appendChild(body);
    card.appendChild(footer);

    productsGridEl.appendChild(card);
  });
}

// ====== Render carrito ======
function renderCarrito() {
  if (!carrito || !carrito.items || carrito.items.length === 0) {
    cartItemsEl.innerHTML =
      '<p style="font-size:0.82rem;color:#6b7280;">Tu carrito está vacío. Agrega algún producto del catálogo.</p>';
    cartTotalEl.textContent = "$0.00";
    cartCountEl.textContent = "0";
    return;
  }

  cartItemsEl.innerHTML = "";
  let totalCount = 0;

  carrito.items.forEach((item) => {
    totalCount += item.cantidad;

    const row = document.createElement("div");
    row.className = "cart-item";

    const thumb = document.createElement("div");
    thumb.className = "cart-thumb";
    if (item.urlImagen) {
      thumb.style.backgroundImage = `url("${item.urlImagen}")`;
    }

    const info = document.createElement("div");
    info.className = "cart-info";

    const name = document.createElement("div");
    name.className = "cart-name";
    name.textContent = item.nombre;

    const extra = document.createElement("div");
    extra.className = "cart-extra";
    extra.textContent = `x${item.cantidad}`;

    const bottom = document.createElement("div");
    bottom.className = "cart-row-bottom";

    const qty = document.createElement("div");
    qty.className = "cart-qty";

    const btnMinus = document.createElement("button");
    btnMinus.type = "button";
    btnMinus.textContent = "-";
    btnMinus.dataset.action = "minus";
    btnMinus.dataset.itemId = String(item.id);

    const qtySpan = document.createElement("span");
    qtySpan.textContent = String(item.cantidad);

    const btnPlus = document.createElement("button");
    btnPlus.type = "button";
    btnPlus.textContent = "+";
    btnPlus.dataset.action = "plus";
    btnPlus.dataset.itemId = String(item.id);

    qty.appendChild(btnMinus);
    qty.appendChild(qtySpan);
    qty.appendChild(btnPlus);

    const right = document.createElement("div");
    const price = document.createElement("div");
    price.className = "cart-price";
    price.textContent = `$${Number(item.subtotal).toFixed(2)}`;

    const btnRemove = document.createElement("button");
    btnRemove.type = "button";
    btnRemove.className = "cart-remove";
    btnRemove.dataset.action = "remove";
    btnRemove.dataset.itemId = String(item.id);
    btnRemove.textContent = "Quitar";

    right.appendChild(price);
    right.appendChild(btnRemove);

    bottom.appendChild(qty);
    bottom.appendChild(right);

    info.appendChild(name);
    info.appendChild(extra);
    info.appendChild(bottom);

    row.appendChild(thumb);
    row.appendChild(info);

    cartItemsEl.appendChild(row);
  });

  cartTotalEl.textContent = `$${Number(carrito.total || 0).toFixed(2)}`;
  cartCountEl.textContent = String(totalCount);
}

// ====== Render pedidos ======
function renderPedidos() {
  tbodyPedidosEl.innerHTML = "";

  if (!pedidos.length) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 5;
    td.textContent = "No tienes pedidos registrados.";
    tbodyPedidosEl.appendChild(tr);
    tr.appendChild(td);
    return;
  }

  pedidos.forEach((p) => {
    const tr = document.createElement("tr");

    const tdId = document.createElement("td");
    tdId.textContent = p.id;

    const tdFecha = document.createElement("td");
    tdFecha.textContent = new Date(p.createdAt || p.created_at).toLocaleString();

    const tdEstado = document.createElement("td");
    tdEstado.textContent = p.estado;

    const tdPago = document.createElement("td");
    tdPago.textContent = p.metodoPago || p.metodo_pago || "";

    const tdTotal = document.createElement("td");
    tdTotal.textContent = `$${Number(p.total).toFixed(2)}`;

    tr.appendChild(tdId);
    tr.appendChild(tdFecha);
    tr.appendChild(tdEstado);
    tr.appendChild(tdPago);
    tr.appendChild(tdTotal);

    tbodyPedidosEl.appendChild(tr);
  });
}

// ====== Cargas iniciales ======
async function loadCategorias() {
  // asumo GET /api/categorias devuelve [{id, nombre, ...}]
  categorias = await apiFetch("/categorias");
  // opcional: ordenar
  categorias.sort((a, b) => a.nombre.localeCompare(b.nombre));
  renderCategorias();
}

async function loadProductos() {
  // asumo GET /api/productos devuelve la lista con campos
  productos = await apiFetch("/productos");
  renderProductos();
}

async function loadCarrito() {
  try {
    // asumo GET /api/carrito devuelve { id, items:[{id, productoId, nombre, urlImagen, cantidad, precioUnitario, subtotal}], total }
    carrito = await apiFetch("/carrito");
  } catch (err) {
    if (err.status === 404) {
      carrito = { id: null, items: [], total: 0 };
    } else {
      throw err;
    }
  }
  renderCarrito();
}

async function loadDirecciones() {
  // asumo GET /api/direcciones/mias devuelve la lista de direcciones del cliente
  direcciones = await apiFetch("/direcciones/mias");
  direccionSelectEl.innerHTML = "";

  if (!direcciones.length) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "No tienes direcciones registradas";
    direccionSelectEl.appendChild(opt);
    direccionSelectEl.disabled = true;
  } else {
    direccionSelectEl.disabled = false;
    direcciones.forEach((d) => {
      const opt = document.createElement("option");
      opt.value = d.id;
      opt.textContent = `${d.alias || "Dirección"} - ${d.calle} ${d.numero_ext}, ${d.colonia}`;
      direccionSelectEl.appendChild(opt);
    });
  }
}

async function loadPedidos() {
  // asumo GET /api/pedidos/mios
  pedidos = await apiFetch("/pedidos/mios");
  pedidosCargados = true;
  renderPedidos();
}

// ====== Acciones carrito ======
async function addToCart(productId) {
  try {
    showMessage("Agregando producto al carrito...", "success");
    const data = await apiFetch("/carrito/items", {
      method: "POST",
      body: JSON.stringify({ productoId, cantidad: 1 }),
    });
    carrito = data;
    renderCarrito();
    openCart();
    showMessage("Producto agregado al carrito.", "success");
  } catch (err) {
    console.error(err);
    showMessage(err.message || "No se pudo agregar al carrito.", "error");
  }
}

async function updateCartItem(itemId, action) {
  const item = carrito?.items?.find((i) => i.id === Number(itemId));
  if (!item) return;

  if (action === "minus" && item.cantidad <= 1) {
    // mejor eliminar
    return removeCartItem(itemId);
  }

  const nuevaCantidad =
    action === "plus" ? item.cantidad + 1 : item.cantidad - 1;

  try {
    const data = await apiFetch(`/carrito/items/${itemId}`, {
      method: "PATCH",
      body: JSON.stringify({ cantidad: nuevaCantidad }),
    });
    carrito = data;
    renderCarrito();
  } catch (err) {
    console.error(err);
    showMessage("No se pudo actualizar la cantidad.", "error");
  }
}

async function removeCartItem(itemId) {
  try {
    const data = await apiFetch(`/carrito/items/${itemId}`, {
      method: "DELETE",
    });
    carrito = data;
    renderCarrito();
  } catch (err) {
    console.error(err);
    showMessage("No se pudo quitar el producto.", "error");
  }
}

// ====== Checkout / pedido ======
async function realizarCheckout(event) {
  event.preventDefault();
  if (!carrito || !carrito.items || carrito.items.length === 0) {
    showMessage("Tu carrito está vacío.", "error");
    return;
  }

  if (!direcciones.length) {
    showMessage("No tienes direcciones de envío registradas.", "error");
    return;
  }

  const direccionEnvioId = Number(direccionSelectEl.value);
  const metodoPago = metodoPagoEl.value;
  const observaciones = observacionesEl.value.trim();

  if (!direccionEnvioId) {
    showMessage("Selecciona una dirección de envío.", "error");
    return;
  }

  try {
    showMessage("Creando pedido...", "success");
    // asumo POST /api/pedidos
    await apiFetch("/pedidos", {
      method: "POST",
      body: JSON.stringify({
        direccionEnvioId,
        metodoPago,
        observaciones: observaciones || null,
      }),
    });

    showMessage("Pedido creado correctamente.", "success");
    closeCheckoutModal();
    // recargar carrito (debería quedar vacío)
    await loadCarrito();
    // recargar pedidos
    pedidosCargados = false;
    if (viewPedidos.classList.contains("active")) {
      await loadPedidos();
    }
  } catch (err) {
    console.error(err);
    showMessage(err.message || "No se pudo crear el pedido.", "error");
  }
}

// ====== Inicialización ======
async function init() {
  // Validar sesión
  const { token, user } = getSession();
  if (!token || !user) {
    // si no hay sesión, mando al login principal
    window.location.href = "/";
    return;
  }

  userNameEl.textContent = user.nombre || user.email || "Cliente";

  // Eventos de navegación
  navLinks.forEach((btn) => {
    btn.addEventListener("click", () => {
      setView(btn.dataset.view);
    });
  });

  // Logout
  btnLogout.addEventListener("click", () => {
    clearSession();
    window.location.href = "/";
  });

  // Filtros de categorías
  categoryFiltersEl.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    const catId = chip.dataset.catId;
    categoriaActiva = catId ? Number(catId) : null;
    renderCategorias();
    renderProductos();
  });

  // Click en productos (delegado)
  productsGridEl.addEventListener("click", (e) => {
    const btn = e.target.closest("button.btn-primary");
    if (!btn || !btn.dataset.productId) return;
    const productId = Number(btn.dataset.productId);
    addToCart(productId);
  });

  // Carrito
  btnCart.addEventListener("click", openCart);
  btnCloseCart.addEventListener("click", closeCart);
  cartBackdropEl.addEventListener("click", closeCart);

  // Delegado dentro del carrito
  cartItemsEl.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn || !btn.dataset.itemId) return;
    const itemId = btn.dataset.itemId;
    const action = btn.dataset.action;
    if (!action) return;

    if (action === "remove") {
      removeCartItem(itemId);
    } else if (action === "plus" || action === "minus") {
      updateCartItem(itemId, action);
    }
  });

  // Checkout
  btnCheckout.addEventListener("click", async () => {
    try {
      await loadDirecciones();
      openCheckoutModal();
    } catch (err) {
      console.error(err);
      showMessage(
        "No se pudieron cargar tus direcciones de envío.",
        "error"
      );
    }
  });

  btnCloseCheckout.addEventListener("click", closeCheckoutModal);
  btnCancelCheckout.addEventListener("click", closeCheckoutModal);
  checkoutForm.addEventListener("submit", realizarCheckout);

  // Cargas iniciales
  try {
    await Promise.all([loadCategorias(), loadProductos(), loadCarrito()]);
    showMessage("");
  } catch (err) {
    console.error(err);
    showMessage("No se pudo cargar el catálogo.", "error");
  }
}

document.addEventListener("DOMContentLoaded", init);
