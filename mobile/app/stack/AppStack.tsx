import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/Home';
import Dashboard from '../screens/estabelecimento/Dashboard';
import NewEstabelecimento from '../screens/estabelecimento/New';

//agendamentos
import Agendamentos from '../screens/estabelecimento/agendamentos/Agendamentos';

//Serviços
import Servicos from '../screens/estabelecimento/servicos/Servicos';

//Horários
import Horarios from '../screens/estabelecimento/horarios/Horarios';

//Profissionais
import Profissionais from '../screens/estabelecimento/profissionais/Profissionais';

//Customização
import Custom from '../screens/estabelecimento/customizacao/Custom';



const Stack = createNativeStackNavigator();

export default function AppStack() {
    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Dashboard" component={Dashboard} options={{ title: 'Dashboard' }} />
            <Stack.Screen name="NewEstabelecimento" component={NewEstabelecimento} options={{ title: 'Novo Estabelecimento' }} />
            
            {/* Agendamentos */}
            <Stack.Screen name='Agendamentos' component={Agendamentos} options={{'title': 'Agendamentos'}}/>

            {/* Serviços */}
            <Stack.Screen name='Servicos' component={Servicos} options={{'title': 'Servircos'}}/>
            
            {/* Horários */}
            <Stack.Screen name='Horarios' component={Horarios} options={{'title': 'Horarios'}}/>
            
            {/* Profissionais */}
            <Stack.Screen name='Profissionais' component={Profissionais} options={{'title': 'Profissionais'}}/>
            
            {/* Customizacao*/}
            <Stack.Screen name='Customizacao' component={Custom} options={{'title': 'Customização'}}/>

        </Stack.Navigator>
    );
}
