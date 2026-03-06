import createMDX from '@next/mdx'

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

export default withMDX({
  pageExtensions: ['ts', 'tsx', 'mdx'],
  // output: 'export',  // uncomment for fully static hosting
  // devIndicators: false, // uncomment to hide the next.js dev indicator in bottom left
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
})
