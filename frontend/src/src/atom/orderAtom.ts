import { atom } from "jotai";


interface Product {
  productId: string;
  productName: string;
  discountedPrice: number;
  quantity: number;
  freebies: string;
}

export const productAddAtom = atom<Product[]>([]);

export const productAddAtomUpdate = atom<Product[]>([]);

export const orderStatusAtom = atom<string>('');

export const stickyNotesAtom = atom<string[]>([]);