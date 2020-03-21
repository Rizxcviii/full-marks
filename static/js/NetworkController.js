class NetworkController{
    constructor(){
        if(!NetworkController.instance){
            NetworkController.instance = this;
        }else{
            console.log("object creation exists");
        }
        return NetworkController.instance;
    }

    sendDataToBeckend(data, dest){
        fetch(window.origin+dest, {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(data),
            cache: "no-cache",
            headers: new Headers({
            "content-type": "application/json"
            })
        });
    }
}

const networkController = new NetworkController();
Object.freeze(networkController);