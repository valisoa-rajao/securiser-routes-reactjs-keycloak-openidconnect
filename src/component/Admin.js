import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Admin({kc})
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
        return <div>..................Chargement de l'admin en cours .................</div>
    }


    return(
        <div className='home'>
            <h2> Bonjour Admin</h2>
    
            <button onClick={()=> kc.logout({redirectUri: 'http://192.168.1.166:3001'})}> Se deconnecter </button>

            <button onClick={()=> navigate('/admin/account')}>Voir le account Admin </button>
        </div>
    )
   
    
}

export default Admin