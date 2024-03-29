'use client';

import Link from 'next/link';
import {
  UserCircleIcon,
  DocumentTextIcon,
  ListBulletIcon,
  ArchiveBoxIcon,
  FolderIcon
} from '@heroicons/react/24/outline';
import { Button } from '../button';
import { createDocument } from '@/app/lib/actions';
import DocumentStatus from '@/app/ui/documents/status';
import { Utilizador, Departamento } from '@prisma/client';
import { useFormState } from 'react-dom';

const categories = [
  "Atas",
  "Cartas",
  "Decretos",
  "Folhetos",
  "Fotografias",
  "Memorandos",
  "Oficios",
  "Plantas",
  "Relatorios"
];

export default function Form({
  users,
  departments
}: {
  users: Utilizador[],
  departments: Departamento[]
}) {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(createDocument, initialState);

  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Document Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Titulo/Nome
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Titulo/Nome"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="name-error"
              />
              <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.name &&
              state.errors.name.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Document Category */}
        <div className="mb-4">
          <label htmlFor="category" className="mb-2 block text-sm font-medium">
            Escolha a categoria
          </label>
          <div className="relative">
            <select
              id="category"
              name="category"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              aria-describedby="category-error"
            >
              <option value="" disabled>
                Selecione uma categoria
              </option>
              {categories.map((category) => (
                <option key={category} value={category.valueOf()}>
                  {category.valueOf()}
                </option>
              ))}
            </select>
            <ListBulletIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
          <div id="category-error" aria-live="polite" aria-atomic="true">
            {state.errors?.category &&
              state.errors.category.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Document Department */}
        <div className="mb-4">
          <label htmlFor="department" className="mb-2 block text-sm font-medium">
            Escolha o departamento
          </label>
          <div className="relative">
            <select
              id="department"
              name="department"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              aria-describedby="department-error"
            >
              <option value="" disabled>
                Selecione um departamento
              </option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.nome}
                </option>
              ))}
            </select>
            <ArchiveBoxIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
          <div id="department-error" aria-live="polite" aria-atomic="true">
            {state.errors?.department &&
              state.errors.department.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Document Status */}
        <div className="mb-4">
          <label htmlFor="status" className="mb-2 block text-sm font-medium">
            Definir o status do documento
          </label>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="Pendente"
                  name="status"
                  type="radio"
                  value="Pendente"
                  className="h-4 w-4 border-gray-300 bg-gray-100 text-gray-600 focus:ring-2 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-gray-600"
                  aria-describedby="status-error"
                />
                <label
                  htmlFor="Pendente"
                  className="ml-2 flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300"
                >
                  <DocumentStatus status="Pendente" />
                  <span className='hidden'>Pendente</span>
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="Em progresso"
                  name="status"
                  type="radio"
                  value="Em progresso"
                  className="h-4 w-4 border-gray-300 bg-gray-100 text-gray-600 focus:ring-2 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-gray-600"
                  aria-describedby="status-error"
                />
                <label
                  htmlFor="Em progresso"
                  className="ml-2 flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300"
                >
                  <DocumentStatus status="Em progresso" />
                  <span className='hidden'>Em progresso</span>
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="Concluído"
                  name="status"
                  type="radio"
                  value="Concluído"
                  className="h-4 w-4 border-gray-300 bg-gray-100 text-gray-600 focus:ring-2 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-gray-600"
                  aria-describedby="status-error"
                />
                <label
                  htmlFor="Concluído"
                  className="ml-2 flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300"
                >
                  <DocumentStatus status="Concluído" />
                  <span className='hidden'>Concluído</span>
                </label>
              </div>
            </div>
          </div>
          <div id="status-error" aria-live="polite" aria-atomic="true">
            {state.errors?.status &&
              state.errors.status.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Document Conteúdo */}
        <div className="mb-4">
          <label htmlFor="conteudo" className="mb-2 block text-sm font-medium">
            Carregar documento...
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="conteudo"
                name="conteudo"
                type="file"
                accept=".docx,.xlsx,.pdf"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="content-error"
              />
              <FolderIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div id="content-error" aria-live="polite" aria-atomic="true">
            {state.errors?.conteudo &&
              state.errors.conteudo.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Document User */}
        <div>
          <label htmlFor="user" className="mb-2 block text-sm font-medium">
            Escolha o utilizador
          </label>
          <div className="relative">
            <select
              id="user"
              name="user"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
            >
              <option value="" disabled>
                Selecione um utilizador
              </option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.nome}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>
      </div>


      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/document"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancelar
        </Link>
        <Button type="submit">Criar documento</Button>
      </div>
    </form>
  );
}
