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
  onBack: PropTypes.func.isRequired
};

const PAGE_SIZE = 6;

export default function JobCard({ operation, onSelect, onBack }) {
  const [selected, setSelected] = useState(null);
  const [jobCards, setJobCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNum, setPageNum] = useState(0);

  const getOperationValue = (selectedOperation) => {
    if (typeof selectedOperation === 'string') return selectedOperation;
    return selectedOperation?.name || selectedOperation?.operationName || selectedOperation?.operationCode || '';
  };

  useEffect(() => {
    setPageNum(0);
  }, [operation]);

  useEffect(() => {
    const fetchJobCards = async () => {
      try {
        setLoading(true);
        const response = await apiService.executeSp({
          paramFor: 'GET_JC_BY_OP',
          param1: getOperationValue(operation),
          param2: 'Open',
          param3: String(PAGE_SIZE),
          param4: String(pageNum),
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
  }, [operation, pageNum]);

  useEffect(() => {
    setSelected(null);
  }, [pageNum]);

  const handlePrevious = () => setPageNum((prev) => Math.max(prev - 1, 0));
  const handleNext = () => setPageNum((prev) => (jobCards.length < PAGE_SIZE ? prev : prev + 1));

  const getJobCardName = (jobCard) => {
    if (typeof jobCard === 'string') return jobCard;
    return jobCard?.name || jobCard?.jobCardNo || jobCard?.jobCardNumber || jobCard?.id || 'Job Card';
  };

  const getJobCardDetails = (jobCard) => {
    if (typeof jobCard === 'string') return null;

    return {
      workOrder: jobCard?.work_order || '-',
      item: jobCard?.production_item || '-',
      quantity: jobCard?.for_quantity ?? '-'
    };
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
            <div className="flex align-items-center justify-content-between">
              <h3 className="my-1">Choose Job Card</h3>
              <div>
                <Button icon="pi pi-chevron-left" onClick={handlePrevious} disabled={pageNum === 0 || loading} className="p-button-outlined p-2 mr-2" />
                <Button icon="pi pi-chevron-right" iconPos="right" onClick={handleNext} disabled={jobCards.length < PAGE_SIZE || loading} className="p-button-outlined p-2" />
              </div>
            </div>
            {loading ? (
              <p className="p-4">Loading job cards...</p>
            ) : jobCards.length === 0 ? (
              <p className="p-4">No open job cards available.</p>
            ) : (
              <div className="grid p-2">
                {jobCards.map((jobCard, index) => {
                  const details = getJobCardDetails(jobCard);
                  return (
                    <div className="col-6" key={getJobCardKey(jobCard, index)}>
                      <div style={getStyle(jobCard)} className="text-center p-3 border-round-sm font-bold" onClick={() => setSelected(jobCard)} role="button" tabIndex={0}>
                        <div>Job Card: {getJobCardName(jobCard)}</div>
                        {details && (
                          <React.Fragment>
                            <div>Work Order: {details.workOrder}</div>
                            <div>
                              Item: {details.item} (Qty: {details.quantity})
                            </div>
                          </React.Fragment>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </ScrollPanel>
      </main>
    </React.Fragment>
  );
}
