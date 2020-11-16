import * as React from "react";
import {Component} from "react";
import {KeyboardTypeOptions, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import ColorTheme from "../../theme/Colors";
import {RTLView} from "react-native-rtl-layout";
import {getCurrentLocale, isRTLMode} from "../Translations";
import Constants from "../../theme/Constants";
import {CommonIcons} from "../../icons/Common";
import {AppIcon} from "../../common/IconUtils";

interface Props {
    placeholder?: string,
    dropdown?: boolean,
    textView?: boolean,
    keyboard?: KeyboardTypeOptions,
    text?: string,

    value(text: string): void;

    showOptions?: Function;
    showTextView?: Function;
}

interface State {
    icon: any;
    text?: string,
}

export default class TextFormInput extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {icon: "arrow_down"}
    }

    componentWillReceiveProps(nextProps: Readonly<Props>, nextContext: any) {
        this.setState({
            text: nextProps.text,
        });
    }

    render() {
        return (
            <View><View style={[styles.container]}>
                <View style={{flex: 1, overflow: "hidden"}}>
                    <RTLView locale={getCurrentLocale()}>
                        {this.props.dropdown &&
                        <View style={{justifyContent: "center", height: this.props.textView ? 60 : 35, flex: 1}}>
                            <View style={{flex: 1}}/>
                            <Text numberOfLines={1} style={{
                                fontSize: 12,
                                color: ColorTheme.black,
                                fontWeight: "300",
                                textAlign: isRTLMode() ? "right" : "left",
                            }}>{this.state.text ? this.state.text : this.props.placeholder}
                            </Text>
                            <View style={{flex: 1}}/>
                        </View>}
                        {!this.props.dropdown && <TextInput textAlignVertical={'top'}
                                                            returnKeyType={'done'}
                                                            editable={this.props.dropdown ? !this.props.dropdown : this.props.textView ? !this.props.textView : true}
                                                            multiline={this.props.textView}
                                                            placeholderTextColor={ColorTheme.placeholder}
                                                            placeholder={this.props.placeholder}
                                                            keyboardType={!this.props.textView ? this.props.keyboard : undefined}
                                                            value={this.props.text}
                                                            style={{
                                                                flex: 1,
                                                                fontSize: 12,
                                                                height: this.props.textView ? 60 : 35,
                                                                color: ColorTheme.black,
                                                                fontWeight: "300",
                                                                textAlign: isRTLMode() ? "right" : "left"
                                                            }}
                                                            onChangeText={(text) => this.props.value(text)}>
                        </TextInput>}
                        {this.props.dropdown &&
                        <View style={{padding: 5, justifyContent: "center"}}>
                            <AppIcon name={"arrow_down"}
                                     color={ColorTheme.black}
                                     provider={CommonIcons}
                                     size={10}/>
                        </View>
                        }
                    </RTLView>
                    {(this.props.dropdown || this.props.textView) && <TouchableOpacity style={{
                        flex: 1,
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0
                    }} onPress={() => {
                        if (this.props.dropdown) {
                            this.props.showOptions();
                        } else if (this.props.textView) {
                            this.props.showTextView();
                        }
                    }}>
                    </TouchableOpacity>}
                </View>
            </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        borderColor: ColorTheme.placeholder,
        borderWidth: 1,
        borderRadius: 3,
        paddingHorizontal: Constants.defaultPadding,
        marginTop: Constants.defaultPaddingMin
    },
});
