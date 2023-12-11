import { useContext } from "react"
import { FaFacebookSquare, FaInstagramSquare, FaPinterestSquare, FaTwitterSquare, FaYoutubeSquare } from "react-icons/fa"
import { Link } from "react-router-dom"
import { AuthContext } from "../../contexts/AuthContext"


export const Footer = () => {
      const { signed } = useContext(AuthContext);
      return (
            <footer>
                  <div className="flex items-center justify-center py-12 bg-color1">
                        <div className="flex max-w-7xl w-full px-5 justify-between max-sm:flex-col max-sm:gap-8">
                              <div>
                                    <h3 className="font-bold mb-3 after:w-10 after:h-1 after:bg-color2">Imóveis</h3>
                                    <ul>
                                          <li><Link to="/modalidade/venda">Venda</Link></li>
                                          <li><Link to="/modalidade/locacao">Locação</Link></li>
                                    </ul>
                              </div>
                              <div>
                                    <h3 className="font-bold mb-3">Anunciante</h3>
                                    {
                                          signed ? (
                                                <ul>
                                                      <li><Link to="/dashboard/novo">Anunciar</Link></li>
                                                      <li><Link to="/dashboard">Dashboard</Link></li>
                                                </ul>
                                          ) : (
                                                <ul>
                                                      <li><Link to="/login">Entrar</Link></li>
                                                      <li><Link to="/registrar">Criar conta</Link></li>
                                                </ul>
                                          )
                                    }
                              </div>
                              <div>
                                    <h3 className="font-bold mb-3">Redes sociais</h3>
                                    <div className="flex gap-2">
                                          <a href="">
                                                <FaFacebookSquare size={30} color="#002333" />
                                          </a>
                                          <a href="">
                                                <FaInstagramSquare size={30} color="#002333" />
                                          </a>
                                          <a href="">
                                                <FaYoutubeSquare size={30} color="#002333" />
                                          </a>
                                          <a href="">
                                                <FaPinterestSquare size={30} color="#002333" />
                                          </a>
                                          <a href="">
                                                <FaTwitterSquare size={30} color="#002333" />
                                          </a>
                                    </div>
                              </div>
                        </div>
                  </div>
                  <div className="flex flex-col items-center justify-center py-8 bg-color2 text-white gap-5">
                        <Link to="/">
                              <img src="/logo.png" alt="Logo DevProperties" className="w-52" />
                        </Link>
                        <p className="">&copy; Todos os direitos reservados à DevProperties - Desenvolvido por Renan Cruz</p>
                  </div>
            </footer>
      )
}