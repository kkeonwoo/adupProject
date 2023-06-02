import Etc from 'components/Etc';
import React from 'react';
import { styled } from 'styled-components';

export default function Visual() {
    return (
        <div>
            <Nav>
                <div className="category_area"></div>
                <div className="service_list"></div>
                <Etc/>
            </Nav>
            <div className="banner_area">

            </div>
        </div>
    );
}

const Nav = styled.nav`
    display: flex;
    width: 1200px;
    margin: 0 auto;
    background-color: ${({theme}) => theme.lightMode.danger };
`