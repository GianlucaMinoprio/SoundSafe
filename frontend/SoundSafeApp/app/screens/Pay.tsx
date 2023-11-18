import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export const PayScreen = () => {
  const handlePayment = () => {
    // Logique de paiement ici
  };

  const handleDecline = () => {
    // Logique de refus ici
  };

  const amount = 10;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Pay to</Text>
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
});