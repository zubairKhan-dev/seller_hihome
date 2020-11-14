import * as React from "react";
import {Component} from "react";
import {FlatList, StyleSheet, Text, View} from "react-native";
import ColorTheme from "../../../theme/Colors";
import {StaticStyles} from "../../../theme/Styles";
import Constants from "../../../theme/Constants";
import {getCurrentLocale, isRTLMode, strings} from "../../../components/Translations";
import {TouchableOpacity} from "react-native";
import {AppIcon} from "../../../common/IconUtils";
import {CommonIcons} from "../../../icons/Common";
import {SafeAreaView} from "react-navigation";
import {RTLView} from "react-native-rtl-layout";
import {isAppRTL, setLanguage} from "../../../lib/user";
import CodePush from "react-native-code-push";

const languages = [{"title": "English", "code": "en", "id": 1}, {"title": "العربية", "code": "ar", "id": 2}];

interface Props {
    navigation: any;
}

interface State {
    reload?: boolean;
    language: any;
}

export default class Language extends Component<Props, State> {

    constructor(props) {
        super(props);
        this.state = {reload: false, language: isAppRTL() ? languages[1] : languages[0]};
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
                        <Text style={StaticStyles.nav_title}>{strings("language")}</Text>
                        <View style={{flex: 1}}/>
                    </RTLView>
                    <View style={{height: Constants.defaultPaddingRegular}}/>
                </View>
                <View style={{height: 2, backgroundColor: ColorTheme.lightGrey}}/>
            </View>
        );
    }

    renderFoodItem(option: any, index: number) {
        let selItem = this.state.language === languages [index];
        return (
            <View style={{
                marginTop: Constants.defaultPadding,
                // backgroundColor: selItem ? ColorTheme.appThemeLight : ColorTheme.white,
                paddingHorizontal: Constants.defaultPadding,
                justifyContent: "center",
                borderRadius: Constants.defaultPaddingMin
            }}>
                <RTLView locale={getCurrentLocale()}
                         style={{alignItems: "center", paddingHorizontal: Constants.defaultPadding}}>
                    <Text numberOfLines={1}
                          style={[StaticStyles.regularFont, {color: selItem ? ColorTheme.appTheme : ColorTheme.textGreyDark}]}>
                        {option.title}
                    </Text>
                    <View style={{flex: 1}}/>
                    {selItem && <AppIcon name={"check"}
                                         color={ColorTheme.appTheme}
                                         provider={CommonIcons}
                                         size={15}/>}
                </RTLView>
                <View style={{height: 1, backgroundColor: ColorTheme.lightGrey, marginTop: Constants.defaultPadding}}/>
            </View>);

    }

    render() {
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: ColorTheme.white}}>
                {this.renderHeader()}
                <View style={{
                    paddingHorizontal: Constants.defaultPaddingRegular,
                    paddingVertical: Constants.defaultPaddingRegular
                }}>
                    <Text numberOfLines={1} style={[StaticStyles.regularFont, {
                        color: ColorTheme.textDark,
                        textAlign: isRTLMode() ? "right" : "left",
                    }]}>
                        {strings("select_your_language")}
                    </Text>
                </View>
                <FlatList
                    horizontal={false}
                    style={[StaticStyles.flexOne, {paddingVertical: 0}]}
                    data={languages}
                    renderItem={({item, index}) =>
                        <TouchableOpacity onPress={() => {
                            this.setState({language: languages[index]});
                            setLanguage(languages[index].code);
                            setTimeout(() => {
                                CodePush.restartApp()
                            }, 500);
                        }}>
                            {this.renderFoodItem(item, index)}
                        </TouchableOpacity>
                    }
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => "" + index}
                />
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
