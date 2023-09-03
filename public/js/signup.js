//signup
const signup = async(name,email,password,confirmPassword)=>{
    console.log(name,email,password,confirmPassword)
    try{
        const res= await axios({
        method:'POST',
        url:"http://localhost:3000/users/signupp",
        data:{
            name:name,
            emailID:email,
            password:password,
            passwordConfirm:confirmPassword
        }
    })
    console.log(res)
    window.location.replace('/home');
    }catch(err){
        // console.log(err.response.data)
        alert('something went wrong')

    }
}

document.querySelector('.formed').addEventListener('submit',e=>{
e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    signup(name,email,password,confirmPassword);
})
