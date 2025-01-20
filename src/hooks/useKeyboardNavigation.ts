import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

type ClickableElement = HTMLAnchorElement | HTMLButtonElement;

export const useKeyboardNavigation = () => {
    const [currentIndex, setCurrentIndex] = useState<number>(-1);
    const [clickableElements, setClickableElements] = useState<ClickableElement[]>([]);
    const location = useLocation();

    useEffect(() => {
        // setCurrentIndex(-1);
        // Small delay to let the new page render
        setTimeout(() => {
            const newElements = getAllClickableElements();
            setClickableElements(newElements);
        }, 100);
    }, [location]);

    const getAllClickableElements = () => {
        const allElements = Array.from(document.querySelectorAll('a, button')) as ClickableElement[];
        
        const visibleElements = allElements.filter(element => {
            const style = window.getComputedStyle(element);
            const rect = element.getBoundingClientRect();
            
            const isVisible = style.display !== 'none' &&
                            style.visibility !== 'hidden' && 
                            style.opacity !== '0' &&
                            rect.width > 0 && 
                            rect.height > 0;

            const isClickable = element instanceof HTMLAnchorElement ?
                              (element.hasAttribute('href') && 
                               !element.getAttribute('href')?.startsWith('#') &&
                               !element.getAttribute('aria-hidden')) :
                              !element.disabled && !element.getAttribute('aria-hidden');

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

            const hasNestedElements =
                element.getElementsByTagName('a').length > 0 ||
                element.getElementsByTagName('button').length > 0;

            return isVisible && isClickable && !hasNestedElements;
        });

        return visibleElements;
        // .sort((a, b) => {
        //     const aRect = a.getBoundingClientRect();
        //     const bRect = b.getBoundingClientRect();
        //
        //     if (Math.abs(aRect.top - bRect.top) > 5) { // 5px threshold for same line
        //         return aRect.top - bRect.top;
        //     }
        //     return aRect.left - bRect.left;
        // });
    };

    useEffect(() => {
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
                if (currentIndex >= newElements.length) {
                    setCurrentIndex(-1);
                }
            }
        };

        updateElements();

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
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }
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

    useEffect(() => {
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