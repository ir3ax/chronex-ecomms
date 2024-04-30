import { atomWithStorage } from "jotai/utils";
import { atom } from "jotai";

interface Freebie {
  freebiesId: string;
  freebiesName: string;
  freebiesStorePrice: number;
  freebiesOriginalQuantity: number;
  freebiesCurrentQuantity: number;
  freebiesImg: string;
}

interface FetchProductDetails {
  currentQuantity: number;
  description1: string;
  description2: string;
  discount: number;
  discountedPrice: number;
  img: string;
  originalPrice: number;
  originalQuantity: number; 
  productFreebies: string;
  productId?: string | undefined;
  productName: string;
  productRating: number;
  productSold: number;
  productStatus: string;
  freebies: string;
}

export const productDetailsAtom = atomWithStorage<FetchProductDetails | undefined>(
    'productDetailsHandler',
    undefined
)

export const productImgAtom = atom<File[]>([]);
export const productDescription2Atom = atom<string[]>([]);
export const productFreebiesAtom = atom<Freebie[]>([]);
export const productDiscountedPriceAtom = atom<number>(0);
const getCurrentQuantityFromLocalStorage = () => {
  const storedValue = localStorage.getItem('currentQuantityValue');
  return storedValue ? parseFloat(storedValue) : 0;
};
export const productCurrentQuantityAtom = atom<number>(
  getCurrentQuantityFromLocalStorage()
);


export const productImgAtomUpdate = atom<File[]>([]);
export const productImgViaPropsAtomUpdate = atom<string[]>([]);
export const productDescription2AtomUpdate = atom<string[]>([]);
export const productDescription2ViaPropsAtomUpdate = atom<string[]>([]);
export const productFreebiesAtomUpdate = atom<Freebie[]>([]);
export const productDiscountedPriceAtomUpdate = atom<number>(0);

export const imagePreviewUpdateAtom = atom<string[]>([]);

const getCurrentQuantityFromLocalStorageUpdate = () => {
  const storedValue = localStorage.getItem('currentQuantityValueUpdate');
  return storedValue ? parseFloat(storedValue) : 0;
};
export const productCurrentQuantityAtomUpdate = atom<number>(
  getCurrentQuantityFromLocalStorageUpdate()
);

export const productAdditionalOriginalQuantity = atom<number>(0);
export const productAdditionalCurrentQuantity = atom<number>(0);

export const productStatusAtom = atom<string>('ACT');

export const productStatusUpdateAtom = atom<string>('');