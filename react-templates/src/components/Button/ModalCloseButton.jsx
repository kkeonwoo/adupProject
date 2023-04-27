import React from 'react';
import styled from 'styled-components';

export default function ModalCloseButton({ isOpen, onClose }) {
  const handleCloseModal = () => {
    onClose(!isOpen);
  }
  return (
    <ModalBtnClose onClick={handleCloseModal}></ModalBtnClose>
  );
}

const ModalBtnClose = styled.button`
  display:block;
  position: absolute;
  right: 10px;
  top:10px;
  width:20px;
  height: 20px;
  background-color: red;
`