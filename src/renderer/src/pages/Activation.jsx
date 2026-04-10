import React, { useState } from 'react';
import PropTypes, { bool } from 'prop-types';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Card } from 'primereact/card';
import { Ripple } from 'primereact/ripple';
import { Image } from 'primereact/image';
import { useApi } from '../hooks/useApi';
import lslogo from '../assets/leapsys-inkspace-on-transparent.png';
import { Panel } from 'primereact/panel';
import apiService from '../services/apiService';
import StatusBar from '../components/StatusBar';

Activation.propTypes = {
  onProceed: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  machineId: PropTypes.string
};

export default function Activation({ onProceed, onBack, machineId }) {
  const [activationResult, setActivationResult] = useState(null);
  const [syncing, setSyncing] = useState(false);

  const saveActivationKey = async (activationKey) => {
    const result = await window.api.saveFile('leapscale.bin', activationKey);
    console.log(result);
  };

  const handleActivate = async () => {
    setSyncing(true);
    await apiService
      .activateHmi(machineId, null)
      .then((result) => {
        console.log(result);
        saveActivationKey(result.data?.activationKey);
        //setActivationResult(result?.data?.data);
        setSyncing(false);
      })
      .catch((err) => {
        //setActivationResult(err);
        console.log(err);
        setSyncing(false);
      });
    console.log('activation clicked');
  };

  const startContent = (
    <React.Fragment>
      <span>Activation</span>
    </React.Fragment>
  );

  const endContent = (
    <React.Fragment>
      <Button label="Back" onClick={() => onBack()} disabled={true} visible={false} className="p-button-plain p-button-danger m-0 p-3 mr-1" />
      <Button label="Demo" onClick={() => onProceed()} visible={false} className="p-button-secondary p-3 mr-1" />
      <Button label="Activate" onClick={() => handleActivate()} className="p-button-success p-3" />
    </React.Fragment>
  );

  return (
    <>
      <div className="flex flex-column min-h-screen">
        <header className="p-0">
          <Toolbar start={startContent} end={endContent} style={{ backgroundImage: 'linear-gradient(to left, var(--blue-50), var(--blue-100))' }} />
        </header>

        <main className="flex-1 p-0">
          <div className="surface-card p-6 h-full">
            <h3>Activation Pending</h3>
            <p>Once you click it may take couple of minutes to activate.</p>
          </div>
        </main>

        <StatusBar activationStatus={1} syncing={syncing}></StatusBar>
      </div>
    </>
  );
}
