import * as React from "react";
import {Component} from "react";
import {Platform, StyleSheet, TextInput, View} from "react-native";
import ColorTheme from "../../theme/Colors";
import {RTLView} from "react-native-rtl-layout";
import {getCurrentLocale, isRTLMode} from "../Translations";
import HFTextRegular from "../HFText/HFTextRegular";
import HHDatePickerView from "./HHDatePickerView";
import {CommonIcons} from "../../icons/Common";
import {AppIcon} from "../../common/IconUtils";
import moment from "moment";
import Constants from "../../theme/Constants";
import { TouchableOpacity } from "react-native";

interface Props {
    title: string,
    editable?: boolean,
    date?: Date,
    minimumDate?: Date,
    value(newDate: Date): void;
}

interface State {
    showCalendar: boolean;
}

export default class HHDatePicker extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {showCalendar: false}
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
                               value={
                                   moment(this.props.date).format(Constants.dateFormat)}
                               style={{
                                   flex: 1,
                                   height: Platform.OS === "ios" ? 30 : 40,
                                   color: this.props.editable ? ColorTheme.textDark : ColorTheme.grey,
                                   textAlign: isRTLMode() ? "right" : "left"
                               }}
                               onChangeText={(text) => {
                               }}>
                    </TextInput>
                    {this.props.editable && <TouchableOpacity style={{marginTop: Constants.defaultPaddingMin}} onPress={() => {
                        this.setState({showCalendar: true});
                    }}>
                        <AppIcon name={"calendar"}
                                 color={ColorTheme.appTheme}
                                 provider={CommonIcons}
                                 size={15}/>
                    </TouchableOpacity>}
                </RTLView>
                <View style={{
                    height: 1,
                    backgroundColor: this.props.editable ? ColorTheme.appThemeLight : ColorTheme.grey_add
                }}/>
                <HHDatePickerView
                    onDismiss={() => {
                        this.setState({showCalendar: false})
                    }}
                    date={this.props.date}
                    show={this.state.showCalendar}
                    minimumDate={this.props.minimumDate}
                    onSaveDate={(dateValue) => {
                        this.props.value(dateValue);
                        this.setState({showCalendar: false});
                    }}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {},
});
