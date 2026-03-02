import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';

const SAMPLE_POSTS = [
  { id: '1', author: 'Alice', content: 'Welcome to NetSocial! 👋', likes: 12 },
  { id: '2', author: 'Bob', content: 'Excited to connect with everyone here! 🚀', likes: 8 },
  { id: '3', author: 'Carol', content: 'NetSocial is now available on iOS & Android! 📱', likes: 24 },
];

function Post({ author, content, likes }) {
  return (
    <View style={styles.post}>
      <View style={styles.postHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{author[0]}</Text>
        </View>
        <Text style={styles.author}>{author}</Text>
      </View>
      <Text style={styles.content}>{content}</Text>
      <Text style={styles.likes}>❤️ {likes}</Text>
    </View>
  );
}

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>NetSocial</Text>
      </View>
      <FlatList
        data={SAMPLE_POSTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Post author={item.author} content={item.content} likes={item.likes} />
        )}
        contentContainerStyle={styles.feed}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  header: {
    backgroundColor: '#1877f2',
    paddingTop: 50,
    paddingBottom: 14,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  feed: {
    padding: 12,
  },
  post: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1877f2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  author: {
    fontWeight: '600',
    fontSize: 15,
    color: '#050505',
  },
  content: {
    fontSize: 15,
    color: '#1c1e21',
    lineHeight: 22,
    marginBottom: 8,
  },
  likes: {
    fontSize: 13,
    color: '#65676b',
  },
});
