const form = document.getElementById('loginForm')

form.addEventListener('submit', e =>{
    e.preventDefault()

    const data = new FormData(form)
    const obj = {}
    data.forEach((value,key)=>obj[key]=value)
    
    fetch('/api/sessions/login',{
        method:'POST',
        body:JSON.stringify(obj),
        headers:{
            'Content-Type':'application/json'
        }
    }).then(result=>{
        if(result.status===200){
            window.location.replace('/products')
        }else if(result.status === 400) {
            let errorP = document.getElementById("error")
            errorP.innerHTML = 'User or password incorrect'
        }
    }).catch(error => {
        return done(error)
    })  
    
})