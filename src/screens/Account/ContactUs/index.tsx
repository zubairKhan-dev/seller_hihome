import * as React from "react";
import {Component} from "react";
import {KeyboardAvoidingView, StyleSheet, Text, TextInput, View, Platform} from "react-native";
import ColorTheme from "../../../theme/Colors";
import {StaticStyles} from "../../../theme/Styles";
import Constants from "../../../theme/Constants";
import {RTLText, RTLView} from "react-native-rtl-layout";
import {getCurrentLocale, isRTLMode, strings} from "../../../components/Translations";
import {TouchableOpacity} from "react-native";
import {AppIcon} from "../../../common/IconUtils";
import {CommonIcons} from "../../../icons/Common";
import {SafeAreaView} from "react-navigation";
import ActionButton from "../../../components/ActionButton";
import ImageUploadView from "../../../components/ImageUpload";
import ImagePicker from "react-native-image-picker";
import FastImage from "react-native-fast-image";
import DocumentsViewer from "../../../components/DocumentsViewer";
import LoadingOverlay from "../../../components/Loading";
import { showMessageAlert } from "../../../common";
import * as Api from "../../../lib/api";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import { showMessage } from "react-native-flash-message";

const photo = {uri: "", data: {}, add: false};

interface Props {
    navigation: any;
}


const options = {
    title: 'Select Avatar',
    customButtons: [{name: 'fb', title: 'Choose Photo from Facebook'}],
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
    quality: 0.5
};

interface State {
    loading?: boolean;
    reload?: boolean;
    message: string;
    uploadImage?: boolean;
    showDocumentsViewer?: boolean;
    photo: any;
}

export default class ContactUs extends Component<Props, State> {
    apiHandler: any;
    apiExHandler: any;
    constructor(props) {
        super(props);
        this.state = {reload: false, message: "", photo: photo, showDocumentsViewer: false,};
    }

    UNSAFE_componentWillReceiveProps(nextProps: Readonly<Props>, nextContext: any) {
        this.setState({photo: photo});
    }

    componentDidMount(): void {

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
                        <TouchableOpacity onPress={() => {
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

    launchCamera() {
        ImagePicker.launchCamera(options, (response) => {
            if (!response.didCancel) {
                let photo = this.state.photo;
                if (photo.uri.length === 0 && !photo.add) {
                    photo.uri = response.uri;
                    photo.data = response;
                }
            }
            this.setState({uploadImage: false})
        });
    }

    launchGallery() {
        ImagePicker.launchImageLibrary(options, (response) => {
            if (!response.didCancel) {
                let photo = this.state.photo;
                if (photo.uri.length === 0 && !photo.add) {
                    photo.uri = response.uri;
                    photo.data = response;
                }
            }
            this.setState({uploadImage: false})
        });
    }


    private removeMainPhoto() {
        let mainPic = this.state.photo;
        mainPic.uri = "";
        mainPic.name = "";
        mainPic.data = undefined;
        this.setState({photo: mainPic});
    }

    private sendFeedback() {
        if (this.state.message && this.state.message.length > 5) {
            this.setState({loading: true});
            let formData = new FormData();
            if (this.state.photo.uri.length > 0) {
                formData.append("attachment", {
                    name: "test",
                    type: this.state.photo.data.type,
                    uri: Platform.OS === "android" ? photo.uri : photo.uri.replace("file://", "")
                });
            }
            formData.append("body", this.state.message);
            this.apiHandler = (response) => {
                Api.checkValidationError(response, resp => {
                    if (response.status === 1) {
                        this.setState({message: ""});
                        // analytics().logEvent('Contact_Us', {
                        //     data: formData,
                        // });
                        this.removeMainPhoto();
                        setTimeout(() => {
                            showMessageAlert(response.message);
                        }, 400);
                    }
                    this.setState({loading: false});
                }, (errors, errorMessage) => {
                    setTimeout(() => {
                        showMessageAlert(errorMessage);
                    }, 400);
                    this.setState({loading: false});
                });
            };
            this.apiExHandler = (reason) => {
                setTimeout(() => {
                    showMessageAlert(reason);
                }, 400);
                this.setState({loading: false});
            };
            Api.sendFeedback(formData)
                .then((response) => {
                        this.apiHandler(response);
                    },
                ).catch((reason => {
                    this.apiExHandler(reason);
                }),
            );
        } else {
            showMessage({
                message: strings("minimum_five_character"),
                type: "danger",
                icon: "info",
                duration: 4000
            });
        }

    }
    render() {
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: ColorTheme.white}}>
                {this.renderHeader()}
                <KeyboardAwareScrollView style={{flex: 1}}>
                    <View style={{
                        flex: 1,
                        paddingHorizontal: Constants.defaultPaddingRegular,
                        paddingVertical: Constants.defaultPaddingMax
                    }}>
                        <RTLText fontSize={Constants.regularFontSize} locale={getCurrentLocale()}
                                 style={[{
                                     fontWeight: "500",
                                     color: ColorTheme.textDark,
                                     textAlign: isRTLMode() ? "right" : "left"
                                 }]}>{strings("message")}</RTLText>
                        <View style={{height: Constants.defaultPadding}}/>
                        <TextInput textAlignVertical={'top'}
                                   returnKeyType={'done'}
                                   editable={true}
                                   multiline={true}
                                   placeholderTextColor={ColorTheme.placeholder}
                                   placeholder={strings("enter_content_here")}
                                   value={this.state.message}
                                   style={{
                                       fontSize: 14,
                                       paddingHorizontal: Constants.defaultPadding,
                                       height: 100,
                                       backgroundColor: ColorTheme.lightGrey,
                                       color: ColorTheme.black,
                                       fontWeight: "300",
                                       textAlign: isRTLMode() ? "right" : "left",
                                       borderRadius: Constants.defaultPaddingMin
                                   }}
                                   onChangeText={(text) => this.setState({message: text})}>
                        </TextInput>
                        <RTLView style={{marginTop: Constants.defaultPaddingRegular}} locale={getCurrentLocale()}>
                            <TouchableOpacity onPress={() => {
                                if (this.state.photo.uri === "") {
                                    this.setState({uploadImage: true});
                                } else {
                                    this.setState({showDocumentsViewer: true});
                                }
                            }}>
                                {this.state.photo.uri === "" && <View style={{
                                    width: 100,
                                    height: 100,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderWidth: 0.5,
                                    borderColor: ColorTheme.grey,
                                    borderStyle: "dashed",
                                    backgroundColor: ColorTheme.lightGrey
                                }}>
                                    <AppIcon name={"attachment"}
                                             color={ColorTheme.grey_add}
                                             provider={CommonIcons}
                                             size={30}/>
                                    <View style={{height: Constants.defaultPadding}}/>
                                    <RTLText fontSize={Constants.regularSmallerFontSize} locale={getCurrentLocale()}
                                             style={[{
                                                 fontWeight: "200",
                                                 color: ColorTheme.grey,
                                                 textAlign: "center"
                                             }]}>{strings("upload_image")}</RTLText>
                                </View>}
                                {this.state.photo.uri.length > 0 && <View style={{
                                    width: 100,
                                    height: 100,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderWidth: 0.5,
                                    borderColor: ColorTheme.grey,
                                    borderStyle: "dashed",
                                    backgroundColor: ColorTheme.lightGrey
                                }}>
                                    <FastImage
                                        style={{
                                            width: 100,
                                            height: 100
                                        }}
                                        source={{
                                            uri: this.state.photo.uri,
                                            priority: FastImage.priority.normal,
                                        }}
                                        onLoadStart={() => {
                                        }}
                                        onLoadEnd={() => {
                                        }}
                                    />
                                </View>}
                            </TouchableOpacity>
                            <View style={{
                                flex: 1,
                                paddingHorizontal: Constants.defaultPaddingMax,
                                justifyContent: "center"
                            }}>
                                <RTLText fontSize={Constants.regularSmallerFontSize} locale={getCurrentLocale()}
                                         style={[{
                                             fontWeight: "500",
                                             color: ColorTheme.textDark,
                                             textAlign: isRTLMode() ? "right" : "left"
                                         }]}>{strings("attach_your_image")}</RTLText>
                                <View style={{height: Constants.defaultPadding}}/>
                                <RTLText fontSize={Constants.regularSmallerFontSize} locale={getCurrentLocale()}
                                         style={[{
                                             fontWeight: "300",
                                             color: ColorTheme.grey,
                                             textAlign: isRTLMode() ? "right" : "left"
                                         }]}>{strings("max_image_size")}</RTLText>
                                {this.state.photo.uri.length > 0 && <TouchableOpacity onPress={() => {
                                    this.removeMainPhoto();
                                }}>
                                    <View style={{height: Constants.defaultPadding}}/>
                                    <RTLText fontSize={Constants.regularSmallerFontSize} locale={getCurrentLocale()}
                                             style={[{
                                                 fontWeight: "300",
                                                 color: "red",
                                                 textAlign: isRTLMode() ? "right" : "left"
                                             }]}>{strings("delete")}</RTLText>
                                </TouchableOpacity>}
                            </View>
                        </RTLView>
                        <View style={{flex: 1}}/>
                        <RTLView style={{marginTop: Constants.defaultPaddingRegular, flex: 1, alignItems: "center"}}
                                 locale={getCurrentLocale()}>
                            <View style={{flex: 1}}>
                                <ActionButton variant={"alt"} title={strings("cancel")} onPress={() => {
                                     this.props.navigation.goBack();
                                }}/>
                            </View>
                            <View style={{width: Constants.defaultPadding}}/>
                            <View style={{flex: 1}}>
                                <ActionButton variant={"normal"} title={strings("send_email")} onPress={() => {
                                     this.sendFeedback();
                                }}/>
                            </View>
                        </RTLView>
                    </View>
                    <ImageUploadView show={this.state.uploadImage}
                                     onDismiss={() => {
                                         this.setState({uploadImage: false})
                                     }}
                                     onCameraSelected={() => {
                                         this.launchCamera();
                                     }}
                                     onGallerySelected={() => {
                                         this.launchGallery();
                                     }}
                    />
                    <DocumentsViewer show={this.state.showDocumentsViewer}
                                     onDismiss={() => {
                                         this.setState({showDocumentsViewer: false})
                                     }}
                                     documents={[this.state.photo.uri]}
                    />
                </KeyboardAwareScrollView>
                {this.state.loading && <LoadingOverlay/>}
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
