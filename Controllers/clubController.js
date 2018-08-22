var clubController = function(Club){
    // post a new team
        var post = function (req, res) {
            var club = new Club(req.body);
            club.save(function (err) {
                if (err) {
                    res.status(406).send(err);
                }
                else {
                    res.status(201).send(this.format(club, req));
                }
            });
        };



    // view all teams
    var get = function(req,res){
        var query = {};

        // filter by team
        if(req.query.team){
            query.team = req.query.team;
        }
        // filter by club
        else if (req.query.club){
            query.club = req.query.club;
        }
        // filter by level
        else if (req.query.level){
            query.level = req.query.level;
        }
        // filter by district
        else if (req.query.district){
            query.district = req.query.district;
        }
        Club.find(query, function (err, clubs){
            if(err){
                res.status(500).send(err);
            }
            else{

                var returnClubs = [];

                clubs.forEach(function(element, index, array){
                    var newClub = element.toJSON();
                    newClub._links= {};
                    newClub._links.self = {};
                    newClub._links.self.href = 'http://' + req.headers.host + '/api/clubs/' + newClub._id;
                    newClub._links.collection = {};
                    newClub._links.collection.href =  'http://' + req.headers.host + '/api/clubs/';
                    returnClubs.push(this.format(element, req));
                });

                res.json(
                    returnClubs,
                    // _links: {
                    //     self: {
                    //         href: 'http://' + req.headers.host + '/api/clubs'
                    //     }
                    // },
                    // pagination: {
                    //     self: {
                    //         href: 'http://' + req.headers.host + '/api/clubs'
                    //     }
                    // }
                )
            }
        });
    };
    this.format = function (club, req) {
        var newClub = club.toJSON();
        var baseLink = 'http://' + req.headers.host + '/api/clubs/';
        newClub._links = {
            self: { href: baseLink + newClub._id},
            collection: { href: baseLink}
        };
        return newClub;
    };

    return {
        post: post,
        get: get,
        format: this.format
    }
};

module.exports = clubController;