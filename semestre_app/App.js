// App.js

import React, { useState, useEffect } from 'react';
import { SafeAreaView, FlatList, Text, View, StyleSheet, Image } from 'react-native';

// Define a mapping of Pokémon types to pastel colors
const typeColors = {
  grass: '#A8D5BA',
  fire: '#F4A9A0',
  water: '#A0C1D6',
  bug: '#D1D5A2',
  normal: '#D0D1C1',
  poison: '#B79CC5',
  electric: '#F7E6A1',
  ground: '#E3D3B8',
  fairy: '#F7C6C7',
  fighting: '#F5A9A0',
  psychic: '#F7B7A3',
  rock: '#D8C2A7',
  ghost: '#B7A8C9',
  dragon: '#C2A8F2',
  dark: '#B8B1A5',
  steel: '#D0D0D0',
  ice: '#BCE0F4',
};

const App = () => {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=30');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const pokemonDetails = await Promise.all(
          data.results.map(async (pokemon) => {
            const pokemonResponse = await fetch(pokemon.url);
            const pokemonData = await pokemonResponse.json();
            return {
              name: pokemon.name,
              image: pokemonData.sprites.front_default,
              id: pokemonData.id,
              types: pokemonData.types.map(typeInfo => typeInfo.type.name),
            };
          })
        );
        setPokemons(pokemonDetails);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Text style={styles.text}>Loading...</Text>;
  if (error) return <Text style={styles.text}>Error: {error.message}</Text>;

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={pokemons}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.item, { backgroundColor: getBackgroundColor(item.types[0]) }]}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.details}>
              <Text style={styles.id}>#{item.id}</Text>
              <Text style={styles.name}>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</Text>
              <Text style={styles.types}>Types: {item.types.map(type => type.charAt(0).toUpperCase() + type.slice(1)).join(', ')}</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

// Helper function to get background color based on Pokémon type
const getBackgroundColor = (type) => {
  return typeColors[type] || '#F0F0F0'; // Default to a light grey color if type is not found
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8', // Light grey background for the whole screen
  },
  item: {
    padding: 20,
    margin: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDD',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  details: {
    marginLeft: 15,
    flex: 1,
  },
  id: {
    fontSize: 14,
    color: '#555',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  types: {
    fontSize: 14,
    color: '#777',
  },
});

export default App;
