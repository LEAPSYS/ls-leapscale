import { Button } from 'primereact/button';
import React, { useState } from 'react';
import { Toolbar } from 'primereact/toolbar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import PropTypes from 'prop-types';

Dashboard.propTypes = {
  live: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  stable: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onDisconnect: PropTypes.func.isRequired,
  portStatus: PropTypes.string.isRequired,
  ingredients: PropTypes.array,
  selectedIngredient: PropTypes.object,
  setSelectedIngredient: PropTypes.func,
  mangingStatus: PropTypes.object
};

export default function Dashboard({ live, stable, onDisconnect, portStatus }) {
  const [pendingItems] = useState([
    { id: 1, code: '709001', description: 'Salt Regular', uomKg: '2.5', quantity: 36.7 },
    { id: 2, code: '759014', description: 'Green Chilli', uomKg: '1.2', quantity: 0.07 },
    { id: 3, code: '759010', description: 'White Pepper', uomKg: '0.8', quantity: 0.009 },
    { id: 4, code: '709002', description: 'Rock Salt Powder', uomKg: '3.5', quantity: 1.19 }
  ]);
  const [selectedItem, setSelectedItem] = useState(null);

  const startContent = (
    <React.Fragment>
      <Button label="Disconnect" onClick={onDisconnect} className="p-button-danger" />
    </React.Fragment>
  );

  const centerContent = <span style={{ textAlign: 'center', marginTop: 0 }}>Weighing Dashboard</span>;

  const endContent = (
    <React.Fragment>
      <Button label="Submit" onClick={() => alert('Saved succesfully')} className="p-button-success" />
    </React.Fragment>
  );

  return (
    <>
      <Toolbar start={startContent} center={centerContent} end={endContent} />
      <div className="grid" style={{ height: 'calc(100vh - 70px)' }}>
        <div className="col-6" style={{ overflowY: 'auto' }}>
          <div className="border-round surface-border p-4">
            <h4 className="m-0 mb-3">Pending Items to Weigh</h4>
            <DataTable value={pendingItems} size="small" scrollable scrollHeight="flex" onRowClick={(e) => setSelectedItem(e.data)} selectionMode="single" selection={selectedItem} rowClassName={() => 'cursor-pointer'}>
              <Column field="code" header="Code" style={{ width: '30%' }}></Column>
              <Column field="description" header="Description" style={{ width: '30%' }}></Column>
              <Column field="uomKg" header="UOM (Kg)" style={{ width: '20%' }}></Column>
              <Column field="quantity" header="Quantity" style={{ width: '20%' }}></Column>
            </DataTable>
          </div>
        </div>
        <div className="col-6">
          <div className="border-round surface-border p-4" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {!selectedItem ? (
              <div className="flex flex-wrap align-items-center justify-content-center" style={{ height: '100%' }}>
                <div style={{ textAlign: 'center', color: 'var(--text-color-secondary)' }}>
                  <h5>Select an item from the list to begin weighing</h5>
                </div>
              </div>
            ) : (
              <>
              <div style={{ flex: 1 }}></div>
                <div className="p-d-flex p-jc-between p-ai-center" style={{ gap: 20, borderTop: '1px solid var(--surface-border)', paddingTop: 20 }}>
                  <div style={{ flex: 1, textAlign: 'center' }}>
                    <h5>Live Weight</h5>
                    <div className="p-text-bold" style={{ fontSize: '2rem', color: 'var(--primary-color)' }}>
                      {live}
                    </div>
                  </div>
                  <div style={{ flex: 1, textAlign: 'center' }}>
                    <h5>Stable Weight</h5>
                    <div className="p-text-bold" style={{ fontSize: '2rem', color: 'var(--primary-color)' }}>
                      {stable}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'center', marginTop: 20, borderTop: '1px solid var(--surface-border)', paddingTop: 20 }}>
                  <label style={{ color: 'var(--text-color-secondary)', fontSize: '0.875rem' }}>Scale Status</label>
                  <div style={{ fontSize: '1rem', fontWeight: 'bold', color: portStatus === 'connected' ? 'var(--green-500)' : 'var(--red-500)' }}>{portStatus.toUpperCase()}</div>
                </div>
                <Button label="Clear Selection" onClick={() => setSelectedItem(null)} className="p-button-outlined mb-3" />
                {/* <div className="mb-4">
                  <div className="mb-3">
                    <label className="font-bold" style={{ color: 'var(--text-color-secondary)' }}>
                      Code:
                    </label>
                    <div className="p-3" style={{ backgroundColor: 'var(--surface-card)', borderRadius: 'var(--border-radius)' }}>
                      {selectedItem.code}
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="font-bold" style={{ color: 'var(--text-color-secondary)' }}>
                      Description:
                    </label>
                    <div className="p-3" style={{ backgroundColor: 'var(--surface-card)', borderRadius: 'var(--border-radius)' }}>
                      {selectedItem.description}
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="font-bold" style={{ color: 'var(--text-color-secondary)' }}>
                      UOM (Kg):
                    </label>
                    <div className="p-3" style={{ backgroundColor: 'var(--surface-card)', borderRadius: 'var(--border-radius)' }}>
                      {selectedItem.uomKg}
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="font-bold" style={{ color: 'var(--text-color-secondary)' }}>
                      Quantity:
                    </label>
                    <div className="p-3" style={{ backgroundColor: 'var(--surface-card)', borderRadius: 'var(--border-radius)' }}>
                      {selectedItem.quantity}
                    </div>
                  </div>
                </div> */}
                
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
