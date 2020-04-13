let form = document.getElementById('exam-form');
let submitBtn = document.getElementById('submit');
let addQuestionBtn = document.getElementById('add-question');
let submit = false;
let questionNumber = 1;

function addQuestion(){
    //Each question has class 'q' + 'questionNumber', in case you wanna use css
    //buttons are on html form
    //everthing stored in forms

    let questionDiv = createDiv('');
    form.insertBefore(questionDiv, addQuestionBtn);

    //the question input text field
    let questionTxt = createQuestionTxt();
    questionDiv.appendChild(questionTxt);

    //delete question button to delete a question
    //delete button has it's own class called 'deleteBtn'
    //in case you wanna do css on each delete button
    let deleteQuestionBtn = createDeleteQuestion();
    questionDiv.appendChild(deleteQuestionBtn);

    //just a simple line break
    let questionLineBreak = createLineBreak();
    questionDiv.appendChild(questionLineBreak);

    //MCQ radio button
    let labelMCQ = createLabel('MCQ', 'q'+questionNumber);
    questionDiv.appendChild(labelMCQ);
    let mcqRadio = makeMCQ();
    questionDiv.appendChild(mcqRadio);

    //Open Form Question radio button
    let labelOpenForm = createLabel('Open Form', 'q'+questionNumber);
    questionDiv.appendChild(labelOpenForm);
    let openFormRadio = makeOpenFormQuestion();
    questionDiv.appendChild(openFormRadio);

    let mcqLineBreak = createLineBreak();
    questionDiv.appendChild(mcqLineBreak);

    //div for answers
    //in case you wanna do css on all mcq answers
    let answerDiv = createDiv('mcqAnswers');
    questionDiv.appendChild(answerDiv);

    //creates for answers, leaving at four possible answers
    //all text inputs
    for(let i = 1; i <= 4; i++){
        let lineBreak = createLineBreak();
        let mcq = document.createElement('input')
        mcq.setAttribute('type', 'text');
        //each question has it's own class, 'mcqAnswer'
        //in case you wanna do css on this lot
        mcq.setAttribute('class', 'q'+questionNumber+' mcqAnswer');
        mcq.setAttribute('placeholder', 'Answer '+i);
        mcq.required = true;
        answerDiv.appendChild(mcq);
        answerDiv.appendChild(lineBreak);
    }

    let lineBreak = createLineBreak();
    questionDiv.appendChild(lineBreak);
    questionNumber++;
}


//creates div
function createDiv(className){
    let div = document.createElement('div');
    div.setAttribute('class', 'q'+questionNumber+' '+className);
    return div;
}

//creates a question text input
function createQuestionTxt(){
    let questionTxt = document.createElement('input');
    questionTxt.setAttribute('type', 'text');
    questionTxt.setAttribute('placeholder', 'Please enter your question');
    questionTxt.setAttribute('class', 'q'+questionNumber);
    questionTxt.required = true;
    return questionTxt;
}

//creates open form radio button
function makeOpenFormQuestion(){
    let openFormRadio = document.createElement('input');
    openFormRadio.setAttribute('type', 'radio');
    openFormRadio.setAttribute('name', 'q'+questionNumber+'QuestionType');
    openFormRadio.setAttribute('class', 'q'+questionNumber);
    openFormRadio.onclick = function(e){
        showHideAnswers(document.getElementById(this.getAttribute('class')));
    };
    return openFormRadio;
}

//creates mcq radio button
function makeMCQ(){
    let mcqRadio = document.createElement('input');
    mcqRadio.setAttribute('type', 'radio');
    mcqRadio.setAttribute('name', 'q'+questionNumber+'QuestionType');
    mcqRadio.setAttribute('class', 'q'+questionNumber);
    mcqRadio.onclick = function(e){
        showHideAnswers(this);
    }
    mcqRadio.setAttribute('id','q'+questionNumber);
    return mcqRadio;
}

//creates label
function createLabel(text, element){
    let label = document.createElement('label');
    label.setAttribute('for',element);
    label.setAttribute('class', 'q'+questionNumber);
    label.innerHTML = text;
    return label;
}

//shows/hides based on mcqRadio button
function showHideAnswers(radio){
    if (radio.checked == false) {
        $('.'+radio.getAttribute('class')+'.mcqAnswer').show();
    }else{
        $('.'+radio.getAttribute('class')+'.mcqAnswer').hide();
    }
}

//creates delete question button
function createDeleteQuestion(){
    let deleteQuestionBtn = document.createElement('button');
    deleteQuestionBtn.setAttribute('type', 'button');
    deleteQuestionBtn.setAttribute('class', 'q'+questionNumber+' deleteBtn');
    deleteQuestionBtn.innerHTML = 'Delete Question';
    deleteQuestionBtn.onclick = function(e){
        deleteQuestion(this.parentNode);
    };
    return deleteQuestionBtn;
}

//create a line break
function createLineBreak(){
    let br = document.createElement('br');
    br.setAttribute('class', 'q'+questionNumber);
    return br;
}

//deletes the question using the classname
function deleteQuestion(question){
    $(question).remove();
}