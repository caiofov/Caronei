import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native"
import React, { useState } from "react"
import MapView, { Marker } from "react-native-maps"
import paradas from "../paradas/paradas.json"
import tw from "twrnc"
import NavOptions from "../components/NavOptions"
import { useDispatch } from "react-redux"
import { useNavigation } from "@react-navigation/native"
import { logoutAuth } from "../slices/userAuth"
import config from "../config/config.json"
import { store } from "../store"

export default function HomeScreen() {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const [name, setName] = useState(null)

  function exitAccount() {
    dispatch(logoutAuth())
    navigation.navigate("LogInScreen")
  }
  async function getUserName() {
    //gambiarra porque as portas não estavam batendo
    let original_port = config.urlRootNode.split(":")[2]
    let url = config.urlRootNode.replace(original_port, config.backend_port)

    let reqs = await fetch(
      url + "/username/" + store.getState().auth.matricula,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
    const response = await reqs.json()
    setName(response)
  }
  getUserName()

  return (
    <View>
      <View
        style={{
          justifyContent: "space-around",
          height: "20%",
          flexDirection: "row",
          padding: 10,
          backgroundColor: "#EFE9E5",
        }}
      >
        <View
          style={{
            width: "50%",
            paddingTop: 40,
          }}
        >
          <Text>Olá, {name}</Text>
          <TouchableOpacity style={{}} onPress={exitAccount}>
            <Text style={{}}>Sair</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{}}
            onPress={() => navigation.navigate("ProfileScreen")}
          >
            <Text style={{}}>Perfil</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: "50%",
            paddingTop: 30,
            paddingLeft: 50,
          }}
        >
          <Image
            style={{
              width: 140,
              height: 100,
            }}
            source={require("../images/logo.png")}
          />
        </View>
      </View>
      <View style={tw`h-40%`}>
        <MapView
          style={styles.mapStyle}
          region={{
            latitude: -3.742522,
            longitude: -38.574836,
            latitudeDelta: 0.013,
            longitudeDelta: 0.013,
          }}
        >
          {paradas.map((marker, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: marker.lat,
                longitude: marker.lng,
              }}
              title={marker.nome}
            />
          ))}
        </MapView>
      </View>
      <View
        style={{
          height: "40%",
          backgroundColor: "#EFE9E5",
        }}
      >
        <NavOptions />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  mapStyle: {
    width: Dimensions.get("window").width,
    height: "100%",
  },
})
