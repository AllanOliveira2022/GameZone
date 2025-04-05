import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/api'; // ajuste o caminho conforme sua estrutura

function CreateDeveloper() {
  const navigate = useNavigate();
  const [developerData, setDeveloperData] = useState({
    name: '',
    CNPJ: '',
    email: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDeveloperData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const response = await api.createDeveloper(developerData);
      setSuccess('Desenvolvedor cadastrado com sucesso!');
      setDeveloperData({ name: '', CNPJ: '', email: '', phone: '' }); // Limpa o formulário
      
      // Opcional: redirecionar após sucesso
      setTimeout(() => navigate('/developersAdmin'), 1500);
    } catch (err) {
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Erro ao cadastrar desenvolvedor. Verifique os dados e tente novamente.');
      }
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/developers');
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Cadastrar Novo Desenvolvedor</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Nome da Empresa *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={developerData.name}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Ex: Rockstar Games, Ubisoft, EA"
            required
            autoFocus
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="CNPJ">
            CNPJ *
          </label>
          <input
            type="text"
            id="CNPJ"
            name="CNPJ"
            value={developerData.CNPJ}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="00.000.000/0000-00"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={developerData.email}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="contato@empresa.com"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
            Telefone *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={developerData.phone}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="(00) 00000-0000"
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`${
              isSubmitting ? 'bg-blue-400' : 'bg-blue-500 hover:bg-blue-700'
            } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
          >
            {isSubmitting ? 'Cadastrando...' : 'Cadastrar Desenvolvedor'}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateDeveloper;