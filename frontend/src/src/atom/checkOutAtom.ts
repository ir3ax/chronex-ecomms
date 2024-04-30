import { atomWithStorage } from "jotai/utils";
import { CompleteCheckOut, FetchCheckOut } from "../service/checkout/schema";
import { atom } from "jotai";

export const checkOutAtom = atomWithStorage<FetchCheckOut[]>( // Change to an array type
  'checkOutDetailsHandler',
  []
);

export const completeCheckOut = atomWithStorage<CompleteCheckOut[]>( // Change to an array type
  'completeCheckOutHandler',
  []
);

export const regionSelect = atom<string>('');
export const provinceSelect = atom<string>('');
export const citySelect = atom<string>('');
export const barangaySelect = atom<string>('');

export const regionSelectUpdate = atom<string>('');
export const provinceSelectUpdate = atom<string>('');
export const citySelectUpdate = atom<string>('');
export const barangaySelectUpdate = atom<string>('');