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
  const testEncryptionModule = async () => {
    try {
      const keyAlias = "my-key"

      // Check hardware support
      const isSupported = await isKeySecuredOnHardware(keyAlias)
      if (!isSupported) {
        Alert.alert("Unsupported", "Hardware level security is not available on this device.")
        return
      }

      // Generate key pair
      const publicKey = await generateKeyPair(keyAlias)

      // Encrypt a message
      const message = "Hello World"
      const cipher = await encrypt(message, keyAlias)

      // Sign the message
      const signature = await sign(message, keyAlias)

      // Decrypt the message
      const decryptedMessage = await decrypt(cipher, keyAlias)

      // Verify the signature
      const isSignatureValid = await verify(signature, message, keyAlias)

      // Display results
      Alert.alert(
        "Test Results",
        `Public Key: ${publicKey}\nDecrypted Message: ${decryptedMessage}\nSignature Valid: ${isSignatureValid}`,
      )
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message)
      }
    }
  }

  return (
    <View style={styles.container}>
      <Button title="Test Encryption Module" onPress={testEncryptionModule} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})

export default EncryptionTestScreen
