from flask import Flask, render_template, url_for, redirect, request, jsonify, make_response

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('ImageCapture.html')

@app.route('/login')
def login():
    return render_template('login_register.html')

@app.route('/login/handleRegistrationData', methods=['POST'])
def handleRegistrationData():
    req = request.get_json()
    print(req)
    res = make_response(jsonify({"message": "JSON recieved"}), 200)
    return res

@app.route('/login/handleLoginData', methods=['POST'])
def handlLoginData():
    req = request.get_json()
    print(req)
    res = make_response(jsonify({"message": "JSON recieved"}), 200)
    return res

@app.route('/ImageCapture')
def imageCapture():
    return render_template('ImageCapture.html')


if __name__=="__main__":
    app.run(debug=True)