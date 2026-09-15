import logo from '../images/logo.svg';
import { Github } from '../icons/Github';
import { Discord } from '../icons/Discord'
import { Google } from '../icons/Google'
import { useNavigate, Link } from 'react-router-dom';


export function SignupPage () {
    

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
            
                <form action="">

                    <label className='uppercase text-grey font-display' 
                    htmlFor="username">&gt; Username: </label>

                    <input className="block w-full border border-grey py-2 uppercase text-grey mb-10" 
                    placeholder="&gt; pixel_ "
                    id="username" type="text" />

                    <label className='uppercase text-grey font-display  ' htmlFor="email">&gt; Email:</label>
                    <input className="block w-full border border-grey py-2 uppercase text-grey " 
                    placeholder="&gt; enter email" 
                    id="email" type="email" />
                    
                    <label className='uppercase text-grey font-display  ' htmlFor="password">&gt; Password:</label>
                    <input className="block w-full border border-grey py-2 uppercase text-grey " 
                    placeholder="&gt; enter secure pass" id="password" type="password" />
                    
                    <label className='uppercase text-grey font-display  ' htmlFor="r-password">&gt; Repeat password:</label>
                    <input className="block w-full border border-grey py-2 uppercase text-grey " 
                    placeholder="&gt; enter secure pass" id="r-password" type="password" />

                    <p className="uppercase text-violet font-display mt-4">or connect with</p>
                    <button className="gap-2 items-center justify-center border mr-3 px-4 py-2 inline-flex text-blue border-grey ">
                    <Discord  /> <span className='text-white'>discord</span>
                    </button>
                        
                    <button 
                    className="gap-2 items-center justify-center border mr-3 px-4 py-2 inline-flex border-grey text-white">
                        <Github /> 
                        <span className='text-white'>github</span>
                    </button>

                    <button 
                    className=" gap-2 items-center justify-center border mr-3 px-4 py-2 inline-flex text-green border-grey ">
                    <Google /> 
                    <span className='text-white'>google</span>
                    </button>
        

                    <div>
                    <button  className=" justify-center uppercase mx-auto flex w-full  py-2 bg-green mt-5 text-center font-display">
                        Create account
                    </button>
                    </div>
                    </form> 
            
                <div className="flex gap-5">
                    <p className='text-pink'>Privacy policy</p>
                    <p className='text-violet uppercase'> Already have an account?
                       <Link to='/login'>
                            Log in &gt;
                       </Link>  </p>
                </div>


            </div>
        
        </main>

    );

}