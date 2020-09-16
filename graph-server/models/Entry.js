const mongoose = require('mongoose');
const { Schema } = mongoose;

const Submission = new Schema({
    submissionName: String,
    id: Number,
    submittedBy: String,
    votedBy: [ String ]
})

const Entry = new Schema({
    id: String,
    entryName: String,
    totalVotes: Number,
    submittedBy: String,
    submissions: [ Submission ]
})
  
module.exports = mongoose.model('Entry', Entry);
module.exports = mongoose.model('Submission', Submission);

// { name: "Thomas Jefferson", totalVotes: 4, _id: uuid(), submissions: [], submittedBy: "lutes" },