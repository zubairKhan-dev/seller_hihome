import * as React from "react";
import {Component} from "react";
import {StyleSheet, Text, View} from "react-native";
import {StaticStyles} from "../../theme/Styles";
import NavigationBar from "../../components/NavigationBar";
// import MapView from "react-native-maps";
import {windowHeight, windowWidth} from "../../common";
import ColorTheme from "../../theme/Colors";
import Constants from "../../theme/Constants";
import {CommonIcons} from "../../icons/Common";
import {AppIcon} from "../../common/IconUtils";
import LoadingOverlay from "../../components/Loading";
import {XEvents} from "../../lib/EventBus";
import Events from "react-native-simple-events";
import {TouchableOpacity} from "react-native";

const latitudeDelta = 0.025;
const longitudeDelta = 0.025;

interface Props {
    navigation: any;
}

interface State {
    region: any;
    loading: boolean;
}

export default class UserLocation extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            region: {
                latitudeDelta: latitudeDelta,
                longitudeDelta:longitudeDelta,
                latitude: 25.1972,
                longitude: 55.2744
            }
        }
    }

    getReverseGeoCoding() {
        this.setState({
            loading: true,
        });
        let coordinates: string = "";
        coordinates = coordinates + this.state.region.latitude + "+" + this.state.region.longitude;
        let url = `https://api.opencagedata.com/geocode/v1/json?q=${coordinates}&key=6caf4f7794364257a0c0e7dc4a3efcdf`;
        console.log(JSON.stringify(url));
        console.log("==========================");
        fetch(url)
            .then(response => response.json())
            .then((responseJson)=> {
                console.log(JSON.stringify(responseJson));
                this.props.navigation.pop();
                Events.trigger(XEvents.UPDATE_USER_ADDRESS, {address: responseJson});
                this.setState({
                    loading: false,
                })
            })
            .catch(error=> {console.log(error);
                this.setState({
                    loading: false,
                })})
    }

    onRegionChange = region => {
        this.setState({
            region
        });

    };

    componentDidMount(): void {

    }

    render() {
        const {region} = this.state;
        return (
            <View style={styles.container}>
                <View style={[StaticStyles.flexOne]}>
                    {/*<MapView*/}
                    {/*    style={{flex: 1, width: windowWidth, height: windowHeight}}*/}
                    {/*    initialRegion={region}*/}
                    {/*    showsUserLocation={true}*/}
                    {/*    onRegionChangeComplete={this.onRegionChange}*/}
                    {/*>*/}
                    {/*</MapView>*/}
                    <View style={{
                        position: "absolute",
                        marginHorizontal: Constants.defaultPaddingMax,
                        bottom: Constants.defaultPaddingMax
                    }}>
                        <TouchableOpacity
                            onPress={() => {
                                this.getReverseGeoCoding();
                            }}>
                            <View style={{width: windowWidth - 60, borderRadius: 5, height: 30}}>
                                <View style={[styles.container, StaticStyles.shadow, {
                                    backgroundColor: ColorTheme.appTheme,
                                    maxWidth: 400,
                                    borderRadius: 5,
                                    justifyContent: "center"
                                }]}>
                                    <View style={{width: Constants.defaultPadding}}/>
                                    <Text style={[StaticStyles.regularFont, {
                                        textAlign: "center",
                                        color: ColorTheme.white
                                    }]}>{"Set Location"}</Text>
                                    <View style={{width: Constants.defaultPadding}}/>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.markerFixed}>
                        <AppIcon name={"map_pin"}
                                 color={ColorTheme.black}
                                 provider={CommonIcons}
                                 size={40}/>
                    </View>
                </View>
                {this.state.loading && <LoadingOverlay/>}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    markerFixed: {
        left: '50%',
        marginLeft: -24,
        marginTop: -48,
        position: 'absolute',
        top: '50%'
    },
});
