import styled from 'styled-components'
import {NavLink, useLocation, useNavigate} from 'react-router-dom'
import { useState, useEffect } from 'react';
import {SearchBar} from "./SearchBar.tsx";
import {formattedNumber} from "../utils/utils.ts";

const SidebarContainer = styled.div`
    //height: 30px;
    padding: 8px 16px;
    border-radius: 2px;
    border: 1px solid #0050a1;
    margin-bottom: 5px;
    //gap: 6px;
    
    &:focus {outline:0;}
`

const NavItem = styled(NavLink)`
    //padding: 8px 16px;
    color: #e04bff;
    white-space: nowrap;
    //overflow: hidden;
    //text-overflow: ellipsis;

    //&:hover {
    //    transform: translateX(-8px);
    //    text-decoration: none;
    //}
    //
    //&:hover:after {
    //    color: #535bf2;
    //    content: ']';
    //}
    //
    //&:hover:before {
    //    color: #535bf2;
    //    content: '[';
    //}

    &.hovered {
        transform: translateX(-2px);
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

export const NavigationBar = () => {
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const location = useLocation();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

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

    useEffect(() => {
        setFocusedIndex(baseNavItems.findIndex(item => item.to === location.pathname));
    }, [location.pathname]);

    // Global keyboard shortcuts
    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            // Don't trigger shortcuts if user is typing in an input or textarea
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            const pressedKey = e.key.toLowerCase();
            const matchingItem = navItems.find(item => item.shortcutKey === pressedKey);
            if (matchingItem) {
                setFocusedIndex(navItems.indexOf(matchingItem));
                const link = document.querySelector(`a[href="${matchingItem.to}"]`) as HTMLElement;
                link?.click();
            }
        };

        document.addEventListener('keydown', handleGlobalKeyDown);
        return () => document.removeEventListener('keydown', handleGlobalKeyDown);
    }, [navItems]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const renderLabel = (label: string, shortcutKey: string) => {
        if (isMobile) return label;
        
        const index = label.toLowerCase().indexOf(shortcutKey);
        if (index === -1) return label;

        return (
            <>
                {label.slice(0, index)}
                <span style={{color: "aqua"}}>{label.charAt(index)}</span>
                {label.slice(index + 1)}
            </>
        );
    };

    const navigate = useNavigate();

    const onsearch = (search: string) => {
        if (search.length === 48) {
            navigate(`/account/${search}`)
            return
        } else if (search.includes('-') && !isNaN(parseInt(search.split('-')[0])) && !isNaN(parseInt(search.split('-')[1]))) {
            const id = parseInt(search.split('-')[1])
            const extrinsicid = `${parseInt(search.split('-')[0])}-${formattedNumber(id)}`
            navigate(`/extrinsic/${extrinsicid}`)
            return
        } else if (!isNaN(parseInt(search)) || search.length === 66) {
            navigate(`/block/${search}`)
            return
        }
    }

    return (
        <SidebarContainer tabIndex={0} className={'flex flex-col'}>
            <div className={'flex justify-between w-full'}>
                {navItems.map((item, index) => (
                    <NavItem
                        key={item.to}
                        onClick={() => setFocusedIndex(index)}
                        to={item.to}
                        id={`nav-item-${index}`}
                        className={`${focusedIndex === index ? 'hovered' : ''} flex-1 text-center`}
                    >
                        {renderLabel(item.label, item.shortcutKey)}
                    </NavItem>
                ))}
            </div>
            <div className={"w-full"}>
                <SearchBar placeholder={'Enter address/block/extrinsic'} onSearch={onsearch}/>
            </div>
        </SidebarContainer>
    );
}