import React from 'react';
import PropTypes from 'prop-types';

StatusBar.propTypes = {
  activationStatus: PropTypes.number.isRequired,
  syncing: PropTypes.bool
};

export default function StatusBar({ activationStatus, syncing }) {
  return (
    <>
      <footer className="bg-blue-600 text-white p-1">
        <div className="flex align-items-center justify-content-between">
          <div>
            <small>&copy; {new Date().getFullYear()} LEAPSYS SCPL</small>
          </div>
          <div className="flex align-items-center gap-3">
            <i className="pi pi-wifi text-green-300"></i>
            <i className={`pi ${syncing ? 'pi-spin text-yellow-400' : ''} pi-sync`}></i>
            {/* <i className="pi pi-globe"></i> */}
            <span className="flex align-items-center gap-1 pr-3">
              {activationStatus === 1 && (
                <>
                  <React.Fragment>
                    <i className="pi pi-circle-fill text-green-300" style={{ fontSize: '0.6rem' }}></i>
                    <small>Active</small>
                  </React.Fragment>
                </>
              )}
              {activationStatus !== 1 && (
                <>
                  <React.Fragment>
                    <i className="pi pi-circle-fill text-red-600" style={{ fontSize: '0.6rem' }}></i>
                    <small>Inactive</small>
                  </React.Fragment>
                </>
              )}
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
