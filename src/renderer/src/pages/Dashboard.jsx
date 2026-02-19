import { Button } from 'primereact/button';

export default function Dashboard({ live, stable, onDisconnect }) {
  return (
    <div className="p-d-flex p-jc-center p-ai-center" style={{ height: '100%' }}>
      <div style={{ width: 480, padding: 24, borderRadius: 8, boxShadow: '0 8px 20px rgba(0,0,0,0.12)' }}>
        <h2 style={{ marginTop: 0, textAlign: 'center' }}>Scale Dashboard</h2>
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
        <div className="p-d-flex p-jc-center p-mt-4">
          <Button label="Disconnect" onClick={onDisconnect} className="p-button-secondary" />
        </div>
      </div>
    </div>
  );
}
