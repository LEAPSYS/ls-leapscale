import { Button } from 'primereact/button';
import React from 'react';
import { Toolbar } from 'primereact/toolbar';
import { Skeleton } from 'primereact/skeleton';

import PropTypes from 'prop-types';

export default function Dashboard({ live, stable, onDisconnect }) {
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
      <div className="grid">
        <div className="col-4">
          <div className="border-round surface-border p-4">
            <ul className="m-0 p-0 list-none">
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
            </ul>
          </div>
        </div>
        <div className="col-8">
          <div className="flex flex-wrap align-items-center justify-content-center" style={{ height: '100%' }}>
            <div>
              <div className="p-d-flex p-jc-between p-ai-center p-mt-4" style={{ gap: 20 }}>
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

Dashboard.propTypes = {
  live: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  stable: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onDisconnect: PropTypes.func.isRequired
};
