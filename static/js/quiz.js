var score = 0; //Set score to 0
var total = 10; //Total number of questions
var point = 1; //Points per correct answer
var highest = total * point;

//Initializer
function init(){
	//set correct answers
	sessionStorage.setItem('a1','a');
	sessionStorage.setItem('a2','c');
	sessionStorage.setItem('a3','a');
	sessionStorage.setItem('a4','d');
	sessionStorage.setItem('a5',"b");
	sessionStorage.setItem('a6','c');
	sessionStorage.setItem('a7','d');
	sessionStorage.setItem('a8','b');
	sessionStorage.setItem('a9','b');
	sessionStorage.setItem('a10',"a");
}

$(document).ready(function(){
	//Hide all questions
	$('.questionForm').hide();

	//Show first question
	$('#q1').show();

	$('.questionForm #submit').click(function(){
		//Get data attributes
		current = $(this).parents('form:first').data('question');
		next = $(this).parents('form:first').data('question')+1;
		//Hide all questions
		$('.questionForm').hide();
		//Show next question
		$('#q'+next+'').fadeIn(300);
		process(''+current+'');
		return false;
	});
});

//Process the answers
function process(n){
	//Get input value
	var submitted = $('input[name=q'+n+']:checked').val();
	if(submitted == sessionStorage.getItem('a'+n+'')){
			score = score + point;
	}

	if(n == total){
		$('#results').html('<h3>Your final score is: '+score+' out of '+highest+'</h3><a href="index.html">Take Quiz Again</a>');
		if(score == highest){
			$('#results').append('<p>You have got them correct!');
		} else if(score == highest - point || score == highest - point - point){
			$('#results').append('<p>Good Job!');
		}
	}
	return false;
}

//Add event listener
window.addEventListener('load',init,false);
