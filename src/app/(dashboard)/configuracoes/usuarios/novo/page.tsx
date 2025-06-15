// app/(dashboard)/configuracoes/usuarios/novo/page.tsx

'use client'; 

import { useState, FormEvent } from 'react';
import { PageHeader } from '@/components/layout/PageHeader'; // 1. Importa o componente

export default function NovoUsuarioPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER'); 

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault(); 
    const newUser = { name, email, password, role };
    console.log('Dados do Novo Usuário:', newUser);
    alert('Verifique o console do navegador (F12) para ver os dados do usuário.');
  };

  return (
    <div className="p-4 md:p-8">
      {/* 2. O antigo <header> é substituído por esta única linha */}
      <PageHeader
        title="Criar Novo Usuário"
        description="Preencha os dados para cadastrar um novo profissional."
        backHref="/configuracoes/usuarios"
      />

      <main className="bg-white p-6 md:p-8 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo Nome */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-brand-primary">
              Nome Completo
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent"
            />
          </div>

          {/* Campo Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-brand-primary">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent"
            />
          </div>

          {/* Campo Senha */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-brand-primary">
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent"
            />
          </div>

          {/* Campo Função (Role) */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-brand-primary">
              Função
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent"
            >
              <option value="USER">Usuário (Profissional)</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </div>

          {/* Botão de Submissão */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-brand-accent text-white py-2 px-6 rounded-lg hover:bg-brand-primary transition-colors duration-200 font-semibold"
            >
              Salvar Usuário
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}