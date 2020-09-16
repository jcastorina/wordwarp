import {Container} from 'unstated'
import io from 'socket.io-client'



class SocketContainer extends Container {


    constructor(props){
        console.log(props, 'const props')
        super(props)
     
        this.state = {
  
            user: props,
            messages: [],
  
        }
    }

    socket = io.connect('http://127.0.0.1:4000',{
        query: {
            user: props
        }
    })  
  
    id = 0
  
    listeners

    addListeners = () => {
        
    }

    getInitFetch = this.socket.on('init',(messages)=>{
  
      this.setState({ messages: messages })
    })
  
    getAddMessageListener = this.socket.on('add',(message)=>{
        console.log(message,"message")
      this.setState({ messages: this.state.messages.concat(message) })
    })
  
    getAddSubListener = this.socket.on('addSub',(message)=>{
    
      let arr = this.state.messages
   
      for(let i in arr){
        if(arr[i]._id === message._id){
          
          arr[i].submissions.push(message.submission)
          this.setState({ messages: arr })
        }
      }
    })
  
    getVoteUpdateLister = this.socket.on('voteUpdate',(message)=>{
  
      let arr = this.state.messages
  
      for(let i in arr){
        if(arr[i].id === message.id){
      
          for(let j in arr[i].submissions){
    
            if( arr[i].submissions[j].id === message._sub.id ){
  
              arr[i].submissions[j].votes = message._sub.votes
   
            }
          }
          this.setState({ messages: arr })
        }
      }
    })
  
    create = (input) => {
      this.socket.emit('createName',{
        name: input.name,
        user: input.user
      })
    }
  
    mutate = (input) => {
  
      this.socket.emit('mutate', {
        id: input.id,  
        content: input.content
      })
    }
  
    vote = ( message_id, sub_id, user ) => {
  
      this.socket.emit('vote',{
        id: message_id,
        _sub: sub_id,
        _user: user
      })
    }
  }
  
  export default SocketContainer;