import React, { useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
 
  KeyboardAvoidingView, 
  Platform,
  ScrollView 
} from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../src/theme/colors"; // Aapka color file path

export default function SetupProfile() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [gender, setGender] = useState<string>(""); // 'male', 'female', 'other'

  const insets=useSafeAreaInsets();
  const handleComplete = () => {
    if (name.length < 3) {
      alert("Please enter your full name");
      return;
    }
    // Yahan API call karke data save karein
    router.replace("/(user)/(tabs)"); // Success ke baad home par bhej dein
  };

  return (
    <View style={[styles.container,{paddingTop:insets.top}]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Complete your profile</Text>
            <Text style={styles.subtitle}>
              Just a few more details to get you started with QuickServe.
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.form}>
            
            {/* Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color={colors.textSecondary} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Rahul Sharma"
                  placeholderTextColor={colors.textLight}
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>

            {/* Gender Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Gender (Optional)</Text>
              <View style={styles.genderRow}>
                {['Male', 'Female', 'Other'].map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={[
                      styles.genderCard,
                      gender === item.toLowerCase() && styles.genderCardActive
                    ]}
                    onPress={() => setGender(item.toLowerCase())}
                  >
                    <Text style={[
                      styles.genderText,
                      gender === item.toLowerCase() && styles.genderTextActive
                    ]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Note about Address */}
            <View style={styles.infoBox}>
              <Ionicons name="location-outline" size={20} color={colors.primary} />
              <Text style={styles.infoText}>
                Aap apna address order karte waqt add kar sakte hain.
              </Text>
            </View>

          </View>
        </ScrollView>

        {/* Footer Button */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.button, name.length < 3 && styles.buttonDisabled]} 
            onPress={handleComplete}
            disabled={name.length < 3}
          >
            <Text style={styles.buttonText}>Finish Setup</Text>
            <Ionicons name="checkmark-circle" size={22} color="#FFF" />
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    marginTop: 40,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  form: {
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: colors.textPrimary,
  },
  genderRow: {
    flexDirection: "row",
    gap: 12,
  },
  genderCard: {
    flex: 1,
    height: 48,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  genderCardActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  genderText: {
    color: colors.textSecondary,
    fontWeight: "500",
  },
  genderTextActive: {
    color: "#FFF",
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: colors.primary + "10", // 10% opacity blue
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    gap: 12,
    marginTop: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.primaryDark,
    lineHeight: 20,
  },
  footer: {
    padding: 24,
    backgroundColor: colors.background,
  },
  button: {
    backgroundColor: colors.primary,
    height: 56,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  buttonDisabled: {
    backgroundColor: colors.textLight,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  },
});