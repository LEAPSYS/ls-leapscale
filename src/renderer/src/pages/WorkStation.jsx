import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import Brand from '../components/Brand';
import { ScrollPanel } from 'primereact/scrollpanel';
import apiService from '../services/apiService';

WorkStation.propTypes = {
    onBack: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    hwId: PropTypes.string,
    operation: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    activationKey: PropTypes.string
};

export default function WorkStation({ onBack, onSelect, hwId, operation, activationKey }) {
    const [selected, setSelected] = useState(null);
    const [workstations, setWorkStations] = useState([]);
    const [loading, setLoading] = useState(false);

    const getOperationValue = (selectedOperation) => {
        if (typeof selectedOperation === 'string') return selectedOperation;
        return selectedOperation?.name || selectedOperation?.operationName || selectedOperation?.operationCode || '';
    };

    useEffect(() => {
        const fetchWorkstations = async () => {
            try {
                setLoading(true);
                const response = await apiService.executeSp({
                    paramFor: 'GET_WS_LIST',
                    param1: getOperationValue(operation),
                    param2: 'Open',
                    param3: '',
                    param4: '',
                    param5: '',
                    param6: '',
                    param7: '',
                    param8: '',
                    param9: '',
                    param10: ''
                });
                const data = response?.data?.data || response?.data || response;
                setWorkStations(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching workstations:', error);
                setWorkStations([]);
            } finally {
                setLoading(false);
            }
        };
        fetchWorkstations();
    }, [hwId, activationKey]);

    const startContent = <Brand></Brand>;

    const endContent = (
        <React.Fragment>
            <Button label="Back" onClick={onBack} className="p-button-primary p-2 mr-1" />
            <Button label="Continue" onClick={() => onSelect(selected)} disabled={!selected} className="p-button-success p-2" />
        </React.Fragment>
    );

    const getStyle = (ws) => {
        if (selected === ws) {
            return { backgroundColor: 'var(--primary-color)', color: 'var(--primary-color-text)' };
        } else {
            return { backgroundColor: 'var(--tertiary-color)', color: 'var(--tertiary-color-text)', border: '2px dashed var(--surface-500)' };
        }
    };

    const getWorkStationName = (ws) => {
        console.log('TEST');
        console.log(ws);
        if (typeof ws === 'string') return ws;
        return ws?.name || ws?.workstation || ws?.workstationCode || ws?.id || 'Workstation';
    };

    const getWorkStationKey = (ws, index) => {
        if (typeof ws === 'string') return ws;
        return ws?.id || ws?._id || ws?.name || index;
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
                        ) : workstations.length === 0 ? (
                            <p className="p-4">No workstations available.</p>
                        ) : (
                            <div className="grid p-2">
                                {workstations.map((ws, index) => (
                                    <div className="col-4" key={getWorkStationKey(ws, index)}>
                                        <div style={getStyle(ws)} className={`text-center p-3 border-round-sm font-bold`} onClick={() => setSelected(ws)} role="button" tabIndex={0}>
                                            {getWorkStationName(ws)}
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
