import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Svg, Path, Circle } from 'react-native-svg';
import { useTasks } from '../context/TasksContext';

export default function RoadmapScreen() {
  const { undone, done, combined, addTopTask, toggleTaskDone } = useTasks();

  // Tasks are managed in TasksContext (useTasks) which also exposes console helpers

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  // spacing and sizes scale based on screen height
  const ITEM_SPACING = Math.max(120, Math.floor(screenHeight / Math.max(6, combined.length + 2)));
  const containerHeight = Math.max(800, combined.length * ITEM_SPACING + 120);

  // compute segment height and add a small vertical buffer so the path extends past top/bottom
  const segH = ITEM_SPACING;
  const buffer = Math.max(segH * 1.5, 120); // larger buffer to avoid clipping under tab bar
  const svgHeight = containerHeight + buffer;
  const startY = Math.max(20, buffer * 0.5); // start slightly below top of scroll content so the path sits under the header

  // build an S-shaped path that snakes down the center area using pixel coords
  function buildWavyPath(itemCount) {
    const w = screenWidth;
    const steps = Math.max(itemCount + 6, 8);
    let d = `M ${w / 2} ${startY}`;
    for (let i = 0; i < steps; i++) {
      const y = startY + i * segH;
      const isEven = i % 2 === 0;
      const cp1x = isEven ? w * 0.9 : w * 0.1;
      const cp2x = isEven ? w * 0.9 : w * 0.1;
      const nextY = y + segH;
      d += ` C ${cp1x} ${y + segH * 0.25} ${cp2x} ${y + segH * 0.75} ${w / 2} ${nextY}`;
    }
    return d;
  }

  function getDotPositions(itemCount) {
    const w = screenWidth;
    const positions = [];
    for (let i = 0; i < itemCount; i++) {
      const y = startY + (i + 1) * segH; // align roughly with segments
      const isEven = i % 2 === 0;
      const x = isEven ? w * 0.28 : w * 0.72;
      positions.push({ x, y });
    }
    return positions;
  }

  // removed add/toggle helper functions per request

  // add a new incomplete task at the top of the undone list (from TasksContext)
  function addTopTaskLocal() {
    addTopTask();
  }

  return (
    <View style={styles.container}>
      <View style={{ paddingHorizontal: 16 }}>
        <Text style={styles.header}>Roadmap</Text>
      </View>

      <View style={styles.scrollerWrap}>
        <ScrollView contentContainerStyle={[styles.scrollContent, { minHeight: svgHeight }] }>
          <View style={{ width: screenWidth, height: svgHeight, position: 'relative' }}>
            {/* single SVG path drawn first (behind cards) */}
            <View style={{ position: 'absolute', left: 0, top: 0 }} pointerEvents="none">
              <Svg key={`svg-${combined.length}`} width={screenWidth} height={svgHeight} viewBox={`0 0 ${screenWidth} ${svgHeight}`} preserveAspectRatio="none">
                <Path d={buildWavyPath(combined.length)} stroke="#666" strokeWidth={6} fill="none" strokeLinecap="round" />
                {getDotPositions(combined.length).map((p, i) => (
                  <Circle key={`dot-${i}`} cx={p.x} cy={p.y} r={6} fill={combined[i] && combined[i].done ? '#2b8a4b' : '#fff'} stroke="#111" strokeWidth={2} />
                ))}
              </Svg>
            </View>

            {/* render cards absolutely so they sit on curve positions */}
            {combined.map((item, idx) => {
              const positions = getDotPositions(combined.length);
              const p = positions[idx];
              const alignLeft = idx % 2 === 0;
              const CARD_WIDTH = Math.min(340, screenWidth * 0.55);
              const CARD_HEIGHT = 100;
              // position so the card edge overlaps the curve
              const overlap = 28;
              const left = alignLeft
                ? Math.min(Math.max(8, p.x - CARD_WIDTH + overlap), screenWidth - CARD_WIDTH - 8)
                : Math.min(Math.max(8, p.x - overlap), screenWidth - CARD_WIDTH - 8);
              // clamp top within svg area, account for startY offset
              const top = Math.min(svgHeight - CARD_HEIGHT - 8, Math.max(8, p.y - CARD_HEIGHT / 2));

              return (
                <View key={item.id} style={[styles.cardAbsolute, { left, top, width: CARD_WIDTH, zIndex: 2 }]}> 
                  <View style={[styles.card, item.done && styles.cardDone]}>
                    <Text style={[styles.cardTitle, item.done && styles.cardTitleDone]}>{item.title}</Text>
                    {item.desc ? <Text style={styles.cardDesc}>{item.desc}</Text> : null}
                  </View>
                </View>
              );
            })}

              {/* removed duplicate foreground SVG; single scalable SVG behind cards now used */}
          </View>
        </ScrollView>
      </View>

      {/* add modal removed */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0b10', paddingTop: 40 },
  header: { color: '#fff', fontSize: 28, fontWeight: '600', textAlign: 'center', marginBottom: 12 },
  scrollerWrap: { flex: 1, position: 'relative' },
  centerLine: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#303030',
    transform: [{ translateX: -2 }],
    zIndex: 0,
  },
  scrollContent: { paddingBottom: 160, paddingTop: 12 },
  // make each row have consistent vertical spacing
  row: { width: '100%', alignItems: 'center', paddingVertical: 16 },
  side: { width: '45%', minHeight: 60, justifyContent: 'center' },
  centerCell: { width: '10%', alignItems: 'center', justifyContent: 'center' },
  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  cardDone: { backgroundColor: '#e6f3ea' },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#111' },
  cardTitleDone: { color: '#2b8a4b' },
  cardDesc: { marginTop: 6, color: '#333' },
  cardActions: { marginTop: 8, flexDirection: 'row' },
  actionBtn: { paddingHorizontal: 8, paddingVertical: 6, backgroundColor: '#111', borderRadius: 6 },
  actionText: { color: '#fff' },
  dot: { width: 14, height: 14, borderRadius: 14 / 2, backgroundColor: '#fff', borderWidth: 3, borderColor: '#111' },
  dotDone: { backgroundColor: '#2b8a4b', borderColor: '#fff' },
  connectorHorizontal: (left) => ({
    position: 'absolute',
    left: left ? 22 : 22,
    right: left ? undefined : 22,
    height: 2,
    backgroundColor: '#888',
    width: '50%',
    transform: [{ translateX: left ? -10 : 10 }],
  }),
  addGap: { alignItems: 'center', paddingVertical: 8 },
  addGapFull: { position: 'absolute', bottom: -22, left: 0, right: 0, alignItems: 'center', paddingVertical: 8 },
  addText: { color: '#9bd3ff' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '90%', backgroundColor: '#fff', borderRadius: 10, padding: 16 },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 6, padding: 8, marginBottom: 8 },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  hint: { marginTop: 8, color: '#666', fontSize: 12 },
  topAddBtn: { paddingHorizontal: 10, paddingVertical: 6, backgroundColor: '#2b8a4b', borderRadius: 6 },
  topAddBtnText: { color: '#fff', fontWeight: '600' },
});
