const start_reset_password_button = document.getElementById('reset-password')

const startresetPassword = (event) => {
    event.preventDefault();
    Swal.fire({
        title: "Reset your password",
        text: "To reset your password complete the blank with your registered email",
        input: "email",
        inputValidator: (value) => {
            if (!value) return "The email is required"
            if (!value.match(/\S+@\S+\.\S+/)) return "The input must be a valid email"
        },
        showCancelButton: true
    }).then(result => {
        email = result.value
        fetch('/api/sessions/startChangePassword', {
            method: 'POST',
            body: JSON.stringify({ email: email }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(result => {
            if (result.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: "E-mail sent",
                    text: "An E-mail has been sent to you to reset your password\n\tPlease check it!",
                })
            } else if (result.status === 404) {
                Swal.fire({
                    icon: 'error',
                    title: "Not found",
                    text: "There isn't any user registered with that e-mail",
                })
            }
        }).catch(error => {
            console.log(error)
        })
    })
};

start_reset_password_button.addEventListener('click', startresetPassword)