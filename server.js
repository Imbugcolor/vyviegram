require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const SocketServer = require('./socketServer')
const { ExpressPeerServer } = require('peer')
const path = require('path')

const app = express()

app.use(express.json())

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true, // Enable credentials support
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Specify allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
}));
  
// Define your routes
app.options('*', cors()); // Enable preflight requests for all routes
app.use(cookieParser())


app.get('/', (req, res) => {
    res.json({msg: 'Vyviegram Server (ExpressJS)'})
})

//Socket
const http = require('http').createServer(app)
const io = require('socket.io')(http, {
    cors: {
        origin: "*"
    }
})

io.on('connection', socket => {
    SocketServer(socket)
})

// Create peer server
ExpressPeerServer(http, { path: '/' })

//Routes
app.use('/api', require('./routes/authRouter'))
app.use('/api', require('./routes/userRouter'))
app.use('/api', require('./routes/postRouter'))
app.use('/api', require('./routes/commentRouter'))
app.use('/api', require('./routes/notifyRouter'))
app.use('/api', require('./routes/messageRouter'))
app.use('/api', require('./routes/reportRouter'))

// Connect MongoDB
const URI = process.env.MONGODB_URL
mongoose.connect(URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if(err) throw err;
    console.log('Connected to MongoDB.')
})

if(process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'))
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
    })
}

const port = process.env.PORT || 5000
http.listen(port, () => {
    console.log('Server is running on port', port)
})



