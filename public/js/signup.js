//signup

// const BaseUrl = `https://sugarcan-shop.onrender.com`
const BaseUrl = `http://localhost:3000`




const signup = async(name,phoneNumber,password,confirmPassword)=>{
    console.log(name,phoneNumber,password,confirmPassword)
    try{
        const res= await axios({
        method:'POST',
        url:`${BaseUrl}/user-signup`,
        data:{
            name:name,
            phoneNumber:phoneNumber,       
            password:password,
            passwordConfirm:confirmPassword
        }
    })
    if (res.data.status === 'success') {
      swal({
        text: "Signup successfully..!",
        icon: "success",
        button: "OK",
      }).then(() => {
        window.location.replace('/dashboard');
      });
    }
    }catch(err){
        swal({
            text:err.response.data.message,
            icon: "warning",
            button: "OK",
        })
    }
}

document.querySelector('.signup-form').addEventListener('submit',e=>{
    e.preventDefault();
    const name = document.getElementById('name').value;
    const signupPhoneNumber = document.getElementById('signupPhoneNumber').value;
    const signupPassword = document.getElementById('signupPassword').value;
    const signupConfirmPassword = document.getElementById('signupConfirmPassword').value;
    signup(name,signupPhoneNumber,signupPassword,signupConfirmPassword);
})
