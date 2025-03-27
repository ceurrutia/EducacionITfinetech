const form = document.getElementById('registroForm');
const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

function mostrarAlerta(mensaje, tipo) {
    document.getElementById("alertContainer").innerHTML = `<div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
}

form.addEventListener('submit', function (event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    if (usuarios.some(u => u.email === email)) {
        mostrarAlerta("El destinatario ya existe.", "danger");
        return;
    }
    usuarios.push({ email: email, saldo: 0, movimientos: [] });
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    mostrarAlerta("Destinatario registrado con éxito.", "success");
    form.reset();
});