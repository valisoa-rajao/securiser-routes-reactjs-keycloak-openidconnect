import React, { useEffect, useState } from 'react'

function AdminAccount({kc})
{
  // **************verification de la connexion 
  const [isConnected, setIsConnected]= useState(null)

  useEffect(() => {
      // Vérifie si Keycloak est prêt et authentifié
      if (kc.authenticated) {
          setIsConnected(true);
      } else {
        setIsConnected(false); // Utilisateur non authentifié
      }
    }, [kc]); // Dépendance à kc pour vérifier les changements
  
 
  
  if(!isConnected)
  {
    return <div>..................Chargement de l'admin en cours .................</div>
  }
    return(
        <div className='home'>
            <h2> Bonjour AdminAccount</h2>
    
            <button onClick={()=> kc.logout({redirectUri: 'http://localhost:3001'})}> Se deconnecter </button>
        </div>
    )
   
    
}

export default AdminAccount