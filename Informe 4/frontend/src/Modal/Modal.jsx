import React from "react";

function Modal({ mensaje, onClose }) {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button style={styles.closeBtn} onClick={onClose}>✖</button>
        <p>{mensaje}</p>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)", display: "flex",
    justifyContent: "center", alignItems: "center"
  },
  modal: {
    backgroundColor: "white", padding: "20px", borderRadius: "10px",
    position: "relative", width: "300px", textAlign: "center"
  },
  closeBtn: {
    position: "absolute", top: "10px", right: "10px",
    border: "none", background: "transparent", fontSize: "18px", cursor: "pointer"
  }
};

export default Modal;
