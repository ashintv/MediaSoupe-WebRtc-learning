
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { Sender } from './components/sender'
import { Receiver } from './components/receiver'

function App() {
  

  return (
    <>
        <BrowserRouter>
          <Routes>
            <Route path='/sender' element={<Sender/>} />
            <Route path='/reciever' element={<Receiver/>} />
          </Routes>
        </BrowserRouter>
     </>
  )
}

export default App
