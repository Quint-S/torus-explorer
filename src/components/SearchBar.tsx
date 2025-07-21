import { FormEvent, useEffect, useRef, useState } from "react";
import styled from 'styled-components';
interface SearchBarProps {
  placeholder: string;
  onSearch: (search: string) => void;
}

export const TerminalInput = styled.input`
  background: inherit;
  outline: none;
  width: 100%;
  position: relative;
  
  &.terminal-cursor {
    background-color: rgba(0, 170, 0, 100%);
  }
`;

export const TerminalForm = styled.form`
  display: flex;
  align-items: center;
  width: 100%;
`;

export const Prompt = styled.span`
  white-space: nowrap;

  .username {
    color: #e04bff;
  }

  .hostname {
    color: #6cffb9;
  }

  @media (max-width: 768px) { 
    .desktop {
      display: none;
    }
  }
`;

export const SearchBar = ({
  placeholder,
  onSearch
}: SearchBarProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [inputWidth, setInputWidth] = useState(placeholder.length*8);

  useEffect(() => {
    const textToMeasure = inputValue || placeholder;
    setInputWidth(textToMeasure.length*8);
  }, [inputValue, placeholder]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputRef.current && inputRef.current === document.activeElement) {
      onSearch(inputRef.current.value);
    }
  };

  const searchtype = () => {
    const search = inputRef.current?.value ?? '';
    if (search.length === 48) {
      return 'accounts/';
    } else if (search.includes('-') && !isNaN(parseInt(search.split('-')[0])) && !isNaN(parseInt(search.split('-')[1]))) {
      return 'extrinsics/';
    } else if (!isNaN(parseInt(search)) || search.length === 66) {
      return 'blocks/';
    }
    return '';
  }
  return (
    <div className={'flex items-center w-full'}>
      <TerminalForm onSubmit={handleSubmit} className="w-full">
        <Prompt>
          <span className="desktop"><span className="username">user</span>@<span className="hostname">torex.rs</span>:</span>~$ egrep -i "

        </Prompt>
        <TerminalInput
          ref={inputRef}
          name="searchinput"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          style={{ width: inputWidth }}
          autoComplete="off"
          spellCheck={false}
        />
        <Prompt>"<span className="desktop"> ~/torus/{searchtype()}*</span></Prompt>
      </TerminalForm>
    </div>
  );
};