const express = require('express');


class Api{
    constructor(){
        this.app = express();
        this.port = 3000; 
    }
    
    init(client){
        this.client = client;
        this.app.use( function (req, res, next){
            res.setHeader('Access-Control-Allow-Origin', '*');
            next();
        });
        this.createRoutes();
        this.app.listen(this.port);
        console.log(`API Listening on port ${this.port}`);
    }
    
    
    
    createRoutes(){
        
        // ROOT
        this.app.get('/',  (req, res) => {   
            console.log("API request recieved");
            res.send('hello world');
        });

        // Get list of knows Exam servers
        this.app.get('/exams/',  (req, res) => {
            console.log("API request recieved");
            res.send(this.client.examServerList);
        });
        
    }
}


module.exports = new Api();


 
 
