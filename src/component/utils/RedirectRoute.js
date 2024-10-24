import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const RedirectRoute = ({ kc }) => {
  const [keycloakReady, setKeycloakReady] = useState(false);


  const navigate = useNavigate();


  useEffect(() => {
    if (kc.authenticated) { 
      setKeycloakReady(true);

      // Ajoute ta logique de redirection ici
    }
  }, [kc]); // Vérifie kc à chaque changement


  if(keycloakReady)
  {
    // *******************la redirection **********************
    if(kc.hasRealmRole('role-admin'))
    {
      navigate('/admin')
    }else if(kc.hasRealmRole('role-membre'))
    {
      navigate('/membre')
    }else{
      return <div> ............cette Utilisateur n'existe pas encore ........</div>
    }

  }else{
    return <div>Chargement de recherche  ...</div>; // Affiche un message de chargement si kc n'est pas encore prêt
  }



  return null; // Une fois prêt, ne retourne rien
};

export default RedirectRoute;
