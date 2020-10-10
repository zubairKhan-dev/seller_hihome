import React from "react";
import Svg, {G, Use} from "react-native-svg";
import Icon from "react-native-vector-icons/MaterialIcons";
import {CommonIcons} from "../icons/Common";
import {isAppRTL} from "../lib/user";

const DefaultProviders = [CommonIcons];

export interface IconOptions {
    width?: string | number;
    height?: string | number;
    scale?: number;
}

export function selectIcon(id: string, iconSource: any) {
    if (iconSource instanceof Array) {
        for (let source of iconSource) {
            if (source.hasOwnProperty(id)) {
                return source[id];
            }
        }
    } else {
        if (iconSource.hasOwnProperty(id)) {
            return iconSource[id];
        }
    }
    return undefined;
}

export function WrapIcon(Symbol, options: IconOptions = undefined) {
    const opts = {width: "100%", height: "100%", scale: 1, ...options};
    const {width, height, scale} = opts;
    let symbol = Symbol;
    if (symbol instanceof Function)
        symbol = symbol();
    return (
        <Svg width={width} height={height} >
            {symbol}
            <G scale={scale}>
                <Use href="#icon" width="100%" height="100%"/>
            </G>
        </Svg>
    );
}

export function AppIcon(props: { name: string, color?: string, provider?: any, size: string | number, fallback?: string, options?: IconOptions, isSelected?: boolean }) {
    const {name, color, provider, size, options, fallback, isSelected} = props;
    let icOpts = options;
    if (options == undefined) {
        icOpts = {...options, width: size, height: size};
    } else {
        if (icOpts.height == undefined) icOpts.height = size;
        if (icOpts.width == undefined) icOpts.width = size;
    }
    let source = provider != undefined ? provider : DefaultProviders;
    let icon = selectIcon(name, source);
    if (icon)
        return WrapIcon(icon({color: color, isSelected: isSelected}), icOpts);
    if (fallback) {
        icon = selectIcon(fallback, source);
        if (icon)
            return WrapIcon(icon({color: color, isSelected: isSelected}), icOpts);
    }
    return undefined;
}


export function RTLAppIcon(props: { name: string, color?: string, provider?: any, size: string | number, fallback?: string, options?: IconOptions, isSelected?: boolean }) {
    const {name, color, provider, size, options, fallback, isSelected} = props;
    let icOpts = options;
    if (options == undefined) {
        icOpts = {...options, width: size, height: size};
    } else {
        if (icOpts.height == undefined) icOpts.height = size;
        if (icOpts.width == undefined) icOpts.width = size;
    }
    let source = provider != undefined ? provider : DefaultProviders;
    let icon = selectIcon(name, source);
    if (icon)
        return RTLWrapIcon(icon({color: color, isSelected: isSelected}), icOpts);
    if (fallback) {
        icon = selectIcon(fallback, source);
        if (icon)
            return RTLWrapIcon(icon({color: color, isSelected: isSelected}), icOpts);
    }
    return undefined;
}


export function RTLWrapIcon(Symbol, options: IconOptions = undefined) {
    let rtlValue = isAppRTL();
    const opts = {width: "100%", height: "100%", scale: 1, ...options};
    const {width, height, scale} = opts;
    let symbol = Symbol;
    if (symbol instanceof Function)
        symbol = symbol();
    if (rtlValue) {
        return (
            <Svg width={width} height={height} style={[{transform: [{rotate: "180deg"}]}]}>
                {symbol}
                <G scale={scale}>
                    <Use href="#icon" width="100%" height="100%"/>
                </G>
            </Svg>
        );
    } else {
        return (
            <Svg width={width} height={height} style={[{transform: [{rotate: "0deg"}]}]}>
                {symbol}
                <G scale={scale}>
                    <Use href="#icon" width="100%" height="100%"/>
                </G>
            </Svg>
        );
    }

}

export function ListArrow(props) {
    return <Icon name="arrow-drop-up"
                 style={[{transform: [{rotate: "270deg"}]}]}
                 color={"#9f9f9f"}
                 size={20} {...props}/>;
}
