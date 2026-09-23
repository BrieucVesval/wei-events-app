import { Image, StyleSheet, Platform, Button, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Header from '@/components/Header';
import Filters from '@/components/Filters';
import Sorts from '@/components/Sorts';
import Element2 from '@/components/Element2';
import { useNavigation } from '@react-navigation/native';
import { eventsByDay } from '@/app/eventsData';
import { areEventsOverlapping, groupOverlappingEvents } from '@/app/eventUtils';


export default function Calendar() {
  const navigation = useNavigation();

  // État pour le jour sélectionné
  const [selectedDay, setSelectedDay] = useState(Object.keys(eventsByDay)[0]); // Par défaut, le premier jour avec des événements
  const [isGlobalView, setIsGlobalView] = useState(false);
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [filterOptions, setFilterOptions] = useState([]);
  const [sortOption, setSortOption] = useState('heure');

  const currentEvents = eventsByDay[selectedDay] || [];
  const allEvents = Object.keys(eventsByDay).flatMap((date) => eventsByDay[date]);

  // Change le jour sélectionné
  const changeDay = (direction) => {
    const newDate = new Date(selectedDay);
    newDate.setDate(newDate.getDate() + direction);
    setSelectedDay(newDate.toISOString().split('T')[0]);
  };

  // Tri des événements
  const sortedElements = [...(isGlobalView ? allEvents : currentEvents)].sort((a, b) => {
    if (sortOption === 'A-Z') return a.name.localeCompare(b.name);
    if (sortOption === 'Z-A') return b.name.localeCompare(a.name);
    if (sortOption === 'genre') return a.genre.localeCompare(b.genre);
    if (sortOption === 'heure') return parseFloat(a.startTime) - parseFloat(b.startTime);
    return 0;
  });

  // Groupes de chevauchements
  const groupedElements = groupOverlappingEvents(sortedElements);

  return (
    <ThemedView style={styles.pageContainer}>
      <StatusBar style="light" />
      <Header />

      {/* Conteneur des titres */}
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">WeildWeeks 2025</ThemedText>
        {!isGlobalView && (
          <ThemedText type="subtitle">
            {new Date(selectedDay).toLocaleDateString('fr-FR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </ThemedText>
        )}
      </ThemedView>

      {/* Navigation entre les jours */}
      {!isGlobalView && (
        <ThemedView style={styles.buttonContainer}>
          <Button title="Jour précédent" onPress={() => changeDay(-1)} />
          <Button title="Jour suivant" onPress={() => changeDay(1)} />
        </ThemedView>
      )}

      {/* Options de tri et de filtre */}
      <ThemedView style={styles.optionContainer}>
        <ThemedView style={styles.buttonWrapper}>
          <Button
            title="Voir tous les événements"
            onPress={() => navigation.navigate('GlobalView')}
          />
        </ThemedView>
        <ThemedText
          style={styles.optionText}
          onPress={() => setShowFilterOptions(!showFilterOptions)}
        >
          Filtrer par {filterOptions.join(', ') || 'aucun'}
        </ThemedText>
        <ThemedText
          style={styles.optionText}
          onPress={() => setShowSortOptions(!showSortOptions)}
        >
          Trier par {sortOption}
        </ThemedText>
      </ThemedView>

      {/* Composants de filtre et de tri */}
      {showFilterOptions && (
        <Filters
          filterOptions={filterOptions}
          onFilterChange={(option) =>
            setFilterOptions((prev) =>
              prev.includes(option)
                ? prev.filter((item) => item !== option)
                : [...prev, option]
            )
          }
        />
      )}
      {showSortOptions && (
        <Sorts
          sortOption={sortOption}
          onSortChange={(option) => setSortOption(option)}
        />
      )}

      {/* Liste des événements avec gestion des chevauchements */}
      <ScrollView>
        <ThemedView style={styles.eventListContainer}>
          {groupedElements.map((group, groupIndex) => (
            <ThemedView key={groupIndex} style={styles.eventGroup}>
              {group.map((event) => (
                <Element2
                  key={event.id}
                  element={event}
                  isPartOfOverlap={group.length > 1} // Indiquer visuellement les chevauchements
                  onPress={() => navigation.navigate('eventDetail', { event })}
                />
              ))}
            </ThemedView>
          ))}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}


const styles = StyleSheet.create({
  pageContainer: {
    backgroundColor: '#244B93',
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'transparent',
    margin: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  optionContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginVertical: 10,
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginVertical: 10,
  },
  optionText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginVertical: 5,
    textDecorationLine: 'underline',
  },
  eventListContainer: {
    marginVertical: 10,
    paddingHorizontal: 10,
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