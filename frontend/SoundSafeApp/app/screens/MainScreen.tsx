import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import RequestButton from './../components/RequestButton'; // Assurez-vous que le chemin d'importation est correct
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import cryptocurrencies from '../../assets/cryptocurrencies.json';
import { useState, useEffect } from 'react';


const addrSafe = "0x1HDTD536DHG36HD73HDY37DH378H83" 

const apiUrl = `https://api.dicebear.com/7.x/shapes/png?seed=${addrSafe}`;

const getCurrencyIcon = (iconName) => {
  console.log(iconName)
  switch (iconName) {
    case 'Ethereum':
      return require('../../assets/icons/crypto/ethereum_icon.png');
    case 'Polygon':
      return require('../../assets/icons/crypto/polygon_icon.png');
    case 'Gnosis':
      return require('../../assets/icons/crypto/gnosis_icon.png');
    // Vous devez ajouter des cas pour chaque icône que vous avez
    default:
      return require('../../assets/icons/crypto/gnosis_icon.png');
  }
};


export const MainScreen = ({ route }) => {
  const { name, addr, selectedCurrency } = route.params; // Assurez-vous que 'name' est passé en tant que paramètre lors de la navigation vers ce screen
  const balance = 15; // Remplacez par la logique appropriée pour obtenir le solde réel

  console.log(selectedCurrency)
  const [preferredCurrency, setPreferredCurrency] = useState(cryptocurrencies[0]); // Démarrez avec une valeur par défaut

  const navigation = useNavigation<StackNavigationProp<any>>();

  // useEffect to update the preferred currency when the selectedCurrency changes
  useEffect(() => {
    // Find the currency object from the cryptocurrencies list
    const currencyToUpdate = cryptocurrencies.find(currency => currency.name === selectedCurrency);
    
    // If we find the currency in the list, update the preferred currency state
    if (currencyToUpdate) {
      setPreferredCurrency(currencyToUpdate);
    } else {
      console.error('Selected currency not found in the list');
    }
  }, [selectedCurrency]);


  return (
    <View style={styles.container}>
      <Text style={styles.name}>Hello, {name}</Text>

      <Image
        source={{ uri: apiUrl }}
        style={styles.avatarImage}
      />

      <Text style={styles.balanceText}>Your balance:</Text>

      <View style={styles.balanceContainer}>
        <Text style={styles.balance}>{balance}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('CurrencySelectScreen', { name : name, addr : addr })}>
          <Image
            source={getCurrencyIcon(preferredCurrency.name)}
            style={styles.currencyIcon}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.requestButton}
        onPress={() => navigation.navigate('Request')}>
        <Text style={styles.buttonText}>Request</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.payButton}
        onPress={() => navigation.navigate('PayAddr')}>
        <Text style={styles.buttonText}>Pay</Text>
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
    top: 80,
    left: 20,
    fontSize: 32,
    fontWeight: 'bold',
    color: 'black', // Ou une autre couleur de votre palette
  },
  balanceText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black', // Ou une autre couleur de votre palette
    marginBottom: 20,
  },
  balance: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'black', // Ou une autre couleur de votre palette
    marginBottom: 24,
  },
  payButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#4fc3f4', // Choisissez une couleur appropriée pour le bouton Pay
    borderRadius: 25,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10, // Ajustez comme nécessaire
  },
  requestButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#4fc3c4', // Utilisez une couleur de votre palette
    borderRadius: 25,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    // Vos styles pour le texte du bouton vont ici
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 28,
  },
  avatarImage: {
    width: 100, // Ajustez selon la taille souhaitée
    height: 100, // Ajustez selon la taille souhaitée
    borderRadius: 50, // Cela rendra l'image circulaire
    marginTop: 20, // Ajustez selon votre mise en page
    marginBottom: 40, // Petit espace entre l'image et l'adresse
    borderWidth: 3, // L'épaisseur de la bordure
    borderColor: 'black', // La couleur de la bordure
  },
  currencyIcon : {
    width: 50, // Ajustez selon la taille souhaitée
    height: 50, // Ajustez selon la taille souhaitée
    borderRadius: 50, // Cela rendra l'image circulaire
    marginTop: 20, // Ajustez selon votre mise en page
    marginBottom: 45, // Petit espace entre l'image et l'adresse
    marginLeft: 10,
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24, // Ajustez selon votre mise en page
  },
});

export default MainScreen;
