import { FormEvent, useRef, useState } from "react";
import styled from 'styled-components';

interface SearchBarProps {
  placeholder: string;
  onSearch: (search: string) => void;
}

const TerminalInput = styled.input`
  background: transparent;
  //border: 1px dashed #0050a1;
  outline: none;
  width: 100%;
  padding: 0.5rem;
  position: relative;
`;

const TerminalForm = styled.form`
  //border: 1px solid #00ff00;
  display: flex;
  align-items: center;
`;

export const SearchBar = ({
  placeholder,
  onSearch
}: SearchBarProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputRef.current) {
      onSearch(inputRef.current.value);
    }
  };

  return (
    <div className={'flex items-center'}>
      <TerminalForm onSubmit={handleSubmit} className="w-full">
        <TerminalInput
          ref={inputRef}
          name="searchinput"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </TerminalForm>
    </div>
  );
};