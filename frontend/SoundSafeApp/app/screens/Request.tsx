import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useEffect } from 'react';

import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';

export const RequestScreen = () => {
  const [amount, setAmount] = useState(10);

  const [textToEncode, setTextToEncode] = useState<string>("");

  const currency = "USDT";

  
  const navigation = useNavigation<StackNavigationProp<any>>();


  const addrSafe = "0x62A81a211B75E46C83B3c7B50c14BafCc944F3f8" 

  const apiUrl = `https://api.dicebear.com/7.x/shapes/png?seed=${addrSafe}`;

  const name = 'John Doe';

  const [soundUri, setSoundUri] = useState<string | null>(null);
  const [decodedText, setDecodedText] = useState('');
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  useEffect(() => {
    setTextToEncode(`${addrSafe},${name},${amount},${currency}`);
  }, [amount]);

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
      if (status !== 'granted') {
        console.error('Audio recording permission not granted');
      }
    };

    requestPermissions();
  }, []);

  const encodeText = async () => {
    try {
      const protocolId = '5';
      const volume = '20';
      // Encode textToEncode pour l'insérer dans l'URL
      const encodedText = encodeURIComponent(textToEncode);
      // Construction de l'URL avec les paramètres
      const url = `https://ggwave-to-file.ggerganov.com/?m=${encodedText}&p=${protocolId}&v=${volume}`;
      // Effectuer la requête GET
      const response = await fetch(url);
      const blob = await response.blob();
      // Convertir le Blob en base64
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64Audio = reader.result;
        const uri = FileSystem.documentDirectory + 'encodedAudioTest.wav';
        // Extraire la partie base64 et écrire le fichier
        const base64Data = base64Audio.split(',')[1];
        FileSystem.writeAsStringAsync(uri, base64Data, { encoding: FileSystem.EncodingType.Base64 });
        console.log('Text encoded successfully');
        console.log('The uri is: ', uri);
        setSoundUri(uri);
        // const soundObject = new Audio.Sound();
        // await soundObject.loadAsync({ uri });
        // setSound(soundObject);
      };
    } catch (error) {
      console.error(error);
    }
  };
  

  const playEncodedSound = async () => {
    const soundObject = new Audio.Sound();
    try {
      if (soundUri) {
        // Disable microphone and set the speaker to be used
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          playThroughEarpieceAndroid: false,  // Set to false to use the speaker
        });

        await soundObject.loadAsync({ uri: soundUri });
        await soundObject.setVolumeAsync(1.0, 0);
        console.log('The uri is: ', soundUri);
        console.log('Playing sound');
        await soundObject.playAsync();
      } else {
        console.log('No sound object is available to play.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRequest = async () => {
    try {

      await encodeText();

      for (let i = 0; i < 10; i++) {
        await playEncodedSound();
        await new Promise(resolve => setTimeout(resolve, 3700));
        // Ajoutez un délai si nécessaire entre les lectures
      }
      // Après avoir joué le message 10 fois, naviguez vers 'Pay'
      navigation.navigate('Pay');
    } catch (error) {
      console.error(error);
    }
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
        <TouchableOpacity onPress={() => setAmount(prev => Math.max(0, prev - 1))} style={styles.changeAmountButton}>
          <Text style={styles.changeAmountButtonText}>-</Text>
        </TouchableOpacity>

        <Text style={styles.amount}>${amount}</Text>
        
        <TouchableOpacity onPress={() => setAmount(prev => prev + 1)} style={styles.changeAmountButton}>
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
    borderWidth: 3, // L'épaisseur de la bordure
    borderColor: 'black', // La couleur de la bordure
  },
  addrText: {
    fontSize: 16, // Ajustez selon la taille souhaitée
    color: 'black', // Ou une autre couleur de votre palette
    marginBottom: 20, // Ajustez selon votre mise en page
  },
});