import React, { useState, useEffect, useMemo } from "react"

import ReactModal from "react-modal"
import Layout from "./layout"

import SocketContainer from "../containers/socketCont"
import { Provider, Subscribe } from "unstated"
import Name from "./name"
import ModalDisplay from "./modalDisplay"
import SubmitDisplay from "./submitDisplay"

import "../styles/app.css"

import Test from "../pages/test"
import Button from "../components/button"

ReactModal.setAppElement('#___gatsby')



const nameStyle = {
  backgroundColor: 'hotpink',
  padding: '2em',
  width: '40em',
  '&:hover': {
    color: 'lightgreen',
    cursor: 'pointer'
  }
}

export default function Home(props) {

  const [modalProps,setModalProps] = useState({
    type: false,
    open: false
  })
  const [isReady,setIsReady] = useState(false)

  const [isLoading,setIsLoading] = useState(true)
  const [user,setUser] = useState({})

 // const user = useMemo(()=>new SocketContainer(props.user.name))

  useEffect(()=>{

    let text = new SocketContainer(props.user.name)

    setUser(text)
    
    setIsLoading(false)
  },[props.user.name])
  
  return (

    isLoading?<>LOADING...</>:
    <Test>
    
      <Provider>
       
        <Subscribe to={[user]}>

          {todo=>(
            
            <Layout>
              
              {modalProps.open?
            
                <ReactModal
                  isOpen={modalProps.open}
                  onRequestClose={()=>{
                      setModalProps({
                        ...modalProps,
                        open: false,
                        type: false
                      })
                      setIsReady(false)
                  }}
                >
                  
                  <button 
                    className="close"       
                    onClick={()=>{
                      setModalProps({
                        ...modalProps,
                        open: false
                      })
                  }}>X</button>

                  {!modalProps.type?
                    <ModalDisplay props={modalProps}
                                  isReady = {isReady}
                                  setIsReady = {setIsReady}
                                  mutate = {todo.mutate}
                                  vote = {todo.vote}
                                  
                            
                    />
                  :
                    <SubmitDisplay 
                        isReady = {isReady}
                        setIsReady = {setIsReady}
                        create = {todo.create}
                        modalProps = {modalProps}
                        setModalProps = {setModalProps}
                  
                    />
                  }
                </ReactModal>
              :
                <>
                  <Button 
                    onClick={(e)=>{

                      setModalProps({
                        ...modalProps,
                        type: true,
                        open: true
                      })
                      
                    }}
                  >Create One</Button>

                  {todo.state.messages.map(message=>{
                      return  <Name 
                                key={message.id} 
                                props={message}          
                                setModalProps={setModalProps}
                                style={nameStyle}
                              />
                    })
                  }
                </>
              }

            </Layout>
          )}  
        </Subscribe>
    </Provider>
    </Test>
  )
}