import logo from '../images/logo.svg';
import { Github } from '../icons/Github';
import { Discord } from '../icons/Discord'
import { Google } from '../icons/Google'


export function LoginPage () {



 return (
    <body className="mx-auto flex max-w-md flex-col p-2">

        <div className="mx-auto flex max-w-md flex-col p-2" >
            <img src={logo} alt="logo" />
        </div>
        <div className="mx-auto flex max-w-md flex-col p-2">
            <h1 className="uppercase text-green mx-auto flex font-display "> &gt; User authentication</h1>
            <p>Access your global save progress and arcade rank.</p>
        
        </div>
      
           <form action="">
            <label htmlFor="ussername">&gt; Username: </label>
            <input className="block w-full border border-grey" placeholder="&gt; " name="ussername" type="text" />
            <label htmlFor="password">&gt; Password:</label>
            <input className="block w-full border border-grey " placeholder="&gt; " name="password" type="text" />


            <p className="uppercase">or connect with</p>
            <button className="gap-2 items-center justify-center border mr-3 px-4 py-2 inline-flex text-blue border-grey ">
               <Discord  /> <span className='text-white'>discord</span>
            </button>
                
            <button className="gap-2 items-center justify-center border mr-3 px-4 py-2 inline-flex ">
                <Github /> <span className='text-grey'>github</span>
            </button>
            <button className=" gap-2 items-center justify-center border mr-3 px-4 py-2 inline-flex  ">
               <Google /> google
            </button>
 

            <div>
            <button  className=" justify-center uppercase mx-auto flex w-full border  py-2 bg-green mt-5 text-center">
                Sign in
            </button>
            </div>
            </form> 
     
       <div className="flex gap-5">
       <p>Forgot password</p>
       <p>New player? Create account &gt; </p>
        </div>
        
       
    </body>

 );

}