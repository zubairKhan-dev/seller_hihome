import {Component} from "react";
import {Dimensions, Modal, StyleSheet, Text, View} from "react-native";
import * as React from "react";
import LottieView from "lottie-react-native";
import {StaticStyles} from "../../theme/Styles";
import {windowHeight} from "../../common";
import ColorTheme from "../../theme/Colors";

interface Prop {
}

interface State {
}

export default class LoadingOverlay extends Component<Prop, State> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Modal presentationStyle={"overFullScreen"}
                   animationType={"none"}
                   transparent={true}
                   visible={true}
                   onRequestClose={() => {
                   }}>
                <View style={[StaticStyles.flexOne, StaticStyles.center]}>
                    <View style={[styles.fullOverlay, {backgroundColor: ColorTheme.appThemeLightest ,opacity: 0.95 , height: windowHeight}]} />
                    <View style={[{backgroundColor: ColorTheme.white, width: 100, height: 100, position: "absolute", borderRadius: 50,
                        shadowColor: ColorTheme.grey,
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.15,
                        shadowRadius: 9,}]}/>
                    <LottieView source={require('../../../assets/json/activity_indicator.json')} autoPlay loop={true} style={{width: 200, height: 200}}/>
                    {/*<Text style={{fontFamily: 'Avenir',fontSize: 14, marginTop: -20, color: "grey"}}>Loading</Text>*/}
                </View>
            </Modal>

        );
    }
}

const styles = StyleSheet.create({
    fullOverlay: {
        position: "absolute",
        height: "100%",
        width: "100%",
    },
});
