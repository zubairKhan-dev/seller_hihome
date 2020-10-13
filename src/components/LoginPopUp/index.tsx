import React, {Component} from "react";
import Modal from "react-native-modal";
import {ScrollView, Text, TouchableOpacity, View} from "react-native";
import {StaticStyles} from "../../theme/Styles";
import Constants from "../../theme/Constants";
import {getCurrentLocale, strings} from "../Translations";
import ActionIconButton from "../ActionButton/ActionIconButton";
import ColorTheme from "../../theme/Colors";
import {RTLView} from "react-native-rtl-layout";
import {SliderBox} from "react-native-image-slider-box";
import {windowHeight, windowWidth} from "../../common";
import SignUp from "../../screens/Account/Login/SignUp";
import Login from "../../screens/Account/Login/Login";
import CodePush from "react-native-code-push";
import {XEvents} from "../../lib/EventBus";
import Events from "react-native-simple-events";
import {getLanguage, setLanguage} from "../../lib/user";

const offers = [require('../../../assets/images/logo_back.png')];

const food_images = ["https://b.zmtcdn.com/data/collections/e1d5e8f900dbca01d11f353ef4b6a97c_1581661395.jpg",
    "https://b.zmtcdn.com/data/collections/b22194cb38ed18a5200b387ad8f243f0_1582015804.jpg",
    "https://b.zmtcdn.com/data/collections/c392056cfd7c02befe8d53f94ad2a908_1581933619.jpg",
    "https://b.zmtcdn.com/data/collections/532af3ab24d29dbddcdcd16921ada06f_1535628640.jpg",
    "https://b.zmtcdn.com/data/collections/90999c2395ba9c9c40998607c8dd5af1_1581058174.jpg"];

interface Props {
    navigation: any;
    show: boolean;
    onDismiss: Function;
}

interface State {
    show: boolean;
    showSignUp: boolean;
    showLogin: boolean;
    offers: any[];
    appVersion?: string;
    language?: string;
}

export default class LoginPopUp extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            offers: offers,
            showSignUp: false,
            showLogin: false,
            appVersion: "",
            language: undefined
        };
    }

    componentDidMount() {
        CodePush.getUpdateMetadata().then((metadata) => {
            if (metadata) {
                this.setState({
                    appVersion: metadata.appVersion,
                });
            }
        });
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            show: newProps.show,
            showSignUp: newProps.showSignUp,
            showLogin: newProps.showLogin,
        });
    }

    updateLanguage(language) {
        let curLanguage = getLanguage()
        if (curLanguage === language) {
            this.setState({language: language});
        } else {
            setLanguage(language);
            this.setState({language: language});
            // setTimeout(() => {
            //     RNRestart.Restart();
            // }, 1000);
        }
    }

    renderGuestUser() {
        return (
            <View style={{backgroundColor: "#F9F7F7", marginTop: Constants.defaultPadding, justifyContent: "center", alignItems: "center"}}>
                <View style={{height: Constants.defaultPaddingMin}}/>
                {!this.state.language && <View style={{paddingTop: Constants.defaultPaddingRegular}}>
                    <View style={{
                        borderRadius: 25,
                        height: 40,
                        width: 250,
                        borderColor: ColorTheme.appTheme,
                        borderWidth: 1,
                        justifyContent: "center"
                    }}>
                        <TouchableOpacity style={{justifyContent: "center", overflow: "hidden"}}
                                          onPress={() => {
                                              this.updateLanguage("ar");
                                          }}>
                            <Text style={[{
                                textAlign: "center",
                                color: ColorTheme.appTheme,
                                fontWeight: "700",
                                fontSize: 14,
                            }]}> {strings("arabic")}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{height: Constants.defaultPadding}}/>
                    <View style={{
                        borderRadius: 25,
                        height: 40,
                        width: 250,
                        borderColor: ColorTheme.appTheme,
                        borderWidth: 1,
                        justifyContent: "center"
                    }}>
                        <TouchableOpacity style={{justifyContent: "center", overflow: "hidden"}}
                                          onPress={() => {
                                              this.updateLanguage("en");
                                          }}>
                            <Text style={[{
                                textAlign: "center",
                                color: ColorTheme.appTheme,
                                fontWeight: "700",
                                fontSize: 14,
                            }]}> {strings("english")}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{marginTop: Constants.defaultPadding}}>
                        {/*style={[{padding: 2 * Constants.defaultPadding + Constants.defaultPadding}]}*/}
                        {/*<Image resizeMode={"contain"} style={{width: 200, height: 40}} source={require('../../../assets/images/app-logo.png')}/>*/}
                        <Text style={[{
                            textAlign: "center",
                            color: ColorTheme.black,
                            fontWeight: "500",
                            fontSize: 12,
                        }]}> {strings("version") + " " + this.state.appVersion}</Text>
                    </View>
                </View>}
                {this.state.language && <View style={{paddingTop: Constants.defaultPaddingRegular}}>
                    <ActionIconButton icon={"login"} onPress={() => {
                        this.setState({showLogin: true})
                    }} title={strings("email_mobile_login")} iconColor={ColorTheme.appTheme}/>
                    <View style={{height: Constants.defaultPaddingRegular}}/>
                    <RTLView locale={getCurrentLocale()}>
                        <View style={{flex: 1}}/>
                        <Text style={{
                            fontWeight: "400",
                            fontSize: 15,
                            color: ColorTheme.grey
                        }}>{strings("dont_have_account")}</Text>
                        <View style={{width: Constants.defaultPadding}}/>
                        <TouchableOpacity style={{justifyContent: "center"}} onPress={() => {
                            this.setState({showSignUp: true})
                        }}>
                            <Text style={{
                                color: ColorTheme.appTheme,
                                fontWeight: "600",
                                fontSize: 15,
                            }}>{strings("sign_up")}</Text>
                        </TouchableOpacity>
                        <View style={{flex: 1}}/>
                    </RTLView>
                </View>}
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
                        <View style={{flex: 1}}>
                            <View style={{}}>
                                <SliderBox
                                    sliderBoxHeight={windowHeight - 250}
                                    images={offers}
                                    onCurrentImagePressed={index => {
                                    }}
                                    currentImageEmitter={index => {
                                    }}
                                    resizeMethod={'resize'}
                                    resizeMode={'cover'}
                                    dotColor={ColorTheme.appTheme}
                                    inactiveDotColor={"rgba(128, 128, 128, 0.02)"}
                                    paginationBoxStyle={{
                                        position: "absolute",
                                        bottom: 10,
                                        padding: 0,
                                        alignItems: "center",
                                        alignSelf: "center",
                                        justifyContent: "center",
                                        paddingBottom: 2,
                                        paddingTop: 10,
                                        marginHorizontal: 0,
                                        backgroundColor: ColorTheme.black,
                                        borderRadius: 20,
                                        opacity: 0.65,
                                        marginBottom: 50
                                    }}
                                    dotStyle={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: 4,
                                        marginHorizontal: -100,
                                        borderWidth: 1,
                                        borderColor: ColorTheme.appThemeLight,
                                        padding: 0,
                                        margin: 0,
                                        marginBottom: 8
                                    }}
                                />
                            </View>
                        </View>
                        <View style={[StaticStyles.top_shadow, {
                            flex: 1,
                            height: 200,
                            backgroundColor: "#F9F7F7",
                            borderTopRightRadius: Constants.viewCornerRadius,
                            borderTopLeftRadius: Constants.viewCornerRadius,
                            position: "absolute",
                            bottom: 0,
                            width: windowWidth
                        }]}>
                            <ScrollView style={{marginHorizontal: Constants.defaultPaddingMax}}>
                                {this.renderGuestUser()}
                            </ScrollView>
                        </View>
                        <SignUp navigation={this.props.navigation} show={this.state.showSignUp}
                                onDismiss={() => this.setState({showSignUp: false})}/>
                        <Login navigation={this.props.navigation} show={this.state.showLogin}
                               onDismiss={() => this.setState({showLogin: false})}
                               onLoginSuccess={() => {
                                   Events.trigger(XEvents.USER_LOGGED_IN);
                                   this.setState({showLogin: false, show: false});
                                   this.dismiss();
                               }}/>
                    </View>
                </View>
            </Modal>
        );
    }

    private dismiss() {
        this.props.onDismiss();
    }
}
