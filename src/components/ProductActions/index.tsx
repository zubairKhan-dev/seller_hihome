import React, {Component} from "react";
import Modal from "react-native-modal";
import {Text, View} from "react-native";
import ColorTheme from "../../theme/Colors";
import {StaticStyles} from "../../theme/Styles";
import Constants from "../../theme/Constants";
import {strings} from "../Translations";
import ActionButton from "../ActionButton";
import ActionIconButton from "../ActionButton/ActionIconButton";

interface Props {
    show: boolean;
    onDismiss: Function;
    onEdit?: Function;
    onDelete?: Function;
    details?: any;
}

interface State {
    value?: any;
    selectedTab?: number;
}

export default class ProductActions extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 0,
        };
    }

    render() {
        return (
            <Modal
                style={{marginBottom: 10, justifyContent: 'flex-end', marginHorizontal: 0}}
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
                    height: 250,
                    marginBottom: -20,
                    backgroundColor: ColorTheme.white,
                    borderRadius: 0,
                    overflow: "hidden",
                    justifyContent: "center",
                }]}>
                    <View style={{}}>
                        <Text style={[{
                            fontWeight: "600",
                            textAlign: "center",
                            textAlignVertical: "bottom",
                            color: ColorTheme.textDark
                        }]}>{strings("select_action")}</Text>
                    </View>
                    <View style={{height: Constants.defaultPadding}}/>
                    <View style={{paddingHorizontal: Constants.defaultPaddingMax}}>
                        <ActionIconButton icon={"edit"} textColor={ColorTheme.white} backgroundColor={ColorTheme.appThemeSecond}
                                          onPress={() => {
                                              this.props.onEdit();
                                          }} title={strings("edit_food")} iconColor={ColorTheme.white}/>
                    </View>
                    <View style={{height: Constants.defaultPadding}}/>
                    <View style={{paddingHorizontal: Constants.defaultPaddingMax}}>
                        <ActionIconButton icon={"delete"} onPress={() => {
                            this.props.onDelete();
                        }} title={strings("delete_food")} textColor={ColorTheme.white} backgroundColor={ColorTheme.appTheme}
                                          iconColor={ColorTheme.white}/>
                    </View>
                    <View style={{height: Constants.defaultPaddingMax}}/>
                    <View style={{paddingHorizontal: Constants.defaultPaddingMax}}>
                        <ActionButton title={strings("cancel")} variant={"alt"} onPress={() => {
                            this.props.onDismiss();
                        }}/>
                    </View>
                </View>
            </Modal>
        );
    }

}
