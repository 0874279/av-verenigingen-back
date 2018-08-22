var express = require('express');

var routes = function(Club){
    var clubRouter = express.Router();

    var clubController = require('../Controllers/clubController')(Club);
    clubRouter.route('/')
        .post(clubController.post)
        .get(clubController.get)
        .options(function (req, res) {
            res.header('Allow', 'GET, POST, OPTIONS');
            res.send(200);
        });


    clubRouter.use('/:clubID', function(req, res, next){
        Club.findById(req.params.clubID, function (err, club){
            if(err){
                res.status(400).send(err);
            }
            else if(club){
                req.club = club;
                next();
            }
            else{
                res.status(404).send('Geen team gevonden!')
            }
        });

    });

    clubRouter.route('/:clubID')
        .get(function(req,res){
            res.json(clubController.format(req.club, req));


            var returnClub = {};
            // view a specific team by ID
            returnClub.items = req.club.toJSON();
            
            returnClub._links = {};
        
            returnClub._links.self = {};
            returnClub._links.self.href = 'http://' + req.headers.host + '/api/clubs/' + returnClub.items._id;
            returnClub._links.collection = {};
            returnClub._links.collection.href = 'http://' + req.headers.host + '/api/clubs/';
        })

        // edit a specific team by ID
        .put(function(req,res) {
            req.club.team = req.body.team;
            req.club.club = req.body.club;
            req.club.level = req.body.level;
            req.club.district = req.body.district;
            req.club.save();
            req.club.save(function (err) {
                if (err) {
                    res.status(406).send(err);
                }
                else {
                    res.json(clubController.format(req.club, req));
                }
            });
        })


        // delete a specific team by ID
        .delete(function(req, res) {
            req.club.remove(function (err) {
                if (err) {
                    res.status(400).send(err);
                }
                else {
                    res.status(204).send('Removed');
                }
            })
        })
        .options(function (req, res) {
                    // res.header('Allow', 'GET, PATCH, PUT, DELETE, OPTIONS');
                    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
                    res.sendStatus(200);
                });

    return clubRouter;
};

module.exports = routes;