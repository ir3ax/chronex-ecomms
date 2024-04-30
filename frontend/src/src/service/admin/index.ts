

import { app } from "../firebase";
import { SignInRequest } from "./schema"
import { UserCredential, getAuth, signInWithEmailAndPassword } from "firebase/auth";


const auth = getAuth(app);

export const authSignInApi = async (data: SignInRequest): Promise<void> => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const response: UserCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
    // Handle the response if needed
    localStorage.setItem('userAdminDetails',response.user.uid)
    localStorage.setItem('userAdminEmail', response.user.email || '')
    // Return void since the function doesn't explicitly return anything else
    return;
};
