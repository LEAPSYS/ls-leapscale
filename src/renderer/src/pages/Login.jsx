import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'primereact/button';
import qrImage from '../assets/qr-auth-leapsys-in.svg';
import { Toolbar } from 'primereact/toolbar';
import apiService from '../services/apiService';
import Brand from '../components/Brand';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Divider } from 'primereact/divider';
import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';

Login.propTypes = {
  onProceed: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired
};

export default function Login({ onProceed, onBack }) {
  const startContent = <Brand></Brand>;

  const endContent = (
    <React.Fragment>
      <Button label="Back" onClick={() => onBack()} className="p-button-danger p-2 mr-1" />
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
    <React.Fragment>
      <header className="p-0 flex-shrink-0">
        <Toolbar start={startContent} end={endContent} style={{ backgroundImage: 'linear-gradient(to left, var(--blue-50), var(--blue-100))' }} />
      </header>
      <main className="flex-1 overflow-hidden" style={{ minHeight: 0 }}>
        <ScrollPanel style={{ width: '100%', height: '100%' }}>
          <div className="surface-card py-2 px-3 ">
            {/* <h4 className="my-1">Login Page</h4>
            <div className="flex flex-wrap align-items-center justify-content-center">
              <p>Scan this QR with your mobile to activate your Leapsmart/HMI device.</p>
              <img src={qrImage} alt="QR code" style={{ width: 100, height: 150 }} />
            </div>
            <div>
              <Button label="Test Login" onClick={() => handleLogin()} className="p-button-primary" />
              {<p>Loading...</p>}
              {loginError && <p>Error: {JSON.stringify(loginError)}</p>}
              {loginResult && <p>{loginResult.access_token}</p>}
              <p>{true}</p>
            </div> */}
            <div className="flex flex-row justify-content-center gap-1 ">
              <div className="w-5">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                  sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
              </div>

              <div className="w-1">
                <Divider layout="vertical" />
              </div>

              <div className="w-5 p-2">
               <div className="flex align-items-center border-1 border-300  border-round-lg p-2">
                <Avatar  icon="pi pi-user"  >

                </Avatar>
                <div>
                  <p>User 1</p>
                </div>

               </div>
              </div>
            </div>
          </div>
        </ScrollPanel>
      </main>
    </React.Fragment>
  );
}
