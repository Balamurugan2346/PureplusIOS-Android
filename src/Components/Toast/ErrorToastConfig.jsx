import { BaseToast, ErrorToast } from 'react-native-toast-message';

// Custom config
export const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: 'green',
        backgroundColor: '#e6ffe6',
        borderRadius: 8,
      }}
      text1Style={{
        fontSize: 16,
        fontWeight: 'bold',
        color: 'green'
      }}
      text2Style={{
        fontSize: 14,
        color: '#333'
      }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: 'red',
        backgroundColor: '#ffe6e6',
        borderRadius: 8,
      }}
      text1Style={{
        fontSize: 16,
        fontWeight: 'bold',
        color: 'red'
      }}
      text2Style={{
        fontSize: 14,
        color: '#444'
      }}
    />
  )
};

