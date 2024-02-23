const getPremiumForm = document.getElementById('getPremiumForm');
const newPremiumUserId = document.getElementById('userId');


getPremiumForm.onsubmit = async (e) => {
    e.preventDefault();
    if(newPremiumUserId.value) {
        const updateUserData = {
            isPremium: true,
        }
        await getPremium(newPremiumUserId.value, updateUserData);
    } else {
        alert("No se pudo formalizar la operación");
    }
}

async function getPremium(newPremiumUserId, updateUserData) {
    try {
        const result = await fetch(`http://localhost:8080/api/users/${newPremiumUserId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'

            },
            body: JSON.stringify(updateUserData)
        });
        if (result.status == 200) {
            alert(`Usted es un usuario premium!`);
            } else {
            alert(`No se pudo formalizar la operación`);
            }
    } catch (error) {
        alert(`Error: ${error}`);
    }
}