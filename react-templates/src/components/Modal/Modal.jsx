import CustomButton from 'components/Button/Button';
import ModalCloseButton from 'components/Button/ModalCloseButton';
import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

export default function Modal({ maskCloseable, children }) {
  const [ modalVisible, setModalVisible ] = useState(false);
  const openModal = () => {
    setModalVisible(true);
    document.documentElement.style.overflow = 'hidden';
    document.body.style.paddingRight = `17px`;
  }
  const closeModal = () => {
    setModalVisible(false);
    document.documentElement.style.overflow = 'auto';
    document.body.style.paddingRight = `0`;
  }
  // dim 클릭 시 모달 닫기
  const onMaskClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  }
  return (
    <div>
      <CustomButton onClick={openModal} color="primary">기본모달 열기</CustomButton>
      { modalVisible && <ModalCommon className={modalVisible ? 'active' : ''}>
        <ModalCentered onClick={maskCloseable ? onMaskClick : null} tabIndex={0}>
          <ModalBox>
            {children}
            <ModalCloseButton onClose={closeModal}></ModalCloseButton>
            <div className="btn_wrap">
              <CustomButton onClick={closeModal} color="primary">확인</CustomButton>
              <CustomButton onClick={closeModal} color="secondary">취소</CustomButton>
            </div>
          </ModalBox>
        </ModalCentered>
      </ModalCommon> }
    </div>
  );
}

const modalOpen = keyframes`
from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
`

const modalInner = keyframes`
  from {
        transform: translate(0, 100px);
    }
    to {
        transform: translate(0, 0);
    }
`

const ModalCommon = styled.div`
  display:none;
  opacity: 0;
  position: fixed;
  top: 0;
  left: 0;
  overflow-y: auto;
  width: 100%;
  height: 100%;
  z-index: 9000;
  opacity: 1;
  animation-timing-function: ease-out;
  animation-name: ${modalOpen};
  background: rgba(0, 0, 0, 0.6);

  &.active {
    display: block;
    opacity: 1;
  }
`

const ModalCentered = styled.div`
display: flex;
justify-content: center;
align-items: center;
overflow: hidden;
width: 100%;
min-height: 100%;
padding: 50px 0;
box-sizing: border-box;
`

const ModalBox = styled.div`
position: relative;
z-index: 100;
width: 88.888888%;
max-width: 400px;
margin: auto;
padding: 28px 20px 20px;
border-radius: 4px;
background-color: #fff;
text-align: center;
border-radius:10px;
animation-timing-function: ease-out;
animation-duration: 0.3s;
animation-name: ${modalInner};
transform: translate(0, 0);
transition: transform 0.3s ease-out;
box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
`