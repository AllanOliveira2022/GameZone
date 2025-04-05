import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../api/api'; // ajuste o caminho conforme sua estrutura

function UpdateDeveloper() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [developerData, setDeveloperData] = useState({
    name: '',
    CNPJ: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    const fetchDeveloper = async () => {
      try {
        const response = await api.get(`/developers/${id}`);
        setDeveloperData({
          name: response.data.name,
          CNPJ: response.data.CNPJ,
          email: response.data.email,
          phone: response.data.phone
        });
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar dados do desenvolvedor');
        console.error(err);
        setLoading(false);
      }
    };

    fetchDeveloper();
  }, [id]);

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

    if (!developerData.name.trim()) {
      setError('O nome do desenvolvedor é obrigatório');
      return;
    }

    try {
      await api.updateDeveloper(id, developerData);
      setSuccess('Desenvolvedor atualizado com sucesso!');
      setTimeout(() => navigate('/developers'), 1500);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError('Desenvolvedor não encontrado');
      } else {
        setError('Erro ao atualizar o desenvolvedor. Tente novamente.');
      }
      console.error(err);
    }
  };

  const handleCancel = () => {
    navigate('/developers');
  };

  if (loading) return <div className="text-center py-8">Carregando...</div>;

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Editar Desenvolvedor</h1>
      
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
            CNPJ
          </label>
          <input
            type="text"
            id="CNPJ"
            name="CNPJ"
            value={developerData.CNPJ}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="00.000.000/0000-00"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={developerData.email}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="contato@empresa.com"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
            Telefone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={developerData.phone}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="(00) 00000-0000"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Atualizar Desenvolvedor
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

export default UpdateDeveloper;