import { SectionList, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Element2 from '@/components/Element2';
import { eventsByDay } from '@/app/eventsData';
import { groupOverlappingEvents } from '@/app/eventUtils';

export default function GlobalView() {
  const navigation = useNavigation();

  // Transformer les données en sections
  const sections = Object.keys(eventsByDay).map((date) => ({
    title: new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }),
    data: groupOverlappingEvents(eventsByDay[date]), // Groupes d'événements chevauchants
  }));

  return (
    <ThemedView style={styles.pageContainer}>
      <Button title="Retour" onPress={() => navigation.goBack()} />
      <ThemedText style={styles.title}>Vue globale des événements</ThemedText>
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => `group-${index}`}
        renderSectionHeader={({ section: { title } }) => (
          <ThemedText style={styles.sectionHeader}>{title}</ThemedText>
        )}
        renderItem={({ item: group }) => (
          <ThemedView
            style={group.length > 1 ? styles.eventGroup : styles.singleEventContainer}
          >
            {group.map((event) => (
              <Element2
                key={event.id}
                element={event}
                isPartOfOverlap={group.length > 1}
                onPress={() => navigation.navigate('eventDetail', { event })}
              />
            ))}
          </ThemedView>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#244B93',
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#1B3C70',
    padding: 5,
  },
  singleEventContainer: {
  flexDirection: 'column', // Affichage vertical
  alignItems: 'stretch', // Événements en pleine largeur
  marginBottom: 10,
},
  eventGroup: {
    flexDirection: 'row',
    justifyContent: 'space-evenly', // Uniformise l'espacement
    alignItems: 'center',
    marginBottom: 20, // Ajoute plus d'espace entre les groupes
    paddingHorizontal: 10, // Ajoute un padding horizontal
    flexWrap: 'wrap', // Passe à la ligne si nécessaire
  },
});