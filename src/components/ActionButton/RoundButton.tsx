import React, {Component} from "react";
import {View} from "react-native";
import ColorTheme from "../../theme/Colors";
import {StaticStyles} from "../../theme/Styles";
import {AppIcon} from "../../common/IconUtils";
import {CommonIcons} from "../../icons/Common";
import Constants from "../../theme/Constants";
import {RTLView} from "react-native-rtl-layout";
import {getCurrentLocale} from "../Translations";
import {TouchableOpacity} from "react-native";

interface Props {
    image: string;
    onPress: Function;
}

interface State {
}

export default class RoundButton extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            isFavourite: newProps.isFavourite,
        });
    }

    render() {
        return (
            <TouchableOpacity onPress={() => {
                this.props.onPress()
            }}>
                <View style={[StaticStyles.center, {
                    borderRadius: 15,
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    paddingVertical: 2, paddingHorizontal: Constants.defaultPaddingMin,
                    width: 30,
                    height: 30
                }]}>
                    <RTLView locale={getCurrentLocale()} style={{alignItems: "center"}}>
                        <AppIcon name={this.props.image}
                                 color={ColorTheme.textDark}
                                 provider={CommonIcons}
                                 size={13}/>
                    </RTLView>
                </View>
            </TouchableOpacity>
        );
    }
}
