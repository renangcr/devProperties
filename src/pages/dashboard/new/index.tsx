import { useState } from 'react';
import { FaFileUpload, FaTrash } from "react-icons/fa"
import Container from "../../../components/container"
import { PanelHeader } from "../../../components/panelHeader"
import Input from "../../../components/input"

import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';

import { db, storage } from "../../../services/firebaseConnection";

import toast from "react-hot-toast";

import { useForm } from "react-hook-form";
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { v4 as uuidV4 } from 'uuid';
import { addDoc, collection } from 'firebase/firestore';

const schema = z.object({
  title: z.string().min(1, "O campo titulo é obrigatório"),
  bedroom: z.string().min(1, "O campo N° Quartos é obrigatório"),
  suits: z.string().min(1, "O campo N° Suítes é obrigatório"),
  bathroom: z.string().min(1, "O campo N° banheiros é obrigatório"),
  parking: z.string().min(1, "O campo N° vagas é obrigatório"),
  buildingArea: z.string().min(1, "O campo área construída é obrigatório"),
  totalArea: z.string().min(1, "O campo área total é obrigatório"),
  whatsapp: z.string().min(1, "Campo whatsapp é obrigatório").refine((value) => /^(\d{11,12})$/.test(value), {
    message: "Número de whatsapp inválido"
  }),
  city: z.string().min(1, "O campo cidade é obrigatório"),
  price: z.string().min(1, "O campo preço é obrigatório"),
  recreation: z.string(),
  description: z.string().min(1, "O campo descrição é obrigatório"),
  modality: z.string().min(1, "O campo preço é obrigatório"),
});

type FormData = z.infer<typeof schema>;

interface ImagemItemProps {
  uid: string;
  name: string;
  previewUrl: string;
  url: string;
}

export const New = () => {
  const { user } = useContext(AuthContext);
  const [propertyImages, setPropertyImages] = useState<ImagemItemProps[]>([]);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange'
  });

  function onSubmit(data: FormData) {
    if (propertyImages.length === 0) {
      toast.error("Envie alguma imagem");
      return;
    }

    const propertyListImages = propertyImages.map(property => {
      return {
        uid: property.uid,
        name: property.name,
        url: property.url
      }
    });

    const { title, bedroom, suits, bathroom, parking, buildingArea, totalArea, whatsapp, city, recreation, description, price, modality } = data;

    addDoc(collection(db, "properties"), {
      uidOwner: user?.uid,
      images: propertyListImages,
      created: new Date(),
      title: title.toUpperCase(), bedroom, suits, bathroom, parking, buildingArea, totalArea, whatsapp, city, recreation, description, price: Number(price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), modality
    }).then(() => {
      reset();
      setPropertyImages([]);
      toast.success("Imóvel cadastrado com sucesso", {
        style: {
          padding: 25
        }
      });
    }).catch(() => {
      toast.error("Erro ao cadastrar imóvel")
    })
  }

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const image = e.target.files[0];

      if (image.type === 'image/jpeg' || image.type === 'image/png') {
        await handleUpload(image)
      } else {
        toast.error("Tipo de imagem inválido");
      }
    }
  }

  async function handleUpload(image: File) {
    if (!user?.uid) return;

    const currentUid = user?.uid;
    const uidImage = uuidV4();

    const uploadRef = ref(storage, `images/properties/${currentUid}/${uidImage}`);

    await uploadBytes(uploadRef, image)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref).then((downloadUrl) => {
          const imageItem = {
            name: uidImage,
            uid: currentUid,
            previewUrl: URL.createObjectURL(image),
            url: downloadUrl
          }

          setPropertyImages((images) => [...images, imageItem])
        })
      }).catch(() => {
        toast.error('Erro ao enviar imagem');
      })

  }

  async function handleDeleteImage(item: ImagemItemProps) {
    const imagePath = `images/properties/${item.uid}/${item.name}`;

    const imageRef = ref(storage, imagePath);

    try {
      await deleteObject(imageRef);
      setPropertyImages(propertyImages.filter(imgProperty => imgProperty.url !== item.url))
    } catch (_) {
      toast.error("Erro ao deletar imagem");
    }
  }

  return (
    <Container>
      <PanelHeader />

      <div className="w-full bg-white p-3  flex flex-col sm:flex-row items-center gap-2">
        <button className="border-2 w-48  flex items-center justify-center cursor-pointer border-gray-600 h-32 md:w-48">
          <div className="absolute cursor-pointer">
            <FaFileUpload size={30} color="#002333" />
          </div>

          <div className="cursor-pointer">
            <input type="file" accept="image/*" className="opacity-0 cursor-pointer" onChange={handleFile} />
          </div>
        </button>

        {
          propertyImages.map(item => (
            <div key={item.name} className="w-full h-32 flex items-center justify-center relative">
              <button className="absolute" onClick={() => handleDeleteImage(item)}>
                <FaTrash size={28} color="#FFF" />
              </button>
              <img src={item.previewUrl} className="w-full h-32 object-cover" alt="Foto do imóvel" />
            </div>
          ))
        }
      </div>

      <div className="w-full bg-white p-3 flex flex-col sm:flex-row items-center gap-2 my-2">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='w-full'>
          <div className='mb-3'>
            <p className="mb-2 font-medium">Título</p>
            <Input
              type="text"
              placeholder="Ex: Apartamento 2 dormitórios"
              name="title"
              register={register}
              error={errors.title?.message}
            />
          </div>


          <div className="flex w-full mb-3 flex-row items-center gap-4">
            <div className="w-full">
              <p className="mb-2 font-medium">N° Quartos</p>
              <Input
                type="number"
                placeholder="Ex: 3"
                name="bedroom"
                register={register}
                error={errors.bedroom?.message}
              />
            </div>

            <div className="w-full">
              <p className="mb-2 font-medium">N° Suítes</p>
              <Input
                type="number"
                placeholder="Ex: 3"
                name="suits"
                register={register}
                error={errors.suits?.message}
              />
            </div>

            <div className="w-full">
              <p className="mb-2 font-medium">N° Banheiros</p>
              <Input
                type="number"
                placeholder="Ex: 3"
                name="bathroom"
                register={register}
                error={errors.bathroom?.message}
              />
            </div>
          </div>

          <div className="flex w-full mb-3 flex-row items-center gap-4">
            <div className="w-full">
              <p className="mb-2 font-medium">Vagas</p>
              <Input
                type="number"
                placeholder="Ex: 3"
                name="parking"
                register={register}
                error={errors.parking?.message}
              />
            </div>

            <div className="w-full">
              <p className="mb-2 font-medium">Área C</p>
              <Input
                type="number"
                placeholder="Ex: 145"
                name="buildingArea"
                register={register}
                error={errors.buildingArea?.message}
              />
            </div>

            <div className="w-full">
              <p className="mb-2 font-medium">Área T</p>
              <Input
                type="number"
                placeholder="Ex: 200"
                name="totalArea"
                register={register}
                error={errors.totalArea?.message}
              />
            </div>
          </div>

          <div className="flex w-full mb-3 flex-row items-center gap-4">
            

            <div className="w-full">
              <p className="mb-2 font-medium">Lazer ( Separar com ,)</p>
              <Input
                type="text"
                placeholder="Piscina, Churrasqueira, Playground"
                name="recreation"
                register={register}
                error={errors.recreation?.message}
              />
            </div>

            <div className="w-full">
              <p className="mb-2 font-medium">Modalidade</p>
              <select {...register("modality")} name="modality" className='w-full border-2 rounded h-11 px-2'>
                <option value="Venda">Venda</option>
                <option value="Locação">Locação</option>
              </select>
            </div>
          </div>

          <div className="flex w-full mb-3 flex-row items-center gap-4">
            <div className="w-full">
              <p className="mb-2 font-medium">Telefone / Whatsapp</p>
              <Input
                type="text"
                placeholder="Ex: (11) 99999-9999"
                name="whatsapp"
                register={register}
                error={errors.whatsapp?.message}
              />
            </div>

            <div className="w-full">
              <p className="mb-2 font-medium">Cidade</p>
              <Input
                type="text"
                placeholder="Ex: São Paulo - SP"
                name="city"
                register={register}
                error={errors.city?.message}
              />
            </div>

            <div className="w-full">
              <p className="mb-2 font-medium">Preço</p>
              <Input
                type="text"
                placeholder="Ex: 100000"
                name="price"
                register={register}
                error={errors.price?.message}
              />
            </div>
          </div>

          <div className='mb-3'>
            <p className="mb-2 font-medium">Descrição</p>
            <textarea
              className="border-2 w-full h-24 px-2"
              {...register("description")}
              name="description"
              placeholder="Digite a descrição completa sobre o imóvel..."
            />
            {errors.description && <p className="text-red-700 my-1">{errors.description.message}</p>}
          </div>

          <button
            type="submit"
            className='bg-color2 w-full text-white h-10 font-medium'>
            Cadastrar
          </button>
        </form>
      </div>
    </Container>
  )
}