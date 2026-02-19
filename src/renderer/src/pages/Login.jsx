import PropTypes from 'prop-types';
import { Button } from 'primereact/button';
import qrImage from '../assets/qr-auth-leapsys-in.svg';

function Login({ onProceed }) {
    return (
        <div className="p-d-flex p-flex-column p-ai-center p-jc-center" style={{ height: '100%' }}>
            <h2>Sign in</h2>
            <p>Scan this QR with your mobile app to link your device.</p>
            <img src={qrImage} alt="QR code" style={{ width: 220, height: 220, margin: '12px 0' }} />
            <div>
                <Button label="Continue" onClick={() => onProceed()} className="p-button-primary" />
            </div>
        </div>
    );
}

Login.propTypes = {
    onProceed: PropTypes.func.isRequired,
};

export default Login;
