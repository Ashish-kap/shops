const login = async(email,password)=>{
    try{
        // const token = localStorage.getItem('token'); // Retrieve token from local storage
        // axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Add Authorization header
        await axios({
        method:'POST',
        // url:"http://localhost:3000/users/login",
        url:"https://feedback-cloudrun-dev001-36kbmsu6la-el.a.run.app/users/login",
        data:{
            email:email,
            password:password
        }
    })
    window.location.replace('/home');
    }catch(err){
        alert('Incorrect email or password')
        // alert(err.response.data)
    }
}

document.querySelector('.form').addEventListener('submit',e=>{
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email,password);
})



// const logoutButton = document.querySelector("#logoutButton");
// logoutButton.addEventListener("click", function() {
//   axios("/logout", {
//     method: "GET",
//     credentials: "same-origin"
//   })
//   .then(response => {
//     if (response.ok) {
//       return response.json();
//     } else {
//       throw new Error("Network response was not ok.");
//     }
//   })
//   .then(data => {
//     if (data.redirect) {
//       window.history.pushState(null, null, data.redirect);
//       window.location.reload();
//     }
//   })
//   .catch(error => {
//     console.error("Error:", error);
//   });
// });


// document.querySelector('.form').addEventListener('submit',e=>{
//     e.preventDefault();
//     const logout = document.getElementById('logoutButton');
//     login(logout);
// })





