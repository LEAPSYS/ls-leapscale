import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'primereact/button';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Toolbar } from 'primereact/toolbar';
import Brand from '../components/Brand';
import apiService from '../services/apiService';

WorkOrderItems.propTypes = {
    jobCard: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    operation: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    hwId: PropTypes.string.isRequired,
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

export default function WorkOrderItems({ jobCard, operation, hwId, onSelect, onBack }) {
    const [items, setItems] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');
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

    const endContent = (
        <React.Fragment>
            <Button label="Back" onClick={onBack} className="p-button-primary p-2 mr-1" />
            <Button label="Continue" onClick={() => onSelect(jobCard)} className="p-button-success p-2" />
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
                        <h3 className="my-1">Work Order Items</h3>
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
                            <div className="grid p-2">
                                {items.map((item, index) => (
                                    <div className="col-12 md:col-6 lg:col-4" key={getItemKey(item, index)}>
                                        <div className="border-round-lg p-3" style={{ backgroundColor: 'var(--surface-card)', border: '2px dashed var(--surface-300)' }}>
                                            <div className="flex align-items-center gap-2 mb-2">
                                                <span className="flex align-items-center justify-content-center border-round-md" style={{ width: '28px', height: '28px', backgroundColor: '#dcfce7', color: '#16a34a' }}>
                                                    <i className="pi pi-box text-sm" />
                                                </span>
                                                <span className="text-xs font-medium text-color-secondary uppercase">Item</span>
                                            </div>
                                            <div className="text-lg font-bold">{getItemName(item)}</div>
                                            <div className="text-sm mt-2">Quantity: <span className="font-semibold">{getItemQuantity(item)}</span></div>
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