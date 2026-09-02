import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'primereact/button';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Toolbar } from 'primereact/toolbar';
import Brand from '../components/Brand';
import apiService from '../services/apiService';

JobCard.propTypes = {
  operation: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  onSelect: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired
};

export default function JobCard({ operation, onSelect, onBack, onLogout }) {
  const [selected, setSelected] = useState(null);
  const [jobCards, setJobCards] = useState([]);
  const [loading, setLoading] = useState(false);

  const getOperationValue = (selectedOperation) => {
    if (typeof selectedOperation === 'string') return selectedOperation;
    return selectedOperation?.name || selectedOperation?.operationName || selectedOperation?.operationCode || '';
  };

  useEffect(() => {
    const fetchJobCards = async () => {
      try {
        setLoading(true);
        const response = await apiService.executeSp({
          paramFor: 'GET_JC_BY_OP',
          param1: getOperationValue(operation),
          param2: 'Open',
          param3: '10',
          param4: '0',
          param5: '',
          param6: '',
          param7: '',
          param8: '',
          param9: '',
          param10: ''
        });
        const data = response?.data?.data || response?.data || response;
        setJobCards(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching job cards:', error);
        setJobCards([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobCards();
  }, [operation]);

  const getJobCardName = (jobCard) => {
    if (typeof jobCard === 'string') return jobCard;
    return jobCard?.name || jobCard?.jobCardNo || jobCard?.jobCardNumber || jobCard?.id || 'Job Card';
  };

  const getJobCardKey = (jobCard, index) => {
    if (typeof jobCard === 'string') return jobCard;
    return jobCard?.id || jobCard?._id || jobCard?.jobCardNo || jobCard?.name || index;
  };

  const getStyle = (jobCard) => {
    if (selected === jobCard) {
      return { backgroundColor: 'var(--primary-color)', color: 'var(--primary-color-text)' };
    }

    return { backgroundColor: 'var(--tertiary-color)', color: 'var(--tertiary-color-text)', border: '2px dashed var(--surface-500)' };
  };

  const endContent = (
    <React.Fragment>
      <Button label="Back" onClick={onBack} className="p-button-danger p-2 mr-1" />
      <Button label="Logout" onClick={onLogout} className="p-button-danger p-2 mr-1" />
      <Button label="Continue" onClick={() => onSelect(selected)} disabled={!selected} className="p-button-success p-2" />
    </React.Fragment>
  );

  return (
    <React.Fragment>
      <header className="p-0 flex-shrink-0">
        <Toolbar start={<Brand />} end={endContent} style={{ backgroundImage: 'linear-gradient(to left, var(--blue-50), var(--blue-100))' }} />
      </header>
      <main className="flex-1 overflow-hidden" style={{ minHeight: 0 }}>
        <ScrollPanel style={{ width: '100%', height: '100%' }}>
          <div className="surface-card py-2 px-3 ">
            <h3 className="my-1">Choose Job Card</h3>
            {loading ? (
              <p className="p-4">Loading job cards...</p>
            ) : jobCards.length === 0 ? (
              <p className="p-4">No open job cards available.</p>
            ) : (
              <div className="grid p-2">
                {jobCards.map((jobCard, index) => (
                  <div className="col-4" key={getJobCardKey(jobCard, index)}>
                    <div style={getStyle(jobCard)} className="text-center p-3 border-round-sm font-bold" onClick={() => setSelected(jobCard)} role="button" tabIndex={0}>
                      {getJobCardName(jobCard)}
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
