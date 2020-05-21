from flask import * # flask module that includes the flask requirements needed
import pyrebase # pyrebase is a module that interacts with the Firebase API to parse commands and queries to Firebase
import json # JSON module to perform translation to/from JSON, since we're dealing with JavaScript Objects also
import boto3, base64, os
from werkzeug.utils import secure_filename

# The config data structure that holds the Firebase configuration
config = {
    "apiKey": "AIzaSyANNhQ9l-Ptm0ICI4EWxsCW84q52xo_AeE",
    "authDomain": "full-marks-7f03b.firebaseapp.com",
    "databaseURL": "https://full-marks-7f03b.firebaseio.com",
    "projectId": "full-marks-7f03b",
    "storageBucket": "full-marks-7f03b.appspot.com",
    "messagingSenderId": "586975054480",
    "appId": "1:586975054480:web:dbf2bcf6d919940ca5e615",
    "measurementId": "G-30ZTMVX2HF"
}

UPLOAD_FOLDER = 'static/img'
ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])

# pyrebase includes buiilt in functions to work with the firebase API, so most of the heavy work is done for us.

# Initalising the firebase app to use services
firebase = pyrebase.initialize_app(config)

# Initialising the different cloud services within firebase
storage = firebase.storage() # Storage bucket for storing files other than normal text, such as images, videos, etc
db = firebase.database() # Real Time database for storing data. Real Time so firebase updates as you push data, no need to refresh database webpage if being viewed
auth = firebase.auth() # Authentication service, provides authentication for different users of the application, and also handling creating/logging in new users with email/password
app = Flask(__name__)
app.secret_key = 'a'
client = boto3.client('rekognition')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


'''
''@app.route'' is an app decorator used to manage the flow of website. Inside the arguments is the custom 'url' that you can create, with '/' being the index route. 
Call the arguments if you are calling from outside of the app.py file, such as within JavaScript, or when you are using the ''redirect'' function which directs to a
url. The url is now the arguments within the ''@app.route'' function. This is also known as the ''route'' of the webpage

The function below the route is the ''view'' of the webpage. It is the content that is going to be served. Flask uses view functions to control what is going to served
to the webpage, which is why all commands are wrapped in functions. The first view function below the route is the view function linked to that route, so you could
easily have 2 or more routes above the view function, one after the other, to link to that specific view function
'''

# The route that is loaded up when first coming to the website.
@app.route('/', methods=['GET'])
def home():
    if not session.get('logged in'):
        return redirect(url_for('login'))
    else:
        return redirect(url_for('dashboard'))

# login_register.html
@app.route('/login', methods=['POST', 'GET'])
def login():
    if session.get('logged in'):
        return redirect(url_for('home'))
    return render_template('login_register.html')

# You can parse over form data directly by including the 'methods' argument, followed by the form methods being used
# If you choose register within the above page, the below ''sub route'' will be called, handling that data passed.
@app.route('/login/handleRegistrationData', methods=['POST'])
def handleRegistrationData():
    req = request.get_json() # Since we know that data is being sent as JSON, we need to convert it to a data structure that python understands, which is dictionaries
    try:
        user = createUser(req['email'], req['password'], req['SID'], 'student', 'gs://full-marks-7f03b.appspot.com/2020-04-16-114031.jpg')
        logout()
    except Exception as e: # pyrebase unfortunately does not include error handling, but we can take advantage of the exception that is thrown and store the error object that Firebase throws back
        print(e)
        try:
            error = json.loads(str(e)[str(e).index(']')+2:]) # If the error is a Firebase error, it throws back a specfic 'JSON' object, so we need to translate it to JSON for JavaScript
        except Exception as e: # Else, it could be any other Error, so we need to capture it and handle it
            print(e)
            return make_response({"message": str(e)}, 500)
        return make_response(error, 511)
    return make_response({"success" : True}, 200)

# If you choose login within the login page, the below ''sub route'' will be called, handling that data passed. 
@app.route('/login/handleLoginData', methods=['POST'])
def handleLoginData():
    req = request.get_json()
    try:
        user = signIn(req['email'], req['password'])
    except Exception as e:
        print(e)
        try:
            error = json.loads(str(e)[str(e).index(']')+2:])
        except Exception as e: 
            print(e)
            return make_reponse({"message": str(e)}, 500)
        return make_response(error, 511)
    return make_response({"success" : True}, 200)

# ImageCapture.html
@app.route('/ImageCapture', methods=['POST', 'GET'])
def ImageCapture():
    if session.get('role') == "admin" or session.get('role') == "exmainer" :
        return redirect(url_for('home'))
    if request.method == 'POST':
        print("success")
    return render_template('ImageCapture.html')

@app.route('/compareImages', methods=['POST','GET'])
def compareImages():
    if request.method == 'POST':
        if 'webcam' not in request.files:
            print('No file found')
            return
        file = request.files['webcam']
        if file.filename == '':
            print('No selected file')
            return
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        source = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        print(source)
        target = os.path.normpath(app.root_path) + "/ComparisonImage.jpeg"
        print(target)

        imageSource = open(source, 'rb')
        imageTarget = open(target, 'rb')
        comparisonReponse = ""

        try:
            comparisonResponse = client.compare_faces(
                SimilarityThreshold=0,
                SourceImage={'Bytes':imageSource.read()}, 
                TargetImage={'Bytes':imageTarget.read()}
            )
        except Exception as e:
            print('comparison failure')
            return make_response({
            'similarity':0,
            'confidence':100
        })

        print(comparisonResponse)
        similarity = comparisonResponse['FaceMatches'][0]['Similarity']
        print(similarity)
        confidence = comparisonResponse['FaceMatches'][0]['Face']['Confidence']
        print(confidence)
        return make_response({
            'similarity':similarity,
            'confidence':confidence
        })

# admin.html
@app.route('/admin', methods=['POST','GET'])
def admin():
    if not session.get('logged in'):
        return redirect(url_for('login'))
    elif session.get('role') != 'admin':
        return redirect(url_for('dashboard'))
    elif request.method == 'POST':
        try:
            req = request.get_json()
            print(req)
            adminId = session.get('userId')
            user = createUser(req['email'], req['password'], req['userRole'], req['userRole'], 'gs://full-marks-7f03b.appspot.com/2020-04-16-114031.jpg')
            session['logged in'] = True
            session['userId'] = adminId
            session['role'] = 'admin'
        except Exception as e: # pyrebase unfortunately does not include error handling, but we can take advantage of the exception that is thrown and store the error object that Firebase throws back
            print(e)
            try:
                error = json.loads(str(e)[str(e).index(']')+2:]) # If the error is a Firebase error, it throws back a specfic 'JSON' object, so we need to translate it to JSON for JavaScript
            except Exception as e: # Else, it could be any other Error, so we need to capture it and handle it
                print(e)
                return make_response({"message": str(e)}, 500)
            return make_response(error, 511)
        return make_response({'success':True},200)
    return render_template('admin.html')

@app.route('/AdminDashboard')
def AdminDashboard():
    if not session.get('logged in') or session.get('role') != 'admin':
        return redirect(url_for('home'))
    return render_template('AdminDashboard.html')

@app.route('/dashboard', methods=['GET'])
def dashboard():
    if not session.get('logged in'):
        return redirect(url_for('home'))
    elif session.get('role') == "examiner":
        return redirect(url_for('examiner'))
    elif session.get('role') == "admin":
        return redirect(url_for('AdminDashboard'))
    elif session.get('role') == "student":
        return redirect(url_for('student'))
    else:
        return redirect(url_for('login'))

# ExaminerDashboard.html
@app.route('/examiner')
def examiner():
    if not session.get('logged in') or session.get('role') != "examiner":
        return redirect(url_for('dashboard'))
    else:
        return render_template('ExaminerDashboard.html')

# StudentDashboard.html
@app.route('/student', methods=['GET','POST'])
def student():
    if request.method == 'POST':
        if session.get('feedback'):
            session.pop('examCode', None)
            session.pop('feedback', None)
            session.pop('marks', None)
    if not session.get('logged in') or session.get('role') != "student":
        return redirect(url_for('dashboard'))
    else:
        return render_template('StudentDashboard.html')

# StudentReview.html
@app.route('/StudentReview', methods=['POST','GET'])
def StudentReview():
    if not session.get('logged in') or session.get('role') != "student":
        return redirect(url_for('dashboard'))
    else:
        return render_template('StudentReview.html.jinja', totalMarks=session.get('totalMarks'), feedback=session.get('feedback'), marks=session.get('marks'), examCode=session.get('examCode'))
    
# searchMarks.html
@app.route('/searchMarks', methods=['GET','POST'])
def searchMarks():
    if not session.get('logged in') or session.get('role') != "student":
        return redirect(url_for('home'))
    if request.method == 'POST':
        req = request.get_json()
        if req['startReview'] == True:
            route = db.child('users').child(session.get('userId')).child('examScripts').child(req['examCode']).get().val()
            print(route)
            session['examCode'] = req['examCode']
            session['feedback'] = route['marks']['feedback']
            session['marks'] = route['marks']['marks']
            session['totalMarks'] = route['totalMarks']
    exams = db.child('users').child(session.get('userId')).child('examScripts').shallow().get().val()
    print(exams)
    return render_template('SearchMarks.html.jinja', exams=exams)

# SearchExamPage.html
@app.route('/searchExam', methods=['GET', 'POST'])
def searchExam():
    if session.get('role') == "admin" or session.get('role') == "exmainer" :
        return redirect(url_for('home'))
    if request.method == 'POST':
        try:
            req = request.get_json()
            if req['startExam'] == True:
                quiz = db.child('exams').child(req['examCode']).get().val()
                session['examCode'] = req['examCode']
                session['examName'] = quiz['examName']
                session['questions'] = quiz['questions']
                if not session.get('logged in'):
                    session['sid'] = req['sid']
            else:
                exam = db.child('exams').child(req['searched']).get().val()
                if not exam:
                    return make_response({"message":"exam does not exist"}, 404)
                return make_response({'exam':exam, 'loggedIn':session.get('logged in')})
        except Exception as e: # pyrebase unfortunately does not include error handling, but we can take advantage of the exception that is thrown and store the error object that Firebase throws back
            print(e)
            try:
                error = json.loads(str(e)[str(e).index(']')+2:]) # If the error is a Firebase error, it throws back a specfic 'JSON' object, so we need to translate it to JSON for JavaScript
            except Exception as e: # Else, it could be any other Error, so we need to capture it and handle it
                print(e)
                return make_response({"message": str(e)}, 500)
            return make_response(error, 511)
        return make_response({"success" : True}, 200)
    return render_template('SearchExamPage.html')

# quiz.html
@app.route('/quiz', methods=['GET','POST'])
def quiz():
    if session.get('role') == "admin" or session.get('role') == "exmainer" :
        return redirect(url_for('home'))
    if request.method == 'POST':
        req = request.get_json()
        if session.get('logged in'):
            db.child('users').child(session.get('userId')).child('examScripts').child(session.get('examCode')).set({
                'answers':req['answers'],
                'totalMarks':req['totalMarks']
            })
            user = {
                'sid':db.child('users').child(session.get('userId')).child('UID').get().val(),
                'uid':session.get('userId')
            }
            addIDToScriptsArr(user)
        else:
            db.child('temp').child(session.get('sid')).child(session.get('examCode')).set({
                'answers':req['answers'],
                'totalMarks':req['totalMarks']
            })
            addIDToScriptsArr(session.get('sid'))
            session.pop('sid', None)
        session.pop('examCode', None)
        session.pop('examName', None)
        session.pop('questions', None)
        return make_response({'message':'finished exam'})
    return render_template('quiz.html.jinja', examCode=session.get('examCode'), examName=session.get('examName'), questions=session.get('questions'))

# exams.html
@app.route('/exams')
def exams():
    if session.get('role') != "student":
        return redirect(url_for('dashboard'))
    return render_template('exams.html')

# T&C.html
@app.route('/tAndC')
def tAndC():
    if session.get('examCode') == None:
        return redirect(url_for('dashboard'))
    return render_template('T&C.html')

# mockExam/html
@app.route('/mockExam')
def mockExam():
    if session.get('role') != "student":
        return redirect(url_for('dashboard'))
    return render_template('mockExam.html')

# searchExamScripts.html
@app.route('/searchExamScripts', methods=['POST','GET'])
def searchExamScripts():
    if not session.get('logged in') or session.get('role') != "examiner":
        return redirect(url_for('dashboard'))
    if request.method == 'POST':
        req = request.get_json()
        if req['startReview'] == True:
            session['examCode'] = req['examCode']
            scriptLocation = db.child('exams').child(session.get('examCode')).child('scripts').get().val()
            for script in scriptLocation:
                if 'sid' in script:
                    if script['sid'] == req['script']:
                        session['sid'] = script['uid']
                        return make_response({'success':True},200)
            session['sid'] = req['script']
        else:
            exam = db.child('exams').child(req['searched']).get().val()
            if not exam:
                return make_response({"message":"exam does not exist"}, 404)
            return make_response({'exam':exam},200)
        return make_response({'success':True},200)
    return render_template('searchExamScripts.html')

# ExaminerReview.html
@app.route('/ExaminerReview', methods=['POST','GET'])
def ExaminerReview():
    if not session.get('logged in') or session.get('role') != "examiner":
        return redirect(url_for('dashboard'))
    markScheme = db.child('exams').child(session.get('examCode')).child('questions').get().val()
    scriptLocation = db.child('temp').shallow().get().val()
    if session.get('sid') in scriptLocation:
        script = db.child('temp').child(session.get('sid')).child(session.get('examCode')).get().val()
    else:
        script = db.child('users').child(session.get('sid')).child('examScripts').child(session.get('examCode')).get().val()
    print(session.get('sid'))
    return render_template('ExaminerReview.html.jinja', sid=session.get('sid'), examCode=session.get('examCode'), questions=markScheme, script=script)

# ExaminerReview.html/uploadResults
@app.route('/ExaminerReview/uploadResults', methods=['POST','GET'])
def uploadResults():
    if request.method == 'POST':
        req = request.get_json()
        marks = req['marks']
        marks = marks[1:]
        marks = [ int(x) for x in marks]
        scriptLocation = db.child('exams').child(session.get('examCode')).child('scripts').get().val()
        for script in scriptLocation:
            if 'sid' in script:
                if script['uid'] == session.get('sid'):
                    db.child('users').child(session.get('sid')).child('examScripts').child(session['examCode']).child('marks').set({
                        'marks':marks,
                        'feedback':req['feedback']
                    })
                    return make_response({'message':'Results uploaded'},200)
        db.child('temp').child(session.get('sid')).child(session['examCode']).child('marks').set({
            'marks':marks,
            'feedback':req['feedback']
        })
        session.pop('sid', None)
        session.pop('examCode', None)
        return make_response({'message':'Results uploaded'},200)

# createExam.html
@app.route('/createExam', methods=['POST', 'GET'])
def createExam():
    if not session.get('logged in') or session.get('role') != "examiner":
        return redirect(url_for('dashboard'))
    if request.method == 'POST':
        try:
            req = request.get_json()
            db.child('exams').child(req['examCode']).set({
                'examName': req['examName']
            })
            questions = req['questions']
            i = 1
            for question in questions:
                db.child('exams').child(req['examCode']).child('questions').child('q'+str(i)).set({
                    'question' : question['question'],
                    'marks':question['marks']
                })
                if 'answer' in question.keys():
                    db.child('exams').child(req['examCode']).child('questions').child('q'+str(i)).child('answers').set({
                        'answer' : int(question['answer']),
                        'mcqAnswers' : question['mcqAnswers'],
                    })
                i+=1
        except Exception as e:
            print(e)
            try:
                error = json.loads(str(e)[str(e).index(']')+2:])
            except Exception as e:
                print(e)
                return make_response({'message': 'Unknown error has occurred'}, 500)
            return make_response(error, 500)
        return make_response({'success': True}, 200)
    return render_template('createExam.html')

# Helper method to create a student account
def createUser(email, password, uid, userRole, userImage):
    auth.create_user_with_email_and_password(email, password)
    user = signIn(email, password)
    db.child('users').child(user['userId']).set({
        'UID': uid,
        'userRole': userRole,
        'userImage': userImage
    })
    return user

# Helper method to sign in a student
def signIn(email, password):
    user = auth.sign_in_with_email_and_password(email, password)
    user = auth.refresh(user['refreshToken'])
    print(user['userId'])
    session['userId'] = db.child('users').child(user['userId']).get().key()
    session['role'] = db.child('users').child(user['userId']).child('userRole').get().val()
    session['logged in'] = True
    return user

# Helper method to add the ID to the Exam script under exam on Firebase
def addIDToScriptsArr(id):
    scripts = db.child('exams').child(session.get('examCode')).child('scripts').get().val()
    if scripts:
        if id in scripts:
            return
        scripts.append(id)
        db.child('exams').child(session.get('examCode')).child('scripts').set(scripts)
    else:
        scripts = [id]
        db.child('exams').child(session.get('examCode')).child('scripts').set(scripts)

# Run the application and start it in debugging mode to display errors
if __name__=="__main__":
    app.run(debug=True)

# Destroy current session
@app.route("/logout", methods=['GET'])
def logout():
    session['logged in'] = False
    session.pop('role', None)
    session.pop('userId', None)
    session.pop('sid', None)
    session.pop('examCode', None)
    session.pop('examName', None)
    session.pop('questions', None) 
    session.pop('feedback', None)
    session.pop('marks', None) 
    return redirect(url_for('home')) 

