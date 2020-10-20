import React, {Component} from "react";
import Modal from "react-native-modal";
import {ScrollView, Text, TextInput, TouchableOpacity, View} from "react-native";
import {StaticStyles} from "../../theme/Styles";
import Constants from "../../theme/Constants";
import ColorTheme from "../../theme/Colors";
import {getCurrentLocale, isRTLMode, strings} from "../../components/Translations";
import {AppIcon} from "../../common/IconUtils";
import {CommonIcons} from "../../icons/Common";
import {RTLView} from "react-native-rtl-layout";

const offers = [require('../../../assets/images/chinese.jpg'),
    require('../../../assets/images/burger.jpeg'),
    require('../../../assets/images/indian.jpg'),
    require('../../../assets/images/pakistani.jpg')];

interface Props {
    navigation: any;
    show: boolean;
    onDismiss: Function;
    title: string;
    text?: string;
}

interface State {
    show: boolean;
    showSignUp: boolean;
    showLogin: boolean;
    text: string;
    offers: any[];
}

export default class RecipeIngredients extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            offers: offers,
            showSignUp: false,
            showLogin: false,
            text: this.props.text,
        };
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            show: newProps.show,
            showSignUp: newProps.showSignUp,
            showLogin: newProps.showLogin,
            text: newProps.text,
        });
    }

    renderHeader() {
        return (
            <View style={{
                backgroundColor: ColorTheme.white
            }}>
                <View style={{
                    paddingHorizontal: Constants.defaultPaddingRegular,
                }}>
                    <View style={{height: 3 * Constants.defaultPaddingRegular}}/>
                    <RTLView locale={getCurrentLocale()}>
                        <TouchableOpacity onPress={() => {
                            this.props.onDismiss(this.state.text);
                        }}>
                            <AppIcon name={isRTLMode() ? "back_ar" : "back"}
                                     color={ColorTheme.appTheme}
                                     provider={CommonIcons}
                                     size={22}/>
                        </TouchableOpacity>
                        <View style={{flex: 1}}/>
                        <Text style={StaticStyles.nav_title}>{this.props.title}</Text>
                        <View style={{flex: 1}}/>
                    </RTLView>
                </View>
            </View>
        );

    }

    render() {
        return (
            <Modal
                isVisible={this.props.show}
                onBackButtonPress={() => {
                    this.dismiss();
                }}
                avoidKeyboard={true}
                useNativeDriver={true}
                onBackdropPress={() => this.dismiss()}>
                <View style={{flex: 1, backgroundColor: "white", margin: -20}}>
                    <View style={{flex: 1, backgroundColor: "rgba(128, 128, 128, 0.002)"}}>
                        {this.renderHeader()}
                        <View style={[StaticStyles.top_shadow, {
                            flex: 1,
                            backgroundColor: ColorTheme.white,
                            borderTopRightRadius: Constants.viewCornerRadius,
                            borderTopLeftRadius: Constants.viewCornerRadius,
                            marginTop: Constants.defaultPaddingRegular
                        }]}>
                            <ScrollView style={{marginHorizontal: Constants.defaultPaddingMax}}>
                                <View style={{height: Constants.defaultPaddingMax}}/>
                                <TextInput textAlignVertical={'top'}
                                           autoFocus={true}
                                           editable={true}
                                           multiline={true}
                                           placeholderTextColor={ColorTheme.placeholder}
                                           placeholder={strings("enter_content_here")}
                                           keyboardType={"default"}
                                           value={this.state.text}
                                           style={{
                                               flex: 1,
                                               fontSize: 14,
                                               height: 300,
                                               fontWeight: "300",
                                               color: ColorTheme.black,
                                               textAlign: isRTLMode() ? "right" : "left"
                                           }}
                                           onChangeText={(value) => {
                                               this.setState({text: value})
                                               // showMessage(value);
                                           }}>
                                </TextInput>
                            </ScrollView>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }

    private dismiss() {
        this.props.onDismiss();
    }
}
