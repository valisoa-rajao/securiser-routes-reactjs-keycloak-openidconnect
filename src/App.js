import { httpClient } from './http/HttpClient';
import Keycloak from 'keycloak-js';
import { useState, useEffect } from 'react';
import Member from './component/Member';
import Admin from './component/Admin';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import RedirectRoute from './component/utils/RedirectRoute';
import ProtectedRouteAdmin from './component/utils/ProtectedRouteAdmin';
import ProtectedRouteMembre from './component/utils/ProtectedRouteMembre';
import AdminAccount from './component/AdminAccount';
import MemberAccount from './component/MemberAccount';

// 1. Création de l'instance Keycloak une seule fois, à l'extérieur du composant
const initOptions = {
  url: `http://localhost:8080`,   // URL du serveur Keycloak
  realm: `realm-idp`, // Nom du "realm" Keycloak
  clientId: 'client-idp'         // ID du client défini dans Keycloak
};
const kc = new Keycloak(initOptions);

function App() {
  const [authenticated, setAuthenticated] = useState(false);  // Pour savoir si l'utilisateur est authentifié
  const [keycloakInitialized, setKeycloakInitialized] = useState(false);  // Pour éviter les réinitialisations multiples

  // Fonction pour rafraîchir le token
  const refreshToken = async () => {
    try {
      // Rafraîchir le token s'il expire dans les 30 prochaines secondes
      const refreshed = await kc.updateToken(30);
      if (refreshed) {
        console.log('Token rafraîchi');
        // Mettre à jour le token dans les en-têtes de toutes les requêtes
        httpClient.defaults.headers.common['Authorization'] = `Bearer ${kc.token}`;
      }
    } catch (error) {
      console.error('Échec du rafraîchissement du token', error);
      // En cas d'échec, rediriger vers la page de déconnexion
      kc.logout({ redirectUri: window.location.origin });
    }
  };

  // Initialisation de Keycloak et authentification
  useEffect(() => {
    const initKeycloak = async () => {
      try {
        if (!keycloakInitialized) {
          const auth = await kc.init({
            onLoad: 'login-required',  // Rediriger vers la page de login si nécessaire
            checkLoginIframe: true,    // Vérifier l'état de connexion dans un iframe
            pkceMethod: 'S256'         // Utilisation de PKCE avec S256 pour plus de sécurité
          });

          if (auth) {
            setAuthenticated(true);
            httpClient.defaults.headers.common['Authorization'] = `Bearer ${kc.token}`;
          } else {
            window.location.reload();
          }
          setKeycloakInitialized(true);
        }
      } catch (error) {
        // console.error('Authentication Failed', error);
      }
    };

    initKeycloak();
  }, [keycloakInitialized]);

  // Rafraîchir le token régulièrement toutes les 60 secondes
  useEffect(() => {
    const intervalId = setInterval(refreshToken, 60000); // Rafraîchir toutes les minutes
    return () => clearInterval(intervalId); // Nettoyage à la fin
  }, []);

  // Affichage d'un écran de chargement tant que Keycloak n'est pas initialisé
  if (!keycloakInitialized) {
    return <div>Chargement de Keycloak...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirection automatique si aucune route correspond */}
        <Route path="*" element={<RedirectRoute kc={kc}/>} />

        {/* Routes protégées pour l'admin */}
        <Route element={<ProtectedRouteAdmin kc={kc}/>}>
          <Route path="/admin" element={<Admin kc={kc}/>} />
          <Route path="/admin/account" element={<AdminAccount kc={kc}/>} />
        </Route>

        {/* Routes protégées pour le membre */}
        <Route element={<ProtectedRouteMembre kc={kc}/>}>
          <Route path="/membre" element={<Member kc={kc}/>} /> 
          <Route path="/membre/account" element={<MemberAccount kc={kc}/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
