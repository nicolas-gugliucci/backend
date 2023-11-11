const infoForm = document.getElementById('infoForm')
const changeForm = document.getElementById('changeForm')
const deleteForm = document.getElementById('deleteForm')

infoForm.addEventListener('submit', e => {
    e.preventDefault()
    try {
        const data = new FormData(infoForm)
        const obj = {}
        data.forEach((value, key) => obj[key] = value)
        fetch(`/api/sessions/`, {
            method: 'GET'
        }).then(result => {
            if (result.status === 200) {
                return result.json();
            } else if (result.status === 400) {
                let errorP = document.getElementById("error");
                errorP.innerHTML = 'Error';
            }
        })
        .then(data => {
            try {
                const userInfo = data.payload.find(e => e.email === obj.email);
                let name = document.getElementById("name");
                name.innerHTML = `Name: ${userInfo.first_name} ${userInfo.last_name}`;
                let email = document.getElementById("email");
                email.innerHTML = `Email: ${userInfo.email}`;
                let role = document.getElementById("role");
                role.innerHTML = `Role: ${userInfo.role}`;
                let errorP = document.getElementById("error");
                errorP.innerHTML = '';
                document.getElementById('infoInput').value = ''
            } catch (error) {
                let errorP = document.getElementById("error");
                errorP.innerHTML = 'Error';
                let name = document.getElementById("name");
                name.innerHTML = ''
                let email = document.getElementById("email");
                email.innerHTML = ''
                let role = document.getElementById("role");
                role.innerHTML = ''
            }
        })
        .catch(error => {
            let errorP = document.getElementById("error");
            errorP.innerHTML = 'Error';
            let name = document.getElementById("name");
            name.innerHTML = ''
            let email = document.getElementById("email");
            email.innerHTML = ''
            let role = document.getElementById("role");
            role.innerHTML = ''
        });
    } catch (error) {
        let errorP = document.getElementById("error");
        errorP.innerHTML = 'Error';
        let name = document.getElementById("name");
        name.innerHTML = ''
        let email = document.getElementById("email");
        email.innerHTML = ''
        let role = document.getElementById("role");
        role.innerHTML = ''
    }
    

})

changeForm.addEventListener('submit', e => {
    e.preventDefault()

    const data = new FormData(changeForm)
    const obj = {}
    data.forEach((value, key) => obj[key] = value)
    fetch(`/api/sessions/`, {
        method: 'GET'
    }).then(result => {
        if (result.status === 200) {
            let errorP = document.getElementById("error");
            errorP.innerHTML = '';
            return result.json();
        } else if (result.status === 400) {
            let errorP = document.getElementById("error");
            errorP.innerHTML = 'Error';
        }
    })
    .then(data => {
        try {
            const userInfo = data.payload.find(e => e.email === obj.email);
            const uid = userInfo._id
            fetch(`/api/sessions/role/${uid}`, {
                method: 'POST',
                body: JSON.stringify({role: obj.opciones}),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(result => {
                if (result.status === 200) {
                    document.getElementById('changeInput').value = ''
                    Swal.fire({
                        title: "Role updated",
                        text: `The role of ${obj.email} has been changed to ${obj.opciones}`
                    })
                    let errorP = document.getElementById("error2");
                    errorP.innerHTML = '';
                    return result.json();
                } else if (result.status === 400) {
                    let errorP = document.getElementById("error2");
                    errorP.innerHTML = 'Error';
                }
            }).catch(error => {
                let errorP = document.getElementById("error2");
                errorP.innerHTML = 'Error';
            })
        } catch (error) {
            let errorP = document.getElementById("error2");
            errorP.innerHTML = 'Error';
        }
    })
    .catch(error => {
        let errorP = document.getElementById("error2");
        errorP.innerHTML = 'Error';
    });
    

})

deleteForm.addEventListener('submit', e => {
    e.preventDefault()

    const data = new FormData(deleteForm)
    const obj = {}
    data.forEach((value, key) => obj[key] = value)

    fetch(`/api/sessions/delete/${obj.email}`, {
        method: 'DELETE',
    }).then(result => {
        if (result.status === 200) {
            document.getElementById('deleteInput').value = ''
            Swal.fire({
                title: "User deleted",
                text: `${obj.email} has been deleted`
            })
            let errorP = document.getElementById("error3");
            errorP.innerHTML = '';
            return result.json();
        } else if (result.status === 400) {
            let errorP = document.getElementById("error3");
            errorP.innerHTML = 'Error';
        }
    }).catch(error => {
        let errorP = document.getElementById("error3");
        errorP.innerHTML = 'Error';
    })

})