const express = require('express');
const db = require ('./data/db');
const server = express();


server.use(express.json());

server.get('/api/users', (req, res) => {
    db.find() 
    .then (users=>res.status(200).json(users))
    .catch (err => res.status(500).json({error:
            "The users information could not be retrieved."}));
    
});

server.get('/api/users/:id', (req, res) => {
    db.findById(req.params.id)
    .then(user => {
        console.log("user",user);
        if (user==undefined) {
            res.status(404).json({message:
                "The user with the specified ID does not exist."});
        } else {
            res.status(200).json(user)
        }
    })
    .catch(err => res.status(500).json({error:
            "The user information could not be retrieved."}));
});

server.post('/api/users', (req, res) => {
    const query = req.query;
    if(query.name == undefined || query.bio == undefined) {
        res.status(400).json({errorMessage:
                    "Please provide name and bio for the user."});
    } else {
        console.log("query",query);
        db.insert({name: query.name, bio: query.bio})
        .then(id => db.findById(id.id)
                        .then(user=>res.status(201).json(user))
        .catch(err=>res.status(500).json({error:
                    "There was an error while saving the user to the database"})));
    }
});

server.delete('/api/users/:id', (req,res) => {
    db.remove(req.params.id)
    .then(num => {
        if(num < 1) {
            res.status(404).json({message:
            "The user with the specified ID does not exist."
            });
        } else {
            res.status(200);
            res.end();
        }
    })
    .catch (err => res.status(500).json({error: "The user could not be removed."}));
});

server.put('/api/users/:id', (req, res) => {
    if(req.query.name == undefined || req.query.bio == undefined){
        res.status(400).json({erroMessage: "Please provide name and bio for the user."});
    } else {
        db.update(req.params.id, {name:req.query.name, bio:req.query.bio})
        .then(num => {
        if (num ==1){
            db.findById(req.params.id)
            .then (user => res.status(200).json(user));
        } else {
            res.status(404).json({message:"The user with the specified ID does not exist."});
        }
    
    })
    .catch (err => res.status(500).json({error:"The user information could not be modified."}));
}
})



module.exports = server 