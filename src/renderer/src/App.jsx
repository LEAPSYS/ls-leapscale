import { useEffect, useState } from 'react';
import Versions from './components/Versions';
import electronLogo from './assets/electron.svg';

function App() {
  const ipcHandle = () => window.electron.ipcRenderer.send('ping');

  const [ports, setPorts] = useState([]);
  const [selectedPort, setSelectedPort] = useState('');
  const [connected, setConnected] = useState(false);
  const [live, setLive] = useState('0.000');
  const [stable, setStable] = useState('0.000');

  useEffect(() => {
    const load = async () => {
      try {
        if (window.api?.listPorts) {
          const list = await window.api.listPorts();
          setPorts(list || []);
          if (list && list.length) setSelectedPort(list[0]);
        }
      } catch (e) {
        console.error('list ports error', e);
      }
    };

    load();

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
      setConnected(true);
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
    setConnected(false);
  };

  return (
    <>
      <img alt="logo" className="logo" src={electronLogo} />
      <div className="creator">Powered by electron-vite</div>
      <div className="text">
        Build an Electron app with <span className="react">React</span>
      </div>
      <p className="tip">
        Please try pressing <code>F12</code> to open the devTool
      </p>
      <div className="actions">
        <div className="action">
          <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">
            Documentation
          </a>
        </div>
        <div className="action">
          <a target="_blank" rel="noreferrer" onClick={ipcHandle}>
            Send IPC
          </a>
        </div>
      </div>

      <div className="serial-panel">
        <div className="serial-controls">
          <select id="ports" value={selectedPort} onChange={(e) => setSelectedPort(e.target.value)}>
            {ports.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <button id="connect" onClick={handleConnect} disabled={connected}>
            Connect
          </button>
          <button id="disconnect" onClick={handleDisconnect} disabled={!connected}>
            Disconnect
          </button>
        </div>

        <div className="weights">
          <h3>Live Weight</h3>
          <span className="live" id="live">
            {live}
          </span>
          <h3>Stable Weight</h3>
          <span className="stable" id="stable">
            {stable}
          </span>
        </div>
      </div>

      <Versions></Versions>
    </>
  );
}

export default App;
