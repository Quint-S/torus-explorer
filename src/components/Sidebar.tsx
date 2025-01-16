import styled from 'styled-components'
import { NavLink, useLocation } from 'react-router-dom'
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
        color: rgb(125, 225, 253);
        content: ']';
    }
    &.hovered:before {
        color: rgb(125, 225, 253);
        content: '[';
    }
`

interface NavItemType {
    to: string;
    label: string;
    shortcutKey: string;
}

export const Sidebar = () => {
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const location = useLocation();

    // Helper function to determine shortcut keys
    const determineShortcutKeys = (items: { to: string; label: string }[]): NavItemType[] => {
        const usedKeys = new Set<string>();
        return items.map(item => {
            const label = item.label.toLowerCase();
            let shortcutKey = '';
            
            // Try to find first available character
            for (const char of label) {
                if (!usedKeys.has(char)) {
                    shortcutKey = char;
                    usedKeys.add(char);
                    break;
                }
            }
            
            return {
                to: item.to,
                label: item.label,
                shortcutKey
            };
        });
    };

    const baseNavItems = [
        { to: "/", label: "Home" },
        { to: "/accounts", label: "Accounts" },
        { to: "/agents", label: "Agents" },
        { to: "/transfers", label: "Transfers" },
        { to: "/blocks", label: "Blocks" },
        // { to: "/extrinsics", label: "Extrinsics" },
        // { to: "/events", label: "Events" }
    ];

    const navItems = determineShortcutKeys(baseNavItems);

    // Add mobile detection
    useEffect(() => {
        setFocusedIndex(baseNavItems.findIndex(item => item.to === location.pathname));

        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) {
                setIsExpanded(true);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Global keyboard shortcuts
    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            // Don't trigger shortcuts if user is typing in an input or textarea
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            if (!isMobile) {
                const pressedKey = e.key.toLowerCase();
                const matchingItem = navItems.find(item => item.shortcutKey === pressedKey);
                if (matchingItem) {
                    setFocusedIndex(navItems.indexOf(matchingItem));
                    const link = document.querySelector(`a[href="${matchingItem.to}"]`) as HTMLElement;
                    link?.click();
                }
            }
        };

        document.addEventListener('keydown', handleGlobalKeyDown);
        return () => document.removeEventListener('keydown', handleGlobalKeyDown);
    }, [navItems, isMobile]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            setFocusedIndex(prev => (prev + 1) % navItems.length);
        } else if (e.key === 'ArrowUp') {
            setFocusedIndex(prev => (prev - 1 + navItems.length) % navItems.length);
        } else if (e.key === 'Enter') {
            const link = document.getElementById(`nav-item-${focusedIndex}`);
            link?.click();
        }
    };

    const renderLabel = (label: string, shortcutKey: string) => {
        const index = label.toLowerCase().indexOf(shortcutKey);
        if (index === -1 || isMobile) return label;

        return (
            <>
                {label.slice(0, index)}
                <span style={{color: "aqua"}}>{label.charAt(index)}</span>
                {label.slice(index + 1)}
            </>
        );
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
                    onClick={(e) => {
                        if(!isExpanded && isMobile){
                            e.preventDefault()
                        }
                        setFocusedIndex(index);
                    }}
                    to={item.to}
                    id={`nav-item-${index}`}
                    className={focusedIndex === index && ((isMobile && isExpanded) || !isMobile) ? `hovered` : ''}
                    $isExpanded={isExpanded || !isMobile}
                >
                    {isMobile && !isExpanded ? item.label : renderLabel(item.label, item.shortcutKey)}
                </NavItem>
            ))}
        </SidebarContainer>
    );
}