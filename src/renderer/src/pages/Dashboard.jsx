import { Button } from 'primereact/button';
import React, { useState } from 'react';
import { Toolbar } from 'primereact/toolbar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import PropTypes from 'prop-types';
import Brand from '../components/Brand';
import { ScrollPanel } from 'primereact/scrollpanel';

Dashboard.propTypes = {
  live: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  stable: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onDisconnect: PropTypes.func.isRequired,
  portStatus: PropTypes.string.isRequired,
  ingredients: PropTypes.array,
  selectedIngredient: PropTypes.object,
  setSelectedIngredient: PropTypes.func,
  mangingStatus: PropTypes.object,
  onBack: PropTypes.func.isRequired
};

export default function Dashboard({ live, stable, onDisconnect, portStatus, onBack }) {
  const [pendingItems] = useState([
    { id: 1, code: '709001', description: 'Salt Regular', uomKg: '2.5', quantity: 36.7 },
    { id: 2, code: '759014', description: 'Green Chilli', uomKg: '1.2', quantity: 0.07 },
    { id: 3, code: '759010', description: 'White Pepper', uomKg: '0.8', quantity: 0.009 },
    { id: 4, code: '709002', description: 'Rock Salt Powder', uomKg: '3.5', quantity: 1.19 },
    { id: 1, code: '709001', description: 'Salt Regular', uomKg: '2.5', quantity: 36.7 },
    { id: 2, code: '759014', description: 'Green Chilli', uomKg: '1.2', quantity: 0.07 },
    { id: 3, code: '759010', description: 'White Pepper', uomKg: '0.8', quantity: 0.009 },
    { id: 4, code: '709002', description: 'Rock Salt Powder', uomKg: '3.5', quantity: 1.19 },
    { id: 1, code: '709001', description: 'Salt Regular', uomKg: '2.5', quantity: 36.7 },
    { id: 2, code: '759014', description: 'Green Chilli', uomKg: '1.2', quantity: 0.07 },
    { id: 3, code: '759010', description: 'White Pepper', uomKg: '0.8', quantity: 0.009 },
    { id: 4, code: '709002', description: 'Rock Salt Powder', uomKg: '3.5', quantity: 1.19 }
  ]);
  const [selectedItem, setSelectedItem] = useState(null);

  const startContent = <Brand></Brand>;

  // <React.Fragment>
  //   <Button label="Disconnect" onClick={onDisconnect} className="p-button-danger" />
  // </React.Fragment>

  // const centerContent = <span style={{ textAlign: 'center', marginTop: 0 }}>Weighing Dashboard</span>;

  const endContent = (
    <React.Fragment>
      <Button label="Back" onClick={onBack} className="p-button-danger p-2 mr-1" />
      <Button label="Submit" onClick={() => alert('Saved succesfully')} className="p-button-success" />
    </React.Fragment>
  );

  return (
    <React.Fragment>
      <header className="p-0 flex-shrink-0">
        <Toolbar start={startContent} end={endContent} style={{ backgroundImage: 'linear-gradient(to left, var(--blue-50), var(--blue-100))' }} />
      </header>
      <main className="flex-1 overflow-hidden" style={{ minHeight: 0 }}>
        <ScrollPanel style={{ width: '100%', height: '100%' }}>
          <div className="surface-card py-2 px-3 ">
            <div className="flex gap-3">
              <DataTable className="w-8" scrollable scrollHeight="430px" value={pendingItems} size="small" onRowClick={(e) => setSelectedItem(e.data)} selectionMode="single" selection={selectedItem} rowClassName={() => 'cursor-pointer'}>
                <Column field="code" header="Code"></Column>

                {/* <Column field="uomKg" header="UOM (Kg)"></Column> */}
                <Column header="Material Quantity" body={(rowData) => `${rowData.quantity} (${rowData.uomKg})`}></Column>
                <Column header="Measured Weight" body={(rowData) => rowData.measuredWeight ?? 0}></Column>
              </DataTable>
              <div className="w-4">
                {/* {!selectedItem ? (
                  <div className="flex flex-wrap align-items-center justify-content-center px-3">
                    <h5 className="m-0">Select an item from the list to begin weighing</h5>
                  </div>
                ) : (
                  <div className="px-3 flex flex-column align-items-center justify-content-center gap-3">
                    <h5 className="m-0">Live Weight</h5>

                    <div className="p-text-bold" style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }}>
                      {live}
                    </div>

                    <h5 className="m-0">Stable Weight</h5>
                    <div className="p-text-bold" style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }}>
                      {stable}
                    </div>
                    <label style={{ color: 'var(--text-color-secondary)', fontSize: '0.875rem' }}>Scale Status</label>
                    <div style={{ fontSize: '1rem', fontWeight: 'bold', color: portStatus === 'connected' ? 'var(--green-500)' : 'var(--red-500)' }}>{portStatus.toUpperCase()}</div>
                    <Button label="Clear Selection" onClick={() => setSelectedItem(null)}></Button>
                  </div>
                )} */}
                {!selectedItem ? (
                  <div className="flex-1 ">
                    <div className="flex flex-wrap align-items-center justify-content-center px-2 m-2" style={{ border: '2px solid var(--surface-500)', borderRadius: '5px', padding: '0.25rem' }}>
                      <h6 className="m-0 p-0" style={{ fontSize: '0.75rem' }}>
                        Select an item from the list to begin weighing
                      </h6>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 ">
                    <div className="flex flex-wrap align-items-center justify-content-between  px-2 m-2" style={{ border: '2px solid var(--surface-500)', borderRadius: '5px', padding: '0.25rem' }}>
                      <h6 className="m-0 p-0">{portStatus.toUpperCase()}</h6>
                      <i className="pi pi-circle-fill" style={{ fontSize: '0.75rem', color: portStatus === 'connected' ? 'var(--green-500)' : 'var(--red-500)' }}></i>
                    </div>
                    <div className="flex flex-wrap flex-column    p-2 m-2" style={{ border: '2px solid var(--surface-500)', borderRadius: '5px', padding: '0.25rem' }}>
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
                      <Button label="Accept"></Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Main content goes here */}
          {/* <div className="surface-card py-2 px-3 ">
            <div className="grid" style={{ height: 'calc(100vh - 70px)' }}>
              <div className="col-8" style={{ height: '100%' }}>
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
              <div className="col-4">
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
                      <Button label="Clear Selection" onClick={() => setSelectedItem(null)} className="p-button-outlined mb-3" /> */}
          {/*Trying out the codes */}
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
          {/* </>
                  )}
                </div>
              </div>
            </div>
          </div> */}
        </ScrollPanel>
      </main>
    </React.Fragment>
  );
}
