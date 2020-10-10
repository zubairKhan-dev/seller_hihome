import * as React from "react";
import {Component} from "react";
import {View, StyleSheet, Text} from "react-native";
import {StaticStyles} from "../../theme/Styles";
import LottieView from "lottie-react-native";
import NavigationBar from "../../components/NavigationBar";

interface Props {
    navigation: any;
}

interface State {
}

export default class Notifications extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {isLoading: false}
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={[StaticStyles.flexOne, StaticStyles.center]}>
                    <LottieView source={require('../../../assets/json/under_development.json')} autoPlay loop={true}
                                style={{width: 200, height: 200}}/>
                    <Text style={{fontFamily: 'Avenir',fontSize: 14, marginTop: -20, color: "grey"}}>Under Development</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
});
