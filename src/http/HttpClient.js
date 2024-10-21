// Importation d'axios pour créer un client HTTP
import axios from 'axios';

// Création d'une instance d'axios, qui pourra être configurée pour envoyer des requêtes HTTP
const httpClient = axios.create({});

// Exportation du client HTTP pour l'utiliser dans d'autres fichiers comme App.js
export { httpClient };
