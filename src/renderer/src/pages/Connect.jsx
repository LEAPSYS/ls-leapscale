import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import Brand from '../components/Brand';

Connect.propTypes = {
  ports: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedPort: PropTypes.string.isRequired,
  onSelectPort: PropTypes.func.isRequired,
  onConnect: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired
};

export default function Connect({ ports, selectedPort, onSelectPort, onConnect, onRefresh,onBack }) {

  const startContent = <Brand></Brand>;
  // const startContent = (
  //   <React.Fragment>
  //     <Button label="Logout" disabled="true" className="p-button-plain" />
  //   </React.Fragment>
  // );

  // const centerContent = <span style={{ textAlign: 'center', marginTop: 0 }}>Connect to scale</span>;

  const endContent = (
    <React.Fragment>
      <Button label="Back" onClick={onBack} className="p-button-danger p-2 mr-1" />
      <Button label="Refresh" onClick={onRefresh} className="p-button-plain" />
    </React.Fragment>
  );

  return (
    <>
      {/* <Toolbar start={startContent} center={centerContent} end={endContent} />
      <div className="flex flex-wrap align-items-center justify-content-center" style={{ height: '100%' }}>
        <div x>
          <div className="p-field p-mb-3">
            <label htmlFor="ports">Available Ports</label>
            <select id="ports" value={selectedPort} onChange={(e) => onSelectPort(e.target.value)} className="p-inputtext p-mt-2" style={{ width: '100%', padding: '10px', borderRadius: 6 }}>
              <option value="">-- select a port --</option>
              {ports.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="p-d-flex p-jc-center p-ai-center p-gap-3" style={{ marginTop: 8 }}>
            <Button label="Connect" onClick={onConnect} className="p-button-success w-full" />
          </div>
        </div>
      </div> */}
      <header className="p-0">
        <Toolbar start={startContent}  end={endContent} style={{ backgroundImage: 'linear-gradient(to left, var(--blue-50), var(--blue-100))' }} />
        
      </header>
      <main className="flex-1 p-0">
        <div className="surface-card py-2 px-3 ">
          <div className="flex flex-wrap align-items-center justify-content-center" style={{ height: '100%' }}>
        <div x>
          <div className="p-field p-mb-3">
            <label htmlFor="ports">Available Ports</label>
            <select id="ports" value={selectedPort} onChange={(e) => onSelectPort(e.target.value)} className="p-inputtext p-mt-2" style={{ width: '100%', padding: '10px', borderRadius: 6 }}>
              <option value="">-- select a port --</option>
              {ports.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="p-d-flex p-jc-center p-ai-center p-gap-3" style={{ marginTop: 8 }}>
            <Button label="Connect" onClick={onConnect} className="p-button-success w-full" />
          </div>
        </div>
        </div>
        </div>
      </main>
    </>
  );
}
