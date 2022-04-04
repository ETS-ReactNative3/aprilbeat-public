const WebpackObfuscator = require("webpack-obfuscator");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    runtime: "edge",
    serverComponents: true,
  },
  webpack: (config, { dev, isServer }) => {
    if (!dev) {
      config.plugins.push(
        new WebpackObfuscator({
          controlFlowFlattening: true,
          controlFlowFlatteningThreshold: 0.5,
          deadCodeInjection: true,
          debugProtection: true,
          identifierNamesGenerator: "mangled",
          selfDefending: true,
          stringArrayEncoding: ['rc4', 'base64'],
        })
      );
    }

    return config;
  },
};

module.exports = nextConfig;
