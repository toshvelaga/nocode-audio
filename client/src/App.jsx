import CustomizePlayer from './pages/CustomizePlayer/CustomizePlayer'
import EmbeddablePlayer from './pages/EmbeddablePlayer/EmbeddablePlayer'
import NotFound from './pages/NotFound/NotFound'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<CustomizePlayer />} />
        <Route path='/embed/:id' element={<EmbeddablePlayer />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
