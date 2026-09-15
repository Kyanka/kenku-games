import { useState } from 'react'
import logo from '../images/logo.svg';
import { Github } from '../icons/Github';
import { Discord } from '../icons/Discord'
import { Google } from '../icons/Google'
import { useNavigate, Link, Navigate } from 'react-router-dom';


export function LoginPage () {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsloading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setError('');
        setIsloading(true);


        //bla bla bla errors and signin 
        //что тут будет зависит от типа авторизации
        navigate('/home')



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
        
                <form >
                    <label className='uppercase text-grey font-display' 
                    htmlFor="ussername">
                        &gt; Username: </label>
                    
                    <input 
                        className="block w-full border border-grey py-2 uppercase text-grey" 
                        placeholder="&gt; pixel_ " 
                        id="ussername" 
                        type="text" 
                        value={username}
                        required
                        onChange={(e)=> setUsername (e.target.value)}
                        
                        />
                    
                    <label 
                        className='
                        uppercase text-grey font-display  ' 
                        htmlFor="password">
                        &gt; Password:</label>
                    
                    <input 
                        className="block w-full border border-grey py-2 uppercase text-grey " 
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
        
                <div className="flex gap-5">
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