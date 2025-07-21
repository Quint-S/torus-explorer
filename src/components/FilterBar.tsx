import { FormEvent, useEffect, useRef, useState } from "react";
import {Prompt, TerminalForm, TerminalInput} from "./SearchBar.tsx";
interface FilterBarProps {
  placeholder: string;
  type: string;
  onSearch: (search: string) => void;
}
export const FilterBar = ({
                            placeholder,
                            type,
                            onSearch
}: FilterBarProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [inputWidth, setInputWidth] = useState(placeholder.length*8);

  useEffect(() => {
    const textToMeasure = inputValue || placeholder;
    setInputWidth(textToMeasure.length*8);
    if (inputRef.current && inputRef.current === document.activeElement) {
      onSearch(inputRef.current.value);
    }
  }, [inputValue, placeholder]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputRef.current && inputRef.current === document.activeElement) {
      onSearch(inputRef.current.value);
    }
  };

  return (
    <div className="flex justify-center w-full">
      <TerminalForm onSubmit={handleSubmit} style={{ width: 'auto' }}>
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
        <Prompt>"<span className="desktop"> ~/torus/{type}*</span></Prompt>
      </TerminalForm>
    </div>
  );
};