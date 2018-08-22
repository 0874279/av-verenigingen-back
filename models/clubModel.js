var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var clubModel = new Schema ({
    team: {type: String, required: [true, 'Team is required']},
    club: {type: String, required: [true, 'Club is required']},
    level: {type: String, required: [true, 'Level is required']},
    district: {type: String, required: [true, 'District is required']}
},
    {
    collection: 'clubapi'
});

module.exports= mongoose.model('Club', clubModel);