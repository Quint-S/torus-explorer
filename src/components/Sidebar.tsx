import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import { useState, useEffect } from 'react';

const SidebarContainer = styled.div<{ $isExpanded: boolean }>`
    width: ${props => props.$isExpanded ? '180px' : '30px'};
    padding: ${props => props.$isExpanded ? '16px' : '1px'};
    border-radius: 2px;
    border: 1px solid #0050a1;
    margin-right: 5px;
    transition: width 0.2s ease;
    
    &:focus {outline:0;}
`

const NavItem = styled(NavLink)<{ $isExpanded: boolean }>`
    display: block;
    padding: ${props => props.$isExpanded ? '8px' : '1px'};
    margin: 4px 0;
    color: #e04bff;
    text-decoration: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &:hover {
        translate: ${props => !props.$isExpanded ? "''" : "-8px"};
        text-decoration: none;
    }

    &:hover:after {
        color: #535bf2;
        content: ']';
    }

    &:hover:before {
        color: #535bf2;
        content: ${props => !props.$isExpanded ? "''" : "'['"};
    }

    &.hovered {
        translate: -8px;

    }
    
    &.hovered:after {
        color: #535bf2;
        content: ']';
    }
    &.hovered:before {
        color: #535bf2;
        content: '[';
    }
`

export const Sidebar = () => {
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const navItems = [
        { to: "/", label: "Home" },
        { to: "/accounts", label: "Accounts" },
        { to: "/agents", label: "Agents" },
        { to: "/transfers", label: "Transfers" },
        { to: "/blocks", label: "Blocks" },
        { to: "/extrinsics", label: "Extrinsics" },
        { to: "/events", label: "Events" }
    ];
    // Add mobile detection
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) {
                setIsExpanded(true);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
        <SidebarContainer
            onKeyDown={handleKeyDown}
            tabIndex={0}
            $isExpanded={isExpanded || !isMobile}
            onClick={() => isMobile && setIsExpanded(!isExpanded)}
        >
            {navItems.map((item, index) => (
                <NavItem
                    key={item.to}
                    onClick={(e) => {if(!isExpanded && isMobile){e.preventDefault()}}}
                    to={item.to}
                    id={`nav-item-${index}`}
                    className={focusedIndex === index ? `hovered` : ''}
                    $isExpanded={isExpanded || !isMobile}
                >
                    {isMobile && !isExpanded ? item.label : item.label}
                </NavItem>
            ))}
        </SidebarContainer>
    );
}