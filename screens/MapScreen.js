// screens/MapScreen.js

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Linking, Platform, Alert } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Clipboard from 'expo-clipboard';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { COLORS } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';

const MapScreen = () => {
  const [initialRegion, setInitialRegion] = useState(null);
  const [ecopontos, setEcopontos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const setupMap = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('A permissão para acessar a localização foi negada.');
          setLoading(false);
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const userRegion = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };
        setInitialRegion(userRegion);

        const ecopontosCollection = collection(db, 'ecopontos');
        const ecopontosSnapshot = await getDocs(ecopontosCollection);
        const ecopontosList = ecopontosSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setEcopontos(ecopontosList);

      } catch (error) {
        console.error("Erro ao configurar o mapa: ", error);
        setErrorMsg('Não foi possível carregar o mapa. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    setupMap();
  }, []);

  const centerMapOnUser = () => {
    if (mapRef.current && initialRegion) {
      mapRef.current.animateToRegion(initialRegion, 1000);
    }
  };

  const handleCalloutPress = (ecoponto) => {
    Alert.alert(
      ecoponto.name,
      ecoponto.address,
      [
        {
          text: 'Navegar até o local',
          onPress: () => {
            const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
            const latLng = `${ecoponto.location.latitude},${ecoponto.location.longitude}`;
            const url = Platform.select({
              ios: `${scheme}${ecoponto.name}@${latLng}`,
              android: `${scheme}${latLng}(${ecoponto.name})`
            });
            Linking.openURL(url);
          },
        },
        {
          text: 'Copiar Endereço',
          onPress: async () => {
            await Clipboard.setStringAsync(ecoponto.address);
            Alert.alert("Endereço copiado!", "O endereço do ecoponto foi copiado para sua área de transferência.");
          },
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ]
    );
  };

  if (loading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
  }
  if (errorMsg) {
    return <View style={styles.centered}><Text>{errorMsg}</Text></View>;
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
      >
        {ecopontos.map(ecoponto => (
          <Marker
            key={ecoponto.id}
            coordinate={{
              latitude: ecoponto.location.latitude,
              longitude: ecoponto.location.longitude,
            }}
            pinColor={COLORS.primary}
          >
            <Callout 
              tooltip 
              onPress={() => handleCalloutPress(ecoponto)}
            >
              <View style={styles.calloutView}>
                <Text style={styles.calloutTitle}>{ecoponto.name}</Text>
                <Text style={styles.calloutDescription}>{ecoponto.address}</Text>
                <Text style={styles.calloutHint}>Toque para ver as opções</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <TouchableOpacity
        style={styles.centerButton}
        onPress={centerMapOnUser}
      >
        <Ionicons name="locate" size={24} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  centerButton: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    backgroundColor: 'white',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
  calloutView: {
    width: 250,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    alignItems: 'center',
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  calloutDescription: {
    fontSize: 14,
    textAlign: 'center',
  },
  calloutHint: {
    fontSize: 12,
    color: 'grey',
    textAlign: 'center',
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
    marginTop: 10,
  },
});

export default MapScreen;