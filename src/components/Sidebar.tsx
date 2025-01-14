import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import { useState } from 'react';

const SidebarContainer = styled.div`
    width: 200px;
    //background-color: rgba(0, 0, 0, 0.1);
    padding: 16px;
    border-radius: 2px;
    border: 1px solid #0050a1;
    margin-right: 5px;
    
    &:focus {outline:0;}
`

const NavItem = styled(NavLink)`
    display: block;
    padding: 8px;
    margin: 4px 0;
    color: #e04bff;
    text-decoration: none;

    &:hover {
        text-decoration: none;
    }

    &:hover:after {
        color: #535bf2;
        content: '<';
    }

    &.hovered:after {
        color: #535bf2;
        content: '<';
    }

    &.active:before {
        color: #535bf2;
        content: '>';
    }
`


export const Sidebar = () => {
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const navItems = [
      { to: "/", label: "Home" },
        { to: "/accounts", label: "Accounts" },
        { to: "/agents", label: "Agents" },
        { to: "/transfers", label: "Transfers" },
        { to: "/blocks", label: "Blocks" },
      { to: "/extrinsics", label: "Extrinsics" },
      { to: "/events", label: "Events" }
    ];
  
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        setFocusedIndex(prev => (prev + 1) % navItems.length);
      } else if (e.key === 'ArrowUp') {
        setFocusedIndex(prev => (prev - 1 + navItems.length) % navItems.length);
      } else if (e.key === 'Enter') {
          // setFocusedIndex(-1);
        const link = document.getElementById(`nav-item-${focusedIndex}`);
        link?.click();
      }
    };
  
    return (
      <SidebarContainer onKeyDown={handleKeyDown} tabIndex={0}>
        {navItems.map((item, index) => (
          <NavItem
            key={item.to}
            to={item.to}
            id={`nav-item-${index}`}
            className={focusedIndex === index ? `hovered` : ''}
          >
            {item.label}
          </NavItem>
        ))}
      </SidebarContainer>
    );
  }