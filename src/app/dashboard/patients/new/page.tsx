// app/(dashboard)/patients/new/page.tsx

import { createPatient } from '../actions';

export default function NewPatientPage() {
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold text-brand-primary mb-6">
        Cadastrar Novo Paciente
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-md max-w-xl">
        <form action={createPatient}>
          <div className="space-y-5">
            {/* Nome Completo */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-brand-primary">
                Nome Completo
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="mt-1 block w-full px-3 py-2 bg-white border border-brand-accent-light rounded-md text-brand-primary placeholder-gray-400 focus:outline-none focus:ring-brand-accent focus:border-brand-accent"
                required
              />
            </div>

            {/* CPF */}
            <div>
              <label htmlFor="cpf" className="block text-sm font-medium text-brand-primary">
                CPF
              </label>
              <input
                type="text"
                id="cpf"
                name="cpf"
                className="mt-1 block w-full px-3 py-2 bg-white border border-brand-accent-light rounded-md text-brand-primary placeholder-gray-400 focus:outline-none focus:ring-brand-accent focus:border-brand-accent"
                required
              />
            </div>
            
            {/* Data de Nascimento */}
            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium text-brand-primary">
                Data de Nascimento
              </label>
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                className="mt-1 block w-full px-3 py-2 bg-white border border-brand-accent-light rounded-md text-brand-primary placeholder-gray-400 focus:outline-none focus:ring-brand-accent focus:border-brand-accent"
                required
              />
            </div>

            {/* Telefone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-brand-primary">
                Telefone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="mt-1 block w-full px-3 py-2 bg-white border border-brand-accent-light rounded-md text-brand-primary placeholder-gray-400 focus:outline-none focus:ring-brand-accent focus:border-brand-accent"
                required
              />
            </div>

            {/* Email (Opcional) */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-brand-primary">
                Email (Opcional)
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-1 block w-full px-3 py-2 bg-white border border-brand-accent-light rounded-md text-brand-primary placeholder-gray-400 focus:outline-none focus:ring-brand-accent focus:border-brand-accent"
              />
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              className="w-full bg-brand-accent text-white py-2.5 px-4 border border-transparent rounded-md shadow-sm font-medium hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent"
            >
              Salvar Paciente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}