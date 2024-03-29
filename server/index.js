// Dependencies
const cors = require('cors');
require('dotenv').config()
const express = require('express');
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');

// Mongoose Models
require('./models/users');
require('./models/replies');
require('./models/comments');
require('./models/posts');
require('./models/conversations');
require('./models/messages');

// Services
require('./services/passport');
// require('./services/cache');

// Config
const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
require("./services/socketManager")(io);

// Setup
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

mongoose.connection.on('connected', () => {
    const gfs = Grid(mongoose.connection.db, mongoose.mongo);
    gfs.collection('photos');

    const upload = require('./services/gridfs')(MONGODB_URI);

    // Routes
    require('./routes/api/photos')(app, gfs);
    require('./routes/api/users')(app, upload, gfs);
    require('./routes/api/sessions')(app);
    require('./routes/api/posts')(app);
    require('./routes/api/conversations')(app);

    if (process.env.NODE_ENV === 'production') {
      app.use(express.static(__dirname + '/public/'));
    
      app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));
    }
})

// Middleware
app.use(express.json());
app.use(cors());

server.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});
