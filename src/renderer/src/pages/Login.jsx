import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'primereact/button';
import qrImage from '../assets/qr-auth-leapsys-in.svg';
import { Toolbar } from 'primereact/toolbar';

function Login({ onProceed }) {
  const startContent = (
    <React.Fragment>
      <Button label="Back" disabled="true" className="p-button-plain" />
    </React.Fragment>
  );

  const centerContent = <span style={{ textAlign: 'center', marginTop: 0 }}>Login</span>;

  const endContent = (
    <React.Fragment>
      <Button label="Demo" onClick={() => onProceed()} className="p-button-primary" />
    </React.Fragment>
  );

  return (
    <>
      <Toolbar start={startContent} center={centerContent} end={endContent} />
      <div className="flex flex-wrap align-items-center justify-content-center" style={{ height: '100%' }}>
        <p>Scan this QR with your mobile to activate your Leapsmart/HMI device.</p>
        <img src={qrImage} alt="QR code" style={{ width: 320, height: 320 }} />
        <div></div>
      </div>
    </>
  );
}

Login.propTypes = {
  onProceed: PropTypes.func.isRequired
};

export default Login;
