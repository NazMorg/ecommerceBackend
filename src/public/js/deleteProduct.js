const deleteProductForm = document.getElementById('deleteProductForm');
const deleteProductId = document.getElementById('deleteProductId');

deleteProductForm.onsubmit = async (e) => {
    e.preventDefault();
    if(deleteProductId.value) {
        await deleteProduct(deleteProductId.value)
    } else {
        alert("Es necesario proveer el id del producto a eliminar")
    }
}

async function deleteProduct(deleteProductId) {
    try {
        const result = await fetch(`http://localhost:8080/api/products/${deleteProductId}`, {
            method: 'DELETE',
        });
        if (result.status == 200) {
            alert(`Producto eliminado correctamente`);
        } else {
            alert(`No se pudo eliminar el producto`);
        }
    } catch (error) {
        alert(`Error: ${error}`)
    }
}