import { useEffect, useRef, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import Banner from './Banner';
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_WIDTH = SCREEN_WIDTH; // or your custom item width





export default function BannerCarousel() {


    const bannerData = [
        {
            id: '1',
            image: require('../../assets/images/otpbg.png'),
            title: "Summer Special Offer!",
            description: "Get 20L Bisleri cans at ₹50 only — Free delivery for orders above ₹300!"
        },
        {
            id: '2',
            image: require('../../assets/images/EmailBG.png'),
            title: "Monthly Subscription",
            description: "Subscribe & Save — Hassle-free scheduled water can deliveries at your doorstep."
        },
        {
            id: '3',
            image: require('../../assets/images/UsernameBG.png'),
            title: "100% Purity Guaranteed",
            description: "Our water is tested and certified for your family's health and safety."
        }
    ];

    const scrollRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const timerRef = useRef(null);
    const isUserInteracting = useRef(false);

    const startAutoScroll = () => {
        stopAutoScroll(); // clear existing timer before starting
        timerRef.current = setInterval(() => {
            setActiveIndex((prevIndex) => {
                const nextIndex = (prevIndex + 1) % bannerData.length;
                scrollRef.current?.scrollTo({
                    x: nextIndex * ITEM_WIDTH,
                    animated: true,
                });
                return nextIndex;
            });
        }, 3000);
    };

    const stopAutoScroll = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    useEffect(() => {
        startAutoScroll();
        return stopAutoScroll;
    }, []);

    return (
        <View style={styles.carouselContainer}>
            <ScrollView
                ref={scrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                onTouchStart={() => {
                    isUserInteracting.current = true;
                    stopAutoScroll();
                }}
                onMomentumScrollEnd={(e) => {
                    const index = Math.round(
                        e.nativeEvent.contentOffset.x / ITEM_WIDTH
                    );
                    setActiveIndex(index);
                    isUserInteracting.current = false;
                    startAutoScroll(); // restart after user stops scrolling
                }}
            >
                {bannerData.map((item, index) => (
                    <Banner
                        key={index}
                        description={item.description}
                        title={item.title}
                        img={item.image}
                    />
                ))}
            </ScrollView>

            <View style={styles.indicatorContainer}>
                {bannerData.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.indicatorDot,
                            {
                                backgroundColor:
                                    index === activeIndex ? '#007AFF' : '#ccc',
                            },
                        ]}
                    />
                ))}
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    carouselContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    carouselImage: {
        width: ITEM_WIDTH,
        height: 160,
        marginHorizontal: 10,
        borderRadius: 20,
    },
    indicatorContainer: {
        flexDirection: 'row',
        marginTop: 10,
    },
    indicatorDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
})