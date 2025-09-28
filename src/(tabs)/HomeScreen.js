import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import TodoCard from "../components/TodoCard";
import { fetchJobListings, updateJobStatus } from "../api/jobs";
import { useTasks } from "../context/TasksContext";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  // Roadmap tasks come from shared TasksContext
  const { undone, done, combined: roadmapCombined, toggleTaskDone } = useTasks();

  // Job tasks from database
  const [jobTasks, setJobTasks] = useState(fetchJobListings());

  // Internship milestone tracking
  const appliedCount = jobTasks.filter((j) => j.status !== "not_applied").length;
  const [goal, setGoal] = useState(1); // start with 1

  // determine the appropriate goal threshold based on appliedCount
  useEffect(() => {
    const GOAL_LEVELS = [1, 5, 10, 20, 50, 100];
    // find the smallest level that is >= appliedCount (so 5 -> 5, 6 -> 10)
    const next = GOAL_LEVELS.find((lvl) => appliedCount <= lvl) || (Math.ceil((appliedCount + 1) / 10) * 10);
    if (next !== goal) setGoal(next);
  }, [appliedCount, goal]);

  // Handle task click
  const handleTaskPress = (item) => {
    if (item.source === "roadmap") {
      // toggle via shared context so Roadmap and Home stay in sync
      toggleTaskDone(item.id);
    } else if (item.source === "tracker") {
      setJobTasks((prev) =>
        prev.map((t) => {
          if (t.id === item.id) {
            if (t.status === "not_applied") {
              updateJobStatus(item.id, "applied");
              return { ...t, status: "applied", actionRequired: false };
            } else if (t.status === "interview") {
              updateJobStatus(item.id, "interviewed");
              return { ...t, status: "interviewed", actionRequired: false };
            }
          }
          return t;
        })
      );
    }
  };

  // Merge roadmap + job tasks
  // Map roadmap combined (from context) to the shape used in HomeScreen
  const combinedTasks = [
    ...roadmapCombined.map((t, i) => ({
      id: t.id,
      task: t.title,
      desc: t.desc,
      status: t.done ? "done" : "pending",
      source: "roadmap",
      priority: t.priority || i + 1,
    })),
    ...jobTasks.map((j, i) => ({
      id: j.id,
      task: `Apply to ${j.company}`,
      status: j.status,
      source: "tracker",
      actionRequired: j.actionRequired,
      priority: j.priority || i + 10,
    })),
  ];

  // Initial actionable todos (frozen denominator)
  const initialActionable = combinedTasks.filter(
    (t) =>
      (t.source === "roadmap") ||
      (t.source === "tracker" && t.actionRequired)
  );
  // Default to 5 todos on first launch (if there are zero actionable tasks)
  const [initialTotalTodos] = useState(Math.max(initialActionable.length, 5));

  // dynamic todo goal: step through thresholds when completed fills the current goal
  const GOAL_LEVELS = [1, 5, 10, 20, 50, 100];
  const computeInitialTodoGoal = (n) => {
    // default to 5 so first launch shows 0/5
    if (!n || n <= 0) return 5;
    return GOAL_LEVELS.find((lvl) => n <= lvl) || (Math.ceil(n / 10) * 10);
  };
  const [todoGoal, setTodoGoal] = useState(() => computeInitialTodoGoal(initialTotalTodos));
  // Numerator = completed tasks
  const completedTodos = combinedTasks.filter(
    (t) =>
      (t.source === "roadmap" && t.status === "done") ||
      (t.source === "tracker" && !t.actionRequired)
  ).length;

  // only increase todoGoal when completedTodos grows past the current goal; don't shrink
  useEffect(() => {
    const next = GOAL_LEVELS.find((lvl) => completedTodos <= lvl) || (Math.ceil((completedTodos + 1) / 10) * 10);
    if (next > todoGoal) setTodoGoal(next);
  }, [completedTodos, todoGoal]);

  // congratulate when the user reaches the current todoGoal and bump to the next one
  const [lastGoalReached, setLastGoalReached] = useState(null);
  useEffect(() => {
    if (todoGoal && completedTodos >= todoGoal && lastGoalReached !== todoGoal) {
      // show a small popup
      Alert.alert("You did it!", `You've completed ${todoGoal}/${todoGoal} todos!`, [{ text: "Nice" }], { cancelable: true });

      // pick the next goal level
      const nextInLevels = GOAL_LEVELS.find((lvl) => lvl > todoGoal);
      const nextGoal = nextInLevels || (Math.ceil((todoGoal * 2) / 10) * 10);
      setTodoGoal(nextGoal);
      setLastGoalReached(todoGoal);
    }
  }, [completedTodos, todoGoal, lastGoalReached]);

  // Sorted list for rendering (only pending actionable tasks shown)
  const sortedTasks = combinedTasks
    .filter(
      (t) =>
        (t.source === "roadmap" && t.status !== "done") ||
        (t.source === "tracker" && t.actionRequired)
    )
    .sort((a, b) => a.priority - b.priority);

  return (
    <SafeAreaView style={styles.container}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.seasonButton}>
          <Text>Select season</Text>
        </TouchableOpacity>
        <AntDesign name="bars" size={28} color="black" />
      </View>

      {/* Greeting */}
      <Text style={styles.greeting}>Hello!! ____</Text>

      {/* Two progress circles */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={{ marginVertical: 20 }}
      >
        {/* Circle 1: Today's Todos */}
        <View style={{ width, alignItems: "center" }}>
          <AnimatedCircularProgress
            size={180}
            width={12}
            fill={
              (() => {
                // use the current todoGoal (bumped when milestone reached) so the bar resets correctly
                const displayTotal = Math.max(5, todoGoal, completedTodos || 0);
                return displayTotal > 0 ? (completedTodos / displayTotal) * 100 : 0;
              })()
            }
            tintColor="#4CAF50"
            backgroundColor="#e0e0e0"
          >
            {() => {
              // displayTotal grows with todoGoal so the circle steps to the next milestone
              const displayTotal = Math.max(5, todoGoal, completedTodos || 0);
              return (
                <Text style={styles.circleLabel}>
                  {completedTodos}/{displayTotal}
                </Text>
              );
            }}
          </AnimatedCircularProgress>
          <Text style={styles.quote}>Today's Todos</Text>
        </View>

        {/* Circle 2: Internship Milestone */}
        <View style={{ width, alignItems: "center" }}>
          <AnimatedCircularProgress
            size={180}
            width={12}
            fill={(appliedCount / goal) * 100}
            tintColor="#2196F3"
            backgroundColor="#e0e0e0"
          >
            {() => (
              <Text style={styles.circleLabel}>
                {appliedCount}/{goal}
              </Text>
            )}
          </AnimatedCircularProgress>
          <Text style={styles.quote}>Internships Applied</Text>
        </View>
      </ScrollView>

      {/* Task List */}
      <View style={styles.deadlinesHeader}>
        <Text style={styles.deadlinesTitle}>Tasks:</Text>
        <AntDesign name="plus" size={24} color="black" />
      </View>
      <FlatList
        data={sortedTasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TodoCard task={item} onPress={() => handleTaskPress(item)} />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  seasonButton: {
    borderWidth: 1,
    borderColor: "#555",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "#fff",
  },
  greeting: { textAlign: "center", marginTop: 20, fontSize: 18 },
  circleLabel: { fontSize: 20, fontWeight: "bold" },
  quote: { textAlign: "center", marginTop: 10, fontStyle: "italic" },
  deadlinesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 10,
  },
  deadlinesTitle: { fontSize: 20, fontWeight: "bold" },
});