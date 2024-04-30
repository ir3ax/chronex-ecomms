import { atom } from "jotai";

export const reviewsRatingAtom = atom<number>(0);
export const reviewsIdAtom = atom<string>('');

export const reviewsRatingAtomPublic = atom<number>(0);
export const reviewsIdAtomPublic = atom<string>('');