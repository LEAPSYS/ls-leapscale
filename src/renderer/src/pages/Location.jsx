import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import Brand from '../components/Brand';
import { ScrollPanel } from 'primereact/scrollpanel';

const DUMMY_LOCATIONS = ['Workstation WS1', 'Workstation WS2', 'Workstation WS3', 'Workstation WS4'];

Location.propTypes = {
  onSelect: PropTypes.func.isRequired
};

export default function Location({ onSelect }) {
  const [selected, setSelected] = useState(null);

  const startContent = <Brand></Brand>;

  const endContent = (
    <React.Fragment>
      <Button label="Back" onClick={() => onSelect(null)} className="p-button-danger p-2 mr-1" />
      <Button label="Continue" onClick={() => onSelect(selected)} disabled={!selected} className="p-button-success p-2" />
    </React.Fragment>
  );

  const getStyle = (loc) => {
    if (selected === loc) {
      return { backgroundColor: 'var(--primary-color)', color: 'var(--primary-color-text)' };
    } else {
      return { backgroundColor: 'var(--tertiary-color)', color: 'var(--tertiary-color-text)', border: '2px dashed var(--surface-500)' };
    }
  };

  return (
    <>
      <header className="p-0">
        <Toolbar start={startContent} end={endContent} style={{ backgroundImage: 'linear-gradient(to left, var(--blue-50), var(--blue-100))' }} />
      </header>
      <main className="flex-1 p-0">
        
         <ScrollPanel style={{ width: '100%', height: '435px' }}>
        <div className="surface-card py-2 px-3 ">
          <h3 className="my-1">Location Page</h3>
          <p>Once you click it may take couple of minutes to activate.</p>
          <div className="grid p-4">
            {DUMMY_LOCATIONS.map((loc) => (
              <div className="col-4" key={loc}>
                <div style={getStyle(loc)} className={`text-center p-6 border-round-sm font-bold`} onClick={() => setSelected(loc)} role="button" tabIndex={0}>
                  {loc}
                </div>
              </div>
            ))}
          </div>
        </div>
        </ScrollPanel>
      </main>
    </>
  );
}
