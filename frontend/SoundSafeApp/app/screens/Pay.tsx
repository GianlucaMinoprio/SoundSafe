import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet,Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { goBack } from '../navigators';
import ReactNativeBiometrics from 'react-native-biometrics'


import { Alert  } from "react-native"
  import {
    generateKeyPair,
    encrypt,
    sign,
    decrypt,
    verify,
    isKeySecuredOnHardware,
  } from "react-native-secure-encryption-module"

  const keyAlias = "my-key"
  let publicKey: string = ""
  let cipher: string = ""
  let signature: string = ""

  const biometricAuth = async () => {
    const biometrics = new ReactNativeBiometrics();
    const {success} = await biometrics.simplePrompt({
      promptMessage: 'Confirmation',
    });
    return success;
  }
  

const handleSign = async () => {
    try {
      await biometricAuth();
      const message = "Hello World"
      signature = await sign(message, "my-key")
    } catch (error) {
      return(error)
    }
  }

export const PayScreen = () => {
  
  const navigation = useNavigation<StackNavigationProp<any>>();

  const route = useRoute();
  const { decodedText } = route.params; // Récupérer le texte encodé passé en paramètre

  // Parser le texte encodé
  const [addrSafeTo, name, amount, coin] = decodedText.split(',');

  const handlePayment = () => {
    handleSign();
  };

  const handleDecline = () => {
    // Logique de refus ici
    goBack();
  };

  const apiUrl = `https://api.dicebear.com/7.x/shapes/png?seed=${addrSafeTo}`;

  return (
    <View style={styles.container}>

      <Image
        source={{ uri: apiUrl }}
        style={styles.avatarImage}
      />
      <Text style={styles.addrText}>{addrSafeTo}</Text>

      <Text style={styles.header}>Pay to {name}</Text>
      <Text style={styles.amount}>{amount} {coin}</Text>
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
    borderWidth: 3, // L'épaisseur de la bordure
    borderColor: 'black', // La couleur de la bordure
  },
  addrText: {
    fontSize: 14, // Ajustez selon la taille souhaitée
    color: 'black', // Ou une autre couleur de votre palette
    marginBottom: 20, // Ajustez selon votre mise en page
  },
});