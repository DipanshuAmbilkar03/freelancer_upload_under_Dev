const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
        unique : true,
    },
    profileImg : {
        type : String,
        default : "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    }
    },{timestamps : true});

module.exports = mongoose.model("Profile",profileSchema);