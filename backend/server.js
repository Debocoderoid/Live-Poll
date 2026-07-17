require('dotenv').config()
const http = require('http')
const express = require('express')
const cors = require('cors')
const { Server } = require('socket.io')
const pollRoutes = require('./routes/polls.routes')
const connectDB = require('./db')

connectDB()
const app = express()
const httpServer = http.createServer(app)

const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
})

app.use(express.json())
app.use(cors({origin: 'http://localhost:3000'}))

// Poll Routes
app.use('/api/polls', pollRoutes)

app.get('/', (req, res) => {
    res.status(400).json({status: "Live Poll is running properly"})
})

io.on("connection", (socket)=> {
    console.log(`Frontend Connected: ${socket.id}`)
    
    // join a poll room
    socket.on('joinPoll', (pollId) => {
        socket.join(pollId)
        console.log(`Socket ${socket.id} joined Room: ${pollId}`)
    })

    //handle poll submission by socket
    socket.on('submitVote', async({pollId, optionsIndex}) => {
        try {   
            const poll = await Poll.findById(pollId)

            if(!poll) return;

            if(optionsIndex < 0 || optionsIndex > poll.options.length) {
                return;
            }

            poll.options[optionsIndex].votes++;
            poll.totalVotes++;

            await poll.save()

            // Broadcast
            io.to(pollId).emit['pollUpdated', poll]
        }   
        catch(err) {
            console.error("Vote error by socket")
        }
    })

    //exit poll room
    socket.on('disconnect', () => {
        console.log(`Client Disconnected: ${socket.id}`)
    })
})

const PORT = process.env.PORT
httpServer.listen(PORT, ()=> {
    console.log(`Server is running on PORT: ${PORT}`)
})