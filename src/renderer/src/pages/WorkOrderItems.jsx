import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Sidebar } from 'primereact/sidebar';
import { Toolbar } from 'primereact/toolbar';
import Brand from '../components/Brand';
import apiService from '../services/apiService';

WorkOrderItems.propTypes = {
    jobCard: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    operation: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    hwId: PropTypes.string.isRequired,
    live: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    stable: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    portStatus: PropTypes.string,
    onSelect: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired
};

const getValue = (jobCard, keys, fallback = '-') => {
    if (typeof jobCard === 'string') return fallback;
    for (const key of keys) {
        if (jobCard?.[key] !== undefined && jobCard?.[key] !== null && jobCard[key] !== '') {
            return jobCard[key];
        }
    }
    return fallback;
};

const getItemKey = (item, index) => {
    if (typeof item === 'string') return item;
    return item?.idx ?? item?.item_code ?? index;
};

const formatQuantity = (value) => {
    const quantity = Number(value);
    return Number.isFinite(quantity) ? quantity.toFixed(3) : '-';
};

const getStatusColor = (status, isWeighed) => {
    if (!isWeighed) return 'var(--surface-400)';

    const normalizedStatus = String(status || '').toLowerCase();
    return ['red', 'failed', 'rejected', 'error'].includes(normalizedStatus) ? 'var(--red-500)' : 'var(--green-500)';
};

export default function WorkOrderItems({ jobCard, operation, hwId, live, stable, portStatus, onSelect, onBack }) {
    const [items, setItems] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const [selectedItem, setSelectedItem] = React.useState(null);
    const [weighedItems, setWeighedItems] = React.useState({});
    const [expandedRows, setExpandedRows] = React.useState({});
    const [batchesByItem, setBatchesByItem] = React.useState({});
    const [batchLoading, setBatchLoading] = React.useState({});
    const jobCardName = typeof jobCard === 'string' ? jobCard : getValue(jobCard, ['name', 'jobCardNo', 'jobCardNumber', 'id'], 'Job Card');
    const workOrder = getValue(jobCard, ['work_order', 'workOrder']);
    const operationName = typeof operation === 'string' ? operation : getValue(operation, ['name', 'operationName', 'operationCode'], '');

    React.useEffect(() => {
        const fetchWorkOrderItems = async () => {
            if (!operationName || workOrder === '-') {
                setItems([]);
                setError('Operation or work order is missing.');
                return;
            }

            try {
                setLoading(true);
                setError('');
                const response = await apiService.getHmiData({
                    spRequest: {
                        paramFor: 'GET_WO_ITEMS',
                        param1: operationName,
                        param2: workOrder,
                        param3: 'string',
                        param4: 'string',
                        param5: 'string',
                        param6: 'string',
                        param7: 'string',
                        param8: 'string',
                        param9: 'string',
                        param10: 'string'
                    },
                    hmiDeviceRequest: {
                        hwId
                    }
                });
                const data = response?.data?.data || response?.data || response;
                setItems(Array.isArray(data) ? data : []);
            } catch (fetchError) {
                console.error('Error fetching work order items:', fetchError);
                setItems([]);
                setError('Unable to load work order items.');
            } finally {
                setLoading(false);
            }
        };

        fetchWorkOrderItems();
    }, [operationName, workOrder, hwId]);

    const allItemsWeighed = items.length > 0 && items.every((item, index) => weighedItems[getItemKey(item, index)] !== undefined);

    const handleAccept = () => {
        if (!selectedItem) return;
        setWeighedItems((prev) => ({ ...prev, [selectedItem.key]: stable }));
        setSelectedItem(null);
    };

    const handleRowClick = (rowData) => setSelectedItem((prev) => (prev?.key === rowData.key ? prev : rowData));

    React.useEffect(() => {
        let keyBuffer = '';
        let timeoutId = null;

        const handleKeyDown = (e) => {
            // Ignore if typing inside input / textarea
            if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
                return;
            }

            if (e.key === 'Enter') {
                const query = keyBuffer.trim();
                keyBuffer = '';
                if (timeoutId) clearTimeout(timeoutId);

                if (query) {
                    alert(`Typed text: ${query}`);
                }

                if (query && items.length > 0) {
                    const normalizedQuery = query.toLowerCase();
                    const foundIndex = items.findIndex((item) => {
                        const code = String(item?.item_code || '').toLowerCase();
                        return code === normalizedQuery;
                    });

                    if (foundIndex !== -1) {
                        const targetItem = items[foundIndex];
                        const key = getItemKey(targetItem, foundIndex);
                        setSelectedItem({
                            key,
                            idx: targetItem?.idx,
                            itemCode: targetItem?.item_code,
                            itemName: targetItem?.item_name,
                            requiredQty: targetItem?.required_qty,
                            status: targetItem?.status,
                            measuredWeight: weighedItems[key]
                        });
                    }
                }
            } else if (e.key.length === 1) {
                keyBuffer += e.key;
                if (timeoutId) clearTimeout(timeoutId);
                // Clear buffer after 1.5 seconds of inactivity to avoid stale buffer
                timeoutId = setTimeout(() => {
                    keyBuffer = '';
                }, 1500);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [items, weighedItems]);


    const fetchBatches = async (rowData) => {
        if (batchesByItem[rowData.key]) return;

        try {
            setBatchLoading((prev) => ({ ...prev, [rowData.key]: true }));
            const response = await apiService.getHmiData({
                spRequest: {
                    paramFor: 'GET_BATCH_NO',
                    param1: workOrder,
                    param2: operationName,
                    param3: rowData.itemCode,
                    param4: 'string',
                    param5: 'string',
                    param6: 'string',
                    param7: 'string',
                    param8: 'string',
                    param9: 'string',
                    param10: 'string'
                },
                hmiDeviceRequest: {
                    hwId
                }
            });
            const data = response?.data?.data || response?.data || response;
            setBatchesByItem((prev) => ({ ...prev, [rowData.key]: Array.isArray(data) ? data : [] }));
        } catch (fetchError) {
            console.error('Error fetching batches:', fetchError);
            setBatchesByItem((prev) => ({ ...prev, [rowData.key]: [] }));
        } finally {
            setBatchLoading((prev) => ({ ...prev, [rowData.key]: false }));
        }
    };

    const handleBatchClick = (event, rowData) => {
        event.stopPropagation();
        setExpandedRows((prev) => {
            const next = { ...prev };
            if (next[rowData.key]) {
                delete next[rowData.key];
            } else {
                next[rowData.key] = true;
            }
            return next;
        });
        fetchBatches(rowData);
    };

    const rowExpansionTemplate = (rowData) => {
        const batches = batchesByItem[rowData.key];
        const loading = batchLoading[rowData.key];

        return (
            <div className="p-2">
                {loading ? (
                    <p className="m-0">Loading batches...</p>
                ) : batches && batches.length > 0 ? (
                    <DataTable value={batches} size="small">
                        <Column field="item_code" header="Item Code"></Column>
                        <Column field="batch_no" header="Batch No"></Column>
                    </DataTable>
                ) : (
                    <p className="m-0">No batches found.</p>
                )}
            </div>
        );
    };

    const endContent = (
        <React.Fragment>
            <Button label="Back" onClick={onBack} className="p-button-primary p-2 mr-1" />
            <Button label="Submit" onClick={() => onSelect(jobCard)} className="p-button-success p-2" disabled={!allItemsWeighed} />
        </React.Fragment>
    );

    return (
        <React.Fragment>
            <header className="p-0 flex-shrink-0">
                <Toolbar start={<Brand />} end={endContent} style={{ backgroundImage: 'linear-gradient(to left, var(--blue-50), var(--blue-100))' }} />
            </header>
            <main className="flex-1 overflow-hidden" style={{ minHeight: 0 }}>
                <ScrollPanel style={{ width: '100%', height: '100%' }}>
                    <div className="surface-card py-2 px-3">
                        <h3 className="my-1">
                            {jobCardName} ({workOrder})
                        </h3>
                        {loading ? (
                            <p className="p-4">Loading work order items...</p>
                        ) : error ? (
                            <p className="p-4">{error}</p>
                        ) : items.length === 0 ? (
                            <p className="p-4">No work order items available.</p>
                        ) : (
                            <DataTable
                                className="w-12 pt-2 pb-2 wo-items-table"
                                value={items.map((item, index) => {
                                    const key = getItemKey(item, index);
                                    return { key, idx: item?.idx, itemCode: item?.item_code, itemName: item?.item_name, requiredQty: item?.required_qty, status: item?.status, measuredWeight: weighedItems[key] };
                                })}
                                size="small"
                                dataKey="key"
                                onRowClick={(e) => handleRowClick(e.data)}
                                rowClassName={(rowData) => (rowData.key === selectedItem?.key ? 'cursor-pointer p-highlight' : 'cursor-pointer')}
                                expandedRows={expandedRows}
                                onRowToggle={(e) => setExpandedRows(e.data)}
                                rowExpansionTemplate={rowExpansionTemplate}
                            >
                                <Column header="" style={{ width: '40px', textAlign: 'center' }} body={(rowData) => <i className="pi pi-circle-fill" aria-label={rowData.status || (rowData.measuredWeight !== undefined ? 'Complete' : 'Pending')} style={{ color: getStatusColor(rowData.status, rowData.measuredWeight !== undefined), fontSize: '0.7rem' }}></i>}></Column>
                                <Column field="idx" header="#" style={{ width: '60px' }}></Column>
                                <Column field="itemCode" header="Item Code"></Column>
                                <Column field="requiredQty" header="Required Qty" headerStyle={{ textAlign: 'right' }} bodyStyle={{ textAlign: 'right' }} body={(rowData) => formatQuantity(rowData.requiredQty)}></Column>
                                <Column field="measuredWeight" header="Measured Weight" body={(rowData) => rowData.measuredWeight ?? '-'}></Column>
                                <Column header="Actions" style={{ width: '80px', textAlign: 'center' }} body={(rowData) => <Button icon={expandedRows[rowData.key] ? 'pi pi-times' : 'pi pi-list'} aria-label={expandedRows[rowData.key] ? 'Hide batches' : 'View batches'} className="p-button-sm p-button-outlined" onClick={(e) => handleBatchClick(e, rowData)} />}></Column>
                            </DataTable>
                        )}
                    </div>
                </ScrollPanel>
            </main>
            <Sidebar visible={!!selectedItem} position="right" onHide={() => setSelectedItem(null)} header={selectedItem?.itemName}>
                <div className="flex flex-column gap-3">
                    <div className="flex gap-3">
                        <div className="flex-1 text-center" style={{ border: '2px solid var(--surface-500)', borderRadius: '5px' }}>
                            <h6 className="m-0 p-0" style={{ fontSize: '0.8rem', borderBottom: '2px solid var(--surface-500)' }}>
                                Live
                            </h6>
                            <div className="p-text-bold" style={{ fontSize: '1.4rem', color: 'var(--primary-color)' }}>
                                {live}
                            </div>
                        </div>
                        <div className="flex-1 text-center" style={{ border: '2px solid var(--surface-500)', borderRadius: '5px' }}>
                            <h6 className="m-0 p-0" style={{ fontSize: '0.8rem', borderBottom: '2px solid var(--surface-500)' }}>
                                Stable
                            </h6>
                            <div className="p-text-bold" style={{ fontSize: '1.4rem', color: 'var(--primary-color)' }}>
                                {stable}
                            </div>
                        </div>
                    </div>
                    <div className="flex align-items-center justify-content-between" style={{ border: '2px solid var(--surface-500)', borderRadius: '5px', padding: '0.5rem' }}>
                        <span>Scale Status</span>
                        <span className="font-bold" style={{ color: portStatus === 'connected' ? 'var(--green-500)' : 'var(--red-500)' }}>
                            {(portStatus || 'disconnected').toUpperCase()}
                        </span>
                    </div>
                    <Button
                        label="Accept"
                        onClick={handleAccept}
                        disabled={
                            !selectedItem ||
                            Number.isNaN(Number(stable)) ||
                            Number.isNaN(Number(selectedItem?.requiredQty)) ||
                            Math.abs(Number(stable) - Number(selectedItem.requiredQty)) > 0.01
                        }
                    ></Button>
                </div>
            </Sidebar>
        </React.Fragment>
    );
}
