import React, {Component} from "react";
import Modal from "react-native-modal";
import ColorTheme from "../../theme/Colors";
import DatePicker from "react-native-date-picker";
import {StaticStyles} from "../../theme/Styles";
import Constants from "../../theme/Constants";
import {View} from "react-native";
import {getCurrentLocale, strings} from "../Translations";
import ActionButton from "../ActionButton";
import {RTLView} from "react-native-rtl-layout";

interface Props {
    show: boolean;
    date?: Date;
    minimumDate?: Date,
    onDismiss: Function;
    onSaveDate: Function;
}

interface State {
    currentDate: Date;
}

export default class HHDatePickerView extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {currentDate: this.props.date ? this.props.date : new Date()}
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
                    height: 300,
                    backgroundColor: ColorTheme.white,
                    borderRadius: Constants.messageViewCornerRadius,
                    padding: Constants.defaultPaddingMax,
                    justifyContent: "center"
                }]}>
                    <DatePicker
                        date={this.state.currentDate}
                        mode={"date"}
                        minimumDate={this.props.minimumDate}
                        onDateChange={(date) => {
                            this.setState({currentDate: date});
                        }}
                    />
                    <RTLView style={{marginTop: Constants.defaultPaddingRegular, flex: 1, alignItems: "center"}}
                             locale={getCurrentLocale()}>
                        <View style={{flex: 1}}>
                            <ActionButton variant={"alt"} title={strings("cancel")} onPress={() => {
                                this.props.onDismiss()
                            }}/>
                        </View>
                        <View style={{width: Constants.defaultPadding}}/>
                        <View style={{flex: 1}}>
                            <ActionButton variant={"normal"} title={strings("save")} onPress={() => {
                                setTimeout(() => {
                                    this.props.onSaveDate(this.state.currentDate)
                                }, 100);
                            }}/>
                        </View>
                    </RTLView>
                </View>
            </Modal>
        );
    }
}
