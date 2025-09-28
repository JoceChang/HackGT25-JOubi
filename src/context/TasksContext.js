// can you make it so that the tasks that appear on the homescreen with the source (roadmap) are the tasks that are listed in roadmap, ignore the preset testing sample tasks thats there now

import React, { createContext, useContext, useState, useEffect } from 'react';

const TasksContext = createContext(null);

// Start with empty lists by default so preset testing tasks are not shown
const SAMPLE = [];

// Starter roadmap tasks to add on first run
const STARTUP_TASKS = [
  { title: 'Find 5 new jobs to apply to', desc: 'Search job boards and company pages and add targets', done: false },
  { title: 'Check your LinkedIn is up to date', desc: 'Update headline, experience, and projects', done: false },
  { title: 'Have someone review your resume', desc: 'Ask a mentor or career services to review and give feedback', done: false },
];

export function TasksProvider({ children }) {
  const [undone, setUndone] = useState(() => []);
  const [done, setDone] = useState(() => []);

  // combined view for consumers
  const combined = [...undone, ...done];

  // Add single task; if atIndex provided, insert relative to combined
  const addTask = (title, desc = '', doneFlag = false, atIndex = null) => {
    if (!title) return null;
    const item = { id: Date.now().toString() + Math.random(), title: String(title), desc: String(desc || ''), done: !!doneFlag };

    if (atIndex === null || atIndex === undefined) {
      if (item.done) setDone((prev) => [...prev, item]);
      else setUndone((prev) => [...prev, item]);
      return item;
    }

    if (atIndex <= undone.length) {
      setUndone((prev) => {
        const copy = [...prev];
        copy.splice(atIndex, 0, item);
        return copy;
      });
    } else {
      setDone((prev) => {
        const copy = [...prev];
        copy.splice(atIndex - undone.length, 0, { ...item, done: true });
        return copy;
      });
    }
    return item;
  };

  const addTasks = (items = [], atIndex = null) => {
    if (!Array.isArray(items) || items.length === 0) return;
    if (atIndex === null || atIndex === undefined) {
      const undoneItems = items.filter((i) => !i.done).map((i) => ({ id: Date.now().toString() + Math.random(), title: i.title, desc: i.desc || '', done: false }));
      const doneItems = items.filter((i) => i.done).map((i) => ({ id: Date.now().toString() + Math.random(), title: i.title, desc: i.desc || '', done: true }));
      if (undoneItems.length) setUndone((prev) => [...prev, ...undoneItems]);
      if (doneItems.length) setDone((prev) => [...prev, ...doneItems]);
      return;
    }

    let index = atIndex;
    items.forEach((i) => {
      addTask(i.title, i.desc || '', !!i.done, index);
      index += 1;
    });
  };

  const addTopTask = (title = 'New task (incomplete)', desc = 'Created from header button') => {
    const item = { id: Date.now().toString(), title, desc, done: false };
    setUndone((prev) => [item, ...prev]);
    return item;
  };

  const toggleTaskDone = (id) => {
    // move between lists
    const inUndone = undone.find((t) => t.id === id);
    if (inUndone) {
      setUndone((prev) => prev.filter((t) => t.id !== id));
      setDone((prev) => [{ ...inUndone, done: true }, ...prev]);
      return;
    }
    const inDone = done.find((t) => t.id === id);
    if (inDone) {
      setDone((prev) => prev.filter((t) => t.id !== id));
      setUndone((prev) => [{ ...inDone, done: false }, ...prev]);
    }
  };

  // expose console helpers for quick dev-time additions
  useEffect(() => {
    globalThis.addTask = addTask;
    globalThis.addTasks = addTasks;
    return () => {
      try {
        delete globalThis.addTask;
        delete globalThis.addTasks;
      } catch (e) {
        globalThis.addTask = undefined;
        globalThis.addTasks = undefined;
      }
    };
  }, [undone.length, done.length]);

  // Seed default roadmap tasks on first mount if context is empty
  useEffect(() => {
    if ((undone.length + done.length) === 0) {
      // addTasks will append them to undone
      addTasks(STARTUP_TASKS);
    }
    // run only once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <TasksContext.Provider value={{ undone, done, combined, addTask, addTasks, addTopTask, toggleTaskDone }}>
      {children}
    </TasksContext.Provider>
  );
}

export const useTasks = () => useContext(TasksContext);

export default TasksContext;
