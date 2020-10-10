import LottieView from "lottie-react-native";
import {StyleSheet, View} from "react-native";
import React, {Component} from "react";

interface Prop {
}

interface State {
}

export default class ActivityIndicator extends Component<Prop, State> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.overlay}>
                <LottieView source={require('../../../assets/json/loading_circle.json')} autoPlay loop={true}
                            style={{width: 80, height: 80}}/>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    overlay: {
        position: "absolute",
        alignSelf: "center",
    },
});
