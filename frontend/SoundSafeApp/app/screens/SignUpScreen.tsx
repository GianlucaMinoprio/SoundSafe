import React from 'react';
import { StyleSheet, View, TextInput, Button, Text, TouchableOpacity, Image } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
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


  const biometricAuth = async () => {
    const biometrics = new ReactNativeBiometrics();
    const {success} = await biometrics.simplePrompt({
      promptMessage: 'Confirmation',
    });
    return success;
  }
  

export const SignUpScreen = () => {

  const [name, setName] = useState('');
  const navigation = useNavigation<StackNavigationProp<any>>();

  const keyAlias = "my-key"
  let publicKey: string = ""
  let cipher: string = ""
  let signature: string = ""



  const handleSignUp = async () => {
    
    // Ajout bouton pour création pair de clé publique et privée
    // Enregistre la clé publique pour les call API

    await handleGenerateKeyPair();

    console.log(name); // Affiche le nom dans la console ou le sauvegarde comme nécessaire.

    navigation.navigate('MainScreen', { name: name, addr: publicKey, selectedCurrency : "ethereum_icon" });
  };
  
    const handleGenerateKeyPair = async () => {
      try {
        await biometricAuth();
        publicKey = await generateKeyPair(keyAlias)
        //Alert.alert("Key Pair Generated", `Public Key: ${publicKey}`)
      } catch (error) {
        showError(error)
      }
    }
  
    const handleEncrypt = async () => {
      try {
        await biometricAuth();
        const message = "Hello World"
        cipher = await encrypt(message, keyAlias)
        Alert.alert("Message Encrypted", `Cipher: ${cipher}`)
      } catch (error) {
        showError(error)
      }
    }
  
    const handleSign = async () => {
      try {
        await biometricAuth();
        const message = "Hello World"
        signature = await sign(message, keyAlias)
        Alert.alert("Message Signed", `Signature: ${signature}`)
      } catch (error) {
        showError(error)
      }
    }
  
    const handleDecrypt = async () => {
      try {
        await biometricAuth();
        const decryptedMessage = await decrypt(cipher, keyAlias)
        Alert.alert("Message Decrypted", `Decrypted Message: ${decryptedMessage}`)
      } catch (error) {
        showError(error)
      }
    }
  
    const handleVerify = async () => {
      try {
        await biometricAuth();
        const message = "Hello World"
        const isSignatureValid = await verify(signature, message, keyAlias)
        Alert.alert("Signature Verified", `Is Valid: ${isSignatureValid}`)
      } catch (error) {
        showError(error)
      }
    }
  
    const showError = (error: unknown) => {
      if (error instanceof Error) {
        Alert.alert("Error", error.message)
      }
    }







  return (
    <View style={styles.container}>

      <Image
        source={require("../../assets/images/logo_circle.png")}
        style={styles.avatarImage}
      />

      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Go!</Text>
      </TouchableOpacity>


      {/* <TouchableOpacity style={styles.button} onPress={handleGenerateKeyPair}>
        <Text style={styles.buttonText}>Generate Key Pair</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleEncrypt}>
        <Text style={styles.buttonText}>Encrypt Message</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSign}>
        <Text style={styles.buttonText}>Sign Message</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleDecrypt}>
        <Text style={styles.buttonText}>Decrypt Message</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Verify Signature</Text>
      </TouchableOpacity> */}



    </View>
  );
};

const colors = {
  mint: '#b9efe4',
  navy: '#041c2c',
  turquoise: '#4fc3c4',
  skyBlue: '#1886b3',
  teal: '#1d6b84',
  deepBlue: '#0a4a6f',
  darkTeal: '#0f4056',
  darkNavy: '#073150',
  slate: '#46515a',
  white: '#ffffff',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.navy, // Use mint as the background color
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: colors.white, // Use navy for the title text
  },
  input: {
    width: '80%',
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.slate, // Use slate for the input border
    backgroundColor: 'white',
  },
  button: {
    width: '80%',
    paddingVertical: 12,
    backgroundColor: colors.turquoise, // Use turquoise for the button background
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: colors.white, // Use white for the button text
    fontSize: 18,
    fontWeight: 'bold',
  },
  avatarImage: {
    width: 200, // Ajustez selon la taille souhaitée
    height: 200, // Ajustez selon la taille souhaitée
    borderRadius: 50, // Cela rendra l'image circulaire
    marginBottom: 60, // Petit espace entre l'image et l'adresse
  },


  // button: {
  //   alignItems: 'center',
  //   backgroundColor: '#DDDDDD', // Utilisez la couleur de votre choix
  //   padding: 10,
  //   marginTop: 10, // Ajoutez une marge en haut pour séparer les boutons
  //   width: '80%', // ou la largeur que vous préférez
  //   borderRadius: 5, // ou le rayon que vous préférez
  // },
  // buttonText: {
  //   fontSize: 16, // ou la taille de police que vous préférez
  //   color: '#000000', // Utilisez la couleur de texte de votre choix
  //   // Ajoutez 'fontWeight: 'bold'' si vous voulez que le texte soit en gras
  // },
});
