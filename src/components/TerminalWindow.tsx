import styled from 'styled-components'
const TerminalContainer = styled.div.attrs({className: 'w-full'})`
  border: 1px solid #0050a1;
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  height: 100%;
`

const TerminalHeader = styled.div`
    border-bottom: 1px solid #00c4ff;
    padding-left: 5px;
    position: sticky;
    top: 0;
    z-index: 1; // Keep header above content
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

export const TerminalWindow: React.FC<TerminalWindowProps> = ({ title, children, footer }) => {
    return (
      <TerminalContainer>
        <TerminalHeader>{title.toLowerCase().replace(' ', '_')}.rs (~/torus) - TOREX</TerminalHeader>
        <TerminalContent>
          {children}
        </TerminalContent>
        <TerminalFooter>{footer ? footer : 'torus-explorer v0.1.0 BETA'}</TerminalFooter>
      </TerminalContainer>
    )
  }