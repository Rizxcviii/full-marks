$(document).ready(function(){
	//Hide all questions
	$('.questionForm').hide();

	//Show first question
	$('#q1').show();

	$('.questionForm #next').click(function(){
		//Get data attributes
		current = $(this).parents('form:first').data('question');
		next = $(this).parents('form:first').data('question')+1;
		//Hide all questions
		$('.questionForm').hide();
		//Show next question
		$('#q'+next+'').fadeIn(300);
		process(''+current+'','next');
		return false;
	});

	$('.questionForm #prev').click(function(){
		current = $(this).parents('form:first').data('question');
		if (current == 1) {
			return false;
		}
		prev = $(this).parents('form:first').data('question')-1;
		//Hide all questions
		$('.questionForm').hide();
		//Show previous question
		$('#q'+prev+'').fadeIn(300);
		process(''+current+'','prev');
		return false;
	});
});

//Returns to start
function goToStart(){
	$('#completed').hide();
	$('#q1').fadeIn(300);
}

//Submit all form data to server
async function submit(){
	if(! await networkController.sendDataToBackend({answers: answerArr}, '/quiz')){
		console.log(error);
	}
}

//Process the answers
function process(n,nav){
	console.log(n);
	//Get input value
	let submitted = document.getElementById('textarea'+n);
	if (submitted) {
		answerArr[n] = submitted.value;
	}else{
		submitted = $('input[name=q'+n+']:checked').val();
		answerArr[n] = submitted;
	}
	// if it was the last question and the user selected 'next'
	if(n == total && nav == 'next'){
		$('#completed').hide();
		$('#completed').fadeIn(300).html(
			"<h3>You have now completed the exam. By pressing submit, your examiner will review the marks and you can review them afterwards.</h3><br/>"+
			"<button id='submit' onclick=submit() style=" + 'text-align:center' + ">submit</button>"+
			"<h3>Or you can return to the start of the exam to check/change your answers</h3>"+
			"<button id='goToStart' onclick=goToStart() style=" + 'text-align:center' + ">Review/Change Answers</button>"
		);
	}
	return false;
}

//Add event listener
window.addEventListener('load',init,false);
