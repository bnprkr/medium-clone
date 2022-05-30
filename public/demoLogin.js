const demoLoginButton = document.querySelector('.login-form-buttons>.demo-login');

demoLoginButton.addEventListener('click', async (event) => {
  
  const demoLogin = await fetch(`http://localhost:8080/demo-login`, {
    method: 'GET'
  });

  console.log(demoLogin);
});