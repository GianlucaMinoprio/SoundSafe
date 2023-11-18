import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
const Stack = createNativeStackNavigator();

import { LoginScreen, MainScreen } from "."
import { RequestScreen } from "./Request"

// Dans votre composant App ou Navigation
<Stack.Navigator>
    {/* Autres écrans */}
    <Stack.Screen name="Main" component={MainScreen} />
    <Stack.Screen name="Request" component={RequestScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    {/* Autres écrans */}
</Stack.Navigator>
