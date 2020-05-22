# Full marks

Online Examination application taking advantage of AWS S3 Rekognition for facial comparison and Firebase

## Pre-requisites
- Have Python3/pip3 installed
- Have Python Virtualenv installed

**NOTE: Python 3.3+ comes with the `venv` python module**

## Installation

To install, please follow the instructions below;

1. Clone the repo into a local repository
2. Create a new virtualenv by typoing

        virtualenv <name_of_virtual_env>

3. Enter your virtual environment using the following on Linux

        source <name_of_virtual_env>/bin/activate

    or the following on Windows Powershell

        .\<name_of_virtual_env>\bin\activate

    Your termianl/CMD prompt should now have `(<name_of_virtual_env>)` before the path. This ensures you are currently working in the virutal environment you have just created.
4. Now run

        pip install -r requirements.txt

    and it should add the dependencies, including the Flask MVC framework and Boto3, which is used for AWS

## Running the project

To run the project, all you need to do is run the following in the terminal that has the virutalenv open

    flask run

or

    python app.py

This will run the Flask server, for which a localhost port will be running the application

**NOTE: I have noticed that these commands tend to change in formatting, or you may need to run an entierly different command altogether. This obviously depends on your Operating System and the terminal with which you may be using (i.e. Whether you are using Powershell or the normal CMD)**

After that, the project should be running.

## Demo

If you want a demo towards how this application works, please request by asking myself, and I will gladly give you an examiner account so you can start creating exams. <br>
All users are currently global, so everyone can access everyones accounts, whether examiner or student. If the database gets too cluttered, I will wipe the database.