import styled from 'styled-components'
import React from "react";
const TerminalContainer = styled.div.attrs({className: 'w-full'})`
  border: 1px solid #0050a1;
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  height: 100%;
`

const TerminalHeader = styled.div`
    border-bottom: 1px solid #00c4ff;
    color: #6cffb9;
    padding-left: 5px;
    position: sticky;
    top: 0;
    z-index: 1;
`

const TerminalContent = styled.div`
  overflow-y: auto;
  flex-grow: 1;
`
const TerminalFooter = styled.div`
  border-top: 1px solid #00c4ff;
    padding-left: 5px;
  position: sticky;
  bottom: 0;
  background-color: inherit;
  z-index: 1;
`

interface TerminalWindowProps {
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
}


interface Tab {
    label: string;
    content: React.ReactNode;
  }
  
  interface TerminalTabsProps {
    tabs: Tab[];
    initialTab?: number;
  }
  
  const TerminalTabsContainer = styled.div`
    display: flex;
    border-bottom: 1px solid #00c4ff;
    padding: 0 5px;
    //background-color: rgba(100,0,150,20%);
  `
  
  const TerminalTab = styled.button<{ active: boolean }>`
    padding: 5px 10px;
    margin-right: 5px;
    border: 1px solid #00c4ff;
    border-bottom: none;
    background-color: ${({ active }) => active ? '#0050a1' : 'transparent'};
    color: ${({ active }) => active ? '#fff' : '#00c4ff'};
    cursor: pointer;
    transition: all 0.1s;
      
      &.terminal-cursor {
          background-color: rgba(0, 170, 0, 0.9);
          text-shadow: none;
          color: black;
      }
      
  
    &:hover {
      background-color: #0050a1;
      color: #fff;
    }
  `
  
  const TerminalTabsContent = styled.div`
    padding: 10px;
  `
  
  export const TerminalTabs: React.FC<TerminalTabsProps> = ({ tabs, initialTab = 0 }) => {
    const [activeTab, setActiveTab] = React.useState(initialTab);
  
    return (
      <>
        <TerminalTabsContainer>
          {tabs.map((tab, index) => (
            <TerminalTab
              key={index}
              active={index === activeTab}
              onClick={() => setActiveTab(index)}
            >
              {tab.label.toLowerCase().replace(' ', '_')}
            </TerminalTab>
          ))}
        </TerminalTabsContainer>
        <TerminalTabsContent>
          {tabs[activeTab].content}
        </TerminalTabsContent>
      </>
    );
  }

export const TerminalWindow: React.FC<TerminalWindowProps> = ({ title, children, footer }) => {
    return (
      <TerminalContainer>
        <TerminalHeader>{title.toLowerCase().replace(' ', '_')}.rs (~/torus) - TorE♓︎</TerminalHeader>
        <TerminalContent>
          {children}
        </TerminalContent>
        <TerminalFooter>{footer ? footer : 'torus-e♓︎plorer v0.1.0 BETA'}</TerminalFooter>
      </TerminalContainer>
    )
  }