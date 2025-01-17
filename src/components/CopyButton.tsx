import React, { useState } from 'react';
import styled from 'styled-components';

const Button = styled.button`
    border: none;
    cursor: pointer;
    padding: 0;
    margin: 0;
    display: inline-flex;
    align-items: center;
    transition: all 0.2s;
    text-shadow: 2px 2px 0 #363636;
    //&:hover {
    //    opacity: 0.8;
    //}
    &.terminal-cursor {
        text-shadow: none;
    }
    //
    //&:active {
    //    transform: scale(0.95);
    //}
`;

const Checkmark = styled.span`
  color: #6cffb9;
  margin-left: 4px;
  opacity: 0;
  //transition: opacity 0.1s;

  &.visible {
    opacity: 1;
  }
`;

interface CopyButtonProps {
    textToCopy: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ textToCopy }) => {
    const [showCheckmark, setShowCheckmark] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(textToCopy);
            setShowCheckmark(true);
            setTimeout(() => setShowCheckmark(false), 2000); // Hide checkmark after 2 seconds
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <Button onClick={handleCopy}>
            [copy]
            <Checkmark className={showCheckmark ? 'visible' : ''}>✓</Checkmark>
        </Button>
    );
};