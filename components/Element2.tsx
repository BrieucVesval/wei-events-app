import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';

const DEFAULT_ELEMENT_VALUES = {
  id: '',
  genre: '',
  name: '',
  date: '',
  location: '',
  startTime: '',
  endTime: '',
  duration: '',
  assos: '',
  logo: '',
  description: '',
};

const images = {
  adr: require('@/assets/images/adr.png'),
  wei: require('@/assets/images/wei.png'),
  ce: require('@/assets/images/ce.png'),
  voirie: require('@/assets/images/voirie.png'),
  vr: require('@/assets/images/vr.png'),
};

export default function Element2({ element, onPress, isPartOfOverlap }) {
  const [elementValue, setElementValue] = useState(DEFAULT_ELEMENT_VALUES);

  useEffect(() => {
    setElementValue({
      id: '',
      genre: element.genre,
      name: element.name,
      date: element.date,
      location: element.location,
      startTime: element.startTime,
      endTime: element.endTime,
      duration: element.duration,
      assos: element.assos,
      logo: element.logo,
      description: element.description,
    });
  }, [element]);

  return (
    <TouchableOpacity
      style={[styles.container, isPartOfOverlap && styles.overlap]}
      onPress={onPress}
    >
      {element.assos.map((assos) => (
        <Image
          key={assos}
          source={images[assos]}
          style={styles.reactLogo}
        />
      ))}
      <ThemedView style={styles.textContainer}>
        <ThemedText
          type="title"
          style={styles.titleText}
          numberOfLines={1} // Limite le texte à une ligne
          ellipsizeMode="tail" // Ajoute "..." si le texte dépasse
        >
          {element.name}
        </ThemedText>
        <ThemedText>
          <Ionicons name="time-outline" size={22} color="orange" />
          {element.startTime}h-{element.endTime}h
        </ThemedText>
        <ThemedText>
          <Ionicons name="navigate-outline" size={22} color="orange" />
          {element.location}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.iconContainer}>
        <Ionicons name="star" size={32} color="orange" />
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 5,
    padding: 15,
    backgroundColor: '#f8f9fa', // Arrière-plan clair
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // Pour Android
  },
  overlap: {
    borderColor: 'red',
    backgroundColor: '#ffe6e6',
  },
  reactLogo: {
    height: 50,
    width: 50,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 16, // Taille augmentée pour les titres
    color: '#E79140',
    textAlign: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});