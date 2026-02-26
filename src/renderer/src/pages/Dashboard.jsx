import { Button } from 'primereact/button';
import React, { useState } from 'react';
import { Toolbar } from 'primereact/toolbar';
import { Skeleton } from 'primereact/skeleton';
import PropTypes from 'prop-types';

Dashboard.propTypes = {
  live: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  stable: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onDisconnect: PropTypes.func.isRequired,
  portStatus: PropTypes.string.isRequired
};

export default function Dashboard({ live, stable, ingredients, onDisconnect, portStatus }) {
  const [selectedIngredient, setSelectedIngredient] = useState(null);
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

  function mangingStatus(item) {
    if(item.requiredWeight === item.stableWeight) {
      return 'Completed';
    } else {
      return 'Pending';
    }
    
  }
  return (
    <>
      <Toolbar start={startContent} center={centerContent} end={endContent} />
      <div className="grid">
        <div className="col-5">
          <div className="border-round surface-border p-4">
            <ul className="m-0 p-0 list-none">
              {!selectedIngredient &&
                ingredients.map((ingredient) => (
                  <li key={ingredient.id} className="mb-3">
                    <div className="flex align-items-center" style={{ cursor: 'pointer' }} onClick={() => setSelectedIngredient(ingredient)}>
                      <img src={ingredient.thumbnail} alt={ingredient.name} style={{ width: '4rem', height: '4rem', borderRadius: '50%', objectFit: 'cover', marginRight: '10px' }} />
                      <div style={{ fontWeight: 'bold' }}>{ingredient.name}</div>
                    </div>
                  </li>
                ))}
              {selectedIngredient && (
                <>
                  <button onClick={() => setSelectedIngredient(null)} style={{ marginBottom: '15px', cursor: 'pointer' }}>
                    ← Back
                  </button>
                  {selectedIngredient.items.map((item) => (
                    <li key={item.id} style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>  
                    <div className='flex justify-content-between'>
                      <div>{item.name}</div>
                      <div className='flex gap-2'>
                      <div>{item.requiredWeight}</div>
                      <button onClick={mangingStatus(item)}>Status</button>
                      </div>
                      
</div>
                    </li>
                  ))}
                </>
              )}
            </ul>

            {/* <ul className="m-0 p-0 list-none">
              <li className="mb-3">
                <div className="flex">
                  <Skeleton shape="circle" size="4rem" className="mr-2"></Skeleton>
                  <div style={{ flex: '1' }}>
                    <Skeleton width="100%" className="mb-2"></Skeleton>
                    <Skeleton width="75%"></Skeleton>
                  </div>
                </div>
              </li>
              <li className="mb-3">
                <div className="flex">
                  <Skeleton shape="circle" size="4rem" className="mr-2"></Skeleton>
                  <div style={{ flex: '1' }}>
                    <Skeleton width="100%" className="mb-2"></Skeleton>
                    <Skeleton width="75%"></Skeleton>
                  </div>
                </div>
              </li>
              <li className="mb-3">
                <div className="flex">
                  <Skeleton shape="circle" size="4rem" className="mr-2"></Skeleton>
                  <div style={{ flex: '1' }}>
                    <Skeleton width="100%" className="mb-2"></Skeleton>
                    <Skeleton width="75%"></Skeleton>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex">
                  <Skeleton shape="circle" size="4rem" className="mr-2"></Skeleton>
                  <div style={{ flex: '1' }}>
                    <Skeleton width="100%" className="mb-2"></Skeleton>
                    <Skeleton width="75%"></Skeleton>
                  </div>
                </div>
              </li>
            </ul> */}
          </div>
        </div>
        <div className="col-7">
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
