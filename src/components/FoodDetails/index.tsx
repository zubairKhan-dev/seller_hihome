import React, {Component} from "react";
import Modal from "react-native-modal";
import {ScrollView, Text, View} from "react-native";
import ColorTheme from "../../theme/Colors";
import {StaticStyles} from "../../theme/Styles";
import Constants from "../../theme/Constants";
import FastImage from "react-native-fast-image";
import {windowWidth} from "../../common";
import {SliderBox} from "react-native-image-slider-box";
import BorderButton from "../ActionButton/BorderButton";
import {RTLView} from "react-native-rtl-layout";
import {isRTLMode, strings} from "../Translations";
import RoundButton from "../ActionButton/RoundButton";

interface Props {
    show: boolean;
    onDismiss: Function;
    onEdit?: Function;
    details?: any;
}

interface State {
    value?: any;
    selectedTab?: number;
}

export default class FoodDetails extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 0,
        };
    }

    render() {
        return (
            <Modal
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
                    flex: 1,
                    marginVertical: 50,
                    backgroundColor: ColorTheme.white,
                    borderRadius: Constants.viewCornerRadius,
                    overflow: "hidden"
                }]}>
                    <SliderBox
                        parentWidth={windowWidth - 2 * Constants.defaultPadding}
                        ImageComponent={FastImage}
                        sliderBoxHeight={300}
                        sliderBoxWidth={windowWidth - 2 * Constants.defaultPadding}
                        images={this.props.details?.images}
                        onCurrentImagePressed={index => {
                        }}
                        currentImageEmitter={index => {
                        }}
                        circleLoop
                        resizeMethod={'resize'}
                        resizeMode={'cover'}
                        dotColor={ColorTheme.white}
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
                            opacity: 0.65
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
                    <View style={{padding: Constants.defaultPaddingRegular}}>
                        <Text style={[StaticStyles.regularFont, {
                            fontSize: 18,
                            textAlign: isRTLMode() ? "right" : "left",
                            color: ColorTheme.appTheme,
                            marginBottom: Constants.defaultPadding
                        }]}>{this.props.details?.name}</Text>
                        <RTLView style={{
                            alignItems: "center",
                            marginTop: Constants.defaultPadding
                        }}>
                            <View style={{flex: 1}}>
                                <BorderButton selected={this.state.selectedTab === 0} title={strings("ingredients").toUpperCase()} onPress={() => {
                                    this.setState({selectedTab: 0});
                                }}/>
                            </View>
                            <View style={{width: Constants.defaultPadding}}/>
                            <View style={{flex: 1}}>
                                <BorderButton selected={this.state.selectedTab === 1} title={strings("recipes").toUpperCase()} onPress={() => {
                                    this.setState({selectedTab: 1});
                                }}/>
                            </View>
                        </RTLView>
                    </View>
                    <ScrollView style={{marginHorizontal: Constants.defaultPaddingMax, marginBottom: Constants.defaultPaddingMax}}>
                        <Text style={[StaticStyles.lightFont, {
                            fontSize: 12,
                            textAlign: isRTLMode() ? "right" : "left",
                            color: ColorTheme.textDark,
                            marginBottom: Constants.defaultPadding
                        }]}>{this.state.selectedTab === 0 ? this.props.details?.ingredients : this.props.details?.description}</Text>
                    </ScrollView>

                    <View style={{
                        position: "absolute",
                        top: Constants.defaultPaddingRegular,
                        right: Constants.defaultPaddingRegular
                    }}>
                        <RoundButton image={"arrow_down"} onPress={() => {
                            this.props.onDismiss()
                        }}/>
                    </View>
                    <View style={{
                        position: "absolute",
                        top: Constants.defaultPaddingRegular,
                        left: Constants.defaultPaddingRegular,
                    }}>
                        <RoundButton image={"edit"} onPress={() => {
                            this.props.onEdit()
                        }}/>
                    </View>
                </View>
            </Modal>
        );
    }

}
