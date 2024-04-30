import { atom } from "jotai";

export const homeImgAtom = atom<File[]>([]);

export const homeImagesImgAtomUpdate = atom<File[]>([]);
export const homeImagesImgViaPropsAtomUpdate = atom<string[]>([]);
export const homeImagesPreviewUpdateAtom = atom<string[]>([]);