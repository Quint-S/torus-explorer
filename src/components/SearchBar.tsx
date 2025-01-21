import { FormEvent, useEffect, useRef, useState } from "react";
import styled from 'styled-components';

interface SearchBarProps {
  placeholder: string;
  onSearch: (search: string) => void;
}

const TerminalInput = styled.input`
  background: inherit;
  outline: none;
  width: 100%;
  position: relative;
  
  &.terminal-cursor {
    background-color: rgba(0, 170, 0, 100%);
  }
`;

const TerminalForm = styled.form`
  display: flex;
  align-items: center;
  width: 100%;
`;

const Prompt = styled.span`
  white-space: nowrap;

  .username {
    color: #e04bff;
  }

  .hostname {
    color: #6cffb9;
  }
`;

const MeasureSpan = styled.span`
  position: absolute;
  visibility: hidden;
  white-space: pre;
  font: inherit;
`;

export const SearchBar = ({
  placeholder,
  onSearch
}: SearchBarProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [inputWidth, setInputWidth] = useState(16);

  useEffect(() => {
    if (measureRef.current) {
      const textToMeasure = inputValue || placeholder;
      measureRef.current.textContent = textToMeasure;
      setInputWidth(measureRef.current.offsetWidth);
    }
  }, [inputValue, placeholder]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputRef.current && inputRef.current === document.activeElement) {
      onSearch(inputRef.current.value);
    }
  };

  return (
    <div className={'flex items-center w-full'}>
      <TerminalForm onSubmit={handleSubmit} className="w-full">
        <Prompt>
          <span className="username">user</span>@<span className="hostname">torex.rs</span>:~$ egrep -i "
        </Prompt>
        <MeasureSpan ref={measureRef} />
        <TerminalInput
          ref={inputRef}
          name="searchinput"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          style={{ width: inputWidth }}
          autoComplete="off"
        />
        <Prompt>" ~/torus/*</Prompt>
      </TerminalForm>
    </div>
  );
};