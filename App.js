/**
 * Copyright (c) 2017-present, Viro, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @format
 */

import React, { Component } from 'react';
import {
	AppRegistry,
	View,
	StyleSheet,
	PixelRatio,
	TouchableHighlight,
	TouchableOpacity,
	Text,
	Dimensions,
} from 'react-native';

import {
	ViroVRSceneNavigator,
	ViroARSceneNavigator,
	ViroARScene,
} from 'react-viro';

/*
 TODO: Insert your API key below
 */
var sharedProps = {
	apiKey: 'API_KEY_HERE',
};

// Sets the default scene you want for AR and VR
var InitialARScene = require('./js/HelloWorldSceneAR');
var InitialVRScene = require('./js/HelloWorldScene');

var UNSET = 'UNSET';
var VR_NAVIGATOR_TYPE = 'VR';
var AR_NAVIGATOR_TYPE = 'AR';

// This determines which type of experience to launch in, or UNSET, if the user should
// be presented with a choice of AR or VR. By default, we offer the user a choice.
var defaultNavigatorType = UNSET;

//added by betsy
const { width, height } = Dimensions.get('window');
import uuid from 'uuid-random';

export default class ViroSample extends Component {
	constructor() {
		super();

		this.state = {
			navigatorType: defaultNavigatorType,
			sharedProps: sharedProps,

			//for camera flash
			flashMessage: false,
			videoUrl: null,
		};
		this._getExperienceSelector = this._getExperienceSelector.bind(this);
		this._getARNavigator = this._getARNavigator.bind(this);
		this._getVRNavigator = this._getVRNavigator.bind(this);
		this._getExperienceButtonOnPress = this._getExperienceButtonOnPress.bind(
			this
		);
		this._exitViro = this._exitViro.bind(this);

		//added by betsy
		this._setARNavigatorRef = this._setARNavigatorRef.bind(this);
		this._takeScreenshot = this._takeScreenshot.bind(this);
	}

	//added by betsy
	_setARNavigatorRef(ARNavigator) {
		this._arNavigator = ARNavigator;
	}

	async _takeScreenshot() {
		this._arNavigator
			._takeScreenshot('screenshot' + uuid(), true)
			.then((retDict) => {
				this.setState({
					videoUrl: 'file://' + retDict.url,
				});

				// this.props.addPhoto(this.state.videoUrl);
			});
	}

	//for camera flash
	onPress() {
		this.setState(
			{
				flashMessage: true,
			},
			() => {
				setTimeout(() => this.closeFlashMessage(), 3000);
			}
		);
	}

	closeFlashMessage() {
		this.setState({
			flashMessage: false,
		});
	}

	// Replace this function with the contents of _getVRNavigator() or _getARNavigator()
	// if you are building a specific type of experience.
	render() {
		if (this.state.navigatorType == UNSET) {
			return this._getExperienceSelector();
		} else if (this.state.navigatorType == VR_NAVIGATOR_TYPE) {
			return this._getVRNavigator();
		} else if (this.state.navigatorType == AR_NAVIGATOR_TYPE) {
			return this._getARNavigator();
		}
	}

	// Presents the user with a choice of an AR or VR experience
	_getExperienceSelector() {
		return (
			<View
				style={{
					width: width,
					height: height,
				}}
			>
				<View
					style={{
						position: 'absolute',
						top: 90,
						right: 0,
						bottom: 0,
						left: 0,
					}}
				>
					<ViroARSceneNavigator
						{...this.state.sharedProps}
						initialScene={{ scene: InitialARScene }}
						ref={this._setARNavigatorRef}
					/>
				</View>

				{/* screenshot */}
				<View
					key="screenshot_container"
					style={{
						flex: 1,
						position: 'absolute',
						flexDirection: 'row',
						justifyContent: 'center',
						alignItems: 'center',
						width: 58,
						height: 58,
						// top: 0,
						bottom: 25,

						transform: [{ translate: [80, 0, 0] }],
					}}
				>
					<TouchableOpacity
						key="camera_button"
						title="screenshot"
						onPress={() => {
							this._takeScreenshot();
							this.onPress();
						}}
						style={{ position: 'absolute', bottom: 25, right: 10 }}
					>
						<Text>📷</Text>
					</TouchableOpacity>
				</View>

				{/* for camera flash */}
				{this.state.flashMessage == true ? (
					<View
						style={{
							position: 'absolute',
							backgroundColor: 'green',
							width: '100%',
							justifyContent: 'center',
							alignItems: 'center',
							height: 40,
							bottom: 0,
						}}
					>
						<Text style={{ color: 'white' }}>Screenshot saved!</Text>
					</View>
				) : null}
			</View>
		);
	}

	// Returns the ViroARSceneNavigator which will start the AR experience
	_getARNavigator() {
		return (
			<ViroARSceneNavigator
				{...this.state.sharedProps}
				initialScene={{ scene: InitialARScene }}
			/>
		);
	}

	// Returns the ViroSceneNavigator which will start the VR experience
	_getVRNavigator() {
		return (
			<ViroVRSceneNavigator
				{...this.state.sharedProps}
				initialScene={{ scene: InitialVRScene }}
				onExitViro={this._exitViro}
			/>
		);
	}

	// This function returns an anonymous/lambda function to be used
	// by the experience selector buttons
	_getExperienceButtonOnPress(navigatorType) {
		return () => {
			this.setState({
				navigatorType: navigatorType,
			});
		};
	}

	// This function "exits" Viro by setting the navigatorType to UNSET.
	_exitViro() {
		this.setState({
			navigatorType: UNSET,
		});
	}
}

var localStyles = StyleSheet.create({
	viroContainer: {
		flex: 1,
		backgroundColor: 'black',
	},
	outer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'black',
	},
	inner: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		backgroundColor: 'black',
	},
	titleText: {
		paddingTop: 30,
		paddingBottom: 20,
		color: '#fff',
		textAlign: 'center',
		fontSize: 25,
	},
	buttonText: {
		color: '#fff',
		textAlign: 'center',
		fontSize: 20,
	},
	buttons: {
		height: 80,
		width: 150,
		paddingTop: 20,
		paddingBottom: 20,
		marginTop: 10,
		marginBottom: 10,
		backgroundColor: '#68a0cf',
		borderRadius: 10,
		borderWidth: 1,
		borderColor: '#fff',
	},
	exitButton: {
		height: 50,
		width: 100,
		paddingTop: 10,
		paddingBottom: 10,
		marginTop: 10,
		marginBottom: 10,
		backgroundColor: '#68a0cf',
		borderRadius: 10,
		borderWidth: 1,
		borderColor: '#fff',
	},
});

module.exports = ViroSample;
