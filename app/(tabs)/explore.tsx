import { collection, deleteDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Alert, Button, FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../../firebaseConfig";

interface Usuario {
  id: string;
  email: string;
  password: string;
  descripcion: string;
}

export default function UsuariosScreen() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [nuevoEmail, setNuevoEmail] = useState("");
  const [nuevaDescripcion, setNuevaDescripcion] = useState("");

  // Lectura en tiempo real
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "usuarios"), (snapshot) => {
      const data: Usuario[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Usuario[];
      setUsuarios(data);
    });
    return () => unsub();
  }, []);

  const eliminarUsuario = async (id: string) => {
    try {
      await deleteDoc(doc(db, "usuarios", id));
      Alert.alert("Eliminado", "Registro eliminado correctamente");
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  const guardarEdicion = async () => {
    if (!editandoId) return;
    try {
      await updateDoc(doc(db, "usuarios", editandoId), {
        email: nuevoEmail,
        descripcion: nuevaDescripcion,
      });
      setEditandoId(null);
      setNuevoEmail("");
      setNuevaDescripcion("");
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  const renderItem = ({ item, index }: { item: Usuario; index: number }) => {
    const rowColor = index % 2 === 0 ? "#f9f9f9" : "#e6f2ff"; // alterna colores

    if (editandoId === item.id) {
      return (
        <View style={[styles.tableRow, { backgroundColor: rowColor }]}>
          <Text style={styles.cell}>{index + 1}</Text>
          <TextInput
            style={[styles.cell, styles.input]}
            value={nuevoEmail}
            onChangeText={setNuevoEmail}
          />
          <TextInput
            style={[styles.cell, styles.input]}
            value={nuevaDescripcion}
            onChangeText={setNuevaDescripcion}
          />
          <View style={[styles.cell, styles.actions]}>
            <Button title="Guardar" onPress={guardarEdicion} />
            <Button title="Cancelar" onPress={() => setEditandoId(null)} />
          </View>
        </View>
      );
    }

    return (
      <View style={[styles.tableRow, { backgroundColor: rowColor }]}>
        <Text style={styles.cell}>{index + 1}</Text>
        <Text style={[styles.cell, styles.wrapText]}>{item.email}</Text>
        <Text style={[styles.cell, styles.wrapText]}>{item.descripcion}</Text>
        <View style={[styles.cell, styles.actions]}>
          <Button
            title="Editar"
            onPress={() => {
              setEditandoId(item.id);
              setNuevoEmail(item.email);
              setNuevaDescripcion(item.descripcion);
            }}
          />
          <Button title="Eliminar" onPress={() => eliminarUsuario(item.id)} />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Cabecera */}
      <View style={styles.tableHeader}>
        <Text style={styles.headerCellN}>#</Text>
        <Text style={styles.headerCell}>Email</Text>
        <Text style={styles.headerCell}>Descripción</Text>
        <Text style={styles.headerCellActions}>Acciones</Text>
      </View>

      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingTop: 10, // espacio adicional para barra de notificaciones
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: "#999",
    paddingBottom: 5,
    marginBottom: 5,
    backgroundColor: "#d9e6f2",
  },
  headerCell: {
    flex: 3,
    fontWeight: "bold",
  },
  headerCellN: {
    flex: 1,
    fontWeight: "bold",
  },
  headerCellActions: {
    flex: 2,
    fontWeight: "bold",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
    paddingVertical: 10,
    alignItems: "flex-start",
  },
  cell: {
    flex: 3,
    paddingRight: 5,
  },
  wrapText: {
    flexWrap: "wrap",
  },
  actions: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 3,
    borderRadius: 4,
  },
});
