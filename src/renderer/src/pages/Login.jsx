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
import { InputOtp } from 'primereact/inputotp';

Login.propTypes = {
  onProceed: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired
};

const DUMMY_EXISTING_USERS = ['User 1', 'User 2', 'User 3', 'User 4', 'User 5', 'User 6', 'User 7', 'User 8', 'User 9', 'User 10'];

export default function Login({ onProceed, onBack }) {
  const startContent = <Brand></Brand>;
  const [selected, setSelected] = useState('new');
  const [newUserOrExistingUser, setNewUserOrExistingUser] = useState(true);
  const [keySelected, setKeySelected] = useState(null);
  const [token, setTokens] = useState('');

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

  const keyPadStyle = (wo) => {
    if (keySelected === wo) {
      return { backgroundColor: 'var(--primary-color)', color: 'var(--primary-color-text)', border: '2px solid var(--primary-color)', paddingInline: '15px', margin: '5px' };
    } else {
      return { backgroundColor: 'var(--tertiary-color)', color: 'var(--tertiary-color-text)', border: '2px solid var(--surface-500)', paddingInline: '15px', margin: '5px' };
    }
  };

  const ClickHandler = (user) => {
    setKeySelected(null);
    setTokens('');
    setSelected(user);
  };

  const donwWithOtp = (token) => {
    setKeySelected(null);
    console.log('Hello Puja', token);
    setTokens('');
  };

  const getStyle = (wo) => {
    if (selected === wo) {
      return { backgroundColor: 'var(--primary-color)', color: 'var(--primary-color-text)', border: 'none' };
    }
  };

  const handleKeypadClick = (val) => {
    if (token.length < 4) {
      setTokens(token + val);
    }

    setKeySelected(parseInt(val));
  };

  const handleBackspace = () => {
    setKeySelected(null);
    setTokens(token.slice(0, -1));
  };

  const handleClear = () => {
    setKeySelected(null);
    setTokens('');
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
            <div className="flex flex-row  justify-content-center gap-1 ">
              <div className="w-5">
                {selected === 'new' ? (
                  <div className="flex flex-wrap align-items-center justify-content-around">
                    <p>Scan this QR with your mobile to activate your Leapsmart/HMI device.</p>
                    <img src={qrImage} alt="QR code" style={{ width: 200, height: 200 }} />
                  </div>
                ) : (
                  <div className="flex flex-column flex-wrap align-items-center justify-content-center ">
                    <p>{selected}</p>
                    <InputOtp value={token} mask onChange={(e) => setToken(e.value)} />
                    <div className="flex flex-column gap-2 m-3">
                      <div className="flex flex-row gap-3  justify-content-evenly">
                        <div style={keyPadStyle(1)} onClick={() => handleKeypadClick('1')}>
                          1
                        </div>
                        <div style={keyPadStyle(2)} onClick={() => handleKeypadClick('2')}>
                          2
                        </div>
                        <div style={keyPadStyle(3)} onClick={() => handleKeypadClick('3')}>
                          3
                        </div>
                      </div>
                      
                      <div className="flex flex-row gap-3 justify-content-evenly ">
                        <div style={keyPadStyle(4)} onClick={() => handleKeypadClick('4')}>
                          4
                        </div>
                        <div style={keyPadStyle(5)} onClick={() => handleKeypadClick('5')}>
                          5
                        </div>
                        <div style={keyPadStyle(6)} onClick={() => handleKeypadClick('6')}>
                          6
                        </div>
                      </div>
                      <div className="flex flex-row gap-3 justify-content-evenly ">
                        <div style={keyPadStyle(7)} onClick={() => handleKeypadClick('7')}>
                          7
                        </div>
                        <div style={keyPadStyle(8)} onClick={() => handleKeypadClick('8')}>
                          8
                        </div>
                        <div style={keyPadStyle(9)} onClick={() => handleKeypadClick('9')}>
                          9
                        </div>
                      </div>
                      <div className="flex flex-row gap-3 justify-content-evenly ">
                        <div style={keyPadStyle('back')} className="hover:bg-gray-100" onClick={handleBackspace}>
                          <i className="pi pi-arrow-left" style={{ fontSize: '0.65rem' }}></i>
                        </div>
                        <div style={keyPadStyle(0)} onClick={() => handleKeypadClick('0')}>
                          0
                        </div>
                        <div style={keyPadStyle('back')} className="hover:bg-gray-100" onClick={handleClear}>
                          <i className="pi pi-times" style={{ fontSize: '0.65rem' }}></i>
                        </div>
                      </div>
                    </div>
                    {token.length === 4 && (
                      <Button className="pt-1 pb-1" onClick={() => donwWithOtp(token)}>
                        Move Ahead
                      </Button>
                    )}
                  </div>
                )}
              </div>
              <div className="w-1">
                <Divider layout="vertical" />
              </div>
              <div className="w-7 p-2 flex flex-column" >
                <div className='overflow-hidden flex-1' style={{ minHeight: 0}}>
                <ScrollPanel style={{ width: '100%', height: '410px' }}>
                  <div className="surface-card">
                    <div className="flex align-items-center border-2 border-300 gap-2 border-round-lg p-2 mb-2" style={getStyle('new')} onClick={() => ClickHandler('new')} role="button" tabIndex={0}>
                      <Avatar icon="pi pi-user-plus" style={selected === 'new' ? { backgroundColor: 'white', color: 'black' } : {}} />
                      <div>
                        <h6 className="m-0 p-0">New User</h6>
                        <p className="m-0 p-0 text-sm">Click here to add new user</p>
                      </div>
                    </div>

                    {DUMMY_EXISTING_USERS.map((user) => (
                      <div className="flex align-items-center border-2 border-300 gap-2 border-round-lg p-2 mb-2" key={user} style={getStyle(user)} onClick={() => ClickHandler(user)} role="button" tabIndex={0}>
                        <Avatar icon="pi pi-user" style={selected === user ? { backgroundColor: 'white', color: 'black' } : {}} />
                        <div>
                          <h6 className="m-0 p-0">{user}</h6>
                          <p className="m-0 p-0 text-sm">Click here to login as {user}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollPanel>
                </div>
              </div>
            </div>
          </div>
        </ScrollPanel>
      </main>
    </React.Fragment>
  );
}
