import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../styles/articleAdmin.css'; 

function Admin({ kc }) {
  // État pour suivre la connexion
  const [isConnected, setIsConnected] = useState(null);

  const [loading, setLoading] = useState(true); // Pour gérer le chargement des articles
  const [error, setError] = useState(null); // État pour gérer les erreurs

  const [article, setArticle]= useState(null);

  const navigate = useNavigate();

  // Vérification de l'authentification
  useEffect(() => {
    if (kc.authenticated) {
      setIsConnected(true);
    } else {
      setIsConnected(false); // Utilisateur non authentifié
    }
  }, [kc]);

  // Fonction pour appeler l'API /admin/articles
  const fetchArticles = async () => {
    try {
      setLoading(true);
      const token = kc.token; // Récupérer le token JWT depuis Keycloak

      const response = await fetch('http://192.168.1.166:7000/admin/articles', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`, // Ajouter le token à l'en-tête Authorization
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des articles');
      }
      const data = await response.json(); // Récupérer les données JSON

      setArticle(data.dataAdmin);


    } catch (error) {
      setError(error.message); // Gérer les erreurs
    } finally {
      setLoading(false); // Fin du chargement
    }
  };

  // Appeler fetchArticles si l'utilisateur est authentifié
  useEffect(() => {
    if (isConnected) {
      fetchArticles();

    }
  }, [isConnected]);

  if (!isConnected) {
    return <div>..................Chargement de l'admin en cours .................</div>;
  }



  if(!article)
  {
    return <div>Chargement des article ...........</div>
  }

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  return (
    <div className='home'>
      <h2> Bonjour Admin</h2>

      <button onClick={() => kc.logout({ redirectUri: 'http://localhost:3001' })}>
        Se deconnecter
      </button>

      <button onClick={() => navigate('/admin/account')}>Voir le account Admin</button>
        
      
      <div>
      <table className="article-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Titre</th>
            <th>Description</th>
            <th>Prix</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {article.map((article) => (
            <tr key={article.id}>
              <td>{article.id}</td>
              <td>{article.titre}</td>
              <td>{article.description}</td>
              <td>{article.prix}</td>
              <td>
                <button className="btn lire" onClick={() => alert(`Lire l'article : ${article.titre}`)}>
                  Lire
                </button>
                <button className="btn modifier" onClick={() => alert(`Modifier l'article : ${article.id}`)}>
                  Modifier
                </button>
                <button className="btn supprimer" onClick={() => alert(`Supprimer l'article : ${article.id}`)}>
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
        
    </div>
  );
}

export default Admin;
