// adminLoginAtom.ts
import { atom, useAtom } from "jotai";

// Define the atom to hold user details
export const currentUserAdminDetailsAtom = atom<string>('');

// Define a derived atom to handle updates and store data in localStorage
export const persistUserAdminDetailsAtom = atom(
  (get) => get(currentUserAdminDetailsAtom),
  (_get, set, update: string) => {
    localStorage.setItem('userAdminDetails', update);
    set(currentUserAdminDetailsAtom, update);
  }
);

// Hook to use the atom
export const usePersistedUserAdminDetails = () => useAtom(persistUserAdminDetailsAtom);
