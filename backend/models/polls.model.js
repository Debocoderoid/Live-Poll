const mongoose = require('mongoose')

const optionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    votes: {
        type: Number,
        default: 0,
    }
})

const pollSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    options: {
        type: [optionSchema],
        required: true,
        validate: {
            validator: (v) => v.length >= 2 && v.length <= 5,
            message: "A Poll must contain between 2 to 5 options"
        }
    },
    totalVotes: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

const Poll = mongoose.model('Poll', pollSchema)

module.exports = Poll