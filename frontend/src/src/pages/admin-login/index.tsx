import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "../../components/input"
import { FormField, FormItem, FormControl, FormDescription, Form } from "../../components/ui/form"
import { SignInRequest, signInSchema } from "../../service/admin/schema";
import { AxiosError } from "axios";
import { authSignInApi } from "../../service/admin";
import { useMutation } from "react-query";
import { useState } from "react";
import ChronexLogo from '../../assets//CHRONEX-LOGO-bg.png'
import { useNavigate } from "react-router-dom";

export const AdminLogin = () => {

    const [ errorSignIn, setErrorSignIn ] = useState<string>('');
    const navigate = useNavigate();

    const signInFOrm = useForm<SignInRequest>({
        defaultValues: {
            email:'',
            password:''
        },
        mode: 'onChange',
        resolver: zodResolver(signInSchema),
    });

    const { mutate: signInMU } = useMutation<
    void,
    AxiosError,
    SignInRequest
    >((data) => authSignInApi(data), {
        onSuccess: (e) => {
            console.log(e)
            navigate('/dashboard')
        },
        onError: (error: unknown) => {
        console.log(error);
        setErrorSignIn('Invalid credentials')
    },
    });

    // const [freebiesAtomValue, ] = useAtom(freebiesAtom);

    const handleSignIn = async (data: SignInRequest) => {
        const params: SignInRequest = {
            email: data.email,
            password: data.password
        };
        signInMU(params);
    };


    return(
        <div className='w-full h-full bg-[#ebecec] text-[#313131]'>
        <div className='min-h-[100dvh] flex justify-center items-center max-sm:w-full max-sm:h-full'>
        <Form {...signInFOrm}>
            <form onSubmit={signInFOrm.handleSubmit(handleSignIn)} className='mt-2 w-full h-full flex flex-col justify-center items-center'>
                <div className='w-[40%] flex flex-col justify-center items-center p-12 gap-4 max-sm:w-full'>
                    <div className='w-[40%] h-full p-2 rounded-md flex justify-center items-center max-sm:w-[80%]'>
                        <img className='w-[100%]' src={ChronexLogo} />
                    </div>
                    <div className='w-[100%] flex flex-col gap-2'>
                        <label>Email Address</label>
                        <FormField
                            control={signInFOrm.control}
                            name='email'
                            render={({ field, fieldState }) => (
                                <FormItem className='col-span-full'>
                                    <FormControl>
                                    <Input 
                                    id='email'
                                    className='focus-visible:ring-[#63B38F]' 
                                    placeholder='Email Address'
                                    type='email'
                                    ref={field.ref}
                                    name={field.name}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setErrorSignIn('');
                                    }}
                                    onBlur={field.onBlur}
                                    />
                                    </FormControl>
                                    <FormDescription className='text-red-500'>
                                        {fieldState.error?.message}
                                    </FormDescription>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='w-[100%] flex flex-col gap-2'>
                        <label>Password</label>
                        <FormField
                            control={signInFOrm.control}
                            name='password'
                            render={({ field, fieldState }) => (
                                <FormItem className='col-span-full'>
                                    <FormControl>
                                    <Input 
                                    id='password'
                                    className='focus-visible:ring-[#63B38F]' 
                                    placeholder='Password'
                                    type='password'
                                    ref={field.ref}
                                    name={field.name}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setErrorSignIn('');
                                    }}
                                    onBlur={field.onBlur}
                                    />
                                    </FormControl>
                                    <FormDescription className='text-red-500'>
                                        {fieldState.error?.message}
                                    </FormDescription>
                                </FormItem>
                            )}
                        />
                    </div>
                    {
                        errorSignIn !== '' ?
                        <span className='mt-2 w-full flex justify-start items-start text-sm text-red-500'>{errorSignIn}</span>
                        :
                        null
                    }
                    <button type='submit' className='mt-4 w-full p-2 pl-24 pr-24 border bg-[#172539] border-[#172539] rounded-md cursor-pointer text-white hover:bg-[#2a3b53]'>Login</button>
                </div>
            </form>
        </Form>
        </div>
    </div>
    )
}