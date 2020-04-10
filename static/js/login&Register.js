const registerForm = document.getElementById("register-form");
const loginForm = document.getElementById("login-form");

registerForm.addEventListener("submit", async e => {
  //validation for registration
  e.preventDefault();
  let credentials = {
    username: document.getElementById("username"),
    email: document.getElementById("email"),
    password: document.getElementById("password"),
    password2: document.getElementById("password2"),
  };

  //if verfication is correct, send data to networkcontroller
  //if running 'sendingDataToBackend', use 'await' keywork and store in async method
  if (checkRegisterInputs(credentials)) {
    if (await networkController.sendDataToBackend(trimObjValues(credentials),'/login/handleRegistrationData')) {
      networkController.redirect('dashboard');
    } 
  }
});

loginForm.addEventListener("submit", async e => {
  //verification of login
  e.preventDefault();
  let credentials = {
    email: document.getElementById("email-login"),
    password: document.getElementById("password-login"),
  }

  //if verfication is correct, send data to networkcontroller
  if (checkLoginInputs(credentials)) {
    if (await networkController.sendDataToBackend(trimObjValues(credentials),'/login/handleLoginData')) {
      networkController.redirect('dashboard');
    }
  }
});

function checkRegisterInputs(credentials) {
  let success = true;

  if (credentials.username.value.trim() === "") {
    setErrorFor(credentials.username, "Username cannot be blank");
    success = false;
  } else {
    setSuccessFor(credentials.username);
  }

  if (credentials.email.value.trim() === "") {
    setErrorFor(credentials.email, "Email cannot be blank");
    success = false;
  } else if (!isEmail(credentials.email.value.trim())) {
    setErrorFor(credentials.email, "Not a valid email");
    success = false;
  } else {
    setSuccessFor(credentials.email);
  }

  if (credentials.password.value.trim() === "") {
    setErrorFor(credentials.password, "Password cannot be blank");
    success = false;
  } else {
    setSuccessFor(credentials.password);
  }

  if (credentials.password2.value.trim() === "") {
    setErrorFor(credentials.password2, "Password2 cannot be blank");
    success = false;
  } else if (credentials.password.value.trim() !== credentials.password2.value.trim()) {
    setErrorFor(credentials.password2, "Passwords does not match");
    success = false;
  } else {
    setSuccessFor(credentials.password2);
  }

  return success;
}

function checkLoginInputs(credentials){
  let success = true;

  if (credentials.email.value.trim() === "") {
    setErrorFor(credentials.email, "email cannot be blank");
    success = false;
  } else {
    setSuccessFor(credentials.email);
  }

  if (credentials.password.value.trim() === "") {
    setErrorFor(credentials.password, "Password cannot be blank");
    success = false;
  } else {
    setSuccessFor(credentials.password);
  }

  return success;
}

function setErrorFor(input, message) {
  // input is the id of the text field like email, username etc and the message is used to display correct or errror information depending on the user
  const formControl = input.parentElement; // formControl now stores the node name of input.
  const small = formControl.querySelector("small"); // const small stores first small element inside formControl. This small stores the error message.
  formControl.className = "form-control error"; // if the user inputs wrong value, the form control's(whole text field) classname is changes to error
  small.innerText = message; // the text which is tored inside <small></small> ie.(Error message) is the error message and would be displayed in the approriate wrong field.
}

function setSuccessFor(input) {
  const formControl = input.parentElement; //formControl now stores the node name of input.
  formControl.className = "form-control success"; // if the user inputs correct value, the form control's(whole text field) classname is changes to success
}

function isEmail(email) {
  // Javascript code to check if the user has entered @ inside email text field.
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  );
}

//since data being sent are DOM objects, retrieve value from DOM and trim to remove unecessary whitespace
function trimObjValues(obj) {
  return Object.keys(obj).reduce((acc, curr) => {
  acc[curr] = obj[curr].value.trim()
  return acc;
  }, {});
}