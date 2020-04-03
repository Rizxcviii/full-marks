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
            body: JSON.stringify(data),
            cache: "no-cache",
            headers: new Headers({
            "content-type": "application/json"
            })
        })
        //receive response from JSON being sent successfully/unsuccessfully
        //upon unsuccessful transmission, data contains an error object
        //error object contains error code, error message and error type
        .then(function(response){
            response.json().then(function(data){
                console.log(data);
            })
        });
    }
}

const networkController = new NetworkController();
Object.freeze(networkController); //freeze object to stop creation of new properties in instance