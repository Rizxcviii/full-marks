let submit = document.getElementById('submit');
let search = document.getElementById('search');

search.addEventListener('submit', async e => {
    response = await networkController.sendDataToBackend({'searched':search.value});
    console.log(response);
});