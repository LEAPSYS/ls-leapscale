import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ScrollPanel } from 'primereact/scrollpanel';
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

const getItemName = (item) => {
    if (typeof item === 'string') return item;
    return getValue(item, ['item', 'item_name', 'production_item', 'item_code', 'name'], 'Work Order Item');
};

const getItemQuantity = (item) => {
    if (typeof item === 'string') return '-';
    return getValue(item, ['quantity', 'for_quantity', 'qty']);
};

const getItemKey = (item, index) => {
    if (typeof item === 'string') return item;
    return item?.id || item?._id || item?.item_code || item?.item || index;
};

export default function WorkOrderItems({ jobCard, operation, hwId, live, stable, portStatus, onSelect, onBack }) {
    const [items, setItems] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const [selectedItem, setSelectedItem] = React.useState(null);
    const [weighedItems, setWeighedItems] = React.useState({});
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
                        <div className="surface-100 border-round-md p-3 mb-3">
                            <div className="text-xs text-color-secondary uppercase">Job Card</div>
                            <div className="text-lg font-bold">{jobCardName}</div>
                            <div className="text-sm text-color-secondary mt-1">Work Order: {workOrder}</div>
                        </div>
                        {loading ? (
                            <p className="p-4">Loading work order items...</p>
                        ) : error ? (
                            <p className="p-4">{error}</p>
                        ) : items.length === 0 ? (
                            <p className="p-4">No work order items available.</p>
                        ) : (
                            <div className="flex gap-3">
                                <DataTable
                                    className="w-7 pt-2 pb-2"
                                    scrollable
                                    scrollHeight="410px"
                                    value={items.map((item, index) => ({ key: getItemKey(item, index), name: getItemName(item), quantity: getItemQuantity(item) }))}
                                    size="small"
                                    onRowClick={(e) => setSelectedItem(e.data)}
                                    selectionMode="single"
                                    selection={selectedItem}
                                    rowClassName={() => 'cursor-pointer'}
                                >
                                    <Column field="name" header="Item"></Column>
                                    <Column field="quantity" header="Quantity"></Column>
                                    <Column header="Measured Weight" body={(rowData) => weighedItems[rowData.key] ?? '-'}></Column>
                                    <Column
                                        header="Status"
                                        style={{ width: '80px', textAlign: 'center' }}
                                        body={(rowData) => (weighedItems[rowData.key] !== undefined ? <i className="pi pi-check-circle" style={{ color: 'var(--green-500)', fontSize: '1.1rem' }}></i> : <i className="pi pi-circle" style={{ color: 'var(--surface-400)', fontSize: '1.1rem' }}></i>)}
                                    ></Column>
                                </DataTable>
                                <div className="w-5">
                                    {!selectedItem ? (
                                        <div className="flex-1 ">
                                            <div className="flex flex-wrap align-items-center justify-content-center px-2 my-2" style={{ border: '2px solid var(--surface-500)', borderRadius: '5px', padding: '0.25rem' }}>
                                                <h6 className="m-0 p-0" style={{ fontSize: '0.75rem' }}>
                                                    Select an item from the list to begin weighing
                                                </h6>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex-1 ">
                                            <div className="flex flex-wrap align-items-center justify-content-between  px-2 my-2" style={{ border: '2px solid var(--surface-500)', borderRadius: '5px', padding: '0.25rem' }}>
                                                <h6 className="m-0 p-0">{(portStatus || 'disconnected').toUpperCase()}</h6>
                                                <i className="pi pi-circle-fill" style={{ fontSize: '0.75rem', color: portStatus === 'connected' ? 'var(--green-500)' : 'var(--red-500)' }}></i>
                                            </div>
                                            <div className="flex flex-wrap flex-column p-2 my-2" style={{ border: '2px solid var(--surface-500)', borderRadius: '5px', padding: '0.25rem' }}>
                                                <div className="flex  ">
                                                    <div className="flex-1 mr-1 mb-2" style={{ border: '2px solid var(--surface-500)', borderRadius: '5px' }}>
                                                        <h6 className="m-0 p-0 text-center" style={{ fontSize: '0.75rem', borderBottom: '2px solid var(--surface-500)' }}>
                                                            Live
                                                        </h6>
                                                        <div className="p-text-bold text-center" style={{ fontSize: '1.2rem', color: 'var(--primary-color)' }}>
                                                            {live}
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 ml-1 mb-2" style={{ border: '2px solid var(--surface-500)', borderRadius: '5px' }}>
                                                        <h6 className="m-0 p-0 text-center " style={{ fontSize: '0.75rem', borderBottom: '2px solid var(--surface-500)' }}>
                                                            Stable
                                                        </h6>
                                                        <div className="p-text-bold text-center" style={{ fontSize: '1.2rem', color: 'var(--primary-color)' }}>
                                                            {stable}
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button label="Accept" onClick={handleAccept}></Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollPanel>
            </main>
        </React.Fragment>
    );
}