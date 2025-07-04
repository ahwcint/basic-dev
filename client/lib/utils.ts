import { clsx, type ClassValue } from 'clsx';
import { ChangeEvent } from 'react';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function inputGuardNumber(onChange: (...args: unknown[]) => void) {
  return (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    if (value && !/^\d+$/g.test(value)) return;

    if (value.length > 1) value = value.replace(/^0/g, '');

    if (value === '') value = '0';

    e.target.value = value;
    onChange(e);
  };
}

export function isScrolledToBottom(el: HTMLElement, offset = 1): boolean {
  return el.scrollHeight - el.scrollTop <= el.clientHeight + offset;
}
