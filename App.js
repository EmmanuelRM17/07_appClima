// App.js
import React from 'react';
import { View, Text, StatusBar, StyleSheet, SafeAreaView } from 'react-native';
import Clima from './components/clima';
import { LinearGradient } from 'expo-linear-gradient';

export default function App() {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#4a84db" />
            <LinearGradient colors={['#4a84db', '#8cb7f7']} style={styles.gradient}>
                <View style={styles.encabezado}>
                    <View style={styles.cloudContainer}>
                        <Text style={styles.titulo}>App clima</Text>
                    </View>
                </View>
            </LinearGradient>
            <Clima />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 0,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingBottom: 20,
    },
    encabezado: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    cloudContainer: {
        backgroundColor: '#6d9be0',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#325589',
        shadowColor: '#BBB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 6,
        elevation: 8,
    },
    titulo: {
        fontSize: 28,
        color: 'black',
        fontWeight: 'bold',
        textShadowColor: 'rgba(255, 255, 255, 0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 10,
    },
});
