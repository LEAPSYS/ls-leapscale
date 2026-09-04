import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'primereact/button';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Toolbar } from 'primereact/toolbar';
import Brand from '../components/Brand';
import apiService from '../services/apiService';

JobCard.propTypes = {
    workstation: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    operation: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    onSelect: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired
};

const PAGE_SIZE = 6;

export default function JobCard({ operation, onSelect, onBack, workstation }) {
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
                    paramFor: 'GET_JC_LIST',
                    param1: getOperationValue(operation),
                    param2: 'Open',
                    param3: getWorkStationName(workstation),
                    param4: String(PAGE_SIZE),
                    param5: String(pageNum),
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
    }, [operation, workstation, pageNum]);

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

    const getWorkStationName = (ws) => {
        console.log('TEST');
        console.log(ws);
        if (typeof ws === 'string') return ws;
        return ws?.name || ws?.workstation || ws?.workstationCode || ws?.id || 'Workstation';
    };

    const getJobCardKey = (jobCard, index) => {
        if (typeof jobCard === 'string') return jobCard;
        return jobCard?.id || jobCard?._id || jobCard?.jobCardNo || jobCard?.name || index;
    };

    const getStyle = (jobCard) => {
        if (selected === jobCard) {
            return { backgroundColor: '#eff6ff', borderColor: '#3b82f6', boxShadow: '0 0 0 1px #3b82f6' };
        }

        return { backgroundColor: 'var(--surface-card)', borderColor: 'var(--surface-200)', boxShadow: 'none' };
    };

    const endContent = (
        <React.Fragment>
            <Button label="Back" onClick={onBack} className="p-button-primary p-2 mr-1" />
            <Button label="Next" onClick={() => onSelect(selected)} disabled={!selected} className="p-button-success p-2" />
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
                                    const isSelected = selected === jobCard;
                                    return (
                                        <div className="col-12 md:col-6 lg:col-4" key={getJobCardKey(jobCard, index)}>
                                            <div style={{ ...getStyle(jobCard), borderWidth: '1px', borderStyle: 'solid', transition: 'all 0.15s ease' }} className="border-round-lg p-2 cursor-pointer" onClick={() => setSelected(jobCard)} role="button" tabIndex={0}>
                                                <div className="flex align-items-center justify-content-between mb-1">
                                                    <div className="flex align-items-center gap-2">
                                                        <span className="flex align-items-center justify-content-center border-round-md" style={{ width: '28px', height: '28px', backgroundColor: '#e0e7ff', color: '#4f46e5' }}>
                                                            <i className="pi pi-clipboard text-sm" />
                                                        </span>
                                                        <span className="text-xs font-medium text-color-secondary uppercase">Job Card</span>
                                                    </div>
                                                    {isSelected && (
                                                        <span className="flex align-items-center gap-1 text-xs font-medium" style={{ color: '#3b82f6' }}>
                                                            <i className="pi pi-check-circle" />
                                                            SELECTED
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-lg font-bold mb-1">{getJobCardName(jobCard)}</div>
                                                {details && (
                                                    <React.Fragment>
                                                        <div className="mb-1">
                                                            <div className="text-xs text-color-secondary uppercase mb-0">Work Order</div>
                                                            <div className="font-semibold">{details.workOrder}</div>
                                                        </div>
                                                        <div className="flex align-items-center justify-content-between pt-1" style={{ borderTop: '1px solid var(--surface-200)' }}>
                                                            <div className="flex align-items-center gap-2">
                                                                <span className="flex align-items-center justify-content-center border-round-md" style={{ width: '24px', height: '24px', backgroundColor: '#dcfce7', color: '#16a34a' }}>
                                                                    <i className="pi pi-box text-xs" />
                                                                </span>
                                                                <div>
                                                                    <div className="text-xs text-color-secondary uppercase">Item</div>
                                                                    <div className="font-semibold">{details.item}</div>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="text-xs text-color-secondary uppercase">Qty</div>
                                                                <div className="font-semibold">{details.quantity}</div>
                                                            </div>
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
