import React from 'react';
import { styled } from 'styled-components';
import NavButton from './common/NavButton';

export default function Etc() {
    return (
        <EtcList>
            <NavButton link={'/login'}>로그인</NavButton>
            <NavButton link={'/signUp'}>회원가입</NavButton>
            <NavButton link={'/cs'}>고객센터</NavButton>
        </EtcList>
    );
}

const EtcList = styled.div`
    display: flex;
    align-items: center;
    gap: 28px;
    margin-left: auto;
    padding: 0 14px;
`