import React from "react"
import { View, Button, Alert, StyleSheet } from "react-native"
import {
  generateKeyPair,
  encrypt,
  sign,
  decrypt,
  verify,
  isKeySecuredOnHardware,
} from "react-native-secure-encryption-module"

const EncryptionTestScreen: React.FC = () => {
  const keyAlias = "my-key"
  let publicKey: string = ""
  let cipher: string = ""
  let signature: string = ""

  const handleGenerateKeyPair = async () => {
    try {
      publicKey = await generateKeyPair(keyAlias)
      Alert.alert("Key Pair Generated", `Public Key: ${publicKey}`)
    } catch (error) {
      showError(error)
    }
  }

  const handleEncrypt = async () => {
    try {
      const message = "Hello World"
      cipher = await encrypt(message, keyAlias)
      Alert.alert("Message Encrypted", `Cipher: ${cipher}`)
    } catch (error) {
      showError(error)
    }
  }

  const handleSign = async () => {
    try {
      const message = "Hello World"
      signature = await sign(message, keyAlias)
      Alert.alert("Message Signed", `Signature: ${signature}`)
    } catch (error) {
      showError(error)
    }
  }

  const handleDecrypt = async () => {
    try {
      const decryptedMessage = await decrypt(cipher, keyAlias)
      Alert.alert("Message Decrypted", `Decrypted Message: ${decryptedMessage}`)
    } catch (error) {
      showError(error)
    }
  }

  const handleVerify = async () => {
    try {
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
      <Button title="Generate Key Pair" onPress={handleGenerateKeyPair} />
      <Button title="Encrypt Message" onPress={handleEncrypt} />
      <Button title="Sign Message" onPress={handleSign} />
      <Button title="Decrypt Message" onPress={handleDecrypt} />
      <Button title="Verify Signature" onPress={handleVerify} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
  },
})

export default EncryptionTestScreen
