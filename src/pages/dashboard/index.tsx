import Container from "../../components/container"
import { FaTrash } from "react-icons/fa"
import { PanelHeader } from "../../components/panelHeader"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../contexts/AuthContext"
import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore"
import { db, storage } from "../../services/firebaseConnection"
import { deleteObject, ref } from "firebase/storage"
import toast from "react-hot-toast"

export interface PropertyProps {
      id: string;
      title: string;
      bedroom: string;
      suits: string;
      bathroom: string;
      parking: string;
      buildingArea: string;
      totalArea: string;
      whatsapp: string;
      city: string;
      recreation: string;
      description: string;
      images: ImagesProps[];
      uidOwner: string;
      created: string;
      price: string;
      modality: string;
}

interface ImagesProps {
      name: string;
      uid: string;
      url: string;
}

export const Dashboard = () => {
      const { user } = useContext(AuthContext);
      const [properties, setProperties] = useState<PropertyProps[]>([]);
      const [loadingImages, setLoadingImages] = useState<string[]>([]);

      useEffect(() => {

            function loadProperties() {
                  if (!user?.uid) {
                        return;
                  }

                  const propertiesRef = collection(db, "properties");
                  const queryRef = query(propertiesRef, where("uidOwner", "==", user.uid));

                  getDocs(queryRef).then((snapshot) => {
                        let listProperties: PropertyProps[] = [];

                        snapshot.forEach(doc => {
                              const { title, bedroom, suits, bathroom, parking, buildingArea, totalArea, whatsapp, city, recreation, description, images, created, uidOwner, price, modality } = doc.data();

                              listProperties.push({
                                    id: doc.id,
                                    title, bedroom, suits, bathroom, parking, buildingArea, totalArea, whatsapp, city, recreation, description, images, created, uidOwner, price, modality
                              })
                        });

                        setProperties(listProperties);
                  });
            }

            loadProperties();

      }, [user]);

      function handleImageLoad(id: string){
            setLoadingImages(prevImageLoaded => [...prevImageLoaded, id]);
      }

      async function handleDeleteProperty(property: PropertyProps){
            const docRef = doc(db, "properties", property.id);
            await deleteDoc(docRef).then(() => {
                  property.images.map( async image => {
                        const imagePath = `images/properties/${user?.uid}/${image.name}`;
                        const imageRef = ref(storage, imagePath);

                        try {
                              await deleteObject(imageRef);
                        } catch (_){
                              toast.error('Erro ao excluir imagens');
                        }
                  })
                  setProperties(properties.filter(item => item.id !== property.id));
                  toast.success("Imóvel excluído com sucesso!");
            })
      }


      return (
            <Container>
                  <PanelHeader />
                  <main className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

                        {
                              properties.map(item => (
                                    <section className="w-full bg-white relative mb-5">
                                          <div
                                                className='w-full h-72 rounded bg-slate-200'
                                                style={{ display: loadingImages.includes(item.id) ? 'none' : 'block' }}
                                          ></div>
                                          <button className="absolute bg-white w-14 h-14 rounded flex items-center justify-center right-2 top-2 drop-shadow"
                                                onClick={() =>handleDeleteProperty(item)}
                                          >
                                                <FaTrash size={26} color="#000" />
                                          </button>
                                          <img
                                                className="w-full h-72 min-w-full mb-2 object-cover"
                                                src={item.images[0].url}
                                                alt="Imagem do carro"
                                                onLoad={() => handleImageLoad(item.id)}
                                                style={{ display: loadingImages.includes(item.id) ? 'block' : 'none'}}
                                          />
                                          <p className="font-bold mt-1 mb-2 px-2 text-center">{item.title}</p>

                                          <div className="flex flex-col px-2 text-center">
                                                <strong className="text-black font-medium text-xl">{item.price}</strong>
                                          </div>

                                          <hr className="my-2" />

                                          <div className="px-2 pb-2">
                                                <span className="text-zinc-700">
                                                      {item.city}
                                                </span>
                                          </div>
                                    </section>
                              ))
                        }

                  </main>
            </Container>
      )
}