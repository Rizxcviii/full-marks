let submit = document.getElementById('submit');
let searchBar = document.getElementById('searchBar');
let search = document.getElementById('search');
let sid = document.getElementById('sid');
let exam;
$('.response, #submit, #sid').hide();
('#sid')

async function searchForExam(){
    if(searchBar.value == ""){
        $('.response').hide();
        $('.response').html("<p>Please enter a module code/ID</p>");
        $('.response').fadeIn(300);
        $('#submit, #sid').hide();
        return;
    }
    response = await networkController.sendDataToBackend({searched:searchBar.value,startExam:false}, '/searchExam');
    if(response.message == 'exam does not exist'){
        $('.response, #submit, #sid').hide();
        $('.response').html("<p>"+response.message+"</p>");
        $('.response').fadeIn(300);
    }else{
        console.log(response);
        $('.response, #submit, #sid').hide();
        if (response.loggedIn == true) {
            $('.response').html("<p>"+response.exam.examName+" has been found. Please press submit to take the exam</p>");
        } else {
            $('.response').html("<p>"+response.exam.examName+" has been found. However it seems you are not registered with full marks, so please enter your Student ID where stated and press submit</p>");
            $('#sid').fadeIn(300);
        }
        $('.response, #submit').fadeIn(300);
        exam = searchBar.value;
    }
};

async function startExam(){
    if ($('#sid').is(':visible') && $.trim($('#sid').val()).length == 0) {
        $('.response, #submit, #sid').hide();
        $('.response').html("<p>The student ID is empty, please enter your student ID</p>");
        $('.response').fadeIn(300);
        return;
    }else if ($('#sid').is(':visible')) {
        response = await networkController.sendDataToBackend({examCode:exam, sid:sid.value, startExam:true}, '/searchExam');
    }else{
        response = await networkController.sendDataToBackend({examCode:exam, startExam:true}, '/searchExam');
    }
    networkController.redirect('ImageCapture');
}