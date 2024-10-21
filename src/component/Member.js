import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';

function Member({kc})
{

    // **************verification de la connexion 
    const [isConnected, setIsConnected]= useState(null)


    const navigate = useNavigate();


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
        return <div>..................Chargement du membre en cours .................</div>
    }
  
    return(
        <div className='home'>
            <h2> Bonjour Member</h2>
    
            <button onClick={()=> kc.logout({redirectUri: 'http://192.168.1.166:3001'})}> Se deconnecter </button>

            <button onClick={()=> navigate('/membre/account')}>Voir le account Member </button>

        </div>
    )
   
    
}

export default Member