import React from 'react';
import { StyleSheet, View, TextInput, Button, Text, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import ReactNativeBiometrics from 'react-native-biometrics'


  const biometricAuth = async () => {
    const biometrics = new ReactNativeBiometrics();
    const {success} = await biometrics.simplePrompt({
      promptMessage: 'Confirmation',
    });
    return success;
  }
  



export const LoginScreen = () => {

  const [name, setName] = useState('');
  const navigation = useNavigation<StackNavigationProp<any>>();



  const handleLogIn = async () => {

    // Verifier avec un Face ID 
    await biometricAuth();
    
    console.log(name); // Affiche le nom dans la console


    navigation.navigate('MainScreen', { name: name });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LogIn</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogIn}>
        <Text style={styles.buttonText}>Go!</Text>
      </TouchableOpacity>
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
    backgroundColor: colors.white, // Use mint as the background color
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: colors.navy, // Use navy for the title text
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
});

