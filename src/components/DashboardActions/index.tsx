import React, {Component} from "react";
import Modal from "react-native-modal";
import {Text, View} from "react-native";
import ColorTheme from "../../theme/Colors";
import {StaticStyles} from "../../theme/Styles";
import Constants from "../../theme/Constants";
import {getCurrentLocale, strings} from "../Translations";
import ActionButton from "../ActionButton";
import ActionIconButton from "../ActionButton/ActionIconButton";
import {RTLView} from "react-native-rtl-layout";

interface Props {
    show: boolean;
    onDismiss: Function;
    onToday?: Function;
    onWeek?: Function;
    onMonth?: Function;
    onYear?: Function;
}

interface State {
    value?: any;
    selectedTab?: number;
}

export default class DashboardActions extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 0,
        };
    }

    render() {
        return (
            <Modal
                style={{marginBottom: 10, justifyContent: 'flex-end', marginHorizontal: 0}}
                onBackdropPress={() => this.props.onDismiss()}
                isVisible={this.props.show}
                onBackButtonPress={() => {
                    // this.props.onDismiss();
                }}
                backdropColor={ColorTheme.black}
                backdropOpacity={0.5}
                avoidKeyboard={true}
                useNativeDriver={true}
            >
                <View style={[StaticStyles.shadow, {
                    height: 250,
                    marginBottom: -20,
                    backgroundColor: ColorTheme.white,
                    borderRadius: 0,
                    overflow: "hidden",
                    justifyContent: "center",
                }]}>
                    <View style={{}}>
                        <Text style={[{
                            fontWeight: "600",
                            textAlign: "center",
                            textAlignVertical: "bottom",
                            color: ColorTheme.textDark
                        }]}>{strings("show_orders_earnings")}</Text>
                    </View>
                    <View style={{height: Constants.defaultPadding}}/>
                    <RTLView locale={getCurrentLocale()} style={{
                        flexDirection: "row",
                        paddingHorizontal: Constants.defaultPaddingMax
                    }}>
                        <View style={{ flex: 1}}>
                            <ActionIconButton icon={"calendar"} textColor={ColorTheme.white} backgroundColor={ColorTheme.appThemeSecond}
                                              onPress={() => {
                                                  this.props.onToday();
                                              }} title={strings("today")} iconColor={ColorTheme.white}/>
                        </View>
                        <View style={{width: Constants.defaultPadding}}/>
                        <View style={{flex: 1}}>
                            <ActionIconButton icon={"calendar"} onPress={() => {
                                this.props.onWeek();
                            }} title={strings("this_week")} textColor={ColorTheme.white} backgroundColor={ColorTheme.appTheme}
                                              iconColor={ColorTheme.white}/>
                        </View>
                    </RTLView>
                    <View style={{height: Constants.defaultPadding}}/>
                    <RTLView locale={getCurrentLocale()} style={{
                        flexDirection: "row",
                        paddingHorizontal: Constants.defaultPaddingMax
                    }}>
                        <View style={{flex: 1}}>
                            <ActionIconButton icon={"calendar"} onPress={() => {
                                this.props.onMonth();
                            }} title={strings("this_month")} textColor={ColorTheme.white} backgroundColor={ColorTheme.appTheme}
                                              iconColor={ColorTheme.white}/>
                        </View>
                        <View style={{width: Constants.defaultPadding}}/>
                        <View style={{flex: 1}}>
                            <ActionIconButton icon={"calendar"} onPress={() => {
                                this.props.onYear();
                            }} title={strings("this_year")} textColor={ColorTheme.white} backgroundColor={ColorTheme.appTheme}
                                              iconColor={ColorTheme.white}/>
                        </View>
                    </RTLView>
                    <View style={{height: Constants.defaultPaddingRegular}}/>
                    <View style={{paddingHorizontal: Constants.defaultPaddingMax}}>
                        <ActionButton title={strings("cancel")} variant={"alt"} onPress={() => {
                            this.props.onDismiss();
                        }}/>
                    </View>
                </View>
            </Modal>
        );
    }

}
