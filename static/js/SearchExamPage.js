let submit = document.getElementById('submit');
let searchBar = document.getElementById('searchBar');
let search = document.getElementById('search');
$('.response').hide();

async function searchForExam(){
    if(searchBar.value == ""){
        $('.response').hide();
        $('.response').html("<p>Please enter a module code/ID</p>");
        $('.response').fadeIn(300);
        return;
    }
    response = await networkController.sendDataToBackend({'searched':searchBar.value}, '/searchExam');
    if(response.message == 'exam does not exist'){
        $('.response').hide();
        $('.response').html("<p>"+response.message+"</p>");
        $('.response').fadeIn(300);
    }
};