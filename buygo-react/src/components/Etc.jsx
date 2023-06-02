import React from 'react';
import { Link } from 'react-router-dom';
import { styled } from 'styled-components';

export default function Etc() {
    return (
        <EtcList>
            <Link to={'/login'}>로그인</Link>
            <Link to={'/signUp'}>회원가입</Link>
            <Link to={'/cs'}>고객센터</Link>
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