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
import FastImage from "react-native-fast-image";
import {formatDate} from "../../../lib/DateUtil";
import {Rating} from "react-native-ratings";

const reviews = {
    "Code": 200,
    "Response": [
        {
            "food_id": 1,
            "food_name": "Chocolate Cookie",
            "last_review": {
                "name": "Sohrab Hussain",
                "image": undefined,
                "created_at": "2020-04-29T14:41:16.000000Z",
                "rating": 4,
                "review": "Voluptates cupiditate et modi ipsam ut. Omnis nihil quae architecto accusantium neque itaque natus illo. Cum quaerat aperiam est.",
            },
            "total_reviews": "10"
        },
        {
            "food_id": 2,
            "food_name": "Vanilla Cookie",
            "last_review": {
                "name": "Sohrab Hussain",
                "image": "https://b.zmtcdn.com/data/collections/e1d5e8f900dbca01d11f353ef4b6a97c_1581661395.jpg",
                "created_at": "2020-04-29T14:41:16.000000Z",
                "rating": 5,
                "review": "Voluptates cupiditate et modi ipsam ut. Omnis nihil quae architecto accusantium neque itaque natus illo. Cum quaerat aperiam est.",
            },
            "total_reviews": "60"
        },
        {
            "food_id": 3,
            "food_name": "Chocolate Pastry",
            "last_review": {
                "name": "Sohrab Hussain",
                "image": "https://b.zmtcdn.com/data/collections/e1d5e8f900dbca01d11f353ef4b6a97c_1581661395.jpg",
                "created_at": "2020-04-29T14:41:16.000000Z",
                "rating": 2.5,
                "review": "Voluptates cupiditate et modi ipsam ut. Omnis nihil quae architecto accusantium neque itaque natus illo. Cum quaerat aperiam est.",
            },
            "total_reviews": "5"
        },
        {
            "food_id": 4,
            "food_name": "Milkshake",
            "last_review": {
                "name": "Sohrab Hussain",
                "image": "https://b.zmtcdn.com/data/collections/e1d5e8f900dbca01d11f353ef4b6a97c_1581661395.jpg",
                "created_at": "2020-04-29T14:41:16.000000Z",
                "rating": 3,
                "review": "Voluptates cupiditate et modi ipsam ut. Omnis nihil quae architecto accusantium neque itaque natus illo. Cum quaerat aperiam est.",
            },
            "total_reviews": "140"
        },
        {
            "food_id": 5,
            "food_name": "Shawarma",
            "last_review": {
                "name": "Sohrab Hussain",
                "image": undefined,
                "created_at": "2020-04-29T14:41:16.000000Z",
                "rating": 3.5,
                "review": "Voluptates cupiditate et modi ipsam ut. Omnis nihil quae architecto accusantium neque itaque natus illo. Cum quaerat aperiam est.",
            },
            "total_reviews": "15"
        },
        {
            "food_id": 1,
            "food_name": "Chocolate Cookie",
            "last_review": {
                "name": "Sohrab Hussain",
                "image": "https://b.zmtcdn.com/data/collections/e1d5e8f900dbca01d11f353ef4b6a97c_1581661395.jpg",
                "created_at": "2020-04-29T14:41:16.000000Z",
                "rating": 4,
                "review": "Voluptates cupiditate et modi ipsam ut. Omnis nihil quae architecto accusantium neque itaque natus illo. Cum quaerat aperiam est.",
            },
            "total_reviews": "10"
        },
        {
            "food_id": 2,
            "food_name": "Vanilla Cookie",
            "last_review": {
                "name": "Sohrab Hussain",
                "image": undefined,
                "created_at": "2020-04-29T14:41:16.000000Z",
                "rating": 5,
                "review": "Voluptates cupiditate et modi ipsam ut. Omnis nihil quae architecto accusantium neque itaque natus illo. Cum quaerat aperiam est.",
            },
            "total_reviews": "60"
        },
        {
            "food_id": 3,
            "food_name": "Chocolate Pastry",
            "last_review": {
                "name": "Sohrab Hussain",
                "image": "https://b.zmtcdn.com/data/collections/e1d5e8f900dbca01d11f353ef4b6a97c_1581661395.jpg",
                "created_at": "2020-04-29T14:41:16.000000Z",
                "rating": 2.5,
                "review": "Voluptates cupiditate et modi ipsam ut. Omnis nihil quae architecto accusantium neque itaque natus illo. Cum quaerat aperiam est.",
            },
            "total_reviews": "5"
        },
        {
            "food_id": 4,
            "food_name": "Milkshake",
            "last_review": {
                "name": "Sohrab Hussain",
                "image": "https://b.zmtcdn.com/data/collections/e1d5e8f900dbca01d11f353ef4b6a97c_1581661395.jpg",
                "created_at": "2020-04-29T14:41:16.000000Z",
                "rating": 3,
                "review": "Voluptates cupiditate et modi ipsam ut. Omnis nihil quae architecto accusantium neque itaque natus illo. Cum quaerat aperiam est.",
            },
            "total_reviews": "140"
        },
        {
            "food_id": 5,
            "food_name": "Shawarma",
            "last_review": {
                "name": "Sohrab Hussain",
                "image": "https://b.zmtcdn.com/data/collections/e1d5e8f900dbca01d11f353ef4b6a97c_1581661395.jpg",
                "created_at": "2020-04-29T14:41:16.000000Z",
                "rating": 3.5,
                "review": "Voluptates cupiditate et modi ipsam ut. Omnis nihil quae architecto accusantium neque itaque natus illo. Cum quaerat aperiam est.",
            },
            "total_reviews": "15"
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

export default class Reviews extends Component<Props, State> {

    constructor(props) {
        super(props);
        this.state = {isLoading: false, notifications: reviews.Response}
    }

    componentDidMount(): void {
    }

    componentWillUnmount() {
    }

    ratingCompleted(rating) {
        console.log("Rating is: " + rating)
    }

    renderReview(item: any, index: number) {
        let review = item.last_review;
        return (<View style={{paddingHorizontal: Constants.defaultPadding}}>
            <RTLView locale={getCurrentLocale()} style={{alignItems: "center"}}>
                <Text style={[StaticStyles.heavyFont, {
                    textAlign: isRTLMode() ? "right" : "left",
                    color: ColorTheme.textDark,
                    fontSize: Constants.regularSmallFontSize
                }]}>
                    {item.food_name}
                </Text>
                <View style={{flex: 1}}/>
                <TouchableOpacity onPress={() => {
                    // this.setState({showFoodDetails: true, selectedFood: foodItem})
                }}>
                    <Text style={[StaticStyles.lightFont, {
                        textAlign: isRTLMode() ? "right" : "left",
                        color: ColorTheme.grey,
                        fontSize: Constants.regularSmallerFontSize
                    }]}>
                        {item.total_reviews + " " + strings("reviews")}
                    </Text>
                </TouchableOpacity>
                <View style={{width: Constants.defaultPaddingMin}}/>
                <AppIcon name={isRTLMode() ? "arrow_left" : "arrow_right"}
                         color={ColorTheme.grey}
                         provider={CommonIcons}
                         size={10}/>
            </RTLView>
            <View style={{height: Constants.defaultPadding}}/>
            <RTLView locale={getCurrentLocale()}>
                {review.image && review.image.length > 0 && <FastImage
                    style={{width: 40, height: 40, borderRadius: 5}}
                    source={{
                        uri: review.image,
                        priority: FastImage.priority.normal,
                    }}
                    onLoadStart={() => {
                    }}
                    onLoadEnd={() => {
                    }}
                />}
                {!review.image && <View style={{width: 40, height: 40, borderRadius: 5, backgroundColor: ColorTheme.lightGrey, alignItems: "center", justifyContent: "center"}}>
                    <AppIcon name={"default_user_male"}
                             color={ColorTheme.grey}
                             provider={CommonIcons}
                             size={25}/>
                </View>
                }
                <View style={{flex: 1, paddingHorizontal: Constants.defaultPadding}}>
                    <Text style={[StaticStyles.heavyFont, {
                        textAlign: isRTLMode() ? "right" : "left",
                        color: ColorTheme.textDark,
                        fontSize: Constants.regularSmallFontSize
                    }]}>
                        {review.name}
                    </Text>
                    <Text style={[StaticStyles.lightFont, {
                        textAlign: isRTLMode() ? "right" : "left",
                        color: ColorTheme.grey,
                        fontSize: Constants.regularSmallerFontSize
                    }]}>
                        {formatDate(review.created_at, Constants.dateFormat)}
                    </Text>
                    <RTLView locale={getCurrentLocale()} style={{alignItems: "center"}}>
                        <Text style={[StaticStyles.lightFont, {
                            textAlign: isRTLMode() ? "right" : "left",
                            color: ColorTheme.grey,
                            fontSize: Constants.regularSmallerFontSize
                        }]}>
                            {strings("rating") + " : "}
                        </Text>
                        <View style={{height: Constants.defaultPadding}}/>
                        <Rating
                            type='star'
                            ratingCount={5}
                            minValue={5}
                            readonly={true}
                            imageSize={10}
                            startingValue={review.rating}
                            onFinishRating={this.ratingCompleted}
                        />
                    </RTLView>
                    <View style={{height: Constants.defaultPadding}}/>
                </View>
            </RTLView>
            <Text
                style={[StaticStyles.regularFont, {
                    textAlign: isRTLMode() ? "right" : "left",
                    color: ColorTheme.textDark,
                    fontSize: Constants.regularSmallFontSize
                }]}>
                {review.review}
            </Text>
            <View style={{
                height: 1.5,
                backgroundColor: ColorTheme.lightGrey,
                marginVertical: Constants.defaultPaddingRegular
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
                        <TouchableOpacity onPress={() => {
                            this.props.navigation.goBack();
                        }}>
                            <AppIcon name={isRTLMode() ? "back_ar" : "back"}
                                     color={ColorTheme.appTheme}
                                     provider={CommonIcons}
                                     size={22}/>
                        </TouchableOpacity>
                        <View style={{flex: 1}}/>
                        <Text style={StaticStyles.nav_title}>{strings("customer_reviews")}</Text>
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
                            {this.renderReview(item, index)}
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
