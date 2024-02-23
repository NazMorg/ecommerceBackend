const emptyCartForm = document.getElementById('emptyCartForm');
const userCart = document.getElementById('cartId').value;
const userRole = document.getElementById('userRole').value;


emptyCartForm.onsubmit = async (e) => {
    e.preventDefault();
    
    if (userRole === "user") {
        await emptyCart(userCart);
    } else {
        alert("No tiene permisos para realizar esta acción");
    }

}

async function emptyCart(userCart) {
    try {
        const result = await fetch(`http://localhost:8080/api/carts/${userCart}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'

            },
        });
        if (result) {
            alert(`Carrito vaciado, refresque la pestaña.`);
        }
    } catch (error) {
        alert(`Error: ${error}`)
    }
}