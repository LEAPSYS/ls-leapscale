import { useEffect, useState } from 'react';
import Login from './pages/Login';
import Location from './pages/Location';
import WorkOrders from './pages/WorkOrders';
import Connect from './pages/Connect';
import Dashboard from './pages/Dashboard';
import Activation from './pages/Activation';

export default function App() {
  const [route, setRoute] = useState('activate'); // 'login' | 'location' | 'workorders' | 'connect' | 'dashboard'
  const [ports, setPorts] = useState([]);
  const [selectedPort, setSelectedPort] = useState('');
  const [location, setLocation] = useState(null);
  const [workOrder, setWorkOrder] = useState(null);
  const [live, setLive] = useState('0.000');
  const [stable, setStable] = useState('0.000');
  const [portStatus, setPortStatus] = useState('disconnected');
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [mangingStatus, setMangingStatus] = useState(null);

  const saveData = async () => {
    const result = await window.api.saveFile('leapscale.txt', 'Hello from Electron 🚀');
    console.log(result);
  };

  const loadPorts = async () => {
    try {
      await saveData();
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
    (async () => {
      await loadPorts();
      const data = await window.api.loadItems();
      if (!data.error && data?.ingredients) {
        setIngredients(data.ingredients);
      }
    })();

    if (window.api?.onLiveWeight) {
      window.api.onLiveWeight((w) => setLive(Number(w).toFixed(3)));
    }
    if (window.api?.onStableWeight) {
      window.api.onStableWeight((w) => setStable(Number(w).toFixed(3)));
    }
    if (window.api?.onPortStatus) {
      window.api.onPortStatus((status) => setPortStatus(status));
    }
    if (window.api?.onMangingStatus) {
      window.api.onMangingStatus((data) => {
        console.log(data);
        setMangingStatus(data);
      });
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
    setRoute('connect');
  };

  const onProceedFromLogin = () => setRoute('location');

  const onProceedFromActivate = () => setRoute('login');

  const handleSelectLocation = (loc) => {
    if (!loc) {
      setRoute('login');
      setLocation(null);
      return;
    }
    setLocation(loc);
    setRoute('workorders');
  };

  const handleSelectWorkOrder = (wo) => {
    if (!wo) {
      setRoute('location');
      setWorkOrder(null);
      return;
    }
    setWorkOrder(wo);
    setRoute('connect');
  };

  return (
    <div>
      <div style={{ flex: 1 }}>
        {route === 'activate' && <Activation onProceed={onProceedFromActivate} />}
        {route === 'login' && <Login onProceed={onProceedFromLogin} />}
        {route === 'location' && <Location onSelect={handleSelectLocation} />}
        {route === 'workorders' && <WorkOrders onSelect={handleSelectWorkOrder} />}
        {route === 'connect' && <Connect ports={ports} selectedPort={selectedPort} onSelectPort={setSelectedPort} onConnect={handleConnect} onRefresh={loadPorts} location={location} />}
        {route === 'dashboard' && <Dashboard live={live} stable={stable} onDisconnect={handleDisconnect} portStatus={portStatus} />}
      </div>
    </div>
  );
}
