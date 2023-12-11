import { Link, useNavigate, useParams } from "react-router-dom";
import Container from "../../components/container";
import { FaBed, FaToilet, FaBath, FaCar, FaFutbol, FaDonate, FaSearch, FaChartArea } from 'react-icons/fa';
import { FormEvent, useEffect, useState } from "react";
import { PropertyProps } from "../dashboard";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";

export const Modality = () => {
  const { modality } = useParams();
  const [properties, setProperties] = useState<PropertyProps[]>([]);
  const [loadImages, setLoadImages] = useState<string[]>([]);
  const [inputSearch, setInputSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadProperties();
  }, [modality]);

  function loadProperties() {
    
    if (modality === 'venda' || modality === 'locacao') {
      const propertiesRef = collection(db, "properties");
      const queryRef = query(propertiesRef, orderBy("created", "desc"), where('modality', '==', modality));

      getDocs(queryRef).then((snapshot) => {
        let listProperties: PropertyProps[] = [];

        snapshot.forEach((doc) => {
          const { title, bedroom, suits, bathroom, parking, buildingArea, totalArea, whatsapp, city, recreation, description, images, created, uidOwner, price, modality } = doc.data();

          listProperties.push({
            id: doc.id,
            title, bedroom, suits, bathroom, parking, buildingArea, totalArea, whatsapp, city, recreation, description, images, created, uidOwner, price, modality
          });
        });

        setProperties(listProperties);
      })
    } else {
      navigate("/");
    }

  }

  function handleLoadImage(id: string) {
    setLoadImages(prevImages => [...prevImages, id]);
  }

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    if (inputSearch.trim() === '') {
      return;
    }

    navigate(`/busca/${inputSearch}`);

  }


  return (
    <Container>
      <section className=" p-4 rounded w-full max-w-3xl mx-auto mt-3">
        <form
          className='w-full flex gap-2 relative items-center'
          onSubmit={(e) => handleSearch(e)}
        >
          <input
            className="w-full border-2 rounded h-10 px-3 outline-none border-color2 text-color2"
            placeholder="Buscar imóvel..."
            value={inputSearch}
            onChange={(e) => setInputSearch(e.target.value)}
          />
          <button
            className="h-9 px-2 font-medium text-xs absolute right-1"
            type='submit'
          >
            <FaSearch size={24} color="#002333" />
          </button>
        </form>
      </section>

      <main className="grid grid-cols-1 mt-3 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">

        {
          properties.map(item => (
            <Link to={`/imovel/${item.id}`} key={item.id}>
              <article className="w-full bg-white flex flex-col justify-between">
                <div
                  className='w-full h-72  rounded bg-slate-200'
                  style={{ display: loadImages.includes(item.id) ? "none" : "block" }}
                ></div>
                <img
                  className="w-full h-64 object-cover min-w-full"
                  src={item.images[0].url} alt={`Imagem do imóvel ${item.title}`}
                  style={{ display: loadImages.includes(item.id) ? "block" : "none" }}
                  onLoad={() => handleLoadImage(item.id)}
                />

                <div className="flex flex-col gap-4 p-2">
                  <h2 className="font-bold text-color3 text-xl">{item.title}</h2>

                  <div className="flex gap-2 justify-between">

                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-2">
                        <FaBed size={16} color="#002333" />
                        <span className="text-xs font-bold text-color2">Quartos</span>
                      </div>
                      <span className="text-sm font-bold text-color2">{item.bedroom}</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-2">
                        <FaToilet size={16} color="#002333" />
                        <span className="text-xs font-bold text-color2">Banheiros</span>
                      </div>
                      <span className="text-sm font-bold text-color2">{item.bathroom}</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-2">
                        <FaBath size={16} color="#002333" />
                        <span className="text-xs font-bold text-color2">Suítes</span>
                      </div>
                      <span className="text-sm font-bold text-color2">{item.bathroom}</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-2">
                        <FaCar size={16} color="#002333" />
                        <span className="text-xs font-bold text-color2">Vagas</span>
                      </div>
                      <span className="text-sm font-bold text-color2">{item.parking}</span>
                    </div>

                  </div>
                  <div className="flex gap-6 justify-around">

                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-2">
                        <FaChartArea size={24} color="#002333" />
                        <span className="text-xs font-bold text-color2">Área</span>
                      </div>
                      <span className="text-base font-bold text-color2">{item.buildingArea} m²</span>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-2">
                        <FaFutbol size={24} color="#002333" />
                        <span className="text-xs font-bold text-color2">Lazer</span>
                      </div>
                      <span className="text-base font-bold text-color2">{item.recreation.trim() !== '' ? 'Sim' : 'Não'}</span>
                    </div>

                  </div>

                  <div className="flex gap-6">

                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <FaDonate size={28} color="#159A9C" />
                        <span className="text-xs font-bold text-color3">{item.modality}</span>
                      </div>
                      <span className="text-xl font-bold text-color3">{item.price}</span>
                    </div>

                  </div>

                  <hr />

                  <span className="text-color2">{item.city}</span>

                </div>
              </article>
            </Link>
          ))
        }

      </main>
    </Container>
  )

}