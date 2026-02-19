import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';

const DUMMY_LOCATIONS = ['Location A', 'Location B', 'Location C', 'Location D'];

function Location({ onSelect }) {
  const [selected, setSelected] = useState(null);

  const startContent = (
    <React.Fragment>
      <Button label="Back" onClick={() => onSelect(null)} className="p-button-plain" />
    </React.Fragment>
  );

  const centerContent = <span style={{ textAlign: 'center', marginTop: 0 }}>Choose Location</span>;

  const endContent = (
    <React.Fragment>
      <Button label="Continue" onClick={() => onSelect(selected)} disabled={!selected} className="p-button-primary" />
    </React.Fragment>
  );

  return (
    <div className="p-d-flex p-jc-center p-ai-center" style={{ height: '100%' }}>
      <Toolbar start={startContent} center={centerContent} end={endContent} />
      <div>
        <div className="grid p-4">
          {DUMMY_LOCATIONS.map((loc) => (
            <div className="col-4" key={loc}>
              <div className={`text-center p-6 border-round-sm font-bold ${selected === loc ? 'bg-primary' : 'bg-tertiary border-2 border-dashed border-300'}`} onClick={() => setSelected(loc)} role="button" tabIndex={0}>
                {loc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Location.propTypes = {
  onSelect: PropTypes.func.isRequired
};

export default Location;
