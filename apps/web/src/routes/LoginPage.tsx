import logo from '../images/logo.svg';
import { Github } from '../icons/Github';
export function LoginPage () {



 return (
    <body className="mx-auto flex max-w-md flex-col gap-4 p-8">

        <div className="mx-auto flex max-w-md flex-col gap-4 p-8" >
            <img src={logo} alt="logo" />
        </div>
        <div className="mx-auto flex max-w-md flex-col gap-4 p-8">
            <h1 className="uppercase text-green mx-auto flex "> &gt; User authentication</h1>
            <p>Access your global save progress and arcade rank.</p>
        
        </div>
      
           <form action="">
            <label htmlFor="ussername">&gt; Username:</label>
            <input name="ussername" type="text" />
            <label htmlFor="password">&gt; Password:</label>
            <input name="password" type="text" />


            <p className="uppercase">or connect with</p>
            <button className=" border mr-3 px-4 py-2 ">
                discord
            </button>
                
            <button className=" border mr-3 px-4 py-2 ">
                github
            </button>
            <button className=" border mr-3 px-4 py-2 ">
                google
            </button>


            <div><button className=" border px-4 py-2 bg-green ">
                Sign in
            </button></div>
            </form> 
     
       
       

       
    </body>

 );

}