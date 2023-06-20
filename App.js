import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  RefreshControl,
  AppRegistry,
} from "react-native";
import { DATABASE_URL } from "./d1loop-config.json";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
//import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
//in future updates, hopefully. I need sometime learning this package.
import {
  Button,
  Avatar,
  TextInput,
  PaperProvider,
  MD3DarkTheme as Theme,
  Text,
  Portal,
  Dialog,
  FAB,
  ActivityIndicator,
  Divider,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1d1b1e",
    paddingTop: Constants.statusBarHeight,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  badge: {
    position: "absolute",
    top: -3,
    right: 255,
  },
  systemMessage: {
    color: "#fff",
    marginBottom: 20,
  },
  postContainer: {
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  username: {
    marginLeft: -1,
    fontWeight: "bold",
  },
  postContent: {
    marginBottom: 8,
  },
  bottomSheetContent: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
  },
  likes: {
    marginLeft: 4,
  },
  divider: {
    height: 1,
  },
  postContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    marginTop: 14,
  },
  avatar: {
    marginRight: 10,
  },
  postText: {
    color: "#e7e1e5",
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#1d1b1e",
    alignItems: "center",
  },
});

const theme = {
  ...Theme,
  dark: true,
  colors: {
    primary: "rgb(150, 204, 255)",
    onPrimary: "rgb(0, 51, 83)",
    primaryContainer: "rgb(0, 74, 117)",
    onPrimaryContainer: "rgb(206, 229, 255)",
    secondary: "rgb(185, 200, 218)",
    onSecondary: "rgb(35, 50, 64)",
    secondaryContainer: "rgb(58, 72, 87)",
    onSecondaryContainer: "rgb(213, 228, 247)",
    tertiary: "rgb(165, 200, 255)",
    onTertiary: "rgb(0, 49, 95)",
    tertiaryContainer: "rgb(0, 71, 134)",
    onTertiaryContainer: "rgb(212, 227, 255)",
    error: "rgb(255, 180, 171)",
    onError: "rgb(105, 0, 5)",
    errorContainer: "rgb(147, 0, 10)",
    onErrorContainer: "rgb(255, 180, 171)",
    background: "rgb(26, 28, 30)",
    onBackground: "rgb(226, 226, 229)",
    surface: "rgb(26, 28, 30)",
    onSurface: "rgb(226, 226, 229)",
    surfaceVariant: "rgb(66, 71, 78)",
    onSurfaceVariant: "rgb(194, 199, 207)",
    outline: "rgb(140, 145, 152)",
    outlineVariant: "rgb(66, 71, 78)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(226, 226, 229)",
    inverseOnSurface: "rgb(47, 48, 51)",
    inversePrimary: "rgb(0, 99, 154)",
    elevation: {
      level0: "transparent",
      level1: "rgb(32, 37, 41)",
      level2: "rgb(36, 42, 48)",
      level3: "rgb(40, 47, 55)",
      level4: "rgb(41, 49, 57)",
      level5: "rgb(43, 53, 62)",
    },
    surfaceDisabled: "rgba(226, 226, 229, 0.12)",
    onSurfaceDisabled: "rgba(226, 226, 229, 0.38)",
    backdrop: "rgba(44, 49, 55, 0.4)",
  },
};

export default function App() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [systemMessage, setSystemMessage] = useState("");
  const [posts, setPosts] = useState([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [ProfileDialogVisible, setProfileDialogVisible] = useState(false);
  const [DefaultProfileDialogVisible, setDeafultProfileDialogVisible] =
    useState(false);
  const [newPostText, setNewPostText] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const dismissDialog = () => {
    setProfileDialogVisible(false);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPosts();
    setRefreshing(false);
  };

  const dismissDeafultDialog = () => {
    setDeafultProfileDialogVisible(false);
  };

  const fetchPosts = async () => {
    setLoading(true);
    fetch(`${DATABASE_URL}/posts`)
      .then((response) => response.json())
      .then((data) => {
        setSystemMessage(data.systemMessage);
        setPosts(data.posts);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
        setLoading(false);
      });
  };

  const newPostCreate = (post, token) => {
    setLoading(true);
    const url = `${DATABASE_URL}/create-post?token=${token}&post=${encodeURIComponent(
      post
    )}`;
    fetch(url, {
      method: "POST",
    })
      .then((response) => {
        if (response.ok) {
          //
          setLoading(false);
          fetchPosts();
        } else {
          setLoading(false);
          throw new Error("Post creation failed");
        }
      })
      .then((data) => {
        //
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const generateToken = async () => {
    setLoading(true);
    fetch(`${DATABASE_URL}/generate-token`)
      .then((response) => response.json())
      .then((data) => {
        const apiToken = data.token;
        AsyncStorage.setItem("token", apiToken);
        setToken(apiToken);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching token:", error);
        setLoading(false);
      });
  };

  const removeToken = async () => {
    try {
      await AsyncStorage.removeItem("token");
      setToken(null);
    } catch (error) {
      console.error("Error removing token:", error);
    }
  };

  const handlePostCreation = (post) => {
    if (post.trim() === "") {
      // Post is empty or contains only whitespace
      return;
    }
    newPostCreate(post, token);
    setDialogVisible(false);
    setNewPostText("");
  };

  const handlePost = () => {
    handlePostCreation(newPostText);
  };

  useEffect(() => {
    const checkToken = async () => {
      const localToken = await AsyncStorage.getItem("token");

      if (localToken) {
        setToken(localToken);
        fetchPosts();
      } else {
        setToken(null);
      }
      setLoading(false);
    };
    checkToken();
  }, []);

  const renderEndOfFeed = () => {
    return (
      <Text style={{ textAlign: "center", marginTop: 15 }}>
        This is the end of the current d1loop feed.
      </Text>
    );
  };

  const renderPost = (post, index) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => setDeafultProfileDialogVisible(true)}
      >
        <View style={styles.postContainer}>
          <View style={[styles.header, { alignItems: "flex-start" }]}>
            <Avatar.Icon icon="account" style={styles.avatar} size={40} />
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => setDeafultProfileDialogVisible(true)}
            >
              <Text style={styles.username}>@d1loop-user</Text>
              <Text style={styles.postContent} variant="titleLarge">
                {post || "Loading..."}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <Divider style={styles.divider} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            animating={true}
            color={"lightblue"}
            size="large"
          />
        </View>
      ) : token ? (
        <PaperProvider theme={theme}>
          <View style={styles.container}>
            <View style={styles.content}>
              <ScrollView
                overScrollMode="never"
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                  />
                }
              >
                <TouchableOpacity onPress={() => setProfileDialogVisible(true)}>
                  <View style={styles.postContainer}>
                    <View style={[styles.header, { alignItems: "flex-start" }]}>
                      <Avatar.Image
                        source={require("./assets/d1loop.png")}
                        icon="account"
                        style={styles.avatar}
                        size={40}
                        onPress={() => setProfileDialogVisible(true)}
                      />
                      <TouchableOpacity
                        style={{ flex: 1 }}
                        onPress={() => setProfileDialogVisible(true)}
                      >
                        <Text style={styles.username}>@d1loop</Text>
                        <MaterialIcons
                          name="verified"
                          style={styles.badge}
                          color="gold"
                          size={22}
                        />
                        <Text style={styles.postContent} variant="titleLarge">
                          {systemMessage || "Loading..."}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Divider style={styles.divider} />
                </TouchableOpacity>

                {posts.reverse().map((post, index) => renderPost(post, index))}
                {posts != [] && renderEndOfFeed()}
              </ScrollView>
              <FAB
                icon="pencil"
                style={styles.fab}
                onPress={() => setDialogVisible(true)}
              />
              <Portal>
                <Dialog
                  visible={dialogVisible}
                  onDismiss={() => setDialogVisible(false)}
                >
                  <Dialog.Title>Create a New Post</Dialog.Title>
                  <Dialog.Content>
                    <TextInput
                      label="Post Content"
                      value={newPostText}
                      onChangeText={(text) => setNewPostText(text)}
                    />
                  </Dialog.Content>
                  <Dialog.Actions>
                    <Button onPress={() => setDialogVisible(false)}>
                      Cancel
                    </Button>
                    <Button onPress={handlePost}>Create</Button>
                  </Dialog.Actions>
                </Dialog>
              </Portal>
              <Portal>
                <Dialog
                  visible={ProfileDialogVisible}
                  onDismiss={dismissDialog}
                >
                  <Dialog.Title>
                    Verified User{" "}
                    <MaterialIcons name="verified" color="gold" size={22} />
                  </Dialog.Title>
                  <Dialog.Content>
                    <Text>This is the official account of d1loop.</Text>
                  </Dialog.Content>
                  <Dialog.Actions>
                    <Button onPress={dismissDialog}>Close</Button>
                  </Dialog.Actions>
                </Dialog>
              </Portal>
              <Portal>
                <Dialog
                  visible={DefaultProfileDialogVisible}
                  onDismiss={dismissDeafultDialog}
                >
                  <Dialog.Title>Anonymous Account </Dialog.Title>
                  <Dialog.Content>
                    <Text>This is a normal user on d1loop.</Text>
                  </Dialog.Content>
                  <Dialog.Actions>
                    <Button onPress={dismissDeafultDialog}>Close</Button>
                  </Dialog.Actions>
                </Dialog>
              </Portal>
            </View>
          </View>
        </PaperProvider>
      ) : (
        <PaperProvider theme={theme}>
          <View style={styles.container}>
            <View style={styles.content}>
              <Text variant="displaySmall">Welcome to d1loop</Text>
              <Button
                icon="arrow-left"
                mode="contained-tonal"
                onPress={generateToken}
              >
                Get started
              </Button>
            </View>
            <View>
              <Text style={{ textAlign: "left", marginLeft: 15 }}>
                By getting started, you are generating a personal token. Read
                more about it in the Github repository or in the docs. {"\n"}
              </Text>
            </View>
          </View>
        </PaperProvider>
      )}
    </SafeAreaView>
  );
}

AppRegistry.registerComponent("d1loop", () => App);
