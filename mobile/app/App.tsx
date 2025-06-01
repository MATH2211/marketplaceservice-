import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
import Home from './screens/Home';
import Register from './screens/Register';
import ForgotPassword from './screens/ForgotPassword';
import NewEstabelecimento from './screens/estabelecimento/New';
//Estabeleciment
import Dashboard from './screens/estabelecimento/Dashboard';



const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Register" component={Register} options={{ title: 'Cadastro' }} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ title: 'Recuperar Senha' }} />
        <Stack.Screen name="Dashboard" component={Dashboard} options={{ title: 'Dashboard' }} />
        <Stack.Screen name="NewEstabelecimento" component={NewEstabelecimento} options={{ title: 'Novo Estabelecimento' }}
      />
      </Stack.Navigator>
      
    </NavigationContainer>
  );
}
