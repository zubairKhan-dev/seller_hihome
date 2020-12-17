import * as React from "react";
import {Component} from "react";
import {KeyboardAvoidingView, StyleSheet, Text, TextInput, View, Platform, Linking} from "react-native";
import ColorTheme from "../../../theme/Colors";
import {StaticStyles} from "../../../theme/Styles";
import Constants from "../../../theme/Constants";
import {RTLText, RTLView} from "react-native-rtl-layout";
import {getCurrentLocale, isRTLMode, strings} from "../../../components/Translations";
import {TouchableOpacity} from "react-native";
import {AppIcon} from "../../../common/IconUtils";
import {CommonIcons} from "../../../icons/Common";
import {SafeAreaView} from "react-navigation";
import SupportItem from "../../../components/SupportItem";

const photo = {uri: "", data: {}, add: false};

interface Props {
    navigation: any;
}


export default class ContactUs extends Component<Props, State> {

    componentDidMount(): void {

    }

    openLink(url) {
      Linking.canOpenURL(url).then(supported => {
        if (!supported) {
         console.log('Can\'t handle url: ' + url);
        } else {
         return Linking.openURL(url);
        }
      }).catch(err => console.error('An error occurred', err));
    };

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
                        <Text style={StaticStyles.nav_title}>{strings("contact_us")}</Text>
                        <View style={{flex: 1}}/>
                    </RTLView>
                    <View style={{height: Constants.defaultPaddingRegular}}/>
                </View>
                <View style={{height: 2, backgroundColor: ColorTheme.lightGrey}}/>
            </View>
        );
    }

    render() {
        let call_us = (Platform.OS === 'ios') ? `telprompt:+971526164664?` : `tel:+971526164664?` ;
        let technical_support = (Platform.OS === 'ios') ? `telprompt:+971526164664?` : `tel:+971526164664?` ;

        return (
            <SafeAreaView style={{flex: 1, backgroundColor: ColorTheme.white}}>
                {this.renderHeader()}
                <SupportItem title={strings("call_us")}
                  onPress={() => this.openLink(call_us)}/>
                <SupportItem title={strings("technical_support")}
                onPress={() => this.openLink(technical_support)}/>
                <SupportItem title={strings("email_us")}
                onPress={() => this.openLink('mailto:info@hihome.app?subject=Hello HiHome')}/>
                <SupportItem title={strings("whatsapp")}
                onPress={() => this.openLink('http://api.whatsapp.com/send?phone=971509555900')}/>

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
