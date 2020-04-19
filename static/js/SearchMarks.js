let submit = document.getElementById('submit');
let searchBar = document.getElementById('searchBar');
let search = document.getElementById('search');
let sid = document.getElementById('sid');
let exam;
$('.response, #submit').hide();

async function searchForExam(){
    if(searchBar.value == ""){
        $('.response').hide();
        $('.response').html("<p>Please enter a module code/ID</p>");
        $('.response').fadeIn(300);
        $('#submit').hide();
        return;
    }
    response = await networkController.sendDataToBackend({searched:searchBar.value,startReview:false}, '/searchMarks');
    if(response.message == 'exam does not exist'){
        $('.response, #submit').hide();
        $('.response').html("<p>"+response.message+"</p>");
        $('.response').fadeIn(300);
    }else{
        console.log(response);
        $('.response, #submit').hide();
        $('.response').html("<p>"+searchBar.value+" has been found. Please press submit to review the exam</p>");
        $('.response, #submit').fadeIn(300);
        exam = searchBar.value;
    }
};

async function startExam(){
    response = await networkController.sendDataToBackend({examCode:exam, startReview:true}, '/searchMarks');
    networkController.redirect('StudentReview');
}