import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import cn from 'clsx';
import { HeroIcon } from '@components/ui/hero-icon';
import { Button } from '@components/ui/button';
import type { ChangeEvent, FormEvent, KeyboardEvent } from 'react';

export function SearchBar(): JSX.Element {
  const [inputValue, setInputValue] = useState('');

  const { push } = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = ({
    target: { value }
  }: ChangeEvent<HTMLInputElement>): void => setInputValue(value);

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (inputValue) void push(`/search?q=${inputValue}`);
  };

  const clearInputValue = (focus?: boolean) => (): void => {
    if (focus) inputRef.current?.focus();
    else inputRef.current?.blur();

    setInputValue('');
  };

  const handleEscape = ({ key }: KeyboardEvent<HTMLInputElement>): void => {
    if (key === 'Escape') clearInputValue()();
  };

  return <div></div>;
}
