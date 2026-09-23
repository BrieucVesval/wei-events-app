import axios from 'axios';

export async function getStudents(): Promise<{ id: number; name: string }[]> {
  try {
    const response = await axios.get('/api/students');
    return response.data.students;
  } catch (error) {
    console.error('Erreur lors de la récupération des étudiants:', error);
    throw error;
  }
}

export async function changeStudentFamily(studentId: number, newFamily: string): Promise<void> {
  try {
    await axios.put(`/api/students/${studentId}/family`, { newFamily });
  } catch (error) {
    console.error('Erreur lors du changement de famille:', error);
    throw error;
  }
}
