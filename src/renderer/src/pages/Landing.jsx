import PropTypes from 'prop-types';
import { Button } from 'primereact/button';

function Landing({ ports, selectedPort, onSelectPort, onConnect, onRefresh }) {
  return (
    <div className="p-d-flex p-flex-column p-p-4">
      <h2>Connect to Scale</h2>
      <div className="p-field p-mb-3">
        <label htmlFor="ports">Available Ports</label>
        <select id="ports" value={selectedPort} onChange={(e) => onSelectPort(e.target.value)} className="p-inputtext p-mt-2">
          <option value="">-- select a port --</option>
          {ports.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>
      <div className="p-d-flex p-ai-center p-jc-start p-gap-2">
        <Button label="Refresh" onClick={onRefresh} className="p-button-plain" />
        <Button label="Connect" onClick={onConnect} className="p-button-success" />
      </div>
    </div>
  );
}

Landing.propTypes = {
  ports: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedPort: PropTypes.string.isRequired,
  onSelectPort: PropTypes.func.isRequired,
  onConnect: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
};

export default Landing;
