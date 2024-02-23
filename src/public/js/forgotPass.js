const recoveryForm = document.getElementById('recoveryForm');
const email = document.getElementById('email');


recoveryForm.onsubmit = async (e) => {
    e.preventDefault();
    if(email.value) {
        await generateRecoveryToken(email.value);
    } else {
        alert("Introduzca su email!");
    }
}

async function generateRecoveryToken(email) {
    try {
        console.log(email)
        const result = await fetch(`http://localhost:8080/api/users/forgotpassword/${email}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'

            },
            body: JSON.stringify(email)
        });
        if(result.status == 200) {
            alert(`Se envio un link de recuperacion a su email: ${email}`);
        } else {
            alert("Algo salio mal...")
        }
    } catch (error) {
        alert(`Error: ${error}`)
    }
}