const socket = io()

let user
let chatBox = document.getElementById("chatBox")
let chatForm = document.getElementById("chatForm")

Swal.fire({
    title: "Welcome to the chat",
    input: "email",
    text: "Add your email",
    inputValidator: (value)=>{
        if(!value) return "The email is required"
        if(!value.match(/\S+@\S+\.\S+/)) return "The input must be a valid email"
    },
    allowOutsideClick: false
}).then(result=>{
    user=result.value
    socket.emit('authorized', 1)
})

chatForm.addEventListener('submit',evt=>{
    evt.preventDefault()
    if(chatBox.value.trim().length>0){
        socket.emit("message",{user:user,message:chatBox.value})
        chatBox.value=""
    }
})

socket.on("messageLogs", data=>{
    let log = document.getElementById("messageLogs")
    let messages = ""
    data.forEach(message => {
        messages=messages+ `${message.user} dice: ${message.message} </br>`
    });
    log.innerHTML = messages
})