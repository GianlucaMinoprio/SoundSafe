import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export const RequestScreen = () => {
  const [amount, setAmount] = useState(10);

  const handleIncrement = () => setAmount(prevAmount => prevAmount + 1);
  const handleDecrement = () => setAmount(prevAmount => Math.max(prevAmount - 1, 0));

  
  const navigation = useNavigation<StackNavigationProp<any>>();


  const addrSafe = "0x1HDTD536DHG36HD73HDY37DH378H83" 

  const apiUrl = `https://api.dicebear.com/7.x/shapes/png?seed=${addrSafe}`;



  const handleRequest = () => {
    // Implémentez la logique de demande ici
    console.log(`Requesting $${amount}`);

    navigation.navigate('Pay');

  };

  return (
    <View style={styles.container}>

      <Image
        source={{ uri: apiUrl }}
        style={styles.avatarImage}
      />
      <Text style={styles.addrText}>{addrSafe}</Text>


      <Text style={styles.header}>request</Text>
      
      <View style={styles.amountContainer}>
        <TouchableOpacity onPress={handleDecrement} style={styles.changeAmountButton}>
          <Text style={styles.changeAmountButtonText}>-</Text>
        </TouchableOpacity>

        <Text style={styles.amount}>${amount}</Text>
        
        <TouchableOpacity onPress={handleIncrement} style={styles.changeAmountButton}>
          <Text style={styles.changeAmountButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handleRequest} style={styles.requestButton}>
        <Text style={styles.requestButtonText}>Request</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // Remplacez par la couleur de fond souhaitée
  },
  header: {
    fontSize: 24,
    marginBottom: 40,
    color: '#000000', // Remplacez par la couleur de texte souhaitée
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  changeAmountButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D3D3D3', // Remplacez par la couleur de votre choix
    borderRadius: 30,
  },
  changeAmountButtonText: {
    fontSize: 24,
    color: '#000000', // Remplacez par la couleur de texte souhaitée
  },
  amount: {
    fontSize: 40,
    marginHorizontal: 20,
    color: '#000000', // Remplacez par la couleur de texte souhaitée
  },
  requestButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#4fc3c4', // Remplacez par la couleur du bouton dans votre palette
    borderRadius: 25,
  },
  requestButtonText: {
    color: 'white', // Remplacez par la couleur de texte souhaitée
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