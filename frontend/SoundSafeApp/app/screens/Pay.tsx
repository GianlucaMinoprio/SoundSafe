import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet,Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { goBack } from '../navigators';

export const PayScreen = () => {
  
  const navigation = useNavigation<StackNavigationProp<any>>();

  const handlePayment = () => {
    // Logique de paiement ici
  };

  const handleDecline = () => {
    // Logique de refus ici
    goBack();
  };

  const amount = 10;
  const name = 'John Doe';
  const addrSafeTo = '0x1HDTD536DHG36HD73HDY37DH378H83';
  const coin = 'ETH'

  const apiUrl = `https://api.dicebear.com/7.x/shapes/png?seed=${addrSafeTo}`;

  return (
    <View style={styles.container}>

      <Image
        source={{ uri: apiUrl }}
        style={styles.avatarImage}
      />
      <Text style={styles.addrText}>{addrSafeTo}</Text>

      <Text style={styles.header}>Pay to {name}</Text>
      <Text style={styles.amount}>${amount}</Text>
      <TouchableOpacity onPress={handlePayment} style={[styles.button, styles.payButton]}>
        <Text style={styles.buttonText}>Pay</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleDecline} style={[styles.button, styles.declineButton]}>
        <Text style={styles.buttonText}>Decline</Text>
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
    backgroundColor: '#FFFFFF', // ou toute autre couleur de fond appropriée
  },
  header: {
    fontSize: 24,
    marginBottom: 8,
    color: '#000000', // ou toute autre couleur de texte appropriée
  },
  amount: {
    fontSize: 48,
    marginVertical: 24,
    color: '#000000', // ou toute autre couleur de texte appropriée
  },
  button: {
    width: '80%',
    padding: 15,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  payButton: {
    backgroundColor: '#4CAF50', // ou toute autre couleur verte appropriée
  },
  declineButton: {
    backgroundColor: '#F44336', // ou toute autre couleur rouge appropriée
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  avatarImage: {
    width: 100, // Ajustez selon la taille souhaitée
    height: 100, // Ajustez selon la taille souhaitée
    borderRadius: 50, // Cela rendra l'image circulaire
    marginTop: 20, // Ajustez selon votre mise en page
    marginBottom: 30, // Petit espace entre l'image et l'adresse
  },
  addrText: {
    fontSize: 16, // Ajustez selon la taille souhaitée
    color: 'black', // Ou une autre couleur de votre palette
    marginBottom: 20, // Ajustez selon votre mise en page
  },
});