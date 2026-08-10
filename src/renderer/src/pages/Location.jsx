import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import Brand from '../components/Brand';
import { ScrollPanel } from 'primereact/scrollpanel';
import apiService from '../services/apiService';

Location.propTypes = {
  onSelect: PropTypes.func.isRequired,
  hwId: PropTypes.string,
  activationKey: PropTypes.string
};

export default function Location({ onSelect, hwId, activationKey }) {
  const [selected, setSelected] = useState(null);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWorkstations = async () => {
      try {
        setLoading(true);
        const response = await apiService.getWorkStations(hwId, activationKey);
        const data = response?.data?.data || response?.data || response;
        if (Array.isArray(data)) {
          setLocations(data);
        } else {
          setLocations([]);
        }
      } catch (err) {
        console.error('Error fetching workstations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkstations();
  }, [hwId, activationKey]);

  const startContent = <Brand></Brand>;

  const endContent = (
    <React.Fragment>
      <Button label="Logout" onClick={() => onSelect(null)} className="p-button-danger p-2 mr-1" />
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

  const getLocationName = (loc) => {
    if (typeof loc === 'string') return loc;
    return loc?.name || loc?.workstationName || loc?.workstationCode || loc?.id || 'Workstation';
  };

  const getLocationKey = (loc, index) => {
    if (typeof loc === 'string') return loc;
    return loc?.id || loc?._id || loc?.name || index;
  };

  return (
    <React.Fragment>
      <header className="p-0 flex-shrink-0">
        <Toolbar start={startContent} end={endContent} style={{ backgroundImage: 'linear-gradient(to left, var(--blue-50), var(--blue-100))' }} />
      </header>
      <main className="flex-1 overflow-hidden" style={{ minHeight: 0 }}>
        <ScrollPanel style={{ width: '100%', height: '100%' }}>
          <div className="surface-card py-2 px-3 ">
            <h3 className="my-1">Choose Workstation</h3>
            {loading ? (
              <p className="p-4">Loading workstations...</p>
            ) : locations.length === 0 ? (
              <p className="p-4">No workstations available.</p>
            ) : (
              <div className="grid p-2">
                {locations.map((loc, index) => (
                  <div className="col-4" key={getLocationKey(loc, index)}>
                    <div style={getStyle(loc)} className={`text-center p-3 border-round-sm font-bold`} onClick={() => setSelected(loc)} role="button" tabIndex={0}>
                      {getLocationName(loc)}
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
