// Split from indicators/indicatorts-schema.mjs
// Part 5 of 10
// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-imports
// 78 routes (v2 max: 8) — needs splitting
// requiredLibraries: indicatorts
// Import: import * as indicators from 'indicatorts'
// Module-level code: 362 lines

export const main = {
    namespace: 'indicatorts',
    name: 'OHLCV Indicators (Part 5)',
    description: 'Compute 80+ technical analysis indicators from OHLCV data using the indicatorts library. Covers momentum (RSI, MACD, Stochastic), trend (SMA, EMA, Bollinger Bands, Ichimoku), volume (OBV, VWAP, MFI) indicators and their BUY/SELL/HOLD trading strategies. No external API — all computation is local.',
    version: '4.0.0',
    docs: ['https://github.com/cinar/indicatorts'],
    tags: ['trading', 'indicators', 'analysis', 'cacheTtlFrequent'],
    root: 'https://...',
    tools: {
        getKeltnerChannel: {
            method: 'GET',
            path: '/',
            description: 'Keltner Channel (KC): The keltnerChannel provides volatility-based bands that are placed on either side of an asset\'s price and can aid in determining the direction of a trend. Technical Description: Middle Line = EMA(period, closings); Upper Band = EMA(period, closings) + 2 * ATR(period, highs, lows, closings); Lower Band = EMA(period, closings) - 2 * ATR(period, highs, lows, closings)',
            parameters: [
                { position: { key: 'highs', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'lows', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'period', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['optional()', 'default(20)'] } }
            ],
            tests: [
                {
                    _description: 'Compute getKeltnerChannel with sample OHLCV data',
                    highs: '101,103,102,104,106,105,107,109,108,110,112,111,113,115,114,116,118,117,119,121',
                    lows: '99,101,100,102,104,103,105,107,106,108,110,109,111,113,112,114,116,115,117,119',
                    closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120'
                }
            ],
        },
        getMassIndex: {
            method: 'GET',
            path: '/',
            description: 'Mass Index (MI): The massIndex uses the high-low range to identify trend reversals based on range expansions. Technical Description: Singe EMA = EMA(9, Highs - Lows); Double EMA = EMA(9, Single EMA); Ratio = Single EMA / Double EMA; MI = Sum(25, Ratio)',
            parameters: [
                { position: { key: 'highs', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'lows', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'emaPeriod', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['optional()', 'default(9)'] } },
                { position: { key: 'miPeriod', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['optional()', 'default(25)'] } }
            ],
            tests: [
                {
                    _description: 'Compute getMassIndex with sample OHLCV data',
                    highs: '101,103,102,104,106,105,107,109,108,110,112,111,113,115,114,116,118,117,119,121',
                    lows: '99,101,100,102,104,103,105,107,106,108,110,109,111,113,112,114,116,115,117,119'
                }
            ],
        },
        getMoneyFlowIndex: {
            method: 'GET',
            path: '/',
            description: 'Money Flow Index (MFI): The moneyFlowIndex function analyzes both the closing price and the volume to measure to identify overbought and oversold states. It is similar to the Relative Strength Index (RSI), but it also uses the volume. Technical Description: Raw Money Flow = Typical Price * Volume; Money Ratio = Positive Money Flow / Negative Money Flow; Money Flow Index = 100 - (100 / (1 + Money Ratio))',
            parameters: [
                { position: { key: 'highs', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'lows', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'volumes', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'period', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['optional()', 'default(14)'] } }
            ],
            tests: [
                {
                    _description: 'Compute getMoneyFlowIndex with sample OHLCV data',
                    highs: '101,103,102,104,106,105,107,109,108,110,112,111,113,115,114,116,118,117,119,121',
                    lows: '99,101,100,102,104,103,105,107,106,108,110,109,111,113,112,114,116,115,117,119',
                    closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120',
                    volumes: '1000,1200,900,1100,1300,800,1000,1400,900,1200,1100,1000,1300,1500,800,1200,1000,1100,900,1400'
                }
            ],
        },
        getMoneyFlowIndexStrategy: {
            method: 'GET',
            path: '/',
            description: 'Money Flow Index Strategy: The moneyFlowIndexStrategy uses the mfi values that are generated by the Money Flow Index (MFI) indicator function to provide a SELL action when mfi is greather than or equal to 80, and a BUY action when mfi is less than or equal to 20. Technical Description: null',
            parameters: [
                { position: { key: 'asset', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'period', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['optional()', 'default(14)'] } }
            ],
            tests: [
                {
                    _description: 'Compute getMoneyFlowIndexStrategy with sample OHLCV data',
                    asset: '{"closings":[100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120],"highs":[101,103,102,104,106,105,107,109,108,110,112,111,113,115,114,116,118,117,119,121],"lows":[99,101,100,102,104,103,105,107,106,108,110,109,111,113,112,114,116,115,117,119],"openings":[100,101,102,102,104,105,105,107,108,108,110,111,111,113,114,114,116,117,117,119],"volumes":[1000,1200,900,1100,1300,800,1000,1400,900,1200,1100,1000,1300,1500,800,1200,1000,1100,900,1400]}'
                }
            ],
        },
        getMovingAverageConvergenceDivergence: {
            method: 'GET',
            path: '/',
            description: 'Moving Average Convergence Divergence (MACD): The macd function calculates a trend-following momentum indicator that shows the relationship between two moving averages of price. Technical Description: MACD = 12-Period EMA - 26-Period EMA.; Signal = 9-Period EMA of MACD.',
            parameters: [
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'fast', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['optional()', 'default(12)'] } },
                { position: { key: 'slow', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['optional()', 'default(26)'] } },
                { position: { key: 'signal', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['optional()', 'default(9)'] } }
            ],
            tests: [
                {
                    _description: 'Compute getMovingAverageConvergenceDivergence with sample OHLCV data',
                    closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120'
                }
            ],
        },
        getMovingAverageConvergenceDivergenceStrategy: {
            method: 'GET',
            path: '/',
            description: 'MACD Strategy: The macdStrategy uses the macd, and signal values that are generated by the Moving Average Convergence Divergence (MACD) indicator function to provide a BUY action when macd crosses above signal, and SELL action when macd crosses below signal. Technical Description: null',
            parameters: [
                { position: { key: 'asset', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'fast', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['optional()', 'default(12)'] } },
                { position: { key: 'slow', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['optional()', 'default(26)'] } },
                { position: { key: 'signal', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['optional()', 'default(9)'] } }
            ],
            tests: [
                {
                    _description: 'Compute getMovingAverageConvergenceDivergenceStrategy with sample OHLCV data',
                    asset: '{"closings":[100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120],"highs":[101,103,102,104,106,105,107,109,108,110,112,111,113,115,114,116,118,117,119,121],"lows":[99,101,100,102,104,103,105,107,106,108,110,109,111,113,112,114,116,115,117,119],"openings":[100,101,102,102,104,105,105,107,108,108,110,111,111,113,114,114,116,117,117,119],"volumes":[1000,1200,900,1100,1300,800,1000,1400,900,1200,1100,1000,1300,1500,800,1200,1000,1100,900,1400]}'
                }
            ],
        },
        getMovingChandeForecastOscillator: {
            method: 'GET',
            path: '/',
            description: 'Moving Chande Forecast Oscillator (MFCO): An oscillator that calculates the moving Chande Forecast Oscillator. Technical Description: null',
            parameters: [
                { position: { key: 'closings', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'period', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['optional()', 'default(4)'] } }
            ],
            tests: [
                {
                    _description: 'Compute getMovingChandeForecastOscillator with sample OHLCV data',
                    closings: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120'
                }
            ],
        },
        getMovingMax: {
            method: 'GET',
            path: '/',
            description: 'Moving Max (MMAX): The mmax function gives the maximum value within the given moving period. It can be used to get the moving maximum closing price and other values. Technical Description: null',
            parameters: [
                { position: { key: 'values', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'period', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['optional()', 'default(4)'] } }
            ],
            tests: [
                {
                    _description: 'Compute getMovingMax with sample OHLCV data',
                    values: '100,102,101,103,105,104,106,108,107,109,111,110,112,114,113,115,117,116,118,120'
                }
            ],
        }
    },
    requiredLibraries: ['indicatorts']
}


export const handlers = ( { sharedLists, libraries } ) => {
    const indicatorts = libraries['indicatorts']

    function getIndicator( functionName, data, params, routeName ) {
        if( functionName === 'priceRateOfChange' ) {
            data['closings'] = data['closings']
                .reduce( ( acc, n ) => {
                    if( n === 0 ) { return acc }
                    acc.push( n )
                    return acc
                }, [] )
        } else if( functionName === 'parabolicSar' ) {
            functionName = 'psar'
        } else if( functionName === 'bollingerBandsWidth' ) {
            const bbResult = indicatorts[ 'bollingerBands' ]( ...Object.values( data ) )
            const result = indicatorts[ functionName ]( bbResult, params ) 
            return result
        }
        const result = indicatorts[ functionName ]( ...Object.values( data ), params )
        return result 
    }
    const availableIndicators = {
    	getAbsolutePriceOscillator: {
    		validate: [["values"],["fast","slow"],["apo"]],
    		handler: ( data, params, routeName ) => getIndicator( 'absolutePriceOscillator', data, params, routeName ),
    	},
    	getAbsolutePriceOscillatorStrategy: {
    		validate: [["asset"],["fast","slow"],["actions"]],
    		handler: ( data, params, routeName ) => getIndicator( 'absolutePriceOscillatorStrategy', data, params, routeName ),
    	},
    	getAbsolutePriceOscillatorStrategy: {
    		validate: [["asset"],["fast","slow"],["actions"]],
    		handler: ( data, params, routeName ) => getIndicator( 'absolutePriceOscillatorStrategy', data, params, routeName ),
    	},
    	getAccelerationBands: {
    		validate: [["highs","lows","closings"],["period","multiplier"],["upper","middle","lower"]],
    		handler: ( data, params, routeName ) => getIndicator( 'accelerationBands', data, params, routeName ),
    	},
    	getAccelerationBandsStrategy: {
    		validate: [["asset"],["period","multiplier"],["actions"]],
    		handler: ( data, params, routeName ) => getIndicator( 'accelerationBandsStrategy', data, params, routeName ),
    	},
    	getAccumulationDistribution: {
    		validate: [["highs","lows","closings","volumes"],[],["ad"]],
    		handler: ( data, params, routeName ) => getIndicator( 'accumulationDistribution', data, params, routeName ),
    	},
    	getAroon: {
    		validate: [["highs","lows"],["period"],["up","down"]],
    		handler: ( data, params, routeName ) => getIndicator( 'aroon', data, params, routeName ),
    	},
    	getAroonStrategy: {
    		validate: [["asset"],["period"],["actions"]],
    		handler: ( data, params, routeName ) => getIndicator( 'aroonStrategy', data, params, routeName ),
    	},
    	getAroonStrategy: {
    		validate: [["asset"],["period"],["actions"]],
    		handler: ( data, params, routeName ) => getIndicator( 'aroonStrategy', data, params, routeName ),
    	},
    	getAverageTrueRange: {
    		validate: [["highs","lows","closings"],["period"],["trLine","atrLine"]],
    		handler: ( data, params, routeName ) => getIndicator( 'averageTrueRange', data, params, routeName ),
    	},
    	getAwesomeOscillator: {
    		validate: [["highs","lows"],["fast","slow"],["ao"]],
    		handler: ( data, params, routeName ) => getIndicator( 'awesomeOscillator', data, params, routeName ),
    	},
    	getAwesomeOscillatorStrategy: {
    		validate: [["asset"],["fast","slow"],["actions"]],
    		handler: ( data, params, routeName ) => getIndicator( 'awesomeOscillatorStrategy', data, params, routeName ),
    	},
    	getBalanceOfPower: {
    		validate: [["openings","highs","lows","closings"],[],["bop"]],
    		handler: ( data, params, routeName ) => getIndicator( 'balanceOfPower', data, params, routeName ),
    	},
    	getBalanceOfPowerStrategy: {
    		validate: [["asset"],[],["actions"]],
    		handler: ( data, params, routeName ) => getIndicator( 'balanceOfPowerStrategy', data, params, routeName ),
    	},
    	getBalanceOfPowerStrategy: {
    		validate: [["asset"],[],["actions"]],
    		handler: ( data, params, routeName ) => getIndicator( 'balanceOfPowerStrategy', data, params, routeName ),
    	},
    	getBollingerBands: {
    		validate: [["closings"],["period"],["upper","middle","lower"]],
    		handler: ( data, params, routeName ) => getIndicator( 'bollingerBands', data, params, routeName ),
    	},
    	getBollingerBandsStrategy: {
    		validate: [["asset"],["period"],["actions"]],
    		handler: ( data, params, routeName ) => getIndicator( 'bollingerBandsStrategy', data, params, routeName ),
    	},
    	getBollingerBandsWidth: {
    		validate: [["closings"],["period"],["width","widthEma"]],
    		handler: ( data, params, routeName ) => getIndicator( 'bollingerBandsWidth', data, params, routeName ),
    	},
    	getChaikinMoneyFlow: {
    		validate: [["highs","lows","closings","volumes"],["period"],["cmf"]],
    		handler: ( data, params, routeName ) => getIndicator( 'chaikinMoneyFlow', data, params, routeName ),
    	},
    	getChaikinMoneyFlowStrategy: {
    		validate: [["asset"],["period"],["actions"]],
    		handler: ( data, params, routeName ) => getIndicator( 'chaikinMoneyFlowStrategy', data, params, routeName ),
    	},
    	getChaikinOscillator: {
    		validate: [["highs","lows","closings","volumes"],["fast","slow"],["adResult","cmoResult"]],
    		handler: ( data, params, routeName ) => getIndicator( 'chaikinOscillator', data, params, routeName ),
    	},
    	getChandeForecastOscillator: {
    		validate: [["closings"],[],["cfo"]],
    		handler: ( data, params, routeName ) => getIndicator( 'chandeForecastOscillator', data, params, routeName ),
    	},
    	getChandeForecastOscillatorStrategy: {
    		validate: [["asset"],[],["actions"]],
    		handler: ( data, params, routeName ) => getIndicator( 'chandeForecastOscillatorStrategy', data, params, routeName ),
    	},
    	getChandeForecastOscillatorStrategy: {
    		validate: [["asset"],[],["actions"]],
    		handler: ( data, params, routeName ) => getIndicator( 'chandeForecastOscillatorStrategy', data, params, routeName ),
    	},
    	getChandelierExit: {
    		validate: [["highs","lows","closings"],["period"],["long","short"]],
    		handler: ( data, params, routeName ) => getIndicator( 'chandelierExit', data, params, routeName ),
    	},
    	getCommunityChannelIndex: {
    		validate: [["highs","lows","closings"],["period"],["cci"]],
    		handler: ( data, params, routeName ) => getIndicator( 'communityChannelIndex', data, params, routeName ),
    	},
    	getDonchianChannel: {
    		validate: [["closings"],["period"],["upper","middle","lower"]],
    		handler: ( data, params, routeName ) => getIndicator( 'donchianChannel', data, params, routeName ),
    	},
    	getDoubleExponentialMovingAverage: {
    		validate: [["values"],["period"],["dema"]],
    		handler: ( data, params, routeName ) => getIndicator( 'doubleExponentialMovingAverage', data, params, routeName ),
    	},
    	getEaseOfMovement: {
    		validate: [["highs","lows","volumes"],["period"],["emv"]],
    		handler: ( data, params, routeName ) => getIndicator( 'easeOfMovement', data, params, routeName ),
    	},
    	getEaseOfMovementStrategy: {
    		validate: [["asset"],["period"],["actions"]],
    		handler: ( data, params, routeName ) => getIndicator( 'easeOfMovementStrategy', data, params, routeName ),
    	},
    	getExponentialMovingAverage: {
    		validate: [["values"],["period"],["ema"]],
    		handler: ( data, params, routeName ) => getIndicator( 'exponentialMovingAverage', data, params, routeName ),
    	},
    	getForceIndex: {
    		validate: [["closings","volumes"],["period"],["fi"]],
    		handler: ( data, params, routeName ) => getIndicator( 'forceIndex', data, params, routeName ),
    	},
    	getForceIndexStrategy: {
    		validate: [["asset"],["period"],["actions"]],
    		handler: ( data, params, routeName ) => getIndicator( 'forceIndexStrategy', data, params, routeName ),
    	},
    	getIchimokuCloud: {
    		validate: [["highs","lows","closings"],["short","medium","long","close"],["tenkan","kijub","ssa","ssb","leadingSpan"]],
    		handler: ( data, params, routeName ) => getIndicator( 'ichimokuCloud', data, params, routeName ),
    	},
    	getIchimokuCloudStrategy: {
    		validate: [["asset"],["short","medium","long","close"],["actions"]],
    		handler: ( data, params, routeName ) => getIndicator( 'ichimokuCloudStrategy', data, params, routeName ),
    	},
    	getKdjStrategy: {
    		validate: [["asset"],["rPeriod","kPeriod","dPeriod"],["actions"]],
    		handler: ( data, params, routeName ) => getIndicator( 'kdjStrategy', data, params, routeName ),
    	},
    	getKdjStrategy: {
    		validate: [["asset"],["rPeriod","kPeriod","dPeriod"],["actions"]],
    		handler: ( data, params, routeName ) => getIndicator( 'kdjStrategy', data, params, routeName ),
    	},
    	getKeltnerChannel: {
    		validate: [["highs","lows","closings"],["period"],["upper","middle","lower"]],
    		handler: ( data, params, routeName ) => getIndicator( 'keltnerChannel', data, params, routeName ),
    	},
    	getMassIndex: {
    		validate: [["highs","lows"],["emaPeriod","miPeriod"],["mi"]],
    		handler: ( data, params, routeName ) => getIndicator( 'massIndex', data, params, routeName ),
    	},
    	getMoneyFlowIndex: {
    		validate: [["highs","lows","closings","volumes"],["period"],["mfi"]],
    		handler: ( data, params, routeName ) => getIndicator( 'moneyFlowIndex', data, params, routeName ),
    	},
    	getMoneyFlowIndexStrategy: {
    		validate: [["asset"],["period"],["actions"]],
    		handler: ( data, params, routeName ) => getIndicator( 'moneyFlowIndexStrategy', data, params, routeName ),
    	},
    	getMovingAverageConvergenceDivergence: {
    		validate: [["closings"],["fast","slow","signal"],["macdLine","signalLine"]],
    		handler: ( data, params, routeName ) => getIndicator( 'movingAverageConvergenceDivergence', data, params, routeName ),
    	},
    	getMovingAverageConvergenceDivergenceStrategy: {
    		validate: [["asset"],["fast","slow","signal"],["actions"]],
    		handler: ( data, params, routeName ) => getIndicator( 'movingAverageConvergenceDivergenceStrategy', data, params, routeName ),
    	},
    	getMovingChandeForecastOscillator: {
    		validate: [["closings"],["period"],["mfco"]],
    		handler: ( data, params, routeName ) => getIndicator( 'movingChandeForecastOscillator', data, params, routeName ),
    	},
    	getMovingMax: {
    		validate: [["values"],["period"],["mmax"]],
    		handler: ( data, params, routeName ) => getIndicator( 'movingMax', data, params, routeName ),
    	},
    	getMovingMin: {
    		validate: [["values"],["period"],["mmin"]],
    		handler: ( data, params, routeName ) => getIndicator( 'movingMin', data, params, routeName ),
    	},
    	getMovingStandardDeviation: {
    		validate: [["values"],["period"],["result"]],
    		handler: ( data, params, routeName ) => getIndicator( 'movingStandardDeviation', data, params, routeName ),
    	},
    	getMovingSum: {
    		validate: [["values"],["period"],["msum"]],
    		handler: ( data, params, routeName ) => getIndicator( 'movingSum', data, params, routeName ),
    	},
    	getNegativeVolumeIndex: {
    		validate: [["closings","volumes"],["start","period"],["nvi"]],
    		handler: ( data, params, routeName ) => getIndicator( 'negativeVolumeIndex', data, params, routeName ),
    	},
    	getNegativeVolumeIndexStrategy: {
    		validate: [["asset"],["start","period"],["actions"]],
    		handler: ( data, params, routeName ) => getIndicator( 'negativeVolumeIndexStrategy', data, params, routeName ),
    	},
    	getOnBalanceVolume: {
    		validate: [["closings","volumes"],[],["obv"]],
    		handler: ( data, params, routeName ) => getIndicator( 'onBalanceVolume', data, params, routeName ),
    	},
    	getParabolicSar: {
    		validate: [["highs","lows","closings"],["step","max"],["trends","psarResult"]],
    		handler: ( data, params, routeName ) => getIndicator( 'parabolicSar', data, params, routeName ),
    	},
    	getParabolicSARStrategy: {
    		validate: [["asset"],["step","max"],["actions"]],
    		handler: ( data, params, routeName ) => getIndicator( 'parabolicSARStrategy', data, params, routeName ),
    	},
    	getPercentagePriceOscillator: {
    		validate: [["prices"],["fast","slow","signal"],["ppoResult","signal","histogram"]],
    		handler: ( data, params, routeName ) => getIndicator( 'percentagePriceOscillator', data, params, routeName ),
    	},
    	getPercentageVolumeOscillator: {
    		validate: [["volumes"],["fast","slow","signal"],["pvoResult","signal","histogram"]],
    		handler: ( data, params, routeName ) => getIndicator( 'percentageVolumeOscillator', data, params, routeName ),
    	},
    	getPriceRateOfChange: {
    		validate: [["closings"],["period"],["roc"]],
    		handler: ( data, params, routeName ) => getIndicator( 'priceRateOfChange', data, params, routeName ),
    	},
    	getProjectionOscillator: {
    		validate: [["highs","lows","closings"],["period","smooth"],["poResult","spoResult"]],
    		handler: ( data, params, routeName ) => getIndicator( 'projectionOscillator', data, params, routeName ),
    	},
    	getProjectionOscillatorStrategy: {
    		validate: [["asset"],["period","smooth"],["actions"]],
    		handler: ( data, params, routeName ) => getIndicator( 'projectionOscillatorStrategy', data, params, routeName ),
    	},
    	getQstick: {
    		validate: [["openings","closings"],["period"],["qstick"]],
    		handler: ( data, params, routeName ) => getIndicator( 'qstick', data, params, routeName ),
    	},
    	getRandomIndex: {
    		validate: [["highs","lows","closings"],["rPeriod","kPeriod","dPeriod"],["k","d","j"]],
    		handler: ( data, params, routeName ) => getIndicator( 'randomIndex', data, params, routeName ),
    	},
    	getRelativeStrengthIndex: {
    		validate: [["closings"],["period"],["rsi"]],
    		handler: ( data, params, routeName ) => getIndicator( 'relativeStrengthIndex', data, params, routeName ),
    	},
    	getRollingMovingAverage: {
    		validate: [["values"],["period"],["rma"]],
    		handler: ( data, params, routeName ) => getIndicator( 'rollingMovingAverage', data, params, routeName ),
    	},
    	getRsi2Strategy: {
    		validate: [["asset"],[],["actions"]],
    		handler: ( data, params, routeName ) => getIndicator( 'rsi2Strategy', data, params, routeName ),
    	},
    	getSimpleMovingAverage: {
    		validate: [["values"],["period"],["sma"]],
    		handler: ( data, params, routeName ) => getIndicator( 'simpleMovingAverage', data, params, routeName ),
    	},
    	getSince: {
    		validate: [["values"],[],["since"]],
    		handler: ( data, params, routeName ) => getIndicator( 'since', data, params, routeName ),
    	},
    	getStochasticOscillator: {
    		validate: [["highs","lows","closings"],["kPeriod","dPeriod"],["k","d"]],
    		handler: ( data, params, routeName ) => getIndicator( 'stochasticOscillator', data, params, routeName ),
    	},
    	getStochasticOscillatorStrategy: {
    		validate: [["asset"],["kPeriod","dPeriod"],["actions"]],
    		handler: ( data, params, routeName ) => getIndicator( 'stochasticOscillatorStrategy', data, params, routeName ),
    	},
    	getTriangularMovingAverage: {
    		validate: [["values"],["period"],["trima"]],
    		handler: ( data, params, routeName ) => getIndicator( 'triangularMovingAverage', data, params, routeName ),
    	},
    	getTripleExponentialAverage: {
    		validate: [["values"],["period"],["trix"]],
    		handler: ( data, params, routeName ) => getIndicator( 'tripleExponentialAverage', data, params, routeName ),
    	},
    	getTripleExponentialMovingAverage: {
    		validate: [["values"],["period"],["tema"]],
    		handler: ( data, params, routeName ) => getIndicator( 'tripleExponentialMovingAverage', data, params, routeName ),
    	},
    	getTrueRange: {
    		validate: [["highs","lows","closings"],[],["result"]],
    		handler: ( data, params, routeName ) => getIndicator( 'trueRange', data, params, routeName ),
    	},
    	getTypicalPrice: {
    		validate: [["highs","lows","closings"],[],["typprice"]],
    		handler: ( data, params, routeName ) => getIndicator( 'typicalPrice', data, params, routeName ),
    	},
    	getTypicalPriceStrategy: {
    		validate: [["asset"],[],["actions"]],
    		handler: ( data, params, routeName ) => getIndicator( 'typicalPriceStrategy', data, params, routeName ),
    	},
    	getUlcerIndex: {
    		validate: [["closings"],["period"],["result"]],
    		handler: ( data, params, routeName ) => getIndicator( 'ulcerIndex', data, params, routeName ),
    	},
    	getVolumePriceTrend: {
    		validate: [["closings","volumes"],[],["vpt"]],
    		handler: ( data, params, routeName ) => getIndicator( 'volumePriceTrend', data, params, routeName ),
    	},
    	getVolumeWeightedAveragePrice: {
    		validate: [["closings","volumes"],["period"],["vwap"]],
    		handler: ( data, params, routeName ) => getIndicator( 'volumeWeightedAveragePrice', data, params, routeName ),
    	},
    	getVolumeWeightedAveragePriceStrategy: {
    		validate: [["asset"],["period"],["actions"]],
    		handler: ( data, params, routeName ) => getIndicator( 'volumeWeightedAveragePriceStrategy', data, params, routeName ),
    	},
    	getVolumeWeightedMovingAverage: {
    		validate: [["closings","volumes"],["period"],["vwma"]],
    		handler: ( data, params, routeName ) => getIndicator( 'volumeWeightedMovingAverage', data, params, routeName ),
    	},
    	getVolumeWeightedMovingAverageStrategy: {
    		validate: [["asset"],["period"],["actions"]],
    		handler: ( data, params, routeName ) => getIndicator( 'volumeWeightedMovingAverageStrategy', data, params, routeName ),
    	},
    	getVortex: {
    		validate: [["highs","lows","closings"],["period"],["plus","minus"]],
    		handler: ( data, params, routeName ) => getIndicator( 'vortex', data, params, routeName ),
    	},
    	getVortexStrategy: {
    		validate: [["asset"],["period"],["actions"]],
    		handler: ( data, params, routeName ) => getIndicator( 'vortexStrategy', data, params, routeName ),
    	},
    	getWilliamsR: {
    		validate: [["highs","lows","closings"],["period"],["willr"]],
    		handler: ( data, params, routeName ) => getIndicator( 'williamsR', data, params, routeName ),
    	},
    	getWilliamsRStrategy: {
    		validate: [["asset"],["period"],["actions"]],
    		handler: ( data, params, routeName ) => getIndicator( 'williamsRStrategy', data, params, routeName ),
    	}
    }
    const asset = {
        openings: [174060087.38879,174082898.8875936,174100153.56421843,174108592.70029056,174108073.85755652,173940776.5809026,173855038.04088858,173827303.93736708,173826777.1790663,174029399.594358,174086187.0741313,174170809.98403883,174176745.15932336,174194481.76776877,174258673.24893585,174316607.9053444,174344011.26589838,174344011.26648745,174192938.99197102,173896061.10363784,173873469.088895,173812410.16945913,173804695.39251307,173802489.8931474,173784622.98496273,173772265.04479375,173771037.48695257,173762313.21057478,173756232.131773,173751783.5620917,173745545.74319085,173752908.8941859,173744262.17871326,173733708.32261872,173733332.95199195,173753288.3215156,173751359.30583143,173750456.0907409,173855510.3958166,173855510.39640403,173910666.20618278,173924303.85632855,174025449.1938566,173955454.33147314,173860820.5666938,173850681.85198057,173847999.08108395,174007912.50842893,174007910.7239786,173925165.36047944],
        closings: [174082898.8875936,174100153.56421843,174108592.70029056,174108073.85755652,173940776.5809026,173855038.04088858,173827303.93736708,173826777.1790663,174029399.594358,174086187.0741313,174170809.98403883,174176745.15932336,174194481.76776877,174258673.24893585,174316607.9053444,174344011.26589838,174344011.26648745,174192938.99197102,173896061.10363784,173873469.088895,173812410.16945913,173804695.39251307,173802489.8931474,173784622.98496273,173772265.04479375,173771037.48695257,173762313.21057478,173756232.131773,173751783.5620917,173745545.74319085,173752908.8941859,173744262.17871326,173733708.32261872,173733332.95199195,173753288.3215156,173751359.30583143,173750456.0907409,173855510.3958166,173855510.39640403,173910666.20618278,173924303.85632855,174025449.1938566,173955454.33147314,173860820.5666938,173850681.85198057,173847999.08108395,174007912.50842893,174007910.7239786,173925165.36047944,174001913.66047117],
        highs:    [174082898.8875936,174100153.56421843,174108592.70029056,174108592.70029056,174108073.85755652,173940776.5809026,173855038.04088858,173827303.93736708,174029399.594358,174086187.0741313,174170809.98403883,174176745.15932336,174194481.76776877,174258673.24893585,174316607.9053444,174344011.26589838,174344011.26648745,174344011.26648745,174192938.99197102,173896061.10363784,173873469.088895,173812410.16945913,173804695.39251307,173802489.8931474,173784622.98496273,173772265.04479375,173771037.48695257,173762313.21057478,173756232.131773,173751783.5620917,173752908.8941859,173752908.8941859,173744262.17871326,173733708.32261872,173753288.3215156,173753288.3215156,173751359.30583143,173855510.3958166,173855510.39640403,173910666.20618278,173924303.85632855,174025449.1938566,174025449.1938566,173955454.33147314,173860820.5666938,173850681.85198057,174007912.50842893,174007913.7991547,174007910.7239786,174001913.66047117],
        lows:     [174060087.38879,174082898.8875936,174100153.56421843,174108073.85755652,173940776.5809026,173855038.04088858,173827303.93736708,173826777.1790663,173826777.1790663,174029399.594358,174086187.0741313,174170809.98403883,174176745.15932336,174194481.76776877,174258673.24893585,174316607.9053444,174344011.26589838,174192938.99197102,173896061.10363784,173873469.088895,173812410.16945913,173804695.39251307,173802489.8931474,173784622.98496273,173772265.04479375,173771037.48695257,173762313.21057478,173756232.131773,173751783.5620917,173745545.74319085,173745545.74319085,173744262.17871326,173733708.32261872,173733332.95199195,173733332.95199195,173751359.30583143,173750456.0907409,173750456.0907409,173855510.3958166,173855510.39640403,173910666.20618278,173924303.85632855,173955454.33147314,173860820.5666938,173850681.85198057,173847999.08108395,173847999.08108395,174007910.7239786,173925165.36047944,173925165.36047944],
        volumes:  [1896454.1787483797,1896454.1787483797,1896454.1787483797,1896454.1787483797,1896454.1787483797,1896454.1787483797,1896454.1787483797,1896454.1787483797,1896454.1787483797,1896454.1787483797,1896454.1787483797,1896454.1787483797,1896454.1787483797,1896454.1787483797,1896454.1787483797,1896454.1787483797,1896454.1787483797,1896454.1787483797,1896454.1787483797,1896454.1787483797,1896454.1787483797,1896454.1787483797,1896454.1787483797,1896454.1787483797,1896454.1787483797,1896454.1787483797,1896454.1787483797,1896454.1787483797,1896454.1787483797,1896454.1787483797,1896454.1787483797,1896454.1787483797,1896454.1787483797,1896454.1787483797,1896454.1787483797,1896454.1787483797,1896454.1787483797,1896454.1787483797,1896454.1787483797,1896454.1787483797,1896454.1787483797,1896454.1787483797,1896454.1787483797,1896454.1787483797,1896454.1787483797,1896454.1787483797,1896454.1787483797,1896454.1787483797,1896454.1787483797,1896454.1787483797],
        prices:   [174082898.8875936,174100153.56421843,174108592.70029056,174108073.85755652,173940776.5809026,173855038.04088858,173827303.93736708,173826777.1790663,174029399.594358,174086187.0741313,174170809.98403883,174176745.15932336,174194481.76776877,174258673.24893585,174316607.9053444,174344011.26589838,174344011.26648745,174192938.99197102,173896061.10363784,173873469.088895,173812410.16945913,173804695.39251307,173802489.8931474,173784622.98496273,173772265.04479375,173771037.48695257,173762313.21057478,173756232.131773,173751783.5620917,173745545.74319085,173752908.8941859,173744262.17871326,173733708.32261872,173733332.95199195,173753288.3215156,173751359.30583143,173750456.0907409,173855510.3958166,173855510.39640403,173910666.20618278,173924303.85632855,174025449.1938566,173955454.33147314,173860820.5666938,173850681.85198057,173847999.08108395,174007912.50842893,174007910.7239786,173925165.36047944,174001913.66047117],
        values:   [174082898.8875936,174100153.56421843,174108592.70029056,174108073.85755652,173940776.5809026,173855038.04088858,173827303.93736708,173826777.1790663,174029399.594358,174086187.0741313,174170809.98403883,174176745.15932336,174194481.76776877,174258673.24893585,174316607.9053444,174344011.26589838,174344011.26648745,174192938.99197102,173896061.10363784,173873469.088895,173812410.16945913,173804695.39251307,173802489.8931474,173784622.98496273,173772265.04479375,173771037.48695257,173762313.21057478,173756232.131773,173751783.5620917,173745545.74319085,173752908.8941859,173744262.17871326,173733708.32261872,173733332.95199195,173753288.3215156,173751359.30583143,173750456.0907409,173855510.3958166,173855510.39640403,173910666.20618278,173924303.85632855,174025449.1938566,173955454.33147314,173860820.5666938,173850681.85198057,173847999.08108395,174007912.50842893,174007910.7239786,173925165.36047944,174001913.66047117],
        dates:    ['2025-05-15T20:40:42.148Z','2025-05-15T20:40:42.149Z','2025-05-15T20:40:42.149Z','2025-05-15T20:40:42.149Z','2025-05-15T20:40:42.149Z','2025-05-15T20:40:42.149Z','2025-05-15T20:40:42.149Z','2025-05-15T20:40:42.149Z','2025-05-15T20:40:42.149Z','2025-05-15T20:40:42.149Z','2025-05-15T20:40:42.149Z','2025-05-15T20:40:42.149Z','2025-05-15T20:40:42.149Z','2025-05-15T20:40:42.149Z','2025-05-15T20:40:42.149Z','2025-05-15T20:40:42.149Z','2025-05-15T20:40:42.149Z','2025-05-15T20:40:42.149Z','2025-05-15T20:40:42.149Z','2025-05-15T20:40:42.149Z','2025-05-15T20:40:42.149Z','2025-05-15T20:40:42.149Z','2025-05-15T20:40:42.149Z','2025-05-15T20:40:42.149Z','2025-05-15T20:40:42.149Z','2025-05-15T20:40:42.149Z','2025-05-15T20:40:42.149Z','2025-05-15T20:40:42.149Z','2025-05-15T20:40:42.149Z','2025-05-15T20:40:42.149Z','2025-05-15T20:40:42.149Z','2025-05-15T20:40:42.149Z','2025-05-15T20:40:42.149Z','2025-05-15T20:40:42.149Z','2025-05-15T20:40:42.149Z','2025-05-15T20:40:42.149Z','2025-05-15T20:40:42.149Z','2025-05-15T20:40:42.149Z','2025-05-15T20:40:42.149Z','2025-05-15T20:40:42.149Z','2025-05-15T20:40:42.149Z','2025-05-15T20:40:42.149Z','2025-05-15T20:40:42.149Z','2025-05-15T20:40:42.149Z','2025-05-15T20:40:42.149Z','2025-05-15T20:40:42.149Z','2025-05-15T20:40:42.149Z','2025-05-15T20:40:42.149Z','2025-05-15T20:40:42.149Z','2025-05-15T20:40:42.149Z']
    }

    return {
        getKeltnerChannel: {
            executeRequest: async ( { struct, payload } ) => {
                const __routeName = 'getKeltnerChannel'
                const { userParams } = payload
                const [ input, p, outputs ] = availableIndicators[ __routeName ]['validate']

                const data = input
                .reduce( ( acc, key ) => { acc[ key ] = userParams[ key ]; return acc }, {} )
                const params = p
                .reduce( ( acc, key ) => { acc[ key ] = userParams[ key ]; return acc }, {} )
                const { handler } = availableIndicators[ __routeName ]
                struct['data'] = handler( data, params, __routeName )

                return { struct }
            }
        },
        getMassIndex: {
            executeRequest: async ( { struct, payload } ) => {
                const __routeName = 'getMassIndex'
                const { userParams } = payload
                const [ input, p, outputs ] = availableIndicators[ __routeName ]['validate']

                const data = input
                .reduce( ( acc, key ) => { acc[ key ] = userParams[ key ]; return acc }, {} )
                const params = p
                .reduce( ( acc, key ) => { acc[ key ] = userParams[ key ]; return acc }, {} )
                const { handler } = availableIndicators[ __routeName ]
                struct['data'] = handler( data, params, __routeName )

                return { struct }
            }
        },
        getMoneyFlowIndex: {
            executeRequest: async ( { struct, payload } ) => {
                const __routeName = 'getMoneyFlowIndex'
                const { userParams } = payload
                const [ input, p, outputs ] = availableIndicators[ __routeName ]['validate']

                const data = input
                .reduce( ( acc, key ) => { acc[ key ] = userParams[ key ]; return acc }, {} )
                const params = p
                .reduce( ( acc, key ) => { acc[ key ] = userParams[ key ]; return acc }, {} )
                const { handler } = availableIndicators[ __routeName ]
                struct['data'] = handler( data, params, __routeName )

                return { struct }
            }
        },
        getMoneyFlowIndexStrategy: {
            executeRequest: async ( { struct, payload } ) => {
                const __routeName = 'getMoneyFlowIndexStrategy'
                const { userParams } = payload
                const [ input, p, outputs ] = availableIndicators[ __routeName ]['validate']

                const data = input
                .reduce( ( acc, key ) => { acc[ key ] = userParams[ key ]; return acc }, {} )
                const params = p
                .reduce( ( acc, key ) => { acc[ key ] = userParams[ key ]; return acc }, {} )
                const { handler } = availableIndicators[ __routeName ]
                struct['data'] = handler( data, params, __routeName )

                return { struct }
            }
        },
        getMovingAverageConvergenceDivergence: {
            executeRequest: async ( { struct, payload } ) => {
                const __routeName = 'getMovingAverageConvergenceDivergence'
                const { userParams } = payload
                const [ input, p, outputs ] = availableIndicators[ __routeName ]['validate']

                const data = input
                .reduce( ( acc, key ) => { acc[ key ] = userParams[ key ]; return acc }, {} )
                const params = p
                .reduce( ( acc, key ) => { acc[ key ] = userParams[ key ]; return acc }, {} )
                const { handler } = availableIndicators[ __routeName ]
                struct['data'] = handler( data, params, __routeName )

                return { struct }
            }
        },
        getMovingAverageConvergenceDivergenceStrategy: {
            executeRequest: async ( { struct, payload } ) => {
                const __routeName = 'getMovingAverageConvergenceDivergenceStrategy'
                const { userParams } = payload
                const [ input, p, outputs ] = availableIndicators[ __routeName ]['validate']

                const data = input
                .reduce( ( acc, key ) => { acc[ key ] = userParams[ key ]; return acc }, {} )
                const params = p
                .reduce( ( acc, key ) => { acc[ key ] = userParams[ key ]; return acc }, {} )
                const { handler } = availableIndicators[ __routeName ]
                struct['data'] = handler( data, params, __routeName )

                return { struct }
            }
        },
        getMovingChandeForecastOscillator: {
            executeRequest: async ( { struct, payload } ) => {
                const __routeName = 'getMovingChandeForecastOscillator'
                const { userParams } = payload
                const [ input, p, outputs ] = availableIndicators[ __routeName ]['validate']

                const data = input
                .reduce( ( acc, key ) => { acc[ key ] = userParams[ key ]; return acc }, {} )
                const params = p
                .reduce( ( acc, key ) => { acc[ key ] = userParams[ key ]; return acc }, {} )
                const { handler } = availableIndicators[ __routeName ]
                struct['data'] = handler( data, params, __routeName )

                return { struct }
            }
        },
        getMovingMax: {
            executeRequest: async ( { struct, payload } ) => {
                const __routeName = 'getMovingMax'
                const { userParams } = payload
                const [ input, p, outputs ] = availableIndicators[ __routeName ]['validate']

                const data = input
                .reduce( ( acc, key ) => { acc[ key ] = userParams[ key ]; return acc }, {} )
                const params = p
                .reduce( ( acc, key ) => { acc[ key ] = userParams[ key ]; return acc }, {} )
                const { handler } = availableIndicators[ __routeName ]
                struct['data'] = handler( data, params, __routeName )

                return { struct }
            }
        }
    }
}
