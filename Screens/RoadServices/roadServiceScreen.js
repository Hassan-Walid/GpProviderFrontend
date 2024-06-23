import React, { useState } from 'react';
import { Image, StyleSheet, Text, View, ScrollView } from 'react-native';
import Checkbox from 'expo-checkbox';
import CustomButton from '@/components/CustomButton';
import { useTranslation } from "react-i18next";

const RoadServiceScreen = ({ navigation }) => {

    const { t } = useTranslation();
    const [checkedItems, setCheckedItems] = useState(
        {
            winch: false,
            fuel: false,
            tire: false,
            battery: false,
        }
    );

    const handleCheckboxChange = (item) => {
        setCheckedItems(prevState => ({
            ...prevState,
            [item]: !prevState[item]
        }));
    };
    const winshChecked = checkedItems.winch
    const handleRequest = () => {
        const selectedItems = Object.keys(checkedItems).filter(item => checkedItems[item]);
        // console.warn('Selected Items:', selectedItems);
        navigation.navigate("Vehichles", { service: selectedItems })

    }
    return (
        <View style={styles.mainContainer}>
            <View style={styles.homeHeader}>
                <Text style={styles.textHeader}>Road Services</Text>
            </View>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={[styles.row, { backgroundColor: 'lightgray' }]}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={require('../../assets/images/winch.jpg')}
                            style={styles.image}
                        />
                    </View>

                    <Text style={styles.text}>Winch</Text>
                    <Checkbox
                        color={checkedItems.winch ? "#059212" : undefined}
                        value={checkedItems.winch}
                        onValueChange={() => handleCheckboxChange('winch')}
                    // disabled={!winshChecked}
                    />
                </View>
                <View style={styles.row}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={require('../../assets/images/fuel.jpg')}
                            style={styles.image}
                        />
                    </View>

                    <Text style={styles.text}>Fuel</Text>
                    <Checkbox
                        color={checkedItems.fuel ? "#059212" : undefined}
                        value={checkedItems.fuel}
                        onValueChange={() => handleCheckboxChange('fuel')}
                        disabled={winshChecked}

                    />
                </View>
                <View style={[styles.row, { backgroundColor: 'lightgray' }]}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={require('../../assets/images/tire.jpg')}
                            style={styles.image}
                        />
                    </View>

                    <Text style={styles.text}>Tire</Text>
                    <Checkbox
                        color={checkedItems.tire ? "#059212" : undefined}
                        value={checkedItems.tire}
                        onValueChange={() => handleCheckboxChange('tire')}
                        disabled={winshChecked}

                    />
                </View>
                <View style={styles.row}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={require('../../assets/images/battery.jpg')}
                            style={styles.image}
                        />
                    </View>

                    <Text style={styles.text}>Battery</Text>
                    <Checkbox
                        color={checkedItems.battery ? "#059212" : undefined}
                        value={checkedItems.battery}
                        onValueChange={() => handleCheckboxChange('battery')}
                        disabled={winshChecked}

                    />
                </View>
                <View style={styles.buttonContainer}>
                    <CustomButton
                        title={t("Request")}
                        onPressHandler={handleRequest}
                    />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        padding: 2,
        justifyContent: "center"

    },
    homeHeader: {
        height: 90,
        width: '100%',
        flexDirection: "row",
        backgroundColor: "#9AB3CA",
        borderBottomRightRadius: 45,
        justifyContent: "space-between",
        alignItems: 'center',
        overflow: 'hidden',
    },
    textHeader: {
        flex: 1,
        marginLeft: 10,
        fontSize: 18,
        fontFamily: 'Oswald',
        color: "white"
    },
    container: {
        flexGrow: 1,
        padding: 10,
    },
    imageContainer: {
        width: 100,
        height: 100,
        borderRadius: 30,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    text: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        fontFamily: 'Oswald',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EEEEEE',
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
        flex: 1,
    },
    buttonContainer: {
        alignItems: 'center',
    }
})

export default RoadServiceScreen;
