// const BaseUrl = `https://sugarcan-shop.onrender.com`
// const BaseUrl = `http://localhost:3000`

const BaseUrl = window.config.BaseUrl;


const login = async (loginPhoneNumber,loginPassword) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${BaseUrl}/user-login`,
      data:{
        phoneNumber:loginPhoneNumber,
        password:loginPassword
      }
    });
    if (res.data.status === 'success') {
      swal({
          text:"Logged in successfully!",
          icon: "success",
          button: "OK",
      }).then(() => {
          // const userId = res.data.data.user._id;
          window.setTimeout(() => {
            //location.assign('/home');
            window.location.href = `/dashboard`; 
          }, 1000);
      });
    }
  } catch (err) {
    swal({
      text:err.response.data.message,
      icon: "warning",
      button: "OK",
    }).then(() => {
      location.reload()
    });

  }
};


document.querySelector('.loginn-form').addEventListener('submit',e=>{
    e.preventDefault();
    const loginPhoneNumber = document.getElementById('loginPhoneNumber').value;
    const loginPassword = document.getElementById('loginPassword').value;
    login(loginPhoneNumber,loginPassword);
})


