import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import RequestButton from './../components/RequestButton'; // Assurez-vous que le chemin d'importation est correct
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import cryptocurrencies from '../../assets/cryptocurrencies.json';
import { useState, useEffect } from 'react';

import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';


const addrSafe = "0x62A81a211B75E46C83B3c7B50c14BafCc94ERFt5" 

const apiUrl = `https://api.dicebear.com/7.x/shapes/png?seed=${addrSafe}`;

const getCurrencyIcon = (iconName) => {
  console.log(iconName)
  switch (iconName) {
    case 'USDT':
      return require('../../assets/icons/crypto/usdt_icon.png');
    case 'EURC':
      return require('../../assets/icons/crypto/eurc_icon.png');
    case 'Weth':
      return require('../../assets/icons/crypto/weth_icon.png');
    case 'Polygon':
      return require('../../assets/icons/crypto/polygon_icon.png');
    case 'Gnosis - XDAI':
      return require('../../assets/icons/crypto/gnosis_icon.png');
    case 'ApeCoin':
      return require('../../assets/icons/crypto/apecoin_icon.png');
    case 'FileCoin':
      return require('../../assets/icons/crypto/filecoin_icon.png');
    case 'Fuji':
      return require('../../assets/icons/crypto/fuji_icon.png');
    case 'Sepolia':
      return require('../../assets/icons/crypto/ethereum_icon.png');


    default:
      return require('../../assets/icons/crypto/ethereum_icon.png');
  }
};

export const MainScreen = ({ route }) => {
  const { name, addr, selectedCurrency } = route.params; // Assurez-vous que 'name' est passé en tant que paramètre lors de la navigation vers ce screen
  let balance = 25.44; // Remplacez par la logique appropriée pour obtenir le solde réel

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



  const [textToEncode, setTextToEncode] = useState<string>("");
  const [soundUri, setSoundUri] = useState<string | null>(null);
  const [decodedText, setDecodedText] = useState('');
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  const [isRecording, setIsRecording] = useState(false);

  const [hasPermissions, setHasPermissions] = useState(false); // Nouvel état pour suivre les permissions
  
  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
      if (status === 'granted') {
        setHasPermissions(true);  // Mettre à jour l'état lorsque les permissions sont accordées
      } else {
        console.error('Audio recording permission not granted');
      }
    };

    requestPermissions();
  }, []);

  // useEffect(() => {
  //   if (hasPermissions) {  // Vérifier si les permissions ont été accordées
  //     // Démarrer l'enregistrement dès que les permissions sont accordées
  //     startRecording();

  //     // Vérifier toutes les 6 secondes
  //     const interval = setInterval(() => {
  //       if (isRecording) {
  //         stopRecording();
  //       }
  //     }, 6000);

  //     return () => {
  //       clearInterval(interval);
  //       if (recording && isRecording) {
  //         stopRecording();
  //       }
  //     };
  //   }
  //   else {
  //     console.log('Permissions not granted yet');
  //   }
  // }, [hasPermissions, isRecording]);  // Ajoutez hasPermissions comme dépendance

  // const startRecording = async () => {
  //   if (isRecording) {
  //     console.log('A recording is already in progress.');
  //     return;
  //   }
  
  //   try {
  //     console.log('Requesting permissions..');
  //     // Request permissions and configure audio session here
  
  //     console.log('Starting recording..');
  //     const newRecording = new Audio.Recording();
  //     await newRecording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HighQuality);
  //     await newRecording.startAsync();
  //     // Update the state to reflect that recording has started
  //     setRecording(newRecording);
  //     setIsRecording(true);
  //   } catch (err) {
  //     console.error('Failed to start recording', err);
  //   }
  // };


  const startRecording = async () => {
    try {
      console.log('Requesting permissions..');
      const permissionResponse = await Audio.requestPermissionsAsync();
      if (permissionResponse.status !== 'granted') {
        console.error('Audio recording permissions not granted');
        return;
      }
  
      console.log('Setting audio mode..');
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
  
      console.log('Starting recording..');
      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HighQuality);
      await newRecording.startAsync();
      setRecording(newRecording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  };
  
  const stopRecording = async () => {
    if (!recording) return;
    console.log('Stopping recording..');
    // Do something with the recording file here    
    await recording?.stopAndUnloadAsync();
    const uri = recording?.getURI();
    setSoundUri(uri);
    console.log('Recording stopped and stored at', uri);
    setRecording(null);
    setIsRecording(false);
    await decodeAndNavigate();;
  };
  

  // const startRecording = async () => {
  //   try {
  //     console.log('Requesting permissions..');
  //     await Audio.requestPermissionsAsync();
  //     await Audio.setAudioModeAsync({
  //       allowsRecordingIOS: true,
  //       playsInSilentModeIOS: true,
  //       playThroughEarpieceAndroid: true,  // Set to true to use the earpiece (or false to use the speaker)
  //     });
  //     console.log('Starting recording..');
  //     const recording = new Audio.Recording();
  //     await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HighQuality);
  //     await recording.startAsync();
  //     setRecording(recording);
  //     setIsRecording(true);

  //     // Arrêter l'enregistrement après 5 secondes
  //     setTimeout(() => {
  //     if (isRecording) {
  //       stopRecording();
  //     }
  //   }, 6000);  // 5000 milliseconds = 5 seconds

  //   } catch (err) {
  //     console.error('Failed to start recording', err);
  //   }
  // };

  // const stopRecording = async () => {
  //   if (!recording) return;
  //   console.log('Stopping recording..');
  //   await recording?.stopAndUnloadAsync();
  //   const uri = recording?.getURI();
  //   setSoundUri(uri);
  //   console.log('Recording stopped and stored at', uri);
  //   setIsRecording(false);
  //   await decodeAndNavigate();
  // };

  const decodeAndNavigate = async () => {
    await decodeEncodedSound();
    if (decodedText) {
      console.log('Decoded text: ', decodedText);
      navigation.navigate('Pay', { decodedText: decodedText });
    } else {
      startRecording();
    }
  };

  const handlePay2 = () => {
    // Time sleep to simulate the payment 2 seconds
    setTimeout(() => {
      navigation.navigate('Pay', { decodedText: "0x62A81a211B75E46C83B3c7B50c14BafCc944F3f8,Gianluca,14,USDT" });
    }, 2000);
  };

  const decodeEncodedSound = async () => {
    try {
      if (!soundUri) {
        console.error('No sound URI available for decoding.');
        return;
      }
       // Read the audio file into a Base64-encoded string
       const base64Audio = await FileSystem.readAsStringAsync(soundUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
  
      // Send the POST request to the decode endpoint
      const response = await fetch(`http://192.168.225.80:8080/decode`, {
        method: 'POST',
        body: JSON.stringify({ file: base64Audio }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to decode audio: ${response.statusText}`);
      }
  
      const result = await response.json();
      setDecodedText(result.text);
    } catch (error) {
      console.error(error);
    }
  };




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

      <TouchableOpacity
        style={styles.payButton2}
        onPress={() => handlePay2()}>
        <Text style={styles.buttonText2}>Pay</Text>
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
  payButton2: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'white', // Choisissez une couleur appropriée pour le bouton Pay
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
  buttonText2: {
    // Vos styles pour le texte du bouton vont ici
    color: 'white',
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
