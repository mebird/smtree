import { HTMLProps, RefObject } from 'react';

export interface GraphButtonProps extends HTMLProps<HTMLButtonElement> {
    isOpen?: boolean;
    accentColor: string;
    label?: string;
}

export const scrollToRef = (ref: RefObject<HTMLElement>) => {
    if (ref.current) {
        ref.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
        ref.current.focus({ preventScroll: true });
    }
};
