import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/input";

import { useForm } from "react-hook-form";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../services/firebaseConnection";
import { useContext, useEffect } from "react";

import toast from "react-hot-toast";
import { AuthContext } from "../../contexts/AuthContext";

const schema = z.object({
      name: z.string().min(2, "O campo nome é obrigatório"),
      email: z.string().email("Insira um e-mail válido").min(3, "O campo e-mail é obrigatório"),
      password: z.string().min(6, "O campo senha é obrigatório")
});

type FormData = z.infer<typeof schema>;

export const Register = () => {
      const navigate = useNavigate();
      const { signed } = useContext(AuthContext);
      const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
            resolver: zodResolver(schema),
            mode: "onChange"
      });

      useEffect(() => {
            if (signed) {
                  navigate('/dashboard', { replace: true });
            }
      }, []);

      async function onSubmit(data: FormData) {
            createUserWithEmailAndPassword(auth, data.email, data.password)
                  .then(async (user) => {
                        await updateProfile(user.user, {
                              displayName: data.name
                        });

                        navigate('/dashboard', { replace: true });
                  }).catch(() => {
                        toast.error("Erro ao cadastrar usuario")
                  })
      }

      return (
            <div className="w-full min-h-screen flex ">

                  <div className="w-2/3 max-lg:w-2/4 max-md:w-0">
                        <img src="/bg-login.jpg" className="w-full h-screen object-cover" />
                  </div>

                  <div className="w-1/3 max-lg:w-2/4 flex justify-center items-center flex-col gap-5 bg-color2 px-6 max-md:w-full">
                        <Link to="/">
                              <img src="/logo.png" alt="Logo" />
                        </Link>
                        <form className='max-w-xl w-full' onSubmit={handleSubmit(onSubmit)}>
                              <div className='mb-3'>
                                    <Input
                                          type="text"
                                          placeholder="Digite seu nome"
                                          name="name"
                                          register={register}
                                          error={errors.name?.message}
                                    />
                              </div>

                              <div className='mb-3'>
                                    <Input
                                          type="email"
                                          placeholder="Digite seu e-mail"
                                          name="email"
                                          register={register}
                                          error={errors.email?.message}
                                    />
                              </div>

                              <div className='mb-3'>
                                    <Input
                                          type="password"
                                          placeholder="********"
                                          name="password"
                                          register={register}
                                          error={errors.password?.message}
                                    />
                              </div>

                              <button className='bg-color3 w-full rounded-md text-white h-10 font-medium'>
                                    Cadastrar
                              </button>
                        </form>

                        <p className="text-white">Já possui conta? <Link to="/login" className="hover:text-color3">Acesse</Link></p>

                  </div>

            </div>
      )
}