require('dotenv').config()
const http = require('http')
const express = require('express')
const cors = require('cors')
const { Server } = require('socket.io')
const pollRoutes = require('./routes/polls.routes')
const Poll = require('./models/polls.model')
const connectDB = require('./db')

connectDB()
const app = express()
const httpServer = http.createServer(app)

const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
})

app.use(express.json())
app.use(cors({origin: process.env.FRONTEND_URL || 'http://localhost:3000'}))

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
    
    // Probelm: This is a classic read-modify-write race. If two votes hit the server around the same time:
    // Request A reads the poll (votes = 5)
    // Request B reads the poll (votes = 5) — before A has saved
    // A increments to 6, saves → DB now shows 6
    // B increments to 6 (from its own stale copy), saves → DB now shows 6 again
    // One vote just vanished. Under load (many people voting on a live poll at once — which is exactly the scenario this app is built for), this will silently drop votes.

    // Solution: The fix: atomic increment, don't read-then-write
    // MongoDB has a built-in atomic $inc operator that increments directly in the database, with no read step at all:
    socket.on('submitVote', async({pollId, optionIndex}) => {
        try {
            const poll = await Poll.findByIdAndUpdate(
                pollId,
                {
                    $inc: {
                        [`options.${optionIndex}.votes`]: 1,
                        totalVotes: 1
                    }
                },
                { new: true }  // return the updated document
            );

            if (!poll) return;
            io.to(pollId).emit('pollUpdated', poll);
        } catch (err) {
            console.error("Vote error by socket", err);
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