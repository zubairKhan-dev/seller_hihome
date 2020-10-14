import React, {Component} from "react";
import Modal from "react-native-modal";
import {Text, TouchableOpacity, View, Dimensions, StyleSheet, ScrollView} from "react-native";
import {getCurrentLocale, strings} from "../../../components/Translations";
import Constants from "../../../theme/Constants";
import ColorTheme from "../../../theme/Colors";
import {CommonIcons} from "../../../icons/Common";
import {RTLView} from "react-native-rtl-layout";
import {AppIcon} from "../../../common/IconUtils";

interface Props {
    show: boolean;
    onDismiss: Function;
}

interface State {
    show: boolean;
}

export default class TermsConditions extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
        };
    }

    componentDidMount() {
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            show: newProps.show,
        });
    }


    render() {
        return (
            <Modal
                isVisible={this.props.show}
                onBackButtonPress={() => {
                    this.dismiss();
                }}
                avoidKeyboard={true}
                useNativeDriver={true}
                onBackdropPress={() => this.dismiss()}>
                <View style={{
                    flex: 1,
                    backgroundColor: ColorTheme.white,
                    marginHorizontal: -20,
                    marginVertical: -20,
                    paddingHorizontal: 0,
                    paddingVertical: 20
                }}>
                    <RTLView locale={getCurrentLocale()} style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: Constants.defaultPaddingRegular,
                        paddingHorizontal: 20
                    }}>
                        <View style={{flex: 1}}/>
                        <Text style={[{
                            textAlign: "center", color: "black",
                            fontWeight: "700",
                            fontSize: 18,
                        }]}> {strings("terms_conditions")}</Text>
                        <View style={{flex: 1}}/>
                        <TouchableOpacity onPress={() => {
                            this.dismiss();
                        }}>
                            <AppIcon name={"ic_close"}
                                     color={ColorTheme.appTheme}
                                     provider={CommonIcons}
                                     size={25}/>
                        </TouchableOpacity>
                    </RTLView>
                    <ScrollView style={{paddingHorizontal: Constants.defaultPadding, marginTop: Constants.defaultPaddingMax}}>
                        <Text style={[{
                            textAlign: "right", color: "black",
                            fontWeight: "500",
                            fontSize: 14,
                        }]}> {strings("terms_conditions_text")}</Text>
                    </ScrollView>
                </View>
            </Modal>
        );
    }

    private dismiss() {
        this.props.onDismiss();
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
    },
    pdf: {
        flex:1,
        width:Dimensions.get('window').width,
        height:Dimensions.get('window').height,
    }
});
