import * as React from "react";
import {Component} from "react";
import {Image, KeyboardTypeOptions, Platform, StyleSheet,Dimensions, TextInput, TouchableOpacity, View} from "react-native";
import ColorTheme from "../../theme/Colors";
import {RTLView} from "react-native-rtl-layout";
import {getCurrentLocale, isRTLMode} from "../Translations";
import HFTextRegular from "../HFText/HFTextRegular";

interface Props {
    title: string,
    placeholder?: string,
    secure?: boolean,
    keyboard?: KeyboardTypeOptions,
    text?: string,
    hideBottomBorder?: boolean,
    editable?: boolean,
    value(text: string): void;
}

interface State {
    icon: any;
    hidePassword?: boolean;
}

const size = Dimensions.get('window').height


export default class TextKVInput extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {hidePassword: true, icon: require('../../../assets/images/hidden.png')}
    }

    getEyeIcon() {
        if (this.state.hidePassword) {
            return require('../../../assets/images/eye.png');
        } else {
            return require('../../../assets/images/hidden.png');
        }
    }

    render() {

        return (
            <View style={[styles.container]}>
                {this.props.title.length > 0 && <View>
                    <HFTextRegular value={this.props.title}/>
                    <View style={{height: 5}}/>
                </View>}
                <RTLView locale={getCurrentLocale()}>
                    <TextInput placeholderTextColor={ColorTheme.placeholder}
                               returnKeyType={'done'}
                               editable={this.props.editable}
                               placeholder={this.props.placeholder}
                               keyboardType={this.props.keyboard}
                               secureTextEntry={this.props.secure && this.state.hidePassword}
                               value={this.props.text}
                               style={{
                                   flex: 1,
                                   height: Platform.OS === "ios" ? 30 : 35,
                                   color: this.props.editable ? ColorTheme.textDark: ColorTheme.grey ,
                                   textAlign: isRTLMode() ? "right" : "left"
                               }}
                               onChangeText={(text) => this.props.value(text)}>
                    </TextInput>
                    {this.props.secure &&
                    <View style={{padding: 5,position:'absolute',right:"1%", justifyContent:"center"}}>
                        <TouchableOpacity onPress={() => {
                            this.setState({
                                hidePassword: !this.state.hidePassword,
                                icon: this.getEyeIcon()
                            })
                        }}>
                            <Image resizeMode='contain' style={{width: size/20, height: size/31, alignSelf: "center"}} source={this.state.icon}/>
                        </TouchableOpacity>
                    </View>
                    }
                </RTLView>
                {!this.props.hideBottomBorder && <View style={{height: 1, backgroundColor: this.props.editable ? ColorTheme.appThemeLight : ColorTheme.grey_add}}/>}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {},
});
