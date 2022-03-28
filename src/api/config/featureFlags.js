require('dotenv').config()
const logger = require('./logger/logger')

function getFeatureFlagValueFromEnv(feature) {
  const SUFFIX = "FEATURE_FLAG"
  const environmentVariableName = feature?.concat('_', SUFFIX)
  return process.env[environmentVariableName] === 'enabled'
}

const featureNames = [
  'USE_DYNAMODB',
]

const features = Object.freeze(Object.fromEntries(featureNames.map((featureName) => [featureName, featureName])))

const featureFlags = new Map(featureNames.map((feature) => [feature, getFeatureFlagValueFromEnv(feature)]))

function getFeatureFlagValue(featureName) {
  if (!featureNames.includes(featureName)) {
    logger.info(`Received a request for feature flag value for feature: ${featureName}. This feature does not exist`)
  }
  return featureFlags.get(featureName)
}

module.exports = {
  features,
  getFeatureFlagValue,
}
