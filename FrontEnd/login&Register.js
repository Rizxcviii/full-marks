const form = document.getElementById("form");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const password2 = document.getElementById("password2");

form.addEventListener("submit", e => {
  // Whenever the user clicks login, all the text fields in the register page is validated.
  e.preventDefault();

  checkInputs();
});

function checkInputs() {
  // trim to remove the whitespaces
  const usernameValue = username.value.trim();
  const emailValue = email.value.trim();
  const passwordValue = password.value.trim();
  const password2Value = password2.value.trim();

  if (usernameValue === "") {
    setErrorFor(username, "Username cannot be blank");
  } else {
    setSuccessFor(username);
  }

  if (emailValue === "") {
    setErrorFor(email, "Email cannot be blank");
  } else if (!isEmail(emailValue)) {
    setErrorFor(email, "Not a valid email");
  } else {
    setSuccessFor(email);
  }

  if (passwordValue === "") {
    setErrorFor(password, "Password cannot be blank");
  } else {
    setSuccessFor(password);
  }

  if (password2Value === "") {
    setErrorFor(password2, "Password2 cannot be blank");
  } else if (passwordValue !== password2Value) {
    setErrorFor(password2, "Passwords does not match");
  } else {
    setSuccessFor(password2);
  }
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
