import { useEffect, useState } from 'react';
import Login from './pages/Login';
import Location from './pages/Location';
import WorkOrders from './pages/WorkOrders';
import Connect from './pages/Connect';
import Dashboard from './pages/Dashboard';
import Activation from './pages/Activation';
import StatusBar from './components/StatusBar';
import apiService from './services/apiService';

export default function App() {
  const [route, setRoute] = useState('activate'); // 'login' | 'location' | 'workorders' | 'connect' | 'dashboard'
  const [ports, setPorts] = useState([]);
  const [hwId, setHwId] = useState('');
  const [hwCode, setHwCode] = useState(null);
  const [activationKey, setActivationKey] = useState('');
  const [selectedPort, setSelectedPort] = useState('');
  const [location, setLocation] = useState(null);
  const [workOrder, setWorkOrder] = useState(null);
  const [live, setLive] = useState('0.000');
  const [stable, setStable] = useState('0.000');
  const [portStatus, setPortStatus] = useState('disconnected');
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [mangingStatus, setMangingStatus] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [activationStatus, setActivationStatus] = useState(0);
  const [activated, setActivated] = useState(false);
  const [networkConnected, setNetworkConnected] = useState(false);
  const [workStationDetails, setWorkStationDetails] = useState(null);
  const [workOrders, setWorkOrders] = useState(null);

  window.addEventListener('online', () => {
    console.log('Connected!');
    setNetworkConnected(true);
  });

  window.addEventListener('offline', () => {
    console.log('Disconnected!');
    setNetworkConnected(false);
  });

  const loadPorts = async () => {
    try {
      if (window.api?.listPorts) {
        const list = await window.api.listPorts();
        setPorts(list || []);
        if (list && list.length && !selectedPort) {
          setSelectedPort(list[0]);
        }
      }
    } catch (e) {
      console.error('list ports error', e);
    }
  };

  const loadMachineId = async () => {
    try {
      const machineId = await window.api.getMachineId();
      setHwId(machineId);
      //localStorage.setItem('hwId',machineId)
    } catch (e) {
      console.error('machine id error', e);
    }
  };

  const saveActivationKey = async (activationKey) => {
    const result = await window.api.saveFile('leapscale.bin', activationKey);
    console.log(result);
  };

  const readSavedActivationKey = async () => {
    const result = await window.api.readFile('leapscale.bin');
    setActivationKey(result.data);
    //localStorage.setItem('activationkey',result.data)
    console.log(result.data);
  };

  const handleActivate = async () => {
    try {
      setActivationStatus(0);
      setActivated(false);
      setSyncing(true);
      await apiService
        .activateHmi(hwId, activationKey)
        .then((result) => {
          console.log(result.data);
          setHwCode(result.data?.hwCode);
          saveActivationKey(result.data?.activationKey);
          setActivationStatus(result.data?.activationStatus);

          if (result.data?.activationStatus === 1) {
            setActivated(true);
          }
          setTimeout(() => setSyncing(false), 2000);
        })
        .catch((err) => {
          console.log(err);
          setTimeout(() => setSyncing(false), 2000);
        });
      console.log('activation clicked');
    } catch (error) {
      setActivated(false);
      if (!err.response) {
        //If Backend server is down or unreachable
        setActivated(false);
      }
    }
  };

  const onProceedFromLogin = async () => {
    setRoute('location');
  };

  const onBackFromLogin = () => {
    setRoute('activate');
  };

  const onBackFromConnect = async () => {
    setRoute('workorders');
  };

  const onProceedFromActivate = () => {
    setRoute('login');
  };

  const onBackFromDashboard = () => {
    setRoute('connect');
  };

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

  const handleLogout = async () => {
    apiService.logout();
    setRoute('login');
  };

  const handleSelectLocation = async (loc) => {
    if (!loc) {
      setLocation(null);
      handleLogout();
      return;
    }
    setLocation(loc);
    setRoute('workorders');
  };

  const handleSelectWorkOrder = async (wo) => {
    if (!wo) {
      setRoute('location');
      setWorkOrder(null);
      return;
    }
    setWorkOrder(wo);
    setRoute('connect');
  };

  useEffect(() => {
    (async () => {
      setActivationStatus(0);
      setActivated(false);
      setNetworkConnected(navigator.onLine);
      await loadPorts();
      await loadMachineId();
      await readSavedActivationKey();
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

  useEffect(() => {
    if (route === 'activate' && hwId && activationKey) {
      handleActivate();
    }
  }, [route, hwId, activationKey]);

  return (
    <>
      <div className="flex flex-column h-screen">
        {route === 'activate' && <Activation onProceed={onProceedFromActivate} isActive={activated} onActivate={handleActivate} />}
        {route === 'login' && <Login onProceed={onProceedFromLogin} onBack={onBackFromLogin} hwId={hwId} activationKey={activationKey} />}
        {route === 'location' && <Location onSelect={handleSelectLocation} />}
        {route === 'workorders' && <WorkOrders onSelect={handleSelectWorkOrder} />}
        {route === 'connect' && <Connect ports={ports} selectedPort={selectedPort} onSelectPort={setSelectedPort} onConnect={handleConnect} onRefresh={loadPorts} location={location} onBack={onBackFromConnect} />}
        {route === 'dashboard' && <Dashboard live={live} stable={stable} onDisconnect={handleDisconnect} portStatus={portStatus} onBack={onBackFromDashboard} />}
        <StatusBar networkConnected={networkConnected} activationStatus={activationStatus} hwCode={hwCode} syncing={syncing}></StatusBar>
      </div>
    </>
  );
}
