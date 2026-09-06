import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'primereact/button';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Toolbar } from 'primereact/toolbar';
import Brand from '../components/Brand';
import apiService from '../services/apiService';

Operation.propTypes = {
    onSelect: PropTypes.func.isRequired,
    hwId: PropTypes.string.isRequired,
    onLogout: PropTypes.func.isRequired
};

export default function Operation({ onSelect, onLogout, hwId }) {
    const [selected, setSelected] = useState(null);
    const [operations, setOperations] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchOperations = async () => {
            try {
                setLoading(true);
                const response = await apiService.getHmiData({
                    spRequest: {
                        paramFor: 'GET_OP_LIST',
                        param1: '',
                        param2: '',
                        param3: '',
                        param4: '',
                        param5: '',
                        param6: '',
                        param7: '',
                        param8: '',
                        param9: '',
                        param10: ''
                    },
                    hmiDeviceRequest: {
                        hwId: hwId
                    }
                });
                const data = response?.data?.data || response?.data || response;
                setOperations(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching operations:', error);
                setOperations([]);
            } finally {
                setLoading(false);
            }
        };

        fetchOperations();
    }, []);

    const getOperationName = (operation) => {
        if (typeof operation === 'string') return operation;
        return operation?.name || operation?.operationName || operation?.operationCode || operation?.id || 'Operation';
    };

    const getOperationKey = (operation, index) => {
        if (typeof operation === 'string') return operation;
        return operation?.id || operation?._id || operation?.name || index;
    };

    const getStyle = (operation) => {
        if (selected === operation) {
            return { backgroundColor: 'var(--primary-color)', color: 'var(--primary-color-text)' };
        }

        return { backgroundColor: 'var(--tertiary-color)', color: 'var(--tertiary-color-text)', border: '2px dashed var(--surface-500)' };
    };

    const endContent = (
        <React.Fragment>
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
                    <div className="py-2 px-3">
                        <h3 className="my-1">Choose Operation</h3>
                        {loading ? (
                            <p className="p-4">Loading operations...</p>
                        ) : operations.length === 0 ? (
                            <p className="p-4">No operations available.</p>
                        ) : (
                            <div className="grid p-2">
                                {operations.map((operation, index) => (
                                    <div className="col-4" key={getOperationKey(operation, index)}>
                                        <div style={getStyle(operation)} className="text-center p-3 border-round-sm font-bold" onClick={() => setSelected(operation)} role="button" tabIndex={0}>
                                            {getOperationName(operation)}
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
