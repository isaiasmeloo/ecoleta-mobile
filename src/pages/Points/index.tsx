import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons'
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const Points = () => {
  const navigation = useNavigation()
  const [location, setLocation] = useState<[number, number]>([0, 0])
  const [items,] = useState([
    {
      id: 1,
      title: 'Baterias',
      image: require('../../assets/baterias.png')
    },
    {
      id: 2,
      title: 'Resíduos Orgânicos',
      image: require('../../assets/organicos_1.png')
    },
    {
      id: 3,
      title: 'Papéis e Papelão',
      image: require('../../assets/papeis-papelao_1.png')
    },
    {
      id: 4,
      title: 'Eletrônicos',
      image: require('../../assets/eletronicos.png')
    },
  ])

  const [selectedItems, setSelectedItems] = useState<number[]>([])

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Opsss...', 'Precisamos da sua permissão')
        return
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords
      // console.warn(location);
      setLocation([latitude, longitude])
    })();
  }, []);

  function goHome() {
    navigation.goBack();
  }

  function goDetail() {
    navigation.navigate('Detail');
  }

  function handleSelectItem(id: number) {
    // console.warn('ID ', id)
    const selected = selectedItems.findIndex(item => item === id)
    // console.warn('selecionado ', selected)

    if (selected >= 0) {
      const filteredItems = selectedItems.filter(item => item !== id)
      // console.warn('FILTERED ', filteredItems)
      setSelectedItems(filteredItems)
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={goHome}>
          <Icon name="arrow-left" size={24} color="#34CB79" />
        </TouchableOpacity>

        <Text style={styles.title}>Bem vindo.</Text>
        <Text style={styles.description}>Encontre no mapa um ponto de coleta.</Text>

        <View style={styles.mapContainer}>
          {
            location[0] !== 0 && (
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: location[0],
                  longitude: location[1],
                  latitudeDelta: 0.014,
                  longitudeDelta: 0.014
                }}
              >
                <Marker
                  coordinate={{
                    latitude: location[0],
                    longitude: location[1],
                  }}
                  onPress={goDetail}
                >
                  <View style={styles.mapMarkerContainer}>
                    <Image
                      style={styles.mapMarkerImage}
                      source={{ uri: 'https://images.unsplash.com/photo-1568502212786-1e1eca7c06f3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=749&q=80' }}
                    />
                    <Text style={styles.mapMarkerTitle}>Coletoria</Text>
                  </View>
                </Marker>

              </MapView>
            )
          }
        </View>

      </View>
      <View style={styles.itemsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 24
          }}>
          {
            items && items.map(item => (
              <TouchableOpacity
                key={String(item.id)}
                style={[
                  styles.item,
                  selectedItems.includes(item.id) ? styles.selectedItem : {}
                ]}
                onPress={() => handleSelectItem(item.id)}
                activeOpacity={0.6}
              >
                <Image style={{ height: 42, width: 42 }} source={item.image} />
                <Text style={styles.itemTitle}>{item.title}</Text>
              </TouchableOpacity>
            ))
          }
        </ScrollView>
      </View>
    </>
  );
}

export default Points;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20 + Constants.statusBarHeight,
  },

  title: {
    fontSize: 20,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 4,
    fontFamily: 'Roboto_400Regular',
  },

  mapContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 16,
  },

  map: {
    width: '100%',
    height: '100%',
  },

  mapMarker: {
    width: 90,
    height: 80,
  },

  mapMarkerContainer: {
    width: 90,
    height: 70,
    backgroundColor: '#34CB79',
    flexDirection: 'column',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center'
  },

  mapMarkerImage: {
    width: 90,
    height: 45,
    resizeMode: 'cover',
  },

  mapMarkerTitle: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    color: '#FFF',
    fontSize: 13,
    lineHeight: 23,
  },

  itemsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 32,
  },

  item: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#eee',
    height: 120,
    width: 120,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'space-between',

    textAlign: 'center',
  },

  selectedItem: {
    borderColor: '#34CB79',
    borderWidth: 2,
  },

  itemTitle: {
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    fontSize: 13,
  },
});
