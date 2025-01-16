import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export const useKeyboardNavigation = () => {
    const [currentIndex, setCurrentIndex] = useState<number>(-1);
    const [links, setLinks] = useState<HTMLAnchorElement[]>([]);
    const location = useLocation();

    // Reset navigation when route changes
    useEffect(() => {
        setCurrentIndex(-1);
        // Small delay to let the new page render
        setTimeout(() => {
            const newLinks = getAllVisibleLinks();
            setLinks(newLinks);
        }, 100);
    }, [location]);

    const getAllVisibleLinks = () => {
        // Get all <a> elements
        const allLinks = Array.from(document.getElementsByTagName('a'));//Array.from([...Array.from(document.getElementsByTagName('a')), ...Array.from(document.getElementsByTagName('button'))]);
        
        // Filter for actually clickable links
        return allLinks.filter(link => {
            // Get computed style
            const style = window.getComputedStyle(link);
            const rect = link.getBoundingClientRect();
            
            // Check if the link is visible and clickable
            const isVisible = style.display !== 'none' && 
                            style.visibility !== 'hidden' && 
                            style.opacity !== '0' &&
                            rect.width > 0 && 
                            rect.height > 0;

            // Check if it's an actual clickable link
            const isClickable = link.hasAttribute('href') && 
                              !link.getAttribute('href')?.startsWith('#') &&
                              !link.getAttribute('aria-hidden');

            // Check if any parent is hidden
            let parent = link.parentElement;
            while (parent) {
                const parentStyle = window.getComputedStyle(parent);
                if (parentStyle.display === 'none' || 
                    parentStyle.visibility === 'hidden' || 
                    parentStyle.opacity === '0') {
                    return false;
                }
                parent = parent.parentElement;
            }

            // Check if this link is the actual target (not a parent of another link)
            const hasNestedLinks = link.getElementsByTagName('a').length > 0;

            return isVisible && isClickable && !hasNestedLinks;
        });
    };

    useEffect(() => {
        // Update links when DOM changes
        const updateLinks = () => {
            const newLinks = getAllVisibleLinks();
            if (JSON.stringify(newLinks.map(l => l.href)) !== JSON.stringify(links.map(l => l.href))) {
                setLinks(newLinks);
                // Reset index if current index is invalid
                if (currentIndex >= newLinks.length) {
                    setCurrentIndex(-1);
                }
            }
        };

        // Initial links collection
        updateLinks();

        // Set up mutation observer to watch for DOM changes
        const observer = new MutationObserver(() => {
            requestAnimationFrame(updateLinks);
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class', 'href']
        });

        const handleKeyDown = (e: KeyboardEvent) => {
            // Don't handle if user is typing in an input or textarea
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            // Get fresh list of links
            const currentLinks = getAllVisibleLinks();
            
            switch (e.key) {
                case 'ArrowDown':
                case 'ArrowRight': {
                    if (currentLinks.length === 0) return;
                    
                    e.preventDefault();
                    setCurrentIndex(prev => {
                        const next = prev + 1;
                        return next >= currentLinks.length ? 0 : next;
                    });
                    setLinks(currentLinks);
                    break;
                }
                case 'ArrowUp':
                case 'ArrowLeft': {
                    if (currentLinks.length === 0) return;
                    
                    e.preventDefault();
                    setCurrentIndex(prev => {
                        const next = prev - 1;
                        return next < 0 ? currentLinks.length - 1 : next;
                    });
                    setLinks(currentLinks);
                    break;
                }
                case 'Enter':
                    if (currentIndex >= 0 && currentIndex < currentLinks.length) {
                        currentLinks[currentIndex].click();
                    }
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            observer.disconnect();
        };
    }, [currentIndex, links]);

    // Effect to handle focus and styling
    useEffect(() => {
        // Remove previous highlights
        document.querySelectorAll('a').forEach(link => {
            link.style.background = '';
        });

        if (currentIndex >= 0 && currentIndex < links.length) {
            const currentLink = links[currentIndex];
            currentLink.style.background = 'rgba(0,255,0,0.7)';
            currentLink.scrollIntoView({ behavior: 'instant', block: 'nearest' });
        }
    }, [currentIndex, links]);

    return { currentIndex };
}; 