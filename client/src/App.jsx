import './App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './components/home'
import Code from './components/code'

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/:shortCode' element={<Code />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
