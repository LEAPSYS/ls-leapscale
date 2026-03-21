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
    { id: 1, code: 'WO-001-A', description: 'Ingredient A', uomKg: '2.5', quantity: 5 },
    { id: 2, code: 'WO-001-B', description: 'Ingredient B', uomKg: '1.2', quantity: 3 },
    { id: 3, code: 'WO-001-C', description: 'Ingredient C', uomKg: '0.8', quantity: 2 },
    { id: 4, code: 'WO-001-D', description: 'Ingredient D', uomKg: '3.5', quantity: 1 }
  ]);

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
            <DataTable value={pendingItems} size="small" scrollable scrollHeight="flex">
              <Column field="code" header="Code" style={{ width: '30%' }}></Column>
              <Column field="description" header="Description" style={{ width: '30%' }}></Column>
              <Column field="uomKg" header="UOM (Kg)" style={{ width: '20%' }}></Column>
              <Column field="quantity" header="Quantity" style={{ width: '20%' }}></Column>
            </DataTable>
          </div>
        </div>
        <div className="col-6">
          <div className="flex flex-wrap align-items-center justify-content-center" style={{ height: '100%' }}>
            <div>
              <div className="p-d-flex p-jc-between p-ai-center p-mt-" style={{ gap: 20 }}>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <h4>Live Weight</h4>
                  <div className="p-text-bold" style={{ fontSize: '1.8rem' }}>
                    {live}
                  </div>
                </div>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <h4>Stable Weight</h4>
                  <div className="p-text-bold" style={{ fontSize: '1.8rem' }}>
                    {stable}
                  </div>
                </div>
              </div>
              <div className="p-d-flex p-jc-center p-mt-4"></div>
              <div style={{ textAlign: 'center', marginTop: 20 }}>
                <h7>Scale Status</h7>
                <div style={{ fontSize: '0.5rem', fontWeight: 'bold', color: portStatus === 'connected' ? 'green' : 'red' }}>{portStatus.toUpperCase()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
