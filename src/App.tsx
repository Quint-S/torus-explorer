import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { NavigationBar } from './components/NavigationBar.tsx'
import {Home} from './pages/Home'
import {Blocks} from './pages/Blocks'
import {Transfers} from './pages/Transfers'
import {Accounts} from './pages/Accounts'
import {Agents} from './pages/Agents'
import {Extrinsics} from './pages/Extrinsics'
import {Events} from './pages/Events'
import { AccountDetails } from './pages/AccountDetails'
import { StatusBar } from './components/StatusBar.tsx'
import {ExtrinsicDetails} from "./pages/ExtrinsicDetails.tsx";
import { HelmetProvider } from 'react-helmet-async';
import { BlockDetails } from './pages/BlockDetails.tsx'
import { useKeyboardNavigation } from './hooks/useKeyboardNavigation'
import {AgentDetails} from "./pages/AgentDetails.tsx";
import Background from "./components/Background.tsx";

const AppContent = () => {

  useKeyboardNavigation();
  return (
    <>
      <Background />
      <div className={'flex flex-col'} style={{
        width: '100vw', 
        height: '100vh', 
        padding: '10px', 
        paddingBottom: '40px',
        backgroundColor: 'rgba(0,0,0,30%)', 
        backgroundClip: 'content-box',
        position: 'relative',
        overflow: 'auto'
      }}>
        <StatusBar />
        <NavigationBar />
        <div style={{ flex: 1, overflow: 'auto' }}>
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
            <Route path="/block/:height" element={ <BlockDetails />} />
            <Route path="/agent/:id" element={ <AgentDetails />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

const App = () => {
  return (
    <HelmetProvider>
      <Router>
        <AppContent />
      </Router>
    </HelmetProvider>
  )
}

export default App