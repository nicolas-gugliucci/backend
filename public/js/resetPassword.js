const form = document.getElementById('resetPasswordForm')

form.addEventListener('submit', e => {
    e.preventDefault()
    const data = new FormData(form)
    const obj = {}
    data.forEach((value, key) => obj[key] = value)
    if (obj.pass1 !== obj.pass2) {
        let errorP = document.getElementById("error")
        errorP.innerHTML = "Passwords doesn't match"
        return
    }
    fetch('/api/sessions/resetPassword', {
        method: 'POST',
        body: JSON.stringify({password:obj.pass1}),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result => {
        if (result.status === 200) {
            Swal.fire({
                icon: 'success',
                title: "Password reset"
            }).then(()=>{
                window.location.replace('/login')
            })
        } else if (result.status === 400) {
            let errorP = document.getElementById("error")
            errorP.innerHTML = 'The password must be diferent from previous one'
        }
    }).catch(error => {
        return done(error)
    })

})