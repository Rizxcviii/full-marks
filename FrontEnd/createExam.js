let form = document.getElementById('exam-form');
let submitBtn = document.getElementById('submit');
let addQuestionBtn = document.getElementById('add-question');
let submit = false;
let questionNumber = 1;

function addQuestion(){
    let questionBtn = createQuestionBtn();
    form.insertBefore(questionBtn, addQuestionBtn);

    let deleteQuestionBtn = createDeleteQuestion();
    form.insertBefore(deleteQuestionBtn, addQuestionBtn);

    let questionLineBreak = createLineBreak();
    form.insertBefore(questionLineBreak, addQuestionBtn);

    let labelMCQ = createLabel('MCQ', 'q'+questionNumber);
    form.insertBefore(labelMCQ, addQuestionBtn);
    let mcqRadio = makeMCQ();
    form.insertBefore(mcqRadio, addQuestionBtn);

    let labelOpenForm = createLabel('Open Form', 'q'+questionNumber);
    form.insertBefore(labelOpenForm, addQuestionBtn);
    let openFormRadio = makeOpenFormQuestion();
    form.insertBefore(openFormRadio, addQuestionBtn);

    let mcqLineBreak = createLineBreak();
    form.insertBefore(mcqLineBreak, addQuestionBtn);

    for(let i = 1; i <= 4; i++){
        let lineBreak = createLineBreak();
        let mcq = document.createElement('input')
        mcq.setAttribute('type', 'text');
        mcq.setAttribute('class', 'q'+questionNumber+' mcqAnswer');
        mcq.setAttribute('placeholder', 'Answer '+i);
        mcq.required = true;
        form.insertBefore(mcq, addQuestionBtn);
        form.insertBefore(lineBreak, addQuestionBtn);
    }

    questionNumber++;
    
    let lineBreak = createLineBreak();
    form.insertBefore(lineBreak, addQuestionBtn);
}

function createQuestionBtn(){
    let questionBtn = document.createElement('input');
    questionBtn.setAttribute('type', 'text');
    questionBtn.setAttribute('placeholder', 'Please enter your question');
    questionBtn.setAttribute('class', 'q'+questionNumber);
    questionBtn.required = true;
    return questionBtn;
}

function makeOpenFormQuestion(){
    let openFormRadio = document.createElement('input');
    openFormRadio.setAttribute('type', 'radio');
    openFormRadio.setAttribute('name', 'questionType');
    openFormRadio.setAttribute('class', 'q'+questionNumber);
    openFormRadio.onclick = function(e){
        showHideAnswers(document.getElementById(this.getAttribute('class')));
    };
    return openFormRadio;
}

function makeMCQ(){
    let mcqRadio = document.createElement('input');
    mcqRadio.setAttribute('type', 'radio');
    mcqRadio.setAttribute('name', 'questionType');
    mcqRadio.setAttribute('class', 'q'+questionNumber);
    mcqRadio.onclick = function(e){
        showHideAnswers(this);
    }
    mcqRadio.setAttribute('id','q'+questionNumber);
    return mcqRadio;
}

function createLabel(text, element){
    let label = document.createElement('label');
    label.setAttribute('for',element);
    label.setAttribute('class', 'q'+questionNumber);
    label.innerHTML = text;
    return label;
}

function showHideAnswers(radio){
    if (radio.checked == false) {
        $('.'+radio.getAttribute('class')+'.mcqAnswer').show();
    }else{
        $('.'+radio.getAttribute('class')+'.mcqAnswer').hide();
    }
}

function createDeleteQuestion(){
    let deleteQuestionBtn = document.createElement('button');
    deleteQuestionBtn.setAttribute('type', 'button');
    deleteQuestionBtn.setAttribute('class', 'q'+questionNumber);
    deleteQuestionBtn.innerHTML = 'Delete Question';
    deleteQuestionBtn.onclick = function(e){
        deleteQuestion(this);
    };
    return deleteQuestionBtn;
}

function createLineBreak(){
    let br = document.createElement('br');
    br.setAttribute('class', 'q'+questionNumber);
    return br;
}

function deleteQuestion(question){
    $('.'+question.getAttribute('class')).remove();
}