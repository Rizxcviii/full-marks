$(document).ready(function(){
	//Hide all questions
	$('.questionForm').hide();

	//Show first question
	$('#q1').show();

	$('.questionForm #next').click(function(){
		//Get data attributes
		current = $(this).parents('form:first').data('question');
		next = $(this).parents('form:first').data('question')+1;
		marks = document.getElementById('marks'+current);
		if (marks.value <= marks.max) {
			//Hide all questions
			$('.questionForm').hide();
			//Show next question
			$('#q'+next+'').fadeIn(300);
			process(''+current+'','next');
		} else {
			alert('You have to set a range equal to or beneath ' + marks.max);
		}
		return false;
	});

	$('.questionForm #prev').click(function(){
		current = $(this).parents('form:first').data('question');
		if (current == 1) {
			return false;
		}
		prev = $(this).parents('form:first').data('question')-1;
		correct = document.getElementById('correct'+current);
		marks = document.getElementById('marks'+current);
		if (marks.value <= marks.max) {
			//Hide all questions
			$('.questionForm').hide();
			//Show previous question
			$('#q'+prev+'').fadeIn(300);
			process(''+current+'','prev');
		}else{
			alert('You have to set a range equal to or beneath ' + marks.max);
		}
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
	let feedback = document.getElementById('feedback');
	response =  await networkController.sendDataToBackend({
		marks: answerArr,
		feedback: feedback.value
	}, '/ExaminerReview/uploadResults')
	if(typeof response.error != 'undefined'){
		alert('Unknown error occurred, please inform your administrator');
	}
	networkController.redirect('login');
}

//Process the answers
function process(n,nav){
	//Get input value
	let submitted = document.getElementById('marks'+n);
	answerArr[n] = submitted.value;
	console.log(answerArr);
	// if it was the last question and the user selected 'next'
	if(n == total && nav == 'next'){
		$('#completed').hide();
		$('#completed').fadeIn(300).html(
			"<h3>You have now completed the review of the exam. By pressing submit, the student will now be able to review their results, IF they are registered with full marks. If not, then you/the institution will inform them yourselves.</h3><br/>"+
			"<h2>FEEDBACK</h2>"+
			"<textarea id='feedback' rows='10' cols='60' class='textarea'></textarea>"+
			"<button id='submit' onclick=submit() style=" + 'text-align:center' + ">submit</button>"+
			"<h3>Or you can return to the start of the review to check/change your marks given</h3>"+
			"<button id='goToStart' onclick=goToStart() style=" + 'text-align:center' + ">Review/Change Answers</button>"
		);
	}
	return false;
}

//Add event listener
window.addEventListener('load',init,false);