import React, { useState } from 'react';
import uuid from 'react-uuid';
import styled from 'styled-components';

export default function Tab(props) {
  const { tabData, tabContData } = props;
  const [ showTab, setShowTab ] = useState(0);
  const handleTabItem = (idx) => {
    setShowTab(idx);
  }
  return (
    <TabContainer>
      <div className="tabs">
        <TabList>
          {
            tabData.map((item, idx) => {
              return (
                <TabListItem key={uuid()} rel={`tab${idx}`} className={idx === showTab ? 'active' : ''}>
                  <TabButton onClick={() => handleTabItem(idx)}>{item}</TabButton>
                </TabListItem>
              )
            })
          }
        </TabList>
      </div>
      <TabContent>
          {tabContData[showTab]}
      </TabContent>
    </TabContainer>
  );
}

const TabContainer = styled.div`
  position: relative;
  max-width: 600px;
  margin: auto;
`

const TabList = styled.ul`
  display: flex;
  width: 100%;
  padding: 0;
`

const TabListItem = styled.li`
  flex: 1;
  background: #f6f7f9;
  border: 1px solid #ddd;
  border-bottom-color: #222;
  text-align: center;

  & + & {
    margin-left: -1px;
  }

  &.active {
    position: relative;
    z-index: 10;
    background-color: #fff;
    border-color: #222;
    border-bottom-color: transparent;

    button {
      color: #0051a4;
      font-weight: 500;
    }
  }
`

const TabButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 20px;
  font-size: 14px;
  line-height: 1.25;
  color: #222;
  text-decoration: none;
`

const TabContent = styled.div`
  width: 100%;
  padding: 30px 0;
`