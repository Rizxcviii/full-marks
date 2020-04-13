const addUserForm = document.getElementById('add-user');

addUserForm.addEventListener("submit", async e => {
    e.preventDefault();
    if( await networkController.sendDataToBackend(trimObjValues({
        email: document.getElementById('email'),
        password: document.getElementById('pword'),
        userRole: document.getElementById('role')
    }), '/admin') == false){
        console.log('error');
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