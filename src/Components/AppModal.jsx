import { Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useTheme } from '../Context/ThemeContext';
import { fontFamily, radius, spacing, floatShadow } from '../Themes/Themes';

/**
 * Confirmation dialog (00-foundation). Props preserved: title, description,
 * onPositive, onNegative, visible, setModalVisible. Added: `destructive`
 * (Confirm becomes a danger button), `confirmText`, `cancelText`.
 */
const AppModal = ({
  title,
  description,
  onPositive,
  onNegative,
  visible,
  setModalVisible,
  destructive = false,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  hideCancel = false,
}) => {
  const { theme } = useTheme();

  const handleClose = () => {
    setModalVisible(false);
    if (onNegative) onNegative();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={[styles.overlay, { backgroundColor: theme.scrim }]}>
          <TouchableWithoutFeedback>
            <View style={[styles.dialog, { backgroundColor: theme.surfaceCard }, floatShadow]}>
              {title ? <Text style={[styles.title, { color: theme.ink }]}>{title}</Text> : null}
              {description ? <Text style={[styles.description, { color: theme.inkMuted }]}>{description}</Text> : null}

              <View style={styles.buttonRow}>
                {!hideCancel && (
                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={[styles.button, { backgroundColor: theme.surfaceCard, borderColor: theme.borderStrong, borderWidth: 1.5 }]}
                    onPress={handleClose}
                  >
                    <Text style={[styles.btnLabel, { color: theme.ink }]}>{cancelText}</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  activeOpacity={0.85}
                  style={[styles.button, { backgroundColor: destructive ? theme.danger : theme.primary }]}
                  onPress={() => {
                    setModalVisible(false);
                    if (onPositive) onPositive();
                  }}
                >
                  <Text style={[styles.btnLabel, { color: theme.onPrimary }]}>{confirmText}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AppModal;

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  dialog: { width: '100%', maxWidth: 320, borderRadius: radius.md, padding: spacing.xl },
  title: { fontFamily: fontFamily.semibold, fontSize: 18, lineHeight: 24, marginBottom: spacing.sm, textAlign: 'center' },
  description: { fontFamily: fontFamily.regular, fontSize: 14, lineHeight: 20, marginBottom: spacing.xl, textAlign: 'center' },
  buttonRow: { flexDirection: 'row', gap: spacing.md },
  button: { flex: 1, height: 44, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  btnLabel: { fontFamily: fontFamily.semibold, fontSize: 15, lineHeight: 20 },
});
