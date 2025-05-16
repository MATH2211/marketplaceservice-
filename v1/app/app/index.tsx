import React,{useState} from "react";

import { Text, View, TextInput,StyleSheet,TouchableOpacity} from "react-native";

export default function Index() {
  const [text,setText] = useState("");
  const [textoFinal,setTextoFinal] = useState("");
  const [lista,setLista] = useState<String[]>([]);
  const enviar = ()=>{
    const novaLista = [...lista,text];
    setLista(novaLista);
    setTextoFinal(novaLista.join(", "));
    setText("");
    //lista.push(text)
    //setTextoFinal(lista.toString());
  }


  return (
    <View style = {styles.container}>
      <TextInput style = {styles.input} placeholder="Digite aqui: "
      value={text} onChangeText={setText}></TextInput>
      <Text>Texto atual: {text}</Text>
      Touch
      <TouchableOpacity style = {styles.botao} onPress={enviar}><Text style = {styles.botaoTexto}>Enviar</Text></TouchableOpacity>
      <Text>Texto final: {textoFinal}</Text>
    </View>
  ); 
}

const styles = StyleSheet.create({
  container:{
    alignItems:'center',
    paddingTop: 10
  },
  input:{
    width: "90%",
    borderWidth:1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  botao: {
    width: '50%',
    backgroundColor: "#2196F3",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: "center",
  },
  botaoTexto: {
    color: "#fff",
    fontSize: 15, // Aqui controla o tamanho da fonte
    fontWeight: "bold",
  }
  
})