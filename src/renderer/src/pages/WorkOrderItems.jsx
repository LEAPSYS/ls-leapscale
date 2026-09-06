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

const getItemKey = (item, index) => {
    if (typeof item === 'string') return item;
    return item?.idx ?? item?.item_code ?? index;
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
                        <h3 className="my-1">
                            {jobCardName} - Work Order: {workOrder}
                        </h3>
                        {loading ? (
                            <p className="p-4">Loading work order items...</p>
                        ) : error ? (
                            <p className="p-4">{error}</p>
                        ) : items.length === 0 ? (
                            <p className="p-4">No work order items available.</p>
                        ) : (
                            <DataTable
                                className="w-12 pt-2 pb-2"
                                scrollable
                                scrollHeight="calc(100vh - 130px)"
                                value={items.map((item, index) => ({ key: getItemKey(item, index), idx: item?.idx, itemCode: item?.item_code, itemName: item?.item_name, requiredQty: item?.required_qty }))}
                                size="small"
                                dataKey="key"
                                onSelectionChange={(e) => setSelectedItem(e.value)}
                                selectionMode="single"
                                selection={selectedItem}
                                rowClassName={() => 'cursor-pointer'}
                            >
                                <Column field="idx" header="#" style={{ width: '60px' }}></Column>
                                <Column field="itemCode" header="Item Code"></Column>
                                <Column field="itemName" header="Item Name"></Column>
                                <Column field="requiredQty" header="Required Qty"></Column>
                                <Column
                                    header="Weighing"
                                    style={{ width: '420px' }}
                                    body={(rowData) =>
                                        rowData.key === selectedItem?.key ? (
                                            <div className="flex align-items-center gap-3">
                                                <div className="flex-1 text-center" style={{ border: '2px solid var(--surface-500)', borderRadius: '5px' }}>
                                                    <h6 className="m-0 p-0" style={{ fontSize: '0.7rem', borderBottom: '2px solid var(--surface-500)' }}>
                                                        Live
                                                    </h6>
                                                    <div className="p-text-bold" style={{ fontSize: '1.1rem', color: 'var(--primary-color)' }}>
                                                        {live}
                                                    </div>
                                                </div>
                                                <div className="flex-1 text-center" style={{ border: '2px solid var(--surface-500)', borderRadius: '5px' }}>
                                                    <h6 className="m-0 p-0" style={{ fontSize: '0.7rem', borderBottom: '2px solid var(--surface-500)' }}>
                                                        Stable
                                                    </h6>
                                                    <div className="p-text-bold" style={{ fontSize: '1.1rem', color: 'var(--primary-color)' }}>
                                                        {stable}
                                                    </div>
                                                </div>
                                                <Button label="Accept" size="small" onClick={handleAccept}></Button>
                                            </div>
                                        ) : (
                                            <span>{weighedItems[rowData.key] ?? '-'}</span>
                                        )
                                    }
                                ></Column>
                                <Column
                                    header="Status"
                                    style={{ width: '80px', textAlign: 'center' }}
                                    body={(rowData) => (weighedItems[rowData.key] !== undefined ? <i className="pi pi-check-circle" style={{ color: 'var(--green-500)', fontSize: '1.1rem' }}></i> : <i className="pi pi-circle" style={{ color: 'var(--surface-400)', fontSize: '1.1rem' }}></i>)}
                                ></Column>
                            </DataTable>
                        )}
                    </div>
                </ScrollPanel>
            </main>
        </React.Fragment>
    );
}