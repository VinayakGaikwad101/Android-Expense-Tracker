import { Text, TextInput, TouchableOpacity, View, Image, ActivityIndicator } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { styles } from "@/assets/styles/auth.styles.js";
import { COLORS } from "@/constants/colors.js";
import { Ionicons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isSignUpLoading, setIsSignUpLoading] = useState(false);
  const [isVerifyLoading, setIsVerifyLoading] = useState(false);

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded || isSignUpLoading) return;

    setIsSignUpLoading(true);
    // Clear previous errors
    setError("");

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true);
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));

      if (err.errors && err.errors.length > 0) {
        const errorCode = err.errors[0].code;

        switch (errorCode) {
          case "form_identifier_exists":
            setError("An account with this email already exists");
            break;
          case "form_password_pwned":
            setError("This password has been found in a data breach. Please choose a different password");
            break;
          case "form_password_length_too_short":
            setError("Password is too short");
            break;
          case "form_password_no_uppercase":
            setError("Password must contain at least one uppercase letter");
            break;
          case "form_password_no_lowercase":
            setError("Password must contain at least one lowercase letter");
            break;
          case "form_password_no_numbers":
            setError("Password must contain at least one number");
            break;
          case "form_identifier_invalid":
            setError("Please enter a valid email address");
            break;
          case "form_param_nil":
            setError("Please fill in all required fields");
            break;
          default:
            setError(err.errors[0].message || "An error occurred during sign up");
        }
      } else {
        setError("An error occurred during sign up. Please try again.");
      }
    } finally {
      setIsSignUpLoading(false);
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded || isVerifyLoading) return;

    setIsVerifyLoading(true);
    // Clear previous errors
    setError("");

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/");
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2));
        setError("Verification incomplete. Please try again.");
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));

      if (err.errors && err.errors.length > 0) {
        const errorCode = err.errors[0].code;

        switch (errorCode) {
          case "form_code_incorrect":
            setError("Incorrect verification code. Please try again");
            break;
          case "verification_expired":
            setError("Verification code has expired. Please request a new one");
            break;
          case "verification_failed":
            setError("Verification failed. Please try again");
            break;
          case "form_param_nil":
            setError("Please enter the verification code");
            break;
          default:
            setError(err.errors[0].message || "An error occurred during verification");
        }
      } else {
        setError("An error occurred during verification. Please try again.");
      }
    } finally {
      setIsVerifyLoading(false);
    }
  };

  if (pendingVerification) {
    return (
      <View style={styles.verificationContainer}>
        <Text style={styles.verificationTitle}>Verify your email</Text>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons
              name="alert-circle"
              size={20}
              color={COLORS.expense}
            ></Ionicons>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError("")}>
              <Ionicons
                name="close"
                size={20}
                color={COLORS.textLight}
              ></Ionicons>
            </TouchableOpacity>
          </View>
        ) : null}

        <TextInput
          style={[styles.verificationInput, error && styles.errorInput]}
          value={code}
          placeholder="Enter your verification code"
          placeholderTextColor={COLORS.textLight}
          onChangeText={(code) => setCode(code)}
        />
        <TouchableOpacity 
          onPress={onVerifyPress} 
          style={[styles.button, isVerifyLoading && styles.buttonLoading]}
          disabled={isVerifyLoading}
        >
          <View style={styles.buttonContent}>
            {isVerifyLoading && (
              <ActivityIndicator size="small" color={COLORS.white} />
            )}
            <Text style={styles.buttonText}>
              {isVerifyLoading ? "Verifying..." : "Verify"}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
    >
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/revenue-i2.png")}
          style={styles.illustration}
        />

        <Text style={styles.title}>Create Account</Text>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError("")}>
              <Ionicons name="close" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        ) : null}

        <TextInput
          style={[styles.input, error && styles.errorInput]}
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter email"
          placeholderTextColor={COLORS.textLight}
          onChangeText={(email) => setEmailAddress(email)}
        />

        <TextInput
          style={[styles.input, error && styles.errorInput]}
          value={password}
          placeholder="Enter password"
          placeholderTextColor={COLORS.textLight}
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />

        <TouchableOpacity 
          onPress={onSignUpPress} 
          style={[styles.button, isSignUpLoading && styles.buttonLoading]}
          disabled={isSignUpLoading}
        >
          <View style={styles.buttonContent}>
            {isSignUpLoading && (
              <ActivityIndicator size="small" color={COLORS.white} />
            )}
            <Text style={styles.buttonText}>
              {isSignUpLoading ? "Creating Account..." : "Create Account"}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.linkText}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
