import "../assets/css/Loading.css";
export function LoadingSpinner() {
    return (
      <div className="loading-overlay">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading...</p>
      </div>
    );
  }