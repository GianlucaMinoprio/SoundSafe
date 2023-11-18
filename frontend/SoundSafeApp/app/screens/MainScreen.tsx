import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import RequestButton from './../components/RequestButton'; // Assurez-vous que le chemin d'importation est correct
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';


export const MainScreen = ({ route }) => {
  const { name } = route.params; // Assurez-vous que 'name' est passé en tant que paramètre lors de la navigation vers ce screen
  const balance = 15; // Remplacez par la logique appropriée pour obtenir le solde réel

  const navigation = useNavigation<StackNavigationProp<any>>();


  return (
    <View style={styles.container}>
      <Text style={styles.name}>Hello, {name}</Text>
      <Text style={styles.balanceText}>Your balance:</Text>
      <Text style={styles.balance}>{balance}$</Text>
      <TouchableOpacity
      style={styles.requestButton}
      onPress={() => navigation.navigate('Request')}>
      <Text style={styles.buttonText}>Request</Text>
    </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white', // Ou une autre couleur de votre palette
  },
  name: {
    position: 'absolute',
    top: 50,
    left: 20,
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black', // Ou une autre couleur de votre palette
  },
  balanceText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black', // Ou une autre couleur de votre palette
  },
  balance: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'black', // Ou une autre couleur de votre palette
    marginBottom: 24,
  },
  requestButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#4fc3c4', // Utilisez une couleur de votre palette
    borderRadius: 25,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 100, // Ajustez en fonction de la disposition
  },
  buttonText: {
    // Vos styles pour le texte du bouton vont ici
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 28,
  },
});

export default MainScreen;
