import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Sidebar } from './components/Sidebar'
import {Home} from './pages/Home'
import {Blocks} from './pages/Blocks'
import {Transfers} from './pages/Transfers'
import {Accounts} from './pages/Accounts'
import {Agents} from './pages/Agents'
import {Extrinsics} from './pages/Extrinsics'
import {Events} from './pages/Events'
import ThreeJsTorus from './components/ThreeJsTorus'
import { AccountDetails } from './pages/AccountDetails'
import { I3StatusBar } from './components/I3StatusBar'
import {ExtrinsicDetails} from "./pages/ExtrinsicDetails.tsx";

const App = () => {
  return (
    <Router>
      <ThreeJsTorus />
      <div style={{ 
        display: 'flex', 
        width: '100vw', 
        height: '100vh', 
        padding: '10px', 
        paddingBottom: '40px',
        backgroundColor: 'rgba(0,0,0,30%)', 
        backgroundClip: 'content-box',
        position: 'relative',
        overflow: 'auto'
      }}>
      <I3StatusBar />
        <Sidebar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blocks" element={<Blocks />} />
          <Route path="/transfers" element={<Transfers />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/extrinsics" element={<Extrinsics />} />
          <Route path="/events" element={<Events />} />
          <Route path="/account/:address" element={ <AccountDetails />} />
          <Route path="/extrinsic/:id" element={ <ExtrinsicDetails />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App