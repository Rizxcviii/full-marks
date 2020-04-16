let form = document.getElementById('exam-form');
let submitBtn = document.getElementById('submit');
let addQuestionBtn = document.getElementById('add-question');
let questions = document.getElementById('questions');
let submit = false;
let questionNumber = 1;

function addQuestion(){
    //Each question has class 'q' + 'questionNumber', in case you wanna use css
    //buttons are on html form
    //everthing stored in forms

    let questionDiv = createDiv('question');
    questions.appendChild(questionDiv);

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
        let mcq = createMCQ(i);
        let answerRadio = createAnswerRadio(i);
        answerDiv.appendChild(mcq);
        answerDiv.appendChild(answerRadio);
        answerDiv.appendChild(lineBreak);
    }

    let lineBreak = createLineBreak();
    questionDiv.appendChild(lineBreak);
    questionNumber++;
}

//create an answer radio
function createAnswerRadio(answerNumber){
    let radio = document.createElement('input');
    radio.setAttribute('type', 'radio');
    radio.setAttribute('name', 'q'+questionNumber+'mcqRadio');
    radio.setAttribute('class', 'a'+answerNumber+' mcqRadio');
    radio.setAttribute('value', answerNumber);
    return radio;
}

//create an MCQ, param answerNum
function createMCQ(answerNum){
    let mcq = document.createElement('input');
    mcq.setAttribute('type', 'text');
    //each question has it's own class, 'mcqAnswer'
    //in case you wanna do css on this lot
    mcq.setAttribute('class', 'q'+questionNumber+' mcqAnswer a'+answerNum);
    mcq.setAttribute('placeholder', 'Answer '+answerNum);
    mcq.required = true;
    return mcq;
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
    questionTxt.setAttribute('class', 'q'+questionNumber+' questionGiven');
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
    if (radio.checked == true) {
        $('.'+radio.getAttribute('class')+'.mcqAnswers').show();
        $('.'+radio.getAttribute('class')+'.mcqAnswer').prop('required',true);
    }else{
        $('.'+radio.getAttribute('class')+'.mcqAnswers').hide();
        $('.'+radio.getAttribute('class')+'.mcqAnswer').removeAttr('required')
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
    console.log(question);
    $(question).remove();
}

form.addEventListener('submit', async e => {
    e.preventDefault();
    let markScheme = {
        examName: document.getElementById('examName').value,
        examCode: document.getElementById('examCode').value,
        questions: []
    };
    let nodeList = document.querySelector('#questions');
    nodeList = document.querySelectorAll('div.question');
    nodeList.forEach(
        function(currentValue){
            let question;
            let mcqAnswers = [];
            let answer;
            children = currentValue.childNodes;
            children.forEach(function(item){
                if (item.classList.contains('questionGiven')) {
                    question = item.value;
                }else if (item.classList.contains('mcqAnswers')) {
                    item.childNodes.forEach(
                        function(currentValue){
                            if (currentValue.classList.contains('mcqAnswer')) {
                                mcqAnswers.push(currentValue.value);
                            }else if (currentValue.classList.contains('mcqRadio') && (currentValue.checked)) {
                                answer = currentValue.value;
                            }
                        }
                    )
                }
            });
            markScheme.questions.push({
                question: question,
                mcqAnswers: mcqAnswers,
                answer: answer
            });
        }
    );
    response = await networkController.sendDataToBackend(markScheme,'/createExam');
    if(typeof response.error == 'undefined'){
        alert('Exam successfully uploaded!');
        networkController.redirect('createExam');
    }else{
        alert('Unknown error occurred, please inform your administrator');
    }
});

//since data being sent are DOM objects, retrieve value from DOM and trim to remove unecessary whitespace
function trimObjValues(obj) {
    return Object.keys(obj).reduce((acc, curr) => {
      acc[curr] = obj[curr].value.trim();
      return acc;
    }, {});
  }