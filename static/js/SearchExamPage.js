let submit = document.getElementById('submit');
let searchBar = document.getElementById('searchBar');
let search = document.getElementById('search');
let exam;
$('.response').hide();
$('#submit').hide();

async function searchForExam(){
    if(searchBar.value == ""){
        $('.response').hide();
        $('.response').html("<p>Please enter a module code/ID</p>");
        $('.response').fadeIn(300);
        $('#submit').hide();
        return;
    }
    response = await networkController.sendDataToBackend({searched:searchBar.value,startExam:false}, '/searchExam');
    if(response.message == 'exam does not exist'){
        $('.response').hide();
        $('.response').html("<p>"+response.message+"</p>");
        $('.response').fadeIn(300);
        $('#submit').hide();
    }else{
        console.log(response);
        $('.response').hide();
        $('#submit').hide();
        if (response.loggedIn == true) {
            $('.response').html("<p>"+response.exam.markScheme.examName+" has been found. Please press submit to take the exam</p>");
        } else {
            $('.response').html("<p>"+response.exam.markScheme.examName+" has been found. However it seems you are not registered with full marks, so please enter your Student ID where stated</p>");
        }
        $('.response').fadeIn(300);
        $('#submit').fadeIn(300);
        exam = searchBar.value;
    }
};

async function startExam(){
    await networkController.sendDataToBackend({examCode:exam,startExam:true}, '/searchExam');
    networkController.redirect('tAndC');
}