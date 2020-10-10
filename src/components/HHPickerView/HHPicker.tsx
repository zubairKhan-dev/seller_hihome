import * as React from "react";
import {Component} from "react";
import {StyleSheet, TextInput, View} from "react-native";
import ColorTheme from "../../theme/Colors";
import {RTLView} from "react-native-rtl-layout";
import {getCurrentLocale, isRTLMode} from "../Translations";
import HFTextRegular from "../HFText/HFTextRegular";
import {TouchableOpacity} from "react-native";
import {CommonIcons} from "../../icons/Common";
import {AppIcon} from "../../common/IconUtils";
import moment from "moment";
import Constants from "../../theme/Constants";
import HHPickerView from "./index";

interface Props {
    title: string,
    editable?: boolean,
    selectedOption?: any;
    options?: any[];
    value(newValue: any): void;
}

interface State {
    showPickerView: boolean;
    selectedOption: any;
}

export default class HHPicker extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {showPickerView: false, selectedOption: this.props.selectedOption ? this.props.selectedOption : {}}
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
                               editable={false}
                               value={this.state.selectedOption}
                               style={{
                                   flex: 1,
                                   height: 30,
                                   color: this.props.editable ? ColorTheme.black : ColorTheme.grey,
                                   textAlign: isRTLMode() ? "right" : "left"
                               }}
                               onChangeText={(text) => {
                               }}>
                    </TextInput>
                    {this.props.editable && <TouchableOpacity style={{marginTop: Constants.defaultPaddingMin}} onPress={() => {
                        this.setState({showPickerView: true});
                    }}>
                        <AppIcon name={"arrow_down"}
                                 color={ColorTheme.appTheme}
                                 provider={CommonIcons}
                                 size={15}/>
                    </TouchableOpacity>}
                </RTLView>
                <View style={{
                    height: 1,
                    backgroundColor: this.props.editable ? ColorTheme.appThemeLight : ColorTheme.grey_add
                }}/>
                <HHPickerView show={this.state.showPickerView}
                              onDismiss={() => this.setState({showPickerView: false})}
                              onValueChange={(value, index) => {
                                  this.setState({showPickerView: false, selectedOption: value})
                              }}
                              selectedValue={this.state.selectedOption}
                              values={this.props.options}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {},
});
