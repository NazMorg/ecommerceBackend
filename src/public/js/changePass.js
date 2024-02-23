const changePassForm = document.getElementById('changePassForm');
const token = document.getElementById('token');
const email = document.getElementById('email');
const pass = document.getElementById('newPass');
const passConfirm = document.getElementById('newPassConfirm');


changePassForm.onsubmit = async (e) => {
    e.preventDefault();
    if(passConfirm.value === passConfirm.value) {
        if(email.value) {
            await updatePass(email.value, pass.value, passConfirm.value, token.value);
        } else {
            alert("Introduzca su email");
        }
    } else {
        alert("Las contraseñas no coinciden");
    }
}

async function updatePass(email, pass, passConfirm, token) {
    try {
        const result = await fetch(`http://localhost:8080/api/users/new-password/${token}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'

            },
            body: JSON.stringify({ email: email, pass: pass, passConfirm: passConfirm })
        });
        if(result.status == 200) {
            alert(`Contraseña Actualizada!`);
        } else {
            alert("Algo salio mal... ")
        }
    } catch (error) {
        alert(`Error: ${error}`)
    }
}