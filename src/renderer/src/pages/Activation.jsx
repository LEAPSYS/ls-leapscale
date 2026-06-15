import React, { useState } from 'react';
import PropTypes, { string } from 'prop-types';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import Brand from '../components/Brand';
import { ScrollPanel } from 'primereact/scrollpanel';

Activation.propTypes = {
  onDemo: PropTypes.func.isRequired,
  onActivate: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
  machineId: PropTypes.string.isRequired
};

export default function Activation({ onDemo, isActive, onActivate, machineId }) {
  const startContent = <Brand></Brand>;

  const endContent = (
    <React.Fragment>
      <Button label="Demo" onClick={() => onDemo()} visible={true} className="p-button-secondary p-2 mr-1" />
      <Button label="Activate" onClick={() => onActivate()} className="p-button-success p-2" />
    </React.Fragment>
  );

  return (
    <React.Fragment>
      <header className="p-0 flex-shrink-0">
        <Toolbar start={startContent} end={endContent} style={{ backgroundImage: 'linear-gradient(to left, var(--blue-50), var(--blue-100))' }} />
      </header>
      <main className="flex-1 overflow-hidden" style={{ minHeight: 0 }}>
        <ScrollPanel style={{ width: '100%', height: '100%' }}>
          <div className="surface-card py-2 px-3">
            {isActive ? (
              <React.Fragment>
                <h4 className="my-1"> Activated</h4>
                <p>Your machine is already activated. You can proceed to use the application.</p>
                <Button label="Good To Go" className="p-button-success p-2 mt-3" />
              </React.Fragment>
            ) : (
              <React.Fragment>
                <h4 className="my-1">Activation</h4>
                <span>{machineId.replace(/-/g, '').toUpperCase()}</span>
                <p>Once you click it may take couple of minutes to activate.</p>
              </React.Fragment>
            )}
          </div>
        </ScrollPanel>
      </main>
    </React.Fragment>
  );
}
