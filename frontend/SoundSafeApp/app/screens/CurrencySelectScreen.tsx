import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Supposons que le fichier cryptocurrencies.json est importé correctement
// et contient la structure indiquée précédemment.
import cryptocurrencies from '../../assets/cryptocurrencies.json';
import { goBack, navigate } from '../navigators';
import { ColorSpace } from 'react-native-reanimated';



export const CurrencySelectScreen = ({ route }) => {
  const navigation = useNavigation();

  const { name, addr } = route.params; // Assurez-vous que 'name' est passé en tant que paramètre lors de la navigation vers ce screen

  
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
        return require('../../assets/icons/crypto/ethereum_icon.png');
    }
  };


  const handleSelectCurrency = (currencyName) => {
    // Pass the selected currency back to the MainScreen
    // Trouve la devise sélectionnée dans la liste des devises et met a true la valeur selected
    
    navigate('MainScreen', { name: name, addr: addr, selectedCurrency : currencyName });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => handleSelectCurrency(item.name)}
    >
      <Image
        source={getCurrencyIcon(item.name)}
        style={styles.currencyImage}
      />
      <Text style={styles.currencyName}>{item.name}</Text>
    </TouchableOpacity>
  );

return (
    <View style={styles.container}>
        <Text style={styles.header}>Select a currency</Text>
        <FlatList
            data={cryptocurrencies}
            renderItem={renderItem}
            keyExtractor={item => item.chainId}
        />
    </View>
);
};

// Updated styles for a nicer design
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f7f7f7', // Set a background color
      marginTop: 100, // Add some top margin
    },
    itemContainer: {
      flexDirection: 'row',
      padding: 10,
      alignItems: 'center',
      borderBottomWidth: 1, // Add a bottom border to each item
      borderBottomColor: '#e1e1e1', // Border color
      backgroundColor: 'white', // Set item background color
      marginVertical: 4, // Add some vertical margin between items
      marginHorizontal: 8, // Add some horizontal margin
      borderRadius: 10, // Round corners
      shadowColor: "#000", // Shadow for a "lifted card" effect
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    currencyImage: {
      width: 50,
      height: 50,
      marginRight: 10,
      borderRadius: 25, // Circular images
    },
    currencyName: {
      fontSize: 18,
      fontWeight: 'bold', // Make the text bold
    },
    header: {
        fontSize: 24,
        marginBottom: 8,
        color: '#000000', // ou toute autre couleur de texte appropriée
        marginLeft: 15,
      },
  });;

export default CurrencySelectScreen;
