const express = require('express')
const router = express.Router()
const poll = require('../models/polls.model')
const { getAllPolls, createPoll, getPollById, submitVote } = require('../controllers/polls.controller')

// GET /api/polls -get all polls, new first
router.get('/', getAllPolls)

// POST /api/polls - create new poll
router.post('/', createPoll)

//GET /api/polls/:id - get a single poll
router.get('/:id', getPollById)

// POST /api/polls/:id/vote - submit vote
router.post('/:id/vote', submitVote)


module.exports = router