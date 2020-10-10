import * as React from "react";
import {Component} from "react";
import {SafeAreaView, View} from "react-native";
import {RTLAppIcon} from "../../common/IconUtils";
import ColorTheme from "../../theme/Colors";
import {CommonIcons} from "../../icons/Common";
import {windowWidth} from "../../common";
import {StaticStyles} from "../../theme/Styles";
import {RTLText, RTLView} from "react-native-rtl-layout";
import {getCurrentLocale, isRTLMode} from "../Translations";
import {TouchableOpacity} from "react-native";

interface Prop {
    navigation: any;
    showBack?: boolean;
    title: string;
    showCurrentLocation?: boolean;
    backgroundColor?: string;
}

interface State {
    showCurrentLocation?: boolean;
}

export default class NavigationBar extends Component<Prop, State> {
    constructor(props) {
        super(props);
        this.state = {showCurrentLocation: this.props.showCurrentLocation ? this.props.showCurrentLocation : false};
    }

    render() {
        return (
            <SafeAreaView style={{backgroundColor: this.props.backgroundColor ? this.props.backgroundColor : ColorTheme.white}} >
                <View style={{flexDirection: "column"}}>
                    <View style={{height: 50, alignItems: "center", flexDirection: "row", maxWidth: windowWidth}}>
                        <RTLView locale={getCurrentLocale()}>
                            <View style={{width: 15}}/>
                            {this.props.showBack && <RTLView locale={getCurrentLocale()} style={{width: 30}}>
                                <TouchableOpacity style={{justifyContent: "center"}} onPress={() => {
                                    this.props.navigation.goBack();
                                }}>
                                    <RTLAppIcon name={isRTLMode() ? "back_ar" : "back"}
                                             color={ColorTheme.appTheme}
                                             provider={CommonIcons}
                                             size={20}/>
                                </TouchableOpacity>
                            </RTLView>}
                            {!this.props.showBack && <View style={{width: 30}}/>}
                            {!this.props.showCurrentLocation && <RTLText style={[StaticStyles.heading, {textAlign: "center"}]}>{this.props.title}</RTLText>}
                            <View style={{width: 45}}/>
                        </RTLView>
                        {/*<Text style={{*/}
                        {/*    flex: 1,*/}
                        {/*    textAlign: "center",*/}
                        {/*    color: "Home Food",*/}
                        {/*    fontWeight: "800",*/}
                        {/*    fontSize: 20,*/}
                        {/*    marginTop: Constants.defaultPadding,*/}
                        {/*}}>{this.props.title}</Text>*/}
                        {/*{this.props.showCurrentLocation &&*/}
                        {/*<CurrentLocationView navigation={this.props.navigation} showNotifications={() => {*/}
                        {/*    this.props.navigation.navigate("Notifications")*/}
                        {/*}} getUserLocation={() => {*/}
                        {/*    this.props.navigation.navigate("UserLocation")*/}
                        {/*}}/>*/}
                        {/*}*/}
                    </View>
                    {/*<View style={{*/}
                    {/*    marginTop: 5,*/}
                    {/*    height: 0.5,*/}
                    {/*    width: windowWidth,*/}
                    {/*    backgroundColor: ColorTheme.grey,*/}
                    {/*    shadowColor: ColorTheme.black,*/}
                    {/*    shadowOffset: {width: 0, height: 2},*/}
                    {/*    shadowOpacity: .25,*/}
                    {/*    shadowRadius: 3*/}
                    {/*}}/>*/}
                </View>
            </SafeAreaView>
        );
    }
}

