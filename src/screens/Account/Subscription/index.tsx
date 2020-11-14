import * as React from "react";
import {Component} from "react";
import {StyleSheet, Text, View} from "react-native";
import ColorTheme from "../../../theme/Colors";
import {StaticStyles} from "../../../theme/Styles";
import Constants from "../../../theme/Constants";
import {getCurrentLocale, isRTLMode, strings} from "../../../components/Translations";
import {RTLView} from "react-native-rtl-layout";
import {SafeAreaView} from "react-navigation";
import {AppIcon} from "../../../common/IconUtils";
import {CommonIcons} from "../../../icons/Common";
import {TouchableOpacity} from "react-native";

interface Props {
    navigation: any;
}

interface State {
    reload?: boolean;
}

export default class Subscription extends Component<Props, State> {

    constructor(props) {
        super(props);
        this.state = {reload: false};
    }

    componentDidMount(): void {

    }

    componentWillUnmount() {
        // Remove the event listener before removing the screen from the stack
    }

    renderHeader() {
        return (
            <View style={{
                backgroundColor: ColorTheme.white
            }}>
                <View style={{
                    paddingHorizontal: Constants.defaultPaddingRegular,
                }}>
                    <View style={{height: Constants.defaultPadding}}/>
                    <RTLView locale={getCurrentLocale()}>
                        <TouchableOpacity style={{padding: Constants.defaultPadding}} onPress={() => {
                            this.props.navigation.goBack();
                        }}>
                            <AppIcon name={isRTLMode() ? "back_ar" : "back"}
                                     color={ColorTheme.appTheme}
                                     provider={CommonIcons}
                                     size={22}/>
                        </TouchableOpacity>
                        <View style={{flex: 1}}/>
                        <Text style={StaticStyles.nav_title}>{strings("subscription")}</Text>
                        <View style={{flex: 1}}/>
                    </RTLView>
                    <View style={{height: Constants.defaultPaddingRegular}}/>
                </View>
                <View style={{height: 2, backgroundColor: ColorTheme.lightGrey}}/>
            </View>
        );
    }

    render() {
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: ColorTheme.white}}>
                {this.renderHeader()}
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: ColorTheme.appThemeLight},
    language: {
        paddingTop: 10,
        textAlign: 'center',
    },
});
