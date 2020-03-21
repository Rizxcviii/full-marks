from flask import Flask, render_template, url_for, redirect, request, jsonify, make_response

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login')
def login():
    return render_template('login_register.html')

@app.route('/login/handleLoginData', methods=['POST'])
def handleLoginData():
    req = request.get_json()
    print(req)
    res = make_response(jsonify({"message": "JSON recieved"}), 200)
    return res

if __name__=="__main__":
    app.run(debug=True)