import { ProgressSpinner } from 'primereact/progressspinner';

export default function Progress({ visible = true, message = 'Loading...' }) {
  if (!visible) {
    return null;
  }

  return (
    <div
      className="flex flex-column justify-content-center align-items-center"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999
      }}
    >
      <ProgressSpinner />
      <p>{message}</p>
    </div>
  );
}
