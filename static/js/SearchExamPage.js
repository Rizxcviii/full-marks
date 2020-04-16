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
        $('.response').hide();
        $('#submit').hide();
        $('.response').html("<p>"+response.markScheme.examName+" has been found. Please press submit to take the exam</p>");
        $('.response').fadeIn(300);
        $('#submit').fadeIn(300);
        exam = searchBar.value;
    }
};

async function startExam(){
    await networkController.sendDataToBackend({examCode:exam,startExam:true}, '/searchExam');
    networkController.redirect('quiz');
}