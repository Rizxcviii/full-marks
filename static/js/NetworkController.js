/*
class implements singleton by; 
    only allowing one instance of a NetowrkController class being created at one time on a single webpage
*/
class NetworkController{
    constructor(){
        if(!NetworkController.instance){
            NetworkController.instance = this;
        }else{
            console.log("object creation exists");
        }
        return NetworkController.instance;
    }

    //use of fetch API to send data as JSON back to flask
    sendDataToBeckend(data, dest){
        fetch(window.origin+dest, {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(this.trimObjValues(data)),
            cache: "no-cache",
            headers: new Headers({
            "content-type": "application/json"
            })
        })
        //receive response from JSON being sent successfully/unsuccessfully
        .then(function(response){
            //if unsuccessfull, error code is recieved and outtputed to console
            if (response.status != 200) {
                console.log('Response status was not 200'+response.status);
                return;
            }
            //else, ouput to console that JSON was recieved successfully
            response.json().then(function(data){
                console.log(data);
            })
        });
    }

    //since data being sent are DOM objects, retrieve value from DOM and trim to remove unecessary whitespace
    trimObjValues(obj) {
        return Object.keys(obj).reduce((acc, curr) => {
        acc[curr] = obj[curr].value.trim()
        return acc;
        }, {});
    }
}

const networkController = new NetworkController();
Object.freeze(networkController); //freeze object to stop creation of new properties in instance