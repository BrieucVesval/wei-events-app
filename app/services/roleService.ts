import axios from 'axios';

export async function getUserRole(userId: number): Promise<string | null> {
  try {
    const response = await axios.get(`/api/role/${userId}`);
    return response.data.role;
  } catch (error) {
    console.error('Erreur lors de la récupération du rôle de l\'utilisateur:', error);
    return null;
  }
}
