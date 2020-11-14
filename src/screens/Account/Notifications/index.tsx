import * as React from "react";
import {Component} from "react";
import {FlatList, StyleSheet, Text, View} from "react-native";
import ColorTheme from "../../../theme/Colors";
import {StaticStyles} from "../../../theme/Styles";
import Constants from "../../../theme/Constants";
import {RTLView} from "react-native-rtl-layout";
import {getCurrentLocale, isRTLMode, strings} from "../../../components/Translations";
import {TouchableOpacity} from "react-native";
import {AppIcon} from "../../../common/IconUtils";
import {CommonIcons} from "../../../icons/Common";
import {SafeAreaView} from "react-navigation";
import {formatDate} from "../../../lib/DateUtil";
import FeaturedImage from "../../../components/FeaturedImage";

const notifications = {
    "Code": 200,
    "Response": [
        {
            "id": 1,
            "title": "Didn't you deliver ?",
            "description": "Voluptates cupiditate et modi ipsam ut. Omnis nihil quae architecto accusantium neque itaque natus illo. Cum quaerat aperiam est.",
            "created_at": "2020-04-29T14:41:16.000000Z",
            "image": "https://b.zmtcdn.com/data/collections/e1d5e8f900dbca01d11f353ef4b6a97c_1581661395.jpg",
        },
        {
            "id": 2,
            "title": "Good Job",
            "description": "Ut quibusdam facere dolor soluta eum. Delectus iste omnis consequatur rerum repellendus. Quaerat iste quia quae non unde. Vero eaque quis architecto maxime et aliquam voluptate voluptas.",
            "created_at": "2020-04-29T14:41:16.000000Z",
            "image": "https://b.zmtcdn.com/data/collections/e1d5e8f900dbca01d11f353ef4b6a97c_1581661395.jpg",
        },
        {
            "id": 1,
            "title": "Hi John, Please ...",
            "description": "Ut quibusdam facere dolor soluta eum. Delectus iste omnis consequatur rerum repellendus. Quaerat iste quia quae non unde. Vero eaque quis architecto maxime et aliquam voluptate voluptas.",
            "created_at": "2020-04-29T14:41:16.000000Z",
            "image": "https://b.zmtcdn.com/data/collections/e1d5e8f900dbca01d11f353ef4b6a97c_1581661395.jpg",
        },
        {
            "id": 2,
            "title": "Floria Frenandas",
            "description": "Nulla maiores autem rerum id hic. Nulla voluptatem consequatur nisi atque eius mollitia a. Numquam quia adipisci autem eaque reiciendis consequatur similique. Omnis itaque facere itaque qui.",
            "created_at": "2020-04-29T14:41:16.000000Z",
            "image": "https://b.zmtcdn.com/data/collections/e1d5e8f900dbca01d11f353ef4b6a97c_1581661395.jpg",
        },
        {
            "id": 3,
            "title": "Nice food",
            "description": "Praesentium dolorem vel laudantium ducimus. Adipisci quos quo harum labore. Odit inventore repellendus quis. Laudantium ullam voluptatum reprehenderit tempore et dicta placeat ipsam.",
            "created_at": "2020-04-29T14:41:16.000000Z",
            "image": "https://b.zmtcdn.com/data/collections/e1d5e8f900dbca01d11f353ef4b6a97c_1581661395.jpg",
        },
        {
            "id": 1,
            "title": "Hi John, Please ...",
            "description": "Ut quibusdam facere dolor soluta eum. Delectus iste omnis consequatur rerum repellendus. Quaerat iste quia quae non unde. Vero eaque quis architecto maxime et aliquam voluptate voluptas.",
            "created_at": "2020-04-29T14:41:16.000000Z",
            "image": "https://b.zmtcdn.com/data/collections/e1d5e8f900dbca01d11f353ef4b6a97c_1581661395.jpg",
        },
        {
            "id": 2,
            "title": "Floria Frenandas",
            "description": "Nulla maiores autem rerum id hic. Nulla voluptatem consequatur nisi atque eius mollitia a. Numquam quia adipisci autem eaque reiciendis consequatur similique. Omnis itaque facere itaque qui.",
            "created_at": "2020-04-29T14:41:16.000000Z",
            "image": "https://b.zmtcdn.com/data/collections/e1d5e8f900dbca01d11f353ef4b6a97c_1581661395.jpg",
        },
        {
            "id": 3,
            "title": "Nice food",
            "description": "Praesentium dolorem vel laudantium ducimus. Adipisci quos quo harum labore. Odit inventore repellendus quis. Laudantium ullam voluptatum reprehenderit tempore et dicta placeat ipsam.",
            "created_at": "2020-04-29T14:41:16.000000Z",
            "image": "https://b.zmtcdn.com/data/collections/e1d5e8f900dbca01d11f353ef4b6a97c_1581661395.jpg",
        },
    ]
};

interface Props {
    navigation: any;
}

interface State {
    isLoading: boolean;
    notifications: any[];
}

export default class Notifications extends Component<Props, State> {

    constructor(props) {
        super(props);
        this.state = {isLoading: false, notifications: notifications.Response}
    }

    componentDidMount(): void {
    }

    componentWillUnmount() {
    }

    renderNotification(notification: any, index: number) {
        return (<View style={{}}>
            <TouchableOpacity onPress={() => {
                // this.setState({showFoodDetails: true, selectedFood: foodItem})
            }}>
                <RTLView locale={getCurrentLocale()}
                         style={{paddingHorizontal: Constants.defaultPadding}}>
                    {notification.id === 1 && <View style={{borderRadius: 15, overflow: "hidden"}}>
                        <FeaturedImage width={30} height={30} uri={notification.image}/>
                    </View>
                    }
                    {notification.id === 2 && <AppIcon name={"message"}
                                                       color={ColorTheme.appTheme}
                                                       provider={CommonIcons}
                                                       size={20}/>
                    }
                    <View style={{flex: 1, paddingHorizontal: Constants.defaultPadding}}>
                        <Text style={[StaticStyles.heavyFont, {
                            textAlign: isRTLMode() ? "right" : "left",
                            color: ColorTheme.appTheme,
                            fontSize: Constants.regularSmallFontSize
                        }]}>
                            {notification.title}
                        </Text>
                        <Text style={[StaticStyles.lightFont, {
                            textAlign: isRTLMode() ? "right" : "left",
                            color: ColorTheme.grey,
                            fontSize: Constants.regularSmallerFontSize
                        }]}>
                            {formatDate(notification.created_at, Constants.dateFormat)}
                        </Text>
                        <View style={{height: Constants.defaultPadding}}/>
                        <Text
                            style={[StaticStyles.regularFont, {
                                textAlign: isRTLMode() ? "right" : "left",
                                color: ColorTheme.textDark,
                                fontSize: Constants.regularSmallFontSize
                            }]}>
                            {notification.description}
                        </Text>
                    </View>
                    <AppIcon name={"more_horizontal"}
                             color={ColorTheme.grey}
                             provider={CommonIcons}
                             size={18}/>
                </RTLView>
            </TouchableOpacity>
            <View style={{
                height: 1.5,
                backgroundColor: ColorTheme.lightGrey,
                marginHorizontal: Constants.defaultPadding,
                marginVertical: Constants.defaultPadding
            }}/>
        </View>);
    }

    renderHeader() {
        return (
            <View style={{
                backgroundColor: ColorTheme.white
            }}>
                <View style={{
                    paddingHorizontal: Constants.defaultPaddingRegular,
                }}>
                    <View style={{height: Constants.defaultPadding}}/>
                    <RTLView locale={getCurrentLocale()}>
                        <TouchableOpacity style={{padding: Constants.defaultPadding}} onPress={() => {
                            this.props.navigation.goBack();
                        }}>
                            <AppIcon name={isRTLMode() ? "back_ar" : "back"}
                                     color={ColorTheme.appTheme}
                                     provider={CommonIcons}
                                     size={22}/>
                        </TouchableOpacity>
                        <View style={{flex: 1}}/>
                        <Text style={StaticStyles.nav_title}>{strings("notifications")}</Text>
                        <View style={{flex: 1}}/>
                    </RTLView>
                    <View style={{height: Constants.defaultPaddingRegular}}/>
                </View>
                <View style={{height: 2, backgroundColor: ColorTheme.lightGrey}}/>
            </View>
        );
    }

    render() {
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: ColorTheme.white}}>
                {this.renderHeader()}
                <FlatList
                    horizontal={false}
                    style={[StaticStyles.flexOne, {
                        paddingVertical: 0,
                        marginTop: Constants.defaultPadding,
                        marginBottom: 70
                    }]}
                    data={this.state.notifications}
                    renderItem={({item, index}) =>
                        <TouchableOpacity onPress={() => {
                        }}>
                            {this.renderNotification(item, index)}
                        </TouchableOpacity>
                    }
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => "" + index}
                />
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: ColorTheme.appThemeLight},
    language: {
        paddingTop: 10,
        textAlign: 'center',
    },
});
