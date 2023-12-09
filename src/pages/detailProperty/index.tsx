import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import Container from "../../components/container";
import { FaBed, FaToilet, FaBath, FaCar, FaBorderStyle, FaFutbol, FaDonate, FaSearch, FaWhatsapp, FaChartArea } from 'react-icons/fa';

import { Swiper, SwiperSlide } from "swiper/react";
import { PropertyProps } from '../dashboard';
import { collection, doc, getDoc, getDocs, query } from 'firebase/firestore';
import { db } from '../../services/firebaseConnection';

const DetailProperty = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [property, setProperty] = useState<PropertyProps>();
  const [slidePerView, setSlidePerView] = useState<number>(2);
  const [loadImages, setLoadImages] = useState<string[]>([]);
  const [inputSearch, setInputSearch] = useState("");
  const [properties, setProperties] = useState<PropertyProps>();

  useEffect(() => {

    function handleResize() {
      if (window.innerWidth < 720) {
        setSlidePerView(1);
      } else {
        setSlidePerView(2);
      }
    }

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize)
  }, []);

  useEffect(() => {
    loadProperty();
  }, [id]);

  async function loadProperty() {
    if (!id) {
      navigate("/");
      return;
    }
    
    const docRef = doc(db, "properties", id);
    await getDoc(docRef).then((snapshot) => {
      if (!snapshot.data()) {
        navigate("/");
      }

      const { title, bedroom, suits, bathroom, parking, buildingArea, totalArea, whatsapp, city, recreation, description, images, created, uidOwner, price, modality } = snapshot.data() as PropertyProps;

      setProperty({
        id, title, bedroom, suits, bathroom, parking, buildingArea, totalArea, whatsapp, city, recreation, description, images, created, uidOwner, price, modality
      });
    });
  }

  useEffect(() => {
    function loadProperties() {
      const propertiesRef = collection(db, "properties");
      const queryRef = query(propertiesRef);

      getDocs(queryRef).then((snapshot) => {
        let listProperties: PropertyProps[] = [];

        snapshot.forEach((doc) => {
          const { title, bedroom, suits, bathroom, parking, buildingArea, totalArea, whatsapp, city, recreation, description, images, created, uidOwner, price, modality } = doc.data();

          listProperties.push({
            id: doc.id,
            title, bedroom, suits, bathroom, parking, buildingArea, totalArea, whatsapp, city, recreation, description, images, created, uidOwner, price, modality
          });
        });

        const reorderListProperties = listProperties.sort(() => Math.random() - 0.5);

        if (reorderListProperties[0].id === id) {
          setProperties(reorderListProperties[1]);
        } else {
          setProperties(reorderListProperties[0]);
        }
      })

    }

    loadProperties();


  }, [id])

  function handleImageLoaded(id: string) {
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

      {
        property?.images && (
          <Swiper
            slidesPerView={property.images?.length > 1 ? slidePerView : 1}
            pagination={{ clickable: true }}
            navigation
            className="mt-5"
          >
            {
              property?.images.map(images => (
                <SwiperSlide key={images.url}>
                  <div className='w-full h-96 bg-slate-700' style={{ display: loadImages.includes(images.uid) ? 'none' : 'block' }}></div>
                  <img src={images.url} alt={images.name} className="w-full h-96 object-cover" onLoad={() => handleImageLoaded(images.uid)} style={{ display: loadImages.includes(images.uid) ? 'block' : 'none' }} />
                </SwiperSlide>
              ))
            }
          </Swiper>
        )
      }

      <main className="flex gap-5 mb-5 w-full text-color2 max-md:flex-col items-start">
        {
          property && (
            <div className="mt-5 flex flex-col gap-1 bg-white p-5">
              <h1 className="font-bold text-xl mb-4">{property.title}</h1>

              <div>
                <p className="leading-6 text-color2">{property.description}</p>
              </div>
              {
                property.recreation.trim() !== '' && (
                  <>
                    <h2 className="font-bold mt-3 mb-2">Lazer:</h2>
                    <div>
                      <ul className="list-item list-disc ml-8">
                        {property.recreation.split(",").map((item, index) => (
                          <li key={index}>{item.trim()}</li>
                        ))}
                      </ul>
                    </div>
                  </>
                )
              }

              <h2 className="font-bold mt-3 mb-2">Resumo do imóvel</h2>
              <article className="w-full flex flex-col justify-between">

                <div className="flex flex-col gap-4 p-2">

                  <div className="flex gap-5 max-sm:justify-between max-sm:gap-0">

                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-2">
                        <FaBed size={16} color="#002333" />
                        <span className="text-xs font-bold text-color2">Quartos</span>
                      </div>
                      <span className="text-sm font-bold text-color2">{property.bedroom}</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-2">
                        <FaToilet size={16} color="#002333" />
                        <span className="text-xs font-bold text-color2">Banheiros</span>
                      </div>
                      <span className="text-sm font-bold text-color2">{property.bathroom}</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-2">
                        <FaBath size={16} color="#002333" />
                        <span className="text-xs font-bold text-color2">Suítes</span>
                      </div>
                      <span className="text-sm font-bold text-color2">{property.suits}</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-2">
                        <FaCar size={16} color="#002333" />
                        <span className="text-xs font-bold text-color2">Vagas</span>
                      </div>
                      <span className="text-sm font-bold text-color2">{property.parking}</span>
                    </div>

                  </div>
                  <div className="flex gap-8">
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-2">
                        <FaChartArea size={24} color="#002333" />
                        <span className="text-xs font-bold text-color2">Área</span>
                      </div>
                      <span className="text-base font-bold text-color2">{property.buildingArea} m²</span>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-2">
                        <FaBorderStyle size={24} color="#002333" />
                        <span className="text-xs font-bold text-color2">Área total</span>
                      </div>
                      <span className="text-base font-bold text-color2">{property.totalArea} m²</span>
                    </div>

                  </div>

                  <div className="flex gap-6">

                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <FaDonate size={28} color="#159A9C" />
                        <span className="text-xs font-bold text-color3">{property.modality}</span>
                      </div>
                      <span className="text-xl font-bold text-color3">{property.price}</span>
                    </div>

                  </div>

                </div>
              </article>

              <button className='bg-green-500 flex h-11 text-white gap-2 items-center justify-center'>
                <p>Conversar com corretor</p>
                <FaWhatsapp size={28} color="#FFF" />
              </button>
            </div>
          )
        }

        <aside className="flex flex-col gap-5 mt-5 w-full">
          <section className=" p-0 rounded w-full max-w-3xl mx-auto mt-3">
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

          <h2 className="font-bold -mb-3">Confira outros imóveis</h2>
          {
            properties && (
              <Link to={`/imovel/${properties.id}`}>
                <article className="w-full bg-white flex flex-col justify-between">
                  <img
                    className="w-full h-64 object-cover min-w-full"
                    src={properties.images[0].url} alt={`Imagem do imóvel ${properties.title}`}
                  />

                  <div className="flex flex-col gap-4 p-2">
                    <h2 className="font-bold text-color3 text-xl">{properties.title}</h2>

                    <div className="flex gap-2 justify-between">

                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2">
                          <FaBed size={16} color="#002333" />
                          <span className="text-xs font-bold text-color2">Quartos</span>
                        </div>
                        <span className="text-sm font-bold text-color2">{properties.bedroom}</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2">
                          <FaToilet size={16} color="#002333" />
                          <span className="text-xs font-bold text-color2">Banheiros</span>
                        </div>
                        <span className="text-sm font-bold text-color2">{properties.bathroom}</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2">
                          <FaBath size={16} color="#002333" />
                          <span className="text-xs font-bold text-color2">Suítes</span>
                        </div>
                        <span className="text-sm font-bold text-color2">{properties.suits}</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2">
                          <FaCar size={16} color="#002333" />
                          <span className="text-xs font-bold text-color2">Vagas</span>
                        </div>
                        <span className="text-sm font-bold text-color2">{properties.parking}</span>
                      </div>

                    </div>
                    <div className="flex gap-6 justify-around">

                      <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2">
                          <FaChartArea size={24} color="#002333" />
                          <span className="text-xs font-bold text-color2">Área</span>
                        </div>
                        <span className="text-base font-bold text-color2">{properties.buildingArea} m²</span>
                      </div>

                      <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2">
                          <FaFutbol size={24} color="#002333" />
                          <span className="text-xs font-bold text-color2">Lazer</span>
                        </div>
                        <span className="text-base font-bold text-color2">{properties.recreation.length > 0 ? 'Sim' : 'Não'}</span>
                      </div>

                    </div>

                    <div className="flex gap-6">

                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <FaDonate size={28} color="#159A9C" />
                          <span className="text-xs font-bold text-color3">{properties.modality}</span>
                        </div>
                        <span className="text-xl font-bold text-color3">{properties.price}</span>
                      </div>

                    </div>

                    <hr />

                    <span className="text-color2">{properties.city}</span>

                  </div>
                </article>
              </Link>
            )
          }

        </aside>
      </main>
    </Container >
  )

}

export default DetailProperty