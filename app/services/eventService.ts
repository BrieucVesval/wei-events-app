import axios from 'axios';

export async function addEvent(eventData: {
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  photo?: string;
}): Promise<void> {
  try {
    await axios.post('/api/events', eventData);
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'événement:', error);
    throw error;
  }
}

export async function addParticipant(eventId: number, studentId: number): Promise<void> {
  try {
    await axios.post(`/api/events/${eventId}/participants`, { studentId });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du participant:', error);
    throw error;
  }
}
