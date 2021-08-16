import styled from 'styled-components';

import { useEffect } from 'react';

let Box = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  height: 150px;

  border-radius: 5px;

  background-color: white;

  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;

  z-index: 200;
`;

let Mask = styled.div`
  position: fixed;
  top: 0;
  left: 0;

  height: 100vh;
  width: 100vw;

  z-index: 100;

  background-color: rgba(0, 0, 0, 0.2);
`;

function Modal({ children, onConfirm, onCancel, display }) {
  useEffect(() => {
    if (display) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [display]);

  if (!display) return null;

  return (
    <>
      <Mask />
      <Box>
        {children}
        <button onClick={onConfirm}>Confirm</button>
        <button onClick={onCancel}>Cancel</button>
      </Box>
    </>
  );
}

export default Modal;
