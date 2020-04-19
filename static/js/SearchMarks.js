async function startExam(){
    response = await networkController.sendDataToBackend({examCode:document.getElementById('scripts').value, startReview:true}, '/searchMarks');
    networkController.redirect('StudentReview');
}