import {StyleSheet} from "react-native";
import ColorTheme from "./Colors";
import Constants from "./Constants";

class BaseStyles {

}

export class AppStyles extends BaseStyles {

}

export const StaticStyles = StyleSheet.create({
    flexOne: {
        flex: 1,
    },
    center: {
        justifyContent: "center",
        alignItems: "center",
    },
    lightFont: {
        fontWeight: "300"
    },
    regularFont: {
        fontWeight: "500"
    },
    heavyFont: {
        fontWeight: "700"
    },
    shadow: {
        shadowColor: ColorTheme.black,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },

    top_shadow: {
        shadowColor: ColorTheme.black,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    heading: {
        flex: 1,
        color: "black",
        fontWeight: "700",
        fontSize: 18,
    },
    text_grey: {
        flex: 1,
        color: "grey",
        fontWeight: "400",
        fontSize: 15,
    },
    nav_title: {
        fontWeight: "600",
        fontSize: Constants.navTitleFontSize,
        color: ColorTheme.textDark
    }
});
