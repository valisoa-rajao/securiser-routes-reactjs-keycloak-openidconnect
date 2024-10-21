import Keycloak from 'keycloak-js';

// Configuration de Keycloak
const keycloak = new Keycloak({
  url: 'http://localhost:8080/auth',  // URL de ton serveur Keycloak
  realm: 'react-login',                   // Nom de ton realm dans Keycloak
  clientId: 'client-react',
  clientSecret: '6ebISQrPeacvgFFS72bvhtmHJgsg9kIW'
});


const keycloakInst = new Keycloak(keycloakConfig);

export default keycloak;
