import { useEffect, useState } from 'react';
import Login from './pages/Login';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';

function App() {
  const [route, setRoute] = useState('login'); // 'login' | 'landing' | 'dashboard'

  const [ports, setPorts] = useState([]);
  const [selectedPort, setSelectedPort] = useState('');
  const [live, setLive] = useState('0.000');
  const [stable, setStable] = useState('0.000');

  const loadPorts = async () => {
    try {
      if (window.api?.listPorts) {
        const list = await window.api.listPorts();
        setPorts(list || []);
        if (list && list.length && !selectedPort) setSelectedPort(list[0]);
      }
    } catch (e) {
      console.error('list ports error', e);
    }
  };

  useEffect(() => {
    loadPorts();

    if (window.api?.onLiveWeight) {
      window.api.onLiveWeight((w) => setLive(Number(w).toFixed(3)));
    }
    if (window.api?.onStableWeight) {
      window.api.onStableWeight((w) => setStable(Number(w).toFixed(3)));
    }
  }, []);

  const handleConnect = async () => {
    if (!selectedPort) return;
    try {
      await window.api.connectPort(selectedPort);
      setRoute('dashboard');
    } catch (e) {
      console.error('connect error', e);
    }
  };

  const handleDisconnect = async () => {
    try {
      await window.api.disconnectPort();
    } catch (e) {
      console.error('disconnect error', e);
    }
    setRoute('landing');
  };

  const onProceedFromLogin = () => setRoute('landing');

  return (
    <div style={{ width: 760, height: 520 }}>
      {route === 'login' && <Login onProceed={onProceedFromLogin} />}
      {route === 'landing' && <Landing ports={ports} selectedPort={selectedPort} onSelectPort={setSelectedPort} onConnect={handleConnect} onRefresh={loadPorts} />}
      {route === 'dashboard' && <Dashboard live={live} stable={stable} onDisconnect={handleDisconnect} />}
    </div>
  );
}

export default App;
