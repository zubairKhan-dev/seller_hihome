import * as React from "react";
import {Component} from "react";
import {Image, SafeAreaView, Text, TouchableWithoutFeedback, View} from "react-native";
import {AppIcon} from "../../common/IconUtils";
import ColorTheme from "../../theme/Colors";
import {CommonIcons} from "../../icons/Common";
import {StaticStyles} from "../../theme/Styles";
import {XEvents} from "../../lib/EventBus";
import Events from "react-native-simple-events";
import {TouchableOpacity} from "react-native";

interface Prop {
    navigation: any;
    showNotifications: Function;
    getUserLocation: Function;
}

interface State {
    address: string;
}

export default class CurrentLocationView extends Component<Prop, State> {
    constructor(props) {
        super(props);
        this.state = { address: ""};
    }

    componentDidMount(): void {
        Events.on(XEvents.UPDATE_USER_ADDRESS, "update_user_address", this.updateAddress.bind(this));
    }

    componentWillUnmount() {
        Events.rm(XEvents.UPDATE_USER_ADDRESS, "update_user_address");
    }

    private updateAddress(addressObj) {
        let userLocationAddress = addressObj.address.results[0].formatted;
        this.setState({
           address: userLocationAddress,
        });
    }

    render() {
        return (
            <SafeAreaView style={{flex: 1, height: 40,  flexDirection: "row", alignItems: "center"}}>
                <View style={{flex: 1}}>
                    <TouchableOpacity
                        style={{ flex: 1}}
                        onPress={() => {
                            this.props.getUserLocation();
                        }}>
                        <View style={{flex: 1, height: 30,  flexDirection: "row", alignItems: "center"}}>
                            <AppIcon name={"map_pin"}
                                     color={ColorTheme.grey}
                                     provider={CommonIcons}
                                     size={15}/>
                            <View style={{width: 5}}/>
                            <Text style={[StaticStyles.lightFont, {textAlign: "center", color: ColorTheme.textGreyDark}]}>{"Delivering to"}</Text>
                            <View style={{flex: 1}}/>
                            <AppIcon name={"arrow_right"}
                                     color={ColorTheme.appTheme}
                                     provider={CommonIcons}
                                     size={12}/>
                        </View>
                    </TouchableOpacity>
                    <Text numberOfLines={1} style={[StaticStyles.regularFont, {textAlign: "left", color: ColorTheme.black}]}>{this.state.address.length > 1 ? this.state.address : "Select Location ..."}</Text>
                </View>
                <View style={{flex: 1}}/>
                <TouchableOpacity
                    onPress={() => {
                        this.props.showNotifications();
                    }}>
                    <AppIcon name={"notification"}
                             color={ColorTheme.appTheme}
                             provider={CommonIcons}
                             size={30}/>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }
}

