import React, { useState, useEffect, useContext } from "react"
import ReactModal from "react-modal"
import Layout from "./layout"
import SocketContainer from "../containers/socketCont"
import { Provider, Subscribe } from "unstated"
import ModalDisplay from "./modalDisplay"
import SubmitDisplay from "./submitDisplay"
import Button from "../components/button"
import Header from "./Header"
import NameWrapper from "./NameWrapper"
import { UserContext } from "../contexts/user"

ReactModal.setAppElement('#___gatsby')

export default function Home() {
  
  const userContext = useContext(UserContext)
  
  console.log(userContext,"home")
  
  const [modalProps,setModalProps] = useState({type: false,open: false})
  const [isReady,setIsReady] = useState(false)
  const [isLoading,setIsLoading] = useState(true)
  const [container,setContainer] = useState({})


  useEffect(()=>{
    const text = new SocketContainer(userContext.user)
    
    setContainer(text)
    console.log(text, "text")
    setIsLoading(false)
    
  },[userContext.user])

  return (

    isLoading?<>LOADING...</>:
  
      <Provider> 
        <Subscribe to={[container]}>
          {todo=>(
            <>
            <Header user={userContext.user} setUser={userContext.setUser} socketLogout={todo.disconnect}></Header>
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
                  }}>
                  
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
                                  vote = {todo.vote}/>
                  :
                    <SubmitDisplay 
                        isReady = {isReady}
                        setIsReady = {setIsReady}
                        create = {todo.create}
                        modalProps = {modalProps}
                        setModalProps = {setModalProps}/>
                  }
                </ReactModal>
              :
                <>
                  <Button onClick={(e)=>{
                      setModalProps({
                        ...modalProps,
                        type: true,
                        open: true
                      })}}>Create One</Button>
                  <NameWrapper messages={todo.state.messages} modalCtrl={setModalProps} />
                
                </>
              }
            </Layout>
            </>
          )}  
        </Subscribe>
    </Provider>

  )
}