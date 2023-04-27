import React from 'react';
import styled from 'styled-components';

const TitleWrap = styled.div`
  padding: 20px;
  background: ${({ theme }) => theme.colors.black }
`

const TitleTxt = styled.h2`
  color: ${({ theme }) => theme.colors.white }
`

export default function Title({children}) {
  return (
    <TitleWrap>
      <TitleTxt>{children}</TitleTxt>
    </TitleWrap>
  );
}

