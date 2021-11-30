import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, TextInput, FlatList } from 'react-native';
import { Header, Input, Button, Icon, ListItem } from'react-native-elements';
import MapView, { Marker} from'react-native-maps';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import{ initializeApp} from 'firebase/app';
import{ getDatabase, push, ref, set, onValue}  from"firebase/database";

export default function MapScreen({route}) {

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

    const saveItem= (address) =>{
        push(ref(database, 'addresses/'), address);
    }
  
    const {address} = route.params;
    const [region, setRegion] = useState(
        {
          latitude:60.200692,
          longitude:24.934302,
          latitudeDelta:0.0322,
          longitudeDelta:0.0221,
        }
      );
    const [coordinate, setCoordinate] = useState(
        {
          latitude:60.200692,
          longitude: 24.934302
        }
    );
    useEffect(() => {
        getCoordinates(address)
      }, []);
    

    const getCoordinates = address => {
        fetch(`http://www.mapquestapi.com/geocoding/v1/address?key=KZm8i8wxroMvRbCHHiSfnrJzWshuzTma&location=${address}`)
        .then(response=>  response.json())
        .then(responseJson=>{ 
          console.log(address)
          setCoordinate(
            {
              latitude: responseJson.results[0].locations[0].displayLatLng.lat,
              longitude: responseJson.results[0].locations[0].displayLatLng.lng
            }
          )
          setRegion(
            {
              latitude: responseJson.results[0].locations[0].displayLatLng.lat,
              longitude: responseJson.results[0].locations[0].displayLatLng.lng,
              latitudeDelta:0.0322,
              longitudeDelta:0.0221,
            }
          )
        })
        .catch(error=> { Alert.alert('Error',error); });
      }
    return(
        <SafeAreaProvider>
            <MapView
            style={styles.map}
            region={region}
            >
                <Marker coordinate={region}/>
            </MapView>
            <Button
            title="Save address"
            onPress={() => saveItem(address)}
  />
        </SafeAreaProvider>
    )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    map: {
      flex:1,
      width: "100%",
      height: "100%"
    }
  
    
  });
  