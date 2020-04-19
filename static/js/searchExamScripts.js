let submit = document.getElementById('submit');
let searchBar = document.getElementById('searchBar');
let search = document.getElementById('search');
let lblScripts = document.getElementById('lblScripts');
let scriptsSelect = document.getElementById('scripts');
let exam;
$('.response, #submit, #scripts, #lblScripts').hide();

async function searchForExam(){
    if(searchBar.value == ""){
        $('.response').hide();
        $('.response').html("<p>Please enter a module code/ID</p>");
        $('.response').fadeIn(300);
        $('#submit, #scripts, #lblScripts').hide();
        return;
    }
    response = await networkController.sendDataToBackend({searched:searchBar.value,startReview:false}, '/searchExamScripts');
    console.log(response);
    if(response.message == 'exam does not exist'){
        $('.response, #submit, #scripts, #lblScripts').hide();
        $('.response').html("<p>"+response.message+"</p>");
        $('.response').fadeIn(300);
    }else{

        $('.response, #submit, #scripts, #lblScripts').hide();
        $('#scripts').empty();
        $('.response').html("<p>"+response.exam.examName+" has been found. Please select the exam script for review and press submit</p>");
        const scripts = response.exam.scripts;
        scripts.forEach(script => {
            const option = document.createElement('option');
            if (typeof script == 'string') {
                option.setAttribute('value',script);
                option.innerHTML = script;
            }else{
                option.setAttribute('value',script.sid);
                option.innerHTML = script.sid;
            }
            scriptsSelect.appendChild(option);
        });
        $('.response, #submit, #scripts, #lblScripts').fadeIn(300);
        exam = searchBar.value;
    }
};

async function startReview(){
    if ($('#scripts').is(':visible') && $('#scripts').find(':selected').prop('disabled')) {
        $('.response').hide();
        $('.response').html("<p>Please select an exam script</p>");
        $('.response').fadeIn(300);
        return;
    }else{
        response = await networkController.sendDataToBackend({examCode:exam, script:scriptsSelect.value, startReview:true}, '/searchExamScripts');
    }
    networkController.redirect('ExaminerReview');
}