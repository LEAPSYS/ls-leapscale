import React from 'react';
import { Button } from 'primereact/button';

function Landing({ ports, selectedPort, onSelectPort, onConnect, onRefresh }) {
  return (
    <div className="p-d-flex p-jc-center p-ai-center" style={{ height: '100%' }}>
      <div
        style={{
          width: 420,
          padding: 24,
          borderRadius: 8,
          boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
          background: 'rgba(255,255,255,0.02)'
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: 12, textAlign: 'center' }}>Connect to Scale</h2>

        <div className="p-field p-mb-3">
          <label htmlFor="ports">Available Ports</label>
          <select
            id="ports"
            value={selectedPort}
            onChange={(e) => onSelectPort(e.target.value)}
            className="p-inputtext p-mt-2"
            style={{ width: '100%', padding: '10px', borderRadius: 6 }}
          >
            <option value="">-- select a port --</option>
            {ports.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div className="p-d-flex p-jc-center p-ai-center p-gap-3" style={{ marginTop: 8 }}>
          <Button label="Refresh" onClick={onRefresh} className="p-button-plain" />
          <Button label="Connect" onClick={onConnect} className="p-button-success" />
        </div>
      </div>
    </div>
  );
}

export default Landing;
