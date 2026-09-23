import React, { useEffect, useState } from 'react';
import { StyleSheet, Button, ScrollView, View, TextInput, Modal, Linking } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Header from '@/components/Header';
import { getUserRole } from '@/services/roleService';
import { addEvent, addParticipant } from '@/services/eventService';
import { getStudents, changeStudentFamily } from '@/services/studentService';

export default function Profile() {
  const [role, setRole] = useState<string | null>(null);
  const [eventModalVisible, setEventModalVisible] = useState(false);
  const [familyModalVisible, setFamilyModalVisible] = useState(false);
  const [participantModalVisible, setParticipantModalVisible] = useState(false);
  const [eventData, setEventData] = useState({
    name: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    description: '',
    photo: ''
  });
  const [students, setStudents] = useState([]);
  const [searchStudent, setSearchStudent] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [newFamily, setNewFamily] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const userId = 1; // Remplacez par l'ID de l'utilisateur connecté
    getUserRole(userId).then(setRole);
    getStudents().then(setStudents);
  }, []);

  const familyName = "Famille des Dragons";
  const familyMembers = [
    { id: 1, name: "Alice Dupont" },
    { id: 2, name: "Bob Martin" },
    { id: 3, name: "Clara Lemoine" },
  ];
  const familyEvents = [
    { id: 1, name: "Soirée Pizza", date: "15/12/2024" },
    { id: 2, name: "Sortie Bowling", date: "22/12/2024" },
  ];
  const familyRanking = { position: 3, points: 120 };

  // Lien vers le groupe WhatsApp
  const whatsappGroupLink = "https://chat.whatsapp.com/your-group-id";

  const openWhatsAppGroup = async () => {
    const supported = await Linking.canOpenURL(whatsappGroupLink);
    if (supported) {
      await Linking.openURL(whatsappGroupLink);
    } else {
      alert("Impossible d'ouvrir le groupe WhatsApp.");
    }
  };

  const handleAddEvent = async () => {
    try {
      await addEvent(eventData);
      alert('Événement ajouté avec succès');
      setEventModalVisible(false);
    } catch (error) {
      alert('Erreur lors de l\'ajout de l\'événement');
    }
  };

  const handleChangeFamily = async () => {
    try {
      await changeStudentFamily(selectedStudent.id, newFamily);
      alert('Famille changée avec succès');
      setFamilyModalVisible(false);
    } catch (error) {
      alert('Erreur lors du changement de famille');
    }
  };

  const handleAddParticipant = async () => {
    try {
      await addParticipant(selectedEvent.id, selectedStudent.id);
      alert('Participant ajouté avec succès');
      setParticipantModalVisible(false);
    } catch (error) {
      alert('Erreur lors de l\'ajout du participant');
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchStudent.toLowerCase())
  );

  return (
    <ThemedView style={styles.container}>
      <Header />
      <ScrollView>
        <ThemedView style={styles.profileSection}>
          <ThemedText style={styles.userName}>Nom de l'utilisateur</ThemedText>
        </ThemedView>

        <ThemedView style={styles.card}>
          <ThemedText style={styles.cardTitle}>Ma famille de parrainage</ThemedText>
          <ThemedText style={styles.familyName}>{familyName}</ThemedText>
          <ThemedText>Membres :</ThemedText>
          {familyMembers.map((member) => (
            <ThemedText key={member.id} style={styles.memberText}>
              • {member.name}
            </ThemedText>
          ))}
          <Button
            title="Chat de la famille"
            onPress={openWhatsAppGroup}
            color="#4CAF50"
          />
        </ThemedView>

        <ThemedView style={styles.card}>
          <ThemedText style={styles.cardTitle}>Événements de la famille</ThemedText>
          {familyEvents.map((event) => (
            <ThemedText key={event.id} style={styles.eventText}>
              {event.name} - {event.date}
            </ThemedText>
          ))}
        </ThemedView>

        <ThemedView style={styles.card}>
          <ThemedText style={styles.cardTitle}>Statistiques</ThemedText>
          <View style={styles.statsContainer}>
            <ThemedText>Classement : {familyRanking.position}ᵉ</ThemedText>
            <ThemedText>Points totaux : {familyRanking.points}</ThemedText>
          </View>
        </ThemedView>

        {role === 'Admin' && (
          <Button
            title="Gérer les utilisateurs"
            onPress={() => alert('Gestion des utilisateurs')}
            color="#F44336"
          />
        )}

        {role === 'Organizer' && (
          <>
            <Button
              title="Ajouter un événement"
              onPress={() => setEventModalVisible(true)}
              color="#4CAF50"
            />
            <Modal
              animationType="slide"
              transparent={true}
              visible={eventModalVisible}
              onRequestClose={() => setEventModalVisible(false)}
            >
              <View style={styles.modalView}>
                <ThemedText style={styles.modalTitle}>Ajouter un événement</ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="Nom de l'événement"
                  value={eventData.name}
                  onChangeText={(text) => setEventData({ ...eventData, name: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Date (YYYY-MM-DD)"
                  value={eventData.date}
                  onChangeText={(text) => setEventData({ ...eventData, date: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Heure de début (HH:MM)"
                  value={eventData.startTime}
                  onChangeText={(text) => setEventData({ ...eventData, startTime: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Heure de fin (HH:MM)"
                  value={eventData.endTime}
                  onChangeText={(text) => setEventData({ ...eventData, endTime: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Lieu"
                  value={eventData.location}
                  onChangeText={(text) => setEventData({ ...eventData, location: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Description"
                  value={eventData.description}
                  onChangeText={(text) => setEventData({ ...eventData, description: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Photo (URL)"
                  value={eventData.photo}
                  onChangeText={(text) => setEventData({ ...eventData, photo: text })}
                />
                <Button title="Ajouter" onPress={handleAddEvent} color="#4CAF50" />
                <Button title="Annuler" onPress={() => setEventModalVisible(false)} color="#F44336" />
              </View>
            </Modal>
          </>
        )}

        {role === 'PCS' && (
          <>
            <Button
              title="Changer de famille"
              onPress={() => setFamilyModalVisible(true)}
              color="#F44336"
            />
            <Modal
              animationType="slide"
              transparent={true}
              visible={familyModalVisible}
              onRequestClose={() => setFamilyModalVisible(false)}
            >
              <View style={styles.modalView}>
                <ThemedText style={styles.modalTitle}>Changer de famille</ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="Rechercher un étudiant"
                  value={searchStudent}
                  onChangeText={setSearchStudent}
                />
                {filteredStudents.map(student => (
                  <ThemedText
                    key={student.id}
                    style={styles.studentText}
                    onPress={() => setSelectedStudent(student)}
                  >
                    {student.name}
                  </ThemedText>
                ))}
                {selectedStudent && (
                  <>
                    <ThemedText>Étudiant sélectionné : {selectedStudent.name}</ThemedText>
                    <TextInput
                      style={styles.input}
                      placeholder="Nouvelle famille"
                      value={newFamily}
                      onChangeText={setNewFamily}
                    />
                    <Button title="Changer" onPress={handleChangeFamily} color="#4CAF50" />
                  </>
                )}
                <Button title="Annuler" onPress={() => setFamilyModalVisible(false)} color="#F44336" />
              </View>
            </Modal>
          </>
        )}

        <Button
          title="Ajouter un participant"
          onPress={() => setParticipantModalVisible(true)}
          color="#4CAF50"
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={participantModalVisible}
          onRequestClose={() => setParticipantModalVisible(false)}
        >
          <View style={styles.modalView}>
            <ThemedText style={styles.modalTitle}>Ajouter un participant</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Rechercher un étudiant"
              value={searchStudent}
              onChangeText={setSearchStudent}
            />
            {filteredStudents.map(student => (
              <ThemedText
                key={student.id}
                style={styles.studentText}
                onPress={() => setSelectedStudent(student)}
              >
                {student.name}
              </ThemedText>
            ))}
            {selectedStudent && (
              <>
                <ThemedText>Étudiant sélectionné : {selectedStudent.name}</ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="ID de l'événement"
                  value={selectedEvent ? selectedEvent.id.toString() : ''}
                  onChangeText={(text) => setSelectedEvent({ id: parseInt(text, 10) })}
                />
                <Button title="Ajouter" onPress={handleAddParticipant} color="#4CAF50" />
              </>
            )}
            <Button title="Annuler" onPress={() => setParticipantModalVisible(false)} color="#F44336" />
          </View>
        </Modal>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  familyName: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  memberText: {
    fontSize: 14,
    marginLeft: 10,
    color: '#555',
  },
  eventText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#555',
  },
  statsContainer: {
    marginTop: 10,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  studentText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
});