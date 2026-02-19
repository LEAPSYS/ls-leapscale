import PropTypes from 'prop-types';
import { Button } from 'primereact/button';

export default function Dashboard({ live, stable, onDisconnect }) {
  return (
    <div className="p-d-flex p-flex-column p-p-4">
      <h2>Scale Dashboard</h2>
      <div className="p-mt-3">
        <h4>Live Weight</h4>
        <div className="p-text-bold" style={{fontSize: '1.6rem'}}>{live}</div>
      </div>
      <div className="p-mt-3">
        <h4>Stable Weight</h4>
        <div className="p-text-bold" style={{fontSize: '1.6rem'}}>{stable}</div>
      </div>
      <div className="p-mt-4">
        <Button label="Disconnect" onClick={onDisconnect} className="p-button-secondary" />
      </div>
    </div>
  );
}

Dashboard.propTypes = {
  live: PropTypes.string.isRequired,
  stable: PropTypes.string.isRequired,
  onDisconnect: PropTypes.func.isRequired,
};
