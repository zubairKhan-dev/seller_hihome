import React, {Component} from "react";
import Modal from "react-native-modal";
import {FlatList, Text, View} from "react-native";
import ColorTheme from "../../theme/Colors";
import {StaticStyles} from "../../theme/Styles";
import Constants from "../../theme/Constants";
import {TouchableOpacity} from "react-native";
import {getCurrentLocale, strings} from "../Translations";
import {RTLView} from "react-native-rtl-layout";
import {CommonIcons} from "../../icons/Common";
import {AppIcon} from "../../common/IconUtils";

interface Props {
    show: boolean;
    onCameraSelected: Function;
    onGallerySelected: Function;
    onDismiss: Function;
}

interface State {
    value?: any;
}

export default class ImageUploadView extends Component<Props, State> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Modal
                onBackdropPress={() => this.props.onDismiss()}
                isVisible={this.props.show}
                onBackButtonPress={() => {
                    this.props.onDismiss();
                }}
                backdropColor={ColorTheme.black}
                backdropOpacity={0.5}
                avoidKeyboard={true}
                useNativeDriver={true}
            >
                <View style={[StaticStyles.shadow, {
                    height: 200,
                    backgroundColor: ColorTheme.white,
                    borderRadius: Constants.defaultPadding,
                    padding: Constants.defaultPadding,
                    justifyContent: "center"
                }]}>
                    <Text numberOfLines={1} style={[StaticStyles.heavyFont, {color: ColorTheme.textGreyDark, textAlign: "center"}]}>
                        {"Select image from "}
                    </Text>
                    <View style={{height: Constants.defaultPaddingRegular}}/>
                    <RTLView locale={getCurrentLocale()}
                             style={{alignItems: "center", justifyContent: "center"}}>
                        <View style={[StaticStyles.shadow, {
                            height: 120,
                            width: 120,
                            backgroundColor: ColorTheme.white,
                            borderRadius: Constants.defaultPadding,
                            padding: Constants.defaultPaddingMin,
                            justifyContent: "center"
                        }]}>
                            <TouchableOpacity onPress={() => {
                                this.props.onCameraSelected();
                            }}>
                                <View style={[{
                                    height: 110,
                                    width: 110,
                                    backgroundColor: ColorTheme.appTheme,
                                    borderRadius: 8,
                                    padding: Constants.defaultPaddingMin,
                                    justifyContent: "center",
                                    alignItems: "center"
                                }]}>
                                    <AppIcon name={"camera"}
                                             color={ColorTheme.white}
                                             provider={CommonIcons}
                                             size={60}/>
                                    <View style={{height: Constants.defaultPadding}}/>
                                    <Text style={[StaticStyles.regularFont, {color: ColorTheme.white, textAlign: "center"}]}>
                                        {strings("camera")}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{width: Constants.defaultPaddingRegular}}/>
                        <View style={[StaticStyles.shadow, {
                            height: 120,
                            width: 120,
                            backgroundColor: ColorTheme.white,
                            borderRadius: Constants.defaultPadding,
                            padding: Constants.defaultPaddingMin,
                            justifyContent: "center"
                        }]}>
                            <TouchableOpacity onPress={() => {
                                this.props.onGallerySelected();
                            }}>
                                <View style={[{
                                    height: 110,
                                    width: 110,
                                    backgroundColor: ColorTheme.appTheme,
                                    borderRadius: 8,
                                    padding: Constants.defaultPaddingMin,
                                    justifyContent: "center",
                                    alignItems: "center"

                                }]}>
                                    <AppIcon name={"gallery"}
                                             color={ColorTheme.white}
                                             provider={CommonIcons}
                                             size={60}/>
                                    <View style={{height: Constants.defaultPadding}}/>
                                    <Text numberOfLines={1} style={[StaticStyles.regularFont, {color: ColorTheme.white, textAlign: "center"}]}>
                                        {strings("gallery")}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </RTLView>
                </View>
            </Modal>
        );
    }

}
