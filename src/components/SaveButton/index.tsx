import React, {Component} from "react";
import {Text, View} from "react-native";
import ColorTheme from "../../theme/Colors";
import {StaticStyles} from "../../theme/Styles";
import {TouchableOpacity} from "react-native";

interface Props {
    onPress: Function;
    title?: string;
    variant?: string;
}

interface State {
    show: boolean;
}

export default class SaveButton extends Component<Props, State> {
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
        let backColor = this.props.variant === "alt" ? ColorTheme.appTheme : ColorTheme.white;
        let titleColor = this.props.variant === "alt" ? ColorTheme.white : ColorTheme.black;
        let alt = this.props.variant === "alt";
        return (
            <TouchableOpacity onPress={() => {
                this.props.onPress()
            }}>
                <View style={[StaticStyles.center, {
                    borderColor: ColorTheme.placeholder, borderWidth: alt ? 0 : 1, borderRadius: 3,
                    paddingVertical: 2, paddingHorizontal: 15, height: 28, backgroundColor: backColor,
                }]}>
                    <Text
                        style={{
                            textAlign: "center",
                            color: titleColor,
                            fontSize: 12,
                            fontWeight: "400"
                        }}>{this.props.title ? this.props.title : "Edit"}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}
