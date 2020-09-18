const express = require('express');
const cors = require('cors');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport'), LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const MongoStore = require('connect-mongo')(session);
const socket = require('socket.io')
const auth = require('./middleware/authMiddleware');

const uuid = require('uuid').v4;

const cookieParser = require('cookie-parser');

var app = express();
app.use(cors({credentials: true, origin: 'http://127.0.0.1:8000'}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const mongoDB = 'mongodb+srv://jcastorina:dbUserPassword@userdata-echiv.mongodb.net/users?retryWrites=true&w=majority';
const connection = mongoose.createConnection(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

require('./models/User');
require('./models/Entry');

require('./middleware/passport-config');

const Users = mongoose.model('Users');
const Entry = mongoose.model('Entry');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  Users.findById(id, function(err, user) {
    done(err, user);
  });
});

const sessionStore = new MongoStore({ 
  mongooseConnection: connection,
  collection: 'sessions'
});

app.use(session({ 
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: false,
  store: sessionStore,
  cookie: { 
      expires: Date.now() + 1000
  },
}));

app.use(passport.initialize());
app.use(passport.session());

const server = app.listen(4000);
const io = socket(server)

app.post('/register', auth.isNotAuth, (req, res, next) => {

  const { body } = req;
  const finalUser = new Users(body);

  finalUser.setPassword(body.password);
  return finalUser.save((err,user)=>{
      if (err) { return err }
      req.logIn(user, loginErr => {
          if(loginErr) { return loginErr} 
          res.send('got em')
      })
  })
});

app.post('/login', auth.isNotAuth, (req,res)=>{
  passport.authenticate('local',(err,user)=>{   
    if(err){ return res.sendStatus(400) }
    if(!user){ 
      return res.sendStatus(401)
    }
    req.logIn(user,()=>{
      res.cookie("test","icles")
      return res.sendStatus(200)
    })
  })(req,res)
})

app.get('/auth', (req,res)=>{
  let isAuthenticated = req.isAuthenticated()
  if(isAuthenticated){
    res.sendStatus(200)
  } else {
    res.sendStatus(401)
  }
})

app.delete('/logout', auth.isAuth, (req, res) =>{

  req.logOut()
  res.send('logged out')
})

io.on('connection', (socket)=>{

    const user = socket.handshake.query.user

    //socket.disconnect()
    console.log('\n-----------------\n\n   ',user,' connected with ID ',socket.id,'*\n');

    Entry.find((err,entries)=>{
      if(err){ return console.error(err) }
      entries?entries.forEach(entry=>{
        entry.submissions.forEach(s=>{
          s.votedBy.some(e=>{
            e===user?s.votedByMe=true:null
          })
        })
      }):null
    
      socket.emit('init', entries)
    })

    socket.on('mutate',(mutation)=>{

      Entry.findOne({ id: mutation.id },(err,entry)=>{
        
        let subObj = {
          id: entry.submissions.length,
          submissionName: mutation.content,
          votes: 0,
          submittedBy: user,
          votedBy: []
        }

        entry.submissions.push(subObj)

        return entry.save((err,result)=>{
          if(err){ return console.error(err) }

          io.sockets.emit('addSub',{
            id: entry.id,
            submission: subObj
          })
        })
      })
    })

    socket.on('vote',(vote)=>{

      Entry.findOne({ id: vote.id },(err,entry)=>{
        if(err){ return console.error(err) }     
        const submission = entry.submissions.find(s=>s.id === vote._sub)

        if(!submission){ return console.error("bad request") }
        if(submission.submittedBy === user){
          return console.log("can't vote for your own joke, PAL")
        }

        if(submission.votedBy.includes(user)){
          submission.votedBy = submission.votedBy.filter(name=> name !== user )
        } else {
          submission.votedBy.push(user)
        }
          
        return entry.save((err,result)=>{
          if(err){ return console.error(err) }
       
          io.sockets.emit('voteUpdate',{
            id: vote.id,
            _sub: submission
          })
        })
      })  
    })

    socket.on('createName',(name)=>{

      let entryObj = {
        id: uuid(),
        entryName: name,
        totalVotes: 0,
        submittedBy: user,
        submissions: []
      }

      let _entryObj = new Entry(entryObj)

      return _entryObj.save((err,entry)=>{
    
        io.sockets.emit('add', entryObj )
      }) 
    })

    socket.on('disconnect',()=>{
      console.log(user+" disconnected (coward)")
    })
})

console.log('Running a WebSockets API server at http://localhost:4000');