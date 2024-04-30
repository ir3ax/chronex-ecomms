import { atomWithStorage } from "jotai/utils";
import { FetchCartDetails } from "../service/cart/schema";

export const cartDetailsAtom = atomWithStorage<FetchCartDetails | undefined>(
    'cartDetailsHandler',
    undefined
  );