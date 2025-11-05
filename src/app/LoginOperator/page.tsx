'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export default function LoginOperator() {
  const router = useRouter();

  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const resp = await axios.post('/api/auth/operators/login', credentials);
      if (resp.status === 200) {
        toast.success('Bienvenido operador');
        // El middleware validará el rol OPERATOR y permitirá /Operator
        router.push('/Operator');
      } else {
        toast.error('Credenciales inválidas');
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Error iniciando sesión';
      toast.error(msg);
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="flex justify-center flex-col items-center sm:mx-auto sm:w-full sm:max-w-sm">
        <svg height="48" viewBox="0 -960 960 960" width="48" fill="#8C1AF6">
          <path d="M349-120H180q-24.75 0-42.37-17.63Q120-155.25 120-180v-600q0-24.75 17.63-42.38Q155.25-840 180-840h169v60H180v600h169v60Zm103 80v-880h60v880h-60Zm163-80v-60h60v60h-60Zm0-660v-60h60v60h-60Zm165 660v-60h60q0 25-17.62 42.5Q804.75-120 780-120Zm0-165v-60h60v60h-60Zm0-165v-60h60v60h-60Zm0-165v-60h60v60h-60Zm0-165v-60q24.75 0 42.38 17.62Q840-804.75 840-780h-60Z" />
        </svg>
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
          Ingresa con tu cuenta de operador
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6">Correo electrónico</label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                className="block w-full rounded-md border-0 py-2 px-3 shadow-sm ring-1 ring-inset ring-gray-300"
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium leading-6">Password</label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                className="block w-full rounded-md border-0 py-2 px-3 shadow-sm ring-1 ring-inset ring-gray-300"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex flex-col items-center">
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Sign in
            </button>
            <a
              className="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-bold rounded-lg text-indigo-500 hover:text-customGreen"
              href="/"
            >
              Regresar
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
