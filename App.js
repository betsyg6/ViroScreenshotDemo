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
import { View, TouchableOpacity, Text, Dimensions } from 'react-native';

import { ViroARSceneNavigator } from 'react-viro';

/*
 TODO: Insert your API key below
 */
var sharedProps = {
	apiKey: 'API_KEY_HERE',
};

// Sets the default scene you want for AR and VR
var InitialARScene = require('./js/HelloWorldSceneAR');


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


	render() {

		return (
			<View
				style={{
					width: width,
					height: height,
				}}
      >
        {/* for the AR scene to render */}
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
}

module.exports = ViroSample;
