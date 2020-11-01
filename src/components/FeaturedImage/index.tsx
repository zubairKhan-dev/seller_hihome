import React, {Component} from "react";
import {Image, View, ActivityIndicator} from "react-native";
import ColorTheme from "../../theme/Colors";

interface Props {
    uri?: string,
    width?: number,
    height?: number
}

interface State {
    loading?: boolean;
}

export default class FeaturedImage extends Component <Props, State> {
    constructor(props) {
        super(props);
        this.state = {loading: true};
    }

    render() {
        return (
            <View style={{alignItems: "center", justifyContent: "center", }}>
                <Image style={{width: this.props.width, height: this.props.height, resizeMode: "cover"}}
                       source={{uri: this.props.uri}}
                       onLoadStart={() => this.setState({loading: true})}
                       onLoadEnd={() => this.setState({loading: false})}/>
                {this.state.loading &&
                <ActivityIndicator size={"small"} style={{position: "absolute", transform: [{scale: 0.65}]}}
                                   color={ColorTheme.appTheme}/>}
            </View>
        );

    }
}

