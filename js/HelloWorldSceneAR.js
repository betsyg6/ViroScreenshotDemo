/** @format */

'use strict';

import React, { Component } from 'react';

import { StyleSheet } from 'react-native';

import {
	ViroARScene,
	ViroText,
	ViroConstants,
	ViroBox,
	ViroMaterials,
	Viro3DObject,
	ViroAmbientLight,
	ViroSpotLight,
} from 'react-viro';

export default class HelloWorldSceneAR extends Component {
	constructor() {
		super();

		// Set initial state here
		this.state = {
			text: 'Initializing AR...',
		};

		// bind 'this' to functions
		this._onInitialized = this._onInitialized.bind(this);
	}

	render() {
		return (
			<ViroARScene ref="arscene" onTrackingUpdated={this._onInitialized}>
				<ViroText
					text={this.state.text}
					scale={[0.5, 0.5, 0.5]}
					position={[0, 0, -1]}
					style={styles.helloWorldTextStyle}
				/>
				<ViroBox
					position={[0, -0.5, -1]}
					scale={[0.3, 0.3, 0.1]}
					materials={['grid']}
				/>
				<ViroAmbientLight color={'#aaaaaa'} />
				<ViroSpotLight
					innerAngle={5}
					outerAngle={90}
					direction={[0, -1, -0.2]}
					position={[0, 3, 1]}
					color="#ffffff"
					castsShadow={true}
				/>
				<Viro3DObject
					source={require('./res/emoji_smile/emoji_smile.vrx')}
					resources={[
						require('./res/emoji_smile/emoji_smile_diffuse.png'),
						require('./res/emoji_smile/emoji_smile_normal.png'),
						require('./res/emoji_smile/emoji_smile_specular.png'),
					]}
					position={[-0.5, 0.5, -1]}
					scale={[0.2, 0.2, 0.2]}
					type="VRX"
				/>
			</ViroARScene>
		);
	}

	_onInitialized(state, reason) {
		if (state == ViroConstants.TRACKING_NORMAL) {
			this.setState({
				text: 'Hello World!',
			});
		} else if (state == ViroConstants.TRACKING_NONE) {
			// Handle loss of tracking
		}
	}
}

var styles = StyleSheet.create({
	helloWorldTextStyle: {
		fontFamily: 'Arial',
		fontSize: 30,
		color: '#ffffff',
		textAlignVertical: 'center',
		textAlign: 'center',
	},
});

ViroMaterials.createMaterials({
	grid: {
		diffuseTexture: require('./res/grid_bg.jpg'),
	},
});

module.exports = HelloWorldSceneAR;
