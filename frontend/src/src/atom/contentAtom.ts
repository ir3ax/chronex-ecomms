import { atom } from "jotai";

export const contentAtom = atom<string | null>('Dashboard');

export const activeTabAtom = atom<string>('pending');