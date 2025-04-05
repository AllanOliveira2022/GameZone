import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../api/api'; // ajuste o caminho conforme sua estrutura

function DeleteDeveloper() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [developer, setDeveloper] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchDeveloper = async () => {
      try {
        const response = await api.get(`/developers/${id}`);
        setDeveloper(response.data);
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar dados do desenvolvedor');
        console.error(err);
        setLoading(false);
      }
    };

    fetchDeveloper();
  }, [id]);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError('');
    
    try {
      await api.deleteDeveloper(id);
      setSuccess('Desenvolvedor excluído com sucesso!');
      setTimeout(() => navigate('/developers'), 1500);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError('Desenvolvedor não encontrado');
      } else {
        setError('Erro ao excluir o desenvolvedor. Tente novamente.');
      }
      console.error(err);
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    navigate('/developers');
  };

  if (loading) return <div className="text-center py-8">Carregando...</div>;

  if (!developer) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Desenvolvedor não encontrado
        </div>
        <button
          onClick={handleCancel}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Voltar para lista
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Excluir Desenvolvedor</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      ) : (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Confirmar exclusão do desenvolvedor?
          </h2>
          
          <div className="mb-6 p-4 bg-gray-50 rounded">
            <h3 className="text-lg font-medium">{developer.name}</h3>
            {developer.CNPJ && <p className="text-gray-600 mt-1">CNPJ: {developer.CNPJ}</p>}
            {developer.email && <p className="text-gray-600 mt-1">Email: {developer.email}</p>}
            {developer.phone && <p className="text-gray-600 mt-1">Telefone: {developer.phone}</p>}
          </div>
          
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
            <p className="font-bold">Atenção!</p>
            <p className="mt-1">Esta ação é irreversível e pode afetar os jogos associados a este desenvolvedor.</p>
          </div>
          
          <div className="flex items-center justify-between">
            <button
              onClick={handleCancel}
              disabled={isDeleting}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className={`${
                isDeleting ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'
              } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
            >
              {isDeleting ? 'Excluindo...' : 'Confirmar Exclusão'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeleteDeveloper;