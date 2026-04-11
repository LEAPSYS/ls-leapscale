import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'primereact/button';
import qrImage from '../assets/qr-auth-leapsys-in.svg';
import { Toolbar } from 'primereact/toolbar';
import apiService from '../services/apiService';

Login.propTypes = {
  onProceed: PropTypes.func.isRequired
};

export default function Login({ onProceed }) {
  const startContent = (
    <React.Fragment>
      <Button label="Back" visible={false} disabled={true} className="p-button-plain" />
    </React.Fragment>
  );

  const centerContent = <span style={{ textAlign: 'center', marginTop: 0 }}>Login</span>;

  const endContent = (
    <React.Fragment>
      <Button label="Demo" onClick={() => onProceed()} className="p-button-primary" />
    </React.Fragment>
  );

  const [loginResult, setLoginResult] = useState(null);
  const [loginError, setLoginError] = useState(null);

  const handleLogin = async () => {
    await apiService
      .login('pkishor@leapsys.net', 'moNu288*')
      .then((result) => {
        console.log(result);
        setLoginResult(result?.data?.data);
        apiService.storeToken(result.data.data.access_token);
      })
      .catch((err) => {
        setLoginError(err);
        console.log(err);
      });
  };

  return (
    <>
      <Toolbar start={startContent} center={centerContent} end={endContent} />
      <div className="flex flex-wrap align-items-center justify-content-center" style={{ height: '100%' }}>
        <p>Scan this QR with your mobile to activate your Leapsmart/HMI device.</p>
        <img src={qrImage} alt="QR code" style={{ width: 300, height: 300 }} />
      </div>
      <div>
        <Button label="Test Login" onClick={() => handleLogin()} className="p-button-primary" />
        {<p>Loading...</p>}
        {loginError && <p>Error: {JSON.stringify(loginError)}</p>}
        {loginResult && <p>{loginResult.access_token}</p>}
        <p>{true}</p>
      </div>
    </>
  );
}
