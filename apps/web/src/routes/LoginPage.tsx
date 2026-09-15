import { useState } from 'react'
import logo from '../images/logo.svg';
import { Github } from '../icons/Github';
import { Discord } from '../icons/Discord'
import { Google } from '../icons/Google'
import { useNavigate, Link } from 'react-router-dom';
import { signIn } from "../lib/auth-client.js";


export function LoginPage () {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsloading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setIsloading(true);

        const { error } = await signIn.email({ email, password });

        setIsloading(false);

        if (error) {
            setError(error.message ?? "Login error ");
            return;
        }

        navigate("/");
        
    }

    return (
        <main className="mx-auto flex flex-col p-2 bg-black">

            <header className="mx-auto w-130 flex-col pb-5" >
                <img src={logo} alt="logo" />
            </header>

            
            <div  className='mx-auto max-w-md' >
                <div className="mb-10">
                    <h1 className="uppercase text-green font-display text-lg "> &gt; User authentication</h1>
                    <p className='text-sm text-grey'>Access your global save progress and arcade rank.</p>
                
                </div>
        
                <form onSubmit={handleSubmit} >
                    <label className='uppercase text-grey font-display' 
                    htmlFor="email">
                        &gt; Email: </label>
                    
                    <input 
                        className="block w-full border border-grey py-2 placeholder:uppercase text-grey not-placeholder-shown:bg-grey not-placeholder-shown:text-black " 
                        placeholder="&gt; pixel_ " 
                        id="email" 
                        type="email" 
                        value={email}
                        required
                        onChange={(e)=> setEmail (e.target.value)}
                        
                        />
                    
                    <label 
                        className='
                        uppercase text-grey font-display  ' 
                        htmlFor="password">
                        &gt; Password:</label>
                    
                    <input 
                        className="block w-full border border-grey py-2 placeholder:uppercase text-grey " 
                        placeholder="&gt; enter secure pass" 
                        id="password" 
                        type="password"
                        value={password} 
                        required
                        onChange={(e)=> setPassword(e.target.value)}
                        />


                    <p 
                    className="uppercase text-violet font-display mt-4">or connect with</p>

                    <button 
                    className="gap-2 items-center justify-center border mr-3 px-4 py-2 inline-flex text-blue border-grey ">
                    <Discord  /> <span className='text-white'>discord</span>
                    </button>
                        
                    <button 
                    className="gap-2 items-center justify-center border mr-3 px-4 py-2 inline-flex border-grey text-white">
                        <Github /> <span className='text-white'>github</span>
                    </button>

                    <button 
                    className=" gap-2 items-center justify-center border mr-3 px-4 py-2 inline-flex text-green border-grey ">
                    <Google /> <span className='text-white'>google</span>
                    </button>
    

                    <div>
                        <button 
                        type='submit' 
                        disabled={isLoading} 
                        className =" justify-center uppercase mx-auto flex w-full  py-2 bg-green mt-5 text-center font-display">
                           {isLoading ? "Loading..." : "Sign in"} 
                        </button>
                    </div>
                </form> 

                {error && <p className="text-sm text-pink rounded-lg px-3 py-2 ">{error}</p>}
                <div className="flex gap-5 mb-50">
                    <p className='text-pink'>Forgot password</p>
                    <p className='text-violet uppercase'>New player? 
                        <Link to='/signup'>
                            Create account &gt;
                        </Link>
                         </p>
                </div>
        
            </div>
        
        </main>

    );

}