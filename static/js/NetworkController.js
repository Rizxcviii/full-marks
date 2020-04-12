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
    //also uses async/await so therefore calls to this must also be an async method
    //async means to handle data asynchronously
    //lines of code are therefore performed one after another
    //otherwise, e.g. lines 30 may perform first then line 21 after
    //since JavaScript is single-threaded and can't handle threads simultaneously
    async sendDataToBackend(data, dest){
        try{
            const response = await fetch(window.origin+dest, {
                method: "POST",
                credentials: "include",
                body: JSON.stringify(data),
                cache: "no-cache",
                headers: new Headers({
                "content-type": "application/json"
                })
            });
            
            const json = await response.json();
            console.log(json);
            return(typeof json.error == 'undefined');
        }catch(err){
            // console.log(err);
            return false;
        }
    }

    //redirect to route of 'reoute' variable
    redirect(route){
        window.location = window.origin + "/" + route;
    }
}

const networkController = new NetworkController();
Object.freeze(networkController); //freeze object to stop creation of new properties in instance