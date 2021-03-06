import {Container} from 'unstated'
import io from 'socket.io-client'


class SocketContainer extends Container {


    constructor(props){   
        super(props)
        this.state = {
  
            user: props,
            messages: [],
        }

        this.socket = io.connect('http://127.0.0.1:4000',{
            query: {
                user: props
            }
        })

        this.socket.on('connect',()=>{console.log("connected socket")})    
        
        this.addListeners()
    }
  
    id = 0

    addListeners = () => {

        this.socket.on('init',(messages)=>{
  
            this.setState({ messages: messages })
        })

        this.socket.on('add',(message)=>{
    
            this.setState({ messages: this.state.messages.concat(message) })
        })
        
        this.socket.on('addSub',(message)=>{
            
            let arr = this.state.messages
         
            for(let i in arr){
              if(arr[i].id === message.id){
                
                arr[i].submissions.push(message.submission)
                this.setState({ messages: arr })
              }
            }
        })
        
        this.socket.on('voteUpdate',(message)=>{
  
            const _message = this.state.messages.find(m=>m.id === message.id)
            const _submission = _message.submissions.find(s=>s.id === message._sub.id)

            _submission.votedBy = message._sub.votedBy

            _submission.votedByMe = false
            if(_submission.votedBy.includes(this.state.user)){
              _submission.votedByMe = true
            }

            this.setState({ ...this.state })
        })
    }

    create = (input) => {
      this.socket.emit('createName', input)
    }
  
    mutate = (input) => {
  
      this.socket.emit('mutate', {
        id: input.id,  
        content: input.content
      })
    }
  
    vote = ( message_id, sub ) => {

      if(sub.submittedBy !== this.state.user){
        
        this.socket.emit('vote',{
            id: message_id,
            _sub: sub.id,  
         })
      } else {
          //buzz
        console.log("can't vote on your own sub")
      }
    }

    disconnect = () => {
      this.socket.disconnect()
      console.log("socket disconnected")
    }
  }
  
  export default SocketContainer;