import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRouteMembre = ({ kc }) => {
  const [isAuth, setIsAuth] = useState(null); // Initialise l'état d'authentification

  useEffect(() => {
    // Vérifie si Keycloak est prêt et authentifié
    if (kc.authenticated) {
      // Vérifie si l'utilisateur a le rôle 'role-admin'
      if (kc.hasRealmRole('role-membre')) {
        setIsAuth(true); // Utilisateur authentifié et avec le rôle admin
      } else {
        setIsAuth(false); // Utilisateur authentifié mais pas avec le rôle admin
      }
    } else {
      setIsAuth(false); // Utilisateur non authentifié
    }
  }, [kc]); // Dépendance à kc pour vérifier les changements

  // Redirige l'utilisateur en fonction de son état d'authentification
  if (isAuth === null) {
    return <div>Chargement...</div>; // Affiche un message de chargement pendant la vérification
  }

  // Si authentifié et admin, affiche le contenu enfant, sinon redirige
  return isAuth ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRouteMembre;
