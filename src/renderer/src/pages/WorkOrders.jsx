import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import Brand from '../components/Brand';
import { ScrollPanel } from 'primereact/scrollpanel';
import apiService from '../services/apiService';

WorkOrders.propTypes = {
  onSelect: PropTypes.func.isRequired,
  hwId: PropTypes.string,
  activationKey: PropTypes.string,
  location: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
};

export default function WorkOrders({ onSelect, hwId, activationKey, location }) {
  const [selected, setSelected] = useState(null);
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWorkOrders = async () => {
      try {
        setLoading(true);
        const response = await apiService.getWorkOrders(hwId, activationKey, location);
        const list = response?.data?.data || response?.data || response;
        if (Array.isArray(list)) {
          setWorkOrders(list);
        } else {
          setWorkOrders([]);
        }
      } catch (err) {
        console.error('Error fetching work orders:', err);
        setWorkOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkOrders();
  }, [hwId, activationKey, location]);

  const startContent = <Brand></Brand>;

  const endContent = (
    <React.Fragment>
      <Button label="Back" onClick={() => onSelect(null)} className="p-button-danger p-2 mr-1" />
      <Button label="Continue" onClick={() => onSelect(selected)} disabled={!selected} className="p-button-primary p-2" />
    </React.Fragment>
  );

  const getStyle = (wo) => {
    const isSelected = selected === wo || (selected && wo && typeof selected === 'object' && typeof wo === 'object' && selected.name === wo.name);
    if (isSelected) {
      return { backgroundColor: 'var(--primary-color)', color: 'var(--primary-color-text)' };
    } else {
      return { backgroundColor: 'var(--tertiary-color)', color: 'var(--tertiary-color-text)', border: '2px dashed var(--surface-500)' };
    }
  };

  const getWorkOrderName = (wo) => {
    if (typeof wo === 'string') return wo;
    return wo?.name || wo?.id || 'Work Order';
  };

  const getWorkOrderKey = (wo, index) => {
    if (typeof wo === 'string') return wo;
    return wo?.name || wo?.id || index;
  };

  return (
    <React.Fragment>
      <header className="p-0 flex-shrink-0">
        <Toolbar start={startContent} end={endContent} style={{ backgroundImage: 'linear-gradient(to left, var(--blue-50), var(--blue-100))' }} />
      </header>
      <main className="flex-1 overflow-hidden" style={{ minHeight: 0 }}>
        <ScrollPanel style={{ width: '100%', height: '100%' }}>
          <div className="surface-card py-2 px-3">
            <h3 className="my-1">Choose Work Order</h3>
            {loading ? (
              <p className="p-4">Loading work orders...</p>
            ) : workOrders.length === 0 ? (
              <p className="p-4">No work orders available.</p>
            ) : (
              <div className="grid p-2">
                {workOrders.map((wo, index) => (
                  <div className="col-4" key={getWorkOrderKey(wo, index)}>
                    <div style={getStyle(wo)} className="text-center p-2 border-round-sm flex flex-column justify-content-center" onClick={() => setSelected(wo)} role="button" tabIndex={0}>
                      <div className="font-bold text-base">{getWorkOrderName(wo)}</div>
                      {typeof wo === 'object' && (
                        <>
                          {wo.production_item && <div className="text-xs font-semibold mt-1">{wo.production_item}</div>}
                          {wo.item_name && <div className="text-xs font-normal mt-1">{wo.item_name}</div>}
                          {wo.owner && <div className="text-xs font-normal opacity-90 mt-1">Owner: {wo.owner}</div>}
                          {wo.status && <div className="text-xs font-semibold opacity-80 mt-1">Status: {wo.status}</div>}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollPanel>
      </main>
    </React.Fragment>
  );
}
