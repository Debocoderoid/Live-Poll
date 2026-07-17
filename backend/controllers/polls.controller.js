const Poll = require('../models/polls.model')


/**
 * @name getAllPolls
 * @description Fetch all polls sorted by newest first.
 * @route GET /api/polls
 * @access Public
 */
async function getAllPolls(req, res) {
    try {
        const polls = await Poll.find().sort({ createdAt: -1 });
        res.status(200).json(polls)
    }
    catch(err) {
        res.status(500).json({
            message: "Server Error",
            error: err
        })
    }
}

/**
 * @name createPoll
 * @description Create a new poll with multiple options.
 * @route POST /api/polls
 * @access Public
 */
async function createPoll(req, res) {
    try {
        const { question, options } = req.body
        if(!question || !options) {
            return res.status(401).json({
                message: "Question and at least two options required"
            })
        }

        const formattedOptions = options.map((opt) => ({
            text: typeof opt === 'string' ? opt : opt.text,
            votes: 0,
        }))

        const poll = new Poll({question, options: formattedOptions})
        await poll.save();

        res.status(201).json(poll)
    }
    catch(err) {
        res.status(500).json({
            message: "Server Error",
            error: err.message
        })
    }
}

/**
 * @name getPollById
 * @description Retrieve a single poll by its ID.
 * @route GET /api/polls/:id
 * @access Public
 */
async function getPollById(req, res) {
    try {
        const poll = await Poll.findById(req.params.id)
        if(!poll) {
            return res.status(404).json({
                message: "Poll Not Found"
            })
        }

        res.status(200).json(poll)
    }
    catch(err) {
        res.status(500).json({
            message: "Server Error",
            error: err.message,
        })
    }
}

/**
 * @name submitVote
 * @description Submit a vote for a specific option in a poll.
 * @route POST /api/polls/:id/vote
 * @access Public
 */
async function submitVote(req, res) {
    try {
        const { optionsIndex } = req.body

        const poll = await Poll.findById(req.params.id)
        if(!poll) {
            return res.status(404).json({
                message: "Poll not found with id"
            })
        }

        if(optionsIndex < 0 || optionsIndex > poll.options.length) {
            return res.status(404).json({
                message: "Invalid options"
            })
        }

        poll.options[optionsIndex].votes++;
        poll.totalVotes++;

        await poll.save()
        res.json(poll)
    }
    catch(err) {
        res.status(500).json({
            message: "Server error",
            error: err.message
        })
    }
}


module.exports = {
    getAllPolls,
    createPoll,
    getPollById,
    submitVote
}