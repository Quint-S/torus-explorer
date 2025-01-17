import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

type ClickableElement = HTMLAnchorElement | HTMLButtonElement;

export const useKeyboardNavigation = () => {
    const [currentIndex, setCurrentIndex] = useState<number>(-1);
    const [clickableElements, setClickableElements] = useState<ClickableElement[]>([]);
    const location = useLocation();

    // Reset navigation when route changes
    useEffect(() => {
        // setCurrentIndex(-1);
        // Small delay to let the new page render
        setTimeout(() => {
            const newElements = getAllClickableElements();
            setClickableElements(newElements);
        }, 100);
    }, [location]);

    const getAllClickableElements = () => {
        // Get all <a> and <button> elements using a single query
        const allElements = Array.from(document.querySelectorAll('a, button')) as ClickableElement[];
        
        // Filter for actually clickable elements
        const visibleElements = allElements.filter(element => {
            // Get computed style
            const style = window.getComputedStyle(element);
            const rect = element.getBoundingClientRect();
            
            // Check if the element is visible and clickable
            const isVisible = style.display !== 'none' && 
                            style.visibility !== 'hidden' && 
                            style.opacity !== '0' &&
                            rect.width > 0 && 
                            rect.height > 0;

            // Check if it's a clickable link or button
            const isClickable = element instanceof HTMLAnchorElement ? 
                              (element.hasAttribute('href') && 
                               !element.getAttribute('href')?.startsWith('#') &&
                               !element.getAttribute('aria-hidden')) :
                              !element.disabled && !element.getAttribute('aria-hidden');

            // Check if any parent is hidden
            let parent = element.parentElement;
            while (parent) {
                const parentStyle = window.getComputedStyle(parent);
                if (parentStyle.display === 'none' || 
                    parentStyle.visibility === 'hidden' || 
                    parentStyle.opacity === '0') {
                    return false;
                }
                parent = parent.parentElement;
            }

            // Check if this element is the actual target (not a parent of another clickable element)
            const hasNestedElements = 
                element.getElementsByTagName('a').length > 0 ||
                element.getElementsByTagName('button').length > 0;

            return isVisible && isClickable && !hasNestedElements;
        });

        // Sort elements by their position in the document
        return visibleElements;
        // .sort((a, b) => {
        //     const aRect = a.getBoundingClientRect();
        //     const bRect = b.getBoundingClientRect();
        //
        //     // First compare by vertical position (top to bottom)
        //     if (Math.abs(aRect.top - bRect.top) > 5) { // 5px threshold for same line
        //         return aRect.top - bRect.top;
        //     }
        //     // If on same line, compare by horizontal position (left to right)
        //     return aRect.left - bRect.left;
        // });
    };

    useEffect(() => {
        // Update elements when DOM changes
        const updateElements = () => {
            const newElements = getAllClickableElements();
            const currentElements = JSON.stringify(newElements.map(el => ({
                type: el instanceof HTMLAnchorElement ? 'a' : 'button',
                id: el instanceof HTMLAnchorElement ? el.href : el.textContent,
                rect: el.getBoundingClientRect().toJSON()
            })));
            const oldElements = JSON.stringify(clickableElements.map(el => ({
                type: el instanceof HTMLAnchorElement ? 'a' : 'button',
                id: el instanceof HTMLAnchorElement ? el.href : el.textContent,
                rect: el.getBoundingClientRect().toJSON()
            })));

            if (currentElements !== oldElements) {
                setClickableElements(newElements);
                // Reset index if current index is invalid
                if (currentIndex >= newElements.length) {
                    setCurrentIndex(-1);
                }
            }
        };

        // Initial elements collection
        updateElements();

        // Set up mutation observer to watch for DOM changes
        const observer = new MutationObserver(() => {
            requestAnimationFrame(updateElements);
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class', 'href', 'disabled']
        });

        const handleKeyDown = (e: KeyboardEvent) => {
            // Don't handle if user is typing in an input or textarea
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            // Get fresh list of elements
            const currentElements = getAllClickableElements();
            
            switch (e.key) {
                case 'ArrowDown':
                case 'ArrowRight': {
                    if (currentElements.length === 0) return;
                    
                    e.preventDefault();
                    setCurrentIndex(prev => {
                        const next = prev + 1;
                        return next >= currentElements.length ? 0 : next;
                    });
                    setClickableElements(currentElements);
                    break;
                }
                case 'ArrowUp':
                case 'ArrowLeft': {
                    if (currentElements.length === 0) return;
                    
                    e.preventDefault();
                    setCurrentIndex(prev => {
                        const next = prev - 1;
                        return next < 0 ? currentElements.length - 1 : next;
                    });
                    setClickableElements(currentElements);
                    break;
                }
                case 'Enter':
                    if (currentIndex >= 0 && currentIndex < currentElements.length) {
                        currentElements[currentIndex].click();
                    }
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            observer.disconnect();
        };
    }, [currentIndex, clickableElements]);

    // Effect to handle focus and styling
    useEffect(() => {
        // Remove previous highlights and classes
        const elements = document.querySelectorAll('a, button');
        elements.forEach(element => {
            if (element instanceof HTMLElement) {
                element.classList.remove('terminal-cursor');
            }
        });

        if (currentIndex >= 0 && currentIndex < clickableElements.length) {
            const currentElement = clickableElements[currentIndex];
            currentElement.classList.add('terminal-cursor');
            currentElement.scrollIntoView({ behavior: 'instant', block: 'nearest' });
        }
    }, [currentIndex, clickableElements]);

    return { currentIndex };
}; 