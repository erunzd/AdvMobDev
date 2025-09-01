import React, { useState } from "react";
import { StyleSheet, Text, View, Image, ScrollView, Button } from "react-native";

export default function CharacterInfoScreen() {
  const images = [
    "https://static.wikia.nocookie.net/wutheringwaves/images/1/1b/Male_Rover_1.jpg/revision/latest/scale-to-width-down/1000?cb=20240419041104",
    "https://static.wikia.nocookie.net/wutheringwaves/images/a/a1/Female_Rover_1.jpg/revision/latest/scale-to-width-down/1000?cb=20240419041112",
  ];

  const [toggle, setToggle] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: toggle ? images[1] : images[0] }}
        style={styles.characterImage}
        resizeMode="cover"
      />

      <View style={styles.headerRow}>
        <Text style={styles.name}>Rover</Text>
        <Button title="Switch" onPress={() => setToggle(!toggle)} />
      </View>

      <Image
        source={{
          uri: "https://static.wikia.nocookie.net/wutheringwaves/images/2/2b/Icon_5_Stars.png/revision/latest/scale-to-width-down/115?cb=20240429134545",
        }}
        style={styles.rarity}
        resizeMode="contain"
      />

      <View style={styles.quoteBox}>
        <Text style={styles.quote}>
          "We still have a long journey ahead of us. Let's press on."
        </Text>
        <Text style={styles.quoteAuthor}>- Rover</Text>
      </View>

      <Text style={styles.sectionTitle}>Bio</Text>
      <Text style={styles.info}>
        Rover is a multi-attribute <Text style={styles.link}>Resonator</Text> and
        is the main protagonist of{" "}
        <Text style={styles.link}>Wuthering Waves</Text>.
      </Text>
      <Text style={styles.info}>
        Awakened with an unknown past, Rover is an{" "}
        <Text style={styles.link}>Arbiter</Text> who embarks on a journey to
        uncover the truth to regain their lost memories. As secrets are unveiled,
        they establish deeper connections with the world.
      </Text>

      <Text style={styles.sectionTitle}>Attributes</Text>
      <View style={styles.infoCard}>
        <InfoRow label="Weapon" value="Sword" />
        <InfoRow label="Combat Roles" value="Main Damage Dealer, Support, Healer" />
        <InfoRow label="Concerto Efficiency" value="Stagnation, Spectro Frazzle" />
        <InfoRow label="Resonance Skill Damage" value="Aero Erosion" />
      </View>

      <Text style={styles.sectionTitle}>Details</Text>
      <View style={styles.infoCard}>
        <InfoRow label="Voice Actors" value="Player's Choice" />
        <InfoRow label="Birthplace" value="Unknown" />
        <InfoRow label="Nation" value="Unknown" />
        <InfoRow label="Affiliation" value="Black Shores" />
        <InfoRow label="Release Date" value="May 23, 2024 (1 year, 3 months ago)" />
      </View>

      <Text style={styles.sectionTitle}>Additional Titles</Text>
      <View style={styles.infoCard}>
        <InfoRow label="Titles" value="Arbiter, Astral Modulator" />
      </View>
    </ScrollView>
  );
}

const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 16,
  },
  characterImage: {
    width: "100%",
    height: 240,
    backgroundColor: "#999",
    borderRadius: 12,
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#222",
  },
  rarity: {
    width: 140,
    height: 35,
    marginBottom: 16,
  },
  quoteBox: {
    backgroundColor: "#2563eb",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  quote: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  quoteAuthor: {
    color: "#e5e5e5",
    fontSize: 14,
    textAlign: "right",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    color: "#111",
  },
  info: {
    fontSize: 14,
    color: "#333",
    marginBottom: 12,
    lineHeight: 20,
  },
  link: {
    color: "#2563eb",
    fontWeight: "600",
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
  },
  infoValue: {
    fontSize: 14,
    color: "#222",
    flexShrink: 1,
    textAlign: "right",
    marginLeft: 10,
  },
});

