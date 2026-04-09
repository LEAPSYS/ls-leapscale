import React, { useState } from 'react';
import PropTypes, { bool } from 'prop-types';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Card } from 'primereact/card';
import { Ripple } from 'primereact/ripple';
import { Image } from 'primereact/image';
import { useApi } from '../hooks/useApi';
import lslogo from '../assets/leapsys-inkspace-on-transparent.png';

Activation.propTypes = {
  onProceed: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired
};

export default function Activation({ onProceed, onBack }) {
  const handleActivate = () => {
    console.log('activation clicked');
  };

  const startContent = (
    <React.Fragment>
      <span style={{ textAlign: 'center', marginTop: 0, fontWeight: 900 }}>Activation</span>
    </React.Fragment>
  );

  const endContent = (
    <React.Fragment>
      <Button label="Back" onClick={() => onBack()} disabled={true} visible={false} className="p-button-plain p-button-danger mr-2 p-3" />
      <Button label="Demo" onClick={() => onProceed()} visible={false} className="p-button-secondary p-3 mr-2" />
      <Button label="Activate Now" onClick={() => handleActivate()} className="p-button-success p-3" />
    </React.Fragment>
  );

  return (
    <>
      <div>
        <Toolbar start={startContent} end={endContent} className="shadow-1" style={{ backgroundImage: 'linear-gradient(to left, var(--bluegray-100), var(--bluegray-300))' }} />
        <div style={{ border: '0px solid #888', marginTop: '10px' }}>
          <div className="flex flex-column align-items-center justify-content-center">
            <span>Ready for activation !!</span>
          </div>
        </div>
      </div>
    </>
  );
}
