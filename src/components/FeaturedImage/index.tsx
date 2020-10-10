import React, {Component} from "react";
import {View} from "react-native";
import FastImage from "react-native-fast-image";
import ActivityIndicator from "../Loading/ActivityIndicator";

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
            <View>
                <FastImage
                    style={{width: this.props.width, height: this.props.height}}
                    source={{
                        uri: this.props.uri,
                        priority: FastImage.priority.normal,
                    }}
                    onLoadStart={() => {
                        this.setState({loading: true})
                    }}
                    onLoadEnd={() => {
                        this.setState({loading: false})
                    }}
                />
                {this.state.loading && <ActivityIndicator/>}
            </View>
        );

    }
}

