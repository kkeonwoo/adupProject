import React from 'react';
import SearchBar from 'components/common/SearchBar';
import HeaderButton from 'components/common/HeaderButton';
import logo from 'assets/images/img/logo.svg'

import { Link } from 'react-router-dom';
import { styled } from 'styled-components';

export default function Header() {
    return (
        <HeaderContainer>
            <h1>
                <Logo to="/" preventScrollReset={true} role='link' aria-label='사자고 로고'></Logo>
            </h1>
            <SearchBar />
            <div className="util">
                <HeaderButton path="mypage">마이페이지</HeaderButton>
                <HeaderButton path="recent">최근 본 상품</HeaderButton>
                <HeaderButton path="cart">장바구니</HeaderButton>
            </div>
        </HeaderContainer>
    );
}

const Logo = styled(Link)`
    display: inline-block;
    width: 215px;

    &::before {
        content: '';
        display: block;
        padding-top: calc(56 / 215 * 100%);
        background: url(${logo}) no-repeat center center / 100% auto;
    }
`

const HeaderContainer = styled.header`
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
`