import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import apiService from '../services/apiService';
import Brand from '../components/Brand';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Divider } from 'primereact/divider';
import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';
import { InputOtp } from 'primereact/inputotp';
import ArrowLeft from '../../../../resources/subdirectory_arrow_left.png';
import BackspaceIcon from '../../../../resources/backspace_black.png';
import { useEffect } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';


Login.propTypes = {
  onProceed: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired
};

export default function Login({ onProceed, onBack }) {
  const startContent = <Brand></Brand>;
  const [selected, setSelected] = useState('new');
  const [newUserOrExistingUser, setNewUserOrExistingUser] = useState(true);
  const [keySelected, setKeySelected] = useState(null);
  const [token, setTokens] = useState('');
  const [showQr, setShowQr] = useState(false);
  const [qrCodeExpired, setQrCodeExpired] = useState(false);
  const [savedUsers, setSavedUsers] = useState([]);
  const [qrImage, setQrImage] = useState("");
  const [userPinSaved, setUserPinSaved] = useState(null);
  

  const DUMMY_EXISTING_USERS = ['User 1', 'User 2', 'User 3', 'User 4', 'User 5', 'User 6', 'User 7', 'User 8', 'User 9', 'User 10'];

  useEffect(() => {
       (async () => {
        setUserPinSaved(null);
      await loadSavedUsers();
    })();
    }, []);

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

  const loadSavedUsers = async () => {
    try {
    const activationKey = localStorage.getItem('activationkey');
    const hwId = localStorage.getItem('hwId');
    const response = await apiService.loadSavedUSers(hwId, activationKey);
            if (response) {
              if (response.status === 200) {
                      if(Array.isArray(response.data)) {
                      console.log(response.data);
                      const users = response.data.map(user => ({
                          name: user.name,
                          email: user.email
                      }
                    ))
                    setSavedUsers(users);
                  }
              } 
           } else {
                 setSavedUsers([]);
           }
      } catch(error) {
        console.log(error);
      }
  };

  const base64ToBlob = (base64, mimeType = "image/png") => {
    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
    return new Blob([bytes], { type: mimeType });
  };

  const getDeviceSessionQr = async () => {
    try {
      const activationKey = localStorage.getItem('activationkey');
      const hwId = localStorage.getItem('hwId');
      const qrImageResponse = await apiService.getDeviceSessionQr(hwId, activationKey);
      console.log(`qrImageResponse: ${qrImageResponse}`);
      if(qrImageResponse) {
        if (qrImageResponse.status === 200) {
            console.log(qrImageResponse.data.deviceSessionKey);
            const deviceSessionKey = qrImageResponse.data.deviceSessionKey;
            const qrImageBlob = base64ToBlob(qrImageResponse.data.qrBase64);
            const imageUrl = URL.createObjectURL(qrImageBlob);
            setUserPinSaved(null);
            setShowQr(true);
            setQrImage(imageUrl);
            startPolling(deviceSessionKey);
        }
      }

   } catch (error) {
      console.log(error);
   }
  }

  const startPolling = (deviceSessionKey) => {
  const interval = setInterval(() => {
    apiService.checkUserPinSetStatus(deviceSessionKey)
      .then((response) => {
        if (response) {
            if (response.status == 200) {

              if (response.data == '1') {
                console.log("User PIN set successfully");
                loadSavedUsers();
                setUserPinSaved(true);
                clearInterval(interval);
              } 

              if (response.data == '0') {
                console.log("QR code expired");
                setUserPinSaved(false);
                clearInterval(interval);
              }
            }
      }
      })
      .catch((error) => {
        clearInterval(interval);
        console.error(error);
      });
  }, 2000);
};

  const getInitials = (name = "") => {
      const words = name.trim().split(/\s+/).filter(Boolean);

      if (words.length === 0) return "";
      if (words.length === 1) return words[0][0].toUpperCase();

      return (
        words[0][0] + words[words.length - 1][0]
      ).toUpperCase();
  };

  const keyPadStyle = (wo) => {
    if (keySelected === wo) {
      return { backgroundColor: 'var(--primary-color)', color: 'var(--primary-color-text)', border: '2px solid var(--primary-color)', borderRadius: '3px', paddingBlock: '0.25rem' };
    } else {
      return { backgroundColor: 'var(--tertiary-color)', color: 'var(--tertiary-color-text)', border: '2px solid var(--surface-500)', borderRadius: '3px', paddingBlock: '0.25rem' };
    }
  };

  const clickHandler = (user) => {
    setKeySelected(null);
    setTokens('');
    setSelected(user.email);
    setShowQr(false);
  };

  const donewWithOtp = (token) => {
    if (token.length !== 4) {
      console.log('Enter 4 digit otp');
      return;
    }
    setKeySelected(null);
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
            <div className="flex flex-row justify-content-center gap-1 ">
              <div className="w-5 ">
                {selected === 'new' ? (
                  userPinSaved === null ? (
                  showQr ? (
                    <div className="flex flex-column align-items-center justify-content-center m-2 ">
                      <p>Scan this QR with your mobile to activate your Leapsmart/HMI device.</p>
                      <img src={qrImage} alt="QR code" style={{ width: 200, height: 200 }} />
                      <div className="m-2">
                        <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="6" fill="var(--surface-ground)" animationDuration=".9s" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap align-items-center justify-content-center h-full">
                      <Button onClick={() => getDeviceSessionQr()}>Login via Qr</Button>
                    </div>
                  )
                ) : userPinSaved === false ? (
                   <div className="flex flex-wrap align-items-center justify-content-center h-full">
                      <Button onClick={() => getDeviceSessionQr()}>Login via Qr</Button>
                    </div>
                ) :  (
                      <p>User PIN Saved Successfully</p>
                )
                ) : (
                  <div className="flex flex-column flex-wrap align-items-center justify-content-center m-2 ">
                    <p>{selected?.email}</p>
                    <InputOtp value={token} mask readOnly onChange={(e) => setTokens(e.value)} />
                    <div className="flex flex-column gap-2 w-full m-3">
                      <div className="flex flex-row gap-2  justify-content-around">
                        <div className="flex-1 text-center" style={keyPadStyle(1)} onClick={() => handleKeypadClick('1')}>
                          1
                        </div>
                        <div className="flex-1 text-center" style={keyPadStyle(2)} onClick={() => handleKeypadClick('2')}>
                          2
                        </div>
                        <div className="flex-1 text-center" style={keyPadStyle(3)} onClick={() => handleKeypadClick('3')}>
                          3
                        </div>
                      </div>

                      <div className="flex flex-row gap-2 justify-content-evenly ">
                        <div className="flex-1 text-center" style={keyPadStyle(4)} onClick={() => handleKeypadClick('4')}>
                          4
                        </div>
                        <div className="flex-1 text-center" style={keyPadStyle(5)} onClick={() => handleKeypadClick('5')}>
                          5
                        </div>
                        <div className="flex-1 text-center" style={keyPadStyle(6)} onClick={() => handleKeypadClick('6')}>
                          6
                        </div>
                      </div>
                      <div className="flex flex-row gap-2 justify-content-evenly ">
                        <div className="flex-1 text-center" style={keyPadStyle(7)} onClick={() => handleKeypadClick('7')}>
                          7
                        </div>
                        <div className="flex-1 text-center" style={keyPadStyle(8)} onClick={() => handleKeypadClick('8')}>
                          8
                        </div>
                        <div className="flex-1 text-center" style={keyPadStyle(9)} onClick={() => handleKeypadClick('9')}>
                          9
                        </div>
                      </div>
                      <div className="flex flex-row gap-2 justify-content-evenly ">
                        <div className="flex flex-1 p-0 justify-content-center align-items-center hover:bg-gray-100" style={keyPadStyle('back')} onClick={handleBackspace}>
                          <img src={BackspaceIcon} alt="backspace" />
                        </div>
                        <div className="flex-1 text-center" style={keyPadStyle(0)} onClick={() => handleKeypadClick('0')}>
                          0
                        </div>
                        {/* <div style={keyPadStyle('back')} className="hover:bg-gray-100" onClick={handleClear}>
                          <i className="pi pi-times" style={{ fontSize: '0.65rem' }}></i>
                        </div> */}
                        <Button className={token.length === 4 ? 'p-button-success p-0 flex-1 justify-content-center align-items-center ' : 'p-button-danger p-0 flex-1 justify-content-center align-items-center'} onClick={() => donewWithOtp(token)}>
                          <img src={ArrowLeft} alt="backspace" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="w-1">
                <Divider layout="vertical" />
              </div>
              <div className="w-6 py-2 ">
                <div className="flex-1 overflow-hidden" style={{ minHeight: 0 }}>
                  <ScrollPanel style={{ width: '100%', height: '410px' }}>
                    <div className="surface-card">
                      <div className="flex align-items-center border-2 border-300 gap-2 border-round-lg p-2 mb-2" style={getStyle('new')} onClick={() => clickHandler('new')} role="button" tabIndex={0}>
                        <Avatar icon="pi pi-user-plus" shape="circle" style={selected === 'new' ? { backgroundColor: 'white', color: 'black' } : {}} />
                        <div>
                          <h6 className="m-0 p-0">New User</h6>
                          <p className="m-0 p-0 text-sm">Click here to add new user</p>
                        </div>
                      </div>

                      {savedUsers.length > 0 ? (
                      savedUsers.map((user) => (
                        <div className="flex align-items-center border-2 border-300 gap-2 border-round-lg p-2 mb-2" key={user.email}  style={getStyle(user.email)} onClick={() => clickHandler(user)} role="button" tabIndex={0}>
                          <Avatar label={getInitials(user.name)} shape="circle" size="medium"/>
                          <div>
                            <h6 className="m-0 p-0">{user.name}</h6>
                            <p className="m-0 p-0 text-sm">{user.email}</p>
                          </div>
                        </div>
                      ))
                      ) : (
                        <p></p>
                      )
                    }
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
