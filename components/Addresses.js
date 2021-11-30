import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, Alert } from 'react-native';
import{ Input, Button, ListItem } from'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { initializeApp } from 'firebase/app';
import{ getDatabase, ref, onValue, remove } from "firebase/database";

export default function Addresses({navigation}) {

    const [address, setAddress] = useState('');
    const [items, setItems] =useState([]);
    const [itemsWithKeys, setKeys] = useState([{}]);

    const firebaseConfig = {
        apiKey: "AIzaSyDY7W-6FlUUYffkX7P8hRUS8-KWmLsICkI",
        authDomain: "myplaces-9605e.firebaseapp.com",
        databaseURL: "https://myplaces-9605e-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "myplaces-9605e",
        storageBucket: "myplaces-9605e.appspot.com",
        messagingSenderId: "506079509677",
        appId: "1:506079509677:web:a04bee42f5685073415a24",
        measurementId: "G-HGL4NQKCLL"
    };
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app); 

    useEffect(() =>  {
        const itemsRef= ref(database, 'addresses/') 
        onValue(itemsRef, (snapshot) => {
          const data= snapshot.val();
            setItems(Object.values(data));
            setKeys(data)
        })
    }, []);

    const deleteItem= (item) =>{
        Alert.alert(
            "Do you want to delete the address?",
            "The address will be deleted permanently.",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              {
                text: "OK", 
                onPress: () => {
                  const key = Object.keys(itemsWithKeys).find(key => itemsWithKeys[key] === item);
                  remove(ref(database, `addresses/${key}`)); console.log(key);
                }
              }
            ]
          );
        
        
        
    }

return (
    <SafeAreaProvider>
    
    <Input 
      placeholder='Type address here' 
      label='PLACEFINDER'
      onChangeText={address=> setAddress(address)}
      value={address}/>
    
      
      <Button
      title="Show on map"
    onPress={() => navigation.navigate('Mapscreen', {address: address})}
  />
  <FlatList
      ListHeaderComponent= {<Text >My addresses</Text>}
      keyExtractor={item=> item.toString()}
      data={ items }
      renderItem={({item}) => (
          <ListItem bottomDivider>
            <ListItem.Content>
                <View style={{flexDirection:'row', justifyContent: 'space-between'}}>
              <ListItem.Title
              onLongPress={()=> deleteItem(item)}>{item}</ListItem.Title>
              <ListItem.Subtitle 
              onPress={() => navigation.navigate('Mapscreen', {address: item})}
              >Show on map</ListItem.Subtitle>
              </View>
            </ListItem.Content>
          </ListItem>)
      }
      />
    
  

  </SafeAreaProvider>
);
}
