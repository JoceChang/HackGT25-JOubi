import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, TextInput, Image } from "react-native";

// Status label mapping
const STATUS_LABELS = {
  not_applied: "Not Applied",
  applied: "Applied",
  interview: "Interview",
  interviewed: "Interviewed",
  offer: "Offer",
  rejected: "Rejected",
};

// Image mapping for each status (from src/components -> ../../assets/images)
const chestImages = {
  not_applied: require("../../assets/images/chest-notApplied.png"),
  applied: require("../../assets/images/chest-Applied.png"),
  interview: require("../../assets/images/chest-Interview.png"),
  interviewed: require("../../assets/images/chest-Interview.png"), // fallback
  offer: require("../../assets/images/chest-Accepted.png"),
  rejected: require("../../assets/images/chest-Rejected.png"),
};

const STATUS_KEYS = ["not_applied", "applied", "interview", "interviewed", "offer", "rejected"];

const JobCard = ({
  company,
  title,
  location,
  deadline,
  description,
  expanded,
  status,
  onPress,
}) => {
  const [jobStatus, setJobStatus] = useState(status || "not_applied");
  const [notes, setNotes] = useState("");

  return (
    <View style={styles.card}>
      {/* Header (image flush with top-right, parallel to text) */}
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.cardHeader, { opacity: pressed ? 0.6 : 1 }]}
      >
        <View style={styles.headerRowTight}>
          {/* LEFT: text block */}
          <View style={styles.headerLeft}>
            <View style={styles.headerTop}>
              <Text style={styles.company}>{company}</Text>
              <Text style={styles.status}>{STATUS_LABELS[jobStatus] || jobStatus}</Text>
            </View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.location}>{location}</Text>
            <Text style={styles.deadline}>Deadline: {deadline}</Text>
          </View>

          {/* RIGHT: status image aligned to top */}
          <Image
            source={chestImages[jobStatus] || chestImages["not_applied"]}
            style={styles.chestImage}
            resizeMode="contain"
          />
        </View>
      </Pressable>

      {/* Expanded content */}
      {expanded && (
        <View style={styles.expandedContainer}>
          {description && <Text style={styles.description}>Description: {description}</Text>}

          <Text style={styles.label}>Change Status:</Text>
          <View style={styles.chipsRow}>
            {STATUS_KEYS.map((key) => {
              const active = key === jobStatus;
              return (
                <Pressable
                  key={key}
                  onPress={() => setJobStatus(key)}
                  style={({ pressed }) => [
                    styles.chip,
                    active && styles.chipActive,
                    pressed && { opacity: 0.75 },
                  ]}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {STATUS_LABELS[key]}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.label}>Notes:</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Add your notes..."
            value={notes}
            onChangeText={setNotes}
            multiline
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 0,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },

  cardHeader: {
    padding: 15,
  },

  // New tight header layout (no gap; image aligned with top)
  headerRowTight: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start", // top-align text and image
    gap: 12,
  },
  headerLeft: {
    flex: 1,
    minWidth: 0,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },

  company: {
    fontWeight: "bold",
    fontSize: 18,
  },
  status: {
    fontStyle: "italic",
    color: "#555",
  },
  title: {
    fontSize: 14,
    marginBottom: 3,
  },
  location: {
    fontSize: 12,
    color: "#777",
  },
  deadline: {
    fontSize: 12,
    color: "#a00",
    marginTop: 4,
  },

  chestImage: {
    width: 56,
    height: 56,
    marginVertical: 0,       // remove vertical margins so it hugs the top
    alignSelf: "flex-start", // stick to top-right
  },

  expandedContainer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  description: {
    marginBottom: 8,
  },
  label: {
    marginTop: 10,
    fontWeight: "bold",
  },

  // Chips (status buttons)
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  chipActive: {
    backgroundColor: "#1e88e5",
    borderColor: "#1e88e5",
  },
  chipText: {
    fontSize: 12,
    color: "#333",
  },
  chipTextActive: {
    color: "#fff",
    fontWeight: "600",
  },

  notesInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
    marginTop: 5,
    minHeight: 50,
    textAlignVertical: "top",
  },
});

export default JobCard;
