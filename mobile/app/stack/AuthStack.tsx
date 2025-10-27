import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/Login';
import Register from '../screens/Register';
import ForgotPassword from '../screens/ForgotPassword';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} options={{ title: 'Cadastro' }} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ title: 'Recuperar Senha' }} />
      
    </Stack.Navigator>
  );
}
