import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import Brand from '../components/Brand';

Activation.propTypes = {
  onProceed: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  onActivate: PropTypes.func.isRequired
};

export default function Activation({ onProceed, onBack, onActivate }) {
  const startContent = <Brand></Brand>;

  const endContent = (
    <React.Fragment>
      <Button label="Back" onClick={() => onBack()} visible={false} className="p-button-plain p-button-danger m-0 p-2 mr-1" />
      <Button label="Demo" onClick={() => onProceed()} visible={true} className="p-button-secondary p-2 mr-1" />
      <Button label="Activate" onClick={() => onActivate()} className="p-button-success p-2" />
    </React.Fragment>
  );

  return (
    <>
      <header className="p-0">
        <Toolbar start={startContent} end={endContent} style={{ backgroundImage: 'linear-gradient(to left, var(--blue-50), var(--blue-100))' }} />
      </header>
      <main className="flex-1 p-0">
        <div className="surface-card p-6 h-full">
          <h3>Activation Pending</h3>
          <p>Once you click it may take couple of minutes to activate.</p>
        </div>
      </main>
    </>
  );
}
