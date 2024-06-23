import React from 'react';
import { StyleSheet, View } from 'react-native';
import LottieView from 'lottie-react-native';
const LoadingScreen = () => {
    return (
        <View style={styles.container}>
            <View style={styles.animationContainer}>
                <LottieView 
                    source={require('../../assets/animations/load.json')} 
                    autoPlay
                    loop
                    style={styles.animation}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(251, 245, 247)',
    },
    
    animationContainer: {
        width: '80%',
        alignItems: 'center',
    },
    animation: {
        width: '100%',
        aspectRatio: 1,
    },
})

export default LoadingScreen;
