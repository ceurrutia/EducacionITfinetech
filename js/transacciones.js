let usuario;
let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

function cargarTransacciones() {
  usuario = JSON.parse(sessionStorage.getItem("usuario"));
  if (!usuario) {
    window.location.href = "index.html";
    return;
  }
  document.getElementById("saldo").textContent = `$${usuario.saldo.toFixed(2)}`;
  document.getElementById("nombreUsuario").textContent = `Bienvenido, ${
    usuario.nombre || "Usuario"
  }`;
  actualizarHistorial();
  actualizarDestinatarios();
  actualizarSelectDestinatarios();
}

function actualizarHistorial() {
  const lista = document.getElementById("listaTransacciones");
  lista.innerHTML = "";
  usuario.movimientos.forEach((mov) => {
    const li = document.createElement("li");
    li.className = "list-group-item bg-dark text-light";
    li.textContent = mov;
    lista.appendChild(li);
  });
}

function actualizarDestinatarios() {
  const lista = document.getElementById("listaDestinatarios");
  lista.innerHTML = "";
  usuarios.forEach((u) => {
    const li = document.createElement("li");
    li.className = "list-group-item bg-light";
    li.textContent = u.email;
    lista.appendChild(li);
  });
}

function actualizarSelectDestinatarios() {
  const select = document.getElementById("usuarioDestino");
  select.innerHTML = '<option value="">Seleccionar destinatario</option>';
  usuarios.forEach((u) => {
    const option = document.createElement("option");
    option.value = u.email;
    option.textContent = u.email;
    select.appendChild(option);
  });
}

function mostrarAlerta(mensaje, tipo) {
  document.getElementById(
    "alertContainer"
  ).innerHTML = `<div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`;
}

function ingresarDinero() {
  const monto = parseFloat(document.getElementById("montoIngreso").value);
  if (monto > 0) {
    usuario.saldo += monto;
    usuario.movimientos.push(`Ingreso: +$${monto.toFixed(2)}`);
    sessionStorage.setItem("usuario", JSON.stringify(usuario));
    document.getElementById("saldo").textContent = `$${usuario.saldo.toFixed(2)}`;
    actualizarHistorial();
    mostrarAlerta(`Se ingresaron $${monto.toFixed(2)} con éxito.`, "success");
  } else {
    mostrarAlerta("Monto inválido.", "danger");
  }
  // Limpiar el campo de ingreso
  document.getElementById("montoIngreso").value = "";
}

function transferirDinero() {
  const monto = parseFloat(
    document.getElementById("montoTransferencia").value
  );
  const destinoEmail = document.getElementById("usuarioDestino").value;
  if (destinoEmail === "") {
    mostrarAlerta("Por favor, seleccione un destinatario.", "danger");
    return;
  }
  if (monto > 0 && usuario.saldo >= monto) {
    const destinatario = usuarios.find((u) => u.email === destinoEmail);
    if (destinatario) {
      usuario.saldo -= monto;
      usuario.movimientos.push(`Transferencia: -$${monto.toFixed(2)} a ${destinoEmail}`);
      destinatario.saldo += monto;
      destinatario.movimientos.push(`Transferencia: +$${monto.toFixed(2)} de ${usuario.email}`);
      sessionStorage.setItem("usuario", JSON.stringify(usuario));
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
      document.getElementById("saldo").textContent = `$${usuario.saldo.toFixed(2)}`;
      actualizarHistorial();
      mostrarAlerta(`Se transfirieron $${monto.toFixed(2)} a ${destinoEmail} con éxito.`, "success");
    } else {
      mostrarAlerta("El destinatario no existe.", "danger");
    }
  } else {
    mostrarAlerta("Fondos insuficientes o monto inválido.", "danger");
  }
  // Limpiar los campos de transferencia
  document.getElementById("montoTransferencia").value = "";
  document.getElementById("usuarioDestino").value = "";
}

function logout() {
  sessionStorage.removeItem("usuario");
  window.location.href = "index.html";
}

window.onload = cargarTransacciones;