import { signOut } from "firebase/auth"
import { FaSignOutAlt } from "react-icons/fa"
import { Link } from "react-router-dom"
import { auth } from "../../services/firebaseConnection"


export const PanelHeader = () => {


      async function handleSignOut(){
            await signOut(auth);
      }

      return (
            <nav className="bg-color2 my-4 h-10 flex items-center px-5 justify-between text-white">
                  <div className="flex gap-3">
                        <Link to="/dashboard" className="hover:text-color3">Dashboard</Link>
                        <Link to="/dashboard/novo" className="hover:text-color3">Anunciar</Link>
                  </div>
                  <button className="flex gap-2 items-center opacity-80 hover:opacity-100" onClick={handleSignOut}>Sair <FaSignOutAlt size={20} color="#fff" /></button>
            </nav>
      )
}