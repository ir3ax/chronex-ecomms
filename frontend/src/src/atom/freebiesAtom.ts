import { atom } from "jotai";

interface Freebie {
    freebiesName: string;
    freebiesStorePrice: number,
    freebiesOriginal: number;
    freebiesCurrent: number;
    freebiesImg: File | null; // Allow null for initial state
}

export const freebiesAtom = atom<Freebie>({
    freebiesName: "",
    freebiesStorePrice: 0,
    freebiesOriginal: 0,
    freebiesCurrent: 0,
    freebiesImg: null, // Set initial state to null or undefined
});

export const additionalOriginalQuantity = atom<number>(0);
export const additionalCurrentQuantity = atom<number>(0);

export const storePriceInputValueAtom = atom<string | null | undefined | number>(null);

export const freebiesStatusAtom = atom<string>('ACT');
export const freebiesStatusUpdateAtom = atom<string>('');
