const express = require('express');
const passport = require('./security/passport.js');
const PORT = require('./config/constants').PORT;
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const oauth2Route = require('./routes/oauth2.js');
const websock = require('./websocket/websocket.js');
const session = require('express-session');

dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

const whitelist = ['http://localhost:8100',];
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

app.use(cors(corsOptions));

app.use(session({
    secret: 'thesessionsecret',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

websock();

app.use('/googleoauth2', oauth2Route);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});

