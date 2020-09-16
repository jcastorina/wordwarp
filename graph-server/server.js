const express = require('express');
const cors = require('cors');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport'), LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const MongoStore = require('connect-mongo')(session);
const socket = require('socket.io')

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

const auth = require('./middleware/authMiddleware');

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

app.delete('/logout', auth.isAuth, (req, res) =>{
 
  req.logOut()
  res.send('logged out')
})

app.post('/submit', auth.isNotAuth, (req,res)=>{

  passport.authenticate('local',(err,user,info)=>{
    
    if(err){ return res.send("error processing login")}
    if(!user){ 
    
      if(info.message === "Missing credentials"){
        return res.send("Username can't be blank")
      }
      if(info.message === "Incorrect password"){
        return res.send("Password incorrect for: ")
      }
      if(info.message === "Incorrect username"){
   
        return res.send("no username")
      }
      return res.send("Error processing login")
    }

    req.logIn(user,()=>{
      res.cookie("test","icles")
      return res.send("logged in")
    })
    
  })(req,res)
})

app.get('/auth', (req,res)=>{
  let isAuthenticated = req.isAuthenticated()
  
    res.json({
      "status": isAuthenticated,
      "user": isAuthenticated ? req.user.username : null
    })
})

const io = socket(server)

io.on('connection', (socket)=>{

    let user = socket.handshake.query.user

    console.log('\n-----------------\n\n   ',socket.id,' connected *\n');

    Entry.find((err,res)=>{
      if(err){ return console.error(err) }
      
      socket.emit('init', res)
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
})

console.log('Running a WebSockets API server at http://localhost:4000');