import React, {Component} from "react";
import Modal from "react-native-modal";
import {FlatList, Text, View} from "react-native";
import ColorTheme from "../../theme/Colors";
import {StaticStyles} from "../../theme/Styles";
import Constants from "../../theme/Constants";
import {TouchableOpacity} from "react-native";
import {getCurrentLocale} from "../Translations";
import {RTLView} from "react-native-rtl-layout";
import {CommonIcons} from "../../icons/Common";
import {AppIcon} from "../../common/IconUtils";

interface Props {
    show: boolean;
    onValueChange: Function;
    onDismiss: Function;
    values: any[];
    selectedValue?: any;
}

interface State {
    value?: any;
}

export default class HHPickerView extends Component<Props, State> {
    constructor(props) {
        super(props);
    }

    renderFoodItem(option: any, index: number) {
        let selItem = this.props.selectedValue.id === this.props.values[index].id;
        return (
            <View style={{
                marginTop: Constants.defaultPadding,
                backgroundColor: selItem ? ColorTheme.appThemeLight : ColorTheme.white,
                paddingHorizontal: Constants.defaultPadding,
                paddingVertical: Constants.defaultPadding,
                justifyContent: "center",
                borderRadius: Constants.defaultPaddingMin
            }}>
                <RTLView locale={getCurrentLocale()}
                         style={{alignItems: "center", paddingHorizontal: Constants.defaultPadding}}>
                    <Text numberOfLines={1} style={[StaticStyles.heavyFont, {color: selItem ?  ColorTheme.appTheme : ColorTheme.textGreyDark}]}>
                        {option.name}
                    </Text>
                    <View style={{flex: 1}}/>
                    {selItem && <AppIcon name={"check"}
                                         color={ColorTheme.appTheme}
                                         provider={CommonIcons}
                                         size={10}/>}
                </RTLView>
            </View>);

    }

    render() {
        return (
            <Modal
                onBackdropPress={() => this.props.onDismiss()}
                isVisible={this.props.show}
                onBackButtonPress={() => {
                    this.props.onValueChange();
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
                    <FlatList
                        horizontal={false}
                        style={[StaticStyles.flexOne, {paddingVertical: 0}]}
                        data={this.props.values}
                        renderItem={({item, index}) =>
                            <TouchableOpacity onPress={() => {
                                this.props.onValueChange(item, index);
                            }}>
                                {this.renderFoodItem(item, index)}
                            </TouchableOpacity>
                        }
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item, index) => "" + index}
                    />
                </View>
            </Modal>
        );
    }

}
