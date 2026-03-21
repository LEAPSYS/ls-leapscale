import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';

const DUMMY_WORK_ORDERS = ['WO-001', 'WO-002', 'WO-003', 'WO-004', 'WO-005', 'WO-006'];

WorkOrders.propTypes = {
  onSelect: PropTypes.func.isRequired
};

export default function WorkOrders({ onSelect }) {
  const [selected, setSelected] = useState(null);

  const startContent = (
    <React.Fragment>
      <Button label="Back" onClick={() => onSelect(null)} className="p-button-plain" />
    </React.Fragment>
  );

  const centerContent = <span style={{ textAlign: 'center', marginTop: 0 }}>Choose Work Order</span>;

  const endContent = (
    <React.Fragment>
      <Button label="Continue" onClick={() => onSelect(selected)} disabled={!selected} className="p-button-primary" />
    </React.Fragment>
  );

  const getStyle = (wo) => {
    if (selected === wo) {
      return { backgroundColor: 'var(--primary-color)', color: 'var(--primary-color-text)' };
    } else {
      return { backgroundColor: 'var(--tertiary-color)', color: 'var(--tertiary-color-text)', border: '2px dashed var(--surface-500)' };
    }
  };

  return (
    <div className="p-d-flex p-jc-center p-ai-center" style={{ height: '100%' }}>
      <Toolbar start={startContent} center={centerContent} end={endContent} />
      <div>
        <div className="grid p-4">
          {DUMMY_WORK_ORDERS.map((wo) => (
            <div className="col-4" key={wo}>
              <div style={getStyle(wo)} className={`text-center p-6 border-round-sm font-bold`} onClick={() => setSelected(wo)} role="button" tabIndex={0}>
                {wo}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
