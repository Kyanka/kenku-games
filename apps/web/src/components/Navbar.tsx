import logo from "../images/logo.svg";
import { useNavigate } from "react-router-dom";
import { signOut } from "../lib/auth-client.js";

export function Navbar() {
  const navigate = useNavigate();

  async function handleLogout() {
    localStorage.removeItem("bearer_token");
    await signOut();
    navigate("/login", { replace: true });
  }

  return (
    <nav className=" bg-black border-b-2 border-white text-grey flex justify-between font-main items-center">
      <div className="w-40">
        <img src={logo} alt="logo" />
      </div>

      <div className=" flex gap-2  ">
        <div>
          <button onClick={handleLogout} className="text-sm  hover:text-green  transition-colors">
            Sign out
          </button>
        </div>
        <div>
          <button
            onClick={() => navigate("/profile")}
            className="text-sm  hover:text-green  transition-colors"
          >
            Profile
          </button>
        </div>
      </div>
    </nav>
  );
}
