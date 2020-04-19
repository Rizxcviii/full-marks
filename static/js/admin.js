const addUserForm = document.getElementById('add-user');

addUserForm.addEventListener("submit", async e => {
    e.preventDefault();
    response = await networkController.sendDataToBackend(trimObjValues({
        email: document.getElementById('email'),
        password: document.getElementById('pword'),
        userRole: document.getElementById('role')
    }), '/admin');
    console.log(response);
    if (typeof response.error == 'undefined') {
        alert('user added successfully');
        networkController.redirect('admin');
    }else if(response.error.message == 'EMAIL_EXISTS'){
        alert('Email already exists');
    }else if(response.error.message == "WEAK_PASSWORD : Password should be at least 6 characters"){
        alert("Password should be at least 6 characters");
    }else{
        alert('Unknown error occurred, please contect full marks so we can rectify this issue');
    }
});

// if (!window.confirm('User Added Sucessfully.  Add Another User?')){
//     window.location = "{{url_for('admin')}}";
// }

//since data being sent are DOM objects, retrieve value from DOM and trim to remove unecessary whitespace
function trimObjValues(obj) {
    return Object.keys(obj).reduce((acc, curr) => {
    acc[curr] = obj[curr].value.trim()
    return acc;
    }, {});
  }