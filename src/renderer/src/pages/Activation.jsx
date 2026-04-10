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

Activation.propTypes = {
  onProceed: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  machineId: PropTypes.string
};

export default function Activation({ onProceed, onBack, machineId }) {
  const [activationResult, setActivationResult] = useState(null);

  const handleActivate = async () => {
    await apiService
      .activateHmi(machineId, null)
      .then((result) => {
        console.log(result);
        setActivationResult(result?.data?.data);
      })
      .catch((err) => {
        setActivationResult(err);
        console.log(err);
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

        <footer className="p-0 bg-blue-600 text-white p-1">
          <div className="flex align-items-center justify-content-between">
            <div>
              <small>© 2026 LEAPSYS</small>
            </div>
            <div className="flex align-items-center gap-3">
              <i className="pi pi-wifi"></i>
              <i className="pi pi-cog"></i>
              <i className="pi pi-globe"></i>
              <span className="flex align-items-center gap-2 pr-3">
                <i className="pi pi-circle-fill text-red-400" style={{ fontSize: '0.6rem' }}></i>
                <small>Offline</small>
              </span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
