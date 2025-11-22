import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../Context/ThemeContext';
import Fonts from '../../../assets/fonts/Fonts';

// Define the accent color used for the timeline, as it's not in the darkSea theme
const TIMELINE_ACCENT_COLOR = '#2ecc71'; 

// --- Data structure for the timeline events (same as before) ---
const TIMELINE_DATA = [
    // ... (Your TIMELINE_DATA array here) ...
    {
        id: '1',
        status: 'Order Confirmed',
        statusDate: 'Mon, 31st Mar \'25',
        events: [
            { text: 'Your Order has been placed.', time: 'Mon, 31st Mar \'25 - 9:36pm' },
            { text: 'Seller has processed your order.', time: 'Tue, 1st Apr \'25 - 10:50am' },
            { text: 'Your item has been picked up by delivery partner.', time: 'Tue, 1st Apr \'25 - 10:50am' },
        ],
    },
    {
        id: '2',
        status: 'Shipped',
        statusDate: 'Tue, 1st Apr \'25',
        events: [
            { text: 'Ekart Logistics - FMPC4675889769', isBold: true }, 
            { text: 'Your item has been shipped.', time: 'Tue, 1st Apr \'25 - 12:42pm' },
            { text: 'Your item has been received In the hub nearest to you', time: '' }, 
        ],
    },
    {
        id: '3',
        status: 'Out For Delivery',
        statusDate: 'Wed, 2nd Apr \'25',
        events: [
            { text: 'Your item is out for delivery', time: 'Wed, 2nd Apr \'25 - 10:46am' },
        ],
    },
    {
        id: '4',
        status: 'Delivered',
        statusDate: 'Wed, 2nd Apr \'25',
        events: [
            { text: 'Your item has been delivered', time: 'Wed, 2nd Apr \'25 - 4:19pm' },
        ],
    },
];
// -------------------------------------------------------------

/**
 * Theme-based reusable component for displaying an order timeline.
 * Assumes useTheme() provides a theme object with colors.
 */
const OrderTimeline = ({ data = TIMELINE_DATA }) => {
    // ⚠️ IMPORTANT: Assume useTheme() and Fonts are defined in your environment
    const { theme } = useTheme();

    const paratextConfig = {
        color: theme.secondaryText || '#A7B3C4', // Use theme secondaryText for body/para
        fontFamily: Fonts.family.semiBold,
        fontSize: Fonts.size.xs,
    };

    const headerConfig = {
        color: theme.highlightedText || 'white', // Use theme highlightedText for headers
        fontFamily: Fonts.family.bold,
        fontSize: Fonts.size.lg, // This seems unusually small for a header, check your Fonts.size.xs
    };

    // The provided incomplete line: `const` is fixed by defining a function/style variable here if needed.
    // We will rely on inline styles for items that need to blend the theme properties.
    
    // Create styles dynamically based on the current theme
    const dynamicStyles = getStyles(theme);

    return (
        <View style={[dynamicStyles.container]}>
            {data.map((item, index) => (
                <View key={item.id} style={dynamicStyles.timelineItem}>
                    {/* Timeline indicator (circle and line) */}
                    <View style={dynamicStyles.timelineIndicator}>
                        <View style={dynamicStyles.circle} />
                        {/* Render line if it's not the last item */}
                        {index < data.length - 1 && <View style={dynamicStyles.line} />}
                    </View>

                    {/* Content for the timeline item */}
                    <View style={dynamicStyles.content}>
                        {/* Main Status */}
                        <Text style={headerConfig}>
                            {item.status} <Text style={dynamicStyles.statusDate}>{item.statusDate}</Text>
                        </Text>

                        {/* Sub-events */}
                        {item.events.map((event, eventIndex) => (
                            <View key={eventIndex}>
                                <Text style={[dynamicStyles.eventText, event.isBold && dynamicStyles.eventTextBold]}>
                                    {event.text}
                                </Text>
                                {event.time ? ( // Only render time if it exists
                                    <Text style={paratextConfig}>{event.time}</Text>
                                ) : null}
                            </View>
                        ))}
                    </View>
                </View>
            ))}
        </View>
    );
};

// --- Stylesheet generator using theme ---
const getStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 20,
        
    },
    timelineItem: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    timelineIndicator: {
        width: 20, 
        alignItems: 'center',
        marginRight: 15,
    },
    circle: {
        width: 10,
        height: 10,
        borderRadius: 5,
        // Using the defined green accent color
        backgroundColor: TIMELINE_ACCENT_COLOR, 
        zIndex: 1, 
    },
    line: {
        width: 2,
        flex: 1, 
        // Using the defined green accent color
        backgroundColor: TIMELINE_ACCENT_COLOR, 
        position: 'absolute',
        top: 10, 
        bottom: -10, 
    },
    content: {
        flex: 1,
    },
    // The main status text color is handled by headerConfig

    statusDate: {
        // Secondary dates should be softer than main headers, using theme.secondary
        fontSize: 14,
        fontWeight: 'normal',
        color: theme.secondary || '#7B9EBF', 
    },
    eventText: {
        // Body text color
        fontSize: 14,
        color: theme.secondaryText || '#A7B3C4', 
        marginTop: 2,
    },
    eventTextBold: {
        // Highlighted body text (like the tracking number) should be bright white
        fontWeight: 'bold', 
        color: theme.highlightedText || 'white',
    },
    // The event time color is handled by paratextConfig (using theme.secondaryText)
});

export default OrderTimeline;