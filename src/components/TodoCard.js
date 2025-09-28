import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const TodoCard = ({ task, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.text}>{task.task}</Text>
      <Text style={styles.subtext}>
        Priority: {task.priority} | Source: {task.source} | Status: {task.status}
      </Text>
    </TouchableOpacity>
  );
};

export default TodoCard;

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
  },
  subtext: {
    fontSize: 12,
    color: "#555",
    marginTop: 5,
  },
});
