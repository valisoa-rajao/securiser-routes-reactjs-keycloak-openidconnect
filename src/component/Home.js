import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = ({ kc }) => {

    const navigate= useNavigate();

  useEffect(() => {
    console.log("Accès à la page Home");
  }, []);

   
  if(kc.authenticated)
  {
    return (
        <div>
          <h1>Bienvenue dans la page d'accueil</h1>
          {/* Autres contenus de la page */}
          <button onClick={()=> kc.logout({redirectUri: 'http://192.168.1.166:3001'})}> Se deconnecter </button>
        </div>
      );
  }else
  {
    navigate('/')
  }
  
};

export default Home;
