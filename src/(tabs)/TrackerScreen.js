import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet } from "react-native";
import JobCard from "../components/JobCard";
import { fetchJobListings } from "../api/jobs";

export default function TrackerScreen() {
  const [jobs, setJobs] = useState([]);
  const [expandedJobId, setExpandedJobId] = useState(null);

  useEffect(() => {
    const listings = fetchJobListings();
    setJobs(listings);
  }, []);

  const handlePress = (id) => {
    setExpandedJobId(expandedJobId === id ? null : id);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          company={job.company}
          title={job.title}
          location={job.location}
          status={job.status}
          deadline={job.deadline}
          description={job.description}
          expanded={expandedJobId === job.id}
          onPress={() => handlePress(job.id)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
});
