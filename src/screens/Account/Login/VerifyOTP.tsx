import * as React from "react";
import {Component} from "react";
import {View, StyleSheet} from "react-native";
import NavigationBar from "../../../components/NavigationBar";

interface Props {
    navigation: any;
}

interface State {
}
export default class VerifyOTP extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {isLoading: false}
    }

    render() {
        return (
            <View style={styles.container}>
                <NavigationBar navigation={this.props.navigation} showBack={true} title={"Set Your Location"} showCurrentLocation={false}/>
                {/*{this.state.isLoading && <LoadingOverlay />}*/}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
    },
});
