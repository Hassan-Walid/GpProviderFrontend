import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

const PayPal = ({ navigation, route }) => {
  const [paidFor, setPaidFor] = useState(false);
  const [error, setError] = useState(null);
  const webviewRef = useRef();
  const { product } = route.params;

  const injectedJavaScript = `
    console.log('Starting PayPal setup...');
    document.body.innerHTML = '<h1>Loading PayPal...</h1>';
    const script = document.createElement('script');
    script.src = "https://www.paypal.com/sdk/js?client-id=AdO-NE8K2IY9chzjwYnXu-gzWuzwcu2a6jkozf6mtl1dLi-hkC2B7rZlzcbD5Sj_RfC3c5g-5n_NNh6p";
    script.onload = function () {
      console.log('PayPal script loaded.');
      document.body.innerHTML = '';
      window.paypal.Buttons({
        createOrder: (data, actions) => {
          console.log('Creating order...');
          return actions.order.create({
            purchase_units: [{
              description: '${product.description}',
              amount: {
                currency_code: 'USD',
                value: '${product.price}',
              },
            }],
          });
        },
        onApprove: async (data, actions) => {
          console.log('Order approved.');
          const order = await actions.order.capture();
          window.ReactNativeWebView.postMessage('success');
        },
        onError: err => {
          console.log('PayPal error:', err);
          window.ReactNativeWebView.postMessage('error');
        },
      }).render(document.body);
    };
    script.onerror = function () {
      console.log('PayPal script failed to load.');
      window.ReactNativeWebView.postMessage('error');
    };
    document.body.appendChild(script);
  `;

  const handleWebViewMessage = (event) => {
    if (event.nativeEvent.data === 'success') {
      setPaidFor(true);
    } else if (event.nativeEvent.data === 'error') {
      setError('An error occurred during the payment process');
    }
  };

  if (paidFor) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Congrats, you just bought {product.name}!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error && <Text style={styles.errorText}>Uh oh, an error occurred! {error}</Text>}
      <Text style={styles.text}>{product.description} for ${product.price}</Text>
      <WebView
        ref={webviewRef}
        originWhitelist={['*']}
        source={{ html: '<html><body></body></html>' }}
        injectedJavaScript={injectedJavaScript}
        onMessage={handleWebViewMessage}
        startInLoadingState={true}
        renderLoading={() => <ActivityIndicator style={styles.loading} />}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
  },
  webview: {
    flex: 1,
    width: '100%',
  },
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
  },
});

export default PayPal;
