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
  flex-direction: column;
  justify-content: center;
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

let ControlsBox = styled.div`
  margin-top: 1rem;

  > button {
    margin: 0 0.5rem;
    padding: 0.2rem;
  }
`;

let ContentBox = styled.div``;

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
        <ContentBox>{children}</ContentBox>
        <ControlsBox>
          <button onClick={onConfirm}>Confirm</button>
          <button onClick={onCancel}>Cancel</button>
        </ControlsBox>
      </Box>
    </>
  );
}

export default Modal;
