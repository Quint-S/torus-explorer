import React from 'react';
import styled from 'styled-components';

const AsciiContainer = styled.pre`
  color: #00ff00;
  font-family: monospace;
  white-space: pre;
  line-height: 1;
`;


const torusArt = `
        .-""""""-.
      .'          '.
     /              \\
    |                |
    |    .------.    |
    |   /        \\   |
    |  |          |  |
    |  |    __    |  |
    |  |   /  \\   |  |
    |  |  |    |  |  |
    |  |   \\__/   |  |
    |   \\        /   |
    |    '------'    |
    |                |
     \\              /
      '.          .'
        '-......-'
`;

export const AsciiTorus: React.FC = () => {
  return (
    <AsciiContainer style={{ fontSize: '8px' }}>
      {torusArt}
    </AsciiContainer>
  );
};