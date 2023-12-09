import { useContext } from 'react'
import { Link } from 'react-router-dom';
import { FaUser } from 'react-icons/fa'
import { AuthContext } from '../../contexts/AuthContext';

const Header = () => {
  const { signed } = useContext(AuthContext)

  return (
    <header className="bg-color2 h-20 flex items-center justify-center max-sm:h-40">
      <nav className='flex flex-col max-w-7xl w-full px-5 justify-between sm:flex-row max-sm:gap-4 max-sm:justify-center max-sm:items-center'>

        <Link to="/">
          <img src="/logo.png" alt="Logo DevProperties" />
        </Link>

        {
          signed ? (
            <div>
              <Link to="/dashboard" className='flex bg-white rounded-full p-2 items-center text-color2'>
                <FaUser size={26} color="#002333" />
              </Link>
            </div>
          ) : (
            <div className='flex gap-5'>
              <Link to="/registrar" className='bg-color3 text-white h-10 flex items-center px-4 rounded'>
                Criar conta
              </Link>
              <Link to="/login" className='flex bg-white h-10 rounded px-4 items-center gap-1 text-color2'>
                <FaUser size={16} color="#002333" />
                Entrar
              </Link>
            </div>
          )
        }



      </nav>
    </header>
  )
}

export default Header;