import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/Home';
import MeusEstabelecimentos from '../screens/MeusEstabelecimentos';
import TodosEstabelecimentos from '../screens/TodosEstabelecimentos';
import Dashboard from '../screens/estabelecimento/Dashboard';
import NewEstabelecimento from '../screens/estabelecimento/New';
import Agendamentos from '../screens/estabelecimento/agendamentos/Agendamentos';
import Servicos from '../screens/estabelecimento/servicos/Servicos';
import Edit from '../screens/estabelecimento/servicos/Edit';
import NewServico from '../screens/estabelecimento/servicos/NewServico';
import Horarios from '../screens/estabelecimento/horarios/Horarios';
import NewHorarioPro from '../screens/estabelecimento/horarios/HorarioPro';
import DiaPro from '../screens/estabelecimento/horarios/DayPro';
import Profissionais from '../screens/estabelecimento/profissionais/Profissionais';
import NewPro from '../screens/estabelecimento/profissionais/NewPro';
import Custom from '../screens/estabelecimento/customizacao/Custom';

const Stack = createNativeStackNavigator();

export default function AppStack() {
    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={Home} options={{ title: 'Início' }} />
            <Stack.Screen name="MeusEstabelecimentos" component={MeusEstabelecimentos} options={{ title: 'Meus Estabelecimentos' }} />
            <Stack.Screen name="TodosEstabelecimentos" component={TodosEstabelecimentos} options={{ title: 'Todos os Estabelecimentos' }} />
            <Stack.Screen name="Dashboard" component={Dashboard} options={{ title: 'Dashboard' }} />
            <Stack.Screen name="NewEstabelecimento" component={NewEstabelecimento} options={{ title: 'Novo Estabelecimento' }} />
            <Stack.Screen name='Agendamentos' component={Agendamentos} options={{ title: 'Agendamentos' }}/>
            <Stack.Screen name='Servicos' component={Servicos} options={{ title: 'Serviços' }}/>
            <Stack.Screen name='ServicoEdit' component={Edit} options={{ title: "Editar serviço" }}/>
            <Stack.Screen name='NewServico' component={NewServico} options={{ title: 'Novo Serviço' }} />
            <Stack.Screen name='Horarios' component={Horarios} options={{ title: 'Horários' }}/>
            <Stack.Screen name='HorariosPro' component={NewHorarioPro} options={{ title: "Horários profissionais" }} />
            <Stack.Screen name='DiaPro' component={DiaPro} options={{ title: 'Horários profissionais' }} />
            <Stack.Screen name='Profissionais' component={Profissionais} options={{ title: 'Profissionais' }}/>
            <Stack.Screen name='NewPro' component={NewPro} options={{ title: 'Novo profissional' }}/>
            <Stack.Screen name='Customizacao' component={Custom} options={{ title: 'Customização' }}/>
        </Stack.Navigator>
    );
}
