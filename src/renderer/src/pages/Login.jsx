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
import 'primeicons/primeicons.css';
import { Knob } from 'primereact/knob';

Login.propTypes = {
    onProceed: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
    hwId: PropTypes.string.isRequired
};

export default function Login({ onProceed, onBack, hwId }) {
    const startContent = <Brand></Brand>;
    const [selected, setSelected] = useState('new');
    const [keySelected, setKeySelected] = useState(null);
    const [token, setTokens] = useState('');
    const [showQr, setShowQr] = useState(false);
    const [invalidUser, setInvalidUser] = useState(false);
    const [savedUsers, setSavedUsers] = useState([]);
    const [qrImage, setQrImage] = useState('');
    const [userPinSaved, setUserPinSaved] = useState(null);
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        (async () => {
            await loadSavedUsers();
            setInvalidUser(false);
            setSelected('new');
            setUserPinSaved(null);
        })();
    }, []);

    const [loginResult, setLoginResult] = useState(null);
    const [loginError, setLoginError] = useState(null);

    const handleLogin = async (pin) => {
        try {
            const response = await apiService.loginWithPin(hwId, selected.email, pin);
            if (response?.data?.access_token && response?.data?.refresh_token) {
                apiService.storeTokens(response.data.access_token, response.data.refresh_token);
                await onProceed();
            } else {
                setInvalidUser(true);
            }
        } catch (error) {
            setSelected('new');
            setUserPinSaved(null);
            setShowQr(false);
            await loadSavedUsers();
        }
    };

    const loadSavedUsers = async () => {
        try {
            setSavedUsers([]);
            console.log(hwId);
            const response = await apiService.getAllDeviceUsers(hwId);
            if (response) {
                if (response.status === 200) {
                    if (Array.isArray(response.data)) {
                        console.log(response.data);
                        const users = response.data.map((user) => ({
                            name: user.username,
                            email: user.username
                        }));
                        setSavedUsers(users);
                    }
                }
            }
        } catch (error) {
            setSelected('new');
            setUserPinSaved(true);
            setShowQr(false);
            setSavedUsers([]);
            console.log(`loadSavedUsers ${error}`);
        }
    };

    const base64ToBlob = (base64, mimeType = 'image/png') => {
        const binary = atob(base64);
        const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
        return new Blob([bytes], { type: mimeType });
    };

    const getDeviceSessionQr = async () => {
        try {
            const qrImageResponse = await apiService.getDeviceSessionQr(hwId);
            if (qrImageResponse) {
                if (qrImageResponse.status === 200) {
                    const sessionKey = qrImageResponse.data.sessionKey;
                    const qrImageBlob = base64ToBlob(qrImageResponse.data.qrBase64);
                    const imageUrl = URL.createObjectURL(qrImageBlob);
                    setSelected('new');
                    setUserPinSaved(null);
                    setShowQr(true);
                    setQrImage(imageUrl);
                    startPolling(sessionKey);
                }
            }
        } catch (error) {
            console.log(`getDeviceSessionQr ${error}`);
            setUserPinSaved(null);
            setSelected('new');
            setShowQr(false);
            await loadSavedUsers();
        }
    };

    const startPolling = (sessionKey) => {
        try {
            let elapsedSeconds = 0;
            const interval = setInterval(() => {
                elapsedSeconds += 2;
                setSeconds(elapsedSeconds);
                apiService
                    .loginWithQrSessionKey(sessionKey)
                    .then(async (response) => {
                        if (response) {
                            if (response.status == 200) {
                                if (response?.data?.access_token && response?.data?.refresh_token) {
                                    clearInterval(interval);
                                    apiService.storeTokens(response.data.access_token, response.data.refresh_token);
                                    await onProceed();
                                }
                            }
                        }
                    })
                    .catch((error) => {
                        clearInterval(interval);
                        console.error(error);
                    });
                if (elapsedSeconds >= 300) {
                    clearInterval(interval);
                    setShowQr(false);
                    console.log('Polling timeout');
                }
            }, 2000);
        } catch (error) {
            console.log(`startPolling ${error}`);
            setSelected('new');
            setShowQr(false);
            loadSavedUsers();
        }
    };

    const getInitials = (name = '') => {
        const words = name.trim().split(/\s+/).filter(Boolean);

        if (words.length === 0) return '';
        if (words.length === 1) return words[0][0].toUpperCase();

        return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    };

    const keyPadStyle = (wo) => {
        const baseStyle = {
            aspectRatio: '1 / 1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            cursor: 'pointer',
            userSelect: 'none',
            fontSize: '1.5rem',
            fontWeight: '600'
        };

        if (String(keySelected) === String(wo)) {
            return {
                ...baseStyle,
                backgroundColor: 'var(--primary-color)',
                color: 'var(--primary-color-text)',
                border: '2px solid var(--primary-color)'
            };
        } else {
            return {
                ...baseStyle,
                backgroundColor: 'var(--tertiary-color)',
                color: 'var(--tertiary-color-text)',
                border: '2px solid var(--surface-500)'
            };
        }
    };

    const clickHandler = (user) => {
        setInvalidUser(false);
        setUserPinSaved(null);
        setShowQr(false);
        setKeySelected(null);
        setTokens('');
        setSelected(user);
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

        setKeySelected(val);
        setTimeout(() => {
            setKeySelected(null);
        }, 150);
    };

    const handleBackspace = () => {
        setKeySelected('back');
        setTokens(token.slice(0, -1));
        setTimeout(() => {
            setKeySelected(null);
        }, 150);
    };

    const handleClear = () => {
        setKeySelected(null);
        setTokens('');
    };

    const endContent = (
        <React.Fragment>
            <Button label="Back" onClick={() => onBack()} className="p-button-danger p-2 mr-1" />
        </React.Fragment>
    );

    return (
        <React.Fragment>
            <header className="p-0 flex-shrink-0">
                <Toolbar start={startContent} end={endContent} style={{ backgroundImage: 'linear-gradient(to left, var(--blue-50), var(--blue-100))' }} />
            </header>
            <main className="flex-1 overflow-hidden" style={{ minHeight: 0 }}>
                <ScrollPanel style={{ width: '100%', height: '100%' }}>
                    <div className="surface-card py-2 px-3 ">
                        <div className="flex flex-row justify-content-center gap-1 ">
                            <div className="w-5">
                                {invalidUser ? (
                                    <div className="flex flex-wrap align-items-center justify-content-center h-full">
                                        <Card style={{ background: '#ffffff', boxShadow: 'none' }}>
                                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '5px' }}>
                                                <i className="pi pi-exclamation-circle" style={{ fontSize: '3rem', color: '#ffbb00', width: '70px', fontWeight: 'bold' }}></i>
                                            </div>
                                            <p className="py-1 px-1 text-center">Invalid PIN. Please enter your PIN again.</p>
                                        </Card>
                                    </div>
                                ) : (
                                    <>
                                        {selected === 'new' ? (
                                            userPinSaved === null ? (
                                                showQr ? (
                                                    <div className="flex flex-column align-items-center justify-content-center m-2">
                                                        <p>Scan QR via phone to login</p>
                                                        <img src={qrImage} alt="QR Code" style={{ width: 200, height: 200 }} />
                                                        <div className="m-0">
                                                            <Knob value={(seconds / 300) * 100} valueTemplate={`${seconds}s`} readOnly size={80} />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-wrap align-items-center justify-content-center h-full">
                                                        <Button onClick={getDeviceSessionQr}>Show QR</Button>
                                                    </div>
                                                )
                                            ) : userPinSaved === false ? (
                                                <div className="flex flex-wrap align-items-center justify-content-center h-full">
                                                    <Card style={{ background: '#ffffff', boxShadow: 'none' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '5px' }}>
                                                            <i className="pi pi-exclamation-circle" style={{ fontSize: '3rem', color: '#ffbb00', width: '70px', fontWeight: 'bold' }}></i>
                                                        </div>
                                                        <p className="py-1 px-1 text-center">QR Code Expired</p>
                                                        <Button onClick={getDeviceSessionQr}>Regenerate QR</Button>
                                                    </Card>
                                                </div>
                                            ) : (
                                                <div className="flex flex-wrap align-items-center justify-content-center h-full">
                                                    <Card style={{ background: '#ffffff', boxShadow: 'none' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '5px' }}>
                                                            <i className="pi pi-check-circle" style={{ fontSize: '3rem', color: '#40f105', width: '70px', fontWeight: 'bold' }}></i>
                                                        </div>
                                                        <p className="text-center">
                                                            User Added
                                                            <br />
                                                            Successfully
                                                        </p>
                                                    </Card>
                                                </div>
                                            )
                                        ) : (
                                            <div className="flex flex-column flex-wrap align-items-center justify-content-center m-2">
                                                <InputOtp value={token} mask readOnly onChange={(e) => setTokens(e.value)} />
                                                <div className="flex flex-column gap-2 w-full mx-auto my-3" style={{ maxWidth: '220px' }}>
                                                    <div className="flex flex-row gap-2 justify-content-around">
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
                                                    <div className="flex flex-row gap-2 justify-content-evenly">
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
                                                    <div className="flex flex-row gap-2 justify-content-evenly">
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
                                                    <div className="flex flex-row gap-2 justify-content-evenly">
                                                        <div className="flex flex-1 p-0 justify-content-center align-items-center hover:bg-gray-100" style={keyPadStyle('back')} onClick={handleBackspace}>
                                                            <img src={BackspaceIcon} alt="backspace" />
                                                        </div>
                                                        <div className="flex-1 text-center" style={keyPadStyle(0)} onClick={() => handleKeypadClick('0')}>
                                                            0
                                                        </div>
                                                        <Button disabled={token.length !== 4} style={{ aspectRatio: '1 / 1' }} className={token.length === 4 ? 'p-button-success p-0 flex-1 justify-content-center align-items-center' : 'p-button-secondary p-0 flex-1 justify-content-center align-items-center'} onClick={() => handleLogin(token)}>
                                                            <img src={ArrowLeft} alt="submit" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </>
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
                                                    <h5 className="m-0 p-0">New User</h5>
                                                    <p className="m-0 p-0 text-sm">Click here to add new user</p>
                                                </div>
                                            </div>

                                            {savedUsers.length > 0 ? (
                                                savedUsers.map((user) => (
                                                    <div className="flex align-items-center border-2 border-300 gap-2 border-round-lg p-2 mb-2" key={user.name} style={getStyle(user)} onClick={() => clickHandler(user)} role="button" tabIndex={0}>
                                                        <Avatar label={getInitials(user.name)} shape="circle" size="medium" />
                                                        <div>
                                                            <h5 className="m-0 p-0">{user.name}</h5>
                                                            <p className="m-0 p-0 text-sm">{user.email}</p>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p></p>
                                            )}
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
