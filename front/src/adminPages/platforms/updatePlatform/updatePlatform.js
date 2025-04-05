import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PlatformService } from '../../../services/platformService'; // Ajuste o caminho conforme sua estrutura

function UpdatePlatform() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [platformData, setPlatformData] = useState({
    name: ''
  });

  useEffect(() => {
    const fetchPlatform = async () => {
      try {
        // Usando o PlatformService para buscar a plataforma
        const platform = await PlatformService.getPlatformById(id);
        setPlatformData({
          name: platform.name
        });
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar dados da plataforma');
        console.error(err);
        setLoading(false);
      }
    };

    fetchPlatform();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlatformData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    // Validação do frontend
    if (!platformData.name.trim()) {
      setError('O nome da plataforma é obrigatório');
      setIsSubmitting(false);
      return;
    }

    try {
      // Usando o PlatformService para atualizar a plataforma
      await PlatformService.updatePlatform(id, platformData);
      setSuccess('Plataforma atualizada com sucesso!');
      setTimeout(() => navigate('/platformsAdmin'), 1500);
    } catch (err) {
      // Tratamento aprimorado de erros
      if (err.response) {
        switch (err.response.status) {
          case 400:
            setError(err.response.data.message || 'Dados inválidos');
            break;
          case 404:
            setError('Plataforma não encontrada');
            break;
          case 409:
            setError('Já existe uma plataforma com este nome');
            break;
          default:
            setError('Erro ao atualizar a plataforma. Tente novamente.');
        }
      } else {
        setError('Erro de conexão. Verifique sua internet e tente novamente.');
      }
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/platforms');
  };

  if (loading) return (
    <div className="text-center py-8">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      <p className="mt-2">Carregando plataforma...</p>
    </div>
  );

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Atualizar Plataforma</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 animate-fadeIn">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 animate-fadeIn">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-blue-600">
          <h2 className="text-xl font-semibold text-white">Editar Plataforma</h2>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Nome da Plataforma *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={platformData.name}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: PlayStation 5, Xbox Series X, Nintendo Switch"
              required
              minLength={3}
              maxLength={50}
              autoFocus
            />
            <p className="text-gray-500 text-xs italic mt-1">* Campo obrigatório (3-50 caracteres)</p>
          </div>

          <div className="flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-200 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 ${
                isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Atualizando...
                </>
              ) : 'Atualizar Plataforma'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default UpdatePlatform;