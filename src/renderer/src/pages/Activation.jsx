import React, { useState } from 'react';
import PropTypes, { string } from 'prop-types';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import Brand from '../components/Brand';
import { ScrollPanel } from 'primereact/scrollpanel';
import Progress from '../components/Progress';
import { useEffect } from 'react';
import { useRef } from 'react';

Activation.propTypes = {
  onActivate: PropTypes.func.isRequired,
  onProceed: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired
};

export default function Activation({ onProceed, isActive, onActivate }) {
  const startContent = <Brand></Brand>;
  const [loading, setLoading] = useState(false);
  const [inactive, setInactive] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isActive !== null && isActive !== undefined) {
      startTimer();
      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    } else {
      setInactive(true);
    }
  }, [isActive, onProceed]);

  const startTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setLoading(true);
    timerRef.current = setTimeout(() => {
      setLoading(false);
      if (isActive) {
        onProceed();
      } else {
        setInactive(true);
      }
    }, 5000);
  };

  const retryActivation = async () => {
    setInactive(false);
    await onActivate();
    startTimer();
  };

  const endContent = <React.Fragment>{inactive && <Button label="Activate" onClick={() => retryActivation()} className="p-button-success p-2 " />}</React.Fragment>;

  return (
    <React.Fragment>
      <header className="p-0 flex-shrink-0">
        <Toolbar start={startContent} end={endContent} style={{ backgroundImage: 'linear-gradient(to left, var(--blue-50), var(--blue-100))' }} />
      </header>
      <main className="flex-1 overflow-hidden flex flex-column justify-content-center align-items-center" style={{ minHeight: 0 }}>
        <ScrollPanel style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          {inactive ? (
            <div className="flex flex-column justify-content-center align-items-center text-center">
              <p className="surface-card py-2 px-3">This device is not activated. Please activate your device to continue.</p>
            </div>
          ) : (
            <div className="surface-card py-2 px-3 flex flex-column justify-content-center align-items-center">
              <Progress visible={loading} message="Activating..." />
            </div>
          )}
        </ScrollPanel>
      </main>
    </React.Fragment>
  );
}
