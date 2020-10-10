import React, {Component} from "react";
import {Animated, Easing, Image, Text, View, Dimensions, StyleSheet} from "react-native";
import Constants from "../../theme/Constants";
import ColorTheme from "../../theme/Colors";
import {setLocale, strings} from "../../components/Translations";
import CodePush from "react-native-code-push";
import {getLanguage} from "../../lib/user";
import {SafeAreaView} from "react-navigation";
import DeviceInfo from "react-native-device-info";
import Video from "react-native-video";
import styled from "styled-components/native";
const { height } = Dimensions.get("window");
interface Props {
    onFinishedLoading: Function;
}

interface State {
    label: string;
    version: string;
    description: string;
    splashLoading: Animated.Value;
    codePushDone: boolean;
    codePushStatus?: string;
    showVersion?: boolean;
}

export default class SplashScreen extends Component<Props, State> {
    private anim: Animated.CompositeAnimation;
    private animDone: boolean;

    constructor(props) {
        super(props);
        this.state = {
            label: "",
            version: "",
            description: "",
            codePushDone: false,
            showVersion: true,
            splashLoading: new Animated.Value(0),
        };

        this.state.splashLoading.addListener((x) => {
            this.animDone = (x.value === 1);
        });
        setTimeout(() => {
            this.checkForDone();
        }, 400);
    }

    startCodepush() {
        CodePush.getUpdateMetadata().then((metadata) => {
            if (metadata) {
                this.setState({
                    label: metadata.label,
                    version: metadata.appVersion,
                    description: metadata.description,
                });
            }
        });

        let language = getLanguage();
        setLocale(language);

        this.anim = Animated.timing(this.state.splashLoading, {
            toValue: 1,
            duration: 2000,
            easing: Easing.linear,
            useNativeDriver: true,
        });
        this.anim.start();

        CodePush.sync({}, (status: CodePush.SyncStatus) => {
            console.log("CODE PUSH STATUS = ", status)
            switch (status) {
                case CodePush.SyncStatus.AWAITING_USER_ACTION:
                    break;
                case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
                    this.setState({codePushStatus: strings("checking_for_updates")});
                    break;
                case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
                    this.anim.stop();
                    this.setState({codePushStatus: strings("downloading_updates")});
                    break;
                case CodePush.SyncStatus.INSTALLING_UPDATE:
                    this.setState({codePushStatus: strings("installing_updates")});
                    break;
                case CodePush.SyncStatus.SYNC_IN_PROGRESS:
                    break;
                case CodePush.SyncStatus.UNKNOWN_ERROR:
                case CodePush.SyncStatus.UP_TO_DATE:
                    this.setState({codePushDone: true});
                    break;
                case CodePush.SyncStatus.UPDATE_IGNORED:
                    break;
                case CodePush.SyncStatus.UPDATE_INSTALLED:
                    this.setState({codePushStatus: strings("restarting")});
                    setTimeout(() => {
                        CodePush.restartApp(true);
                    }, 1000);
                    break;
                default:
            }
        }, p => {
            const completed = p.receivedBytes / p.totalBytes;
            this.state.splashLoading.setValue(completed);
        });
    }

    componentDidMount() {
       // this.startCodepush();
        setTimeout(() => {
            this.props.onFinishedLoading();
            // this.setState({showVersion: true});
        }, 1000);
    }

    checkForDone() {
        if (this.state.codePushDone && this.animDone)
            this.props.onFinishedLoading();
        else {
            setTimeout(() => {
                this.checkForDone();
            }, 1000);
        }
    }

    render() {
        let rnVersion = this.state.label ? this.state.label.replace(/\D/g, "") : undefined;
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: ColorTheme.appThemeLightest, margin: 0}}>
                <Video
                    source={require("./../../../assets/startup.mp4")}
                    style={styles.backgroundVideo}
                    muted={true}
                    repeat={false}
                    resizeMode={"cover"}
                    rate={1.0}
                    ignoreSilentSwitch={"obey"}
                />
                {this.state.showVersion && <View style={{flex: 1, backgroundColor: "rgba(128, 128, 128, 0.002)", justifyContent: "center"}}>
                    <View style={{width: "100%", position: "absolute", bottom: DeviceInfo.hasNotch() ? 0 : -50}}>
                        <View style={{flexDirection: "row", width: "100%", padding: Constants.defaultPadding}}>
                            <View style={{flex: 1, alignItems: "center"}}>
                                <Text style={[{
                                    textAlign: "center",
                                    color: ColorTheme.appTheme,
                                    fontWeight: "700",
                                    fontSize: 13,

                                }]}> {strings("app_version") + this.state.label}</Text>
                            </View>
                        </View>
                        <Animated.View style={{
                            height: 2,
                            backgroundColor: ColorTheme.appThemeSecond,
                            width: "100%",
                            transform: [{scaleX: this.state.splashLoading}],
                            alignSelf: "flex-start",
                        }}/>
                        <View style={{flexDirection: "row", width: "100%", padding: Constants.defaultPadding}}>
                            <View style={{flex: 1, alignItems: "center"}}>
                                <Text style={[{
                                    textAlign: "center",
                                    color: ColorTheme.appTheme,
                                    fontWeight: "700",
                                    fontSize: 13,
                                    marginBottom: 50
                                }]}> {this.state.codePushStatus}</Text>
                            </View>
                        </View>
                    </View>
                </View>}
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    backgroundVideo: {
        height: height,
        position: "absolute",
        top: 0,
        left: 0,
        alignItems: "stretch",
        bottom: 0,
        right: 0
    }
});
