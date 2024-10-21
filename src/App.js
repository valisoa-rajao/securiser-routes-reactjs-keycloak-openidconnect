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
  url: `http://192.168.1.166:8080`,   // URL du serveur Keycloak
  realm: `reactjs-arch-def-biblio`, // Nom du "realm" Keycloak
  clientId: 'client-react'         // ID du client défini dans Keycloak
};
const kc = new Keycloak(initOptions);



function App() {
  const [authenticated, setAuthenticated] = useState(false);  // Pour savoir si l'utilisateur est authentifié
  const [keycloakInitialized, setKeycloakInitialized] = useState(false);  // Pour éviter les réinitialisations multiples

  useEffect(() => {
    const initKeycloak = async () => {
      try {
        // 2. Initialiser Keycloak seulement si non initialisé
        if (!keycloakInitialized) {
          const auth = await kc.init({
            onLoad: 'login-required',  // Rediriger vers la page de login si nécessaire
            checkLoginIframe: true,    // Vérifier l'état de connexion dans un iframe
            pkceMethod: 'S256'         // Utilisation de PKCE avec S256 pour plus de sécurité
          });

          // 3. Si authentifié, mettre à jour l'état d'authentification
          if (auth) {
            setAuthenticated(true);
            httpClient.defaults.headers.common['Authorization'] = `Bearer ${kc.token}`;
          } else {
            window.location.reload();
          }

          // 4. Marquer Keycloak comme initialisé
          setKeycloakInitialized(true);
        }
      } catch (error) {
        console.error('Authentication Failed', error);
      }
    };

    initKeycloak();
  }, [keycloakInitialized]); // Exécuter uniquement lorsque keycloakInitialized change

  // 5. Affichage d'un écran de chargement jusqu'à ce que Keycloak soit initialisé
  if (!keycloakInitialized) {
    return <div>Chargement de Keycloak...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
       

        {/* //Redirection automatique si aucune roote  */}
        <Route path="*" element={<RedirectRoute kc={kc}/>} />

        <Route element={<ProtectedRouteAdmin kc={kc}/>}>
         {/* Route pour Admin, accessible après authentification */}
          <Route path="/admin" element={<Admin kc={kc}/>} />

          <Route path="/admin/account" element={<AdminAccount kc={kc}/>} />

        </Route>


        <Route element={<ProtectedRouteMembre kc={kc}/>}>
          {/* Route pour Member */}
          <Route path="/membre" element={<Member kc={kc}/>} /> 

          <Route path="/membre/account" element={<MemberAccount kc={kc}/>} />
        </Route>


      </Routes>
    </BrowserRouter>
  );
}

export default App;
