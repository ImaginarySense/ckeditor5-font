/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module font/fontsize/utils
 */

/**
 * Normalizes and translates the {@link module:font/fontsize~FontSizeConfig#options configuration options}
 * to the {@link module:font/fontsize~FontSizeOption} format.
 *
 * @param {Array.<String|Number|Object>} configuredOptions An array of options taken from the configuration.
 * @returns {Array.<module:font/fontsize~FontSizeOption>}
 */
export function normalizeOptions( configuredOptions, configuredUnit ) {
	// Convert options to objects.
	return configuredOptions
		.map( getOptionDefinition, {
			unit: configuredUnit
		} )
		// Filter out undefined values that `getOptionDefinition` might return.
		.filter( option => !!option );
}

// Default named presets map.
const namedPresets = {
	tiny: {
		title: 'Tiny',
		model: 'tiny',
		view: {
			name: 'span',
			classes: 'text-tiny',
			priority: 5
		}
	},
	small: {
		title: 'Small',
		model: 'small',
		view: {
			name: 'span',
			classes: 'text-small',
			priority: 5
		}
	},
	big: {
		title: 'Big',
		model: 'big',
		view: {
			name: 'span',
			classes: 'text-big',
			priority: 5
		}
	},
	huge: {
		title: 'Huge',
		model: 'huge',
		view: {
			name: 'span',
			classes: 'text-huge',
			priority: 5
		}
	}
};

// Returns an option definition either from preset or creates one from number shortcut.
// If object is passed then this method will return it without alternating it. Returns undefined for item than cannot be parsed.
//
// @param {String|Number|Object} item
// @returns {undefined|module:font/fontsize~FontSizeOption}
function getOptionDefinition( option ) {
	// Treat any object as full item definition provided by user in configuration.
	if ( typeof option === 'object' ) {
		return option;
	}

	// Item is a named preset.
	if ( namedPresets[ option ] ) {
		return namedPresets[ option ];
	}

	// 'Default' font size. It will be used to remove the fontSize attribute.
	if ( option === 'default' ) {
		return {
			model: undefined,
			title: 'Default'
		};
	}

	// Default unit. 'px' will be used when no other value is specified.
	const unitPreset = ( this.unit === undefined ) ? 'px' : this.unit;

	// At this stage we probably have numerical value to generate a preset so parse it's value.
	const sizeLabel = option;
	const sizePreset = parseFloat( sizeLabel );

	// Discard any faulty size values.
	if ( isNaN( sizePreset ) ) {
		return;
	}

	// Discard any faulty unit values.
	const allowedUnits = [ 'px', 'pt', 'pc', 'cm', 'mm', 'in', 'em', 'ch', 'rem', 'ex', 'vw', 'vh', 'vmin', 'vmax', '%' ];
	if ( allowedUnits.indexOf( unitPreset ) === -1 ) {
		return;
	}

	// Return font size definition from size value.
	return generatePreset( sizeLabel, sizePreset, unitPreset );
}

// Creates a predefined preset for specified unit size.
//
// @param {String|Number, Number, String} label, Font size and unit.
// @returns {module:font/fontsize~FontSizeOption}
function generatePreset( label, size, unit ) {
	const sizeName = String( label );

	return {
		title: sizeName,
		model: size,
		unit: unit,
		view: {
			name: 'span',
			styles: {
				'font-size': `${ size }${ unit }`
			},
			priority: 5
		}
	};
}
