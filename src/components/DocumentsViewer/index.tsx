import React, {Component} from "react";
import {TouchableOpacity, View} from "react-native";
import ColorTheme from "../../theme/Colors";
import {StaticStyles} from "../../theme/Styles";
import {SliderBox} from "react-native-image-slider-box";
import FastImage from "react-native-fast-image";
import Modal from "react-native-modal";
import {AppIcon} from "../../common/IconUtils";
import {CommonIcons} from "../../icons/Common";
import {SafeAreaView} from "react-navigation";
import Constants from "../../theme/Constants";
import {windowHeight} from "../../common";

interface Props {
    show: boolean;
    onDismiss: Function;
    documents: any[];
}

interface State {
    show: boolean;
}

export default class DocumentsViewer extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
        };
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            show: newProps.show,
        });
    }

    render() {
        return (
            <Modal
                onBackdropPress={() => this.props.onDismiss()}
                isVisible={this.props.show}
                onBackButtonPress={() => {
                }}
                backdropColor={ColorTheme.lightGrey}
                backdropOpacity={1}
                avoidKeyboard={true}
                useNativeDriver={true}
                style={{marginHorizontal: Constants.defaultPaddingMin}}
            >
                <SafeAreaView style={{flex: 1}}>
                    <View style={[StaticStyles.flexOne]}>
                        <View style={{height: 40}}/>
                        <TouchableOpacity onPress={() => {
                            this.props.onDismiss();
                        }}>
                            <AppIcon name={"ic_close"}
                                     color={ColorTheme.appTheme}
                                     provider={CommonIcons}
                                     size={30}/>
                        </TouchableOpacity>
                        <View style={{height: Constants.defaultPadding}}/>
                        <View style={[StaticStyles.flexOne, {marginHorizontal: Constants.defaultPaddingMin, borderRadius: Constants.defaultPaddingMin, overflow: "hidden"}]}>
                            <SliderBox
                                ImageComponent={FastImage}
                                sliderBoxHeight={windowHeight - 200}
                                sliderBoxWidth={200}
                                images={this.props.documents}
                                onCurrentImagePressed={index => {
                                }}
                                currentImageEmitter={index => {
                                }}
                                // paginationBoxStyle={{backgroundColor: ColorTheme.black}}
                                circleLoop
                                resizeMethod={'resize'}
                                resizeMode={'contain'}
                                dotColor={ColorTheme.appTheme}
                                inactiveDotColor={"rgba(128, 128, 128, 0.02)"}
                                dotStyle={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: 4,
                                    marginHorizontal: -5,
                                    borderWidth: 1,
                                    borderColor: ColorTheme.appThemeLight,
                                    padding: 0,
                                    margin: 0,
                                    marginBottom: 8
                                }}

                            />
                        </View>
                    </View>
                </SafeAreaView>
            </Modal>
        );
    }
}
