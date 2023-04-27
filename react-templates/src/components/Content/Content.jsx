import React from 'react';
import styled from 'styled-components';

const ContentBox = styled.div`
  padding: 10px;
`

export default function Content({children}) {
  return (
    <ContentBox>{children}</ContentBox>
  );
}

