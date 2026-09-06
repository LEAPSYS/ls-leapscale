import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { ScrollPanel } from 'primereact/scrollpanel';
import Brand from '../components/Brand';

Connect.propTypes = {
    ports: PropTypes.arrayOf(PropTypes.string).isRequired,
    selectedPort: PropTypes.string.isRequired,
    onSelectPort: PropTypes.func.isRequired,
    onConnect: PropTypes.func.isRequired,
    onRefresh: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired
};

export default function Connect({ ports, selectedPort, onSelectPort, onConnect, onRefresh, onBack }) {
    const startContent = <Brand></Brand>;

    const endContent = (
        <React.Fragment>
            <Button label="Back" onClick={onBack} className="p-button-primary p-2 mr-1" />
            <Button label="Continue" onClick={onConnect} disabled={!selectedPort} className="p-button-success p-2" />
        </React.Fragment>
    );

    const getPortStyle = (port) => {
        if (selectedPort === port) {
            return { backgroundColor: 'var(--primary-color)', color: 'var(--primary-color-text)' };
        }

        return { backgroundColor: 'var(--tertiary-color)', color: 'var(--tertiary-color-text)', border: '2px dashed var(--surface-500)' };
    };

    return (
        <React.Fragment>
            <header className="p-0 flex-shrink-0">
                <Toolbar start={startContent} end={endContent} style={{ backgroundImage: 'linear-gradient(to left, var(--blue-50), var(--blue-100))' }} />
            </header>
            <main className="flex-1 overflow-hidden" style={{ minHeight: 0 }}>
                <ScrollPanel style={{ width: '100%', height: '100%' }}>
                    <div className="surface-card py-2 px-3 ">
                        <div className="flex align-items-center justify-content-between">
                            <h3 className="my-1">Choose Port</h3>
                            <Button label="Refresh" onClick={onRefresh} className="p-button-outlined p-2" />
                        </div>
                        {ports.length === 0 ? (
                            <p className="p-4">No ports available.</p>
                        ) : (
                            <div className="grid p-2">
                                {ports.map((port) => (
                                    <div className="col-4" key={port}>
                                        <div style={getPortStyle(port)} className="text-center p-3 border-round-sm font-bold" onClick={() => onSelectPort(port)} role="button" tabIndex={0}>
                                            {port}
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
