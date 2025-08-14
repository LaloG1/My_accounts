import { MaterialIcons } from "@expo/vector-icons";
import { collection, deleteDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../firebaseConfig";

interface Usuario {
  id: string;
  email: string;
  password: string;
  descripcion: string;
}

export default function UsuariosScreen() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [nuevoEmail, setNuevoEmail] = useState("");
  const [nuevaDescripcion, setNuevaDescripcion] = useState("");
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [vistaUsuario, setVistaUsuario] = useState<Usuario | null>(null);

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
      Alert.alert("Éxito", "Registro eliminado correctamente");
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  const abrirModalEdicion = (usuario: Usuario) => {
    setEditandoId(usuario.id);
    setNuevoEmail(usuario.email);
    setNuevaDescripcion(usuario.descripcion);
    setNuevaPassword(usuario.password);
    setModalVisible(true);
  };

  const guardarEdicion = async () => {
  if (!editandoId) return;

  // Validación básica
  if (!nuevoEmail.trim() || !nuevaPassword.trim()) {
    Alert.alert("Error", "Email y contraseña no pueden estar vacíos");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(nuevoEmail)) {
    Alert.alert("Error", "Ingresa un correo electrónico válido");
    return;
  }

  if (nuevaPassword.length < 6) {
    Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
    return;
  }

  try {
    

    // 2️⃣ Actualizamos el documento en Firestore
    await updateDoc(doc(db, "usuarios", editandoId), {
      email: nuevoEmail,
      password: nuevaPassword,
      descripcion: nuevaDescripcion,
    });

    // Limpiamos estados y cerramos modal
    setModalVisible(false);
    setEditandoId(null);
    setNuevoEmail("");
    setNuevaDescripcion("");
    setNuevaPassword("");

    Alert.alert("Éxito", "Registro actualizado correctamente");
  } catch (e: any) {
    Alert.alert("Error", e.message);
  }
};


  const abrirVistaUsuario = (usuario: Usuario) => {
    setVistaUsuario(usuario);
    setModalVisible(true);
  };

  const cerrarVistaUsuario = () => {
    setVistaUsuario(null);
    setModalVisible(false);
  };

  const renderItem = ({ item, index }: { item: Usuario; index: number }) => {
  const rowColor = index % 2 === 0 ? "#f9f9f9" : "#e6f2ff";

  return (
    <TouchableOpacity onPress={() => abrirVistaUsuario(item)}>
      <View style={[styles.tableRow, { backgroundColor: rowColor }]}>
        <Text style={[styles.cell, { flex: 1 }]}>{index + 1}</Text>
        <Text style={[styles.cell, styles.wrapText, { flex: 4 }]} numberOfLines={1}>
          {item.descripcion}
        </Text>
        <View style={[styles.cell, styles.actions, { flex: 2 }]}>
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation(); // evita que se abra el modal de vista rápida
              abrirModalEdicion(item);
            }}
            style={styles.iconButton}
          >
            <MaterialIcons name="edit" size={24} color="#007bff" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              eliminarUsuario(item.id);
            }}
            style={styles.iconButton}
          >
            <MaterialIcons name="delete" size={24} color="#ff3b30" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};


  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { paddingTop: Platform.OS === "android" ? StatusBar.currentHeight! + 10 : 10 },
      ]}
    >
      <View style={styles.tableHeader}>
        <Text style={[styles.headerCell, { flex: 1 }]}>#</Text>
        <Text style={[styles.headerCell, { flex: 4 }]}>Descripcion</Text>
        <Text style={[styles.headerCell, { flex: 2, textAlign: "center" }]}>Acciones</Text>
      </View>

      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />

      {/* Modal edición */}
      {editandoId && (
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Editar Usuario</Text>
              <TextInput
                style={styles.inputModal}
                value={nuevoEmail}
                onChangeText={setNuevoEmail}
                placeholder="Email"
              />
              <TextInput
                style={styles.inputModal}
                value={nuevaPassword}
                onChangeText={setNuevaPassword}
                placeholder="Contraseña"
              />
              <TextInput
                style={styles.inputModal}
                value={nuevaDescripcion}
                onChangeText={setNuevaDescripcion}
                placeholder="Descripción"
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity onPress={guardarEdicion} style={styles.modalButtonSave}>
                  <Text style={{ color: "#fff" }}>Guardar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.modalButtonCancel}
                >
                  <Text style={{ color: "#fff" }}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Modal vista rápida */}
{vistaUsuario && (
  <Modal visible={modalVisible} transparent animationType="slide">
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Detalles del Usuario</Text>

        <Text style={{ marginBottom: 5 }}>
          <Text style={{ color: "green", fontWeight: "bold" }}>Email: </Text>
          <Text style={{ color: "#000" }}>{vistaUsuario.email}</Text>
        </Text>

        <Text style={{ marginBottom: 5 }}>
          <Text style={{ color: "green", fontWeight: "bold" }}>Contraseña: </Text>
          <Text style={{ color: "#000" }}>{vistaUsuario.password}</Text>
        </Text>

        <Text style={{ marginBottom: 5 }}>
          <Text style={{ color: "green", fontWeight: "bold" }}>Descripción: </Text>
          <Text style={{ color: "#000" }}>{vistaUsuario.descripcion}</Text>
        </Text>

        <TouchableOpacity onPress={cerrarVistaUsuario} style={styles.modalButtonClose}>
          <Text style={{ color: "#fff" }}>Cerrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
)}



    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: "#999",
    paddingBottom: 3,
    marginBottom: 3,
    backgroundColor: "#d9e6f2",
  },
  headerCell: {
    fontWeight: "bold",
    paddingHorizontal: 0,
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
    paddingVertical: 5,
    alignItems: "flex-start",
  },
  cell: {
    paddingHorizontal: 0,
    textAlign: "center",
  },
  wrapText: {
    flexWrap: "wrap",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  iconButton: {
    marginRight: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  inputModal: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 5,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  modalButtonSave: {
    backgroundColor: "#007bff",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 5,
  },
  modalButtonCancel: {
    backgroundColor: "#ff3b30",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 5,
  },
   modalButtonClose: { 
    marginTop: 10, 
    backgroundColor: "#007bff", 
    paddingVertical: 10, 
    borderRadius: 5, 
    alignItems: "center" },
});
